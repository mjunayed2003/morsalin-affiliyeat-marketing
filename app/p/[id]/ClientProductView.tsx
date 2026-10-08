'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/app/context/AppContext';
import { 
  FaBagShopping, 
  FaTags, 
  FaTruckFast, 
  FaShieldHalved, 
  FaClock, 
  FaComments, 
  FaPaperPlane, 
  FaImage, 
  FaCheck, 
  FaExpand,
  FaCircleCheck,
  FaLock,
  FaArrowUpRightFromSquare
} from 'react-icons/fa6';
import { FaWhatsapp, FaAmazon, FaStore } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface ClientProductViewProps {
  productId: string;
}

export const ClientProductView: React.FC<ClientProductViewProps> = ({ productId }) => {
  const { getProductById, messages, sendCustomerMessage } = useApp();
  const product = getProductById(productId);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [previewChatImage, setPreviewChatImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-200 text-slate-500 flex items-center justify-center mb-4">
          <FaLock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Private Link Not Found</h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6">
          This shared link may have expired or was removed by the admin. Please request a new link from the admin.
        </p>
        <Link
          href="/"
          className="bg-[#0d5bff] hover:bg-[#0045d8] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          Return to Portal
        </Link>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    sendCustomerMessage(
      inputText.trim() || `I want to order: ${product.title}`,
      selectedImage || undefined,
      {
        title: product.title,
        price: product.price,
        image: product.image
      }
    );

    setInputText('');
    setSelectedImage(null);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hello! I want to order this item: ${product.title} (Price: $${product.price})\nProduct Link: ${currentUrl}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 selection:bg-[#ccff00] selection:text-slate-950">
      
      {/* Zoom Lightbox for Main Product Image */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
            >
              <FiX className="w-6 h-6" />
            </button>
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[85vh] w-auto object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Lightbox for zooming attached chat images */}
      {previewChatImage && (
        <div 
          onClick={() => setPreviewChatImage(null)}
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh]">
            <button
              onClick={() => setPreviewChatImage(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800 p-2 rounded-full cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={previewChatImage}
              alt="Zoomed Attachment"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Dedicated Client Header (ByteSpace Styling) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0d5bff] text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <FaBagShopping className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] ring-2 ring-slate-900 animate-pulse"></span>
                Private Client Showcase
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Shared directly with you by Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#0d5bff] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-bold cursor-pointer"
            >
              ← Back to Store
            </Link>
            <Link
              href="/admin"
              className="text-xs text-slate-600 hover:text-[#0d5bff] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-bold cursor-pointer"
              title="Admin access"
            >
              Admin Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Client Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Notice Banner (ByteSpace Cobalt Blue with Lime Accent) */}
        <div className="bg-[#0d5bff] text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-blue-600/15">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ccff00] text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md">
              <FaBagShopping className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-base sm:text-lg text-white">Private Product Shared For You</p>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">
                {product.store && <span className="font-bold text-[#ccff00]">Store: {product.store} • </span>}
                Review the product details and chat live with the admin below to order or ask questions.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {product.amazonUrl && (
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#ea8b00] text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer border border-[#e08500]"
              >
                <FaAmazon className="w-4 h-4 text-slate-950" />
                <span>Buy on Amazon</span>
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4 text-emerald-800" />
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 2-Column Product Showcase & Live Chat Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Product Image & Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Main Shared Image (Centerpiece) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div 
                className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer" 
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Badges (ByteSpace Electric Lime) */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="bg-slate-950/90 text-white text-xs font-black px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                      {product.badge}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-[#ccff00] text-slate-950 text-xs font-black px-3 py-0.5 rounded-full shadow-md">
                      -{discountPercent}% Special Deal
                    </span>
                  )}
                </div>

                {/* Click to Zoom indicator */}
                <div className="absolute bottom-3 right-3 bg-slate-950/80 text-[#ccff00] text-xs font-bold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs opacity-90 group-hover:opacity-100">
                  <FaExpand className="w-3 h-3 text-[#ccff00]" />
                  <span>Click to Zoom</span>
                </div>
              </div>

              {/* Title & Price Row */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{product.category}</span>
                  {product.store && (
                    <>
                      <span>•</span>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 normal-case">
                        <FaStore className="w-3 h-3 text-amber-700" />
                        Store: {product.store}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Verified In-Stock</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug">
                  {product.title}
                </h1>

                {/* Pricing Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-950">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base text-slate-400 line-through font-semibold">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="ml-auto text-xs bg-[#ccff00] text-slate-950 font-black px-3 py-1 rounded-lg">
                      Special Offer
                    </span>
                  </div>

                  {product.amazonUrl && (
                    <div className="pt-2 border-t border-slate-200">
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 w-full bg-[#ff9900] hover:bg-[#ea8b00] active:scale-[0.99] text-slate-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-[#e08500]"
                      >
                        <FaAmazon className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>Order Directly on Amazon ({product.store || 'Amazon Store'})</span>
                        <FaArrowUpRightFromSquare className="w-3.5 h-3.5 opacity-80 shrink-0" />
                      </a>
                      <p className="text-[11px] text-slate-500 text-center mt-1 font-medium">
                        Fulfilled via Amazon with Prime shipping & return guarantee
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Overview */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Overview:
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Specifications:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                      <FaCheck className="w-3.5 h-3.5 text-[#0d5bff] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs font-semibold">
                <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl">
                  <FaTruckFast className="w-4 h-4 text-[#0d5bff]" />
                  <span className="text-slate-800">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500 font-normal">Check before pay</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl">
                  <FaShieldHalved className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-800">100% Genuine</span>
                  <span className="text-[10px] text-slate-500 font-normal">Brand new sealed</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl">
                  <FaClock className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-800">Fast Shipping</span>
                  <span className="text-[10px] text-slate-500 font-normal">Nationwide</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Chat with Admin + Image Upload (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
              
              {/* Chat Header (ByteSpace Cobalt Blue) */}
              <div className="bg-[#0d5bff] text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-[#0045d8] flex items-center justify-center font-bold text-white text-sm">
                      <FaComments className="w-4 h-4" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ccff00] rounded-full border-2 border-[#0d5bff]"></span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm leading-tight">
                      Live Chat with Admin
                    </h3>
                    <p className="text-[11px] text-blue-100 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span>
                      Admin Online • Instant Replies
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-950 bg-[#ccff00] hover:bg-[#b8e600] rounded-xl transition-colors shadow-xs"
                    title="Open in WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product Reference Bar */}
              <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2.5 shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded-lg border border-blue-200 shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs font-semibold">
                  <p className="font-bold text-slate-900 truncate">{product.title}</p>
                  <p className="text-[#0d5bff] font-black">${product.price.toLocaleString()}</p>
                </div>
                <span className="text-[10px] bg-[#ccff00] text-slate-950 font-black px-2 py-0.5 rounded-md shrink-0">
                  Live Product
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 custom-scrollbar">
                {messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-semibold">
                        {isCustomer ? 'You (Client)' : 'Admin'}
                      </span>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs font-medium ${
                          isCustomer
                            ? 'bg-[#0d5bff] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                        }`}
                      >
                        {msg.image && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                            <img
                              src={msg.image}
                              alt="Attachment"
                              onClick={() => setPreviewChatImage(msg.image || null)}
                              className="max-h-44 w-auto object-cover rounded-lg cursor-pointer hover:opacity-95"
                            />
                            <p className="text-[10px] mt-1 opacity-80 text-center font-bold">
                              (Click to zoom)
                            </p>
                          </div>
                        )}

                        {msg.text && (
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt suggestions for client */}
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar font-semibold">
                <button
                  onClick={() => sendCustomerMessage(`I want to order "${product.title}" with Cash on Delivery.`)}
                  className="shrink-0 bg-slate-100 hover:bg-[#ccff00] hover:text-slate-950 text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Order with Cash on Delivery
                </button>
                <button
                  onClick={() => sendCustomerMessage(`What colors or options are available for ${product.title}?`)}
                  className="shrink-0 bg-slate-100 hover:bg-[#ccff00] hover:text-slate-950 text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Available Colors?
                </button>
              </div>

              {/* Attached Image Preview Before Sending */}
              {selectedImage && (
                <div className="p-2.5 bg-blue-50 border-t border-blue-200 flex items-center gap-2 shrink-0">
                  <img
                    src={selectedImage}
                    alt="Client upload"
                    className="w-11 h-11 object-cover rounded-lg border border-blue-300"
                  />
                  <span className="text-xs text-blue-900 font-bold flex-1">
                    Photo attached. Ready to send.
                  </span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-md cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input Form with Image Attachment Button */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-[#0d5bff] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Attach screenshot or photo"
                >
                  <FaImage className="w-4 h-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                <input
                  type="text"
                  placeholder="Type message or delivery address..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] placeholder:text-slate-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImage}
                  className="p-2.5 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-40 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
                  title="Send to Admin"
                >
                  <FaPaperPlane className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
