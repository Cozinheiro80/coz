"use client";

import { Download, FileText } from "lucide-react";
import { useTheme } from "../components/theme-context";

const CV_PDF_PATH = "/Cv_Ivan Lilla_@Cozinheiro.pdf";

const CvPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="h-full animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div
        className={`w-full h-full rounded-xl border flex flex-col overflow-hidden ${
          isDark
            ? "bg-slate-900/70 border-slate-700"
            : "bg-white/90 border-slate-200"
        }`}
      >
        <div
          className={`flex justify-between items-center p-3 border-b ${
            isDark
              ? "border-slate-700 bg-slate-800/80"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <h2
            className={`font-bold font-mono flex items-center gap-2 text-sm md:text-base ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            <FileText
              size={18}
              className={isDark ? "text-cyan-400" : "text-indigo-600"}
            />
            CV_Ivan_Lilla.pdf
          </h2>
          <a
            href={CV_PDF_PATH}
            download="CV_Ivan_Lilla.pdf"
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>

        <div className={`flex-1 relative ${isDark ? "bg-slate-800" : "bg-white"}`}>
          <iframe
            src={`${CV_PDF_PATH}#view=FitH`}
            className="w-full h-full border-0"
            title="CV Viewer"
          >
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>Your browser cannot display this PDF.</p>
              <a href={CV_PDF_PATH} download className="text-cyan-400 underline">
                Download the file
              </a>
            </div>
          </iframe>
        </div>
      </div>
    </section>
  );
};

export default CvPage;
