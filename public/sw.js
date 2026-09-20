// KF Mart Retail - Self-Cleaning Service Worker
// Automatically cleans up old cache entries and unregisters to prevent blank-screen glitches

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

// Pass through all network requests directly without interception
self.addEventListener('fetch', () => {
  // Let the browser handle all fetches natively
});
