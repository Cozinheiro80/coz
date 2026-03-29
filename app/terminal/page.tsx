"use client";

import {
  useEffect,
  useRef,
  useState,
  type SubmitEventHandler,
  type ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../components/theme-context";

type HistoryEntry = {
  type: "system" | "user";
  content: string;
  isRateLimit?: boolean;
};

type TerminalUsage = {
  date: string;
  count: number;
};

type MarkdownProps = {
  children?: ReactNode;
  href?: string;
  [key: string]: unknown;
};

type MarkdownCodeProps = MarkdownProps & {
  inline?: boolean;
};

const TerminalPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      type: "system",
      content:
        "[SYSTEM] Initializing COZ v1.0.0...\n[SYSTEM] Secure server connection established.\n\n\n[COZ] Hi, I'm COZ, Ivan's personal AI and digital twin. I know his journey, motivations, and projects inside out. What would you like to know about him?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas quand l'historique change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  // Focus automatique sur l'input au chargement (désactivé sur mobile pour éviter le clavier popup)
  useEffect(() => {
    if (window.innerWidth > 768) {
      inputRef.current?.focus();
    }
  }, []);

  const fetchAssistantResponse = async (
    userQuery: string,
  ): Promise<{ text: string; isRateLimit: boolean }> => {
    // --- GESTION DU RATE LIMITING VIA LOCALSTORAGE ---
    const today = new Date().toLocaleDateString("en-US");
    const MAX_MESSAGES = 10;

    const storedData = localStorage.getItem("coz_terminal_usage");
    let usage: TerminalUsage = storedData
      ? (JSON.parse(storedData) as TerminalUsage)
      : { date: today, count: 0 };

    if (usage.date !== today) {
      usage = { date: today, count: 0 };
    }

    if (usage.count >= MAX_MESSAGES) {
      return {
        text: "[SYSTEM] ⚠️ Daily request limit reached. To prevent abuse, my energy is exhausted for today. Please come back tomorrow.",
        isRateLimit: true,
      };
    }

    usage.count += 1;
    localStorage.setItem("coz_terminal_usage", JSON.stringify(usage));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery }),
      });

      if (response.status === 429) {
        return {
          text: "[SYSTEM] ⚠️ Daily request limit reached. To prevent abuse, my energy is exhausted for today. Please come back tomorrow.",
          isRateLimit: true,
        };
      }

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        const serverMessage =
          typeof errorPayload?.error === "string"
            ? errorPayload.error
            : `HTTP error! status: ${response.status}`;
        throw new Error(serverMessage);
      }

      const data = (await response.json()) as { reply: string };
      return { text: `[COZ] ${data.reply}`, isRateLimit: false };
    } catch (error) {
      console.error("Backend fetch error:", error);
      // Remboursement du crédit en cas d'erreur technique
      usage.count = Math.max(0, usage.count - 1);
      localStorage.setItem("coz_terminal_usage", JSON.stringify(usage));

      const errorMessage =
        error instanceof Error ? error.message : "Unable to reach the server.";

      return {
        text: `[ERROR] ${errorMessage}`,
        isRateLimit: false,
      };
    }
  };

  const handleCommand: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setHistory((prev) => [...prev, { type: "user", content: cmd }]);
    setInput("");
    setIsTyping(true);

    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      setIsTyping(false);
      return;
    }

    const response = await fetchAssistantResponse(cmd);

    setHistory((prev) => [
      ...prev,
      {
        type: "system",
        content: response.text,
        isRateLimit: response.isRateLimit,
      },
    ]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Container principal Terminal avec overflow-x-hidden */}
      <div
        className={`flex flex-col h-full font-mono text-sm md:text-base p-2 rounded-lg relative overflow-hidden w-full ${
          isDark
            ? "bg-black/60 border border-slate-800/60"
            : "bg-white/85 border border-slate-200"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <div
          className={`absolute inset-0 z-10 pointer-events-none bg-[length:100%_2px,3px_100%] ${
            isDark
              ? "bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] opacity-20"
              : "bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(99,102,241,0.08)_50%),linear-gradient(90deg,rgba(79,70,229,0.06),rgba(16,185,129,0.03),rgba(59,130,246,0.06))] opacity-50"
          }`}
        ></div>

        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden space-y-4 p-2 relative z-20 scrollbar-thin ${
            isDark ? "scrollbar-thumb-slate-700" : "scrollbar-thumb-slate-300"
          }`}
          ref={scrollRef}
        >
          {history.map((line, i) => (
            <div
              key={i}
              className={`${line.type === "user" ? (isDark ? "text-cyan-300" : "text-indigo-700") : (isDark ? "text-slate-300" : "text-slate-700")} animate-in fade-in slide-in-from-left-2 duration-300 leading-relaxed break-words max-w-full`}
            >
              {line.type === "user" ? (
                <span className="flex gap-2 font-bold text-shadow-cyan whitespace-pre-wrap">
                  <span
                    className={`shrink-0 ${
                      isDark ? "text-green-500" : "text-emerald-600"
                    }`}
                  >
                    guest@coz:~$
                  </span>
                  <span className="break-words">{line.content}</span>
                </span>
              ) : (
                <div
                  className={`block border-l-2 pl-3 my-1 break-words max-w-full ${
                    isDark
                      ? "border-slate-700 text-green-400/90 text-shadow-green"
                      : "border-indigo-300 text-slate-700"
                  }`}
                >
                  {/* Rendu Markdown standard */}
                  <ReactMarkdown
                    components={{
                      p: ({ children }: MarkdownProps) => {
                        const content =
                          typeof children === "string"
                            ? children
                            : Array.isArray(children)
                              ? children.join("")
                              : "";

                        if (content.startsWith("[COZ]")) {
                          return (
                            <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words">
                              <span
                                className={`font-bold mr-1 ${
                                  isDark
                                    ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                                    : "text-indigo-600"
                                }`}
                              >
                                [COZ]
                              </span>
                              {content.replace("[COZ]", "")}
                            </p>
                          );
                        }

                        return (
                          <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words">
                            {children}
                          </p>
                        );
                      },
                      strong: ({ children }: MarkdownProps) => (
                        <strong
                          className={`font-bold ${
                            isDark ? "text-green-300" : "text-indigo-700"
                          }`}
                        >
                          {children}
                        </strong>
                      ),
                      em: ({ children }: MarkdownProps) => (
                        <em
                          className={`italic ${
                            isDark ? "text-green-200" : "text-slate-600"
                          }`}
                        >
                          {children}
                        </em>
                      ),
                      a: ({ children, href }: MarkdownProps) => (
                        <a
                          className={`underline underline-offset-2 break-all ${
                            isDark
                              ? "text-cyan-400 hover:text-cyan-300"
                              : "text-indigo-600 hover:text-indigo-500"
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={typeof href === "string" ? href : "#"}
                        >
                          {children}
                        </a>
                      ),
                      ul: ({ children }: MarkdownProps) => (
                        <ul className="list-disc list-inside mb-2 space-y-1 ml-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }: MarkdownProps) => (
                        <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }: MarkdownProps) => (
                        <li
                          className={`break-words ${
                            isDark
                              ? "marker:text-green-500"
                              : "marker:text-indigo-500"
                          }`}
                        >
                          {children}
                        </li>
                      ),
                      pre: ({ children }: MarkdownProps) => (
                        <pre
                          className={`whitespace-pre-wrap overflow-x-auto p-2 rounded my-2 max-w-full ${
                            isDark ? "bg-slate-800/50" : "bg-slate-100"
                          }`}
                        >
                          {children}
                        </pre>
                      ),
                      code: ({ inline, children }: MarkdownCodeProps) =>
                        inline ? (
                          <code
                            className={`px-1.5 py-0.5 rounded font-mono text-[0.9em] break-all ${
                              isDark
                                ? "bg-slate-800/80 text-cyan-300"
                                : "bg-slate-200 text-indigo-700"
                            }`}
                          >
                            {children}
                          </code>
                        ) : (
                          <code className="break-words">{children}</code>
                        ),
                    }}
                  >
                    {line.content}
                  </ReactMarkdown>

                  {/* TEMP: Resume CTA hidden in production */}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div
              className={`italic animate-pulse pl-3 py-2 ${
                isDark ? "text-slate-500" : "text-slate-500"
              }`}
            >
              <span
                className={`font-bold ${
                  isDark ? "text-green-500" : "text-emerald-600"
                }`}
              >
                [COZ]
              </span>{" "}
              is generating a response...
            </div>
          )}
        </div>

        <form
          onSubmit={handleCommand}
          className={`flex items-center gap-2 p-2 border-t relative z-20 shrink-0 ${
            isDark
              ? "bg-slate-900/50 border-slate-800"
              : "bg-slate-50/90 border-slate-200"
          }`}
        >
          <span
            className={`font-bold shrink-0 ${
              isDark ? "text-green-500 text-shadow-green" : "text-emerald-600"
            }`}
          >
            guest@coz:~$
          </span>
          <input
            ref={inputRef}
            autoFocus
            className={`flex-1 bg-transparent outline-none font-bold min-w-0 ${
              isDark
                ? "text-cyan-300 placeholder:text-slate-600"
                : "text-slate-800 placeholder:text-slate-400"
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className={`disabled:opacity-50 transition-colors ${
              isDark
                ? "text-slate-400 hover:text-green-400 disabled:hover:text-slate-400"
                : "text-slate-500 hover:text-indigo-600 disabled:hover:text-slate-500"
            }`}
          >
            <ArrowRight size={16} />
          </button>
        </form>
        <p
          className={`relative text-[10px] md:text-xs italic px-2 py-1 text-center md:text-left ${
            isDark ? "text-slate-600" : "text-slate-500"
          }`}
        >
          This AI assistant is designed to present my background and projects.
          Like any automated system, some answers may be imperfect.
        </p>
      </div>
    </>
  );
};

export default TerminalPage;
