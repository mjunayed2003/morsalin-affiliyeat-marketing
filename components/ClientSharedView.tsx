'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  FaCircleCheck, 
  FaArrowLeft,
  FaShareNodes,
  FaExpand
} from 'react-icons/fa6';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Product, ChatMessage } from '../app/types';

interface ClientSharedViewProps {
  product: Product;
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string, productInfo?: { title: string; price: number; image: string }) => void;
  onBackToOverview: () => void;
  onOpenAdmin: () => void;
}

export const ClientSharedView: React.FC<ClientSharedViewProps> = ({
  product,
  messages,
  onSendMessage,
  onBackToOverview,
  onOpenAdmin
}) => {
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

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    onSendMessage(
      inputText.trim() || `I want to order this: ${product.title}`,
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

  // WhatsApp order link
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hello! I want to order this item: ${product.title} (Price: ৳${product.price})\nLink: ${currentUrl}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Zoom Lightbox for Main Shared Image */}
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
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl"
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
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Dedicated Client Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToOverview}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Recommended Items</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Exclusive Client Showcase
              </span>
              <p className="text-[10px] text-slate-500">Shared directly with you</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-slate-500 hover:text-blue-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors font-medium cursor-pointer"
              title="Admin access"
            >
              Owner Studio
            </button>
          </div>
        </div>
      </header>

      {/* Main Client Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Notice Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FaBagShopping className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Special Offer Shared Specifically For You</p>
              <p className="text-blue-700 text-xs">
                Inspect the product image below and message directly to confirm price, color, or delivery.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 2-Column Product Showcase & Direct Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: The Featured Shared Image & Product Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Main Shared Image (Centerpiece) */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-4">
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer" onClick={() => setIsZoomOpen(true)}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                      {product.badge}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
                      -{discountPercent}% Special Deal
                    </span>
                  )}
                </div>

                {/* Click to Zoom indicator */}
                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-medium px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs opacity-90 group-hover:opacity-100">
                  <FaExpand className="w-3 h-3" />
                  <span>Click to Zoom</span>
                </div>
              </div>

              {/* Title & Price Row */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span className="text-emerald-600">Verified Stock Available</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h1>

                {/* Pricing Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-950">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                    Client Discount Applied
                  </span>
                </div>
              </div>

              {/* Product Overview */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Overview:
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
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
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
                  <FaTruckFast className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500">Check before pay</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
                  <FaShieldHalved className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">100% Genuine</span>
                  <span className="text-[10px] text-slate-500">Brand new sealed</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
                  <FaClock className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-slate-800">Fast Shipping</span>
                  <span className="text-[10px] text-slate-500">24-48 Hours</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Direct Private 1-on-1 Chat Desk (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
              
              {/* Chat Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      <FaComments className="w-4 h-4" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">
                      Direct Private Inquiry Desk
                    </h3>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Chat with Seller (Live)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-emerald-400 hover:text-emerald-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                    title="Open in WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product Context Chip */}
              <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2.5 shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded-lg border border-amber-300 shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-slate-900 truncate">{product.title}</p>
                  <p className="text-blue-700 font-bold">৳{product.price.toLocaleString()}</p>
                </div>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-md shrink-0">
                  Shared Item
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
                      <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-medium">
                        {isCustomer ? 'You' : 'Seller (Admin)'}
                      </span>

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-xs ${
                          isCustomer
                            ? 'bg-blue-600 text-white rounded-br-xs'
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
                            <p className="text-[10px] mt-1 opacity-80 text-center">
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
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
                <button
                  onClick={() => onSendMessage(`I want to order "${product.title}" with Cash on Delivery.`)}
                  className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Order with Cash on Delivery
                </button>
                <button
                  onClick={() => onSendMessage(`What colors or variants are available for ${product.title}?`)}
                  className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Available Colors?
                </button>
              </div>

              {/* Attached Image Preview Before Sending */}
              {selectedImage && (
                <div className="p-2 bg-blue-50 border-t border-blue-200 flex items-center gap-2 shrink-0">
                  <img
                    src={selectedImage}
                    alt="Client upload"
                    className="w-10 h-10 object-cover rounded-lg border border-blue-300"
                  />
                  <span className="text-xs text-blue-900 font-medium flex-1">
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

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer shrink-0"
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
                  className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImage}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
                  title="Send to Seller"
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
