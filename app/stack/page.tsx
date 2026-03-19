"use client";

import { Layout, Server, Wrench } from "lucide-react";
import type { ElementType } from "react";
import {
  SiCss,
  SiDocker,
  SiGithub,
  SiGit,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRootme,
  SiRust,
  SiTailwindcss,
  SiVite,
  SiVuedotjs,
  SiMongodb,
  SiTypescript,
} from "react-icons/si";
import { useTheme } from "../components/theme-context";

type StackItem = {
  name: string;
  logo: ElementType;
  logoClassDark: string;
  logoClassLight: string;
};

type StackCategory = {
  title: string;
  icon: ElementType;
  items: StackItem[];
};

const STACK_CATEGORIES: StackCategory[] = [
  {
    title: "Frontend & UI",
    icon: Layout,
    items: [
      {
        name: "JS",
        logo: SiJavascript,
        logoClassDark: "text-yellow-300",
        logoClassLight: "text-yellow-500",
      },
      {
        name: "TS",
        logo: SiTypescript,
        logoClassDark: "text-blue-300",
        logoClassLight: "text-blue-500",
      },

      {
        name: "React",
        logo: SiReact,
        logoClassDark: "text-cyan-300",
        logoClassLight: "text-cyan-600",
      },
      {
        name: "Next",
        logo: SiNextdotjs,
        logoClassDark: "text-slate-100",
        logoClassLight: "text-slate-900",
      },
      {
        name: "Vue.js",
        logo: SiVuedotjs,
        logoClassDark: "text-emerald-400",
        logoClassLight: "text-emerald-600",
      },
      {
        name: "Tailwind CSS",
        logo: SiTailwindcss,
        logoClassDark: "text-sky-400",
        logoClassLight: "text-sky-600",
      },
      {
        name: "Vite",
        logo: SiVite,
        logoClassDark: "text-violet-400",
        logoClassLight: "text-violet-600",
      },

      {
        name: "HTML",
        logo: SiHtml5,
        logoClassDark: "text-orange-400",
        logoClassLight: "text-orange-600",
      },
      {
        name: "CSS",
        logo: SiCss,
        logoClassDark: "text-blue-400",
        logoClassLight: "text-blue-600",
      },
    ],
  },
  {
    title: "Backend & Core",
    icon: Server,
    items: [
      {
        name: "Node.js",
        logo: SiNodedotjs,
        logoClassDark: "text-lime-400",
        logoClassLight: "text-green-600",
      },
      {
        name: "Python",
        logo: SiPython,
        logoClassDark: "text-blue-300",
        logoClassLight: "text-blue-600",
      },
      {
        name: "Go",
        logo: SiGo,
        logoClassDark: "text-cyan-300",
        logoClassLight: "text-cyan-600",
      },
      {
        name: "Rust",
        logo: SiRust,
        logoClassDark: "text-orange-300",
        logoClassLight: "text-orange-600",
      },
      {
        name: "PostgreSQL",
        logo: SiPostgresql,
        logoClassDark: "text-sky-300",
        logoClassLight: "text-sky-700",
      },
      {
        name: "MySQL",
        logo: SiMysql,
        logoClassDark: "text-blue-400",
        logoClassLight: "text-blue-700",
      },
      {
        name: "MongoDB",
        logo: SiMongodb,
        logoClassDark: "text-indigo-300",
        logoClassLight: "text-indigo-600",
      },
      {
        name: "Prisma",
        logo: SiPrisma,
        logoClassDark: "text-slate-200",
        logoClassLight: "text-slate-700",
      },
    ],
  },
  {
    title: "Tools & Hacker Mindset",
    icon: Wrench,
    items: [
      {
        name: "Git",
        logo: SiGit,
        logoClassDark: "text-orange-400",
        logoClassLight: "text-orange-600",
      },
      {
        name: "GitHub",
        logo: SiGithub,
        logoClassDark: "text-slate-100",
        logoClassLight: "text-slate-900",
      },
      {
        name: "Docker",
        logo: SiDocker,
        logoClassDark: "text-blue-400",
        logoClassLight: "text-blue-600",
      },
      {
        name: "Linux",
        logo: SiLinux,
        logoClassDark: "text-amber-300",
        logoClassLight: "text-amber-600",
      },
      {
        name: "Root-Me (CTF)",
        logo: SiRootme,
        logoClassDark: "text-emerald-300",
        logoClassLight: "text-emerald-600",
      },
    ],
  },
];

const StackPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-2 slide-in-from-bottom-4">
      {STACK_CATEGORIES.map((category) => (
        <div key={category.title}>
          <h3
            className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <category.icon size={14} /> {category.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {category.items.map((tech) => (
              <div
                key={tech.name}
                className={`p-3 rounded-lg border flex items-center gap-3 transition-all group cursor-default ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800"
                    : "bg-white/90 border-slate-200 hover:border-indigo-300 hover:bg-white"
                }`}
              >
                <div
                  className={`relative mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full shadow-md ring-1 ${
                    isDark
                      ? "shadow-zinc-800/20 ring-zinc-700/60 bg-slate-900"
                      : "shadow-slate-300/40 ring-slate-200 bg-slate-50"
                  }`}
                >
                  <tech.logo
                    className={`h-5 w-5 ${
                      isDark ? tech.logoClassDark : tech.logoClassLight
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StackPage;
