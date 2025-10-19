import { useEffect, useState, useRef } from "react";

export default function Step2({ next, back }) {
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  // Load saved data
  useEffect(() => {
    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.activity) setActivity(saved.activity);
        if (saved.goal) setGoal(saved.goal);
      }
    } catch {}
  }, []);

  const saveAndNext = () => {
    if (!activity || !goal) {
      setError("Select one activity level and one goal to continue.");
      return;
    }
    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      const saved = raw ? JSON.parse(raw) : {};
      const payload = {
        ...saved,
        activity,
        goal,
        stepCompleted: 2,
      };
      localStorage.setItem("snapfit_goal_data", JSON.stringify(payload));
    } catch {}
    next();
  };

  // swipe support
  const swipeRef = useRef(null);
  const startX = useRef(0);
  const onTouchStart = (e) => {
    startX.current = e.touches?.[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e) => {
    const endX = e.changedTouches?.[0]?.clientX ?? 0;
    const dx = endX - startX.current;
    if (dx > 60) back();
    if (dx < -60) saveAndNext();
  };

  return (
    <div
      className="max-w-xl mx-auto px-6 pb-28 pt-8"
      ref={swipeRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress */}
      <p className="text-sm text-[var(--muted)] mb-2">Step 2 of 4 — Training Style</p>
      <h1 className="text-3xl font-bold mb-1">How active are you?</h1>
      <p className="text-[var(--muted)] mb-6">This helps set your calorie baseline.</p>

      {/* ACTIVITY OPTIONS */}
      <div className="space-y-3 mb-8">
        {[
          { id: "sedentary", label: "Sedentary", sub: "Little to no exercise" },
          { id: "light", label: "Light", sub: "1–2 days per week" },
          { id: "moderate", label: "Moderate", sub: "3–4 days per week" },
          { id: "active", label: "Active", sub: "5–6 days per week" },
          { id: "athlete", label: "Athlete", sub: "2x per day training" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActivity(opt.id)}
            className={`w-full text-left p-4 rounded border transition ${
              activity === opt.id
                ? "border-[var(--snap-green)] bg-[var(--snap-green)] text-black"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--snap-green)]"
            }`}
          >
            <div className="font-semibold">{opt.label}</div>
            <div className="text-sm opacity-80">{opt.sub}</div>
          </button>
        ))}
      </div>

      {/* GOAL CHOICES */}
      <h2 className="text-2xl font-bold mb-2">What’s your main goal?</h2>
      <div className="space-y-3">
        {[
          { id: "fatloss", label: "Lose Fat" },
          { id: "lean", label: "Lean & Defined" },
          { id: "recomp", label: "Lose fat & build muscle" },
          { id: "muscle", label: "Build Muscle" },
          { id: "bulk", label: "Lean Bulk" },
          { id: "maintain", label: "Maintain & Improve Fitness" },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`w-full text-left p-4 rounded border transition ${
              goal === g.id
                ? "border-[var(--snap-green)] bg-[var(--snap-green)] text-black"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--snap-green)]"
            }`}
          >
            <div className="font-semibold">{g.label}</div>
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

      {/* Footer buttons */}
      <div className="fixed left-0 right-0 bottom-0 bg-[var(--subtle)] border-t border-[var(--border)]">
        <div className="max-w-xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={back} className="opacity-70 hover:opacity-100">
            ← Back
          </button>
          <button onClick={saveAndNext} className="btn-primary">
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
