import api from "../api";

const sortMap = {
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Rating": "rating",
  "Popular": "popular",
  "Newest": "newest",
};

export const productsApi = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set("search", params.q);
    if (params.category && params.category !== "All Categories") {
      query.set("category", params.category);
    }
    if (params.brand && params.brand !== "All Brands") {
      query.set("brand", params.brand);
    }
    if (params.productType) {
      query.set("productType", params.productType);
    }
    if (params.sort) {
      const sortBy = sortMap[params.sort] || "price_asc";
      query.set("sortBy", sortBy);
    }

    const endpoint = query.toString() ? `/api/products?${query}` : "/api/products";
    return api.get(endpoint);
  },

  async getProductBySlug(slug) {
    return api.get(`/api/products/slug/${slug}`);
  },

  async getProductById(id) {
    return api.get(`/api/products/${id}`);
  },

  async createProduct(productData) {
    return api.post("/api/products", productData);
  },

  async updateProduct(id, productData) {
    return api.patch(`/api/products/${id}`, productData);
  },

  async deleteProduct(id) {
    return api.delete(`/api/products/${id}`);
  },
};

export default productsApi;