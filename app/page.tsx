import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { CATEGORY_TREE } from "../app/constants/categories";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const featuredArticles = [
  {
    title: "The Ultimate Men's Rainwear Guide",
    slug: "mens-rainwear-guide",
    description:
      "How to stay dry and stylish during coastal drizzle and torrential downpours.",
    coverImage:
      "https://ioepraoxqtygfmqcvdrv.supabase.co/storage/v1/object/public/marketing-images/2-men-hiking-in-rain-mountain.jpg",
  },
  {
    title: "Essential Layering for Coastal Climates",
    slug: "womens-rainwear-guide", // Update with your actual second article slug
    description:
      "Master the art of temperature regulation with breathable, minimalist layers.",
    coverImage:
      "https://ioepraoxqtygfmqcvdrv.supabase.co/storage/v1/object/public/marketing-images/3-women-hiking-boot-splash.jpg", // Update with your actual image
  },
];

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

  return "Hand-Picked & Featured Coastal Gear & Wear";
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

  // Build Supabase Query based on active query params, sorted by newest first
  let query = supabase.from("products").select("*");

  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  } else if (category && category !== "all") {
    query = query.or(`category.eq.${category},tags.cs.{${category}}`);
  } else if (section) {
    query = query.eq("section", section);
  }

  // Sort by newest added at the top
  query = query.order("created_at", { ascending: false });

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

      {/* Featured Articles Hero Section (2-Column Grid) */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((article) => (
            <div
              key={article.slug}
              className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white group h-80 flex flex-col justify-end"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Featured Article
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-1">
                  {article.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-2">
                  {article.description}
                </p>
                <Link
                  href={`/articles/${article.slug}`}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-white hover:underline"
                >
                  Read Guide &rarr;
                </Link>
              </div>
            </div>
          ))}
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