import { toast } from "sonner";

const API_BASE_URL = "/api";

export function extractDataArray(res, key) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (key && Array.isArray(res?.data?.[key])) return res.data[key];
  if (key && Array.isArray(res?.[key])) return res[key];
  return [];
}

const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

const ENDPOINT_TO_QUERY_KEY = {
  "/products": ["products"],
  "/api/products": ["products"],
  "/services": ["services"],
  "/api/services": ["services"],
  "/orders": ["orders"],
  "/api/orders": ["orders"],
  "/users": ["users"],
  "/auth": ["auth"],
};

function getQueryKeyFromEndpoint(endpoint) {
  for (const [path, key] of Object.entries(ENDPOINT_TO_QUERY_KEY)) {
    if (endpoint.includes(path)) return key;
  }
  return null;
}

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/logout", "/auth/me", "/auth/refresh"];

function isAuthEndpoint(endpoint) {
  return AUTH_ENDPOINTS.some((authEndpoint) => endpoint.includes(authEndpoint));
}

let refreshPromise = null;

async function attemptTokenRefresh() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      refreshPromise = null;
      return res.ok;
    })
    .catch(() => {
      refreshPromise = null;
      return false;
    });

  return refreshPromise;
}

async function apiClient(endpoint, options = {}) {
  const method = options.method || "GET";
  const isMutation = MUTATION_METHODS.includes(method);
  const queryKey = getQueryKeyFromEndpoint(endpoint);
  const isAuth = isAuthEndpoint(endpoint);

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (response.status === 401 && !isAuth) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      });
    } else {
      window.location.href = "/auth";
      throw new Error("Session expired. Please login again.");
    }
  }

  let data;
  try {
    data = await response.json();
  } catch {
    const text = await response.text();
    throw new Error(`Server returned ${response.status}: ${text.slice(0, 100)}`);
  }

  if (!response.ok) {
    const errorMessage = data.message || "Something went wrong";

    if (isMutation && queryKey && !isAuth) {
      toast.error(errorMessage);
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (isMutation && queryKey && !isAuth) {
    const successMessage = data.message || getDefaultSuccessMessage(method, endpoint);
    if (successMessage && data.success !== false) {
      toast.success(successMessage);
    }
  }

  return data;
}

function getDefaultSuccessMessage(method, endpoint) {
  const isProducts = endpoint.includes("products");
  const isServices = endpoint.includes("services");
  const isOrders = endpoint.includes("orders");
  const isUser = endpoint.includes("users") || endpoint.includes("auth");

  if (method === "POST") {
    if (isProducts) return "Product created successfully";
    if (isServices) return "Service created successfully";
    if (isOrders) return "Order created successfully";
    if (isUser) return "Action completed successfully";
  }

  if (method === "PATCH" || method === "PUT") {
    if (isProducts) return "Product updated successfully";
    if (isServices) return "Service updated successfully";
    if (isOrders) return "Order updated successfully";
    if (isUser) return "Profile updated successfully";
  }

  if (method === "DELETE") {
    if (isProducts) return "Product deleted successfully";
    if (isServices) return "Service deleted successfully";
    if (isOrders) return "Order cancelled successfully";
    if (isUser) return "Action completed successfully";
  }

  return "Action completed successfully";
}

export function apiGet(endpoint) {
  return apiClient(endpoint, { method: "GET" });
}

export function apiPost(endpoint, body) {
  return apiClient(endpoint, { method: "POST", body: JSON.stringify(body) });
}

export function apiPut(endpoint, body) {
  return apiClient(endpoint, { method: "PUT", body: JSON.stringify(body) });
}

export function apiPatch(endpoint, body) {
  return apiClient(endpoint, { method: "PATCH", body: JSON.stringify(body) });
}

export function apiDelete(endpoint) {
  return apiClient(endpoint, { method: "DELETE" });
}

export function getToken() {
  return null;
}

export function getUser() {
  return null;
}

export function getProducts(params = {}) {
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
}

export function getProductBySlug(slug) {
  return apiGet(`/products/slug/${slug}`);
}

export function getProductById(id) {
  return apiGet(`/products/${id}`);
}

export function getServices(params = {}) {
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
}

export function getFeaturedServices() {
  return apiGet("/services/featured");
}

export function getServiceBySlug(slug) {
  return apiGet(`/services/slug/${slug}`);
}

export function getOrders() {
  return apiGet("/orders");
}

export function getOrderById(id) {
  return apiGet(`/orders/${id}`);
}

export function createPaymentLink(orderId) {
  return apiPost(`/orders/${orderId}/checkout`, {});
}

export function verifyPayment(orderId, sessionId) {
  return apiPost(`/orders/${orderId}/verify-payment`, { sessionId });
}

export function cancelOrder(orderId, reason) {
  return apiPatch(`/orders/${orderId}/cancel`, { reason });
}

export function login(email, password) {
  return apiPost("/auth/login", { email, password });
}

export function register(name, email, password, phone) {
  return apiPost("/auth/register", { name, email, password, phone });
}

export function googleLogin(idToken) {
  return apiPost("/auth/google", { idToken });
}

export async function uploadImage(file, fieldName = "image") {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }
  return data;
}

export async function logout() {
  return apiPost("/auth/logout", {});
}

const api = {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  getToken,
  getUser,
  getProducts,
  getProductBySlug,
  getProductById,
  getServices,
  getFeaturedServices,
  getServiceBySlug,
  getOrders,
  getOrderById,
  createPaymentLink,
  verifyPayment,
  cancelOrder,
  login,
  register,
  googleLogin,
  uploadImage,
  logout,
};

export default api;
