export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a fitness AI. Analyze food images and estimate calories + macros realistically."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this meal image. Identify the food, total calories, macros, and health rating." },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ]
      })
    });

    const json = await openaiResponse.json();
    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
}
