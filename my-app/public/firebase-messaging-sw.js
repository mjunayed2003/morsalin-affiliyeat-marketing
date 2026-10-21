// Firebase Cloud Messaging Service Worker for FreeProducts.online
// Handles background push notifications when browser tab is inactive or closed

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForInitializationPlaceholder",
  authDomain: "freeproducts-online.firebaseapp.com",
  projectId: "freeproducts-online",
  storageBucket: "freeproducts-online.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:dummyappid"
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
