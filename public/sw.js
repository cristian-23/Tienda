// Service Worker for PWA (Installable criteria)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A fetch handler is required for the app to be considered installable by browsers
self.addEventListener('fetch', (event) => {
  // Pass-through to network
  event.respondWith(fetch(event.request));
});
