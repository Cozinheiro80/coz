import { useEffect, useState } from "react";
import { Menu, MessageCircle, Moon, Sun } from "lucide-react";
import { USER_CONFIG } from "../utils/config";

type Theme = "dark" | "light";

type HeaderProps = {
  onToggleSidebar: () => void;
  onToggleGuestbook: () => void;
  theme: Theme;
  onToggleTheme: () => void;
};

const Header = ({
  onToggleSidebar,
  onToggleGuestbook,
  theme,
  onToggleTheme,
}: HeaderProps) => {
  const isDark = theme === "dark";
  const [uptime, setUptime] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateUptime = () => {
      const diff = Date.now() - new Date(USER_CONFIG.birthDate).getTime();
      setUptime({
        years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
        days: Math.floor((diff / (1000 * 60 * 60 * 24)) % 365.25),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };
    calculateUptime();
    const interval = setInterval(calculateUptime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`flex justify-between items-center py-2.5 px-2.5 sm:px-3 md:p-4 backdrop-blur border rounded-t-xl md:rounded-xl mb-3 md:mb-6 shadow-lg relative z-20 ${
        isDark
          ? "bg-slate-900/80 border-slate-800"
          : "bg-white/85 border-slate-200 shadow-slate-300/40"
      }`}
    >
      {/* --- PARTIE GAUCHE --- */}
      <div className="flex items-center font-mono z-10 min-w-0">
        {/* Bouton Menu (Mobile) */}
        <button
          onClick={onToggleSidebar}
          className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border active:scale-95 transition-all mr-2.5 sm:mr-3 shrink-0 ${
            isDark
              ? "bg-slate-800/80 border-slate-700/50 text-slate-300"
              : "bg-slate-100 border-slate-300 text-slate-700"
          }`}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Window Controls */}
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors shadow-sm shadow-red-900/30"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors shadow-sm shadow-yellow-900/30"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors shadow-sm shadow-green-900/30"></div>
        </div>

        {/* Titre (Desktop uniquement) */}
        <span
          className={`ml-3 md:ml-4 text-sm font-bold hidden sm:inline truncate ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          root@coz:~
        </span>
      </div>

      {/* --- PARTIE CENTRALE (MOBILE UNIQUEMENT) --- */}
      {/* Position absolue pour être parfaitement au centre sans être gêné par les éléments gauche/droite */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-[430px]:hidden md:hidden z-0 pointer-events-none">
        <div
          className={`font-mono text-[10px] px-3 py-1.5 rounded-full border whitespace-nowrap flex items-center gap-2 ${
            isDark
              ? "text-green-500/90 bg-slate-950/40 border-green-900/20"
              : "text-emerald-700 bg-emerald-50/90 border-emerald-300/60"
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {/* On affiche une version courte pour mobile */}
          <span>
            UPTIME_AGE: {uptime.years}Y {uptime.days}D
          </span>
        </div>
      </div>

      {/* --- PARTIE DROITE --- */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 z-10">
        {/* Uptime (Desktop - Version complète) */}
        <div
          className={`font-mono text-xs hidden md:flex items-center gap-2 select-none px-3 py-1 rounded-full border ${
            isDark
              ? "text-green-500/80 bg-slate-950/30 border-green-900/20"
              : "text-emerald-700 bg-emerald-50/90 border-emerald-300/60"
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span>
            UPTIME: {uptime.years}Y {uptime.days}D
          </span>
        </div>

        {/* Bouton Theme */}
        <button
          onClick={onToggleTheme}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all active:scale-95 ${
            isDark
              ? "bg-slate-800/80 border-slate-700/50 text-amber-300 hover:bg-slate-700"
              : "bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200"
          }`}
          aria-label={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Bouton Chat (Mobile) */}
        <button
          onClick={onToggleGuestbook}
          className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border active:scale-95 transition-all relative shrink-0 ${
            isDark
              ? "bg-slate-800/80 border-cyan-900/30 text-cyan-400"
              : "bg-slate-100 border-cyan-300/60 text-cyan-700"
          }`}
          aria-label="Open guestbook"
        >
          <MessageCircle size={18} />
          <span
            className={`absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border-2 ${
              isDark ? "border-slate-900" : "border-white"
            }`}
          ></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
