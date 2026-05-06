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

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const usersApi = {
  baseUrl: API_BASE_URL,

  async request(endpoint, options = {}) {
    const token = getToken();

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

  async loginWithFirebase(firebaseToken) {
    try {
      const data = await this.post("/api/auth/firebase/login", {
        firebaseToken,
      });
      if (data.data?.accessToken && typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      return data;
    } catch (error) {
      if (
        (error.status === 400 || error.status === 409) &&
        error.data?.message === "User already exists"
      ) {
        const retryData = await this.post("/api/auth/firebase/login", {
          firebaseToken,
        });
        if (retryData.data?.accessToken && typeof window !== "undefined") {
          localStorage.setItem("accessToken", retryData.data.accessToken);
          localStorage.setItem("user", JSON.stringify(retryData.data.user));
        }
        return retryData;
      }
      throw error;
    }
  },

  async registerWithFirebase(firebaseToken) {
    const data = await this.post("/api/auth/firebase/register", {
      firebaseToken,
    });
    if (data.data?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }
    return data;
  },

  async logout() {
    const data = await this.post("/api/auth/logout", {});
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    return data;
  },

  async getMe() {
    return this.get("/api/auth/me");
  },

  async refreshToken() {
    return this.post("/api/auth/refresh", {});
  },

  getUser() {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken,
};

export default usersApi;