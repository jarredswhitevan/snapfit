"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Start dark immediately — no flash
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    // If user has saved preference, use it
    const activeTheme = saved || "dark";
    setTheme(activeTheme);

    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(activeTheme === "dark" ? "theme-dark" : "theme-light");

    // If no saved theme, lock in dark as default
    if (!saved) localStorage.setItem("theme", "dark");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
