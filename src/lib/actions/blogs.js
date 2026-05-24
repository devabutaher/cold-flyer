"use server";

import { createServerClient } from "@/lib/http-client";
import { cookies } from "next/headers";

export async function getBlogsServer(params) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const query = new URLSearchParams();
    if (params?.q) query.set("search", String(params.q));
    if (params?.category) query.set("category", String(params.category));
    if (params?.featured) query.set("featured", String(params.featured));
    if (params?.sort) query.set("sortBy", String(params.sort));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const res = await client.get(`/api/blogs${qs ? `?${qs}` : ""}`);
    return res.data;
  } catch {
    return { data: { blogs: [] } };
  }
}

export async function getBlogBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/blogs/slug/${slug}`);
    return res.data?.data?.blog || res.data;
  } catch {
    return null;
  }
}

export async function createBlogAction(blogData) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/blogs", blogData);
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/blogs/${id}`, blogData);
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/blogs/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete blog",
    };
  }
}
