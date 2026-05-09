/**
 * Server Actions for Product CRUD operations
 * These run on the server and can be called from client components using "use server"
 */

"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import {
  Product,
  ProductImage,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --- Internal helpers ---

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ServerApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ServerApiError";
  }
}

async function serverFetch(
  endpoint: string,
  options: FetchOptions = {},
): Promise<unknown> {
  const token =
    (globalThis as any).__NEXTAUTH_TOKEN ||
    (globalThis as any).__COLD_FLYER_TOKEN ||
    null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    next: { tags: ["products", "services", "orders"] },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new ServerApiError(
      data.message || "Server action failed",
      response.status,
      data,
    );
  }
  return data;
}

// --- Product Actions ---

export async function getProductsServer(
  params?: Record<string, string | number>,
): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params?.q) query.set("search", String(params.q));
  if (params?.category && params.category !== "All Categories") {
    query.set("category", String(params.category));
  }
  if (params?.brand && params.brand !== "All Brands") {
    query.set("brand", String(params.brand));
  }
  if (params?.productType) {
    query.set("productType", String(params.productType));
  }
  if (params?.sort) {
    query.set("sortBy", String(params.sort));
  }
  if (params?.page) {
    query.set("page", String(params.page));
  }
  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  const endpoint = query.toString()
    ? `/api/products?${query}`
    : "/api/products";

  const result = await serverFetch(endpoint, {
    next: { tags: ["products"] },
  });

  return result as PaginatedResponse<Product>;
}

export async function getProductBySlugServer(
  slug: string,
): Promise<Product | null> {
  try {
    const result = await serverFetch(`/api/products/slug/${slug}`, {
      next: { tags: [`product:${slug}`] },
    });
    const data = result as { data?: { product: Product } } | Product;
    if ("data" in data && data.data?.product) {
      return data.data.product;
    }
    return data as Product;
  } catch {
    return null;
  }
}

export async function getProductByIdServer(
  id: string,
): Promise<Product | null> {
  try {
    const result = await serverFetch(`/api/products/${id}`, {
      next: { tags: [`product:${id}`] },
    });
    const data = result as { data?: { product: Product } } | Product;
    if ("data" in data && data.data?.product) {
      return data.data.product;
    }
    return data as Product;
  } catch {
    return null;
  }
}

export async function createProductAction(
  productData: Partial<Product> & {
    name: string;
    sku: string;
    category: string;
    brand: string;
    price: number;
  },
): Promise<ApiResponse<Product>> {
  try {
    const result = await serverFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    revalidateTag("products");
    return { success: true, data: result as Product };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to create product",
      error: err.data as string,
    };
  }
}

export async function updateProductAction(
  id: string,
  productData: Partial<Product>,
): Promise<ApiResponse<Product>> {
  try {
    const result = await serverFetch(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
    revalidateTag("products");
    revalidateTag(`product:${id}`);
    return { success: true, data: result as Product };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to update product",
      error: err.data as string,
    };
  }
}

export async function deleteProductAction(
  id: string,
): Promise<ApiResponse<void>> {
  try {
    await serverFetch(`/api/products/${id}`, { method: "DELETE" });
    revalidateTag("products");
    return { success: true };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to delete product",
      error: err.data as string,
    };
  }
}

export async function uploadImageAction(
  file: File,
  fieldName: string = "image",
): Promise<ApiResponse<{ url: string }>> {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    const token =
      (globalThis as any).__COLD_FLYER_TOKEN || null;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `${API_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
        headers,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }
    return { success: true, data: { url: data.data?.url } };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to upload image",
    };
  }
}