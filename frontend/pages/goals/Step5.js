import React, { useState } from "react";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

/**
 * Step5 — Pricing & 7-Day Trial
 * --------------------------------
 * - Presents Monthly ($19.99) & Yearly ($180) plans
 * - 7-day free trial highlighted
 * - Simulates purchase → redirect to /welcome (Commit #7)
 * - Stores trial info in localStorage
 * - Tailwind mobile-first design
 */

export default function Step5({ back, user }) {
  const router = useRouter();
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startTrial = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    const selected =
      plan === "monthly"
        ? { id: "monthly", price: 19.99 }
        : { id: "yearly", price: 180 };

    const now = new Date();
    const ends = new Date(now);
    ends.setDate(ends.getDate() + 7);

    try {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("snapfitPlan", JSON.stringify(selected));
          localStorage.setItem("snapfitIsPro", "true");
          localStorage.setItem("snapfitTrialEndsAt", ends.toISOString());
        } catch (storageErr) {
          console.error("Failed to persist plan locally", storageErr);
          setError("Unable to save your plan locally. Please allow storage access.");
          setLoading(false);
          return;
        }
      }

      if (user) {
        try {
          const profileRef = doc(db, "users", user.uid, "profile", "main");
          await setDoc(
            profileRef,
            {
              planTier: "premium",
              subscription: {
                tier: selected.id,
                price: selected.price,
                status: "trial",
                trialEndsAt: ends.toISOString(),
              },
              updatedAt: Date.now(),
            },
            { merge: true }
          );
        } catch (syncErr) {
          console.error("Failed to sync subscription", syncErr);
          setError(
            "We couldn't sync with the cloud yet, but your trial is active locally."
          );
        }
      }

      setTimeout(() => router.push("/welcome"), 300);
    } catch (err) {
      console.error("Failed to start trial", err);
      setError("Unable to start trial. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen token-bg token-text pt-16 px-6 pb-10 transition-colors">
      <div className="max-w-2xl mx-auto w-full">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-semibold mb-2">Start Your 7-Day Free Trial</h1>
          <p className="text-sm text-[var(--muted)]">
            Unlock full AI coaching. Cancel anytime before day 7.
          </p>
        </header>

        {/* Plan Selector */}
        <div className="space-y-4">
          <PlanCard
            active={plan === "yearly"}
            title="Yearly Plan"
            subtitle="$180 / year • Save 25%"
            onClick={() => setPlan("yearly")}
          />
          <PlanCard
            active={plan === "monthly"}
            title="Monthly Plan"
            subtitle="$19.99 / month"
            onClick={() => setPlan("monthly")}
          />
        </div>

        {/* CTA */}
        <div className="mt-8 space-y-3">
          <button
            onClick={startTrial}
            disabled={loading}
            className={`w-full rounded-xl py-4 text-center font-semibold transition-all border border-transparent ${
              loading
                ? "bg-[var(--snap-green)]/60 text-black cursor-wait"
                : "bg-[var(--snap-green)] text-black hover:opacity-90 active:scale-[0.99]"
            }`}
          >
            {loading ? "Starting Trial..." : "Start Free Trial"}
          </button>
          <p className="text-xs text-center text-[var(--muted)]">
            No charge today. Cancel anytime within 7 days.
          </p>
          {error && (
            <p className="text-center text-sm text-red-500" role="status" aria-live="polite">
              {error}
            </p>
          )}
        </div>

        {/* Back Button */}
        {back && (
          <div className="text-center mt-10">
            <button
              onClick={back}
              className="text-sm text-[var(--muted)] underline underline-offset-4"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ title, subtitle, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border token-border token-card transition-all p-4 ${
        active
          ? "ring-2 ring-[var(--snap-green)] bg-[var(--subtle)]"
          : "hover:border-[var(--snap-green)]/70"
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{subtitle}</p>
      {active && (
        <p className="text-xs text-[var(--snap-green)] mt-1 font-medium">Selected</p>
      )}
    </button>
  );
}
