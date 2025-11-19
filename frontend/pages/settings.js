import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useUnits } from "../contexts/UnitContext";

export default function SettingsPage() {
  const [user, authLoading] = useAuthState(auth);
  const { units, setWeightUnit, setLengthUnit } = useUnits();
  const [profile, setProfile] = useState({ name: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) {
      setProfile({ name: "" });
      return;
    }
    const loadProfile = async () => {
      const userDoc = doc(db, "users", user.uid);
      const snap = await getDoc(userDoc);
      setProfile({ name: snap.data()?.name || user.displayName || "" });
    };
    loadProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setStatus("Saving...");
    const payload = {
      name: profile.name,
      updatedAt: Date.now(),
    };
    await Promise.all([
      setDoc(doc(db, "users", user.uid), payload, { merge: true }),
      setDoc(doc(db, "users", user.uid, "profile", "main"), payload, { merge: true }),
    ]);
    setStatus("Saved");
    setTimeout(() => setStatus(""), 1500);
  };

  const resetPassword = async () => {
    if (!user?.email) return;
    await sendPasswordResetEmail(auth, user.email);
    setStatus("Reset link sent to your email");
    setTimeout(() => setStatus(""), 2000);
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
        <p className="text-lg">Log in to manage settings.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <header className="px-5 py-6 border-b token-border flex items-center justify-between">
        <div>
          <p className="text-xs token-muted uppercase tracking-wide">System</p>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5 space-y-3">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div>
            <label className="block text-sm token-muted mb-1">Display name</label>
            <input
              className="input w-full"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={saveProfile} className="btn-primary">
              Save
            </button>
            <button onClick={resetPassword} className="px-4 py-2 rounded-xl border token-border">
              Send reset email
            </button>
          </div>
          {status && <p className="text-sm token-muted">{status}</p>}
        </section>

        <section className="token-card border token-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Units</h2>
            <Link href="/goals" className="text-sm text-[var(--snap-green)]">
              Update goals
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm token-muted mb-2">Weight</p>
              <div className="flex gap-2">
                {[
                  { id: "lbs", label: "lbs" },
                  { id: "kg", label: "kg" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setWeightUnit(option.id)}
                    className={`flex-1 py-2 rounded-xl border ${
                      units.weight === option.id
                        ? "border-[var(--snap-green)] bg-[var(--snap-green)] text-black"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm token-muted mb-2">Height</p>
              <div className="flex gap-2">
                {[
                  { id: "imperial", label: "ft/in" },
                  { id: "metric", label: "cm" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setLengthUnit(option.id)}
                    className={`flex-1 py-2 rounded-xl border ${
                      units.length === option.id
                        ? "border-[var(--snap-green)] bg-[var(--snap-green)] text-black"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
