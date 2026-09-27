"use client";

import React, { useState } from "react";
import Link from "next/link";

const categories = [
  "All",
  "Men's",
  "Women's",
  "Outerwear & Rain",
  "Surf & Coastal",
  "Basics & Accessories",
];

export default function Header() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Search Bar */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Minimalist Wave/Mountain SVG Logo */}
            <svg
              className="w-7 h-7 text-emerald-800 transition-transform group-hover:scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Mountain Peaks */}
              <path d="M2 20L8.5 9L13 16L17 10L22 20H2Z" />
              {/* Wave Lines */}
              <path d="M4 17C7 17 9 18.5 12 18.5C15 18.5 17 17 20 17" />
            </svg>
            <span className="font-semibold text-lg tracking-tight text-neutral-900">
              West Coast Clothing Co.
            </span>
          </Link>

          {/* Simple Search Input */}
          <div className="relative hidden md:block w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-100 text-sm text-neutral-800 placeholder-neutral-400 rounded-full py-2 pl-4 pr-9 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none transition"
            />
            <svg
              className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth border-t border-neutral-100">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}