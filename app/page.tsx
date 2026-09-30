import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ProductCard from "../components/ProductCard";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const featuredArticle = {
  title: "The Ultimate Pacific Northwest Rainwear Guide",
  slug: "pnw-rainwear-guide",
  description: "How to stay dry and stylish during coastal drizzle and torrential downpours.",
  coverImage: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=80",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;

  let query = supabase.from("products").select("*");

  if (category && category !== "all") {
    query = query.contains("tags", [category]);
  }

  const { data: products } = await query;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          Curated Coastal Gear & Wear
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Handpicked minimalist apparel and outdoor essentials built for the West Coast interface.
        </p>
      </div>

      {/* Featured Article Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white group">
          <img
            src={featuredArticle.coverImage}
            alt={featuredArticle.title}
            className="w-full h-80 object-cover opacity-60 group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Featured Article
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              {featuredArticle.title}
            </h2>
            <p className="text-sm text-neutral-300 mt-2 max-w-2xl">
              {featuredArticle.description}
            </p>
            <Link
              href={`/articles/${featuredArticle.slug}`}
              className="mt-4 inline-flex items-center text-sm font-semibold text-white hover:underline"
            >
              Read Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      {!products || products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-neutral-500 text-sm">No products found in this category.</p>
          <Link
            href="/"
            className="inline-block mt-4 text-xs font-semibold text-emerald-800 hover:underline"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}