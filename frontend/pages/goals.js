import NavBar from "../components/NavBar";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Goals() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ✅ SIMPLE PAGE THAT CAN'T CRASH
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <NavBar />
      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Goals Page Working ✅</h1>
        <p>This simple version is now stable. Next we’ll add form + macros.</p>
      </main>
    </div>
  );
}
