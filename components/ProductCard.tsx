import Link from "next/link";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  affiliate_url: string;
  image_url: string;
  tags: string[];
  merchant_id?: string;
  retailer?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const retailerName = product.merchant_id || product.brand || "Retailer";

  return (
    <div className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      {/* Clickable Header & Details (Navigates to Internal Product Detail Page) */}
      <Link href={`/products/${product.slug}`} className="block cursor-pointer">
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

        <div className="p-4 pb-2">
          <h2 className="font-semibold text-neutral-900 text-base group-hover:text-emerald-800 transition line-clamp-1">
            {product.title}
          </h2>
          {product.description && (
            <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {product.description.replace(/<[^>]*>?/gm, "")}
            </p>
          )}
        </div>
      </Link>

      {/* Footer / External Affiliate Link (Opens Merchant in New Tab) */}
      <div className="p-4 pt-3 border-t border-neutral-100 flex items-center justify-between mt-auto">
        <div className="flex gap-1 flex-wrap max-w-[50%]">
          {product.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded truncate"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={product.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition whitespace-nowrap cursor-pointer"
        >
          Buy at <span className="capitalize">{retailerName}</span>
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}