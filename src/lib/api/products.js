import api from "../api";

export const productsApi = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category && params.category !== "All Categories") {
      query.set("category", params.category);
    }
    if (params.brand && params.brand !== "All Brands") {
      query.set("brand", params.brand);
    }
    if (params.sort) query.set("sort", params.sort);

    const endpoint = query.toString() ? `/api/products?${query}` : "/api/products";
    return api.get(endpoint);
  },

  async getProductById(id) {
    return api.get(`/api/products/${id}`);
  },
};

export default productsApi;