import { MetadataRoute } from 'next';
import fs from "fs";
import path from "path";
import matter from "gray-matter";

async function getAllArticles() {
  const articlesDirectory = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(articlesDirectory)) return [];

  const files = fs.readdirSync(articlesDirectory);

  return files.map((fileName) => {
    const filePath = path.join(articlesDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug: fileName.replace(/\.mdx$/, ""),
      title: data.title,
      publishedAt: data.publishedAt,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://westcoastclothingco.com';
  const articles = await getAllArticles(); // Read slugs from content/articles

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/articles`, lastModified: new Date() },
    ...articleUrls,
  ];
}