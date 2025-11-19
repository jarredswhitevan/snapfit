import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useUnits } from "../contexts/UnitContext";

export default function MeasurementsPage() {
  const [user, authLoading] = useAuthState(auth);
  const { units } = useUnits();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    weight: "",
    waist: "",
    chest: "",
    hips: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }
    const measurementsRef = collection(db, "users", user.uid, "measurements");
    const q = query(measurementsRef, orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(rows);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!form.weight) {
      setError("Enter your current weight.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "measurements"), {
        ...form,
        weightUnit: units.weight,
        lengthUnit: units.length,
        createdAt: serverTimestamp(),
      });
      setForm({ weight: "", waist: "", chest: "", hips: "", notes: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to save measurement.");
    } finally {
      setSaving(false);
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
        <p className="text-lg">Log in to track measurements.</p>
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
          <p className="text-xs token-muted uppercase tracking-wide">Body Metrics</p>
          <h1 className="text-2xl font-semibold">Measurements</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Log new entry</h2>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field
              label={`Weight (${units.weight})`}
              value={form.weight}
              onChange={(e) => updateField("weight", e.target.value)}
            />
            <Field
              label={`Waist (${units.length === "metric" ? "cm" : "in"})`}
              value={form.waist}
              onChange={(e) => updateField("waist", e.target.value)}
            />
            <Field
              label={`Chest (${units.length === "metric" ? "cm" : "in"})`}
              value={form.chest}
              onChange={(e) => updateField("chest", e.target.value)}
            />
            <Field
              label={`Hips (${units.length === "metric" ? "cm" : "in"})`}
              value={form.hips}
              onChange={(e) => updateField("hips", e.target.value)}
            />
            <div>
              <label className="block text-sm token-muted mb-1">Notes</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Energy, training, anything notable"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 rounded-xl font-semibold text-black ${
                saving ? "bg-[var(--snap-green)]/50" : "bg-[var(--snap-green)] hover:opacity-90"
              }`}
            >
              {saving ? "Saving..." : "Save Measurement"}
            </button>
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">History</h2>
            <span className="text-xs token-muted">Last 10 entries</span>
          </div>
          {loading ? (
            <p className="token-muted">Loading history...</p>
          ) : entries.length === 0 ? (
            <p className="token-muted">No measurements yet.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <article key={entry.id} className="token-card border token-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">
                      {entry.weight}
                      <span className="text-sm token-muted ml-1">{entry.weightUnit || units.weight}</span>
                    </p>
                    <p className="text-xs token-muted">
                      {entry.createdAt?.toDate?.().toLocaleDateString?.() || "Pending sync"}
                    </p>
                  </div>
                  <div className="text-sm grid grid-cols-2 gap-2 token-muted">
                    <span>Waist: {entry.waist || "—"}</span>
                    <span>Chest: {entry.chest || "—"}</span>
                    <span>Hips: {entry.hips || "—"}</span>
                    <span>Notes: {entry.notes || "—"}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm token-muted mb-1">{label}</label>
      <input className="input w-full" value={value} onChange={onChange} type="number" />
    </div>
  );
}
