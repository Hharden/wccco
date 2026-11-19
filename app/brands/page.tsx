import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { slugifyBrand } from "../utils/brands";

export const revalidate = 60; // Revalidate every 60 seconds

interface BrandSummary {
  name: string;
  slug: string;
  count: number;
}

export default async function BrandsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("brand");

  if (error) {
    console.error("Error fetching brands:", error);
  }

  // Group products by brand name and count them
  const brandMap = new Map<string, BrandSummary>();

  (products || []).forEach((item) => {
    const rawBrand = item.brand?.trim();
    if (!rawBrand) return;

    const slug = slugifyBrand(rawBrand);
    const existing = brandMap.get(slug);

    if (existing) {
      existing.count += 1;
    } else {
      brandMap.set(slug, {
        name: rawBrand,
        slug,
        count: 1,
      });
    }
  });

  // Sort alphabetically
  const brands = Array.from(brandMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Shop by Brand
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Browse all {brands.length} brands available at West Coast Clothing Co.
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
          <p className="text-sm text-neutral-600">No brands found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group bg-white border border-neutral-200 rounded-xl p-5 hover:border-emerald-800 hover:shadow-sm transition flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-neutral-900 group-hover:text-emerald-800 transition">
                  {brand.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {brand.count} {brand.count === 1 ? "product" : "products"}
                </p>
              </div>
              <span className="text-neutral-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition text-sm">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}