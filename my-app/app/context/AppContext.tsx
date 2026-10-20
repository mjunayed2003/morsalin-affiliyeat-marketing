'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ChatMessage, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES, INITIAL_REVIEWS } from '../data/initialProducts';
import { getSocket, API_BASE_URL } from '@/lib/socket';
import { useAuth } from './AuthContext';

interface AppContextType {
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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetProducts: () => void;
  sendCustomerMessage: (text: string, image?: string, productInfo?: { title: string; price: number; image: string }) => void;
  sendAdminReply: (text: string, image?: string, targetUserId?: string) => void;
  emitTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  getProductById: (id: string) => Product | undefined;
  reviews: Review[];
  addReview: (reviewData: { productId: string; rating: number; title?: string; comment: string }) => { success: boolean; message: string };
  deleteReview: (reviewId: string) => { success: boolean; message: string };
  getProductReviews: (productId: string) => Review[];
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

// Helper to guarantee clean deduplicated messages
const dedupeMessages = (list: ChatMessage[]): ChatMessage[] => {
  const seenIds = new Set<string>();
  const result: ChatMessage[] = [];
  for (let i = 0; i < list.length; i++) {
    const m = list[i];
    if (!m) continue;
    if (seenIds.has(m.id)) continue;
    seenIds.add(m.id);

    // Suppress consecutive identical duplicate bubbles with same text & sender
    const prev = result[result.length - 1];
    if (
      prev &&
      prev.sender === m.sender &&
      prev.text === m.text &&
      prev.timestamp === m.timestamp
    ) {
      continue;
    }
    result.push(m);
  }
  return result;
};

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
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Initialize reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bytedesk_reviews_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
          return;
        }
      }
      localStorage.setItem('bytedesk_reviews_v2', JSON.stringify(INITIAL_REVIEWS));
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
        const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
        if (user?.role === 'admin') {
          socket.emit('joinRoom', { roomId: 'admin_room', token: token || undefined });
        } else if (user?.id) {
          socket.emit('joinRoom', { userId: user.id, token: token || undefined });
        }

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
        };

        const handleTypingEvent = (data: { isTyping: boolean; sender: string; userId?: string }) => {
          const isAdmin = user?.role === 'admin';
          if (!isAdmin && user?.id && data.userId && data.userId !== user.id) {
            return;
          }
          setIsTyping(Boolean(data?.isTyping));
          setTypingSender(data?.sender || null);
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('typing', handleTypingEvent);

        return () => {
          socket.off('newMessage', handleNewMessage);
          socket.off('typing', handleTypingEvent);
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
        const chatFetchUrl = `${API_BASE_URL}/chat/messages`;
        const res = await fetch(chatFetchUrl, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Strict isolation: Non-admin users strictly get their own messages
            const isAdmin = user?.role === 'admin';
            const isolatedData = isAdmin
              ? data
              : data.filter((m: any) => m.userId === user.id);

            setMessages((prev) => {
              const serverIds = new Set(isolatedData.map((m: any) => m.id));
              // Preserve pending optimistic messages for this user
              const pendingOptimistic = prev.filter(
                (m) =>
                  (m.id.startsWith('msg-') || (m.localId && m.localId.startsWith('msg-'))) &&
                  !serverIds.has(m.id) &&
                  (isAdmin || m.userId === user.id)
              );
              const merged = dedupeMessages([...isolatedData, ...pendingOptimistic]);
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

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProd),
    }).catch(() => {});
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    fetch(`${API_BASE_URL}/products/${updated.id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(() => {});
    showToast('Product removed.');
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem('product_perks_catalog_v4', JSON.stringify(INITIAL_PRODUCTS));
    } catch (e) {}
    showToast('Catalog restored to official Amazon products.');
  };

  const emitTyping = (typingState: boolean) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
      socket.emit('typing', {
        isTyping: typingState,
        sender: user?.role === 'admin' ? 'admin' : 'customer',
        userId: user?.id,
        token: token || undefined,
      });
    }
  };

  const sendCustomerMessage = (
    text: string, 
    image?: string, 
    productInfo?: { title: string; price: number; image: string }
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localId = `msg-${Date.now()}`;
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
      read: true,
      userId: user?.id,
    };
    setMessages((prev) => [...prev, newMsg]);

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
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localId = `msg-${Date.now()}`;
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

  const clearMessages = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
    fetch(`${API_BASE_URL}/chat/messages`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(() => {});
    showToast('Chat history cleared.');
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const unreadCount = messages.filter((m) => m.sender === 'admin' && !m.read).length;

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
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
