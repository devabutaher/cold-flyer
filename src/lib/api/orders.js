import api from "../api";

export const ordersApi = {
  async createQuickCheckout(orderData) {
    return api.post("/api/orders/quick-checkout", orderData);
  },

  async createOrder(orderData) {
    return api.post("/api/orders", orderData);
  },

  async getOrders() {
    return api.get("/api/orders");
  },

  async getOrderById(id) {
    return api.get(`/api/orders/${id}`);
  },

  async createCheckoutSession(orderId) {
    return api.post(`/api/orders/${orderId}/checkout`, {});
  },

  async updateOrderStatus(orderId, status) {
    return api.patch(`/api/orders/${orderId}`, { status });
  },

  async cancelOrder(orderId) {
    return api.delete(`/api/orders/${orderId}`);
  },
};

export default ordersApi;