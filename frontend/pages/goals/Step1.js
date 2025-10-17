import { useState } from "react";

export default function Step1({ next }) {
  const [form, setForm] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
  });

  function handleNext() {
    if (!form.gender || !form.age || !form.height || !form.weight) {
      alert("Please fill everything before continuing.");
      return;
    }
    // save to local storage
    localStorage.setItem("snapfit_goal_data", JSON.stringify(form));
    next(); // move to next step
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      {/* Progress header */}
      <p className="text-sm text-[var(--muted)] mb-2">Step 1 of 4</p>
      <h1 className="text-3xl font-bold mb-6">Your Body Info</h1>
      <p className="text-[var(--muted)] mb-8">This helps us build your accurate plan.</p>

      {/* Form */}
      <div className="space-y-6">
        {/* Gender */}
        <div>
          <label className="block mb-1 text-sm text-[var(--muted)]">Sex / Gender</label>
          <select
            className="input w-full"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
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
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="Your age"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block mb-1 text-sm text-[var(--muted)]">Height (cm)</label>
          <input
            type="number"
            className="input w-full"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            placeholder="e.g. 178"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1 text-sm text-[var(--muted)]">Weight (lbs)</label>
          <input
            type="number"
            className="input w-full"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="e.g. 180"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex justify-end">
        <button onClick={handleNext} className="btn-primary">
          Continue →
        </button>
      </div>
    </div>
  );
}
