import ArticlesList from "./articles-list";
import { getAllArticles } from "../utils/articles";

export default async function ArticlesPage() {
  const articles = await getAllArticles();
  return <ArticlesList articles={articles} />;
}
