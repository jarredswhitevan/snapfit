import NavBar from '../components/NavBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4">
        <section className="py-14 sm:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              AI Fitness. <span className="text-[var(--snap-green)]">Real Results.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Snap meals for instant calories. Track visual progress with AI. Train smarter with data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/waitlist" className="px-5 py-3 rounded-md bg-[var(--snap-green)] text-white font-semibold hover:opacity-90">
                Join Early Access
              </a>
              <a href="/tracker" className="px-5 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">
                See the Demo
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Dark/Light mode supported. Mobile ready.</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
            <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-green-100 to-white dark:from-[#0a0a0a] dark:to-[#020202] grid place-items-center">
              <div className="text-center">
                <div className="text-6xl">📸</div>
                <div className="mt-2 text-gray-700 dark:text-gray-300">Snap • Track • Transform</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Photo Calorie Scan", emoji: "🥗", text: "Upload meal pics. Get instant calories & macros." },
              { title: "AI Body Progress", emoji: "💪", text: "Front/side photos → visual progress & trends." },
              { title: "Adaptive Plans", emoji: "📈", text: "Personalized workouts based on your goals." }
            ].map((c,i)=>(
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="text-3xl">{c.emoji}</div>
                <div className="mt-3 font-semibold text-gray-900 dark:text-white">{c.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/waitlist" className="inline-block px-6 py-3 rounded-md bg-[var(--snap-green)] text-white font-semibold hover:opacity-90">
              Join the Waitlist
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} SnapFIT</span>
          <a href="/waitlist" className="px-4 py-2 rounded-md bg-[var(--snap-green)] text-white text-sm font-semibold hover:opacity-90">
            Join Early Access
          </a>
        </div>
      </footer>
    </div>
  );
}
