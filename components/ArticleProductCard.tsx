import { createClient } from "@supabase/supabase-js";
import ProductCard from "./ProductCard";

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

  return (
    <div className="not-prose my-6 max-w-sm mx-auto sm:max-w-none">
      <ProductCard product={product} />
    </div>
  );
}