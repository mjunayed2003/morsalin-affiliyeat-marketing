'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Product, ChatMessage, Review, AudioCallState, NotificationItem, PlatformSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES, INITIAL_REVIEWS } from '../data/initialProducts';
import { getSocket, API_BASE_URL } from '@/lib/socket';
import { showBrowserNotification, requestNotificationPermission, initFirebaseForegroundListener } from '@/lib/firebase';
import { AudioCallModal } from '@/components/AudioCallModal';
import { useAuth } from './AuthContext';

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  amazonTag: 'bwbh00-20',
  currency: 'USD ($)',
  platformName: 'FreeProducts.online',
  supportEmail: 'support@freeproducts.online',
  enableSoundAlerts: true,
  maintenanceMode: false,
};

interface AppContextType {
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => Promise<{ success: boolean; message?: string }>;
  currencySymbol: string;
  formatAmazonUrl: (rawUrl?: string) => string;
  products: Product[];
  messages: ChatMessage[];
  unreadCount: number;
  isTyping: boolean;
  typingSender: string | null;
  toastMessage: string | null;
  activeShareProduct: Product | null;
  activeDetailProduct: Product | null;
  isChatOpen: boolean;
  inquiryProduct: Product | null;
  copiedId: string | null;
  showToast: (msg: string) => void;
  openShareModal: (product: Product) => void;
  closeShareModal: () => void;
  openDetailModal: (product: Product) => void;
  closeDetailModal: () => void;
  openChatWithProduct: (product: Product) => void;
  openChat: () => void;
  closeChat: () => void;
  clearInquiryProduct: () => void;
  copyClientLink: (product: Product) => void;
  addProduct: (product: Product) => Promise<{ success: boolean; message?: string }> | void;
  updateProduct: (product: Product) => Promise<{ success: boolean; message?: string }> | void;
  deleteProduct: (productId: string) => Promise<{ success: boolean; message?: string }> | void;
  resetProducts: () => void;
  sendCustomerMessage: (text: string, image?: string, productInfo?: { title: string; price: number; image: string }) => void;
  sendAdminReply: (text: string, image?: string, targetUserId?: string) => void;
  emitTyping: (isTyping: boolean, targetUserId?: string) => void;
  clearMessages: (targetUserId?: string) => void;
  getProductById: (id: string) => Product | undefined;
  reviews: Review[];
  addReview: (reviewData: { productId: string; rating: number; title?: string; comment: string }) => { success: boolean; message: string };
  deleteReview: (reviewId: string) => { success: boolean; message: string };
  getProductReviews: (productId: string) => Review[];
  audioCall: AudioCallState | null;
  startAudioCall: (targetUserId?: string, partnerName?: string) => void;
  acceptAudioCall: () => void;
  rejectAudioCall: () => void;
  endAudioCall: () => void;
  toggleAudioCallMute: () => void;
  requestPushNotifications: () => Promise<void>;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  markConversationAsRead: (userId?: string) => void;
  chatPage: number;
  chatTotal: number;
  hasMoreMessages: boolean;
  isLoadingOlderMessages: boolean;
  loadOlderMessages: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for sending authenticated requests
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bytedesk_token_v2');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Helper to extract numeric epoch time for strict chronological sorting
const getMessageTime = (m: ChatMessage): number => {
  if (m.createdAt) {
    const t = new Date(m.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (m.id && m.id.startsWith('msg-')) {
    const parsed = parseInt(m.id.replace('msg-', ''), 10);
    if (!isNaN(parsed) && parsed > 1000000000000) return parsed;
  }
  if (m.localId && m.localId.startsWith('msg-')) {
    const parsed = parseInt(m.localId.replace('msg-', ''), 10);
    if (!isNaN(parsed) && parsed > 1000000000000) return parsed;
  }
  return 0;
};

// Helper to guarantee clean, strictly chronological deduplicated messages (oldest at top, newest at bottom)
const dedupeMessages = (list: ChatMessage[]): ChatMessage[] => {
  // 1. Sort all messages in ascending chronological order (older at top, newer at bottom)
  const sorted = [...list].sort((a, b) => {
    const timeA = getMessageTime(a);
    const timeB = getMessageTime(b);
    if (timeA !== timeB) return timeA - timeB;
    // Tie-breaker: server IDs come before optimistic local IDs
    const aIsOptimistic = a.id.startsWith('msg-');
    const bIsOptimistic = b.id.startsWith('msg-');
    if (aIsOptimistic && !bIsOptimistic) return 1;
    if (!aIsOptimistic && bIsOptimistic) return -1;
    return a.id.localeCompare(b.id);
  });

  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const result: ChatMessage[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    if (!m) continue;

    // Check ID duplicates
    if (seenIds.has(m.id)) continue;
    if (m.localId && seenIds.has(m.localId)) continue;

    // Check content duplicates:
    // If a server-confirmed message with same sender, text, and userId was already processed,
    // skip any pending optimistic copy of that message!
    const contentKey = `${m.sender}_${m.userId || ''}_${m.text?.trim() || ''}`;
    const isOptimistic = m.id.startsWith('msg-') || (m.localId && m.localId.startsWith('msg-'));
    
    if (isOptimistic && seenContent.has(contentKey)) {
      continue;
    }

    seenIds.add(m.id);
    if (m.localId) seenIds.add(m.localId);
    if (!isOptimistic && m.text) {
      seenContent.add(contentKey);
    }

    // Suppress consecutive identical duplicate bubbles with same text & sender
    const prev = result[result.length - 1];
    if (
      prev &&
      prev.sender === m.sender &&
      prev.text === m.text &&
      Math.abs(getMessageTime(prev) - getMessageTime(m)) < 5000
    ) {
      continue;
    }

    result.push(m);
  }

  return result;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    title: 'Welcome to FreeProducts.online! 🎁',
    body: 'Get 100% free Amazon products to test and review with USA sellers. Keep every item you review!',
    type: 'system',
    timestamp: 'Just now',
    read: false,
    link: '/products',
  },
  {
    id: 'notif-call-ready',
    title: 'Audio Call & Real-time Alerts 📞',
    body: 'Instant audio call support and Socket.IO notifications are active on your account.',
    type: 'call',
    timestamp: '10m ago',
    read: false,
    link: '/chat',
  },
  {
    id: 'notif-amazon-deal',
    title: 'New Amazon Product Perks Added ⭐',
    body: 'High-ticket tech & home products added for verified reviewers. Claim yours before stock ends.',
    type: 'order',
    timestamp: '1h ago',
    read: true,
    link: '/products',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [messages, setMessages] = useState<ChatMessage[]>(() => dedupeMessages(INITIAL_CHAT_MESSAGES));
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeShareProduct, setActiveShareProduct] = useState<Product | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [audioCall, setAudioCall] = useState<AudioCallState | null>(null);
  const [chatPage, setChatPage] = useState(1);
  const [chatTotal, setChatTotal] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userRef = useRef(user);

  // Platform Global Settings state
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('platform_settings_v1');
        if (stored) return { ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(stored) };
      } catch {}
    }
    return DEFAULT_PLATFORM_SETTINGS;
  });

  // Sync settings from backend API
  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => {
            const next = { ...prev, ...data };
            try {
              localStorage.setItem('platform_settings_v1', JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Sync products from backend API, fallback to localStorage / INITIAL_PRODUCTS
  useEffect(() => {
    let isMounted = true;
    try {
      const cached = localStorage.getItem('product_perks_catalog_v4');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch {}

    fetch(`${API_BASE_URL}/products`)
      .then((res) => (res.ok ? res.json() : null))
      .then((serverProducts) => {
        if (isMounted && Array.isArray(serverProducts) && serverProducts.length > 0) {
          setProducts((prev) => {
            const serverIds = new Set(serverProducts.map((p: any) => p.id));
            const customLocalOnly = prev.filter(
              (p) => !serverIds.has(p.id) && !INITIAL_PRODUCTS.some((ip) => ip.id === p.id)
            );
            const merged = [...serverProducts, ...customLocalOnly];
            try {
              localStorage.setItem('product_perks_catalog_v4', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Helper to get user-specific notifications storage key so accounts NEVER leak or collide
  const getNotificationsStorageKey = (u?: { id: string; role: string } | null) => {
    if (!u) return 'freeproducts_notifications_guest';
    return u.role === 'admin' ? 'freeproducts_notifications_admin' : `freeproducts_notifications_user_${u.id}`;
  };

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load user-specific notifications whenever user changes (login / logout / switch account)
  useEffect(() => {
    const key = getNotificationsStorageKey(user);
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
            return;
          }
        }
      } catch (e) {}
    }

    // Role-specific initial notifications
    const initialForUser: NotificationItem[] = user?.role === 'admin' 
      ? [
          {
            id: 'notif-admin-welcome',
            title: 'Admin Console Active 🛡️',
            body: 'You will receive real-time notifications for customer inquiries, reviews, and audio calls.',
            type: 'system',
            timestamp: 'Just now',
            read: true,
            link: '/admin',
          }
        ]
      : [
          {
            id: 'notif-welcome',
            title: `Welcome to FreeProducts.online${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 🎁`,
            body: 'Test high-value Amazon products for 100% free with verified USA sellers. Keep every item you review!',
            type: 'system',
            timestamp: 'Just now',
            read: false,
            link: '/products',
          },
          {
            id: 'notif-call-ready',
            title: 'Audio Call & Real-time Alerts 📞',
            body: 'Direct audio call support and instant message notifications are active for your account.',
            type: 'call',
            timestamp: '5m ago',
            read: false,
            link: '/chat',
          },
        ];

    setNotifications(initialForUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(initialForUser));
      } catch (e) {}
    }
  }, [user?.id, user?.role]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const persistNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    const key = getNotificationsStorageKey(user);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const markNotificationAsRead = (id: string) => {
    persistNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    persistNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    persistNotifications([]);
  };

  // Initialize reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bytedesk_reviews_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
          return;
        }
      }
      setReviews([]);
    } catch (e) {}
  }, []);

  const persistReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    try {
      localStorage.setItem('bytedesk_reviews_v2', JSON.stringify(newReviews));
    } catch (e) {}
  };

  const getProductReviews = (prodId: string) => {
    return reviews.filter((r) => r.productId === prodId);
  };

  const addReview = (reviewData: { productId: string; rating: number; title?: string; comment: string }) => {
    if (!user) {
      showToast('Please sign in to submit a product review.');
      return { success: false, message: 'Please sign in to write a review.' };
    }

    const isAuthorized = user.role === 'admin' || user.canReview === true;
    if (!isAuthorized) {
      showToast('Review access restricted: Admin authorization is required.');
      return {
        success: false,
        message: 'You do not have permission to post reviews. Admin authorization is required.',
      };
    }

    if (!reviewData.comment.trim()) {
      showToast('Please write a review comment.');
      return { success: false, message: 'Review comment cannot be empty.' };
    }

    const newRev: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: reviewData.productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=1b3b2b`,
      rating: Math.max(1, Math.min(5, reviewData.rating || 5)),
      title: reviewData.title?.trim() || undefined,
      comment: reviewData.comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedReviewer: true,
    };

    const updated = [newRev, ...reviews];
    persistReviews(updated);

    // Update product reviewsCount
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          return { ...p, reviewsCount: (p.reviewsCount || 0) + 1 };
        }
        return p;
      })
    );

    // Attempt backend sync
    fetch(`${API_BASE_URL}/products/${reviewData.productId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newRev),
    }).catch(() => {});

    showToast('Your review has been published!');
    return { success: true, message: 'Review published successfully.' };
  };

  const deleteReview = (reviewId: string) => {
    const target = reviews.find((r) => r.id === reviewId);
    if (!target) return { success: false, message: 'Review not found.' };

    const canDelete = user?.role === 'admin' || user?.id === target.userId;
    if (!canDelete) {
      showToast('Only administrators can remove reviews.');
      return { success: false, message: 'Unauthorized: Only admins can delete reviews.' };
    }

    const updated = reviews.filter((r) => r.id !== reviewId);
    persistReviews(updated);

    if (target.productId) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === target.productId && p.reviewsCount > 0) {
            return { ...p, reviewsCount: Math.max(0, p.reviewsCount - 1) };
          }
          return p;
        })
      );
    }

    // Attempt backend sync
    fetch(`${API_BASE_URL}/products/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(() => {});

    showToast('Review deleted successfully.');
    return { success: true, message: 'Review removed.' };
  };

  // Audio synthesizer chime
  const playChime = () => {
    if (!settings.enableSoundAlerts) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // Ringtone synthesizer for audio calls
  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 1.2);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const startRingtoneLoop = () => {
    stopRingtoneLoop();
    playRingtone();
    ringtoneIntervalRef.current = setInterval(playRingtone, 2800);
  };

  const stopRingtoneLoop = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
  };

  // Connected call duration timer
  useEffect(() => {
    if (audioCall?.status === 'connected') {
      callTimerRef.current = setInterval(() => {
        setAudioCall((prev) => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [audioCall?.status]);

  // Helper to get user-specific localStorage cache key so different accounts never collide
  const getMessagesStorageKey = (u?: { id: string; role: string } | null) => {
    if (!u) return null;
    return u.role === 'admin' ? 'product_perks_messages_admin' : `product_perks_messages_${u.id}`;
  };

  // 1. Initialize Catalog & Socket.IO on mount / user change
  useEffect(() => {
    try {
      // Fetch public products from Backend API
      fetch(`${API_BASE_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            localStorage.setItem('product_perks_catalog_v4', JSON.stringify(data));
          }
        })
        .catch(() => {
          const storedProds = localStorage.getItem('product_perks_catalog_v4');
          if (storedProds) {
            try {
              const parsed = JSON.parse(storedProds);
              if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
            } catch (e) {}
          }
        });

      // Connect Socket.IO for real-time instant chat events
      const socket = getSocket();
      if (socket) {
        const joinRooms = () => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
          if (user?.role === 'admin') {
            socket.emit('joinRoom', { roomId: 'admin_room', token: token || undefined });
          } else if (user?.id) {
            socket.emit('joinRoom', { userId: user.id, token: token || undefined });
          }
        };

        // Join room immediately and re-join whenever socket connects or reconnects
        joinRooms();
        socket.on('connect', joinRooms);

        const handleNewMessage = (newMsg: ChatMessage) => {
          // STRICT ISOLATION: A client MUST NEVER accept or display messages belonging to another user
          const isAdmin = user?.role === 'admin';
          if (!isAdmin) {
            if (!user?.id || !newMsg.userId || newMsg.userId !== user.id) {
              return; // Discard any message not strictly belonging to this client
            }
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;

            if (newMsg.localId) {
              const idx = prev.findIndex((m) => m.id === newMsg.localId || m.localId === newMsg.localId);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = newMsg;
                return dedupeMessages(updated);
              }
            }

            const fallbackIdx = prev.findIndex(
              (m) =>
                m.sender === newMsg.sender &&
                m.text === newMsg.text &&
                (m.id.startsWith('msg-') || (m.localId && m.localId.startsWith('msg-')))
            );
            if (fallbackIdx !== -1) {
              const updated = [...prev];
              updated[fallbackIdx] = newMsg;
              return dedupeMessages(updated);
            }

            return dedupeMessages([...prev, newMsg]);
          });

          if (newMsg.sender === 'admin' || (user?.role === 'admin' && newMsg.sender === 'customer')) {
            playChime();
          }

          // When a message arrives, immediately clear typing bubble
          if (newMsg.sender === 'admin' && user?.role !== 'admin') {
            if (typingSafetyTimer) clearTimeout(typingSafetyTimer);
            setIsTyping(false);
            setTypingSender(null);
          }
          if (newMsg.sender === 'customer' && user?.role === 'admin') {
            if (typingSafetyTimer) clearTimeout(typingSafetyTimer);
            setIsTyping(false);
            setTypingSender(null);
          }
        };

        let typingSafetyTimer: NodeJS.Timeout | null = null;

        const handleTypingEvent = (data: { isTyping: boolean; sender: string; userId?: string }) => {
          const isAdmin = user?.role === 'admin';

          // STRICT FILTERING: Customer NEVER receives or processes self/customer typing
          if (!isAdmin) {
            // Customer view: only care about ADMIN typing directed to this customer
            if (data.sender !== 'admin') return;
            if (user?.id && data.userId && data.userId !== user.id) return;
          } else {
            // Admin view: only care about CUSTOMER typing
            if (data.sender !== 'customer') return;
          }

          if (typingSafetyTimer) clearTimeout(typingSafetyTimer);

          const typingActive = Boolean(data?.isTyping);
          setIsTyping(typingActive);
          setTypingSender(typingActive ? (data?.sender || null) : null);

          if (typingActive) {
            // Auto reset after 4 seconds of inactivity as a safeguard
            typingSafetyTimer = setTimeout(() => {
              setIsTyping(false);
              setTypingSender(null);
            }, 4000);
          }
        };

        const handleNotification = (notif: { 
          id?: string;
          title: string; 
          body: string; 
          sender?: string; 
          userId?: string; 
          type?: string; 
          link?: string; 
          isBroadcast?: boolean;
          productId?: string;
          image?: string;
        }) => {
          const isAdmin = user?.role === 'admin';
          const isBroadcast = Boolean(notif.isBroadcast || notif.type === 'product');

          // If NOT a broadcast, enforce strict user isolation:
          if (!isBroadcast) {
            if (isAdmin) {
              // Admin only receives notifications when customers send messages
              if (notif.sender !== 'customer') return;
            } else {
              // Customer must be logged in and the notification MUST be targeted to their exact user ID
              if (!user?.id) return;
              if (!notif.userId || notif.userId !== user.id) return;
              // Customer only receives notifications when admin replies
              if (notif.sender !== 'admin') return;
            }
          }

          playChime();
          const toastIcon = notif.type === 'product' ? '🎁' : '🔔';
          showToast(`${toastIcon} ${notif.title}: ${notif.body}`);
          showBrowserNotification(notif.title, {
            body: notif.body,
            url: notif.link || (notif.type === 'product' ? '/products' : '/chat'),
          });

          // Append to Notification Center for THIS user/guest
          const newNotifItem: NotificationItem = {
            id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: notif.title || 'New Notification',
            body: notif.body || 'You have received an update.',
            type: (notif.type as any) || (notif.title.toLowerCase().includes('call') ? 'call' : 'order'),
            timestamp: 'Just now',
            read: false,
            link: notif.link || (notif.type === 'product' ? '/products' : '/chat'),
            sender: notif.sender || 'system',
          };

          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotifItem.id)) return prev;
            const nextList = [newNotifItem, ...prev.slice(0, 49)];
            const key = getNotificationsStorageKey(user);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(key, JSON.stringify(nextList));
              } catch (e) {}
            }
            return nextList;
          });
        };

        const handleNewProductAdded = (newProd: Product) => {
          if (!newProd || !newProd.id) return;
          setProducts((prev) => {
            if (prev.some((p) => p.id === newProd.id)) {
              return prev.map((p) => (p.id === newProd.id ? newProd : p));
            }
            return [newProd, ...prev];
          });
        };

        const handleIncomingAudioCall = (callData: any) => {
          const isAdmin = user?.role === 'admin';

          // STRICT CALL RECIPIENT VALIDATION:
          if (isAdmin) {
            // Admin only receives incoming calls from customers
            if (callData.callerRole === 'admin') return;
          } else {
            // Customer must be logged in and must be the exact target of the call
            if (!user?.id || callData.targetUserId !== user.id) return;
            if (callData.callerRole !== 'admin') return;
          }

          startRingtoneLoop();
          setAudioCall({
            callId: callData.callId,
            callerId: callData.callerId,
            callerName: callData.callerName,
            callerRole: callData.callerRole,
            targetUserId: callData.targetUserId,
            status: 'incoming',
            durationSeconds: 0,
            isMuted: false,
          });
          showToast(`📞 Incoming Audio Call from ${callData.callerName}!`);
          showBrowserNotification(`📞 Incoming Audio Call`, {
            body: `${callData.callerName} is calling you on FreeProducts.online`,
          });

          // Add call event to notifications list for THIS user only
          const callNotifItem: NotificationItem = {
            id: `notif-call-${Date.now()}`,
            title: 'Incoming Audio Call 📞',
            body: `${callData.callerName} called you on FreeProducts.online`,
            type: 'call',
            timestamp: 'Just now',
            read: false,
            link: '/chat',
            sender: callData.callerName,
          };
          setNotifications((prev) => {
            const nextList = [callNotifItem, ...prev.slice(0, 49)];
            const key = getNotificationsStorageKey(user);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(key, JSON.stringify(nextList));
              } catch (e) {}
            }
            return nextList;
          });
        };

        const handleAudioCallAccepted = () => {
          stopRingtoneLoop();
          setAudioCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
          showToast('📞 Call connected.');
        };

        const handleAudioCallRejected = (data?: any) => {
          stopRingtoneLoop();
          if (callTimerRef.current) clearInterval(callTimerRef.current);
          setAudioCall(null);
          showToast(data?.reason || 'Call was declined.');
        };

        const handleAudioCallEnded = (data?: any) => {
          stopRingtoneLoop();
          if (callTimerRef.current) clearInterval(callTimerRef.current);
          setAudioCall(null);
          showToast('📞 Call ended.');
        };

        const handleMessagesRead = (data?: { ids?: string[] }) => {
          if (data?.ids && data.ids.length > 0) {
            const idSet = new Set(data.ids);
            setMessages((prev) =>
              prev.map((m) => (idSet.has(m.id) ? { ...m, read: true } : m))
            );
          }
        };

        const handleSettingsUpdated = (newSettings: PlatformSettings) => {
          if (newSettings && typeof newSettings === 'object') {
            setSettings((prev) => {
              const merged = { ...prev, ...newSettings };
              try {
                localStorage.setItem('platform_settings_v1', JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('typing', handleTypingEvent);
        socket.on('notification', handleNotification);
        socket.on('newProductAdded', handleNewProductAdded);
        socket.on('settingsUpdated', handleSettingsUpdated);
        socket.on('incomingAudioCall', handleIncomingAudioCall);
        socket.on('audioCallAccepted', handleAudioCallAccepted);
        socket.on('audioCallRejected', handleAudioCallRejected);
        socket.on('audioCallEnded', handleAudioCallEnded);
        socket.on('messagesRead', handleMessagesRead);

        return () => {
          if (typingSafetyTimer) clearTimeout(typingSafetyTimer);
          socket.off('connect', joinRooms);
          socket.off('newMessage', handleNewMessage);
          socket.off('typing', handleTypingEvent);
          socket.off('notification', handleNotification);
          socket.off('newProductAdded', handleNewProductAdded);
          socket.off('settingsUpdated', handleSettingsUpdated);
          socket.off('incomingAudioCall', handleIncomingAudioCall);
          socket.off('audioCallAccepted', handleAudioCallAccepted);
          socket.off('audioCallRejected', handleAudioCallRejected);
          socket.off('audioCallEnded', handleAudioCallEnded);
          socket.off('messagesRead', handleMessagesRead);
        };
      }
    } catch (e) {
      console.warn('AppContext init error:', e);
    }
  }, [user?.id, user?.role]);

  // 2. Sync chat messages with backend database & continuous polling
  useEffect(() => {
    // If not logged in, client has no private messages to display
    if (!user) {
      setMessages([]);
      return;
    }

    const storageKey = getMessagesStorageKey(user);

    // Initial populate from user's isolated local cache if available
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const isAdmin = user.role === 'admin';
            const filtered = isAdmin ? parsed : parsed.filter((m: any) => m.userId === user.id);
            setMessages(dedupeMessages(filtered));
          }
        }
      } catch {}
    }

    const syncMessages = async () => {
      try {
        const chatFetchUrl = `${API_BASE_URL}/chat/messages?page=1&limit=50`;
        const res = await fetch(chatFetchUrl, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : (data.messages || []);
          if (!Array.isArray(data) && typeof data.total === 'number') {
            setChatTotal(data.total);
            setHasMoreMessages(data.hasMore ?? false);
          }

          if (Array.isArray(rawList)) {
            // Strict isolation: Non-admin users strictly get their own messages
            const isAdmin = user?.role === 'admin';
            const isolatedData = isAdmin
              ? rawList
              : rawList.filter((m: any) => m.userId === user.id);

            setMessages((prev) => {
              const serverIds = new Set(isolatedData.map((m: any) => m.id));
              // Preserve any older loaded messages from previous pages
              const alreadyLoadedOlder = prev.filter(
                (m) =>
                  !serverIds.has(m.id) &&
                  !m.id.startsWith('msg-') &&
                  (!m.localId || !m.localId.startsWith('msg-'))
              );
              // Preserve ONLY genuinely pending optimistic messages that haven't reached server yet
              const pendingOptimistic = prev.filter((m) => {
                const isOptimistic = m.id.startsWith('msg-') || (m.localId && m.localId.startsWith('msg-'));
                if (!isOptimistic) return false;
                if (serverIds.has(m.id) || (m.localId && serverIds.has(m.localId))) return false;

                // If server data already has a message with same text & sender, it's not pending anymore
                const alreadyOnServer = isolatedData.some(
                  (s: any) =>
                    s.sender === m.sender &&
                    s.text === m.text &&
                    (s.userId === m.userId || (!s.userId && !m.userId))
                );
                if (alreadyOnServer) return false;

                return isAdmin || m.userId === user.id;
              });

              const merged = dedupeMessages([...alreadyLoadedOlder, ...isolatedData, ...pendingOptimistic]);
              if (storageKey) {
                try {
                  localStorage.setItem(storageKey, JSON.stringify(merged));
                } catch {}
              }
              return merged;
            });
          }
        }
      } catch {
        if (storageKey) {
          const storedMsgs = localStorage.getItem(storageKey);
          if (storedMsgs) {
            try {
              const parsed = JSON.parse(storedMsgs);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const isAdmin = user?.role === 'admin';
                const filtered = isAdmin
                  ? parsed
                  : parsed.filter((m: any) => m.userId === user.id);
                setMessages(dedupeMessages(filtered));
              }
            } catch (e) {}
          }
        }
      }
    };

    syncMessages();
    const pollInterval = setInterval(syncMessages, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [user?.id, user?.role]);

  // Save to LocalStorage as cache
  useEffect(() => {
    try {
      localStorage.setItem('product_perks_catalog_v4', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    if (!user) return;
    const storageKey = getMessagesStorageKey(user);
    if (storageKey && messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages, user?.id, user?.role]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openShareModal = (prod: Product) => setActiveShareProduct(prod);
  const closeShareModal = () => setActiveShareProduct(null);

  const openDetailModal = (prod: Product) => setActiveDetailProduct(prod);
  const closeDetailModal = () => setActiveDetailProduct(null);

  const openChatWithProduct = (prod: Product) => {
    setInquiryProduct(prod);
    setIsChatOpen(true);
  };

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const clearInquiryProduct = () => setInquiryProduct(null);

  const copyClientLink = (prod: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://freeproducts.online';
    const link = `${origin}/p/${prod.id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(prod.id);
    showToast(`Client link copied: /p/${prod.id}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const addProduct = async (newProd: Product): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProd),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg =
          data.message ||
          (res.status === 403
            ? 'Admin privileges required to publish products. Please make sure you are logged in as an administrator.'
            : res.status === 401
            ? 'Authentication required. Please log in with an Admin account first.'
            : `Failed to save product (status ${res.status})`);
        return { success: false, message: errorMsg };
      }

      const saved = data && data.id ? data : newProd;
      setProducts((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);

      // Broadcast over socket for instant real-time synchronization to all clients
      const socket = getSocket();
      if (socket && socket.connected) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
        socket.emit('broadcastProduct', { product: saved, token: token || undefined });
      }

      return { success: true };
    } catch (err: any) {
      setProducts((prev) => [newProd, ...prev]);
      return { success: true, message: 'Saved locally' };
    }
  };

  const updateProduct = async (updated: Product): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${updated.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = data.message || `Failed to update product (status ${res.status})`;
        return { success: false, message: errorMsg };
      }

      const saved = data && data.id ? data : updated;
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      return { success: true };
    } catch (err: any) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      return { success: true, message: 'Updated locally' };
    }
  };

  const deleteProduct = async (id: string): Promise<{ success: boolean; message?: string }> => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || 'Error removing product on server');
        return { success: false, message: data.message };
      }
      showToast('Product removed.');
      return { success: true };
    } catch {
      showToast('Product removed.');
      return { success: true };
    }
  };

  const loadOlderMessages = async () => {
    if (isLoadingOlderMessages || !hasMoreMessages) return;
    setIsLoadingOlderMessages(true);
    try {
      const nextPage = chatPage + 1;
      const res = await fetch(`${API_BASE_URL}/chat/messages?page=${nextPage}&limit=30`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const older = Array.isArray(data) ? data : (data.messages || []);
        if (older.length > 0) {
          const isAdmin = user?.role === 'admin';
          const isolated = isAdmin ? older : older.filter((m: any) => m.userId === user?.id);
          setMessages((prev) => dedupeMessages([...isolated, ...prev]));
          setChatPage(nextPage);
          setHasMoreMessages(data.hasMore ?? false);
          if (typeof data.total === 'number') setChatTotal(data.total);
        } else {
          setHasMoreMessages(false);
        }
      }
    } catch {
      showToast('Could not load earlier messages.');
    } finally {
      setIsLoadingOlderMessages(false);
    }
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem('product_perks_catalog_v4', JSON.stringify(INITIAL_PRODUCTS));
    } catch (e) {}
    showToast('Catalog restored to official Amazon products.');
  };

  const emitTyping = (typingState: boolean, targetUserId?: string) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
      socket.emit('typing', {
        isTyping: typingState,
        sender: user?.role === 'admin' ? 'admin' : 'customer',
        userId: user?.role === 'admin' ? targetUserId : user?.id,
        token: token || undefined,
      });
    }
  };

  const sendCustomerMessage = (
    text: string, 
    image?: string, 
    productInfo?: { title: string; price: number; image: string }
  ) => {
    const now = new Date();
    const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const createdAt = now.toISOString();
    const localId = `msg-${now.getTime()}`;
    const senderName = user?.name || (isAuthenticated ? 'Registered Reviewer' : 'Reviewer');
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;

    const newMsg: ChatMessage = {
      id: localId,
      localId,
      sender: 'customer',
      senderName,
      text,
      image,
      productInfo,
      timestamp: timeNow,
      createdAt,
      read: true,
      userId: user?.id,
    };
    setMessages((prev) => dedupeMessages([...prev, newMsg]));

    const payload = {
      sender: 'customer' as const,
      senderName,
      text,
      image,
      productInfo,
      userId: user?.id,
      localId,
      token: token || undefined,
    };

    // Emit in real-time via Socket.IO
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('sendMessage', payload, (saved: ChatMessage) => {
        if (saved && saved.id) {
          setMessages((prev) =>
            dedupeMessages(prev.map((m) => (m.id === localId ? { ...saved, localId } : m)))
          );
        }
      });
    } else {
      // Fallback via REST API with Auth
      fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((saved) => {
          if (saved && saved.id) {
            setMessages((prev) =>
              dedupeMessages(prev.map((m) => (m.id === localId ? { ...saved, localId } : m)))
            );
          }
        })
        .catch(() => {});
    }
  };

  const sendAdminReply = (text: string, image?: string, targetUserId?: string) => {
    const now = new Date();
    const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const createdAt = now.toISOString();
    const localId = `msg-${now.getTime()}`;
    const senderName = user?.name || 'FreeProducts.online Admin';
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;

    // Target the specific customer or the most recent customer in the chat
    const lastCustomerMsg = [...messages].reverse().find((m) => m.sender === 'customer' && m.userId);
    const resolvedUserId = targetUserId || lastCustomerMsg?.userId || null;

    const newMsg: ChatMessage = {
      id: localId,
      localId,
      sender: 'admin',
      senderName,
      text,
      image,
      timestamp: timeNow,
      createdAt,
      read: true,
      userId: resolvedUserId || undefined,
    };
    setMessages((prev) => dedupeMessages([...prev, newMsg]));

    const payload = {
      sender: 'admin' as const,
      senderName,
      text,
      image,
      userId: resolvedUserId,
      localId,
      token: token || undefined,
    };

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('sendMessage', payload, (saved: ChatMessage) => {
        if (saved && saved.id) {
          setMessages((prev) =>
            dedupeMessages(prev.map((m) => (m.id === localId ? { ...saved, localId } : m)))
          );
        }
      });
    } else {
      fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((saved) => {
          if (saved && saved.id) {
            setMessages((prev) =>
              dedupeMessages(prev.map((m) => (m.id === localId ? { ...saved, localId } : m)))
            );
          }
        })
        .catch(() => {});
    }
  };

  const clearMessages = (targetUserId?: string) => {
    if (targetUserId) {
      setMessages((prev) => prev.filter((m) => m.userId !== targetUserId));
    } else {
      setMessages(INITIAL_CHAT_MESSAGES);
    }
    const query = targetUserId ? `?userId=${encodeURIComponent(targetUserId)}` : '';
    fetch(`${API_BASE_URL}/chat/messages${query}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(() => {});
    showToast('Chat history cleared.');
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const unreadCount = useMemo(() => {
    if (user?.role === 'admin') {
      return messages.filter((m) => m.sender === 'customer' && !m.read).length;
    }
    return messages.filter((m) => m.sender === 'admin' && !m.read).length;
  }, [messages, user?.role]);

  const markConversationAsRead = (convUserId?: string) => {
    const unreadIds: string[] = [];
    setMessages((prev) => {
      let changed = false;
      const next = prev.map((m) => {
        const matchConv = convUserId === 'guest' || !convUserId ? !m.userId : m.userId === convUserId;
        if (matchConv && m.sender === 'customer' && !m.read) {
          unreadIds.push(m.id);
          changed = true;
          return { ...m, read: true };
        }
        return m;
      });
      return changed ? next : prev;
    });

    if (unreadIds.length > 0) {
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit('markAsRead', { ids: unreadIds });
      }
      fetch(`${API_BASE_URL}/chat/messages/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids: unreadIds }),
      }).catch(() => {});
    }
  };

  // Audio Call Actions
  const startAudioCall = (targetUserId?: string, partnerName?: string) => {
    const socket = getSocket();
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
    const callerName = user?.name || 'Reviewer';
    const callerRole = user?.role === 'admin' ? ('admin' as const) : ('customer' as const);

    startRingtoneLoop();
    setAudioCall({
      callId: `call_${Date.now()}`,
      callerId: user?.id || 'guest',
      callerName: partnerName || (callerRole === 'admin' ? 'Customer' : 'FreeProducts Support Desk'),
      callerRole,
      targetUserId,
      status: 'calling',
      durationSeconds: 0,
      isMuted: false,
    });

    if (socket && socket.connected) {
      socket.emit('startAudioCall', {
        targetUserId,
        callerName,
        callerRole,
        token: token || undefined,
      });
    }
    showToast(callerRole === 'admin' ? `📞 Calling ${partnerName || 'customer'}...` : '📞 Calling Support Desk...');
  };

  const acceptAudioCall = () => {
    stopRingtoneLoop();
    if (!audioCall) return;
    const socket = getSocket();
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
    if (socket && socket.connected) {
      socket.emit('acceptAudioCall', {
        callId: audioCall.callId,
        targetUserId: audioCall.targetUserId,
        token: token || undefined,
      });
    }
    setAudioCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
  };

  const rejectAudioCall = () => {
    stopRingtoneLoop();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (!audioCall) return;
    const socket = getSocket();
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
    if (socket && socket.connected) {
      socket.emit('rejectAudioCall', {
        callId: audioCall.callId,
        targetUserId: audioCall.targetUserId,
        callerId: audioCall.callerId,
        reason: 'Call declined',
        token: token || undefined,
      });
    }
    setAudioCall(null);
    showToast('Call declined.');
  };

  const endAudioCall = () => {
    stopRingtoneLoop();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (!audioCall) return;
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('endAudioCall', {
        callId: audioCall.callId,
        targetUserId: audioCall.targetUserId,
        callerId: audioCall.callerId,
        durationSeconds: audioCall.durationSeconds,
      });
    }
    setAudioCall(null);
    showToast('Call ended.');
  };

  const toggleAudioCallMute = () => {
    setAudioCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  // Setup Firebase foreground listener with strict user isolation (initialized once)
  useEffect(() => {
    initFirebaseForegroundListener((payload) => {
      const currentUser = userRef.current;
      const targetUserId = payload.data?.userId || payload.data?.targetUserId;
      const targetRole = payload.data?.role || payload.data?.targetRole;

      // STRICT USER ISOLATION FOR PUSH NOTIFICATIONS
      if (currentUser?.role === 'admin') {
        if (targetRole && targetRole !== 'admin') return;
      } else {
        if (targetRole === 'admin') return;
        if (targetUserId && currentUser?.id && targetUserId !== currentUser.id) return;
      }

      playChime();
      const title = payload.notification?.title || payload.data?.title || 'FreeProducts Notification';
      const body = payload.notification?.body || payload.data?.body || 'New message or update received.';
      showToast(`🔔 ${title}: ${body}`);
      const newNotifItem: NotificationItem = {
        id: `fcm-${Date.now()}`,
        title,
        body,
        type: 'system',
        timestamp: 'Just now',
        read: false,
        link: payload.data?.url || '/chat',
      };
      setNotifications((prev) => {
        const nextList = [newNotifItem, ...prev.slice(0, 49)];
        const key = getNotificationsStorageKey(currentUser);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(key, JSON.stringify(nextList));
          } catch (e) {}
        }
        return nextList;
      });
    });
  }, []);

  const requestPushNotifications = async () => {
    const res = await requestNotificationPermission(user?.id, API_BASE_URL);
    if (res === 'granted') {
      showToast('Push Notifications enabled successfully!');
      showBrowserNotification('FreeProducts.online Notifications', {
        body: 'You will receive real-time alerts when messages or order perks arrive.',
      });
    } else {
      showToast('Notification permission was dismissed or blocked in browser settings.');
    }
  };

  const currencySymbol = useMemo(() => {
    const cur = settings.currency || 'USD ($)';
    if (cur.includes('GBP') || cur.includes('£')) return '£';
    if (cur.includes('EUR') || cur.includes('€')) return '€';
    if (cur.includes('CAD')) return 'C$';
    return '$';
  }, [settings.currency]);

  const formatAmazonUrl = (rawUrl?: string): string => {
    if (!rawUrl) return '';
    const tag = settings.amazonTag?.trim();
    if (!tag) return rawUrl;
    try {
      const url = new URL(rawUrl);
      url.searchParams.set('tag', tag);
      return url.toString();
    } catch {
      if (rawUrl.includes('tag=')) {
        return rawUrl.replace(/tag=[^&]+/, `tag=${encodeURIComponent(tag)}`);
      }
      return rawUrl.includes('?') ? `${rawUrl}&tag=${encodeURIComponent(tag)}` : `${rawUrl}?tag=${encodeURIComponent(tag)}`;
    }
  };

  const updateSettings = async (newSettings: Partial<PlatformSettings>): Promise<{ success: boolean; message?: string }> => {
    try {
      setSettings((prev) => {
        const merged = { ...prev, ...newSettings };
        try {
          localStorage.setItem('platform_settings_v1', JSON.stringify(merged));
        } catch {}
        return merged;
      });

      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSettings),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, message: data?.message || 'Failed to save settings to server.' };
      }

      if (data && typeof data === 'object') {
        setSettings((prev) => {
          const merged = { ...prev, ...data };
          try {
            localStorage.setItem('platform_settings_v1', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }

      return { success: true };
    } catch (e: any) {
      return { success: true, message: 'Settings saved locally.' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        currencySymbol,
        formatAmazonUrl,
        products,
        messages,
        unreadCount,
        isTyping,
        typingSender,
        toastMessage,
        activeShareProduct,
        activeDetailProduct,
        isChatOpen,
        inquiryProduct,
        copiedId,
        showToast,
        openShareModal,
        closeShareModal,
        openDetailModal,
        closeDetailModal,
        openChatWithProduct,
        openChat,
        closeChat,
        clearInquiryProduct,
        copyClientLink,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        sendCustomerMessage,
        sendAdminReply,
        emitTyping,
        clearMessages,
        getProductById,
        reviews,
        addReview,
        deleteReview,
        getProductReviews,
        audioCall,
        startAudioCall,
        acceptAudioCall,
        rejectAudioCall,
        endAudioCall,
        toggleAudioCallMute,
        requestPushNotifications,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        markConversationAsRead,
        chatPage,
        chatTotal,
        hasMoreMessages,
        isLoadingOlderMessages,
        loadOlderMessages,
      }}
    >
      {children}
      <AudioCallModal
        callState={audioCall}
        onAccept={acceptAudioCall}
        onReject={rejectAudioCall}
        onEnd={endAudioCall}
        onToggleMute={toggleAudioCallMute}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
