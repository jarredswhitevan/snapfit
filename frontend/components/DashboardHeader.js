export default function DashboardHeader({ userName }) {
  return (
    <header className="pt-8 pb-4 px-5 border-b border-white/10 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] backdrop-blur-md">
      <h1 className="text-lg font-semibold">
        🔥 Welcome back, <span className="text-emerald-400">{userName}</span>
      </h1>
      <p className="text-xs text-white/70 dark:text-white/60 mt-1">
        Your AI Coach is ready — let’s get to work.
      </p>
    </header>
  );
}
