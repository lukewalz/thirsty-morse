

self.addEventListener("push", event => {

  const data = event.data.json();

  const { title } = data

  const body = {
    body: data.body,
    icon: data.icon
  }

  event.waitUntil(self.registration.showNotification(title, body))
})

var CACHE_NAME = 'thirsty-cache';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});