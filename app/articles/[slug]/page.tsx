import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleContent from "./article-content";
import { getArticleBySlug, getArticleSlugs } from "../../utils/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Ivan Lilla",
    };
  }

  return {
    title: `${article.title} | Ivan Lilla`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} />;
}
