/**
 * Users API - User & Profile endpoints
 */

import { apiClient, apiGet, apiPost } from "./index";

export const userEndpoints = {
  me: () => apiGet("/users/me"),
  update: (data) =>
    apiClient("/users", { method: "PATCH", body: JSON.stringify(data) }),
  login: (firebaseToken) => apiPost("/auth/login", { firebaseToken }),
  register: (firebaseToken, phone) =>
    apiPost("/auth/register", { firebaseToken, phone }),
  logout: () => apiPost("/auth/logout", {}),
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  setAuth: (user, accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      if (accessToken) localStorage.setItem("accessToken", accessToken);
    }
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  },
};

export default userEndpoints;
