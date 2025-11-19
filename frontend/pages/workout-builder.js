import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function WorkoutBuilderPage() {
  const [user, authLoading] = useAuthState(auth);
  const [form, setForm] = useState({
    experience: "intermediate",
    equipment: "gym",
    days: 4,
    focus: "hypertrophy",
    notes: "",
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
      const resp = await fetch("/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to build workout");
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
        <p className="text-lg">Log in to build custom workouts.</p>
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
          <p className="text-xs token-muted uppercase tracking-wide">AI Training</p>
          <h1 className="text-2xl font-semibold">Workout Builder</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Training inputs</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm token-muted mb-1">Experience</label>
              <select
                className="input w-full"
                value={form.experience}
                onChange={(e) => updateField("experience", e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Equipment</label>
              <select
                className="input w-full"
                value={form.equipment}
                onChange={(e) => updateField("equipment", e.target.value)}
              >
                <option value="gym">Full gym</option>
                <option value="minimal">Minimal / dumbbells</option>
                <option value="bodyweight">Bodyweight</option>
              </select>
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Days per week</label>
              <input
                className="input w-full"
                type="number"
                value={form.days}
                onChange={(e) => updateField("days", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Focus</label>
              <select
                className="input w-full"
                value={form.focus}
                onChange={(e) => updateField("focus", e.target.value)}
              >
                <option value="hypertrophy">Hypertrophy</option>
                <option value="strength">Strength</option>
                <option value="conditioning">Conditioning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Notes</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Injuries, preferred splits, etc"
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
              {loading ? "Generating..." : "Generate training"}
            </button>
          </div>
        </section>

        {plan && (
          <section className="token-card border token-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Weekly layout</h2>
              <span className="text-xs token-muted">{plan.days || form.days} days/week</span>
            </div>
            <p className="text-sm token-muted">{plan.summary}</p>
            <div className="space-y-3">
              {plan.sessions?.map((session, idx) => (
                <article key={idx} className="border border-dashed token-border rounded-lg p-3">
                  <p className="font-semibold">Day {session.day}: {session.title}</p>
                  <ul className="text-sm list-disc ml-4 mt-2 space-y-1">
                    {session.blocks?.map((block, blockIdx) => (
                      <li key={blockIdx}>{block}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
