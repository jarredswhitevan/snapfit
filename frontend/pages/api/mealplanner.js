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

    const { goal, calories, mealsPerDay, diet, restrictions } = req.body || {};
    if (!goal || !calories || !mealsPerDay) {
      return res.status(400).json({ error: "Missing goal, calories, or mealsPerDay" });
    }

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "You are SnapFIT, a performance nutrition coach. Return concise JSON meal plans with macros for each meal.",
          },
          {
            role: "user",
            content: `Goal: ${goal}. Calories: ${calories}. Meals per day: ${mealsPerDay}. Diet: ${diet}. Restrictions: ${restrictions || "none"}. Return JSON {summary,totalCalories,meals:[{name,description,calories,protein,carbs,fats}]}`,
          },
        ],
      }),
    });

    const json = await openaiResp.json();
    if (!openaiResp.ok) {
      throw new Error(json?.error?.message || "OpenAI failed");
    }
    let plan;
    try {
      plan = JSON.parse(json.choices?.[0]?.message?.content || "{}");
    } catch {
      throw new Error("AI returned invalid meal plan");
    }

    await setDoc(
      doc(serverDb, "users", user.uid, "mealPlans", "latest"),
      {
        request: { goal, calories, mealsPerDay, diet, restrictions },
        plan,
        generatedAt: Date.now(),
      },
      { merge: true }
    );

    return res.status(200).json({ plan });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Failed to build meal plan" });
  }
}
