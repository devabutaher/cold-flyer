"use server";

import { revalidateTag } from "next/cache";
import { createServerClient, API_BACKEND_URL, getServerFetchHeaders } from "@/lib/http-client";
import { cookies } from "next/headers";
import { requireRole } from "@/lib/auth-server";

export async function getBlogsServer(params) {
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
    const res = await fetch(`${API_BACKEND_URL}/api/blogs${qs ? `?${qs}` : ""}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["blogs"] },
    });
    const data = await res.json();
    return data;
  } catch {
    return { data: { blogs: [] } };
  }
}

export async function getBlogBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/blogs/slug/${slug}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["blogs", "blog-detail"] },
    });
    const data = await res.json();
    return data?.data?.blog || data;
  } catch {
    return null;
  }
}

export async function createBlogAction(blogData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/blogs", blogData);
    revalidateTag("blogs");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create blog",
      error: error.response?.data,
    };
  }
}

export async function updateBlogAction(id, blogData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/blogs/${id}`, blogData);
    revalidateTag("blogs");
    revalidateTag("blog-detail");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update blog",
      error: error.response?.data,
    };
  }
}

export async function deleteBlogAction(id) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/blogs/${id}`);
    revalidateTag("blogs");
    revalidateTag("blog-detail");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete blog",
    };
  }
}
