'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES } from '../data/initialProducts';

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeShareProduct, setActiveShareProduct] = useState<Product | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // Clear legacy storage keys if present
      localStorage.removeItem('product_perks_catalog_v1');
      localStorage.removeItem('product_perks_catalog_v2');
      localStorage.removeItem('product_perks_catalog_v3');

      const storedProds = localStorage.getItem('product_perks_catalog_v4');
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep only Amazon products (or admin-added products with amazonUrl)
          const validAmazonProds = parsed.filter(
            (item: Product) => item.amazonUrl || INITIAL_PRODUCTS.some((ip) => ip.id === item.id)
          );

          // Update them with latest official images and metadata from INITIAL_PRODUCTS
          const updated = validAmazonProds.map((item: Product) => {
            const init = INITIAL_PRODUCTS.find((p) => p.id === item.id);
            if (init) {
              return {
                ...item,
                image: init.image,
                gallery: init.gallery,
                store: init.store,
                amazonUrl: init.amazonUrl,
                title: init.title,
                description: init.description,
                features: init.features,
                rating: init.rating,
                reviewsCount: init.reviewsCount
              };
            }
            return item;
          });

          const existingIds = new Set(updated.map((p: Product) => p.id));
          const missingNew = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          const finalProds = [...missingNew, ...updated];
          setProducts(finalProds);
          localStorage.setItem('product_perks_catalog_v4', JSON.stringify(finalProds));
        } else {
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem('product_perks_catalog_v4', JSON.stringify(INITIAL_PRODUCTS));
        }
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('product_perks_catalog_v4', JSON.stringify(INITIAL_PRODUCTS));
      }
      const storedMsgs = localStorage.getItem('product_perks_messages_v1');
      if (storedMsgs) {
        setMessages(JSON.parse(storedMsgs));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save to LocalStorage
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
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text,
      image,
      productInfo,
      timestamp: timeNow,
      read: true
    };
    setMessages((prev) => [...prev, newMsg]);
    playChime();

    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'admin',
        text: 'Hello! I received your inquiry and photo. I am reviewing the item details now and will get back to you immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages((prev) => [...prev, autoReply]);
      playChime();
    }, 1500);
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
  };

  const clearMessages = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
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
        getProductById
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
