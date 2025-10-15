import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

export default function Goals() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // wait for auth before showing page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // state
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("lbs");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  function handleContinue() {
    if (!gender || !age || !weight || !height || !activity || !goal) {
      setError("Please fill all fields before continuing.");
      return;
    }
    router.push("/tracker"); // temporary, until wizard step 2
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <NavBar />

      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Your Fitness Setup</h1>
        <p className="text-[var(--muted)] mb-6">We’ll build your custom calorie plan.</p>

        <div className="card space-y-5">
          <div>
            <label className="block text-sm mb-1">Sex / Gender</label>
            <select className="input w-full" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="na">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              className="input w-full"
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Weight ({unit})</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="input w-full"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 175"
              />
              <select className="input" value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Height (cm)</label>
            <input
              type="number"
              className="input w-full"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="e.g. 180"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Activity Level</label>
            <select className="input w-full" value={activity} onChange={e => setActivity(e.target.value)}>
              <option value="">Select</option>
              <option value="sedentary">Sedentary (little exercise)</option>
              <option value="light">Light (1–2 days/week)</option>
              <option value="moderate">Moderate (3–4 days/week)</option>
              <option value="active">Active (5–6 days/week)</option>
              <option value="athlete">Athlete (2x daily)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Goal</label>
            <select className="input w-full" value={goal} onChange={e => setGoal(e.target.value)}>
              <option value="">Select</option>
              <option value="fatloss">Lose Weight</option>
              <option value="lean">Get Lean</option>
              <option value="muscle">Build Muscle</option>
              <option value="maintain">Maintain Fitness</option>
              <option value="bulk">Bulk</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleContinue} className="btn-primary w-full">
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
}
