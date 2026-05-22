import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth"];
const adminRoutes = ["/dashboard/users", "/dashboard/analytics", "/dashboard/technicians", "/dashboard/coupons"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

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

  const needsAuth = isProtected && (!accessToken || tokenExpired);
  const isAuthenticated = accessToken && tokenPayload && !tokenExpired;

  if (needsAuth) {
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { Cookie: `refreshToken=${refreshToken}` },
        });
        if (refreshRes.ok) {
          const response = NextResponse.next();
          refreshRes.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") {
              response.headers.append("Set-Cookie", value);
            }
          });
          return response;
        }
      } catch {}
    }
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated) {
    response.headers.set("x-user-role", tokenPayload.role || "user");

    if (isAdmin && tokenPayload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
