import NavBar from '../components/NavBar'
import { useState } from 'react'

export default function Tracker() {
  const [imageBase64, setImageBase64] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  async function analyzeImage() {
    try {
      setLoading(true)
      setError("")
      setResult(null)

      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 })
      })

      const data = await res.json()
      if (!data.choices) throw new Error("Invalid AI response")
      setResult(data.choices[0].message.content)
    } catch (err) {
      setError("AI failed to analyze this image. Try another or retake.")
    }
    setLoading(false)
  }

  function handleImage(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => setImageBase64(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Smart Calorie Scanner</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Snap a meal photo. SnapFIT AI will analyze the food, estimate calories & macros, and give nutrition feedback.
        </p>

        {/* Upload */}
        <input type="file" accept="image/*" onChange={handleImage}
          className="mb-4 block w-full text-sm file:bg-[var(--snap-green)] 
          file:text-white file:font-semibold file:border-none file:px-4 file:py-2 rounded" />

        {/* Image Preview */}
        {imageBase64 && (
          <div className="mb-4">
            <img src={imageBase64} className="rounded-lg border dark:border-gray-700" />
          </div>
        )}

        {/* Analyze Button */}
        <button
          disabled={!imageBase64 || loading}
          onClick={analyzeImage}
          className="w-full bg-[var(--snap-green)] hover:opacity-90 disabled:opacity-50 
          text-white font-semibold py-3 rounded-md transition">
          {loading ? "Analyzing with AI..." : "Analyze Meal"}
        </button>

        {/* Error */}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Nutrition Analysis</h2>
            <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{result}</p>
          </div>
        )}
      </main>
    </div>
  )
}
