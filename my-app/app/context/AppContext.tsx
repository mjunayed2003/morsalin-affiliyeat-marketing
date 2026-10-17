'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES } from '../data/initialProducts';
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
  sendAdminReply: (text: string, image?: string) => void;
  emitTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  getProductById: (id: string) => Product | undefined;
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

  // Initialize from Backend & LocalStorage fallback
  useEffect(() => {
    try {
      // 1. Fetch public products from Backend API
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

      // 2. Fetch authenticated messages if token is available
      const chatFetchUrl = `${API_BASE_URL}/chat/messages`;
      fetch(chatFetchUrl, {
        headers: getAuthHeaders(),
      })
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const clean = dedupeMessages(data);
            setMessages(clean);
            localStorage.setItem('product_perks_messages_v1', JSON.stringify(clean));
          }
        })
        .catch(() => {
          const storedMsgs = localStorage.getItem('product_perks_messages_v1');
          if (storedMsgs) {
            try {
              const parsed = JSON.parse(storedMsgs);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setMessages(dedupeMessages(parsed));
              }
            } catch (e) {}
          }
        });

      // 3. Connect Socket.IO for real-time chat
      const socket = getSocket();
      if (socket) {
        socket.emit('joinRoom', { roomId: 'general_support' });

        const handleNewMessage = (newMsg: ChatMessage) => {
          setMessages((prev) => {
            // Already present by primary ID
            if (prev.some((m) => m.id === newMsg.id)) return prev;

            // Replace optimistic local message with confirmed database record
            if (newMsg.localId) {
              const idx = prev.findIndex((m) => m.id === newMsg.localId || m.localId === newMsg.localId);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = newMsg;
                return dedupeMessages(updated);
              }
            }

            // Fallback match for recent optimistic message by text and sender
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

          // Play notification chime for incoming messages from the other side
          if (newMsg.sender === 'admin' || (user?.role === 'admin' && newMsg.sender === 'customer')) {
            playChime();
          }
        };

        const handleTypingEvent = (data: { isTyping: boolean; sender: string }) => {
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
  }, []);

  // Save to LocalStorage as cache
  useEffect(() => {
    try {
      localStorage.setItem('product_perks_catalog_v4', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('product_perks_messages_v1', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

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
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://productperks.com';
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
      socket.emit('typing', {
        isTyping: typingState,
        sender: user?.role === 'admin' ? 'admin' : 'customer',
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

  const sendAdminReply = (text: string, image?: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localId = `msg-${Date.now()}`;
    const senderName = user?.name || 'ProductPerks Admin';
    const newMsg: ChatMessage = {
      id: localId,
      localId,
      sender: 'admin',
      senderName,
      text,
      image,
      timestamp: timeNow,
      read: true,
      userId: user?.id,
    };
    setMessages((prev) => dedupeMessages([...prev, newMsg]));

    const payload = {
      sender: 'admin' as const,
      senderName,
      text,
      image,
      userId: user?.id,
      localId,
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
