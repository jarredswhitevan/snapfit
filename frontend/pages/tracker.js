import NavBar from '../components/NavBar'

export default function Tracker(){
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Calorie Tracker (Demo)</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          In the full release, snap a photo of your meal to get instant calories and macros.
        </p>
        <div className="mt-6 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="text-5xl">🥗</div>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Want early access? <a href="/waitlist" className="text-[var(--snap-green)] font-semibold hover:underline">Join the waitlist</a>.
          </div>
        </div>
      </main>
    </div>
  )
}
