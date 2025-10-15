import NavBar from '../components/NavBar'
import { useEffect, useRef, useState } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'
import { matchFood } from '../lib/foodDB'

export default function Tracker(){
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState('')
  const [preds, setPreds] = useState([])
  const [portion, setPortion] = useState(250) // grams
  const [manualOverride, setManualOverride] = useState('')
  const imgRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    mobilenet.load().then(m => setModel(m))
  }, [])

  function handleFile(e){
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageURL(url)
    setTimeout(runModel, 100) // wait to load image
  }

  async function runModel(){
    if (!model || !imgRef.current) return
    setLoading(true)
    try {
      const predictions = await model.classify(imgRef.current)
      setPreds(predictions.slice(0,3))
    } catch (err) {
      console.error(err)
      setError("AI couldn't understand the image. Try clearer lighting.")
    }
    setLoading(false)
  }

  function estimate(){
    const label = manualOverride || preds[0]?.className || ""
    const db = matchFood(label)
    if (!db) return null
    const factor = portion / 100
    return {
      food: label,
      calories: Math.round(db.kcal * factor),
      protein: Math.round(db.protein * factor),
      carbs: Math.round(db.carbs * factor),
      fat: Math.round(db.fat * factor),
      portion
    }
  }

  const result = estimate()

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Smart Calorie Scanner</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upload a photo. AI will detect the food and estimate calories + macros.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="mb-4"
        />

        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
          {imageURL && (
            <img ref={imgRef} src={imageURL} alt="upload" className="rounded-md mb-4" />
          )}

          {loading && <p className="text-gray-500">Analyzing image with AI...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {preds.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold">Top AI guesses:</p>
              <ul className="list-disc ml-4">
                {preds.map((p, i) => (
                  <li key={i}>{p.className} ({Math.round(p.probability * 100)}%)</li>
                ))}
              </ul>
            </div>
          )}

          <label className="block mb-2">
            Override food name (optional):
            <input
              className="w-full p-2 border rounded mt-1 dark:bg-black"
              type="text"
              placeholder="e.g. chicken breast"
              value={manualOverride}
              onChange={e => setManualOverride(e.target.value)}
            />
          </label>

          <label className="block mb-2">
            Portion size: {portion} g
            <input
              className="w-full"
              type="range"
              min="50"
              max="800"
              value={portion}
              onChange={e => setPortion(e.target.value)}
            />
          </label>

          {result && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border mt-4">
              <h2 className="text-lg font-bold mb-2">Estimated Nutrition</h2>
              <p><b>Food:</b> {result.food}</p>
              <p><b>Calories:</b> {result.calories}</p>
              <p><b>Protein:</b> {result.protein} g</p>
              <p><b>Carbs:</b> {result.carbs} g</p>
              <p><b>Fat:</b> {result.fat} g</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
