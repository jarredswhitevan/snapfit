import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/70 dark:bg-black/50 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[var(--snap-green)] text-white grid place-items-center font-bold">SF</div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">SnapFIT</span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/tracker" className="text-sm text-gray-700 dark:text-gray-200 hover:underline">Calorie Tracker</a>
          <a href="/goals" className="text-sm text-gray-700 dark:text-gray-200 hover:underline">Goals</a>
          <a href="/scan" className="text-sm text-gray-700 dark:text-gray-200 hover:underline">Body Scan</a>
          <a
            href="/waitlist"
            className="hidden sm:inline-block text-sm font-semibold px-3 py-1.5 rounded-md bg-[var(--snap-green)] text-white hover:opacity-90"
          >
            Join Early Access
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
