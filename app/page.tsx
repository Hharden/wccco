import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Revalidate grid every 60 seconds (ISR)
export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  brand: string;
  affiliate_url: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
}

export default async function Home() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Curated Coastal Gear & Wear
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Handpicked minimalist apparel and outdoor essentials built for the West Coast interface.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product: Product) => (
            <div
              key={product.id}
              className="group bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Internal Product Detail Link */}
              <Link href={`/products/${product.slug}`} className="block flex-1">
                <div className="aspect-square relative w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  />
                  {product.brand && (
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {product.brand}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-neutral-900 text-base group-hover:text-emerald-800 transition line-clamp-1">
                      {product.title}
                    </h2>
                    {product.price && (
                      <span className="font-bold text-neutral-900 text-sm">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </Link>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {product.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* External Merchant Affiliate Link */}
                  <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition"
                  >
                    View Merchant
                    <svg
                      className="w-3 h-3"
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
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-500">
            No products added yet. Ingest items in your Supabase dashboard to see them live here!
          </div>
        )}
      </div>
    </main>
  );
}
