import "server-only";

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getAllArticles, getArticleBySlug } from "@/app/utils/articles";

/**
 * Knowledge base for the COZ assistant.
 *
 * Sources: every published article (content/articles/*.mdx) and the
 * hand-written site knowledge (content/knowledge/*.md). Documents are split
 * into chunks, embedded with OpenAI, and searched with a hybrid ranking
 * (embeddings + keywords). The index rebuilds itself when content changes;
 * embeddings are cached on disk by chunk hash, so only new text is embedded.
 */

export type KnowledgeChunk = {
  id: string;
  docId: string;
  title: string;
  url?: string;
  text: string;
  hash: string;
};

export type ArticleCatalogEntry = {
  title: string;
  url: string;
  date: string;
  description: string;
};

type Index = {
  signature: string;
  chunks: KnowledgeChunk[];
  catalog: ArticleCatalogEntry[];
  vectors: Map<string, number[]> | null;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const KNOWLEDGE_DIR = path.join(CONTENT_DIR, "knowledge");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const CACHE_FILE = path.join(os.tmpdir(), "ivanlilla-knowledge-embeddings.json");

const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
const MAX_CHUNK_CHARS = 1200;
const EMBED_BATCH_SIZE = 96;
const TOP_K = 6;
const MAX_CHUNKS_PER_DOC = 3;

let indexPromise: Promise<Index> | null = null;
let indexSignature = "";

// ---------------------------------------------------------------- chunking

function sha(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function stripMarkdownNoise(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/<[^>]+>/g, "") // stray JSX/HTML tags
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Split markdown on h2/h3 headings, then pack paragraphs up to MAX_CHUNK_CHARS. */
function chunkMarkdown(markdown: string): { section: string; text: string }[] {
  const out: { section: string; text: string }[] = [];
  const sections = stripMarkdownNoise(markdown).split(/^(?=#{1,3}\s)/m);

  for (const raw of sections) {
    const headingMatch = raw.match(/^#{1,3}\s+(.+)$/m);
    const section = headingMatch?.[1]?.trim() ?? "";
    const paragraphs = raw.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

    let buffer = "";
    for (const paragraph of paragraphs) {
      if (buffer && buffer.length + paragraph.length + 2 > MAX_CHUNK_CHARS) {
        out.push({ section, text: buffer });
        buffer = "";
      }
      // A single oversized paragraph (or code block) is hard-split.
      if (paragraph.length > MAX_CHUNK_CHARS) {
        for (let i = 0; i < paragraph.length; i += MAX_CHUNK_CHARS) {
          out.push({ section, text: paragraph.slice(i, i + MAX_CHUNK_CHARS) });
        }
        continue;
      }
      buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    }
    if (buffer.trim().length > 40) out.push({ section, text: buffer });
  }
  return out;
}

// ----------------------------------------------------------- source loading

async function loadSources(): Promise<{
  chunks: KnowledgeChunk[];
  catalog: ArticleCatalogEntry[];
}> {
  const chunks: KnowledgeChunk[] = [];
  const catalog: ArticleCatalogEntry[] = [];

  const push = (
    docId: string,
    title: string,
    url: string | undefined,
    markdown: string,
    header: string,
  ) => {
    chunkMarkdown(markdown).forEach(({ section, text }, i) => {
      const label = section && section !== title ? `${header} > ${section}` : header;
      const full = `${label}\n${text}`;
      chunks.push({
        id: `${docId}#${i}`,
        docId,
        title,
        url,
        text: full,
        hash: sha(full),
      });
    });
  };

  // Articles
  const summaries = await getAllArticles();
  for (const summary of summaries) {
    const article = await getArticleBySlug(summary.slug);
    if (!article) continue;
    const url = `/articles/${article.slug}`;
    catalog.push({
      title: article.title,
      url,
      date: article.date,
      description: article.description,
    });
    const header = `Article "${article.title}" (${article.date})`;
    const intro = `# ${article.title}\n\n${article.description}\n\nTags: ${article.tags.join(", ")}`;
    push(`article:${article.slug}`, article.title, url, `${intro}\n\n${article.content}`, header);
  }

  // Hand-written site knowledge
  let files: string[] = [];
  try {
    files = (await fs.readdir(KNOWLEDGE_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    // no knowledge dir: articles only
  }
  for (const file of files.sort()) {
    const markdown = await fs.readFile(path.join(KNOWLEDGE_DIR, file), "utf8");
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file;
    push(`knowledge:${file}`, title, undefined, markdown, title);
  }

  return { chunks, catalog };
}

/** Cheap fingerprint of all content files, so edits are picked up without a restart. */
async function computeSignature(): Promise<string> {
  const parts: string[] = [];
  for (const dir of [ARTICLES_DIR, KNOWLEDGE_DIR]) {
    try {
      for (const name of (await fs.readdir(dir)).sort()) {
        const stat = await fs.stat(path.join(dir, name));
        parts.push(`${name}:${stat.size}:${stat.mtimeMs}`);
      }
    } catch {
      // missing dir
    }
  }
  return sha(parts.join("|"));
}

// --------------------------------------------------------------- embeddings

type EmbeddingCache = { model: string; vectors: Record<string, number[]> };

async function readCache(): Promise<EmbeddingCache> {
  try {
    const parsed = JSON.parse(await fs.readFile(CACHE_FILE, "utf8")) as EmbeddingCache;
    if (parsed.model === EMBEDDING_MODEL) return parsed;
  } catch {
    // no cache yet
  }
  return { model: EMBEDDING_MODEL, vectors: {} };
}

async function embed(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!response.ok) {
    throw new Error(`Embeddings API error ${response.status}`);
  }
  const data = (await response.json()) as {
    data: { index: number; embedding: number[] }[];
  };
  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

async function embedChunks(
  chunks: KnowledgeChunk[],
): Promise<Map<string, number[]>> {
  const cache = await readCache();
  const missing = chunks.filter((c) => !cache.vectors[c.hash]);
  const unique = [...new Map(missing.map((c) => [c.hash, c])).values()];

  for (let i = 0; i < unique.length; i += EMBED_BATCH_SIZE) {
    const batch = unique.slice(i, i + EMBED_BATCH_SIZE);
    const vectors = await embed(batch.map((c) => c.text));
    batch.forEach((c, j) => {
      cache.vectors[c.hash] = vectors[j];
    });
  }

  if (unique.length > 0) {
    // Drop vectors of chunks that no longer exist, then persist (best effort).
    const alive = new Set(chunks.map((c) => c.hash));
    for (const hash of Object.keys(cache.vectors)) {
      if (!alive.has(hash)) delete cache.vectors[hash];
    }
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache)).catch(() => {});
  }

  return new Map(chunks.map((c) => [c.hash, cache.vectors[c.hash]]));
}

// -------------------------------------------------------------------- index

async function buildIndex(signature: string): Promise<Index> {
  const { chunks, catalog } = await loadSources();
  let vectors: Map<string, number[]> | null = null;
  try {
    vectors = await embedChunks(chunks);
  } catch (error) {
    console.error("Knowledge embeddings unavailable, using keyword search only:", error);
  }
  return { signature, chunks, catalog, vectors };
}

async function getIndex(): Promise<Index> {
  const signature = await computeSignature();
  if (!indexPromise || signature !== indexSignature) {
    indexSignature = signature;
    const promise = buildIndex(signature);
    indexPromise = promise;
    // A failed or embedding-less build must not stick forever.
    promise
      .then((index) => {
        if (!index.vectors && indexPromise === promise) indexPromise = null;
      })
      .catch(() => {
        if (indexPromise === promise) indexPromise = null;
      });
  }
  return indexPromise;
}

// ------------------------------------------------------------------- search

const STOPWORDS = new Set(
  "a an and are as at be by for from has have how i in is it its of on or that the this to was what when where which who why with you your me my do does can about tell les des une est que qui dans pour avec sur par pas il elle vous tu je le la un et en du de ce cet cette quoi come che per con sono non una uno del della nel".split(
    " ",
  ),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/** BM25-style keyword scores for every chunk. */
function keywordScores(chunks: KnowledgeChunk[], query: string): number[] {
  const queryTokens = [...new Set(tokenize(query))];
  const docs = chunks.map((c) => tokenize(c.text));
  const avgLen = docs.reduce((sum, d) => sum + d.length, 0) / (docs.length || 1);
  const k1 = 1.4;
  const b = 0.75;

  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const token of new Set(doc)) df.set(token, (df.get(token) ?? 0) + 1);
  }

  return docs.map((doc) => {
    const tf = new Map<string, number>();
    for (const token of doc) tf.set(token, (tf.get(token) ?? 0) + 1);
    let score = 0;
    for (const token of queryTokens) {
      const f = tf.get(token);
      if (!f) continue;
      const n = df.get(token) ?? 0;
      const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * doc.length) / avgLen));
    }
    return score;
  });
}

function ranks(scores: number[]): number[] {
  const order = scores.map((s, i) => [s, i] as const).sort((a, b) => b[0] - a[0]);
  const out = new Array<number>(scores.length);
  order.forEach(([, i], rank) => {
    out[i] = rank;
  });
  return out;
}

export type SearchResult = { chunks: KnowledgeChunk[]; catalog: ArticleCatalogEntry[] };

/**
 * Retrieve the chunks most relevant to `query` (hybrid: embeddings + keywords,
 * merged with reciprocal rank fusion). `query` should already include the
 * conversational context needed to resolve follow-up questions.
 */
export async function searchKnowledge(query: string): Promise<SearchResult> {
  const index = await getIndex();
  const { chunks, vectors, catalog } = index;
  if (chunks.length === 0) return { chunks: [], catalog };

  const kw = keywordScores(chunks, query);
  const kwRank = ranks(kw);

  let embRank: number[] | null = null;
  let embScores: number[] | null = null;
  if (vectors) {
    try {
      const [queryVector] = await embed([query]);
      embScores = chunks.map((c) => {
        const v = vectors.get(c.hash);
        return v ? cosine(queryVector, v) : 0;
      });
      embRank = ranks(embScores);
    } catch (error) {
      console.error("Query embedding failed, falling back to keywords:", error);
    }
  }

  const K = 60;
  const fused = chunks.map((_, i) => {
    let score = kw[i] > 0 ? 1 / (K + kwRank[i]) : 0;
    if (embRank) score += 1 / (K + embRank[i]);
    return { i, score };
  });

  const selected: KnowledgeChunk[] = [];
  const perDoc = new Map<string, number>();
  for (const { i, score } of fused.sort((a, b) => b.score - a.score)) {
    if (score === 0 || selected.length >= TOP_K) break;
    const chunk = chunks[i];
    const used = perDoc.get(chunk.docId) ?? 0;
    if (used >= MAX_CHUNKS_PER_DOC) continue;
    perDoc.set(chunk.docId, used + 1);
    selected.push(chunk);
  }

  return { chunks: selected, catalog };
}
