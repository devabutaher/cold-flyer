import { apiClient, apiGet, apiPost } from "./index";

export const userEndpoints = {
  me: () => apiGet("/users/me"),
  update: (data) => apiClient("/users", { method: "PATCH", body: JSON.stringify(data) }),
  login: (email, password) => apiPost("/auth/login", { email, password }),
  register: (name, email, password, phone) => apiPost("/auth/register", { name, email, password, phone }),
  googleLogin: (idToken) => apiPost("/auth/google", { idToken }),
  logout: () => apiPost("/auth/logout", {}),
  getToken: () => null,
  getUser: () => null,
  setAuth: () => {},
  clearAuth: () => {},
};

export default userEndpoints;
