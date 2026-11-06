import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import ArticleProductCard from "@/components/ArticleProductCard";

const mdxComponents = {
  ArticleProductCard,
};

// Helper function to detect gender from frontmatter, slug, or title
function determineGender(data: { gender?: string; title?: string }, slug: string): "men" | "women" | "unisex" {
  if (data.gender) {
    const g = data.gender.toLowerCase();
    if (g.includes("men") || g === "m" || g.includes("mens")) return "men";
    if (g.includes("women") || g === "w" || g.includes("womens") || g.includes("ladies") || g.includes("female")) return "women";
  }

  const textToCheck = `${slug} ${data.title || ""}`.toLowerCase();
  
  // Check for women's keywords
  if (
    textToCheck.includes("women") || 
    textToCheck.includes("womens") || 
    textToCheck.includes("ladies") || 
    textToCheck.includes("female") ||
    textToCheck.includes("beanies") // adjust based on your specific filenames/titles if needed
  ) {
    return "women";
  }

  // Check for men's keywords
  if (
    textToCheck.includes("men") || 
    textToCheck.includes("mens") || 
    textToCheck.includes("male") ||
    textToCheck.includes("gentlemen") ||
    textToCheck.includes("flannel")
  ) {
    return "men";
  }

  return "unisex";
}

async function getArticleBySlug(slug: string) {
  const articlesDirectory = path.join(process.cwd(), "app", "content", "articles");
  const filePath = path.join(articlesDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const gender = determineGender(data, slug);

  return {
    slug,
    title: data.title,
    description: data.description,
    publishedAt: data.publishedAt,
    coverImage: data.coverImage,
    gender,
    content,
  };
}

async function getRelatedArticles(currentSlug: string, currentGender: string) {
  const articlesDirectory = path.join(process.cwd(), "app", "content", "articles");

  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(articlesDirectory);

  const allArticles = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(articlesDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      const gender = determineGender(data, slug);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        publishedAt: data.publishedAt || "",
        coverImage: data.coverImage || "",
        gender,
      };
    })
    .filter((article) => article.slug !== currentSlug);

  // 1. Filter strictly for articles matching the current article's gender
  let matched = allArticles.filter((article) => article.gender === currentGender);

  // 2. If not enough same-gender articles exist, fill with unisex
  if (matched.length < 6) {
    const unisex = allArticles.filter(
      (article) => article.gender === "unisex" && !matched.some((m) => m.slug === article.slug)
    );
    matched = [...matched, ...unisex];
  }

  // 3. If still under 6, fill with remaining articles
  if (matched.length < 6) {
    const remaining = allArticles.filter(
      (article) => !matched.some((m) => m.slug === article.slug)
    );
    matched = [...matched, ...remaining];
  }

  // 4. Shuffle or sort so different pages don't render the exact same sequence
  const shuffled = matched.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 6);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: `${article.title} | West Coast Clothing Co.`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(slug, article.gender);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Published Date */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          {article.title}
        </h1>

        {article.publishedAt && (
          <p className="text-sm text-neutral-500 mt-2">
            {article.publishedAt}
          </p>
        )}
      </div>

      {/* Main Cover Image */}
      {article.coverImage && (
        <div className="mb-8 w-full h-[400px] relative rounded-2xl overflow-hidden bg-neutral-900">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content */}
      <article className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-lg">
        <MDXRemote source={article.content} components={mdxComponents} />
      </article>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 border-t border-neutral-200 pt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Related Articles & Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/articles/${related.slug}`}
                className="group bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                {related.coverImage && (
                  <div className="aspect-video w-full relative bg-neutral-100 overflow-hidden">
                    <img
                      src={related.coverImage}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-neutral-900 text-base group-hover:text-emerald-800 transition line-clamp-2">
                    {related.title}
                  </h3>
                  {related.description && (
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {related.description}
                    </p>
                  )}
                  {related.publishedAt && (
                    <span className="mt-4 text-xs text-neutral-400">
                      {related.publishedAt}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}