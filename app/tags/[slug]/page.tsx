import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProductCard from "@/components/ProductCard";
import { slugifyTag, formatTagLabel } from "../../utils/tags";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagDetailPage({ params }: TagPageProps) {
  const { slug } = await params;

  const { data: allProducts, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching tagged products:", error);
  }

  let matchedTagName = "";

  // Filter products that contain a tag matching this slug
  const tagProducts = (allProducts || []).filter((product) => {
    if (!Array.isArray(product.tags)) return false;

    const matchingTag = product.tags.find(
      (t: string) => t && slugifyTag(t) === slug
    );

    if (matchingTag && !matchedTagName) {
      matchedTagName = formatTagLabel(matchingTag);
    }

    return Boolean(matchingTag);
  });

  if (tagProducts.length === 0) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-8 pb-4 border-b border-neutral-200">
        <Link
          href="/tags"
          className="text-xs font-medium text-neutral-500 hover:text-emerald-800 transition"
        >
          &larr; All Tags
        </Link>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          {matchedTagName}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Showing {tagProducts.length}{" "}
          {tagProducts.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tagProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}