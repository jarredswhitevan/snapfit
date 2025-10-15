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
        <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
          <p className="text-gray-500 text-sm">Goal setup coming next...</p>
        </div>
      </main>
    </div>
  )
}
