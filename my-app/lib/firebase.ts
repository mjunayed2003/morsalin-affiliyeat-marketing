// Firebase Web Notification & Cloud Messaging (FCM) Integration
// FreeProducts.online (ProductPerks)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// Firebase Client Configuration (Loaded from environment variables with safe defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAk7qssIjEIGXgmXgWK98apGq5Xdee5bqg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "free-products-online.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "free-products-online",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "free-products-online.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "262920769539",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:262920769539:web:e670fc89a3b1aac2bc7e36",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6C6CX24JR9",
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

// Safe Firebase Analytics Initialization
export const initFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const supported = await isAnalyticsSupported();
    if (supported) {
      const app = getFirebaseApp();
      if (app) {
        return getAnalytics(app);
      }
    }
  } catch (err) {
    console.warn('Firebase Analytics not supported in current environment:', err);
  }
  return null;
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
    await fetch(`${apiUrl}/notifications/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ token: fcmToken, platform: 'web' }),
    });
    console.log('✅ FCM Device Token registered with user account in backend.');
  } catch (e) {
    console.warn('Could not sync FCM token with backend:', e);
  }
};

// Unregister FCM Device Registration Token (e.g. on user logout)
export const unregisterFcmToken = async (fcmToken: string, apiUrl: string) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
    await fetch(`${apiUrl}/notifications/devices`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ token: fcmToken }),
    });
    console.log('🗑️ FCM Device Token unregistered from backend.');
  } catch (e) {
    console.warn('Could not unregister FCM token from backend:', e);
  }
};
