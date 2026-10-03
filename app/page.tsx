'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShareModal } from './components/ShareModal';
import { ChatWidget } from './components/ChatWidget';
import { AdminPanel } from './components/AdminPanel';
import { NotificationToast } from './components/NotificationToast';
import { INITIAL_PRODUCTS, INITIAL_CHAT_MESSAGES } from './data/initialProducts';
import { Product, ChatMessage, ViewMode } from './types';
import { 
  FiTag, 
  FiCheckCircle, 
  FiShare2, 
  FiMessageCircle, 
  FiShoppingBag, 
  FiFilter, 
  FiSliders,
  FiZap,
  FiShield,
  FiTruck
} from 'react-icons/fi';
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
  
  // Modals & Triggers
  const [activeShareProduct, setActiveShareProduct] = useState<Product | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  
  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('affilihub_products_v1');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
      const storedMessages = localStorage.getItem('affilihub_messages_v1');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (e) {
      console.warn('LocalStorage access error:', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('affilihub_products_v1', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('affilihub_messages_v1', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Play soft chime on new message
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // Customer Sends Message
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

    // Auto-respond simulation if in store mode
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'admin',
        text: 'ধন্যবাদ আপনার মেসেজের জন্য! আমাদের সেলস টিম আপনার মেসেজটি পেয়েছে। খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হচ্ছে।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages((prev) => [...prev, autoReply]);
      playChime();
    }, 1600);
  };

  // Admin Sends Message from Panel
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

  // Copy Product Affiliate Link
  const handleCopyLink = (product: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://affilihub.com';
    const link = `${origin}?product=${product.id}&ref=${product.affiliateCode || 'affiliate_direct'}`;
    navigator.clipboard.writeText(link);
    setCopiedId(product.id);
    showToast(`"${product.title.slice(0, 24)}..." অ্যাফিলিয়েট লিংক কপি হয়েছে!`);
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
    showToast('প্রোডাক্ট মুছে ফেলা হয়েছে।');
  };

  const handleResetProducts = () => {
    if (confirm('আপনি কি সকল প্রোডাক্ট রিসেট করে আগের ডেমো ক্যাটালগে ফিরতে চান?')) {
      setProducts(INITIAL_PRODUCTS);
      showToast('ডেমো প্রোডাক্টস সফলভাবে রিস্টোর হয়েছে।');
    }
  };

  const handleClearMessages = () => {
    if (confirm('আপনি কি ইনবক্সের সকল চ্যাট মেসেজ ক্লিয়ার করতে চান?')) {
      setMessages(INITIAL_CHAT_MESSAGES);
      showToast('চ্যাট ক্লিয়ার করা হয়েছে।');
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
      
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={unreadCount}
        openChat={() => setIsChatOpen(true)}
        productsCount={products.length}
      />

      {/* Main Content Area */}
      {viewMode === 'admin' ? (
        /* ADMIN PANEL VIEW */
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
        /* CUSTOMER STORE / AFFILIATE SHOWCASE VIEW */
        <main className="flex-1 pb-16">
          
          {/* Hero & Affiliate Value Banner */}
          <div className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Hero Text */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold">
                    <FiTag className="w-3.5 h-3.5" />
                    <span>প্রিমিয়াম অ্যাফিলিয়েট প্রোডাক্ট শোকেস</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    ক্লায়েন্টকে ছবি সহ শেয়ার করুন ও <span className="text-amber-400">ইনস্ট্যান্ট কমিশন</span> আয় করুন
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    প্রতিটি প্রোডাক্টের রয়েছে <strong className="text-white">মেসেঞ্জার প্রিভিউ সাপোর্ট</strong> এবং নিজস্ব ইনবক্স চ্যাট সিস্টেম। ক্লায়েন্টকে লিংক বা ছবি পাঠিয়ে সরাসরি মেসেঞ্জার থেকে অর্ডার গ্রহণ করুন।
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        if (products.length > 0) setActiveShareProduct(products[0]);
                      }}
                      className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      <FaFacebookMessenger className="w-4 h-4" />
                      <span>মেসেঞ্জার শেয়ার প্রিভিউ দেখুন</span>
                    </button>

                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      <FiMessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>ইনবক্স ওপেন করুন</span>
                    </button>
                  </div>
                </div>

                {/* Right Hero Info Card (Messenger Sharing Explanation) */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <FaFacebookMessenger className="w-4 h-4 text-sky-400" />
                        মেসেঞ্জারে লিংক দিলে ছবি কীভাবে দেখায়?
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                        অটো প্রিভিউ
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          ১
                        </span>
                        <p>যেকোনো প্রোডাক্টের <span className="text-white font-medium">"শেয়ার প্রিভিউ"</span> বাটনে চাপ দিন।</p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          ২
                        </span>
                        <p>মেসেঞ্জারে ছবি সহ কার্ড দেখতে পারবেন বা <span className="text-amber-300 font-medium">নিজস্ব কাস্টম ছবি আপলোড</span> করতে পারবেন।</p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          ৩
                        </span>
                        <p>ক্লায়েন্ট মেসেঞ্জারে ক্লিক করলেই ওয়েবসাইটের <span className="text-emerald-400 font-medium">ইনবক্সে ছবি পাঠিয়ে</span> অর্ডার কনফার্ম করতে পারবে।</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>✓ Open Graph মেটা-ট্যাগ ভেরিফাইড</span>
                      <button 
                        onClick={() => setViewMode('admin')} 
                        className="text-amber-400 hover:underline font-semibold cursor-pointer"
                      >
                        অ্যাডমিন মোডে যান &rarr;
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
                  <FiTruck className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">সারাদেশে ক্যাশ অন ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <FiShield className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">১০০% আসল প্রোডাক্টের নিশ্চয়তা</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <FiTag className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">সর্বোচ্চ অ্যাফিলিয়েট কমিশন</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <FiMessageCircle className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold">ওয়েবসাইটে লাইভ চ্যাট সাপোর্ট</span>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog & Filter Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            
            {/* Filter Bar & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FiShoppingBag className="w-5 h-5 text-blue-600" />
                  <span>ট্রেন্ডিং প্রোডাক্ট কালেকশন</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {filteredProducts.length} টি
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  যেকোনো পণ্যের ওপর ক্লিক করে ইনবক্সে ইনকোয়ারি পাঠাতে পারেন বা মেসেঞ্জারে শেয়ার করতে পারেন
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'All' ? 'সকল ক্যাটাগরি' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <FiShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  কোনো প্রোডাক্ট পাওয়া যায়নি
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  আপনার সার্চ কোয়েরি বা ক্যাটাগরি ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  ফিল্টার ক্লিয়ার করুন
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
                    onCopyLink={(p) => handleCopyLink(p)}
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

      {/* Notification Toast */}
      <NotificationToast message={toastMessage} />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <FiShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200 text-sm">AffiliHub</span>
            <span>• প্রিমিয়াম অ্যাফিলিয়েট প্ল্যাটফর্ম ও ডিরেক্ট মেসেজিং</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>মেসেঞ্জার প্রিভিউ ইন্টিগ্রেশন</span>
            <span>•</span>
            <span>রিয়েল-টাইম ইমেজ চ্যাট</span>
            <span>•</span>
            <button
              onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              {viewMode === 'store' ? 'অ্যাডমিন কন্ট্রোল' : 'স্টোর মোড'}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
