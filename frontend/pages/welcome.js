import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Welcome.js
 * -----------------------------
 * - Shown right after Step5 (trial start)
 * - Displays "You're In — Your AI Coach Is Ready."
 * - Auto-redirects to /dashboard after 2 seconds
 * - Tailwind mobile-first layout
 */

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center px-6">
      <h1 className="text-3xl font-semibold mb-3">
        🔥 You&apos;re In — Your AI Coach Is Ready.
      </h1>
      <p className="text-white/60 text-sm">
        Preparing your dashboard...
      </p>
    </div>
  );
}
