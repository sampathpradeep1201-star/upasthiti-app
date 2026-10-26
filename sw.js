// UPASTHITI CHITRA — Service Worker (Offline Support)  v8
// Cache name bumped to v8 so phones that previously installed v7 fetch the
// new app.html (v4.0) with glasses-variant poses 7 and 8.
const CACHE_NAME = 'upasthiti-chitra-v8';
const ASSETS = [
  './app.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).catch(() =>
        new Response('Offline — open the app while connected first.', {
          headers: { 'Content-Type': 'text/plain' }
        })
      )
    )
  );
});
