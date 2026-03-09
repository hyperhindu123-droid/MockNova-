const CACHE_NAME = 'mocknova-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png.jpeg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // अगर इंटरनेट नहीं है, तो ऐप को हैंग होने से बचाए
      return response || fetch(event.request).catch(() => {
        return new Response(''); 
      });
    })
  );
});
