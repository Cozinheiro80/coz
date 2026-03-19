"use client";

import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "./header";
import Sidebar from "./sidebar";
import Guestbook from "./guestbook";
import StatusBar from "./statusbar";
import { ThemeProvider, type Theme } from "./theme-context";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";

type Route = "terminal" | "projects" | "articles" | "stack" | "cv";

type CountryCode = "fr" | "it";

type GlobeMarker = Marker & {
  overlay: {
    countryCode: CountryCode;
    label: string;
  };
};

const MAP_MARKERS: GlobeMarker[] = [
  {
    lat: 48.8566,
    lng: 2.3522,
    size: 1.8,
    overlay: { countryCode: "fr", label: "Paris" },
  },
  {
    lat: 40.8518,
    lng: 14.2681,
    size: 1.8,
    overlay: { countryCode: "it", label: "Naples" },
  },
];

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem("portfolio-theme");
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getRouteFromPathname(pathname: string): Route {
  if (pathname === "/" || pathname.startsWith("/terminal")) return "terminal";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/articles")) return "articles";
  if (pathname.startsWith("/stack")) return "stack";
  if (pathname.startsWith("/cv")) return "cv";
  return "terminal";
}

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const currentRoute = getRouteFromPathname(pathname);
  const dottedMapId = useId();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [bootSequence, setBootSequence] = useState(0);
  const isDark = theme === "dark";

  // États pour les menus mobiles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  useEffect(() => {
    // Séquence de démarrage simulée
    const timers = [
      setTimeout(() => setBootSequence(1), 500),
      setTimeout(() => setBootSequence(2), 1200),
      setTimeout(() => setBootSequence(3), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  // Écran de boot (BIOS style)
  if (bootSequence < 3) {
    return (
      <div className="fixed inset-0 bg-black text-green-500 font-mono flex flex-col items-center justify-center p-8 select-none cursor-wait z-50">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between text-xs text-green-700 mb-8">
            <span>BIOS v.1.1</span>
            <span>MEM: 32GB OK</span>
          </div>
          <div className="space-y-2 text-sm">
            <p>&gt; INITIALIZING KERNEL...</p>
            {bootSequence >= 1 && (
              <p className="text-green-400 animate-pulse">
                &gt; LOADING MODULES [REACT, NODE, UNITY]... OK
              </p>
            )}
            {bootSequence >= 2 && (
              <p className="text-green-300">
                &gt; MOUNTING FILESYSTEM (COZ_OS)... OK
              </p>
            )}
          </div>
          <div className="w-full bg-slate-900 h-1 mt-8 overflow-hidden rounded-full border border-slate-800">
            <div
              className="h-full bg-green-500 shadow-[0_0_10px_#22c55e] transition-all duration-1000 ease-out"
              style={{ width: bootSequence >= 2 ? "100%" : "30%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <div
        className={`h-[100dvh] min-h-[100dvh] font-sans overflow-hidden relative ${
          isDark
            ? "bg-[#050505] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200"
            : "bg-slate-100 text-slate-900 selection:bg-indigo-400/30 selection:text-indigo-900"
        }`}
      >
        <div className="h-full flex flex-col pb-6">
          <style>
            {`
              .text-shadow-glow { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
              .text-shadow-cyan { text-shadow: 0 0 5px rgba(6,182,212,0.6); }
              .text-shadow-green { text-shadow: 0 0 5px rgba(34,197,94,0.6); }

              @keyframes map-orbit {
                0% {
                  transform: translate3d(0%, 0, 0) scale(0.94);
                }
                100% {
                  transform: translate3d(-50%, 0, 0) scale(0.94);
                }
              }

              @keyframes map-orbit-reverse {
                0% {
                  transform: translate3d(0%, 0, 0) scale(1.02);
                }
                100% {
                  transform: translate3d(-50%, 0, 0) scale(1.02);
                }
              }
            `}
          </style>

          <div className="fixed inset-0 z-0 pointer-events-none">
            <div
              className={`absolute inset-0 ${
                isDark ? "opacity-65" : "opacity-70"
              }`}
            >
              <div
                className="absolute inset-[-2%] flex w-[200%]"
                style={{ animation: "map-orbit 120s linear infinite" }}
              >
                <DottedMap
                  className={`h-full w-1/2 shrink-0 ${
                    isDark ? "text-cyan-400/60" : "text-indigo-500/55"
                  }`}
                  markers={MAP_MARKERS}
                  mapSamples={7600}
                  dotRadius={0.13}
                  markerColor={isDark ? "#22d3ee" : "#6366f1"}
                  pulse
                  renderMarkerOverlay={({ marker, x, y, r, index }) => {
                    const { countryCode, label } = marker.overlay;
                    const href = `https://flagcdn.com/w80/${countryCode}.webp`;
                    const clipId = `${dottedMapId}-flag-0-${index}`.replace(
                      /:/g,
                      "-",
                    );

                    const imgR = r * 0.78;
                    const fontSize = r * 0.95;
                    const pillH = r * 1.5;
                    const pillW = label.length * (fontSize * 0.62) + r * 1.4;
                    const pillX = x + r + r * 0.6;
                    const pillY = y - pillH / 2;

                    return (
                      <g style={{ pointerEvents: "none" }}>
                        <clipPath id={clipId}>
                          <circle cx={x} cy={y} r={imgR} />
                        </clipPath>

                        <image
                          href={href}
                          x={x - imgR}
                          y={y - imgR}
                          width={imgR * 2}
                          height={imgR * 2}
                          preserveAspectRatio="xMidYMid slice"
                          clipPath={`url(#${clipId})`}
                        />

                        <rect
                          x={pillX}
                          y={pillY}
                          width={pillW}
                          height={pillH}
                          rx={pillH / 2}
                          fill={
                            isDark ? "rgba(2,6,23,0.68)" : "rgba(15,23,42,0.58)"
                          }
                        />
                        <text
                          x={pillX + r * 0.7}
                          y={y + fontSize * 0.35}
                          fontSize={fontSize}
                          fill="white"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  }}
                />
                <DottedMap
                  className={`h-full w-1/2 shrink-0 ${
                    isDark ? "text-cyan-400/60" : "text-indigo-500/55"
                  }`}
                  markers={MAP_MARKERS}
                  mapSamples={7600}
                  dotRadius={0.13}
                  markerColor={isDark ? "#22d3ee" : "#6366f1"}
                  pulse
                  renderMarkerOverlay={({ marker, x, y, r, index }) => {
                    const { countryCode, label } = marker.overlay;
                    const href = `https://flagcdn.com/w80/${countryCode}.webp`;
                    const clipId = `${dottedMapId}-flag-1-${index}`.replace(
                      /:/g,
                      "-",
                    );

                    const imgR = r * 0.78;
                    const fontSize = r * 0.95;
                    const pillH = r * 1.5;
                    const pillW = label.length * (fontSize * 0.62) + r * 1.4;
                    const pillX = x + r + r * 0.6;
                    const pillY = y - pillH / 2;

                    return (
                      <g style={{ pointerEvents: "none" }}>
                        <clipPath id={clipId}>
                          <circle cx={x} cy={y} r={imgR} />
                        </clipPath>

                        <image
                          href={href}
                          x={x - imgR}
                          y={y - imgR}
                          width={imgR * 2}
                          height={imgR * 2}
                          preserveAspectRatio="xMidYMid slice"
                          clipPath={`url(#${clipId})`}
                        />

                        <rect
                          x={pillX}
                          y={pillY}
                          width={pillW}
                          height={pillH}
                          rx={pillH / 2}
                          fill={
                            isDark ? "rgba(2,6,23,0.68)" : "rgba(15,23,42,0.58)"
                          }
                        />
                        <text
                          x={pillX + r * 0.7}
                          y={y + fontSize * 0.35}
                          fontSize={fontSize}
                          fill="white"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  }}
                />
              </div>
              <div
                className={`absolute inset-[-8%] flex w-[200%] ${
                  isDark ? "opacity-35" : "opacity-30"
                }`}
                style={{ animation: "map-orbit-reverse 190s linear infinite" }}
              >
                <DottedMap
                  className={`h-full w-1/2 shrink-0 ${
                    isDark ? "text-cyan-300/45" : "text-indigo-400/40"
                  }`}
                  markers={MAP_MARKERS}
                  mapSamples={5200}
                  dotRadius={0.1}
                  markerColor={isDark ? "#34d399" : "#0ea5e9"}
                />
                <DottedMap
                  className={`h-full w-1/2 shrink-0 ${
                    isDark ? "text-cyan-300/45" : "text-indigo-400/40"
                  }`}
                  markers={MAP_MARKERS}
                  mapSamples={5200}
                  dotRadius={0.1}
                  markerColor={isDark ? "#34d399" : "#0ea5e9"}
                />
              </div>
            </div>
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-[radial-gradient(circle_at_center,transparent_25%,rgba(5,5,5,0.9)_85%)]"
                  : "bg-[radial-gradient(circle_at_center,transparent_20%,rgba(241,245,249,0.92)_85%)]"
              }`}
            />
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] blur-[110px] rounded-full ${
                isDark ? "bg-indigo-600/10" : "bg-sky-300/30"
              }`}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col h-full w-full max-w-[1400px] mx-auto px-2 pt-2 pb-3 md:p-6 md:pb-8">
            <Header
              onToggleSidebar={() => setIsSidebarOpen(true)}
              onToggleGuestbook={() => setIsGuestbookOpen(true)}
              theme={theme}
              onToggleTheme={() =>
                setTheme((prevTheme) =>
                  prevTheme === "dark" ? "light" : "dark",
                )
              }
            />

            <div className="flex flex-1 w-full gap-3 md:gap-4 lg:gap-6 overflow-hidden flex-col lg:flex-row relative min-h-0">
              <Sidebar
                currentRoute={currentRoute}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                theme={theme}
              />

              <main
                className={`w-full flex-1 backdrop-blur-md border rounded-xl overflow-hidden shadow-2xl flex flex-col relative min-w-0 ${
                  isDark
                    ? "bg-slate-900/60 border-slate-700/50"
                    : "bg-white/80 border-slate-200 shadow-slate-400/25"
                }`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent ${
                    isDark ? "via-cyan-500/50" : "via-indigo-500/60"
                  }`}
                ></div>

                <div
                  className={`h-10 border-b flex items-center px-3 md:px-4 justify-between shrink-0 overflow-hidden ${
                    isDark
                      ? "bg-slate-950/50 border-slate-800/50"
                      : "bg-slate-50/90 border-slate-200"
                  }`}
                >
                  <span
                    className={`text-[11px] md:text-xs font-mono flex items-center gap-1.5 md:gap-2 min-w-0 overflow-hidden whitespace-nowrap ${
                      isDark ? "text-cyan-400/80" : "text-indigo-600/90"
                    }`}
                  >
                    <span className={isDark ? "text-slate-600" : "text-slate-400"}>/</span>
                    <span className="truncate">home / coz / {currentRoute}</span>
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {children}
                </div>
              </main>

              <Guestbook
                isOpen={isGuestbookOpen}
                onClose={() => setIsGuestbookOpen(false)}
                theme={theme}
              />
            </div>
          </div>
          <StatusBar theme={theme} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AppShell;
