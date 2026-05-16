import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/common.json`)).default,
      ...(await import(`../messages/${locale}/nav.json`)).default,
      ...(await import(`../messages/${locale}/home.json`)).default,
      ...(await import(`../messages/${locale}/footer.json`)).default,
      ...(await import(`../messages/${locale}/about.json`)).default,
      ...(await import(`../messages/${locale}/faq.json`)).default,
      ...(await import(`../messages/${locale}/services.json`)).default,
      ...(await import(`../messages/${locale}/auth.json`)).default,
      ...(await import(`../messages/${locale}/cart.json`)).default,
      ...(await import(`../messages/${locale}/errors.json`)).default,
      ...(await import(`../messages/${locale}/validation.json`)).default,
      ...(await import(`../messages/${locale}/dashboard.json`)).default,
    },
  };
});
