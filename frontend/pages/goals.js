import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

export default function Goals() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="text-white p-6">Loading...</div>;
  }

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("lbs");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [aggression, setAggression] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[var(--snap-green)] rounded-full"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Step 1: Your Body Info</h1>
        <p className="text-gray-400 mb-6">This helps SnapFIT build your custom plan.</p>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 space-y-6">
          <div>
            <label className="block mb-1 text-sm">Sex / Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="na">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Age</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2" placeholder="Your age" />
          </div>

          <div>
            <label className="block mb-1 text-sm">Weight ({unit})</label>
            <div className="flex gap-2">
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="flex-1 bg-black border border-gray-700 rounded px-3 py-2" placeholder="e.g. 180" />
              <select value={unit} onChange={e => setUnit(e.target.value)} className="bg-black border border-gray-700 rounded px-3">
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2" placeholder="e.g. 178" />
          </div>

          <button className="w-full bg-[var(--snap-green)] text-black py-3 rounded font-semibold hover:opacity-90">
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
}
