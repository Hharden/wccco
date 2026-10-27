import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ProductCard from "../../../components/ProductCard";
import { CATEGORY_TREE } from "../../constants/categories";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to resolve category names from slugs for breadcrumbs
function getCategoryNames(sectionSlug?: string, categorySlug?: string, subcategorySlug?: string) {
  let sectionName = "";
  let categoryName = "";
  let subcategoryName = "";

  if (sectionSlug) {
    const sec = CATEGORY_TREE.find((s) => s.slug === sectionSlug);
    if (sec) {
      sectionName = sec.name;
      if (categorySlug) {
        const cat = sec.categories?.find((c) => c.slug === categorySlug);
        if (cat) {
          categoryName = cat.name;
          if (subcategorySlug) {
            const sub = cat.subcategories?.find((s) => s.slug === subcategorySlug);
            if (sub) subcategoryName = sub.name;
          }
        }
      }
    }
  }

  return { sectionName, categoryName, subcategoryName };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // 1. Fetch the main product by slug
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) {
    notFound();
  }

  // 2. Fetch up to 8 related products (2 rows of 4) in the same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("slug", resolvedParams.slug)
    .limit(8);

  const retailerName = product.retailer || product.brand || "Retailer";

  // Resolve breadcrumbs and full category name
  const { sectionName, categoryName, subcategoryName } = getCategoryNames(
    product.section,
    product.category,
    product.subcategory_slug
  );

  const fullCategoryName =
    subcategoryName || categoryName || sectionName || "Coastal Gear";

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header: Title & Breadcrumbs spanning both columns */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          {product.title}
        </h1>

        {/* Breadcrumb path */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2 flex-wrap">
          <Link href="/" className="hover:text-neutral-900 transition">
            West Coast Clothing Co.
          </Link>
          {sectionName && (
            <>
              <span>&nbsp;&gt;&nbsp;</span>
              <Link href={`/category/${product.section}`} className="hover:text-neutral-900 transition">
                {sectionName}
              </Link>
            </>
          )}
          {categoryName && (
            <>
              <span>&nbsp;&gt;&nbsp;</span>
              <Link
                href={`/category/${product.section}/${product.category}`}
                className="hover:text-neutral-900 transition"
              >
                {categoryName}
              </Link>
            </>
          )}
          {subcategoryName && (
            <>
              <span>&nbsp;&gt;&nbsp;</span>
              <Link
                href={`/category/${product.section}/${product.category}/${product.subcategory_slug}`}
                className="hover:text-neutral-900 transition"
              >
                {subcategoryName}
              </Link>
            </>
          )}
          <span>&nbsp;&gt;&nbsp;</span>
          <span className="text-neutral-800 font-medium truncate max-w-[300px]">
            {product.title}
          </span>
        </nav>
      </div>

      {/* Main Grid: Image | Product Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-16">
        {/* Product Image */}
        <div className="aspect-square relative w-full bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-contain object-center"
          />
          {product.brand && (
            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full z-10">
              {product.brand}
            </span>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Top Primary CTA Button */}
            <div className="mb-6">
              <a
                href={product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-6 rounded-xl text-sm transition shadow-sm"
              >
                Buy at {retailerName}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {product.color && (
              <p className="text-xs text-neutral-500 mb-3">
                Color: <span className="font-medium text-neutral-800">{product.color}</span>
              </p>
            )}

            {/* Formatted Description with ReactMarkdown */}
            <div className="text-sm leading-relaxed text-neutral-600">
              <ReactMarkdown
                components={{
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 my-3 space-y-1">{children}</ul>
                  ),
                  li: ({ children }) => <li className="text-neutral-600">{children}</li>,
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                }}
              >
                {product.description}
              </ReactMarkdown>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Secondary CTA Button at Bottom */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-neutral-800 text-white font-semibold py-3 px-6 rounded-xl text-sm transition shadow-sm"
            >
              Buy at {retailerName}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Similar Products Section (Up to 2 rows of 4 cards) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-neutral-200 pt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
            Similar Products in {fullCategoryName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}