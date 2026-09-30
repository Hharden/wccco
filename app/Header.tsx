"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mountain, Search } from "lucide-react";

const categories = [
  { name: "All", slug: "all" },
  { name: "Men's", slug: "Men's" },
  { name: "Women's", slug: "Women's" },
  { name: "Outerwear & Rain", slug: "Outerwear & Rain" },
  { name: "Surf & Coastal", slug: "Surf & Coastal" },
  { name: "Basics & Accessories", slug: "Basics & Accessories" },
];

function HeaderContent() {
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
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-neutral-900 tracking-tight hover:opacity-90 transition"
            >
              <Mountain className="w-5 h-5 text-emerald-800" />
              <span>West Coast Clothing Co.</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/articles"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
              >
                Articles & Guides
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center relative w-64">
            <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-100 pl-9 pr-4 py-1.5 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:bg-white border border-transparent focus:border-neutral-300 transition"
            />
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
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
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

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 h-28" />
    }>
      <HeaderContent />
    </Suspense>
  );
}