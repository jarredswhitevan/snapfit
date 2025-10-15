import NavBar from '../components/NavBar'
import { useState } from 'react'

async function fileToDataURLResized(file, maxSize = 1024, quality = 0.9) {
  // Returns a resized data URL (JPEG) to keep payload small & fast
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  const canvas = document.createElement("canvas");
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function Tracker() {
  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [raw, setRaw] = useState("");

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setResult(null); setRaw("");
    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    // Create resized base64 for API
    const resized = await fileToDataURLResized(file, 1024, 0.9);
    setImageBase64(resized);
  }

  async function analyzeImage() {
    if (!imageBase64) return;
    setLoading(true); setError(""); setResult(null); setRaw("");
    try {
      const resp = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.details || data?.error || "AI failed to analyze this image.");
      } else if (data?.ok && data?.analysis) {
        setResult(data.analysis);
      } else if (data?.raw) {
        // Fallback if model returns plain text
        setRaw(data.raw);
      } else {
        setError("Unexpected AI response.");
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Smart Calorie Scanner</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Snap a meal photo. SnapFIT AI identifies foods, estimates calories & macros, and coaches you like a performance trainer.
        </p>

        {/* Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-4 block w-full text-sm file:bg-[var(--snap-green)] file:text-white file:font-semibold file:border-none file:px-4 file:py-2 rounded"
        />

        {/* Preview */}
        {preview && (
          <div className="mb-4">
            <img src={preview} className="rounded-lg border dark:border-gray-700" alt="Meal preview" />
          </div>
        )}

        {/* Analyze */}
        <button
          disabled={!imageBase64 || loading}
          onClick={analyzeImage}
          className="w-full bg-[var(--snap-green)] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? "Analyzing with AI..." : "Analyze Meal"}
        </button>

        {/* Errors */}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Nutrition Analysis</h2>
            <div className="text-gray-800 dark:text-gray-200">
              <div className="mb-2"><b>Meal:</b> {result.meal || "Detected meal"}</div>
              {Array.isArray(result.items) && result.items.length > 0 && (
                <div className="mb-2">
                  <b>Items:</b>
                  <ul className="list-disc ml-5">
                    {result.items.map((it, idx) => (
                      <li key={idx}>{it.name} — {Math.round((it.confidence_0to1 || 0)*100)}% {it.grams_estimate ? `• ~${it.grams_estimate}g` : ""}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mb-2"><b>Calories:</b> {result.calories_kcal ? `~${result.calories_kcal} kcal` : "—"}</div>
              {result.macros && (
                <div className="mb-2 grid grid-cols-3 gap-2">
                  <div><b>Protein:</b> {result.macros.protein_g ?? "—"} g</div>
                  <div><b>Carbs:</b> {result.macros.carbs_g ?? "—"} g</div>
                  <div><b>Fat:</b> {result.macros.fat_g ?? "—"} g</div>
                </div>
              )}
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <b>Coach’s note:</b> {result.coaching || "Fuel smart. Stay consistent."}
              </div>
            </div>
          </div>
        )}

        {/* Fallback plain text (if JSON mode fails) */}
        {raw && (
          <div className="mt-6 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Nutrition Analysis</h2>
            <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">{raw}</p>
          </div>
        )}
      </main>
    </div>
  );
}
