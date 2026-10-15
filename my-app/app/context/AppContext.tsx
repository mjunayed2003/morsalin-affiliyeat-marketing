'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES } from '../data/initialProducts';
import { getSocket, API_BASE_URL } from '@/lib/socket';

interface AppContextType {
  products: Product[];
  messages: ChatMessage[];
  unreadCount: number;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
      if (token) {
        fetch(`${API_BASE_URL}/chat/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) return res.json();
            return null;
          })
          .then((data) => {
            if (Array.isArray(data)) {
              setMessages(data);
              localStorage.setItem('product_perks_messages_v1', JSON.stringify(data));
            }
          })
          .catch(() => {});
      } else {
        const storedMsgs = localStorage.getItem('product_perks_messages_v1');
        if (storedMsgs) {
          try {
            setMessages(JSON.parse(storedMsgs));
          } catch (e) {}
        }
      }

      // 3. Connect Socket.IO for real-time chat
      const socket = getSocket();
      if (socket) {
        socket.emit('joinRoom', { roomId: 'general_support' });

        const handleNewMessage = (newMsg: ChatMessage) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          playChime();
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
          socket.off('newMessage', handleNewMessage);
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

  const sendCustomerMessage = (
    text: string, 
    image?: string, 
    productInfo?: { title: string; price: number; image: string }
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: localId,
      sender: 'customer',
      text,
      image,
      productInfo,
      timestamp: timeNow,
      read: true
    };
    setMessages((prev) => [...prev, newMsg]);
    playChime();

    // Emit in real-time via Socket.IO
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('sendMessage', {
        sender: 'customer',
        text,
        image,
        productInfo,
      });
    } else {
      // Fallback via REST API with Auth
      fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sender: 'customer',
          text,
          image,
          productInfo,
        }),
      })
        .then((res) => res.json())
        .then((saved) => {
          if (saved && saved.id) {
            setMessages((prev) => prev.map((m) => (m.id === localId ? saved : m)));
          }
        })
        .catch(() => {});
    }
  };

  const sendAdminReply = (text: string, image?: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      image,
      timestamp: timeNow,
      read: true
    };
    setMessages((prev) => [...prev, newMsg]);
    playChime();

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('sendMessage', {
        sender: 'admin',
        text,
        image,
      });
    } else {
      fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sender: 'admin',
          text,
          image,
        }),
      }).catch(() => {});
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
