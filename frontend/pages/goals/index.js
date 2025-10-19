import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import NavBar from "../../components/NavBar";
import Step1 from "./Step1";
import Step2 from "./Step2";


export default function Goals() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <NavBar />
      {step === 1 && <Step1 next={() => setStep(2)} />}
      {step === 2 && <Step2 next={() => setStep(3)} back={() => setStep(1)} />}
      {/* Step2, Step3, Step4 will go here later */}
    </div>
  );
}
