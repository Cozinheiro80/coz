export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readingTime: string;
  tags: string[];
};

export type Article = ArticleSummary & {
  content: string;
};
