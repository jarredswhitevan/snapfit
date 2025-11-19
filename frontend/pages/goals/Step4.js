import { useEffect, useMemo, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Step4({ next, back, user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);

  // ---- pull data from previous steps ----
  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // helpers
  const round0 = (n) => Math.max(0, Math.round(n || 0));
  const clampMin = (n, min) => (n < min ? min : n);

  // activity factors
  const activityFactor = (lvl) => {
    switch (lvl) {
      case "sedentary":
        return 1.2;
      case "light":
        return 1.35;
      case "moderate":
        return 1.5;
      case "active":
        return 1.7;
      case "athlete":
        return 1.9;
      default:
        return 1.35;
    }
  };

  // intensity adjustments (deficit or surplus applied by goal below)
  const intensityPct = (intensity) => {
    switch (intensity) {
      case "aggressive":
        return 0.20;
      case "balanced":
        return 0.15;
      case "clean":
        return 0.10;
      default:
        return 0.15;
    }
  };

  // calculate plan locally (Katch–McArdle, high-protein split)
  useEffect(() => {
    // simulate “AI calculating” pulse
    const t = setTimeout(() => setLoading(false), 900);

    if (!data) {
      setError("Missing your setup data. Please complete Steps 1–3.");
      setLoading(false);
      return;
    }

    const kg = data?.normalized?.weightKg;
    const cm = data?.normalized?.heightCm; // not needed for Katch, but kept for future
    const bf = typeof data?.bodyFat === "number" ? data.bodyFat : 18; // default
    const act = data?.activity || "light";
    const intensity = data?.goalIntensity || "balanced";
    const goal = data?.goal || "balanced";

    if (!kg || !act) {
      setError("We’re missing weight or activity level. Please go back a step.");
      setLoading(false);
      return;
    }

    // Lean Body Mass & BMR (Katch–McArdle)
    const lbm = kg * (1 - (bf / 100)); // kg
    const bmr = 370 + (21.6 * lbm);    // kcal
    const tdee = bmr * activityFactor(act);

    // Direction from goal (cut/surplus/maintain)
    const pct = intensityPct(intensity);
    let calories = tdee;
    if (goal === "maintain") {
      calories = tdee;
    } else if (goal === "muscle" || goal === "bulk") {
      // surplus
      calories = tdee * (1 + pct);
    } else {
      // fatloss, lean, recomp -> deficit
      calories = tdee * (1 - pct);
    }

    // Safety floor (App Store friendly)
    calories = clampMin(calories, 1400);

    // Macro split: High-Performance (protein priority)
    const lbs = kg * 2.20462;
    const protein_g = round0(lbs * 1.0); // ~1g/lb
    const protein_kcal = protein_g * 4;

    const fat_kcal = calories * 0.25; // 25% fats
    const fat_g = round0(fat_kcal / 9);

    // Carbs are the remainder
    const remaining_kcal = Math.max(0, calories - protein_kcal - fat_kcal);
    const carbs_g = round0(remaining_kcal / 4);

    const result = {
      calories: round0(calories),
      protein_g,
      carbs_g,
      fats_g: fat_g,
      // for bars (percent of calories)
      p_pct: Math.min(100, Math.round((protein_kcal / calories) * 100)),
      c_pct: Math.min(100, Math.round(((carbs_g * 4) / calories) * 100)),
      f_pct: Math.min(100, Math.round((fat_kcal / calories) * 100)),
      meta: { tdee: Math.round(tdee), bmr: Math.round(bmr), lbm: Math.round(lbm) },
    };

    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      const saved = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "snapfit_goal_data",
        JSON.stringify({ ...saved, plan: result, stepCompleted: 4 })
      );
    } catch {}

    setPlan(result);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!plan || !user || !data) return;
    const goalsRef = doc(db, "users", user.uid, "goals", "current");
    const payload = {
      profile: {
        gender: data.gender || null,
        age: data.age || null,
        unitHeight: data.unitHeight || "imperial",
        unitWeight: data.unitWeight || "lbs",
        normalized: data.normalized || null,
      },
      activity: data.activity || null,
      goal: data.goal || null,
      goalIntensity: data.goalIntensity || null,
      bodyFat: data.bodyFat || null,
      targetWeight: data.targetWeight ?? null,
      macroPlan: plan,
      updatedAt: Date.now(),
    };
    setDoc(goalsRef, payload, { merge: true }).catch((err) =>
      console.error("Failed to persist goal", err)
    );
  }, [plan, user, data]);

  // swipe support
  const swipeRef = useRef(null);
  const startX = useRef(0);
  const onTouchStart = (e) => {
    startX.current = e.touches?.[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e) => {
    const dx = (e.changedTouches?.[0]?.clientX ?? 0) - startX.current;
    if (dx > 60) back?.();
    if (dx < -60) next?.(); // proceed to pricing
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 pb-28 pt-8">
        <p className="text-red-500">{error}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={back} className="opacity-80 hover:opacity-100">← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-xl mx-auto px-6 pb-28 pt-8"
      ref={swipeRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* AI badge */}
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className="px-2 py-1 rounded bg-[var(--card)] border border-[var(--border)]">
          Powered by <strong>SnapFIT AI</strong>
        </span>
      </div>

      {/* Header */}
      <p className="text-sm text-[var(--muted)] mb-2">Step 4 of 5 — AI Macro Plan</p>
      <h1 className="text-3xl font-bold mb-1">🔥 Your Macro Plan is Ready</h1>
      <p className="text-[var(--muted)] mb-6">
        Precision plan built from your stats to maximize results while protecting muscle.
      </p>

      {/* Loading pulse */}
      {loading && (
        <div className="card p-6 animate-pulse">
          <div className="h-4 w-40 mb-4 bg-[var(--border)] rounded" />
          <div className="h-6 w-24 mb-6 bg-[var(--border)] rounded" />
          <div className="h-3 w-full mb-3 bg-[var(--border)] rounded" />
          <div className="h-3 w-5/6 mb-3 bg-[var(--border)] rounded" />
          <div className="h-3 w-2/3 bg-[var(--border)] rounded" />
        </div>
      )}

      {/* Results */}
      {!loading && plan && (
        <>
          {/* Calorie box */}
          <div className="card p-6 mb-6">
            <div className="text-sm text-[var(--muted)]">Daily Calories</div>
            <div className="text-4xl font-extrabold tracking-tight">
              {plan.calories.toLocaleString()} <span className="text-base font-medium">kcal</span>
            </div>
            <div className="mt-2 text-sm text-[var(--muted)]">
              Built from your lean mass (Katch–McArdle), activity, and goal intensity.
            </div>
          </div>

          {/* Macro bars */}
          <div className="card p-6 space-y-4">
            <MacroBar label="Protein" grams={plan.protein_g} pct={plan.p_pct} />
            <MacroBar label="Carbs" grams={plan.carbs_g} pct={plan.c_pct} />
            <MacroBar label="Fats" grams={plan.fats_g} pct={plan.f_pct} />
          </div>

          {/* Notes */}
          <div className="mt-4 text-sm text-[var(--muted)]">
            Targets are rounded for simplicity. You can tweak later in Settings.
          </div>
        </>
      )}

      {/* Sticky footer */}
      <div className="fixed left-0 right-0 bottom-0 bg-[var(--subtle)] border-t border-[var(--border)]">
        <div className="max-w-xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={back} className="opacity-75 hover:opacity-100">← Back</button>
          <button onClick={next} className="btn-primary">Unlock My Plan →</button>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, grams, pct }) {
  const pctClamped = Math.max(0, Math.min(100, pct || 0));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold">{label}</div>
        <div className="text-sm opacity-80">{grams} g</div>
      </div>
      <div className="w-full h-3 rounded bg-[var(--subtle)] overflow-hidden border border-[var(--border)]">
        <div
          className="h-full"
          style={{
            width: `${pctClamped}%`,
            background:
              "linear-gradient(90deg, var(--snap-green) 0%, #a6f5c0 100%)",
          }}
        />
      </div>
    </div>
  );
}
