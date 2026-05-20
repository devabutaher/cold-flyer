const CACHE_NAME = "cold-flyer-v2";
const STATIC_CACHE = "cold-flyer-static-v2";
const DYNAMIC_CACHE = "cold-flyer-dynamic-v2";
const API_CACHE = "cold-flyer-api-v2";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const API_PATTERNS = [
  /\/api\/products/,
  /\/api\/services/,
  /\/api\/orders/,
];

const MAX_DYNAMIC_CACHE = 50;
const MAX_API_CACHE = 100;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE &&
              key !== DYNAMIC_CACHE &&
              key !== API_CACHE
          )
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (isApiRequest(url)) {
    event.respondWith(networkFirstWithCache(request, API_CACHE, MAX_API_CACHE));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(networkFirstWithCache(request, STATIC_CACHE, MAX_DYNAMIC_CACHE));
    return;
  }

  event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE, MAX_DYNAMIC_CACHE));
});

function isApiRequest(url) {
  return API_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function isStaticAsset(url) {
  return (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.startsWith("/_next/static")
  );
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match("/");
  }
}

async function networkFirstWithCache(request, cacheName, maxItems) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await trimCache(cacheName, maxItems);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match("/");
  }
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems);
  }
}

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
