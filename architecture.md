# Architecture & Technical Specifications

## Overview
West Coast Clothing Co. is an curated e-commerce catalog built on Next.js 15, Tailwind CSS, and Supabase. Products are rendered via Server-Side Rendering (SSR) / Incremental Static Regeneration (ISR) and redirect users to affiliate retail destinations.

## Data Fetching Strategy
- Server Components query Supabase directly using `@supabase/supabase-js`.
- Revalidation rate: `export const revalidate = 60;` (60-second ISR).
- Anonymous client initialization:
  ```ts
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
