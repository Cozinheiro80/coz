"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../../components/theme-context";
import type { Article } from "../../utils/article-types";

type ArticleContentProps = {
  article: Article;
};

type MarkdownProps = {
  children?: ReactNode;
  href?: string;
  [key: string]: unknown;
};

type MarkdownCodeProps = MarkdownProps & {
  inline?: boolean;
};

type MarkdownImageProps = MarkdownProps & {
  src?: string;
  alt?: string;
};

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const ArticleContent = ({ article }: ArticleContentProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <article className="w-full min-w-0 animate-in fade-in duration-500 slide-in-from-bottom-4 pb-4 max-w-4xl mx-auto">
      <Link
        href="/articles"
        className={`mb-4 inline-flex items-center gap-2 text-xs font-semibold ${
          isDark ? "text-cyan-300 hover:text-cyan-200" : "text-indigo-600 hover:text-indigo-500"
        }`}
      >
        <ArrowLeft size={14} />
        Back to Articles
      </Link>

      <header
        className={`rounded-xl border p-4 sm:p-5 ${
          isDark
            ? "bg-slate-800/55 border-slate-700"
            : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
              isDark
                ? "text-cyan-300 border-slate-700 bg-slate-900/80"
                : "text-indigo-700 border-indigo-100 bg-indigo-50"
            }`}
          >
            <CalendarDays size={12} />
            {formatDate(article.date)}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
              isDark
                ? "text-slate-300 border-slate-700 bg-slate-900/80"
                : "text-slate-700 border-slate-200 bg-slate-100"
            }`}
          >
            <Clock3 size={12} />
            {article.readingTime}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border max-w-full ${
              isDark
                ? "text-slate-300 border-slate-700 bg-slate-900/80"
                : "text-slate-700 border-slate-200 bg-slate-100"
            }`}
          >
            <UserRound size={12} />
            <span className="truncate">{article.author}</span>
          </span>
        </div>
        <h1
          className={`mt-3 text-xl md:text-2xl font-bold leading-tight break-words ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {article.title}
        </h1>
        <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {article.description}
        </p>

        {article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-1 rounded-md border ${
                  isDark
                    ? "text-slate-300 border-slate-700 bg-slate-800/70"
                    : "text-slate-700 border-slate-200 bg-slate-50"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <section
        className={`mt-4 rounded-xl border p-4 sm:p-5 overflow-hidden ${
          isDark
            ? "bg-slate-900/60 border-slate-700 text-slate-200"
            : "bg-white/95 border-slate-200 text-slate-800"
        }`}
      >
        <ReactMarkdown
          components={{
            h2: ({ children }: MarkdownProps) => (
              <h2
                className={`mt-7 mb-3 text-lg md:text-xl font-bold break-words scroll-mt-24 ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                {children}
              </h2>
            ),
            h3: ({ children }: MarkdownProps) => (
              <h3
                className={`mt-6 mb-2 text-base md:text-lg font-semibold break-words scroll-mt-24 ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                {children}
              </h3>
            ),
            p: ({ children }: MarkdownProps) => (
              <p
                className={`mb-4 leading-relaxed break-words ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {children}
              </p>
            ),
            a: ({ children, href }: MarkdownProps) => (
              <a
                href={typeof href === "string" ? href : "#"}
                target="_blank"
                rel="noreferrer"
                className={`underline underline-offset-2 ${
                  isDark
                    ? "text-cyan-300 hover:text-cyan-200"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                {children}
              </a>
            ),
            ul: ({ children }: MarkdownProps) => (
              <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>
            ),
            ol: ({ children }: MarkdownProps) => (
              <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>
            ),
            li: ({ children }: MarkdownProps) => (
              <li className={`leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {children}
              </li>
            ),
            code: ({ inline, children }: MarkdownCodeProps) =>
              inline ? (
                <code
                  className={`px-1.5 py-0.5 rounded text-[0.9em] ${
                    isDark
                      ? "bg-slate-800 text-cyan-300"
                      : "bg-slate-200 text-indigo-700"
                  }`}
                >
                  {children}
                </code>
              ) : (
                <code>{children}</code>
              ),
            pre: ({ children }: MarkdownProps) => (
              <pre
                className={`overflow-x-auto rounded-lg p-3 mb-4 text-xs sm:text-sm ${
                  isDark ? "bg-slate-800/80" : "bg-slate-100"
                }`}
              >
                {children}
              </pre>
            ),
            img: ({ src, alt }: MarkdownImageProps) => (
              <span
                className={`my-5 block overflow-hidden rounded-lg border ${
                  isDark ? "border-slate-700/40" : "border-slate-200"
                }`}
              >
                <Image
                  src={typeof src === "string" ? src : "/cil.webp"}
                  alt={typeof alt === "string" ? alt : "Article image"}
                  width={1200}
                  height={675}
                  className="h-auto w-full object-cover"
                />
              </span>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </section>
    </article>
  );
};

export default ArticleContent;
