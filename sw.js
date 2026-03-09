const CACHE_NAME = 'mocknova-pro-v5';

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});
