// Emergency Cache Purge & Service Worker Uninstaller
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
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

self.addEventListener('fetch', () => {
  // Bypass all cache, pass directly to network
  return;
});
