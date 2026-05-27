export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Track a pageview
 * @param {string} url
 */
export function pageview(url) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, { page_path: url });
}

/**
 * Track a custom event
 * @param {string} action
 * @param {Record<string, unknown>} [params]
 */
export function event(action, params) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}
