import axios from "axios";

const API_BASE = "/api";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CSRF_COOKIE = "csrf-token";

let refreshPromise = null;
let clientInstance = null;
let csrfBootstrapped = false;

function getCsrfFromCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}\\s*=\\s*([^;]*)`));
  return match ? match[1] : null;
}

function setCsrfCookie(token) {
  document.cookie = `${CSRF_COOKIE}=${token}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}; maxAge=86400`;
}

function generateCsrfToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function bootstrapCsrf() {
  if (csrfBootstrapped) return;
  csrfBootstrapped = true;
  try {
    await axios.get(`${API_BASE}/csrf-token`, { withCredentials: true });
  } catch {
    if (!getCsrfFromCookie()) {
      setCsrfCookie(generateCsrfToken());
    }
  }
}

function createClientInstance() {
  const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config) => {
    if (config.method !== "get" && config.method !== "head" && config.method !== "options") {
      let token = getCsrfFromCookie();
      if (!token) {
        token = generateCsrfToken();
        setCsrfCookie(token);
      }
      config.headers["x-csrf-token"] = token;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")) {
        originalRequest._retry = true;
        const refreshed = await attemptTokenRefresh();
        if (refreshed) return instance(originalRequest);
        if (typeof window !== "undefined") window.location.href = "/auth";
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

async function attemptTokenRefresh() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = axios
    .post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export function getClient() {
  if (typeof window === "undefined") return null;
  if (!clientInstance) {
    bootstrapCsrf();
    clientInstance = createClientInstance();
  }
  return clientInstance;
}

export function createServerClient(cookieStore) {
  const token = cookieStore.get("accessToken")?.value;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.create({
    baseURL: BACKEND_URL,
    headers,
    withCredentials: true,
  });
}

export function dataOrThrow(response) {
  return response.data;
}

export function extractList(response, key) {
  const d = response?.data ?? response ?? {};
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.data)) return d.data;
  if (key && Array.isArray(d[key])) return d[key];
  if (key && Array.isArray(d.data?.[key])) return d.data?.[key];
  return [];
}

export function extractItem(response, key) {
  const d = response?.data ?? response ?? {};
  if (key && d[key]) return d[key];
  if (key && d.data?.[key]) return d.data?.[key];
  return d?.data || d || null;
}
