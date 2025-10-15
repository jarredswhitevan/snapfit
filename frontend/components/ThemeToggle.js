import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="p-2 rounded-lg border border-[var(--border)] hover:opacity-90"
      style={{ lineHeight: 0 }}
    >
      {/* Outline Moon / Sun (inline SVG, no lib needed) */}
      {isLight ? (
        // Moon for switching back to dark
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        // Sun for switching to light
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.4-1.4M20.4 20.4L19 19M5 19l-1.4 1.4M20.4 3.6L19 5"
            stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}
