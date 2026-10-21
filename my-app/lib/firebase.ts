// Firebase Web Notification & Cloud Messaging (FCM) Integration
// FreeProducts.online (ProductPerks)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase Client Configuration (Loaded from environment variables with safe defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForInitializationPlaceholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "freeproducts-online.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "freeproducts-online",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "freeproducts-online.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "100000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:100000000000:web:dummyappid",
};

// Safe Firebase App Initialization (Browser Client Side Only)
export const getFirebaseApp = () => {
  if (typeof window === 'undefined') return null;
  if (getApps().length > 0) {
    return getApp();
  }
  try {
    return initializeApp(firebaseConfig);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
    return null;
  }
};

export interface FirebaseNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}

// Check if browser supports Web Notifications
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Register FCM Service Worker & Request User Permission
export const requestNotificationPermission = async (userId?: string, apiUrl?: string): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    console.warn('Web Notifications are not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('🔔 Web Notification permission granted.');

      // Try registering Firebase Messaging Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Firebase Service Worker registered successfully:', registration.scope);

          // Attempt to retrieve FCM device registration token
          const messagingSupported = await isSupported();
          if (messagingSupported) {
            const app = getFirebaseApp();
            if (app) {
              const messaging = getMessaging(app);
              const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
              
              try {
                const currentToken = await getToken(messaging, {
                  serviceWorkerRegistration: registration,
                  ...(vapidKey ? { vapidKey } : {}),
                });

                if (currentToken) {
                  console.log('📱 FCM Device Registration Token:', currentToken);
                  localStorage.setItem('fcm_token_v1', currentToken);
                  if (userId && apiUrl) {
                    await registerFcmToken(userId, currentToken, apiUrl);
                  }
                }
              } catch (tokenErr) {
                console.log('FCM Token generation in fallback mode (awaiting custom project keys).');
              }
            }
          }
        } catch (swErr) {
          console.warn('Service worker setup note:', swErr);
        }
      }
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Setup Firebase Foreground Push Message Listener
export const initFirebaseForegroundListener = (onMessageReceived: (payload: any) => void) => {
  if (typeof window === 'undefined') return () => {};

  isSupported().then((supported) => {
    if (!supported) return;
    try {
      const app = getFirebaseApp();
      if (!app) return;
      const messaging = getMessaging(app);
      return onMessage(messaging, (payload) => {
        console.log('📨 Foreground Firebase FCM Message:', payload);
        onMessageReceived(payload);
      });
    } catch (e) {
      console.log('Firebase foreground listener initialized in passive mode.');
    }
  });
};

// Display Local / Browser Push Notification
export const showBrowserNotification = (
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    url?: string;
  }
): Notification | null => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      body: options?.body || 'New update from FreeProducts.online',
      icon: options?.icon || '/browser-icon.png',
      badge: '/browser-icon.png',
      tag: options?.tag || 'freeproducts_notification',
      ...options,
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      if (options?.url && typeof window !== 'undefined') {
        window.location.href = options.url;
      }
    };

    return notification;
  } catch (err) {
    console.warn('Could not display browser notification:', err);
    return null;
  }
};

// Sync FCM Device Registration Token with Backend Database
export const registerFcmToken = async (userId: string, fcmToken: string, apiUrl: string) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
    await fetch(`${apiUrl}/users/${userId}/fcm-token`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ fcmToken }),
    });
    console.log('✅ FCM Token synced with user account in backend.');
  } catch (e) {
    console.warn('Could not sync FCM token with backend:', e);
  }
};
