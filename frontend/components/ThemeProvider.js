"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // default to dark immediately
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // 1️⃣ Try to load saved theme
    const saved = localStorage.getItem("snapfitTheme");
    // 2️⃣ Check if user prefers dark mode from system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // 3️⃣ Pick active theme (default = dark)
    const activeTheme = saved || (prefersDark ? "dark" : "dark");

    // Apply to HTML element BEFORE React hydration
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
    setTheme(activeTheme);
  }, []);

  useEffect(() => {
    // Whenever theme changes, sync it to HTML + localStorage
    localStorage.setItem("snapfitTheme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
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
