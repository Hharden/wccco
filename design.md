# West Coast Clothing Co. — Design System Specification

## Brand Identity & Tone
* **Vibe:** Minimalist, Pacific Northwest / Coastal California earthy aesthetic.
* **Core Principles:** Utility-first, clean whitespace, subtle interactions, functional grid layouts.

## Typography
* **Primary Font:** Inter / System Sans-Serif (`font-sans`)
* **Scale:**
  * Header Brand Title: `text-xl font-bold tracking-tight`
  * Product Titles: `text-base font-semibold text-neutral-900`
  * Body / Descriptions: `text-sm text-neutral-600`
  * Microcopy / Tags: `text-xs uppercase font-medium tracking-wider text-emerald-800`

## Color Palette & Tokens
* **Backgrounds:**
  * Canvas: `#FAFAFA` (`bg-neutral-50`)
  * Surface / Cards: `#FFFFFF` (`bg-white`)
  * Badges / Active Pills: `#ECFDF5` (`bg-emerald-50`)
* **Text Tones:**
  * Headings: `#171717` (`text-neutral-900`)
  * Muted / Body: `#525252` (`text-neutral-600`)
  * Accent Brand Link: `#047857` (`text-emerald-700`)
* **Borders:**
  * Subtle Divider: `#E5E5E5` (`border-neutral-200`)

## Component Rules

### Header (`Header.tsx`)
* **Layout:** Sticky top, backdrop blur (`backdrop-blur-md bg-white/80 border-b border-neutral-200`).
* **Logo:** Inline SVG restrained to `w-7 h-7 text-emerald-700`.
* **Search Input:** Subtle rounded input with internal magnifying glass SVG (`w-4 h-4 text-neutral-400`).
* **Category Navigation:** Horizontal pill list with scrollable overflow (`overflow-x-auto no-scrollbar`). Active state: `bg-neutral-900 text-white`; Inactive state: `bg-neutral-100 text-neutral-600 hover:bg-neutral-200`.

### Product Cards (`page.tsx`)
* **Grid:** Responsive columns (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`).
* **Image Aspect:** 4:3 or 1:1 object-cover with subtle hover zoom (`group-hover:scale-105 transition-transform duration-300`).
* **External CTA:** "View Merchant" button with inline external arrow icon constrained strictly to `w-3.5 h-3.5`.
