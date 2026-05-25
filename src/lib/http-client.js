import axios from "axios";

const API_BASE = "/api";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let clientInstance = null;

function createClientInstance() {
  const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    timeout: 15000,
  });

  return instance;
}

export function getClient() {
  if (typeof window === "undefined") return null;
  if (!clientInstance) {
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
    timeout: 15000,
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
