import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function MealPlannerPage() {
  const [user, authLoading] = useAuthState(auth);
  const [form, setForm] = useState({
    goal: "lean",
    calories: "2300",
    mealsPerDay: 4,
    diet: "balanced",
    restrictions: "",
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const generatePlan = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const resp = await fetch("/api/mealplanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to build plan");
      }
      setPlan(data.plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text)]">
        <p className="text-lg">Log in to access the AI meal planner.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <header className="px-5 py-6 border-b token-border flex items-center justify-between">
        <div>
          <p className="text-xs token-muted uppercase tracking-wide">AI Nutrition</p>
          <h1 className="text-2xl font-semibold">Meal Planner</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Tell SnapFIT what to build</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm token-muted mb-1">Primary goal</label>
              <select
                className="input w-full"
                value={form.goal}
                onChange={(e) => updateField("goal", e.target.value)}
              >
                <option value="lean">Lean & defined</option>
                <option value="fatloss">Lose fat</option>
                <option value="maintenance">Maintain</option>
                <option value="muscle">Build muscle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Daily calories</label>
              <input
                className="input w-full"
                type="number"
                value={form.calories}
                onChange={(e) => updateField("calories", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Meals per day</label>
              <input
                className="input w-full"
                type="number"
                value={form.mealsPerDay}
                onChange={(e) => updateField("mealsPerDay", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Diet type</label>
              <select
                className="input w-full"
                value={form.diet}
                onChange={(e) => updateField("diet", e.target.value)}
              >
                <option value="balanced">Balanced performance</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="plant">Plant-forward</option>
                <option value="keto">Low-carb / keto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Restrictions</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.restrictions}
                onChange={(e) => updateField("restrictions", e.target.value)}
                placeholder="e.g. dairy-free, no shellfish"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={generatePlan}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-black ${
                loading ? "bg-[var(--snap-green)]/50" : "bg-[var(--snap-green)] hover:opacity-90"
              }`}
            >
              {loading ? "Generating..." : "Generate AI plan"}
            </button>
          </div>
        </section>

        {plan && (
          <section className="token-card border token-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Meal Plan</h2>
              <span className="text-xs token-muted">{plan.totalCalories || form.calories} kcal</span>
            </div>
            <p className="text-sm token-muted">{plan.summary}</p>
            <div className="space-y-3">
              {plan.meals?.map((meal, idx) => (
                <article key={idx} className="border border-dashed token-border rounded-lg p-3">
                  <p className="font-semibold">{meal.name}</p>
                  <p className="text-sm token-muted">{meal.description}</p>
                  <p className="text-xs mt-2">
                    Macros: {meal.protein}g P • {meal.carbs}g C • {meal.fats}g F
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
