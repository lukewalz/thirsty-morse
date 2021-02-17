console.log('Service Worker Waking Up!');

self.addEventListener("push", event => {
  console.log('push received');
  const data = event.data.json();

  const { title } = data

  const body = {
    body: data.body,
    icon: data.icon
  }

  event.waitUntil(self.registration.showNotification(title, body))
})
