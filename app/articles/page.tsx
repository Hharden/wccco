import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

async function getArticles() {
    const articlesDirectory = path.join(process.cwd(), "app", "content", "articles");
      
    if (!fs.existsSync(articlesDirectory)) {
      return [];
    }
  
    const filenames = fs.readdirSync(articlesDirectory);
  
    const articles = filenames
      .filter((filename) => filename.endsWith(".mdx"))
      .map((filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        const filePath = path.join(articlesDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);
  
        return {
          slug,
          title: data.title || slug,
          description: data.description || "",
          publishedAt: data.publishedAt || "",
          coverImage: data.coverImage || "",
        };
      });
  
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }



export default async function ArticlesIndexPage() {
  const articles = await getArticles();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          Articles & Guides
        </h1>
        <p className="mt-2 text-neutral-600">
          Expert advice, gear breakdowns, and outdoor guides from West Coast Clothing Co.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-neutral-500">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {article.coverImage && (
                <div className="aspect-video w-full relative bg-neutral-100 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="font-semibold text-neutral-900 text-lg group-hover:text-emerald-800 transition line-clamp-2">
                  {article.title}
                </h2>
                {article.description && (
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {article.description}
                  </p>
                )}
                {article.publishedAt && (
                  <span className="mt-4 text-xs text-neutral-400">
                    {article.publishedAt}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}