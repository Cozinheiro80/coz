import { FileText, Download, X } from "lucide-react";

const CV_PDF_PATH = "/Cv_Ivan Lilla_@Cozinheiro.pdf";

type PdfViewerProps = {
  onClose: () => void;
  theme: "dark" | "light";
};

const PdfViewer = ({ onClose, theme }: PdfViewerProps) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-2 md:p-6 animate-in fade-in duration-200 ${
        isDark ? "bg-black/90" : "bg-slate-500/25"
      }`}
    >
      <div
        className={`w-full max-w-5xl h-[85vh] rounded-xl border flex flex-col shadow-2xl relative overflow-hidden ${
          isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200 shadow-slate-400/30"
        }`}
      >
        {/* Header du lecteur */}
        <div
          className={`flex justify-between items-center p-3 border-b ${
            isDark
              ? "border-slate-700 bg-slate-800/80"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <h3
            className={`font-bold font-mono flex items-center gap-2 text-sm md:text-base ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            <FileText
              size={18}
              className={isDark ? "text-cyan-400" : "text-indigo-600"}
            />
            CV_Ivan_Lilla.pdf
          </h3>
          <div className="flex gap-2">
            <a
              href={CV_PDF_PATH}
              download="CV_Ivan_Lilla.pdf"
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-colors"
            >
              <Download size={14} />{" "}
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-md transition-colors ${
                isDark
                  ? "hover:bg-red-500/20 hover:text-red-400 text-slate-400"
                  : "hover:bg-red-100 hover:text-red-600 text-slate-600"
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe PDF */}
        <div
          className={`flex-1 relative ${isDark ? "bg-slate-800" : "bg-white"}`}
        >
          <iframe
            src={`${CV_PDF_PATH}#view=FitH`}
            className="w-full h-full border-0"
            title="CV Viewer"
          >
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>Your browser cannot display this PDF.</p>
              <a
                href={CV_PDF_PATH}
                download
                className="text-cyan-400 underline"
              >
                Download the file
              </a>
            </div>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
