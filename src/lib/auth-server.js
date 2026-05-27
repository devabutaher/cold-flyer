import { cookies } from "next/headers";
import { createServerClient } from "@/lib/http-client";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get("/api/auth/me");
    return res.data?.data?.user || res.data?.user || null;
  } catch {
    return null;
  }
}

export async function requireRole(...allowedRoles) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: insufficient permissions");
  }
  return user;
}
