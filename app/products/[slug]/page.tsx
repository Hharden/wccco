import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 mt-3">{product.title}</h1>
            <p className="text-xl font-bold text-neutral-900 mt-2">${product.price}</p>
            <p className="text-sm text-neutral-600 mt-4 leading-relaxed">{product.description}</p>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-6">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="text-[11px] bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 rounded-xl transition-colors text-center text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            Buy on Retailer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
