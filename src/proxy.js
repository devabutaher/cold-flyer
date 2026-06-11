import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth"];

const roleRouteAccess = {
  admin: null,
  moderator: [
    "/dashboard",
    "/dashboard/items",
    "/dashboard/services",
    "/dashboard/blogs",
    "/dashboard/recent-works",
    "/dashboard/orders",
    "/dashboard/bookings",
    "/dashboard/users",
    "/dashboard/technicians",
    "/dashboard/customers",
    "/dashboard/coupons",
    "/dashboard/messages",
    "/dashboard/applications",
    "/dashboard/profile",
  ],
  worker: ["/dashboard", "/dashboard/orders", "/dashboard/bookings", "/dashboard/attendance", "/dashboard/profile"],
  customer: ["/dashboard", "/dashboard/orders", "/dashboard/bookings", "/dashboard/profile"],
};

function isPathAllowed(pathname, allowedPrefixes) {
  if (allowedPrefixes === null) return true;
  return allowedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix + "/"),
  );
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const accessToken = request.cookies.get("accessToken")?.value;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  let tokenPayload = null;
  let tokenExpired = false;

  if (accessToken) {
    try {
      tokenPayload = JSON.parse(atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      tokenExpired = tokenPayload.exp && Date.now() >= tokenPayload.exp * 1000;
    } catch {
      tokenExpired = true;
    }
  }

  const isAuthenticated = accessToken && tokenPayload && !tokenExpired;

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (isAuthenticated) {
    const role = tokenPayload.role || "customer";
    response.headers.set("x-user-role", role);

    if (isProtected) {
      const allowedPrefixes = roleRouteAccess[role];

      if (!isPathAllowed(pathname, allowedPrefixes)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth", "/api/:path*"],
};
