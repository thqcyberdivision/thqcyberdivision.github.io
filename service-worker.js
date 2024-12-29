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

// Install the service worker and cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch resources and serve them from the cache or the network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Serve from cache if available, otherwise fetch from the network
            return response || fetch(event.request);
        })
    );
});

// Activate the service worker and clear old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
