export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    const text =
      data.output?.[0]?.content?.[0]?.text ||
      "AI tidak merespons";

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ reply: "Server error" });
  }
}
