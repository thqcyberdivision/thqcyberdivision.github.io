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

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate event: Remove old caches
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

// Fetch event: Serve cached assets or fetch from network
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('jsonplaceholder.typicode.com')) {
    // Handle dynamic data (API responses)
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
    // Handle static assets (HTML, CSS, JS)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

// Background Sync for new data when the user comes online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-data') {
    event.waitUntil(fetchAndCacheNewData());
  }
});

// Fetch new data and cache it
function fetchAndCacheNewData() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then((response) => response.json())
    .then((data) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put('/api/data', new Response(JSON.stringify(data)));
      });
    });
}
