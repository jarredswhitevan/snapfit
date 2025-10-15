import NavBar from '../components/NavBar'

export default function Thanks(){
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-xl mx-auto px-4 py-14 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">You’re on the waitlist!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">We’ll email you as soon as SnapFIT opens.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            className="px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
            href="https://instagram.com/snapfitapp" target="_blank" rel="noreferrer"
          >
            Follow on Instagram
          </a>
          <a
            className="px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
            href="https://tiktok.com/@snapfitapp" target="_blank" rel="noreferrer"
          >
            Follow on TikTok
          </a>
        </div>

        <div className="mt-8">
          <a href="/" className="text-sm text-[var(--snap-green)] font-semibold hover:underline">Back to Home</a>
        </div>
      </main>
    </div>
  )
}
