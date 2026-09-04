const CACHE_NAME = 'gostandoverthere-v3';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => caches.delete(name)));
    })
      .then(() => self.clients.claim())
      .then(() => {
        return self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => {
            if (client.navigate && client.url) {
              client.navigate(client.url);
            }
          });
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Don't intercept Firebase cloud API requests
  const url = new URL(event.request.url);
  if (url.origin.includes('firestore.googleapis.com') || url.origin.includes('firebaseio.com')) {
    return;
  }

  // Network-First for navigation (HTML page loads) so updates are immediate
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => caches.match('/index.html') || caches.match('/'))
    );
    return;
  }

  // Stale-While-Revalidate for other static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});
