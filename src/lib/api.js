import { usersApi } from "./api/user";
import { ordersApi } from "./api/orders";
import { productsApi } from "./api/products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      response.status,
      data,
    );
  }
  return data;
};

const api = {
  baseUrl: API_BASE_URL,

  async request(endpoint, options = {}) {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken")
        : null;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    return handleResponse(response);
  },

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  },

  async upload(endpoint, file, fieldName = "image") {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken")
        : null;

    const formData = new FormData();
    formData.append(fieldName, file);

    const config = {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    return handleResponse(response);
  },

  getUser() {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  async loginWithFirebase(firebaseToken) {
    return usersApi.loginWithFirebase(firebaseToken);
  },

  async registerWithFirebase(firebaseToken) {
    return usersApi.registerWithFirebase(firebaseToken);
  },

  async logout() {
    return usersApi.logout();
  },

  async getMe() {
    return usersApi.getMe();
  },

  async refreshToken() {
    return usersApi.refreshToken();
  },
};

export default api;
export { API_BASE_URL, ApiError };
