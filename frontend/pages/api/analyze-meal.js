export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "No image provided" });
    }

    // Optional guard: reject >8MB payloads
    const approxBytes = Math.ceil((imageBase64.length * 3) / 4);
    if (approxBytes > 8 * 1024 * 1024) {
      return res.status(413).json({ error: "Image too large. Please use a smaller photo." });
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a concise performance nutrition coach. Analyze meal images, identify real foods (ignore plates/utensils), estimate total calories and rough macros, and give 1-2 short coaching notes.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Analyze this meal image. Return strict JSON with keys: meal, items (array of {name, confidence_0to1, grams_estimate}), calories_kcal, macros {protein_g, carbs_g, fat_g}, coaching (short string).",
              },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
      }),
    });

    const json = await resp.json();

    // Surface OpenAI errors clearly
    if (!resp.ok) {
      console.error("OpenAI error", json);
      return res.status(500).json({
        error: "OpenAI error",
        details: json?.error?.message || "Unknown error from AI",
      });
    }

    // choices[0].message.content should be JSON (because response_format json_object)
    let data;
    try {
      data = JSON.parse(json.choices?.[0]?.message?.content || "{}");
    } catch {
      // Fallback: return raw text if not JSON
      return res.status(200).json({
        ok: true,
        raw: json.choices?.[0]?.message?.content || "",
      });
    }

    return res.status(200).json({ ok: true, analysis: data });
  } catch (e) {
    console.error("Server error", e);
    return res.status(500).json({ error: "Server failed to analyze image" });
  }
}
