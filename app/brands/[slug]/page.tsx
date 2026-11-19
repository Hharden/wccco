import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import ProductCard from "@/components/ProductCard";
import { slugifyBrand } from "../../utils/brands";

export const revalidate = 60;

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ section?: string }>;
}

export default async function BrandDetailPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const { section } = await searchParams;

  // Normalize active section filter ('all' | 'mens' | 'womens')
  const activeSection =
    section === "mens" || section === "womens" ? section : "all";

  // Fetch all products so we can match the slugified brand accurately
  const { data: allProducts, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching brand products:", error);
  }

  // Filter products belonging to this brand slug
  const brandProducts = (allProducts || []).filter(
    (product) => product.brand && slugifyBrand(product.brand) === slug
  );

  if (brandProducts.length === 0) {
    notFound();
  }

  // Grab the properly capitalized brand name from the first matching product
  const brandName = brandProducts[0].brand;

  // Apply the Men's / Women's URL filter
  const filteredProducts =
    activeSection === "all"
      ? brandProducts
      : brandProducts.filter((product) => product.section === activeSection);

  // Counts for filter pills
  const mensCount = brandProducts.filter((p) => p.section === "mens").length;
  const womensCount = brandProducts.filter((p) => p.section === "womens").length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <Link
          href="/brands"
          className="text-xs font-medium text-neutral-500 hover:text-emerald-800 transition"
        >
          &larr; All Brands
        </Link>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          {brandName}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Showing {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Section Filter Pills (Updates URL query parameter) */}
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-neutral-200">
        <Link
          href={`/brands/${slug}`}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
            activeSection === "all"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          All ({brandProducts.length})
        </Link>

        <Link
          href={`/brands/${slug}?section=mens`}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
            activeSection === "mens"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Men&apos;s ({mensCount})
        </Link>

        <Link
          href={`/brands/${slug}?section=womens`}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
            activeSection === "womens"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Women&apos;s ({womensCount})
        </Link>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
          <p className="text-sm text-neutral-600">
            No {activeSection === "mens" ? "Men's" : "Women's"} products available for {brandName}.
          </p>
          <Link
            href={`/brands/${slug}`}
            className="inline-block mt-3 text-xs font-semibold text-emerald-800 hover:underline"
          >
            View all {brandName} products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}