import { clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (name) => {
  if (!name) return "";

  const options = {
    lower: true, // convert to lower case
    strict: true, // strip special characters except replacement
    trim: true, // trim leading and trailing replacement chars
  };

  return `${slugify(name, options)}-${Date.now()}`;
};
