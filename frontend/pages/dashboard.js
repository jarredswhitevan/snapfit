"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

/**
 * SNAPFIT Dashboard — Real-Time + Interactive Progress System
 * ------------------------------------------------------------
 * Users can now log calories, protein, and workouts.
 * Syncs instantly to Firestore with smooth feedback.
 */

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState("Athlete");
  const [progress, setProgress] = useState({
    calories: { current: 0, goal: 2400 },
    protein: { current: 0, goal: 180 },
    workouts: { current: 0, goal: 5 },
  });
  const [planTier, setPlanTier] = useState("free");
  const [isUpdating, setIsUpdating] = useState(false);

  // 🔥 Real-time sync from Firestore
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserName(data.name || user.displayName || "Athlete");
        if (data.progress) setProgress(data.progress);
      } else {
        await setDoc(userRef, {
          name: user.displayName || "Athlete",
          progress,
          createdAt: Date.now(),
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const profileRef = doc(db, "users", user.uid, "profile", "main");
    const unsub = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        setPlanTier(snap.data()?.planTier || "free");
      } else {
        setPlanTier("free");
      }
    });
    return () => unsub();
  }, [user]);

  // 🧠 Calculate percent for rings
  const calcPercent = (c, g) => Math.min(100, Math.round((c / g) * 100));

  // 📝 Handle update button
  const handleUpdate = async () => {
    if (!user) return;
    setIsUpdating(true);
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        progress: {
          calories: progress.calories,
          protein: progress.protein,
          workouts: progress.workouts,
        },
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setTimeout(() => setIsUpdating(false), 600);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">
        <p className="token-muted">Please log in to access your dashboard.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col pb-24">
      <AnimatedHeader userName={userName} />

      <main className="flex-1 px-5 mt-6 space-y-6">
        {/* PERFORMANCE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProgressCard
            title="Calories"
            subtitle={`${progress.calories.current} / ${progress.calories.goal} kcal`}
            percent={calcPercent(progress.calories.current, progress.calories.goal)}
            icon="🔥"
          />
          <ProgressCard
            title="Protein"
            subtitle={`${progress.protein.current}g / ${progress.protein.goal}g`}
            percent={calcPercent(progress.protein.current, progress.protein.goal)}
            icon="🥩"
          />
          <ProgressCard
            title="Workouts"
            subtitle={`${progress.workouts.current} / ${progress.workouts.goal}`}
            percent={calcPercent(progress.workouts.current, progress.workouts.goal)}
            icon="💪"
          />
        </div>

        {/* INPUT SECTION */}
        <div className="token-card border token-border rounded-xl p-5 mt-4 space-y-3">
          <h2 className="text-[var(--snap-green)] font-semibold mb-2">
            Update Progress
          </h2>
          <div className="flex flex-col gap-3">
            <InputRow
              label="Calories"
              value={progress.calories.current}
              onChange={(v) =>
                setProgress((p) => ({
                  ...p,
                  calories: { ...p.calories, current: Number(v) },
                }))
              }
            />
            <InputRow
              label="Protein"
              value={progress.protein.current}
              onChange={(v) =>
                setProgress((p) => ({
                  ...p,
                  protein: { ...p.protein, current: Number(v) },
                }))
              }
            />
            <InputRow
              label="Workouts"
              value={progress.workouts.current}
              onChange={(v) =>
                setProgress((p) => ({
                  ...p,
                  workouts: { ...p.workouts, current: Number(v) },
                }))
              }
            />
          </div>

          <motion.button
            onClick={handleUpdate}
            disabled={isUpdating}
            whileTap={{ scale: 0.97 }}
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-black ${
              isUpdating
                ? "bg-[var(--snap-green)]/50 cursor-not-allowed"
                : "bg-[var(--snap-green)] hover:opacity-90"
            }`}
          >
            {isUpdating ? "Saving..." : "Save Progress"}
          </motion.button>
        </div>

        {/* COACH INSIGHT */}
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
            {progress.calories.current / progress.calories.goal > 0.8
              ? "🔥 You’re on target — stay consistent and dominate your next session."
              : "⚡ You’re below goal — tighten nutrition and fuel performance."}
          </p>
        </motion.div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Navigation</h2>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {planTier === "free" ? "Free Tier" : planTier === "elite" ? "Elite" : "Premium"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Measurements", desc: "Log stats & track history", href: "/measurements", icon: "📏" },
              { title: "Goals", desc: "Update your macro goal", href: "/goals", icon: "🎯" },
              { title: "Meal Planner", desc: "AI-crafted meals", href: "/meal-planner", icon: "🍽️" },
              { title: "Grocery List", desc: "Smart shopping lists", href: "/grocery-list", icon: "🛒" },
              { title: "Workout Builder", desc: "Custom training", href: "/workout-builder", icon: "🏋️" },
              { title: "Daily Plan", desc: "Meals + training", href: "/daily-plan", icon: "📅" },
              { title: "Progress Photos", desc: "Upload + compare", href: "/progress-photos", icon: "📸" },
              { title: "Account / Subscription", desc: "Manage plan", href: "/account", icon: "💼" },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="border token-border token-card rounded-xl p-4 flex items-start gap-3 hover:border-[var(--snap-green)] transition"
              >
                <div className="text-2xl">{link.icon}</div>
                <div>
                  <p className="font-semibold">{link.title}</p>
                  <p className="text-sm token-muted">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MainNav />
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function InputRow({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <label className="text-sm token-muted">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 text-right bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-[var(--snap-green)] text-[var(--text)]"
      />
    </div>
  );
}

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
          Track your progress. Stay accountable. Train smarter.
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-[var(--snap-green)]/10 border border-[var(--snap-green)] flex items-center justify-center text-[var(--snap-green)] text-lg">
        ⚡
      </div>
    </motion.header>
  );
}

function ProgressCard({ title, subtitle, percent, icon }) {
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
          stroke="var(--snap-green)"
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

function MainNav() {
  const router = useRouter();
  const nav = [
    { name: "Dashboard", icon: "🏠", href: "/dashboard" },
    { name: "Daily Plan", icon: "📅", href: "/daily-plan" },
    { name: "Meal Planner", icon: "🍽️", href: "/meal-planner" },
    { name: "Settings", icon: "⚙️", href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t token-border token-card flex justify-around py-3 backdrop-blur-md">
      {nav.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex flex-col items-center text-xs transition ${
            router.pathname === item.href
              ? "text-[var(--snap-green)] font-semibold"
              : "token-muted hover:text-[var(--snap-green)]"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
