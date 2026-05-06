import { clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (name) => {
  if (!name) return "";

  const options = {
    lower: true,
    strict: true,
    trim: true,
  };

  return `${slugify(name, options)}-${Date.now()}`;
};

export function formatQuote(text) {
  return text.replace(/"/g, "\u201C").replace(/"/g, "\u201D");
}

export function formatApostrophe(text) {
  return text.replace(/'/g, "\u2019").replace(/'/g, "\u2018");
}

export function formatText(text) {
  if (typeof text !== "string") return text;
  return formatApostrophe(formatQuote(text));
}
