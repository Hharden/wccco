'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SECTIONS = [
  { label: "Men's", value: 'mens' },
  { label: "Women's", value: 'womens' },
];

const CATEGORIES = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Basics', value: 'basics' },
  { label: 'Surf', value: 'surf' },
];

const SUBCATEGORIES: Record<string, { label: string; value: string }[]> = {
  clothing: [
    { label: 'Jackets & Coats', value: 'jackets-coats' },
    { label: 'Shirts & Tops', value: 'shirts-tops' },
    { label: 'Pants & Bottoms', value: 'pants-bottoms' },
  ],
  outerwear: [
    { label: 'Rain Jackets', value: 'rain-jackets' },
    { label: 'Parkas', value: 'parkas' },
  ],
  basics: [
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Hoodies & Sweatshirts', value: 'hoodies-sweatshirts' },
  ],
  surf: [
    { label: 'Boardshorts', value: 'boardshorts' },
    { label: 'Wetsuits', value: 'wetsuits' },
  ],
};

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brand: '',
    merchant_id: '',
    description: '',
    image_url: '',
    affiliate_url: '',
    section: 'mens',
    category: 'clothing',
    subcategory_slug: 'jackets-coats',
    tags: '',
    is_featured: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === generatedSlug ? generatedSlug : prev.slug,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const availableSubcategories = SUBCATEGORIES[newCategory] || [];
    const firstSubcategory = availableSubcategories[0]?.value || '';

    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      subcategory_slug: firstSubcategory,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const productPayload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-'),
      brand: formData.brand,
      merchant_id: formData.merchant_id || 'amazon',
      description: formData.description,
      image_url: formData.image_url,
      affiliate_url: formData.affiliate_url,
      section: formData.section,
      category: formData.category,
      subcategory_slug: formData.subcategory_slug || null,
      tags: tagsArray,
      is_featured: formData.is_featured,
    };

    const { error } = await supabase.from('products').insert([productPayload]);

    setLoading(false);

    if (error) {
      console.error('Insert error:', error);
      setStatusMsg({ type: 'error', text: `Failed to add product: ${error.message}` });
    } else {
      setStatusMsg({ type: 'success', text: 'Product successfully added to Supabase catalog!' });
      setFormData({
        title: '',
        slug: '',
        brand: '',
        merchant_id: '',
        description: '',
        image_url: '',
        affiliate_url: '',
        section: 'mens',
        category: 'clothing',
        subcategory_slug: 'jackets-coats',
        tags: '',
        is_featured: false,
      });
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin: Add New Catalog Product</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Instantly ingest products directly into your Supabase database.
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg px-3 py-2 transition"
        >
          ← Back to Catalog
        </Link>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm mb-6 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
            Product Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g. Pacific Coast Rain Shell"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Patagonia, Columbia, Levi's"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Retailer / Merchant Name
            </label>
            <input
              type="text"
              value={formData.merchant_id}
              onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
              placeholder="e.g. Amazon, Huckberry, REI (Defaults to Amazon)"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="pacific-coast-rain-shell"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-neutral-50 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-[11px] text-neutral-400 mt-1 block">Auto-generated from title if left blank.</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief product summary highlighting materials, fit, or weather performance..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Affiliate / Retailer URL *
            </label>
            <input
              type="url"
              required
              value={formData.affiliate_url}
              onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
              placeholder="https://amazon.com/dp/..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Section
            </label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">None</option>
              {SECTIONS.map((sec) => (
                <option key={sec.value} value={sec.value}>
                  {sec.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
              Subcategory
            </label>
            <select
              value={formData.subcategory_slug}
              onChange={(e) => setFormData({ ...formData, subcategory_slug: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">None</option>
              {(SUBCATEGORIES[formData.category] || []).map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
            Tags (Comma-Separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Men's, Outerwear & Rain, Waterproof"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-neutral-700 select-none">
            Mark as Featured Product
          </label>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition shadow-sm"
          >
            {loading ? 'Adding Product...' : 'Publish Product to Catalog'}
          </button>
        </div>
      </form>
    </main>
  );
}