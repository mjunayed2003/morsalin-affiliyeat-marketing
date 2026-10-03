'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShareModal } from './components/ShareModal';
import { ChatWidget } from './components/ChatWidget';
import { AdminPanel } from './components/AdminPanel';
import { ClientSharedView } from './components/ClientSharedView';
import { NotificationToast } from './components/NotificationToast';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES } from './data/initialProducts';
import { Product, ChatMessage, ViewMode } from './types';
import { 
  FaBagShopping, 
  FaTags, 
  FaComments, 
  FaShareNodes, 
  FaTruckFast, 
  FaShieldHalved,
  FaArrowRight,
  FaUserTie,
  FaImage,
  FaPlus
} from 'react-icons/fa6';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  // Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  
  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  
  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active Client Shared Product (When client visits ?client=prod-id)
  const [clientProduct, setClientProduct] = useState<Product | null>(null);

  // Modals & Triggers
  const [activeShareProduct, setActiveShareProduct] = useState<Product | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  
  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize from LocalStorage & check URL parameters
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('affilihub_products_v2');
      let loadedProducts = INITIAL_PRODUCTS;
      if (storedProducts) {
        loadedProducts = JSON.parse(storedProducts);
        setProducts(loadedProducts);
      }
      const storedMessages = localStorage.getItem('affilihub_messages_v2');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }

      // Check if URL has ?client=id or ?share=id or ?product=id
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedId = urlParams.get('client') || urlParams.get('share') || urlParams.get('product');
        if (sharedId) {
          const match = loadedProducts.find((p) => p.id === sharedId);
          if (match) {
            setClientProduct(match);
            setViewMode('client');
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage/URL access error:', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('affilihub_products_v2', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('affilihub_messages_v2', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Play soft audio chime on new message
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

  // Customer / Client Sends Message
  const handleCustomerSendMessage = (
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

    // Friendly auto-reply simulation
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'admin',
        text: 'Hello! I have received your message and photo. I am reviewing the details now and will get back to you immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages((prev) => [...prev, autoReply]);
      playChime();
    }, 1500);
  };

  // Admin Sends Message from Studio
  const handleAdminReply = (text: string, image?: string) => {
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

  // Inquiry Button clicked on Product Card
  const handleInquireProduct = (product: Product) => {
    setInquiryProduct(product);
    setIsChatOpen(true);
  };

  // Open Exclusive Client View
  const handleOpenClientView = (product: Product) => {
    setClientProduct(product);
    setViewMode('client');
    // Update URL history without page reload
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `?client=${product.id}`);
    }
  };

  // Copy Product Client Share Link
  const handleCopyClientLink = (product: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://affilihub.com';
    const link = `${origin}?client=${product.id}&ref=${product.affiliateCode || 'direct'}`;
    navigator.clipboard.writeText(link);
    setCopiedId(product.id);
    showToast(`Private client link copied for "${product.title.slice(0, 22)}..."`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Admin Product Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed.');
  };

  const handleResetProducts = () => {
    if (confirm('Reset catalog to default items?')) {
      setProducts(INITIAL_PRODUCTS);
      showToast('Demo catalog restored.');
    }
  };

  const handleClearMessages = () => {
    if (confirm('Clear all chat messages?')) {
      setMessages(INITIAL_CHAT_MESSAGES);
      showToast('Chat history cleared.');
    }
  };

  // Categories List
  const categories = [
    'All',
    'Smart Gadgets',
    'Mobile Accessories',
    'Fashion & Lifestyle',
    'Lifestyle',
    'Electronics'
  ];

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.sender === 'admin' && !m.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* 
        CASE 1: DEDICATED CLIENT VIEW (Only You and the Client see the shared image & 1-on-1 chat)
      */}
      {viewMode === 'client' && clientProduct ? (
        <ClientSharedView
          product={clientProduct}
          messages={messages}
          onSendMessage={handleCustomerSendMessage}
          onBackToOverview={() => {
            setViewMode('store');
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', window.location.pathname);
            }
          }}
          onOpenAdmin={() => setViewMode('admin')}
        />
      ) : (
        /* STANDARD WORKSPACE HEADER */
        <>
          <Navbar
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            unreadCount={unreadCount}
            openChat={() => setIsChatOpen(true)}
            productsCount={products.length}
          />

          {/* 
            CASE 2: OWNER ADMIN STUDIO (Manage products, upload images, reply to clients)
          */}
          {viewMode === 'admin' ? (
            <AdminPanel
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetProducts={handleResetProducts}
              messages={messages}
              onAdminReply={handleAdminReply}
              onClearMessages={handleClearMessages}
              onOpenShareModal={(prod) => setActiveShareProduct(prod)}
              onShowToast={showToast}
              onCloseAdmin={() => setViewMode('store')}
            />
          ) : (
            /* 
              CASE 3: PERSONAL OVERVIEW CATALOG (Your personal collection ready to share to clients)
            */
            <main className="flex-1 pb-16">
              
              {/* Personal Studio Hero Banner */}
              <div className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Hero Text */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold">
                        <FaUserTie className="w-3.5 h-3.5 text-blue-300" />
                        <span>Private Client Sharing & 1-on-1 Order Desk</span>
                      </div>

                      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                        Upload Image, Share to Client & <span className="text-amber-400">Preview on Messenger</span>
                      </h1>

                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                        A private platform built exclusively for <strong className="text-white">you and your client</strong>. When you send a product link on Messenger, your client sees the exact shared photo in high resolution, deal price, and can message you directly with photos or order requests.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setViewMode('admin')}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                        >
                          <FaPlus className="w-3.5 h-3.5" />
                          <span>Upload New Item for Client</span>
                        </button>

                        {products.length > 0 && (
                          <button
                            onClick={() => handleOpenClientView(products[0])}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
                          >
                            <FaImage className="w-3.5 h-3.5 text-sky-400" />
                            <span>Preview Client Landing Screen</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right Hero Info Card */}
                    <div className="lg:col-span-5">
                      <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <FaFacebookMessenger className="w-4 h-4 text-sky-400" />
                            How Your Client Experiences It
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                            Private & Focused
                          </span>
                        </div>

                        <div className="space-y-3 text-xs text-slate-300">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              1
                            </span>
                            <p>You upload or select a product photo in your <span className="text-white font-semibold">Owner Studio</span>.</p>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              2
                            </span>
                            <p>You share the link on Messenger — Messenger renders the <span className="text-amber-300 font-semibold">photo preview thumbnail</span>.</p>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              3
                            </span>
                            <p>Client clicks the link to see <span className="text-emerald-400 font-semibold">ONLY that shared image</span> with direct private chat and WhatsApp order buttons.</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <span>✓ 100% Private 1-on-1 Experience</span>
                          <button 
                            onClick={() => setViewMode('admin')} 
                            className="text-amber-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <span>Manage in Studio</span>
                            <FaArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Trust Guarantees Bar */}
              <div className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700">
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                      <FaTruckFast className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Cash on Delivery Available</span>
                    </div>
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                      <FaShieldHalved className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">100% Genuine Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                      <FaTags className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold">Special Client Pricing</span>
                    </div>
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                      <FaComments className="w-4 h-4 text-sky-600" />
                      <span className="font-semibold">Direct 1-on-1 Messaging</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Catalog Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* Header & Categories */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <FaBagShopping className="w-5 h-5 text-blue-600" />
                      <span>Your Curated Client Collection</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {filteredProducts.length} Items
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Click "Client View" to preview the client screen, or "Share Preview" to send via Messenger
                    </p>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                    <FaBagShopping className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-800">
                      No matching items found
                    </h3>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onOpenDetail={(p) => setActiveDetailProduct(p)}
                        onOpenShare={(p) => setActiveShareProduct(p)}
                        onInquire={(p) => handleInquireProduct(p)}
                        onCopyLink={(p) => handleCopyClientLink(p)}
                        onOpenClientView={(p) => handleOpenClientView(p)}
                        copiedId={copiedId}
                      />
                    ))}
                  </div>
                )}

              </div>

            </main>
          )}

          {/* Product Detail Modal */}
          <ProductDetailModal
            product={activeDetailProduct}
            isOpen={!!activeDetailProduct}
            onClose={() => setActiveDetailProduct(null)}
            onInquire={(p) => {
              setActiveDetailProduct(null);
              handleInquireProduct(p);
            }}
            onOpenShare={(p) => {
              setActiveDetailProduct(null);
              setActiveShareProduct(p);
            }}
          />

          {/* Share to Messenger & Image Modal */}
          <ShareModal
            product={activeShareProduct}
            isOpen={!!activeShareProduct}
            onClose={() => setActiveShareProduct(null)}
            onShowToast={showToast}
          />

          {/* Built-in Customer & Admin Chat Widget */}
          <ChatWidget
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            onOpen={() => setIsChatOpen(true)}
            messages={messages}
            onSendMessage={handleCustomerSendMessage}
            inquiryProduct={inquiryProduct}
            onClearInquiryProduct={() => setInquiryProduct(null)}
            onSwitchToAdmin={() => {
              setIsChatOpen(false);
              setViewMode('admin');
            }}
          />

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <FaBagShopping className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-200 text-sm">PersonalDesk</span>
                <span>• Private Client Showcase & Messenger Direct Share</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
                  className="text-amber-400 hover:underline cursor-pointer font-semibold"
                >
                  {viewMode === 'store' ? 'Owner Studio' : 'Client Overview'}
                </button>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Notification Toast */}
      <NotificationToast message={toastMessage} />

    </div>
  );
}
