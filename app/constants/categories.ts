export interface Subcategory {
    name: string;
    slug: string;
  }
  
  export interface Category {
    name: string;
    slug: string;
    subcategories?: Subcategory[];
  }
  
  export interface Section {
    name: string;
    slug: string;
    categories?: Category[];
  }
  
  export const CATEGORY_TREE: Section[] = [
    {
      name: "Men's",
      slug: "mens",
      categories: [
        {
          name: "Men's Clothing",
          slug: "mens-clothing",
          subcategories: [
            { name: "Men's Jackets & Coats", slug: "mens-jackets-coats" },
            { name: "Men's Shirts & Tops", slug: "mens-shirts-tops" },
            { name: "Men's Pants & Shorts", slug: "mens-pants-shorts" },
          ],
        },
        {
          name: "Men's Accessories",
          slug: "mens-accessories",
          subcategories: [
            { name: "Men's Hats & Caps", slug: "mens-hats-caps" },
            { name: "Men's Bags & Packs", slug: "mens-bags-packs" },
          ],
        },
      ],
    },
    {
      name: "Women's",
      slug: "womens",
      categories: [
        {
          name: "Women's Clothing",
          slug: "womens-clothing",
          subcategories: [
            { name: "Women's Coats, Jackets & Vests", slug: "womens-coats-jackets-vests" },
            { name: "Women's Knitwear & Tops", slug: "womens-knitwear-tops" },
          ],
        },
        {
          name: "Women's Accessories",
          slug: "womens-accessories",
          subcategories: [
            { name: "Women's Bags & Tote", slug: "womens-bags-totes" },
          ],
        },
      ],
    },
  ];