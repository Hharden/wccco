export function slugifyBrand(brand: string): string {
    return brand
      .toLowerCase()
      .trim()
      .replace(/['’]/g, "") // remove apostrophes (e.g., Arc'teryx -> arcteryx)
      .replace(/[^a-z0-9]+/g, "-") // replace spaces/symbols with hyphens
      .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  }