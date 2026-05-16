import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth"];
const adminRoutes = ["/dashboard/users", "/dashboard/analytics", "/dashboard/technicians", "/dashboard/coupons"];

const intlMiddleware = createMiddleware(routing);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) return intlMiddleware(request);

  const locale = pathname.split("/")[1];
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");

  const accessToken = request.cookies.get("accessToken")?.value;

  const isProtected = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route));
  const isAuth = authRoutes.some((route) => pathWithoutLocale.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathWithoutLocale.startsWith(route));

  if (isProtected && !accessToken) {
    const loginUrl = new URL(`/${locale}/auth`, request.url);
    loginUrl.searchParams.set("redirect", pathWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && accessToken) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const response = NextResponse.next();

  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      response.headers.set("x-user-role", payload.role || "user");

      if (isAdmin && payload.role !== "admin") {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    } catch {
      if (isProtected) {
        return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
