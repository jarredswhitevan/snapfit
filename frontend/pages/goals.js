import NavBar from '../components/NavBar'
import { useState } from 'react'

export default function Goals() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">Set Your Fitness Goal</h1>
        <p className="text-gray-400 mb-6">
          Answer a few quick questions so SnapFIT can build your personalized nutrition plan.
        </p>

        {/* Form comes here */}
        const [gender, setGender] = useState("");
const [age, setAge] = useState("");
const [weight, setWeight] = useState("");
const [unit, setUnit] = useState("lbs");
const [height, setHeight] = useState("");
const [activity, setActivity] = useState("");
const [goal, setGoal] = useState("");

return (
  <div className="min-h-screen bg-black text-white">
    <NavBar />
    <main className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Set Your Fitness Goal</h1>
      <p className="text-gray-400 mb-6">
        Answer a few quick questions so SnapFIT can build your personalized nutrition plan.
      </p>

      <div className="bg-[#111] p-6 rounded-xl border border-gray-800 space-y-6">
        {/* Gender */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Sex / Gender</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
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
          <label className="block mb-1 text-sm text-gray-300">Age</label>
          <input
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="Your age"
            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Current Weight ({unit})</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 180"
              className="flex-1 bg-black border border-gray-700 rounded px-3 py-2"
            />
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="bg-black border border-gray-700 rounded px-3"
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="e.g. 178"
            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
          />
        </div>

        {/* Activity */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Activity Level</label>
          <select
            value={activity}
            onChange={e => setActivity(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="sedentary">Sedentary (little exercise)</option>
            <option value="light">Light (1-2 days/week)</option>
            <option value="moderate">Moderate (3-4 days/week)</option>
            <option value="active">Active (5-6 days/week)</option>
            <option value="athlete">Athlete (2x day training)</option>
          </select>
        </div>

        {/* Goals */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Goal</label>
          <select
            value={goal}
            onChange={e => setGoal(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="fatloss">Lose Weight</option>
            <option value="lean">Get Lean & Toned</option>
            <option value="muscle">Build Muscle</option>
            <option value="maintain">Maintain Fitness</option>
            <option value="bulk">Bulk Up (Gain Size)</option>
          </select>
        </div>
      </div>
    </main>
  </div>
)

      </main>
    </div>
  )
}
