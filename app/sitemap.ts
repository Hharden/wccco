import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

// Helper to fetch all articles so the sitemap updates automatically when you add new MDX files
async function getAllArticles() {
  const articlesDirectory = path.join(process.cwd(), "content", "articles");
  
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(articlesDirectory);

  return filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      return {
        slug,
      };
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://westcoastclothingco.com";

  // Fetch all dynamic article slugs
  const articles = await getAllArticles();

  // Map articles to sitemap URL objects
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Static pages on your site
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleUrls,
  ];
}