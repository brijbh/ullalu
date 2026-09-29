const CACHE = "ullalu-shell-v1";
const SHELL = ["/", "/trips", "/today", "/more", "/new-trip", "/new-trip/storage"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) { const copy = response.clone(); void caches.open(CACHE).then((cache) => cache.put(event.request, copy)); }
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match("/")) || Response.error()));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/"))) {
      const copy = response.clone(); void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    }
    return response;
  })));
});
