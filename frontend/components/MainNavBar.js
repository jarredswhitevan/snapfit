import { useRouter } from "next/router";

export default function MainNavBar() {
  const router = useRouter();
  const navItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Food", icon: "🍎", path: "/food" },
    { name: "Workouts", icon: "💪", path: "/workouts" },
    { name: "Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-white/90 dark:bg-black/90 border-t border-white/10 dark:border-white/10 py-3 backdrop-blur-md">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => router.push(item.path)}
          className={`flex flex-col items-center text-sm ${
            router.pathname === item.path
              ? "text-emerald-400 font-semibold"
              : "text-white/70"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[11px] mt-1">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
