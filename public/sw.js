console.log('Service Worker Waking Up!');

self.addEventListener("install", event => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener("activate", event => {
  console.log('Service worker activated')
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
      })
  )
})

const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/home',
  '/static/js/bundle.js',
  '/static/js/0.chunk.js',
  '/static/js/main.chunk.js'
]

