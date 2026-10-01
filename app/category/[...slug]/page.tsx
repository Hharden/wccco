import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "../../../components/ProductCard";
import { CATEGORY_TREE } from "../../../app/constants/categories";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lookup function for dynamic category tree paths
function getCategoryDetailsFromSlugPath(slugPath: string[]) {
  const targetSlug = slugPath[slugPath.length - 1];

  // 1. Subcategory lookup
  for (const section of CATEGORY_TREE) {
    for (const category of section.categories) {
      const sub = category.subcategories.find((s) => s.slug === targetSlug);
      if (sub) {
        return {
          title: sub.name,
          filterType: "subcategory",
          slug: sub.slug,
        };
      }
    }
  }

  // 2. Parent Category lookup
  for (const section of CATEGORY_TREE) {
    const cat = section.categories.find((c) => c.slug === targetSlug);
    if (cat) {
      return {
        title: cat.name,
        filterType: "category",
        slug: cat.slug,
      };
    }
  }

  // 3. Top-Level Section lookup
  const sec = CATEGORY_TREE.find((s) => s.slug === targetSlug);
  if (sec) {
    return {
      title: sec.name,
      filterType: "section",
      slug: sec.slug,
    };
  }

  return null;
}

// SEO Metadata Generator
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const details = getCategoryDetailsFromSlugPath(slug);

  const title = details
    ? details.title
    : slug[slug.length - 1]
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} | West Coast Clothing Co.`,
    description: `Shop our collection of ${title?.toLowerCase()} crafted for coastal living.`,
    alternates: {
      canonical: `https://westcoastclothingco.com/category/${slug.join("/")}`,
    },
  };
}

// Page Component
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const details = getCategoryDetailsFromSlugPath(slug);

  // Extract raw slug segments from URL route: /category/mens/mens-clothing/mens-jackets-coats
  const rawSection = slug[0];
  const rawCategory = slug[1];
  const rawSubcategory = slug[2] || slug[1] || slug[0];

  // Strip prefixes in case DB stores subcategory without "mens-" or "womens-"
  const cleanSubcategory = rawSubcategory
    ?.replace(/^mens-/, "")
    ?.replace(/^womens-/, "");

  let products = null;

  // 1. Primary Query: Try CATEGORY_TREE Taxonomy match
  if (details) {
    let primaryQuery = supabase.from("products").select("*");

    if (details.filterType === "subcategory") {
      primaryQuery = primaryQuery.or(
        `subcategory.eq.${details.slug},subcategory_slug.eq.${details.slug}`
      );
    } else if (details.filterType === "category") {
      primaryQuery = primaryQuery.or(
        `category.eq.${details.slug},tags.cs.{${details.slug}}`
      );
    } else if (details.filterType === "section") {
      primaryQuery = primaryQuery.eq("section", details.slug);
    }

    const { data } = await primaryQuery;
    products = data;
  }

  // 2. Fallback Query: Match directly against URL parameters & database column variations
  if (!products || products.length === 0) {
    let fallbackQuery = supabase.from("products").select("*");

    if (rawSubcategory) {
      fallbackQuery = fallbackQuery.or(
        `subcategory_slug.eq.${rawSubcategory},subcategory_slug.eq.${cleanSubcategory}`
      );
    } else if (rawCategory) {
      fallbackQuery = fallbackQuery.eq("category", rawCategory);
    } else if (rawSection) {
      fallbackQuery = fallbackQuery.eq("section", rawSection);
    }

    const { data: fallbackData } = await fallbackQuery;
    products = fallbackData;
  }

  const pageTitle =
    details?.title ||
    rawSubcategory
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Products";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{pageTitle}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Handpicked minimalist apparel and outdoor essentials built for the West Coast interface.
        </p>
      </div>

      {/* Product Grid */}
      {!products || products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-neutral-500 text-sm">No products found in this category.</p>
          <Link
            href="/"
            className="inline-block mt-4 text-xs font-semibold text-emerald-800 hover:underline"
          >
            Clear Filters & Return Home
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
