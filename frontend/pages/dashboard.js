import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import MainNavBar from "../components/MainNavBar";

/**
 * Dashboard.js
 * -------------
 * Hybrid layout (Header + Cards + Bottom Nav)
 * Renders core app sections in a mobile-first layout.
 */

export default function Dashboard() {
  const [userName, setUserName] = useState("Athlete");

  useEffect(() => {
    // Pull name from localStorage or Firebase later
    const name = localStorage.getItem("snapfitUserName") || "Athlete";
    setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col pb-24">
      <DashboardHeader userName={userName} />

      {/* Main content */}
      <main className="flex-1 px-5 mt-6 space-y-4">
        <Card title="Daily Macros" subtitle="Calories, Protein, Carbs, Fats" icon="🍎" />
        <Card title="Workout Plan" subtitle="Next session: Push Day" icon="💪" />
        <Card title="Progress" subtitle="Weight, Photos, Habits" icon="📈" />
      </main>

      <MainNavBar />
    </div>
  );
}

function Card({ title, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] p-4 shadow-sm active:scale-[0.99] transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-emerald-400 font-medium">View</span>

