// Firebase Cloud Messaging Service Worker for FreeProducts.online
// Handles background push notifications when browser tab is inactive or closed

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAk7qssIjEIGXgmXgWK98apGq5Xdee5bqg",
  authDomain: "free-products-online.firebaseapp.com",
  projectId: "free-products-online",
  storageBucket: "free-products-online.firebasestorage.app",
  messagingSenderId: "262920769539",
  appId: "1:262920769539:web:e670fc89a3b1aac2bc7e36"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background push:', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || 'FreeProducts.online Notification';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'New message or update received.',
      icon: '/browser-icon.png',
      badge: '/browser-icon.png',
      data: {
        url: payload.data?.url || '/chat',
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.log('Firebase messaging service worker running in fallback mode.');
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
