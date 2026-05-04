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

  async getCheckoutSession(orderId) {
    return api.post(`/api/orders/${orderId}/checkout`, {});
  },

  async verifyPayment(orderId, sessionId) {
    return api.post(`/api/orders/${orderId}/verify-payment`, { sessionId });
  },

  async updateOrderStatus(orderId, status) {
    return api.patch(`/api/orders/${orderId}`, { status });
  },

  async cancelOrder(orderId) {
    return api.delete(`/api/orders/${orderId}`);
  },

  async createPaymentLink(orderId) {
    return api.post(`/api/orders/${orderId}/checkout`, {});
  },
};

export default ordersApi;