import { clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names using clsx and tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique slug from a name with timestamp suffix
 * @param {string} name
 * @returns {string}
 */
export function generateSlug(name) {
  if (!name) return "";

  const options = {
    lower: true,
    strict: true,
    trim: true,
  };

  return `${slugify(name, options)}-${Date.now()}`;
}

/**
 * Parse a newline-separated string into an array of trimmed, non-empty strings
 * @param {string} [value]
 * @returns {string[]}
 */
export function parseListInput(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse specifications object, cleaning up empty/invalid values
 * @param {Record<string, string>} [specsObj]
 * @returns {Record<string, string>}
 */
export function parseSpecs(specsObj) {
  if (!specsObj || typeof specsObj !== "object") {
    return {};
  }

  const specs = {};
  Object.keys(specsObj).forEach((key) => {
    const val = specsObj[key];
    if (val && typeof val === "string" && val.trim()) {
      specs[key] = val.trim();
    }
  });

  return specs;
}

/**
 * Format quotes in text (straight quotes to curly quotes)
 * @param {string} text
 * @returns {string}
 */
export function formatQuote(text) {
  return text.replace(/"/g, "\u201C").replace(/"/g, "\u201D");
}

/**
 * Format apostrophes in text (straight to curly)
 * @param {string} text
 * @returns {string}
 */
export function formatApostrophe(text) {
  return text.replace(/'/g, "\u2019").replace(/'/g, "\u2018");
}

/**
 * Format both quotes and apostrophes in text
 * @param {any} text
 * @returns {string}
 */
export function formatText(text) {
  if (typeof text !== "string") return String(text ?? "");
  return formatApostrophe(formatQuote(text));
}

/**
 * Parse a numeric value safely
 * @param {string} [value]
 * @returns {number|undefined}
 */
export function safeParseInt(value) {
  if (!value || value.trim() === "") return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Parse a float value safely
 * @param {string} [value]
 * @returns {number|undefined}
 */
export function safeParseFloat(value) {
  if (!value || value.trim() === "") return undefined;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Format currency
 * @param {number} amount
 * @param {string} [currency]
 * @returns {string}
 */
export function formatCurrency(amount, currency = "৳") {
  return `${currency}${amount.toLocaleString()}`;
}

/**
 * Validate Zod schema on the server, returning a safe result
 * @param {import('zod').ZodTypeAny} schema
 * @param {any} data
 * @returns {Promise<{success: true, data: any} | {success: false, errors: Record<string, string>}>}
 */
export async function validateSchema(schema, data) {
  const result = await schema.safeParseAsync(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = {};
  if (result.error) {
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}
