import { MetadataRoute } from "next";
import { CATEGORY_TREE } from "../app/constants/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://westcoastclothingco.com";

  // Flatten all subcategories and categories into sitemap URLs
  const categoryUrls: MetadataRoute.Sitemap = [];

  CATEGORY_TREE.forEach((section) => {
    categoryUrls.push({
      url: `${baseUrl}/category/${section.slug}`,
      lastModified: new Date(),
    });

    section.categories.forEach((cat) => {
      categoryUrls.push({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
      });

      cat.subcategories.forEach((sub) => {
        categoryUrls.push({
          url: `${baseUrl}/category/${sub.slug}`,
          lastModified: new Date(),
        });
      });
    });
  });

  return [
    { url: baseUrl, lastModified: new Date() },
    ...categoryUrls,
  ];
}