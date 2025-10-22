import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import NavBar from "../../components/NavBar";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";




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
{step === 3 && <Step3 next={() => setStep(4)} back={() => setStep(2)} />}
{step === 4 && <Step4 next={() => setStep(5)} back={() => setStep(3)} />}
{step === 5 && <Step5 back={() => setStep(4)} />}

  
      {/* Step2, Step3, Step4 will go here later */}
    </div>
  );
}
