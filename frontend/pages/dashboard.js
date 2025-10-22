"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * SNAPFIT Dashboard — Premium Dark Mode Version
 * ----------------------------------------------
 * AI-powered aesthetic with animation and progress rings.
 */

export default function Dashboard() {
  const [userName, setUserName] = useState("Athlete");

  useEffect(() => {
    const name = localStorage.getItem("snapfitUserName") || "Athlete";
    setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col pb-24">
      {/* HEADER */}
      <AnimatedHeader userName={userName} />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-5 mt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProgressCard
            title="Calories"
            subtitle="2,000 / 2,400 kcal"
            percent={82}
            color="var(--snap-green)"
            icon="🔥"
          />
          <ProgressCard
            title="Protein"
            subtitle="160g / 180g"
            percent={89}
            color="#22c55e"
            icon="🥩"
          />
          <ProgressCard
            title="Workouts"
            subtitle="4 / 5 this week"
            percent={80}
            color="#22c55e"
            icon="💪"
          />
        </div>

        <motion.div
          className="token-card border token-border rounded-xl p-5 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[var(--snap-green)] font-semibold mb-2">
            Coach’s Insight
          </h2>
          <p className="text-sm token-muted leading-relaxed">
            You’re on track. Maintain your protein goal and stay consistent with
            workouts — progress compounds.
          </p>
        </motion.div>
      </main>

      <MainNav />
    </div>
  );
}

/* ----------------- COMPONENTS ------------------ */

function AnimatedHeader({ userName }) {
  return (
    <motion.header
      className="px-5 pt-6 pb-4 border-b token-border bg-[var(--card)] flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <h1 className="text-lg font-semibold">
          Welcome back,{" "}
          <span className="text-[var(--snap-green)]">{userName}</span>
        </h1>
        <p className="text-xs token-muted mt-1">
          Train smarter. Recover faster. Perform better.
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-[var(--snap-green)]/10 border border-[var(--snap-green)] flex items-center justify-center text-[var(--snap-green)] text-lg">
        ⚡
      </div>
    </motion.header>
  );
}

/* ----------------- PROGRESS CARD ------------------ */

function ProgressCard({ title, subtitle, percent, color, icon }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <motion.div
      className="token-card border token-border rounded-xl p-4 flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h3 className="font-semibold text-base mb-1 flex items-center gap-1">
          {icon} {title}
        </h3>
        <p className="text-sm token-muted">{subtitle}</p>
      </div>

      {/* Circular Progress Ring */}
      <svg
        className="w-16 h-16 -rotate-90"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="var(--border)"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
        />
      </svg>
    </motion.div>
  );
}

/* ----------------- NAV BAR ------------------ */

function MainNav() {
  const nav = [
    { name: "Dashboard", icon: "🏠", active: true },
    { name: "Food", icon: "🍎" },
    { name: "Workouts", icon: "💪" },
    { name: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t token-border token-card flex justify-around py-3 backdrop-blur-md">
      {nav.map((item) => (
        <button
          key={item.name}
          className={`flex flex-col items-center text-xs ${
            item.active
              ? "text-[var(--snap-green)] font-semibold"
              : "token-muted hover:text-[var(--snap-green)]"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="mt-1">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
