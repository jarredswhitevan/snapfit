import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  // default to dark, fall back to system if first visit
  const [theme, setTheme] = useState("dark");

  // on mount: read saved or system
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("snapfit_theme") : null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  // apply class to <html> and persist
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.classList.remove("theme-dark", "theme-light");
    html.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    try { localStorage.setItem("snapfit_theme", theme); } catch {}
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
