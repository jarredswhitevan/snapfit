import { useEffect, useRef, useState } from "react";
import { useUnits } from "../../contexts/UnitContext";

export default function Step1({ next, user }) {
  // UI + form state
  const { units, setWeightUnit, setLengthUnit } = useUnits();
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [heightMode, setHeightMode] = useState(units.length || "imperial");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightMode, setWeightMode] = useState(units.weight || "lbs");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  // Load any saved local progress on mount
  useEffect(() => {
    setHeightMode(units.length || "imperial");
    setWeightMode(units.weight || "lbs");
  }, [units]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("snapfit_goal_data");
      if (raw) {
        const saved = JSON.parse(raw);

        if (saved.gender) setGender(saved.gender);
        if (saved.age) setAge(String(saved.age));

        if (saved.unitHeight) {
          setHeightMode(saved.unitHeight);
          setLengthUnit(saved.unitHeight);
        }
        if (saved.unitWeight) {
          setWeightMode(saved.unitWeight);
          setWeightUnit(saved.unitWeight);
        }

        // Rehydrate height
        if (saved.unitHeight === "imperial") {
          if (saved.feet != null) setFeet(String(saved.feet));
          if (saved.inches != null) setInches(String(saved.inches));
        } else if (saved.unitHeight === "metric") {
          if (saved.heightCm != null) setHeightCm(String(saved.heightCm));
        } else if (saved.heightCm != null) {
          // fallback if only metric stored
          setHeightMode("metric");
          setHeightCm(String(saved.heightCm));
        }

        // Rehydrate weight
        if (saved.unitWeight === "lbs" || saved.unitWeight === "kg") {
          if (saved.weight != null) setWeight(String(saved.weight));
        } else if (saved.weightKg != null) {
          setWeightMode("kg");
          setWeight(String(saved.weightKg));
        }
      }
    } catch {}
  }, []);

  // --- helpers ---
  const toCm = () => {
    if (heightMode === "metric") {
      const cm = Number(heightCm);
      return isFinite(cm) ? cm : null;
    }
    const f = Number(feet);
    const i = Number(inches);
    if (!isFinite(f) || !isFinite(i)) return null;
    const totalIn = f * 12 + i;
    return Math.round(totalIn * 2.54);
  };

  const toKg = () => {
    const w = Number(weight);
    if (!isFinite(w)) return null;
    return weightMode === "kg" ? w : Math.round(w * 0.45359237);
  };

  // basic validation (friendly but strict enough for macros)
  const validate = () => {
    if (!gender) return "Please select your sex / gender.";
    const a = Number(age);
    if (!isFinite(a) || a < 13 || a > 100) return "Age must be between 13 and 100.";
    const cm = toCm();
    if (cm == null) return "Please enter a valid height.";
    if (cm < 90 || cm > 250) return "Height looks off — please check it.";
    const kg = toKg();
    if (kg == null) return "Please enter a valid weight.";
    if (kg < 30 || kg > 230) return "Weight looks off — please check it.";

    // If imperial selected, sanity-check ft/in
    if (heightMode === "imperial") {
      const f = Number(feet);
      const i = Number(inches || 0);
      if (!isFinite(f) || f < 3 || f > 8) return "Feet must be between 3 and 8.";
      if (!isFinite(i) || i < 0 || i > 11) return "Inches must be between 0 and 11.";
    }

    // If lbs selected, sanity-check
    if (weightMode === "lbs") {
      const w = Number(weight);
      if (!isFinite(w) || w < 60 || w > 500) return "Weight (lbs) must be between 60 and 500.";
    }

    // If kg selected, sanity-check
    if (weightMode === "kg") {
      const w = Number(weight);
      if (!isFinite(w) || w < 30 || w > 230) return "Weight (kg) must be between 30 and 230.";
    }

    return null;
  };

  const saveAndNext = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");

    const cm = toCm();
    const kg = toKg();

    const payload = {
      gender,
      age: Number(age),
      // store raw inputs for UX rehydration
      unitHeight: heightMode,
      unitWeight: weightMode,
      feet: heightMode === "imperial" ? Number(feet) : null,
      inches: heightMode === "imperial" ? Number(inches || 0) : null,
      heightCm: heightMode === "metric" ? Number(heightCm) : cm,
      weight: Number(weight),
      // store normalized for calculations
      normalized: {
        heightCm: cm,
        weightKg: kg,
      },
      stepCompleted: 1,
    };

    try {
      localStorage.setItem("snapfit_goal_data", JSON.stringify(payload));
    } catch {}

    next(); // go to step 2
  };

  // swipe gestures (left = next)
  const swipeRef = useRef(null);
  const startX = useRef(0);
  const onTouchStart = (e) => {
    startX.current = e.touches?.[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e) => {
    const endX = e.changedTouches?.[0]?.clientX ?? 0;
    const dx = endX - startX.current;
    if (dx < -60) {
      // swipe left -> continue
      saveAndNext();
    }
  };

  return (
    <div
      className="max-w-xl mx-auto px-6 pb-28 pt-8"
      ref={swipeRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress header */}
      <div className="mb-2 text-sm text-[var(--muted)]">Step 1 of 4 — Body Info</div>
      <h1 className="text-3xl font-bold mb-1">Dial in your stats</h1>
      <p className="text-[var(--muted)] mb-6">
        Accurate inputs = accurate macros. Quick setup — 30 seconds.
      </p>

      {/* Card */}
      <div className="card space-y-6">
        {/* Gender */}
        <div>
          <label className="block mb-1 text-sm text-[var(--muted)]">Sex / Gender</label>
          <select
            className="input w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="na">Prefer not to say</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1 text-sm text-[var(--muted)]">Age</label>
          <input
            type="number"
            className="input w-full"
            placeholder="Your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-[var(--muted)]">Height</label>
            {/* Pills toggle */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setHeightMode("metric");
                  setLengthUnit("metric");
                }}
                className={`px-3 py-1 rounded border ${heightMode === "metric" ? "bg-[var(--snap-green)] text-black border-[var(--snap-green)]" : "border-[var(--border)]"}`}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeightMode("imperial");
                  setLengthUnit("imperial");
                }}
                className={`px-3 py-1 rounded border ${heightMode === "imperial" ? "bg-[var(--snap-green)] text-black border-[var(--snap-green)]" : "border-[var(--border)]"}`}
              >
                ft/in
              </button>
            </div>
          </div>

          {heightMode === "metric" ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input w-full"
                placeholder="e.g. 178"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
              <div className="text-sm text-[var(--muted)]">cm</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input w-full"
                placeholder="5"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
              />
              <div className="text-sm text-[var(--muted)] w-8 text-center">ft</div>
              <input
                type="number"
                className="input w-full"
                placeholder="10"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
              />
              <div className="text-sm text-[var(--muted)] w-8 text-center">in</div>
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-[var(--muted)]">Weight</label>
            {/* Pills toggle */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setWeightMode("lbs");
                  setWeightUnit("lbs");
                }}
                className={`px-3 py-1 rounded border ${weightMode === "lbs" ? "bg-[var(--snap-green)] text-black border-[var(--snap-green)]" : "border-[var(--border)]"}`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => {
                  setWeightMode("kg");
                  setWeightUnit("kg");
                }}
                className={`px-3 py-1 rounded border ${weightMode === "kg" ? "bg-[var(--snap-green)] text-black border-[var(--snap-green)]" : "border-[var(--border)]"}`}
              >
                kg
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              className="input w-full"
              placeholder={weightMode === "lbs" ? "e.g. 180" : "e.g. 82"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <div className="text-sm text-[var(--muted)] w-10 text-center">
              {weightMode}
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-[var(--subtle)] border-t border-[var(--border)]">
        <div className="max-w-xl mx-auto px-6 py-3 flex items-center justify-end gap-3">
          {/* Back is hidden on Step 1 by product decision */}
          <button
            onClick={saveAndNext}
            className="btn-primary"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
