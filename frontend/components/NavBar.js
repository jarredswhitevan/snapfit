import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--snap-green)]" />
          <span className="font-bold tracking-wide text-[var(--text)] text-lg">SnapFIT</span>
        </Link>

        {/* Right: Nav links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-[var(--snap-green)] transition">
            Home
          </Link>
          <Link href="/tracker" className="hover:text-[var(--snap-green)] transition">
            Tracker
          </Link>
          <Link href="/goals" className="hover:text-[var(--snap-green)] transition">
            Goals
          </Link>
          <Link href="/login" className="opacity-80 hover:opacity-100 transition">
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-[var(--snap-green)] text-black font-semibold rounded hover:opacity-90 transition"
          >
            Get Started
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
