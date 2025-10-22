"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferred = saved || "dark";
    setTheme(preferred);

    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(preferred === "dark" ? "theme-dark" : "theme-light");
  }, []);

  // Apply changes instantly when toggled
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
