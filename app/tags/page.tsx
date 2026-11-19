import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { slugifyTag, formatTagLabel } from "../utils/tags";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TagSummary {
  name: string;
  slug: string;
  count: number;
}

export default async function TagsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("tags");

  if (error) {
    console.error("Error fetching tags:", error);
  }

  const tagMap = new Map<string, TagSummary>();

  (products || []).forEach((item) => {
    if (!Array.isArray(item.tags)) return;

    // Deduplicate tags within a single product just in case
    const seenInProduct = new Set<string>();

    item.tags.forEach((rawTag: string) => {
      const cleaned = rawTag?.trim();
      if (!cleaned) return;

      const slug = slugifyTag(cleaned);
      if (!slug || seenInProduct.has(slug)) return;
      seenInProduct.add(slug);

      const existing = tagMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(slug, {
          name: formatTagLabel(cleaned),
          slug,
          count: 1,
        });
      }
    });
  });

  // Sort alphabetically
  const tags = Array.from(tagMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Shop by Tag
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Browse all {tags.length} product tags available at West Coast Clothing Co.
        </p>
      </div>

      {tags.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
          <p className="text-sm text-neutral-600">No tags found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="group bg-white border border-neutral-200 rounded-xl p-5 hover:border-emerald-800 hover:shadow-sm transition flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-neutral-900 group-hover:text-emerald-800 transition">
                  {tag.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {tag.count} {tag.count === 1 ? "product" : "products"}
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