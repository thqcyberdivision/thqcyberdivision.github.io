const CACHE_NAME = 'thq-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/blog.html',
  '/contact.html',
  '/main.css',
  '/main.js',
  '/logo.png',
  '/email-icon.png',
  '/assets/favicon_16x16.ico',
  '/assets/favicon_32x32.ico',
  '/assets/favicon_96x96.ico',
  '/assets/favicon_192x192.ico',
  '/manifest.json',
  '/website_cover.jpg',
  '/terms.html',
  '/privacy.html',
];

// Install event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event: Remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: Cache-first for pre-cached, network-fallback & dynamic caching for all GET
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then((response) => {
          // Only cache successful, basic requests (not third-party)
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Optional: You can return a fallback page/image here if offline
          // return caches.match('/offline.html');
        });
    })
  );
});
