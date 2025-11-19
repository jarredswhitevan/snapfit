import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function GroceryListPage() {
  const [user, authLoading] = useAuthState(auth);
  const [form, setForm] = useState({
    diet: "balanced",
    days: 5,
    calories: 2300,
    restrictions: "",
  });
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const generateList = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const resp = await fetch("/api/grocery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to build grocery list");
      setList(data.list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <p className="text-lg">Log in to access AI grocery automation.</p>
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
          <p className="text-xs token-muted uppercase tracking-wide">AI Shopping</p>
          <h1 className="text-2xl font-semibold">Grocery List</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Build a training-week list</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm token-muted mb-1">Diet type</label>
              <select
                className="input w-full"
                value={form.diet}
                onChange={(e) => updateField("diet", e.target.value)}
              >
                <option value="balanced">Balanced performance</option>
                <option value="highprotein">High protein</option>
                <option value="plant">Plant-forward</option>
              </select>
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Days to prep</label>
              <input
                className="input w-full"
                type="number"
                value={form.days}
                onChange={(e) => updateField("days", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Daily calories</label>
              <input
                className="input w-full"
                type="number"
                value={form.calories}
                onChange={(e) => updateField("calories", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm token-muted mb-1">Restrictions</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.restrictions}
                onChange={(e) => updateField("restrictions", e.target.value)}
                placeholder="e.g. gluten-free, no peanuts"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={generateList}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-black ${
                loading ? "bg-[var(--snap-green)]/50" : "bg-[var(--snap-green)] hover:opacity-90"
              }`}
            >
              {loading ? "Generating..." : "Generate grocery list"}
            </button>
          </div>
        </section>

        {list && (
          <section className="token-card border token-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Shopping list</h2>
              <span className="text-xs token-muted">Covers {list.days || form.days} days</span>
            </div>
            <p className="text-sm token-muted">{list.summary}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {list.categories?.map((cat) => (
                <article key={cat.name} className="border border-dashed token-border rounded-lg p-3">
                  <p className="font-semibold mb-2">{cat.name}</p>
                  <ul className="text-sm list-disc ml-4 space-y-1">
                    {cat.items?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
