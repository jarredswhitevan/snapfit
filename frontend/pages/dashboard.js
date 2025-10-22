"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * SNAPFIT Dashboard — Live Progress + Firebase Sync
 * -------------------------------------------------
 * Dark-mode base, smooth animations, and live Firestore data sync.
 */

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState("Athlete");
  const [progress, setProgress] = useState({
    calories: { current: 0, goal: 2400 },
    protein: { current: 0, goal: 180 },
    workouts: { current: 0, goal: 5 },
  });

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const fetchUserData = async () => {
      try {
        const snap = await getDoc(userRef);
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
      } catch (err) {
        console.error("Firestore load failed:", err);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">
        <p className="token-muted">Please log in to access your dashboard.</p>
      </div>
    );
  }

  const calcPercent = (c, g) => Math.min(100, Math.round((c / g) * 100));

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col pb-24">
      <AnimatedHeader userName={userName} />

      <main className="flex-1 px-5 mt-6 space-y-6">
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
            subtitle={`${progress.workouts.current} / ${progress.workouts.goal} this week`}
            percent={calcPercent(progress.workouts.current, progress.workouts.goal)}
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
            {progress.calories.current / progress.calories.goal > 0.8
              ? "Perfect pace. Keep your protein high and hit that last workout."
              : "Let’s tighten nutritio
