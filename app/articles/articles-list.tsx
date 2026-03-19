"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTheme } from "../components/theme-context";
import type { ArticleSummary } from "../utils/article-types";

type ArticlesListProps = {
  articles: ArticleSummary[];
};

type SortMode = "newest" | "oldest" | "quickest";

const ACCENT_BARS = [
  "from-cyan-400 via-blue-500 to-indigo-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-violet-400 via-fuchsia-500 to-rose-500",
  "from-amber-400 via-orange-500 to-red-500",
];

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toDateValue(date: string): number {
  const parsed = new Date(date);
  const timestamp = parsed.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function toReadingMinutes(readingTime: string): number {
  const match = readingTime.match(/\d+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

const ArticlesList = ({ articles }: ArticlesListProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => uniqueTags.add(tag));
    });
    return ["All", ...Array.from(uniqueTags).sort((a, b) => a.localeCompare(b))];
  }, [articles]);

  const visibleArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = articles.filter((article) => {
      const matchesTag = activeTag === "All" || article.tags.includes(activeTag);
      if (!matchesTag) return false;

      if (!query) return true;

      const searchableText =
        `${article.title} ${article.description} ${article.author} ${article.tags.join(" ")}`.toLowerCase();

      return searchableText.includes(query);
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "oldest") {
        return toDateValue(a.date) - toDateValue(b.date);
      }

      if (sortMode === "quickest") {
        const readingDiff = toReadingMinutes(a.readingTime) - toReadingMinutes(b.readingTime);
        if (readingDiff !== 0) return readingDiff;
      }

      return toDateValue(b.date) - toDateValue(a.date);
    });
  }, [activeTag, articles, searchQuery, sortMode]);

  const hasFilters =
    searchQuery.trim().length > 0 || activeTag !== "All" || sortMode !== "newest";

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTag("All");
    setSortMode("newest");
  };

  return (
    <section className="w-full min-w-0 space-y-4 md:space-y-5 animate-in fade-in duration-500 slide-in-from-bottom-4 pb-4 max-w-6xl mx-auto">
      <div
        className={`p-4 sm:p-5 md:p-6 rounded-2xl border ${
          isDark
            ? "bg-slate-800/60 border-slate-700"
            : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[11px] uppercase tracking-[0.12em] font-semibold border ${
              isDark
                ? "bg-slate-900 text-cyan-300 border-slate-700"
                : "bg-indigo-50 text-indigo-700 border-indigo-100"
            }`}
          >
            <FileText size={13} />
            Knowledge Base
          </span>
        </div>

        <h2
          className={`mt-3 text-2xl md:text-3xl font-semibold leading-tight break-words ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Articles designed to be useful in real projects
        </h2>

        <p className={`mt-2 text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Technical deep dives, field notes, and practical engineering patterns.
        </p>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div
            className={`rounded-xl border px-3 py-2 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p className={`text-[11px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Articles
            </p>
            <p className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {articles.length}
            </p>
          </div>
          <div
            className={`rounded-xl border px-3 py-2 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p className={`text-[11px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Topics
            </p>
            <p className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {Math.max(tags.length - 1, 0)}
            </p>
          </div>
          <div
            className={`rounded-xl border px-3 py-2 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p className={`text-[11px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              View
            </p>
            <p className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              Grid
            </p>
          </div>
          <div
            className={`rounded-xl border px-3 py-2 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p className={`text-[11px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Language
            </p>
            <p className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              English
            </p>
          </div>
        </div>
      </div>

      {articles.length === 0 ? (
        <div
          className={`rounded-2xl border p-5 text-sm ${
            isDark
              ? "bg-slate-900/55 border-slate-700 text-slate-400"
              : "bg-white/95 border-slate-200 text-slate-600"
          }`}
        >
          No articles published yet.
        </div>
      ) : (
        <>
          <div
            className={`rounded-2xl border p-3 sm:p-4 ${
              isDark
                ? "bg-slate-900/60 border-slate-700"
                : "bg-white/95 border-slate-200"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-3">
              <label className="relative block">
                <span className="sr-only">Search articles</span>
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title, description, author, or topic..."
                  className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none transition-colors ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400"
                      : "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-300"
                  }`}
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Sort articles</span>
                <SlidersHorizontal
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                />
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className={`w-full appearance-none rounded-xl border pl-9 pr-8 py-2.5 text-sm outline-none transition-colors ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-400"
                      : "bg-white border-slate-200 text-slate-700 focus:border-indigo-300"
                  }`}
                >
                  <option value="newest">Sort: Newest first</option>
                  <option value="oldest">Sort: Oldest first</option>
                  <option value="quickest">Sort: Quickest reads</option>
                </select>
              </label>
            </div>

            <div className="mt-3 -mx-1 px-1 flex items-start gap-2 overflow-x-auto pb-1">
              {tags.map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveTag(tag)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? isDark
                          ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/60"
                          : "bg-indigo-100 text-indigo-700 border-indigo-300"
                        : isDark
                          ? "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1 ${
                    isDark
                      ? "bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <X size={12} />
                  Reset
                </button>
              )}
            </div>

            <p className={`mt-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Showing {visibleArticles.length} article{visibleArticles.length > 1 ? "s" : ""}.
            </p>
          </div>

          {visibleArticles.length === 0 ? (
            <div
              className={`rounded-2xl border p-5 text-sm ${
                isDark
                  ? "bg-slate-900/55 border-slate-700 text-slate-400"
                  : "bg-white/95 border-slate-200 text-slate-600"
              }`}
            >
              <p>No articles match your current filters.</p>
              <button
                type="button"
                onClick={resetFilters}
                className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold ${
                  isDark
                    ? "text-cyan-300 hover:text-cyan-200"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                <X size={13} />
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visibleArticles.map((article, index) => (
                <article
                  key={article.slug}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
                    isDark
                      ? "bg-slate-900/60 border-slate-700 hover:border-slate-500 hover:bg-slate-900"
                      : "bg-white/95 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${
                      ACCENT_BARS[index % ACCENT_BARS.length]
                    }`}
                  />

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
                        isDark
                          ? "text-cyan-300 border-slate-700 bg-slate-950"
                          : "text-indigo-700 border-indigo-100 bg-indigo-50"
                      }`}
                    >
                      <CalendarDays size={12} />
                      {formatDate(article.date)}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
                        isDark
                          ? "text-slate-300 border-slate-700 bg-slate-950"
                          : "text-slate-700 border-slate-200 bg-slate-100"
                      }`}
                    >
                      <Clock3 size={12} />
                      {article.readingTime}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border max-w-full ${
                        isDark
                          ? "text-slate-300 border-slate-700 bg-slate-950"
                          : "text-slate-700 border-slate-200 bg-slate-100"
                      }`}
                    >
                      <UserRound size={12} />
                      <span className="truncate">{article.author}</span>
                    </span>
                  </div>

                  <h3
                    className={`mt-3 text-lg font-semibold leading-snug line-clamp-2 ${
                      isDark ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {article.title}
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-relaxed line-clamp-3 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {article.description}
                  </p>

                  {article.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-md border ${
                            isDark
                              ? "text-slate-300 border-slate-700 bg-slate-950/80"
                              : "text-slate-700 border-slate-200 bg-slate-50"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/articles/${article.slug}`}
                    className={`mt-5 inline-flex items-center gap-2 text-xs font-semibold ${
                      isDark
                        ? "text-cyan-300 hover:text-cyan-200"
                        : "text-indigo-600 hover:text-indigo-500"
                    }`}
                  >
                    Read Article
                    <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ArticlesList;
