/**
 * Products API - AC Units and Parts endpoints
 * Includes automatic query invalidation after mutations
 */

import { apiClient, apiGet } from "./index";

export const productEndpoints = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set("search", params.q);
    if (params.category && params.category !== "All Categories") query.set("category", String(params.category));
    if (params.brand && params.brand !== "All Brands") query.set("brand", String(params.brand));
    if (params.productType) query.set("productType", String(params.productType));
    if (params.sort) query.set("sortBy", String(params.sort));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const endpoint = query.toString() ? `/products?${query}` : "/products";
    return apiGet(endpoint);
  },
  bySlug: (slug) => apiGet(`/products/slug/${slug}`),
  byId: (id) => apiGet(`/products/${id}`),
  create: (data) => apiClient("/api/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiClient(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) => apiClient(`/api/products/${id}`, { method: "DELETE" }),
  uploadImage: (file, fieldName = "image") => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then((res) => res.json());
  },
};

export default productEndpoints;
