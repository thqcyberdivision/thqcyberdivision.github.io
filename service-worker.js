// Define the cache name and files to cache
const CACHE_NAME = 'thq-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/logo.png',
    '/email-icon.png',
    'book1-icon.png',
    'book2-icon.png',
    'favicon_16x16.png',
    'favicon_192x192.png',
    'favicon_32x32.png',
    'favicon_96x966.png',
    '/skype-icon.png',
    'pdf-icon.png',
    '/manifest.json'
];

// Install the service worker and cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate the service worker and clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch handler for offline caching
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('jsonplaceholder.typicode.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
        );
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
