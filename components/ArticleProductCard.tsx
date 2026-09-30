import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

interface ArticleProductCardProps {
  slug: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function ArticleProductCard({ slug }: ArticleProductCardProps) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    return null;
  }

  const retailerName = product.retailer || product.brand || "Amazon";

  return (
    <div className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col justify-between not-prose">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square relative w-full bg-neutral-100 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          />
          {product.brand && (
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {product.brand}
            </span>
          )}
        </div>

        <div className="p-4 pb-2">
          <h2 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-800 transition line-clamp-1">
            {product.title}
          </h2>
          {product.description && (
            <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
              {product.description.replace(/<[^>]*>?/gm, "")}
            </p>
          )}
        </div>
      </Link>

      <div className="p-4 pt-2 border-t border-neutral-100 flex items-end justify-between gap-2 mt-auto">
        <div className="flex flex-col gap-1 max-w-[50%]">
          {product.tags &&
            product.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md truncate"
              >
                {tag}
              </span>
            ))}
        </div>

        <a
          href={product.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition whitespace-nowrap"
        >
          Buy at <span className="capitalize">{product.merchant_id || "Retailer"}</span>
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
  );
}