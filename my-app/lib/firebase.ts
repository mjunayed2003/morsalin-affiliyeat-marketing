// Firebase Web Notification & Push Messaging Helper
// FreeProducts.online (ProductPerks)

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

// Request Notification Permission from User
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    console.warn('Web Notifications are not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('🔔 Notification permission granted.');
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
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
      icon: options?.icon || '/icon.svg',
      badge: '/icon.svg',
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

// Optional Firebase FCM Token Registration with Backend
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
  } catch (e) {
    console.warn('Could not sync FCM token with backend:', e);
  }
};
