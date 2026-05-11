/**
 * Services API - AC Repair and Maintenance endpoints
 * Includes automatic query invalidation after mutations
 */

import { apiClient, apiGet } from "./index";

export const serviceEndpoints = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.serviceType) query.set("serviceType", params.serviceType);
    if (params.sort) {
      const sortMap = {
        "Price: Low to High": "price_asc",
        "Price: High to Low": "price_desc",
        Rating: "rating",
        Popular: "popular",
      };
      query.set("sortBy", sortMap[params.sort] || "rating");
    }
    if (params.featured) query.set("featured", "true");
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const endpoint = query.toString() ? `/services?${query}` : "/services";
    return apiGet(endpoint);
  },
  featured: () => apiGet("/services/featured"),
  bySlug: (slug) => apiGet(`/services/slug/${slug}`),
  byId: (id) => apiGet(`/services/${id}`),
  create: (data) =>
    apiClient("/api/services", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiClient(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) => apiClient(`/api/services/${id}`, { method: "DELETE" }),
};

export default serviceEndpoints;
