"use server";

import { revalidateTag } from "next/cache";
import { createServerClient, API_BACKEND_URL, getServerFetchHeaders } from "@/lib/http-client";
import { cookies } from "next/headers";
import { requireRole } from "@/lib/auth-server";

export async function getRecentWorksServer(params) {
  try {
    const cookieStore = await cookies();
    const query = new URLSearchParams();
    if (params?.q) query.set("search", String(params.q));
    if (params?.category) query.set("category", String(params.category));
    if (params?.featured) query.set("featured", String(params.featured));
    if (params?.sort) query.set("sortBy", String(params.sort));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const res = await fetch(`${API_BACKEND_URL}/api/recent-works${qs ? `?${qs}` : ""}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["recent-works"] },
    });
    const data = await res.json();
    return data;
  } catch {
    return { data: { recentWorks: [] } };
  }
}

export async function getRecentWorkBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/recent-works/slug/${slug}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["recent-works"] },
    });
    const data = await res.json();
    return data?.data?.recentWork || data;
  } catch {
    return null;
  }
}

export async function createRecentWorkAction(workData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/recent-works", workData);
    revalidateTag("recent-works");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create recent work",
      error: error.response?.data,
    };
  }
}

export async function updateRecentWorkAction(id, workData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/recent-works/${id}`, workData);
    revalidateTag("recent-works");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update recent work",
      error: error.response?.data,
    };
  }
}

export async function deleteRecentWorkAction(id) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/recent-works/${id}`);
    revalidateTag("recent-works");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete recent work",
    };
  }
}
