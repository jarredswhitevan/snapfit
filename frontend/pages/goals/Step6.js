import React from "react";
import { useRouter } from "next/router";

export default function Step6({ plan }) {
  const router = useRouter();
  const tierLabel = plan?.id === "yearly" ? "Yearly Plan" : "Monthly Plan";

  return (
    <div className="min-h-screen token-bg token-text pt-16 px-6 pb-12 flex items-center justify-center">
      <div className="max-w-xl w-full text-center space-y-6 token-card border token-border rounded-3xl p-8">
        <div className="w-16 h-16 rounded-full bg-[var(--snap-green)]/15 mx-auto flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-[var(--snap-green)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">All set</p>
          <h1 className="text-3xl font-semibold mt-2">Trial Activated</h1>
          <p className="text-base text-[var(--muted)] mt-3">
            You're locked into the {tierLabel} with full SnapFIT access for the next 7 days.
            Check your dashboard for today's plan and start tracking progress now.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.replace("/dashboard")}
            className="w-full rounded-xl bg-[var(--snap-green)] text-black font-semibold py-3 hover:opacity-95 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/daily-plan")}
            className="w-full rounded-xl token-card border token-border py-3 font-semibold hover:border-[var(--snap-green)]/70 transition"
          >
            View Daily Plan
          </button>
        </div>

        <p className="text-xs text-[var(--muted)]">
          Need to adjust anything? You can update goals anytime from Settings → Goals.
        </p>
      </div>
    </div>
  );
}
