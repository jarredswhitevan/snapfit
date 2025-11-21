import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function DailyPlanPage() {
  const [user, authLoading] = useAuthState(auth);
  const [goal, setGoal] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [grocery, setGrocery] = useState(null);

  useEffect(() => {
    if (!user) {
      setGoal(null);
      setMealPlan(null);
      setWorkout(null);
      setGrocery(null);
      return;
    }
    const goalRef = doc(db, "users", user.uid, "goals", "current");
    const mealRef = doc(db, "users", user.uid, "mealPlans", "latest");
    const workoutRef = doc(db, "users", user.uid, "workouts", "latest");
    const groceryRef = doc(db, "users", user.uid, "groceryLists", "latest");

    const unsubGoal = onSnapshot(goalRef, (snap) => setGoal(snap.data() || null));
    const unsubMeal = onSnapshot(mealRef, (snap) => setMealPlan(snap.data()?.plan || null));
    const unsubWorkout = onSnapshot(workoutRef, (snap) => setWorkout(snap.data()?.plan || null));
    const unsubGrocery = onSnapshot(groceryRef, (snap) => setGrocery(snap.data()?.list || null));

    return () => {
      unsubGoal();
      unsubMeal();
      unsubWorkout();
      unsubGrocery();
    };
  }, [user]);

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
        <p className="text-lg">Log in to view your daily plan.</p>
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
          <p className="text-xs token-muted uppercase tracking-wide">Execution Map</p>
          <h1 className="text-2xl font-semibold">Daily Plan</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Macro target</h2>
            <span className="text-xs token-muted">
              {goal?.macroPlan?.calories ? `${goal.macroPlan.calories} kcal` : "Setup goals"}
            </span>
          </div>
          {goal?.macroPlan ? (
            <div className="grid grid-cols-3 gap-3 text-center">
              <MacroStat label="Protein" value={`${goal.macroPlan.protein_g} g`}>
                {goal.macroPlan.p_pct}%
              </MacroStat>
              <MacroStat label="Carbs" value={`${goal.macroPlan.carbs_g} g`}>
                {goal.macroPlan.c_pct}%
              </MacroStat>
              <MacroStat label="Fats" value={`${goal.macroPlan.fats_g} g`}>
                {goal.macroPlan.f_pct}%
              </MacroStat>
            </div>
          ) : (
            <p className="text-sm token-muted">
              No macro data yet. Complete the <Link className="text-[var(--snap-green)]" href="/goals">goal builder</Link>.
            </p>
          )}
        </section>

        <section className="token-card border token-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Meals</h2>
            <Link href="/meal-planner" className="text-sm text-[var(--snap-green)]">
              Update
            </Link>
          </div>
          {mealPlan ? (
            mealPlan.meals?.map((meal, idx) => (
              <article key={idx} className="border border-dashed token-border rounded-lg p-3">
                <p className="font-semibold">{meal.name}</p>
                <p className="text-sm token-muted">{meal.description}</p>
                <p className="text-xs mt-2">{meal.calories} kcal • {meal.protein}g P</p>
              </article>
            ))
          ) : (
            <p className="text-sm token-muted">Run the AI meal planner to populate this section.</p>
          )}
        </section>

        <section className="token-card border token-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Training</h2>
            <Link href="/workout-builder" className="text-sm text-[var(--snap-green)]">
              Update
            </Link>
          </div>
          {workout ? (
            workout.sessions?.map((session, idx) => (
              <article key={idx} className="border border-dashed token-border rounded-lg p-3">
                <p className="font-semibold">Day {session.day}: {session.title}</p>
                <p className="text-sm token-muted">Focus: {session.focus}</p>
                <p className="text-xs token-muted mt-1">Top sets: {session.topSets}</p>
              </article>
            ))
          ) : (
            <p className="text-sm token-muted">Generate a workout to unlock daily structure.</p>
          )}
        </section>

        <section className="token-card border token-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Reminders</h2>
            <Link href="/settings" className="text-sm text-[var(--snap-green)]">
              Adjust
            </Link>
          </div>
          <ul className="list-disc ml-5 space-y-1 text-sm token-muted">
            <li>Prep hydration: 3 liters minimum.</li>
            <li>Schedule {goal?.activity || "training"} sessions.</li>
            <li>Review grocery list before {grocery?.days ? `${grocery.days}-day` : "weekly"} reset.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function MacroStat({ label, value, children }) {
  return (
    <div className="border border-dashed token-border rounded-lg p-3">
      <p className="text-xs uppercase token-muted">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs token-muted">{children}</p>
    </div>
  );
}
