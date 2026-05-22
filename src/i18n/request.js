import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
      if (cookieLocale && routing.locales.includes(cookieLocale)) {
        locale = cookieLocale;
      }
    } catch {}
  }
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
      ...(await import(`../messages/${locale}/profile.json`)).default,
      ...(await import(`../messages/${locale}/bookings.json`)).default,
      ...(await import(`../messages/${locale}/cart-page.json`)).default,
      ...(await import(`../messages/${locale}/checkout.json`)).default,
      ...(await import(`../messages/${locale}/contact.json`)).default,
      ...(await import(`../messages/${locale}/order.json`)).default,
      ...(await import(`../messages/${locale}/blog.json`)).default,
      ...(await import(`../messages/${locale}/careers.json`)).default,
      ...(await import(`../messages/${locale}/privacy.json`)).default,
      ...(await import(`../messages/${locale}/shipping.json`)).default,
      ...(await import(`../messages/${locale}/terms.json`)).default,
    },
  };
});
