import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleProductCard from "../../../components/ArticleProductCard";

const mdxComponents = {
  ArticleProductCard,
};

async function getArticleBySlug(slug: string) {
    const articlesDirectory = path.join(process.cwd(), "app", "content", "articles");
  const filePath = path.join(articlesDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title,
    description: data.description,
    publishedAt: data.publishedAt,
    coverImage: data.coverImage,
    content,
  };
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Published Date */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          {article.title}
        </h1>

        {article.publishedAt && (
          <p className="text-sm text-neutral-500 mt-2">{article.publishedAt}</p>
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
    </main>
  );
}