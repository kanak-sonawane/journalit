import { PageType } from "./types";

export const PAGE_TYPES: { label: string; value: PageType }[] = [
  { label: "Blank", value: "blank" },
  { label: "Ruled", value: "ruled" },
  { label: "Dotted", value: "dotted" },
  { label: "Grid", value: "grid" },
];

export const FONTS = [
  { label: "Handwritten", value: "var(--font-caveat)" },
  { label: "Clean", value: "var(--font-nunito)" },
  { label: "Elegant", value: "var(--font-playfair)" },
  { label: "Typewriter", value: "var(--font-special-elite)" },
];

export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48];

export const DEFAULT_PAGE_COLOR = "#FFF5E4";

export const DEFAULT_TEXT_ELEMENT = {
  fontSize: 16,
  fontFamily: "var(--font-caveat)",
  color: "#000000",
  bold: false,
  italic: false,
  width: 200,
  height: 80,
  rotation: 0,
  content: "Write something...",
};

export const FLOATING_STICKERS = ["🌸", "⭐", "📎", "✂️", "🎞️", "🍵", "🦋", "🌿", "💌", "🎀"];