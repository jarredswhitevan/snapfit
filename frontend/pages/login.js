import { useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function loginWithEmail() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/goals";
    } catch (err) {
      setError("Invalid login. Try again.");
    }
  }

  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = "/goals";
    } catch (err) {
      setError("Google login failed. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--snap-green)]">Log In</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={loginWithGoogle}
          className="w-full bg-white text-black py-2 rounded hover:opacity-90 mb-4 font-semibold"
        >
          Continue with Google
        </button>

        <button
          className="w-full bg-gray-800 text-gray-400 py-2 rounded mb-4 font-semibold border border-gray-700 cursor-not-allowed"
          disabled
        >
           Sign in with Apple (Coming Soon)
        </button>

        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-700" />
          <span className="text-gray-500 mx-2">OR</span>
          <div className="flex-grow h-px bg-gray-700" />
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-black border border-gray-700 p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-black border border-gray-700 p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={loginWithEmail}
          className="w-full bg-[var(--snap-green)] text-black py-2 rounded font-semibold hover:opacity-90"
        >
          Log In
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[var(--snap-green)]">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
