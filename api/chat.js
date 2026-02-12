export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Kamu adalah AI asisten bernama Destro AI." },
          { role: "user", content: message }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ reply: JSON.stringify(data) });
    }

    const text = data.choices?.[0]?.message?.content || "AI tidak merespons";

    res.status(200).json({ reply: text });

  } catch (error) {
    res.status(500).json({ reply: "Server error: " + error.message });
  }
}
