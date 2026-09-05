// Go Stand Over There — Volleyball PWA Notification Service Worker
// Dedicated to Lock Screen Notifications, Background Sync, and App Focus

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle Notification Clicks from Lock Screen or System Shade
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing open tab if available
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open fresh window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Optional Web Push Event Handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || '🏐 Volleyball Live Alert';
    const options = {
      body: data.body || 'Live match update',
      icon: data.icon || '/icon-192.png',
      badge: data.badge || '/icon-192.png',
      tag: data.tag || 'volleyball-push',
      renotify: true,
      vibrate: [200, 100, 200],
      data: data.data || { url: '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('🏐 Volleyball Live Alert', {
        body: text,
        icon: '/icon-192.png'
      })
    );
  }
});

// Pass-through fetch: NO caching of application bundles to prevent stale code traps
self.addEventListener('fetch', () => {
  return;
});
