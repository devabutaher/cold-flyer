/**
 * Server-only utility functions
 * Only usable in Server Components and Server Actions
 */

import { z } from "zod";
import slugify from "slugify";

/**
 * Generate a unique slug from a name with timestamp suffix
 */
export function generateSlug(name: string): string {
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
 */
export function parseListInput(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse specifications object, cleaning up empty/invalid values
 */
export function parseSpecs(
  specsObj: Record<string, string> | undefined | null,
): Record<string, string> {
  if (!specsObj || typeof specsObj !== "object") {
    return {};
  }

  const specs: Record<string, string> = {};
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
 */
export function formatQuote(text: string): string {
  return text.replace(/"/g, "\u201C").replace(/"/g, "\u201D");
}

/**
 * Format apostrophes in text (straight to curly)
 */
export function formatApostrophe(text: string): string {
  return text.replace(/'/g, "\u2019").replace(/'/g, "\u2018");
}

/**
 * Format both quotes and apostrophes in text
 */
export function formatText(text: string | unknown): string {
  if (typeof text !== "string") return String(text ?? "");
  return formatApostrophe(formatQuote(text));
}

/**
 * Parse a numeric value safely
 */
export function safeParseInt(value: string | undefined | null): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Parse a float value safely
 */
export function safeParseFloat(value: string | undefined | null): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = "?"): string {
  return `${currency}${amount.toLocaleString()}`;
}

/**
 * Validate Zod schema on the server, returning a safe result
 */
export async function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): Promise<{ success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> }> {
  const result = await schema.safeParseAsync(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  if (result.error) {
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}