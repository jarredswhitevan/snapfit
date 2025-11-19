import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const TIERS = {
  free: {
    label: "Free",
    price: "$0",
    perks: ["Basic dashboard", "Manual meal logging", "5 AI requests/day"],
  },
  premium: {
    label: "Premium",
    price: "$19.99/mo",
    perks: ["Unlimited AI", "Meal + workout builders", "Body progress tracking"],
  },
  elite: {
    label: "Elite",
    price: "$49.99/mo",
    perks: ["1-on-1 AI trainer", "Advanced coaching", "Full automation"],
  },
};

export default function AccountPage() {
  const [user, authLoading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const profileRef = doc(db, "users", user.uid, "profile", "main");
    const unsub = onSnapshot(profileRef, (snap) => setProfile(snap.data() || null));
    return () => unsub();
  }, [user]);

  const changePlan = async (tier) => {
    if (!user) return;
    setUpdating(true);
    try {
      const profileRef = doc(db, "users", user.uid, "profile", "main");
      await setDoc(
        profileRef,
        {
          planTier: tier,
          subscription: {
            ...(profile?.subscription || {}),
            tier,
            status: tier === "free" ? "free" : "active",
          },
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text)]">
        <p className="text-lg">Log in to manage your subscription.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  const currentTier = profile?.planTier || "free";
  const tierData = TIERS[currentTier] || TIERS.free;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <header className="px-5 py-6 border-b token-border flex items-center justify-between">
        <div>
          <p className="text-xs token-muted uppercase tracking-wide">Account</p>
          <h1 className="text-2xl font-semibold">Subscription</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5">
          <p className="text-sm token-muted">Current plan</p>
          <h2 className="text-3xl font-bold">{tierData.label}</h2>
          <p className="text-sm token-muted mt-1">{tierData.price}</p>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {Object.entries(TIERS).map(([tier, data]) => (
            <article key={tier} className={`token-card border token-border rounded-xl p-5 ${tier === currentTier ? "border-[var(--snap-green)]" : ""}`}>
              <p className="text-sm token-muted">{data.price}</p>
              <h3 className="text-xl font-semibold mb-3">{data.label}</h3>
              <ul className="text-sm token-muted space-y-1 mb-4">
                {data.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
              <button
                onClick={() => changePlan(tier)}
                disabled={tier === currentTier || updating}
                className={`w-full py-2 rounded-xl font-semibold ${
                  tier === currentTier
                    ? "bg-[var(--snap-green)]/30 text-black"
                    : "bg-[var(--snap-green)] text-black hover:opacity-90"
                }`}
              >
                {tier === currentTier ? "Active" : updating ? "Updating..." : "Switch"}
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
