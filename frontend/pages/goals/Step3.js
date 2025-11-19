import { useEffect, useRef, useState } from "react";
import { useUnits } from "../../contexts/UnitContext";

export default function Step3({ next, back, user }) {
  // Load saved data
  const { units, setWeightUnit } = useUnits();
  const [goalIntensity, setGoalIntensity] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [bodyFat, setBodyFat] = useState(18); // default
  const [unitWeight, setUnitWeight] = useState(units.weight || "lbs");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUnitWeight(units.weight || "lbs");
  }, [units]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.goalIntensity) setGoalIntensity(saved.goalIntensity);
        if (saved.bodyFat) setBodyFat(saved.bodyFat);
        if (saved.goal) setGoal(saved.goal);
        if (saved.unitWeight) {
          setUnitWeight(saved.unitWeight);
          setWeightUnit(saved.unitWeight);
        }
        if (saved.targetWeight) setTargetWeight(saved.targetWeight);
      }
    } catch {}
  }, []);

  const saveAndNext = () => {
    if (!goalIntensity) return setError("Choose how fast you want to progress.");
    if (goal !== "recomp" && !targetWeight) return setError("Enter a target weight.");
    setError("");

    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      const saved = raw ? JSON.parse(raw) : {};

      const payload = {
        ...saved,
        goalIntensity,
        bodyFat,
        targetWeight: goal === "recomp" ? null : Number(targetWeight),
        stepCompleted: 3,
      };

      localStorage.setItem("snapfit_goal_data", JSON.stringify(payload));
    } catch {}

    next();
  };

  // Swipe
  const swipeRef = useRef(null);
  const startX = useRef(0);
  const onTouchStart = (e) => {
    startX.current = e.touches?.[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e) => {
    const dx = (e.changedTouches?.[0]?.clientX ?? 0) - startX.current;
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
      <p className="text-sm text-[var(--muted)] mb-2">Step 3 of 4 — Target Setup</p>
      <h1 className="text-3xl font-bold mb-2">Define your result pace</h1>
      <p className="text-[var(--muted)] mb-6">
        This guides how aggressive your calorie plan will be.
      </p>

      {/* GOAL INTENSITY */}
      <div className="space-y-3 mb-8">
        {[
          { id: "aggressive", title: "Aggressive", desc: "Fast results. High discipline required." },
          { id: "balanced", title: "Balanced", desc: "Steady progress. Best long-term." },
          { id: "clean", title: "Clean & Steady", desc: "Lifestyle friendly pace." },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setGoalIntensity(opt.id)}
            className={`w-full text-left p-4 rounded border transition ${
              goalIntensity === opt.id
                ? "border-[var(--snap-green)] bg-[var(--snap-green)] text-black"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--snap-green)]"
            }`}
          >
            <div className="font-semibold">{opt.title}</div>
            <div className="text-sm opacity-80">{opt.desc}</div>
          </button>
        ))}
      </div>

      {/* TARGET WEIGHT */}
      {goal !== "recomp" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-[var(--muted)]">Target Weight ({unitWeight})</label>
            <div className="flex gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUnitWeight("lbs");
                  setWeightUnit("lbs");
                }}
                className={`px-2 py-1 rounded border ${
                  unitWeight === "lbs"
                    ? "bg-[var(--snap-green)] text-black border-[var(--snap-green)]"
                    : "border-[var(--border)]"
                }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnitWeight("kg");
                  setWeightUnit("kg");
                }}
                className={`px-2 py-1 rounded border ${
                  unitWeight === "kg"
                    ? "bg-[var(--snap-green)] text-black border-[var(--snap-green)]"
                    : "border-[var(--border)]"
                }`}
              >
                kg
              </button>
            </div>
          </div>
          <input
            type="number"
            className="input w-full"
            placeholder={unitWeight === "lbs" ? "e.g. 170" : "e.g. 77"}
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
          />
        </div>
      )}

      {/* BODY FAT SLIDER */}
      <div>
        <label className="block mb-2 text-sm text-[var(--muted)]">
          Estimated Body Fat % <span className="opacity-75">(optional)</span>
        </label>
        <input
          type="range"
          min="5"
          max="40"
          value={bodyFat}
          onChange={(e) => setBodyFat(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-1">
          {bodyFat}% —{" "}
          {bodyFat < 12
            ? "Athletic"
            : bodyFat < 18
            ? "Lean"
            : bodyFat < 25
            ? "Fit"
            : "Cutting recommended"}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {/* STICKY FOOTER BUTTONS */}
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
