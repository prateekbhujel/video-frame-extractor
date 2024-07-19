const cacheName = 'frame-extractor-cache-v1';
const assetsToCache = [
  './',
  './index.html',
  './css/all.min.css', // Local Font Awesome CSS
  './css/styles.css',
  './src/app.js',
  './src/lib/jquery-3.5.1.min.js',
  './src/lib/jszip.min.js',
  './src/lib/FileSaver.min.js',
  './webfonts/fa-solid-900.woff2', // Local Font Awesome fonts
  './webfonts/fa-solid-900.ttf'    // Local Font Awesome fonts
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(assetsToCache);
      })
      .catch(error => {
        console.error('Failed to cache', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(error => {
        console.error('Fetch failed', error);
        throw error;
      })
  );
});
