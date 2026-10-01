"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mountain, Search, ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORY_TREE, Section, Category } from "./constants/categories";

function HeaderContent() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleNavigate = (section: string, category?: string, subcategory?: string) => {
    const params = new URLSearchParams();
    if (section && section !== "all") params.set("section", section);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    setActiveSection(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
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

        {/* Multilevel Navigation Menu */}
        <div className="flex items-center gap-1 py-2 overflow-x-visible border-t border-neutral-100">
          <button
            onClick={() => handleNavigate("all")}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition"
          >
            All Products
          </button>

          {CATEGORY_TREE.map((section: Section) => (
            <div
              key={section.slug}
              className="relative group"
              onMouseEnter={() => setActiveSection(section.slug)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <button
                onClick={() => handleNavigate(section.slug)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition"
              >
                {section.name}
                {section.categories && <ChevronDown className="w-3 h-3 text-neutral-400" />}
              </button>

              {/* Level 1 Dropdown: Categories */}
              {section.categories && activeSection === section.slug && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
                  {section.categories.map((cat: Category) => (
                    <div key={cat.slug} className="relative group/sub">
                      <button
                        onClick={() => handleNavigate(section.slug, cat.slug)}
                        className="w-full text-left flex items-center justify-between px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-emerald-800 transition"
                      >
                        {cat.name}
                        {cat.subcategories && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                      </button>

                      {/* Level 2 Flyout Dropdown: Subcategories */}
                      {cat.subcategories && (
                        <div className="absolute top-0 left-full ml-0.5 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 hidden group-hover/sub:block">
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub.slug}
                              onClick={() => handleNavigate(section.slug, cat.slug, sub.slug)}
                              className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-emerald-800 transition"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<header className="h-28 bg-white border-b border-neutral-200" />}>
      <HeaderContent />
    </Suspense>
  );
}