"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { name: "All", slug: "all" },
  { name: "Men's", slug: "Men's" },
  { name: "Women's", slug: "Women's" },
  { name: "Outerwear & Rain", slug: "Outerwear & Rain" },
  { name: "Surf & Coastal", slug: "Surf & Coastal" },
  { name: "Basics & Accessories", slug: "Basics & Accessories" },
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryClick = (slug: string) => {
    if (slug === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(slug)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-neutral-900">
              <span className="text-emerald-800">▲</span> West Coast Clothing Co.
            </Link>

            {/* Added: Navigation Link to Articles */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/articles"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
              >
                Articles & Guides
              </Link>
            </nav>
          </div>

          {/* Search Bar Placeholder */}
          <div className="hidden sm:flex items-center bg-neutral-100 rounded-full px-4 py-1.5 text-xs text-neutral-500 w-64">
            <span>Search products...</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-t border-neutral-100">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}