"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Calculator,
  ChartNoAxesCombined,
  CheckCircle2,
  Globe2,
  Lock,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../components/theme-context";

type ProjectCard = {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  highlights: string[];
  tags: string[];
  icon: LucideIcon;
  accent: string;
};

const PROJECTS: ProjectCard[] = [
  {
    id: 1,
    name: "classifications.aops.fr",
    url: "https://classifications.aops.fr",
    category: "Classification & HR",
    description:
      "Platform dedicated to job classification frameworks, helping structure role references, clarify responsibilities, and support HR transformation.",
    highlights: [
      "Job weighting and role hierarchy modeling",
      "Support for revising classification grids",
      "HR governance approach focused on pay equity",
    ],
    tags: ["AOPS", "Classification", "HR"],
    icon: Workflow,
    accent: "from-cyan-400 via-blue-500 to-indigo-500",
  },
  {
    id: 2,
    name: "observatoire.aops.fr",
    url: "https://observatoire.aops.fr",
    category: "Data & Insights",
    description:
      "Health and benefits observatory designed to identify risk, monitor contributions, and anticipate cost drift with actionable indicators.",
    highlights: [
      "Secure intake of payroll, claims, and coverage data",
      "Core KPIs: claims ratio, loss ratio, out-of-pocket trends",
      "Benchmarking, alerts, and budget projections",
    ],
    tags: ["AOPS", "Observatory", "Analytics"],
    icon: ChartNoAxesCombined,
    accent: "from-emerald-400 via-cyan-500 to-sky-500",
  },
  {
    id: 3,
    name: "outils.aops.fr",
    url: "https://outils.aops.fr",
    category: "Tools Suite",
    description:
      "Business toolkit focused on actuarial and employee benefits use cases, built to speed up simulations, scenario comparisons, and impact analysis.",
    highlights: [
      "Expert calculators and simulation modules",
      "Scenario comparison and projection workflows",
      "Fast access to high-value business tools",
    ],
    tags: ["AOPS", "Actuarial", "Simulators"],
    icon: Calculator,
    accent: "from-violet-400 via-fuchsia-500 to-rose-500",
  },
  {
    id: 4,
    name: "tailortale.com",
    url: "https://tailortale-eight.vercel.app/",
    category: "AI Product",
    description:
      "AI-assisted storytelling product for creating personalized stories with illustrations and audio narration through a playful, guided experience.",
    highlights: [
      "Character and plot personalization",
      "Kid-focused illustrated story generation",
      "Smooth family-friendly product experience",
    ],
    tags: ["AI", "Storytelling", "Consumer"],
    icon: Sparkles,
    accent: "from-amber-400 via-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "aops.fr",
    url: "https://aops.fr",
    category: "Corporate Website",
    description:
      "Primary website for AOPS Conseil, positioned around social protection, health benefits, and retirement with a strong expert-led narrative.",
    highlights: [
      "Clear positioning of the firm’s core expertise",
      "Integrated consulting, training, and innovation offerings",
      "B2B-focused contact and conversion journey",
    ],
    tags: ["Corporate", "Advisory", "Lead Gen"],
    icon: BriefcaseBusiness,
    accent: "from-blue-400 via-indigo-500 to-violet-500",
  },
  {
    id: 6,
    name: "actuarem.com",
    url: "https://actuarem.com",
    category: "SaaS Platform",
    description:
      "Digital actuarial platform that centralizes complex compensation calculations and supports faster decisions on social and regulatory topics.",
    highlights: [
      "Automated regulatory calculations",
      "Built-in legal monitoring and rate references",
      "Time savings with lower error risk",
    ],
    tags: ["Actuarial", "SaaS", "Automation"],
    icon: Globe2,
    accent: "from-teal-400 via-emerald-500 to-lime-500",
  },
];

const ProjectsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4 pb-4">
      <section
        className={`rounded-2xl border px-5 py-6 md:px-6 md:py-7 ${
          isDark
            ? "bg-slate-900/70 border-slate-700"
            : "bg-white/90 border-slate-200"
        }`}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                isDark ? "text-cyan-300" : "text-indigo-600"
              }`}
            >
              Selected Work
            </p>
            <h2
              className={`mt-2 text-2xl md:text-3xl font-semibold leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Real products, private repos, measurable impact
            </h2>
            <p
              className={`mt-2 text-sm md:text-base max-w-3xl ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              A curated set of production platforms. The code lives in private
              GitHub repositories, while the products are live and in use.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "6 live platforms",
              "Private GitHub repositories",
              "Product-driven builds",
            ].map((item) => (
              <span
                key={item}
                className={`px-3 py-1 text-xs rounded-full border ${
                  isDark
                    ? "bg-slate-950/80 text-slate-300 border-slate-700"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {PROJECTS.map((project, index) => {
          const Icon = project.icon;
          return (
          <div
            key={project.id}
            style={{ animationDelay: `${index * 70}ms` }}
            className={`relative overflow-hidden border rounded-2xl p-5 md:p-6 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-3 ${
              isDark
                ? "bg-slate-900/60 hover:bg-slate-900 border-slate-700/90 hover:border-slate-500"
                : "bg-white/95 hover:bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${project.accent}`}
            />

            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`shrink-0 p-2.5 rounded-xl border transition-colors ${
                    isDark
                      ? "bg-slate-950 border-slate-700 group-hover:border-slate-500"
                      : "bg-slate-100 border-slate-200 group-hover:border-slate-300"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isDark ? "text-cyan-300" : "text-indigo-600"}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[11px] uppercase tracking-[0.12em] font-semibold ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {project.category}
                  </p>
                  <h3
                    className={`font-bold text-lg leading-tight transition-colors ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {project.name}
                  </h3>

                  <div
                    className={`flex items-center gap-1.5 mt-1 text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Lock size={10} />
                      Private repository
                    </span>
                  </div>
                </div>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className={`text-xs px-2 py-1 rounded border transition-all inline-flex items-center gap-1 ${
                  isDark
                    ? "bg-slate-950 text-slate-300 border-slate-700 hover:text-white hover:border-cyan-400"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:text-indigo-700 hover:border-indigo-300"
                }`}
              >
                Visit
                <ArrowUpRight size={12} />
              </a>
            </div>

            <p
              className={`text-sm leading-relaxed mb-4 ${
                isDark
                  ? "text-slate-300"
                  : "text-slate-600"
              }`}
            >
              {project.description}
            </p>

            <div className="space-y-2 mb-4">
              {project.highlights.map((item) => (
                <div
                  key={item}
                  className={`flex items-start gap-2 text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 text-xs rounded border ${
                      isDark
                        ? "bg-slate-950/80 text-slate-400 border-slate-700/60"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default ProjectsPage;
