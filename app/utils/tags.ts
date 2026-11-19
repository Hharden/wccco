export function slugifyTag(tag: string): string {
    return tag
      .toLowerCase()
      .trim()
      .replace(/['’]/g, "") // remove apostrophes (e.g., Men's -> mens)
      .replace(/%/g, "-percent") // turn 100% into 100-percent
      .replace(/[^a-z0-9]+/g, "-") // replace spaces/symbols with hyphens
      .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  }
  
  // Formats the display name (e.g. capitalizes "waterproof" -> "Waterproof" while keeping "100% Soft Cotton" intact)
  export function formatTagLabel(tag: string): string {
    const trimmed = tag.trim();
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }