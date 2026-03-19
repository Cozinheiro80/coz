import Link from "next/link";
import Image from "next/image";
import {
  Terminal as TerminalIcon,
  Layers,
  MonitorPlay,
  MessageSquare,
  Github,
  Mail,
  Linkedin,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { USER_CONFIG } from "../utils/config";

type Route = "terminal" | "projects" | "articles" | "stack" | "cv";
type Theme = "dark" | "light";

type SidebarProps = {
  currentRoute: Route;
  isOpen: boolean;
  onClose?: () => void;
  theme: Theme;
};

type SidebarFooterProps = {
  theme: Theme;
};

type MenuItem = {
  id: Route;
  label: string;
  icon: LucideIcon;
  href: string;
};

const SidebarFooter = ({ theme }: SidebarFooterProps) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`mt-auto pt-4 border-t space-y-2 ${
        isDark ? "border-slate-800" : "border-slate-200"
      }`}
    >
      <a
        href={USER_CONFIG.github}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-colors ${
          isDark
            ? "text-slate-400 hover:text-white hover:bg-slate-800"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        <Github size={16} /> GitHub Profile
      </a>

      <a
        href={USER_CONFIG.linkedin}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-colors ${
          isDark
            ? "text-slate-400 hover:text-blue-400 hover:bg-blue-900/10"
            : "text-slate-600 hover:text-blue-700 hover:bg-blue-100/70"
        }`}
      >
        <Linkedin size={16} /> LinkedIn Profile
      </a>

      <a
        href={`mailto:${USER_CONFIG.email}`}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-colors ${
          isDark
            ? "text-slate-400 hover:text-green-400 hover:bg-green-900/10"
            : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-100/70"
        }`}
      >
        <Mail size={16} /> Contact Me
      </a>
    </div>
  );
};

const Sidebar = ({
  currentRoute,
  isOpen,
  onClose,
  theme,
}: SidebarProps) => {
  const isDark = theme === "dark";

  const menuItems: MenuItem[] = [
    { id: "terminal", label: "Terminal", icon: TerminalIcon, href: "/terminal" },
    { id: "projects", label: "Projects", icon: MonitorPlay, href: "/projects" },
    { id: "articles", label: "Articles", icon: MessageSquare, href: "/articles" },
    { id: "stack", label: "Tech Stack", icon: Layers, href: "/stack" },
    // TEMP: Resume section hidden in production
    // { id: "cv", label: "Resume", icon: FileText, href: "/cv" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${isDark ? "bg-black/60" : "bg-slate-400/25"}`}
        onClick={onClose}
      />

      <nav
        className={`
          fixed inset-y-0 left-0 z-50 w-72 p-4 flex flex-col gap-2 h-full shadow-2xl transition-transform duration-300 ease-in-out
          lg:static lg:w-64 lg:backdrop-blur lg:border lg:rounded-xl lg:translate-x-0 lg:shadow-none lg:z-auto
          ${
            isDark
              ? "bg-slate-900 border-r border-slate-800 lg:bg-slate-900/50 lg:border-slate-800"
              : "bg-white border-r border-slate-200 lg:bg-white/75 lg:border-slate-200"
          }
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={onClose}
          className={`lg:hidden absolute top-4 right-4 ${
            isDark
              ? "text-slate-400 hover:text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center group cursor-default mt-8 lg:mt-0">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-0.5 mb-3 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-3xl ${
                isDark ? "bg-slate-900" : "bg-white"
              }`}
            >
              <Image
                src="/cil.webp"
                width={80}
                height={80}
                alt="Ivan Lilla"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h1
            className={`font-bold text-lg tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {USER_CONFIG.name}
          </h1>
          <p
            className={`text-xs font-medium ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            {USER_CONFIG.role}
          </p>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentRoute === item.id
                  ? isDark
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                    : "bg-indigo-100 text-indigo-700 shadow-sm shadow-indigo-200"
                  : isDark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>

        <SidebarFooter theme={theme} />
      </nav>
    </>
  );
};

export default Sidebar;
