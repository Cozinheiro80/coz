import { GitBranch, CheckCircle, Heart, Wifi } from "lucide-react";

type Theme = "dark" | "light";

// --- ICÔNES SVG PERSONNALISÉES (BRANDING) ---
const ReactLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3 text-[#61DAFB]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      transform="rotate(30 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      transform="rotate(-30 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      transform="rotate(90 12 12)"
    />
  </svg>
);

const NodeLogo = () => (
  <svg
    viewBox="0 0 32 32"
    className="w-3 h-3 text-[#339933]"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 2L2.5 9.8V23.2L16 31L29.5 23.2V9.8L16 2ZM26.5 21.8L16 27.8L5.5 21.8V10.2L16 4.2L26.5 10.2V21.8Z" />
    <path d="M16 22.5L10 19V11L16 14.5L22 11V19L16 22.5Z" />
  </svg>
);

const VercelLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 1L24 22H0L12 1Z" />
  </svg>
);

const TailwindLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3 text-[#38B2AC]"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);

const NextLogo = () => (
  <svg
    viewBox="0 0 180 180"
    className="w-3 h-3"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      height="180"
      id="mask0_408_134"
      maskUnits="userSpaceOnUse"
      width="180"
      x="0"
      y="0"
    >
      <circle cx="90" cy="90" fill="black" r="90" />
    </mask>
    <g mask="url(#mask0_408_134)">
      <circle cx="90" cy="90" data-circle="true" fill="black" r="90" />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="url(#paint0_linear_408_134)"
      />
      <rect
        fill="url(#paint1_linear_408_134)"
        height="72"
        width="12"
        x="115"
        y="54"
      />
    </g>
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint0_linear_408_134"
        x1="109"
        x2="144.5"
        y1="116.5"
        y2="160.5"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint1_linear_408_134"
        x1="121"
        x2="120.799"
        y1="54"
        y2="106.875"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

type StatusBarProps = {
  theme: Theme;
};

const StatusBar = ({ theme }: StatusBarProps) => {
  const isDark = theme === "dark";

  return (
    <footer
      className={`fixed bottom-0 w-full h-6 flex items-center justify-between px-4 text-[10px] font-mono select-none z-50 backdrop-blur-sm border-t ${
        isDark
          ? "bg-slate-950/90 border-slate-800 text-slate-500"
          : "bg-white/85 border-slate-200 text-slate-500"
      }`}
    >
    <div className="flex gap-4 items-center">
      <div
        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
          isDark
            ? "text-blue-400 hover:text-blue-300"
            : "text-indigo-600 hover:text-indigo-500"
        }`}
      >
        <GitBranch size={10} />
        <span>main</span>
      </div>
      <div
        className={`hidden sm:flex items-center gap-1.5 cursor-pointer transition-colors ${
          isDark ? "hover:text-green-400" : "hover:text-emerald-600"
        }`}
      >
        <CheckCircle size={10} />
        <span>0 errors</span>
      </div>
      <div
        className={`hidden sm:flex items-center gap-1.5 cursor-pointer transition-colors ${
          isDark ? "hover:text-green-400" : "hover:text-emerald-600"
        }`}
      >
        <Wifi size={10} />
        <span>Online</span>
      </div>
    </div>

    <div className="flex gap-4 items-center">
      {/* Logos Tech Stack */}
      <div
        className={`hidden md:flex items-center gap-2 border-r pr-4 mr-2 ${
          isDark ? "border-slate-800" : "border-slate-300"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 transition-colors cursor-help ${
            isDark ? "hover:text-slate-300 text-slate-300" : "hover:text-slate-900 text-slate-700"
          }`}
          title="Next.js"
        >
          <NextLogo /> <span>Next.js</span>
        </div>
        <div
          className={`flex items-center gap-1.5 transition-colors cursor-help ${
            isDark ? "hover:text-slate-300" : "hover:text-slate-900 text-slate-700"
          }`}
          title="React.js"
        >
          <ReactLogo /> <span>React</span>
        </div>
        <div
          className={`flex items-center gap-1.5 transition-colors cursor-help ${
            isDark ? "hover:text-slate-300" : "hover:text-slate-900 text-slate-700"
          }`}
          title="Node.js"
        >
          <NodeLogo /> <span>Node</span>
        </div>
        <div
          className={`flex items-center gap-1.5 transition-colors cursor-help ${
            isDark ? "hover:text-slate-300" : "hover:text-slate-900 text-slate-700"
          }`}
          title="Tailwind CSS"
        >
          <TailwindLogo /> <span>Tailwind</span>
        </div>
        <div
          className={`flex items-center gap-1.5 transition-colors cursor-help ${
            isDark
              ? "hover:text-slate-300 text-white"
              : "hover:text-slate-900 text-slate-800"
          }`}
          title="Hosted on Vercel"
        >
          <VercelLogo /> <span>Vercel</span>
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        <span className="hidden sm:inline">Made with</span>
        <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
        <span className="hidden sm:inline">by Cozinheiro</span>
      </div>
      <span className={isDark ? "text-slate-600" : "text-slate-500"}>
        © {new Date().getFullYear()}
      </span>
    </div>
    </footer>
  );
};

export default StatusBar;
