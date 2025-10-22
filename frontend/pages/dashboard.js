"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
