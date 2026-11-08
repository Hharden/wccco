import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_TREE } from "@/app/constants/categories";

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to dynamically read all guides/articles from content/articles
async function getFeaturedGuides() {
  const articlesDirectory = path.join(process.cwd(), "app", "content", "articles");

  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(articlesDirectory);
  
  const articles = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(articlesDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        coverImage: data.coverImage || "",
      };
    });

  return articles;
}

// Helper function to resolve human-readable category name from URL parameters
function getCategoryTitle(
  section?: string,
  category?: string,
  subcategory?: string
) {
  if (subcategory) {
    for (const sec of CATEGORY_TREE) {
      for (const cat of sec.categories) {
        const foundSub = cat.subcategories.find((s) => s.slug === subcategory);
        if (foundSub) return foundSub.name;
      }
    }
  }

  if (category) {
    for (const sec of CATEGORY_TREE) {
      const foundCat = sec.categories.find((c) => c.slug === category);
      if (foundCat) return foundCat.name;
    }
  }

  if (section) {
    const foundSec = CATEGORY_TREE.find((s) => s.slug === section);
    if (foundSec) return foundSec.name;
  }

  return "Curated Coastal Gear & Wear";
}

// 1. Next.js 15 Dynamic Metadata Generator (SEO Tab Titles)
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    section?: string;
    category?: string;
    subcategory?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const pageTitle = getCategoryTitle(
    resolvedParams.section,
    resolvedParams.category,
    resolvedParams.subcategory
  );

  return {
    title: `${pageTitle} | West Coast Clothing Co.`,
    description: `Explore our handpicked collection of ${pageTitle.toLowerCase()} built for coastal living.`,
  };
}

// 2. Main Page Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    section?: string;
    category?: string;
    subcategory?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { section, category, subcategory } = resolvedParams;

  // Resolve active header title from category tree
  const currentTitle = getCategoryTitle(section, category, subcategory);

  // If user is browsing with filters, respect the filter query
  let query = supabase.from("products").select("*");
  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  } else if (category && category !== "all") {
    query = query.or(`category.eq.${category},tags.cs.{${category}}`);
  } else if (section) {
    query = query.eq("section", section);
  }
  const { data: filteredProducts } = await query;

  // Dynamically fetch all guides from the file system
  const allGuides = await getFeaturedGuides();
  const heroGuides = allGuides.slice(0, 2);
  const secondaryGuides = allGuides.slice(2, 4);

  // 1. Fetch separate targeted pools so sections never overlap completely
  const { data: allProductsPool } = await supabase.from("products").select("*");
  const masterPool = allProductsPool || [];

  // Shuffle pool to pick random items safely for Featured Picks
  const shuffledMaster = [...masterPool].sort(() => 0.5 - Math.random());
  const featuredPicksProducts = shuffledMaster.slice(0, 8);
  const usedProductIds = new Set(featuredPicksProducts.map((p) => p.id));

  // 2. Men's Section
  const mensPool = masterPool.filter((p) => p.section === "mens" && !usedProductIds.has(p.id));
  const mensProducts = (mensPool.length >= 8 ? mensPool : masterPool.filter((p) => p.section === "mens")).slice(0, 8);
  mensProducts.forEach((p) => usedProductIds.add(p.id));

  // 3. Women's Section
  const womensPool = masterPool.filter((p) => p.section === "womens" && !usedProductIds.has(p.id));
  const womensProducts = (womensPool.length >= 8 ? womensPool : masterPool.filter((p) => p.section === "womens")).slice(0, 8);
  womensProducts.forEach((p) => usedProductIds.add(p.id));
// 4. Random Subcategory Section mapped using exact CATEGORY_TREE hierarchy
const subcategoryList: {
  sectionSlug: string;
  categorySlug: string;
  subSlug: string;
  name: string;
  fullUrl: string;
}[] = [];

CATEGORY_TREE.forEach((sec) => {
  sec.categories.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      subcategoryList.push({
        sectionSlug: sec.slug,
        categorySlug: cat.slug,
        subSlug: sub.slug,
        name: sub.name,
        fullUrl: `/category/${sec.slug}/${cat.slug}/${sub.slug}`,
      });
    });
  });
});

const randomSubObj = subcategoryList.length > 0 
  ? subcategoryList[Math.floor(Math.random() * subcategoryList.length)]
  : { sectionSlug: "mens", categorySlug: "mens-clothing", subSlug: "mens-sweatshirts-hoodies", name: "Sweatshirts & Hoodies", fullUrl: "/category/mens/mens-clothing/mens-sweatshirts-hoodies" };

const randomSubTitle = randomSubObj.name;
const randomSubUrl = randomSubObj.fullUrl;
const randomSubSlug = randomSubObj.subSlug;

// Query Supabase matching subcategory_slug exactly like your dynamic route
const { data: randomSubProducts } = await supabase
  .from("products")
  .select("*")
  .eq("subcategory_slug", randomSubSlug)
  .limit(8);

const bottomSectionProducts = randomSubProducts || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          {currentTitle}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Handpicked minimalist apparel and outdoor essentials built for the West
          Coast interface.
        </p>
      </div>

      {/* 1. Hero Guides (2 Dynamic Featured Guide Cards) */}
      {heroGuides.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {heroGuides.map((guide) => (
              <div
                key={guide.slug}
                className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white group h-80 flex flex-col justify-end"
              >
                {guide.coverImage && (
                  <img
                    src={guide.coverImage}
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
                  />
                )}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Featured Guide
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-1">
                    {guide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-2">
                    {guide.description}
                  </p>
                  <Link
                    href={`/articles/${guide.slug}`}
                    className="mt-3 inline-flex items-center text-sm font-semibold text-white hover:underline"
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Featured Picks (Horizontal Slider / Carousel - Random Products, No View All) */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">Featured Picks</h2>
          <p className="text-xs text-neutral-500">Handpicked essentials for the season.</p>
        </div>
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
          {featuredPicksProducts.map((product) => (
            <div key={product.id} className="w-72 sm:w-80 flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Category Section 1: Featured Men's (Horizontal Slider) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Featured Men's</h2>
            <p className="text-xs text-neutral-500">Built for rugged coastal exploration.</p>
          </div>
          <Link href="/category/mens" className="text-xs font-semibold text-emerald-800 hover:underline">
            Shop All Men's &rarr;
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
          {mensProducts.map((product) => (
            <div key={product.id} className="w-72 sm:w-80 flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Category Section 2: Featured Women's (Horizontal Slider) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Featured Women's</h2>
            <p className="text-xs text-neutral-500">Minimalist style meets technical performance.</p>
          </div>
          <Link href="/category/womens" className="text-xs font-semibold text-emerald-800 hover:underline">
            Shop All Women's &rarr;
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
          {womensProducts.map((product) => (
            <div key={product.id} className="w-72 sm:w-80 flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Mid-Page: Secondary Dynamic Guide Cards */}
      {secondaryGuides.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryGuides.map((guide) => (
            <div
              key={`mid-${guide.slug}`}
              className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white group h-64 flex flex-col justify-end"
            >
              {guide.coverImage && (
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
                />
              )}
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Featured Guide
                </span>
                <h3 className="text-lg font-bold mt-1">{guide.title}</h3>
                <Link
                  href={`/articles/${guide.slug}`}
                  className="mt-2 inline-flex items-center text-xs font-semibold text-white hover:underline"
                >
                  Read Guide &rarr;
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 6. Bottom Random Subcategory Section (Grid Format with masterPool fallback) */}
      <section>
        <div className="flex items-center justify-between tracking-tight mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{randomSubTitle}</h2>
            
            <p className="text-xs text-neutral-500">Handpicked selections from our catalog.</p>
          </div>
          <Link href={randomSubUrl} className="text-xs font-semibold text-emerald-800 hover:underline">
            View Collection &rarr;
          </Link>
        </div>
        {bottomSectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bottomSectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-500">No products available in this subcategory right now.</p>
        )}
      </section>

    </main>
  );
}