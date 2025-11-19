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

  const startTrial = async () => {
    setLoading(true);
    const selected =
      plan === "monthly"
        ? { id: "monthly", price: 19.99 }
        : { id: "yearly", price: 180 };

    const now = new Date();
    const ends = new Date(now);
    ends.setDate(ends.getDate() + 7);

    if (typeof window !== "undefined") {
      localStorage.setItem("snapfitPlan", JSON.stringify(selected));
      localStorage.setItem("snapfitIsPro", "true");
      localStorage.setItem("snapfitTrialEndsAt", ends.toISOString());
    }

    if (user) {
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
    }

    // Simulated checkout success
    setTimeout(() => router.push("/welcome"), 600);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 px-6">
      <header className="text-center mb-10">
        <h1 className="text-2xl font-semibold mb-2">Start Your 7-Day Free Trial</h1>
        <p className="text-sm text-white/70">
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
      <div className="mt-8">
        <button
          onClick={startTrial}
          disabled={loading}
          className={`w-full rounded-xl py-4 text-center font-semibold transition-all ${
            loading
              ? "bg-emerald-600/60"
              : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99]"
          }`}
        >
          {loading ? "Starting Trial..." : "Start Free Trial"}
        </button>
        <p className="text-xs text-center text-white/60 mt-3">
          No charge today. Cancel anytime within 7 days.
        </p>
      </div>

      {/* Back Button */}
      {back && (
        <div className="text-center mt-10">
          <button
            onClick={back}
            className="text-sm text-white/60 underline underline-offset-4"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

function PlanCard({ title, subtitle, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? "border-emerald-400 bg-white/[0.04] shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
          : "border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-white/70">{subtitle}</p>
      {active && (
        <p className="text-xs text-emerald-400 mt-1 font-medium">Selected</p>
      )}
    </button>
  );
}
