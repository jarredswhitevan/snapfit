import { useRouter } from "next/router";
import useTheme from "../../hooks/useTheme";

const { theme, toggleTheme } = useTheme();
export default function NavBarOnboarding({ showBack = true }) {
  const router = useRouter();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 px-4 py-3 flex items-center"
    >
      {/* Back Button */}
      <div className="w-1/3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="text-white text-lg font-medium"
          >
            ◀
          </button>
        )}
      </div>

      {/* Logo */}
      <div className="w-1/3 flex justify-center">
        <h1 className="font-semibold tracking-wide text-white flex items-center gap-1">
          <span className="text-emerald-400">🔥</span> SNAPFIT
        </h1>
      </div>

      {/* Spacer */}
      <div className="w-1/3"></div>
    </nav>
  );
}
