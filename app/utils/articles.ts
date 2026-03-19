import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { Article, ArticleSummary } from "./article-types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const ARTICLE_EXTENSION = ".mdx";

type ArticleFrontmatter = Omit<ArticleSummary, "slug">;

function trimQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function parseTags(rawValue: string): string[] {
  const trimmed = rawValue.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => trimQuotes(item))
      .filter(Boolean);
  }

  return trimmed
    .split(",")
    .map((item) => trimQuotes(item))
    .filter(Boolean);
}

function defaultFrontmatter(): ArticleFrontmatter {
  return {
    title: "Untitled article",
    description: "",
    date: "1970-01-01",
    author: "Unknown",
    readingTime: "5 min read",
    tags: [],
  };
}

function parseLegacyMetaBlock(source: string): Partial<ArticleFrontmatter> {
  const metaMatch = source.match(/export\s+const\s+meta\s*=\s*{([\s\S]*?)}/);
  if (!metaMatch) return {};

  const metaBlock = metaMatch[1];

  const readField = (field: string): string | undefined => {
    const match = metaBlock.match(
      new RegExp(`${field}\\s*:\\s*(['"])([\\s\\S]*?)\\1`),
    );
    return match?.[2]?.trim();
  };

  const author = readField("author");
  const date = readField("date");
  const title = readField("title");
  const description = readField("description");

  return {
    ...(author ? { author } : {}),
    ...(date ? { date } : {}),
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

function cleanupLegacyMdx(source: string): string {
  return source
    .replace(/^import\s.+$/gm, "")
    .replace(/export\s+const\s+meta\s*=\s*{[\s\S]*?}\s*/g, "")
    .replace(/export\s+default\s*\(props\)\s*=>\s*<ArticleLayout[^>]*>\s*/g, "")
    .replace(/\{\s*'\s*'\s*\}/g, "")
    .replace(/<Image\s+[^>]*alt=(["'])(.*?)\1[^>]*\/>/g, "\n![\$2](#)\n")
    .trim();
}

function parseFrontmatter(source: string): {
  frontmatter: ArticleFrontmatter;
  content: string;
} {
  const frontmatterMatch = source.match(
    /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/,
  );

  if (!frontmatterMatch) {
    const legacyMeta = parseLegacyMetaBlock(source);
    return {
      frontmatter: {
        ...defaultFrontmatter(),
        ...legacyMeta,
      },
      content: cleanupLegacyMdx(source),
    };
  }

  const [, frontmatterBlock, markdownContent] = frontmatterMatch;
  const frontmatter = defaultFrontmatter();

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const separatorIndex = trimmedLine.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = trimQuotes(rawValue);

    switch (key) {
      case "title":
        frontmatter.title = value;
        break;
      case "description":
        frontmatter.description = value;
        break;
      case "date":
        frontmatter.date = value;
        break;
      case "author":
        frontmatter.author = value;
        break;
      case "readingTime":
        frontmatter.readingTime = value;
        break;
      case "tags":
        frontmatter.tags = parseTags(rawValue);
        break;
      default:
        break;
    }
  }

  return {
    frontmatter,
    content: markdownContent.trim(),
  };
}

function toTimestamp(date: string): number {
  const parsed = new Date(date).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function getArticleFilenames(): Promise<string[]> {
  try {
    const entries = await fs.readdir(ARTICLES_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(ARTICLE_EXTENSION))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function readArticleFile(slug: string): Promise<string | null> {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  const filepath = path.join(ARTICLES_DIR, `${safeSlug}${ARTICLE_EXTENSION}`);

  try {
    return await fs.readFile(filepath, "utf8");
  } catch {
    return null;
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  const filenames = await getArticleFilenames();
  return filenames.map((name) => name.replace(/\.mdx$/, ""));
}

export async function getAllArticles(): Promise<ArticleSummary[]> {
  const slugs = await getArticleSlugs();

  const articles = await Promise.all(
    slugs.map(async (slug): Promise<ArticleSummary | null> => {
      const source = await readArticleFile(slug);
      if (!source) return null;

      const { frontmatter } = parseFrontmatter(source);

      return {
        slug,
        ...frontmatter,
      };
    }),
  );

  return articles
    .filter((article): article is ArticleSummary => article !== null)
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const source = await readArticleFile(slug);
  if (!source) return null;

  const { frontmatter, content } = parseFrontmatter(source);

  return {
    slug,
    ...frontmatter,
    content,
  };
}
