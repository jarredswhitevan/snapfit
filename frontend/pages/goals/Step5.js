import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

/**
 * Step5 — Pricing & Trial
 * - Shows Monthly ($19.99) and Yearly ($180) plans
 * - 7-day free trial highlighted
 * - "Start Free Trial" -> simulates purchase, sets localStorage, routes to /dashboard
 * - Mobile-first Tailwind UI, bold CTA, trust markers
 *
 * Storage keys set on success:
 *  - snapfitPlan: { plan: "monthly" | "yearly", price: number, trialDays: 7, startedAt: ISOString }
 *  - snapfitIsPro: "true"
 *  - snapfitTrialEndsAt: ISOString
 */

const PLANS = {
  monthly: { id: "monthly", label: "Monthly", price: 19.99, sub: "$19.99 / mo" },
  yearly: { id: "yearly", label: "Yearly", price: 180, sub: "$180 / yr • Save 25%" },
};

export default function Step5() {
  const router = useRouter();
  const [selected, setSelected] = useState(PLANS.monthly.id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user already Pro, send them to dashboard
    if (typeof window !== "undefined") {
      const isPro = localStorage.getItem("snapfitIsPro") === "true";
      if (isPro) router.replace("/dashboard");
    }
  }, [router]);

  const startTrial = () => {
    setLoading(true);
    try {
      const plan = PLANS[selected];
      const now = new Date();
      const trialEnds = new Date(now);
      trialEnds.setDate(trialEnds.getDate() + 7);

      const planPayload = {
        plan: plan.id,
        price: plan.price,
        trialDays: 7,
        startedAt: now.toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("snapfitPlan", JSON.stringify(planPayload));
        localStorage.setItem("snapfitIsPro", "true");
        localStorage.setItem("snapfitTrialEndsAt", trialEnds.toISOString());
      }

      // Simulated success — later replace with Stripe
      router.push("/dashboard");
    } catch (e) {
      console.error("Trial start error:", e);
      setLoading(false);
      alert("Something went wrong starting your trial. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>SnapFIT — Start Your 7-Day Free Trial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-md px-5 pt-10 pb-24">
          {/* Header */}
          <header className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              7-Day Free Trial
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Unlock Pro Coaching</h1>
            <p className="mt-2 text-sm text-white/70">
              Train smarter with AI. Personalized macros, smart workouts, and effortless food logging.
            </p>
          </header>

          {/* Plans */}
          <section className="space-y-4">
            {/* Yearly (featured) */}
            <PlanCard
              active={selected === PLANS.yearly.id}
              onSelect={() => setSelected(PLANS.yearly.id)}
              badge="Best Value"
              title="Yearly"
              subtitle="$180 / yr • Save 25%"
              bullets={[
                "7-day free trial",
                "AI macro engine + workout generator",
                "Food photo logging",
                "Priority updates & features",
              ]}
            />

            {/* Monthly */}
            <PlanCard
              active={selected === PLANS.monthly.id}
              onSelect={() => setSelected(PLANS.monthly.id)}
              title="Monthly"
              subtitle="$19.99 / mo"
              bullets={[
                "7-day free trial",
                "AI macro engine + workout generator",
                "Food photo logging",
                "Cancel anytime",
              ]}
            />
          </section>

          {/* CTA */}
          <div className="mt-8">
            <button
              onClick={startTrial}
              disabled={loading}
              className={`w-full rounded-xl px-4 py-4 text-center text-base font-semibold transition-all ${
                loading
                  ? "bg-emerald-600/60"
                  : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99]"
              }`}
            >
              {loading ? "Starting your trial..." : "Start Free Trial"}
            </button>
            <p className="mt-3 text-center text-xs text-white/60">
              No charge today. Cancel within 7 days to avoid being charged.
            </p>
          </div>

          {/* Trust / Guarantees */}
          <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/80">
            <TrustItem title="Secure & Private" desc="Your data stays with you." />
            <TrustItem title="Cancel Anytime" desc="No contracts. No hassle." />
            <TrustItem title="Results-Focused" desc="We coach. You execute." />
          </ul>

          {/* Footer nav */}
          <footer className="mt-10 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-white/60 underline underline-offset-4"
            >
              Back
            </button>
          </footer>
        </div>
      </main>
    </>
  );
}

function PlanCard({ active, onSelect, badge, title, subtitle, bullets }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-emerald-400 bg-white/[0.03] shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {badge ? (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-sm text-white/70">{subtitle}</p>
        </div>
        <div
          aria-hidden
          className={`mt-1 h-5 w-5 rounded-full border-2 ${
            active ? "border-emerald-400" : "border-white/30"
          } flex items-center justify-center`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              active ? "bg-emerald-400" : "bg-transparent"
            }`}
          />
        </div>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-white/80">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

function TrustItem({ title, desc }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="font-medium">{title}</p>
      <p className="text-xs text-white/60">{desc}</p>
    </li>
  );
}
