import { useEffect, useState, type SubmitEventHandler } from "react";
import { MessageSquare, Send, Shield, Loader2, X } from "lucide-react";

type Theme = "dark" | "light";

type GuestbookProps = {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
};

type GuestbookMessage = {
  id: string;
  text: string;
  author: string;
  timestamp: number;
};

const LOCAL_MESSAGES_KEY = "guestbook_messages";
const LOCAL_POSTED_KEY = "has_posted_guestbook";

const DEFAULT_MESSAGES: GuestbookMessage[] = [
  {
    id: "seed-1",
    text: "Welcome to Ivan Lilla's portfolio.",
    author: "System",
    timestamp: Date.now() - 5000,
  },
  {
    id: "seed-2",
    text: "Guestbook running in temporary local mode (no backend).",
    author: "System",
    timestamp: Date.now() - 4000,
  },
];

function normalizeLegacyGuestbookMessage(
  message: GuestbookMessage,
): GuestbookMessage {
  const author =
    message.author === "Système"
      ? "System"
      : message.author === "Visiteur"
        ? "Visitor"
        : message.author;

  const text =
    message.text === "Bienvenue sur le portfolio d'Ivan Lilla."
      ? "Welcome to Ivan Lilla's portfolio."
      : message.text === "Guestbook en mode local temporaire (sans backend)."
        ? "Guestbook running in temporary local mode (no backend)."
        : message.text ===
            "Laissez un message pour Ivan (mode local, 1 message par navigateur)."
          ? "Leave a message for Ivan (local mode, 1 message per browser)."
          : message.text;

  return { ...message, author, text };
}

function readLocalMessages(): GuestbookMessage[] {
  if (typeof window === "undefined") return DEFAULT_MESSAGES;

  try {
    const raw = localStorage.getItem(LOCAL_MESSAGES_KEY);
    if (!raw) return DEFAULT_MESSAGES;

    const parsed = JSON.parse(raw) as GuestbookMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_MESSAGES;

    return parsed
      .filter(
        (message) =>
          typeof message.id === "string" &&
          typeof message.text === "string" &&
          typeof message.author === "string" &&
          typeof message.timestamp === "number"
      )
      .map(normalizeLegacyGuestbookMessage)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return DEFAULT_MESSAGES;
  }
}

const Guestbook = ({ isOpen, onClose, theme }: GuestbookProps) => {
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<GuestbookMessage[]>(() =>
    readLocalMessages()
  );
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasPosted, setHasPosted] = useState(
    () => typeof window !== "undefined" && Boolean(localStorage.getItem(LOCAL_POSTED_KEY))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isLoading) return;
    if (messages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          if (messages.length <= 1) return prevIndex;
          let nextIndex = Math.floor(Math.random() * messages.length);
          if (nextIndex === prevIndex) nextIndex = (nextIndex + 1) % messages.length;
          return nextIndex;
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [messages, isLoading]);

  const safeIndex =
    messages.length > 0
      ? ((currentMessageIndex % messages.length) + messages.length) % messages.length
      : 0;

  const displayedMessage = isLoading
    ? { text: "Loading messages...", author: "System" }
    : messages.length === 0
      ? {
          text: "Leave a message for Ivan (local mode, 1 message per browser).",
          author: "System",
        }
      : messages[safeIndex];

  const handleSendMessage: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const messageContent = newMessage.trim().slice(0, 140);
    if (!messageContent) return;
    if (hasPosted) return;

    setIsSending(true);
    try {
      const localMessage: GuestbookMessage = {
        id: `local-${Date.now()}`,
        text: messageContent,
        author: "Visitor",
        timestamp: Date.now(),
      };

      setMessages((prev) => [localMessage, ...prev].sort((a, b) => b.timestamp - a.timestamp));
      setHasPosted(true);
      localStorage.setItem(LOCAL_POSTED_KEY, "true");
      setNewMessage("");
    } catch (error) {
      console.error("Send error:", error);
    }
    setIsSending(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${isDark ? "bg-black/60" : "bg-slate-400/25"}`}
        onClick={onClose}
      />

      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-80 p-4 flex flex-col gap-4 shadow-2xl transition-transform duration-300 ease-in-out
          lg:static lg:w-72 lg:p-0 lg:h-full lg:translate-x-0 lg:shadow-none lg:z-auto lg:animate-in lg:slide-in-from-right lg:duration-700
          ${
            isDark
              ? "bg-slate-900 border-l border-slate-800 lg:bg-transparent lg:border-none"
              : "bg-white border-l border-slate-200 lg:bg-transparent lg:border-none"
          }
          ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex justify-between items-center lg:hidden mb-2">
          <h3
            className={`font-bold font-mono text-sm ${
              isDark ? "text-cyan-400" : "text-indigo-600"
            }`}
          >
            GUESTBOOK_V1
          </h3>
          <button
            onClick={onClose}
            className={isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`backdrop-blur border rounded-xl p-4 flex-1 flex flex-col relative overflow-hidden ${
            isDark
              ? "bg-slate-900/80 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              : "bg-white/80 border-indigo-300/70 shadow-[0_0_15px_rgba(99,102,241,0.12)]"
          }`}
        >
          <div
            className={`flex items-center justify-between mb-4 pb-2 border-b ${
              isDark ? "border-cyan-500/20" : "border-indigo-200"
            }`}
          >
            <h3
              className={`font-mono text-xs font-bold flex items-center gap-2 ${
                isDark ? "text-cyan-400" : "text-indigo-600"
              }`}
            >
              <MessageSquare size={14} /> PUBLIC_FEED
            </h3>
            <div className="flex items-center gap-2">
              <span className={isDark ? "text-[10px] text-slate-500" : "text-[10px] text-slate-500"}>
                {messages.length} MSG
              </span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isLoading
                    ? "bg-yellow-500"
                    : isDark
                      ? "bg-cyan-500"
                      : "bg-indigo-500"
                } animate-pulse`}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center text-center relative min-h-[120px]">
            <div key={displayedMessage?.text} className="animate-in fade-in zoom-in duration-500 relative z-10">
              <p
                className={`font-mono text-sm italic ${
                  isDark ? "text-slate-200" : "text-slate-700"
                } ${isLoading ? "animate-pulse" : ""}`}
              >
                {displayedMessage?.text}
              </p>
              {!isLoading && (
                <p
                  className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${
                    isDark ? "text-cyan-600" : "text-indigo-500"
                  }`}
                >
                  — {displayedMessage?.author}
                </p>
              )}
            </div>
            <div
              className={`absolute inset-0 blur-3xl rounded-full z-0 pointer-events-none ${
                isDark ? "bg-cyan-500/5" : "bg-indigo-500/10"
              }`}
            />
          </div>

          <div className={isDark ? "h-0.5 w-full bg-slate-800 mt-4 rounded-full overflow-hidden" : "h-0.5 w-full bg-slate-200 mt-4 rounded-full overflow-hidden"}>
            <div
              className={`h-full w-full animate-[progress_8s_linear_infinite] origin-left ${
                isDark ? "bg-cyan-500/50" : "bg-indigo-500/45"
              }`}
            />
          </div>
        </div>

        <div
          className={`backdrop-blur border rounded-xl p-3 relative shrink-0 ${
            isDark ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"
          }`}
        >
          {hasPosted ? (
            <div className="text-center py-3 flex flex-col items-center animate-in fade-in duration-500">
              <div className="text-green-500 text-xs font-bold mb-1 flex items-center justify-center gap-2">
                <Shield size={12} /> Sent Successfully
              </div>
              <p className={isDark ? "text-[14px] text-slate-500 mb-2" : "text-[14px] text-slate-600 mb-2"}>
                Your message has been recorded in the system.
                <br />
                <span className="text-[9px] opacity-70">(1 message max per user)</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="relative">
              <textarea
                rows={5}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isLoading ? "Initializing..." : "Leave a message..."}
                maxLength={140}
                disabled={isLoading}
                className={`w-full border rounded-lg py-2 pl-3 pr-10 text-xs transition-colors disabled:opacity-50 ${
                  isDark
                    ? "bg-slate-950/50 border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600"
                    : "bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-400"
                }`}
              />
              <button
                type="submit"
                disabled={isSending || !newMessage || isLoading}
                className={`absolute right-1 top-1 p-1.5 rounded-md transition-all disabled:opacity-0 disabled:scale-0 ${
                  isDark
                    ? "bg-cyan-900/30 hover:bg-cyan-500 text-cyan-400 hover:text-white"
                    : "bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white"
                }`}
              >
                {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              </button>
            </form>
          )}
        </div>

        <style>{`
          @keyframes progress {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
        `}</style>
      </div>
    </>
  );
};

export default Guestbook;
