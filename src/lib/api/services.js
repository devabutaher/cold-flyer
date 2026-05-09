import api from "../api";

const sortMap = {
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Rating": "rating",
  "Popular": "popular",
};

export const servicesApi = {
  async getServices(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.serviceType) query.set("serviceType", params.serviceType);
    if (params.sort) {
      const sortBy = sortMap[params.sort] || "rating";
      query.set("sortBy", sortBy);
    }
    if (params.featured) query.set("featured", "true");
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const endpoint = query.toString() ? `/api/services?${query}` : "/api/services";
    return api.get(endpoint);
  },

  async getServiceBySlug(slug) {
    return api.get(`/api/services/slug/${slug}`);
  },

  async getServiceById(id) {
    return api.get(`/api/services/id/${id}`);
  },

  async getFeaturedServices() {
    return api.get("/api/services/featured");
  },

  async createService(serviceData) {
    return api.post("/api/services", serviceData);
  },

  async updateService(id, serviceData) {
    return api.patch(`/api/services/${id}`, serviceData);
  },
};

export default servicesApi;