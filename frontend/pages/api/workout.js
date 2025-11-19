import { doc, setDoc } from "firebase/firestore/lite";
import { serverDb } from "../../lib/firebaseServer";
import { enforceAiQuota, requireUserFromRequest } from "../../lib/serverAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await requireUserFromRequest(req);
    const quota = await enforceAiQuota(user.uid, user.planTier);
    if (!quota.allowed) {
      return res.status(429).json({ error: `Daily AI limit reached (${quota.limit}). Upgrade for unlimited plans.` });
    }

    const { experience, equipment, days, focus, notes } = req.body || {};
    if (!experience || !equipment || !days || !focus) {
      return res.status(400).json({ error: "Missing experience, equipment, days, or focus" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "You are SnapFIT, an elite strength coach. Return JSON workout blueprints with daily splits and focus.",
          },
          {
            role: "user",
            content: `Experience: ${experience}. Equipment: ${equipment}. Days: ${days}. Focus: ${focus}. Notes: ${notes || "none"}. Return JSON {summary,days,sessions:[{day,title,focus,topSets,blocks}]}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "OpenAI error");
    }
    let plan;
    try {
      plan = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch {
      throw new Error("AI returned invalid workout plan");
    }

    await setDoc(
      doc(serverDb, "users", user.uid, "workouts", "latest"),
      {
        request: { experience, equipment, days, focus, notes },
        plan,
        generatedAt: Date.now(),
      },
      { merge: true }
    );

    return res.status(200).json({ plan });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Failed to build workout" });
  }
}
