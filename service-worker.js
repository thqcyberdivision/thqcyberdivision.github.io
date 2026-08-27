const CACHE_NAME = 'thq-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/blog.html',
  '/contact.html',
  '/main.css',
  '/main.js',
  '/assets/THQ Cyber Division Logo.png',
  '/assets/Sophos Authorized Partner Logo.png',
  '/email-icon.png',
  '/assets/favicon_16x16.ico',
  '/assets/favicon_32x32.ico',
  '/assets/favicon_96x96.ico',
  '/assets/favicon_192x192.ico',
  '/manifest.json',
  '/website_cover.jpg',
  '/assets/payments/paypal.svg',
  '/assets/payments/nowpayments.svg',
  '/assets/payments/debit.svg',
  '/terms.html',
  '/privacy.html',
];

// Install: pre-cache resources (resilient)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use Promise.allSettled so one missing resource doesn't break install
      const results = await Promise.allSettled(
        urlsToCache.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((res) => {
              if (!res.ok) throw new Error(`${url} -> ${res.status}`);
              return cache.put(url, res);
            })
            .catch((err) => {
              // Log which URL failed so you can fix or remove it
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
          // Optionally update cache with the latest page
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
          // Only cache same-origin/basic responses
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
