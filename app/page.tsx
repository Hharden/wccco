import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { CATEGORY_TREE } from "../app/constants/categories";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const featuredArticle = {
  title: "The Ultimate Pacific Northwest Rainwear Guide",
  slug: "pnw-rainwear-guide",
  description:
    "How to stay dry and stylish during coastal drizzle and torrential downpours.",
  coverImage:
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=80",
};

// Helper function to resolve human-readable category name from URL parameters
function getCategoryTitle(
  section?: string,
  category?: string,
  subcategory?: string
) {
  if (subcategory) {
    for (const sec of CATEGORY_TREE) {
      for (const cat of sec.categories) {
        const foundSub = cat.subcategories.find((s) => s.slug === subcategory);
        if (foundSub) return foundSub.name;
      }
    }
  }

  if (category) {
    for (const sec of CATEGORY_TREE) {
      const foundCat = sec.categories.find((c) => c.slug === category);
      if (foundCat) return foundCat.name;
    }
  }

  if (section) {
    const foundSec = CATEGORY_TREE.find((s) => s.slug === section);
    if (foundSec) return foundSec.name;
  }

  return "Curated Coastal Gear & Wear";
}

// 1. Next.js 15 Dynamic Metadata Generator (SEO Tab Titles)
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    section?: string;
    category?: string;
    subcategory?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const pageTitle = getCategoryTitle(
    resolvedParams.section,
    resolvedParams.category,
    resolvedParams.subcategory
  );

  return {
    title: `${pageTitle} | West Coast Clothing Co.`,
    description: `Explore our handpicked collection of ${pageTitle.toLowerCase()} built for coastal living.`,
  };
}

// 2. Main Page Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    section?: string;
    category?: string;
    subcategory?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { section, category, subcategory } = resolvedParams;

  // Resolve active header title from category tree
  const currentTitle = getCategoryTitle(section, category, subcategory);

  // Build Supabase Query based on active query params
  let query = supabase.from("products").select("*");

  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  } else if (category && category !== "all") {
    query = query.or(`category.eq.${category},tags.cs.{${category}}`);
  } else if (section) {
    query = query.eq("section", section);
  }

  const { data: products } = await query;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          {currentTitle}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Handpicked minimalist apparel and outdoor essentials built for the West
          Coast interface.
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
              Read Guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      {!products || products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-neutral-500 text-sm">
            No products found in this category.
          </p>
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