// frontend/pages/goals/Step5.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Firebase (safe import; page still works if user isn't logged in)
import { auth, db } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

const PLANS = {
  FREE: "free",
  PREMIUM_MONTHLY: "premium_monthly",
  PREMIUM_YEARLY: "premium_yearly",
};

export default function Step5() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selection, setSelection] = useState(PLANS.PREMIUM_MONTHLY);

  useEffect(() => {
    setMounted(true);
    router.prefetch("/dashboard");
  }, [router]);

  // Prime with any previous choice (keeps UI snappy)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("snapfitPlan");
    if (saved && Object.values(PLANS).includes(saved)) {
      setSelection(saved);
    }
  }, []);

  const tiers = useMemo(
    () => [
      {
        key: PLANS.FREE,
        title: "Free",
        price: "$0",
        perks: ["Onboarding + macros", "Basic dashboard"],
      },
      {
        key: PLANS.PREMIUM_MONTHLY,
        title: "Premium",
        price: "$19.99/mo",
        perks: ["AI Meal Planner + Grocery", "Personalized Workouts", "Save & Sync"],
        highlight: true,
      },
      {
        key: PLANS.PREMIUM_YEARLY,
        title: "Premium Yearly",
        price: "$180/yr",
        sub: "Save ~25%",
        perks: ["Everything in Premium", "Best value"],
      },
    ],
    []
  );

  async function writePlan(uid, plan) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { plan, updatedAt: Date.now() });
    } else {
      await setDoc(ref, { plan, createdAt: Date.now() });
    }
  }

  async function handleStart(e) {
    e?.preventDefault?.();
    if (saving) return;

    setSaving(true);

    // Optimistic local cache so the app behaves even if network is slow
    try {
      localStorage.setItem("snapfitPlan", selection);
    } catch {}

    // Attempt Firestore write but don't let it block navigation
    const writePromise =
      user?.uid ? writePlan(user.uid, selection) : Promise.resolve();

    // 3s timeout safety net so we never “spin forever”
    const timeout = new Promise((resolve) =>
      setTimeout(resolve, 3000, "timeout")
    );

    try {
      await Promise.race([writePromise, timeout]);
    } catch (err) {
      // If security rules/network fail, we still continue
      // (dashboard will read localStorage and render correctly)
      console.error("Plan write failed (continuing):", err);
    }

    // Hard navigate to ensure route change even if React state is mid-update
    router.replace("/dashboard");
    // Extra safety: if router stalls for any reason, force a location change
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.replace("/dashboard");
      }
    }, 1500);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-semibold">Choose Your Plan</h1>
        <p className="text-xs token-muted mt-1">7-day free trial on Premium.</p>
      </header>

      <main className="px-5 py-4 grid gap-4">
        {tiers.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSelection(t.key)}
            className={`text-left token-card border token-border rounded-xl p-4 ${
              selection === t.key ? "ring-1 ring-[var(--snap-green)]" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm token-muted">
                  {t.price} {t.sub ? `• ${t.sub}` : ""}
                </div>
              </div>
              <input
                type="radio"
                aria-label={`select ${t.title}`}
                checked={selection === t.key}
                onChange={() => setSelection(t.key)}
              />
            </div>
            <ul className="mt-3 text-sm token-muted list-disc pl-5 space-y-1">
              {t.perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </button>
        ))}

        <button
          type="button"
          onClick={handleStart}
          disabled={saving}
          className={`w-full mt-2 py-3 rounded-xl font-semibold text-black ${
            saving ? "bg-[var(--snap-green)]/70" : "bg-[var(--snap-green)] hover:opacity-90"
          }`}
        >
          {saving ? "Starting your trial…" : "Start Free Trial"}
        </button>

        <div className="text-center mt-2">
          <Link href="/dashboard" className="text-sm token-muted underline">
            Skip for now
          </Link>
        </div>
      </main>
    </div>
  );
}
