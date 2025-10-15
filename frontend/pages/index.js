export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--snap-green,#22c55e)]" />
          <span className="font-bold tracking-wide">SnapFIT</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/tracker" className="hover:text-[var(--snap-green,#22c55e)]">Tracker</a>
          <a href="/goals" className="hover:text-[var(--snap-green,#22c55e)]">Goals</a>
          <a href="/login" className="opacity-80 hover:opacity-100">Log in</a>
          <a
            href="/register"
            className="bg-[var(--snap-green,#22c55e)] text-black px-4 py-2 rounded font-semibold hover:opacity-90"
          >
            Get Started
          </a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Snap a meal. <span className="text-[var(--snap-green,#22c55e)]">AI</span> logs your calories instantly.
            </h1>
            <p className="mt-4 text-gray-300 text-lg">
              Upload a photo. Get calories & macros. Auto-track your day. Built for speed, accuracy, and consistency.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/register"
                className="bg-[var(--snap-green,#22c55e)] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90"
              >
                Get Started — Free
              </a>
              <a
                href="/login"
                className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500"
              >
                Log in
              </a>
            </div>

            {/* Trust bullets */}
            <ul className="mt-6 text-sm text-gray-400 space-y-1">
              <li>• AI meal scanner with smart macros</li>
              <li>• Personalized calorie goals</li>
              <li>• Water tracking & daily totals</li>
            </ul>
          </div>

          {/* Visual mock / CTA card */}
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-5">
            <div className="aspect-[9/16] rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-gray-800 p-4 flex flex-col">
              <div className="text-sm text-gray-400">Today</div>
              <div className="mt-2 text-2xl font-bold">1,240 / 2,200 kcal</div>
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-800 rounded">
                  <div className="h-2 rounded bg-[var(--snap-green,#22c55e)]" style={{ width: '56%' }} />
                </div>
                <div className="text-xs text-gray-500">Protein 92g • Carbs 135g • Fat 38g</div>
              </div>
              <div className="mt-auto">
                <div className="text-sm text-gray-400 mb-2">Quick Add</div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="bg-black border border-gray-800 rounded-lg py-2 hover:border-gray-600">Photo</button>
                  <button className="bg-black border border-gray-800 rounded-lg py-2 hover:border-gray-600">Meal</button>
                  <button className="bg-black border border-gray-800 rounded-lg py-2 hover:border-gray-600">Water</button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Preview UI — actual tracker inside the app.
            </div>
          </div>
        </section>

        {/* Feature row */}
        <section className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { title: 'AI Meal Scanner', desc: 'One photo → calories & macros in seconds.' },
            { title: 'Personal Goals', desc: 'Custom calories and macros based on your goal.' },
            { title: 'Water & Daily Totals', desc: 'Stay on target with a clean daily dashboard.' },
          ].map((f) => (
            <div key={f.title} className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5">
              <div className="text-lg font-semibold">{f.title}</div>
              <p className="mt-2 text-gray-400">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA footer */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Be consistent. Let AI do the heavy lifting.</h2>
          <a
            href="/register"
            className="inline-block mt-6 bg-[var(--snap-green,#22c55e)] text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Get Started — Free
          </a>
          <p className="mt-3 text-sm text-gray-500">No credit card required.</p>
        </section>
      </main>
    </div>
  );
}
