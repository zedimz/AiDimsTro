export default async function handler(req, res) {
  try {
    const { message } = req.body;

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

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        reply: "OPENAI ERROR: " + JSON.stringify(data)
      });
    }

    const text =
      data.output?.[0]?.content?.[0]?.text ||
      "AI tidak merespons";

    res.status(200).json({ reply: text });

  } catch (error) {
    res.status(500).json({
      reply: "SERVER ERROR: " + error.message
    });
  }
}
