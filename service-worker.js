const CACHE_NAME = 'thq-cache-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/ja/index.html',
  '/ja/services.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/manifest.json',
  '/main.js',
  '/assets/THQ Cyber Division Logo.png',
  '/assets/favicon_32x32.ico',
  '/website_cover.jpg'
];

// Install: pre-cache resources (resilient)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const results = await Promise.allSettled(
        urlsToCache.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((res) => {
              if (!res.ok) throw new Error(`${url} -> ${res.status}`);
              return cache.put(url, res);
            })
            .catch((err) => {
              console.warn('Failed to cache', url, err);
              return null;
            })
        )
      );
      return results;
    })
  );
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((c) => c !== CACHE_NAME)
          .map((c) => caches.delete(c))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for others; return offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const request = event.request;

  // For navigation requests (HTML pages) try network then cache then fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // For other requests: try cache first, then network and dynamically cache basic responses
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // For images, you could return a cached placeholder if you have one
          if ((request.destination || '').includes('image')) {
            return caches.match('/assets/images/offline-image.png'); // optional
          }
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        });
    })
  );
});
