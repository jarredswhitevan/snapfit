import NavBar from '../components/NavBar'
import { useState } from 'react'

const WEBHOOK = "https://script.google.com/macros/s/AKfycbwE-zY-fhzjMaGsIx3dx1QCUrigPJtcEjy8jTgKBvCLgP6ahVWa_wRlN-GU-aRWdHGG/exec";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr(""); setLoading(true);
    try{
      const params = new URLSearchParams({ email });
      const resp = await fetch(WEBHOOK, { method: "POST", headers: { "Content-Type":"application/x-www-form-urlencoded" }, body: params.toString() });
      if(!resp.ok) throw new Error("Network error");
      window.location.href = "/thanks";
    }catch(ex){
      console.error(ex);
      setErr("Something went wrong. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Join the SnapFIT Waitlist</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Be the first to get access.</p>

        <form onSubmit={submit} className="mt-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white"
          />
          {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
          <button
            disabled={loading}
            className="mt-4 w-full px-4 py-2 rounded-md bg-[var(--snap-green)] text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Joining..." : "Join Early Access"}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          By joining, you agree to receive early-access updates. You can unsubscribe anytime.
        </p>
      </main>
    </div>
  );
}
