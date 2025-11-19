import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
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

    const { diet, days, calories, restrictions } = req.body || {};
    if (!diet || !days || !calories) {
      return res.status(400).json({ error: "Missing diet, days, or calories" });
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
              "You are SnapFIT, an elite nutrition assistant. Build grocery lists grouped by category with performance foods.",
          },
          {
            role: "user",
            content: `Diet: ${diet}. Calories: ${calories}. Days: ${days}. Restrictions: ${restrictions || "none"}. Return JSON {summary,days,categories:[{name,items}]}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "OpenAI error");
    }
    let list;
    try {
      list = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch {
      throw new Error("AI returned invalid grocery list");
    }

    await setDoc(
      doc(db, "users", user.uid, "groceryLists", "latest"),
      {
        request: { diet, days, calories, restrictions },
        list,
        generatedAt: Date.now(),
      },
      { merge: true }
    );

    return res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Failed to build grocery list" });
  }
}
