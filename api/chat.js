export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message kosong" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI Error:", errorText);
      return res.status(500).json({ reply: "OpenAI error" });
    }

    const data = await response.json();

    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    // Ambil text dengan aman
    let text = "AI tidak merespons";

    if (data.output && data.output.length > 0) {
      for (const item of data.output) {
        if (item.content) {
          for (const content of item.content) {
            if (content.type === "output_text") {
              text = content.text;
            }
          }
        }
      }
    }

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ reply: "Server error" });
  }
}
