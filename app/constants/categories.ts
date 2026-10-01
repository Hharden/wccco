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
          name: "Clothing",
          slug: "clothing",
          subcategories: [
            { name: "Jackets & Coats", slug: "jackets-coats" },
            { name: "Shirts & Tops", slug: "shirts-tops" },
            { name: "Pants & Shorts", slug: "pants-shorts" },
          ],
        },
        {
          name: "Accessories",
          slug: "accessories",
          subcategories: [
            { name: "Hats & Caps", slug: "hats" },
            { name: "Bags & Packs", slug: "bags" },
          ],
        },
      ],
    },
    {
      name: "Women's",
      slug: "womens",
      categories: [
        {
          name: "Clothing",
          slug: "clothing",
          subcategories: [
            { name: "Jackets & Rainwear", slug: "jackets-rainwear" },
            { name: "Knitwear & Tops", slug: "knitwear-tops" },
          ],
        },
        {
          name: "Accessories",
          slug: "accessories",
          subcategories: [
            { name: "Bags & Tote", slug: "bags-totes" },
          ],
        },
      ],
    },
  ];