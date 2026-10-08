'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { 
  FaStar,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaComments,
  FaPaperPlane,
  FaImage,
  FaExpand,
  FaShieldHalved,
  FaAward,
  FaBoxOpen,
  FaLocationDot,
  FaArrowUpRightFromSquare,
  FaTag
} from 'react-icons/fa6';
import { FaWhatsapp, FaAmazon, FaStore } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface ClientProductViewProps {
  productId: string;
}

// Pastel category badges map
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  'Skincare': { bg: 'bg-[#faebe6]', text: 'text-[#b85d43]' },
  'Tech': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Food & Beverage': { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
  'Home': { bg: 'bg-[#e0f2fe]', text: 'text-[#075985]' },
  'Lifestyle': { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]' },
  'Accessories': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]' },
  'Smart Gadgets': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Mobile Accessories': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Electronics': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Fashion & Lifestyle': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Pet Supplies': { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]' },
  'Home & Garden': { bg: 'bg-[#f0fdfa]', text: 'text-[#115e59]' },
  'Beauty & Personal Care': { bg: 'bg-[#fff1f2]', text: 'text-[#9f1239]' },
};

export const ClientProductView: React.FC<ClientProductViewProps> = ({ productId }) => {
  const { getProductById, messages, sendCustomerMessage } = useApp();
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const product = getProductById(productId);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previewChatImage, setPreviewChatImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset active image when productId changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [productId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50/40 text-slate-900 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center p-6 text-center my-16">
          <div className="w-16 h-16 rounded-3xl bg-stone-200 text-stone-600 flex items-center justify-center mb-4">
            <FaBoxOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-600 max-w-sm mb-6">
            The requested product may have expired or was removed from the catalog.
          </p>
          <Link
            href="/"
            className="bg-[#1b3b2b] hover:bg-[#142e20] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            ← Return to Home Catalog
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [product.image];
  const currentDisplayImage = galleryImages[activeImageIndex] || product.image;

  const badgeStyle = CATEGORY_STYLES[product.category] || { 
    bg: 'bg-stone-100', 
    text: 'text-stone-700' 
  };

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
    `Hello! I am inquiring about: ${product.title} (Price: $${product.price})\nStore: ${product.store || 'ProductPerks'}\nProduct Page: ${currentUrl}`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/40 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans">
      
      {/* Top Main Navbar */}
      <Navbar />

      {/* Auth Modal for account actions */}
      <AuthModal />

      {/* Lightbox for zooming main product image */}
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
              src={currentDisplayImage}
              alt={product.title}
              className="max-h-[85vh] w-auto object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Lightbox for chat attachment zoom */}
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <FaArrowLeft className="w-3 h-3" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {product.store && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                <FaStore className="w-3 h-3 text-amber-600" />
                <span>Store: {product.store}</span>
              </span>
            )}
            <span className="bg-white border border-stone-200/80 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 shadow-2xs">
              ID: {product.id}
            </span>
          </div>
        </div>

        {/* 2-Column Product Showcase & Live Messaging Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Product Showcase & Overview (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Product Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-2xs space-y-5">
              
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden bg-[#f8f7f4] group cursor-pointer border border-stone-100 flex items-center justify-center" 
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={currentDisplayImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />

                {/* Badge Pills in Top Left */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <span className="bg-[#1b3b2b] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                    <span>Amazon Review Perk</span>
                  </span>
                </div>

                {/* Click to Zoom indicator */}
                <div className="absolute bottom-3.5 right-3.5 bg-slate-900/80 text-white text-xs font-semibold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                  <FaExpand className="w-3 h-3 text-stone-200" />
                  <span>Click to Zoom</span>
                </div>
              </div>

              {/* Multi-angle Gallery Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Product Photos ({galleryImages.length} angles):
                  </p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-[#f8f7f4] ${
                          activeImageIndex === idx
                            ? 'border-[#1b3b2b] ring-2 ring-[#1b3b2b]/30 shadow-xs scale-102'
                            : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Category Row */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${badgeStyle.bg} ${badgeStyle.text}`}>
                    {product.category}
                  </span>
                  {product.store && (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <FaStore className="w-3 h-3 text-amber-600" />
                      <span>Store: {product.store}</span>
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs ml-auto">
                    <FaStar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug tracking-tight">
                  {product.title}
                </h1>

                {/* Pricing & Free Review Card */}
                <div className="p-4 sm:p-5 bg-[#fafaf8] rounded-2xl border border-stone-200/80 space-y-3.5">
                  <div className="flex flex-wrap items-baseline gap-3">
                    {product.price === 0 ? (
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#1b3b2b]">
                        FREE
                      </span>
                    ) : (
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                        ${product.price.toLocaleString()}
                      </span>
                    )}
                    {product.originalPrice > 0 && (
                      <span className="text-base text-slate-400 line-through font-semibold">
                        Est. Amazon Retail: ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                      <span>100% Free Amazon Review Perk</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Test this product at zero cost, share your honest review on Amazon, and keep the item forever.
                  </p>

                  {/* Amazon & WhatsApp Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {product.amazonUrl && (
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#ff9900] hover:bg-[#eb8c00] active:scale-98 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer border border-[#e08500]"
                      >
                        <FaAmazon className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>View on Amazon ({product.store || 'Store'})</span>
                        <FaArrowUpRightFromSquare className="w-3 h-3 opacity-75 shrink-0" />
                      </a>
                    )}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white hover:bg-stone-100 border border-stone-300 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                    >
                      <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Order</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Product Overview Section */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Key Features & Specifications */}
              <div className="pt-3 border-t border-stone-100 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Specifications & Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-[#fafaf8] p-3 rounded-xl border border-stone-200/70 font-medium">
                      <FaCheck className="w-3.5 h-3.5 text-[#1b3b2b] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 Value Propositions (matching Home Page aesthetic) */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaBoxOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Free Product</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">No hidden fee</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaShieldHalved className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">100% Genuine</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Original sealed</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaAward className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Keep & Review</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Real rewards</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaLocationDot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">USA Based</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Fast shipping</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Chat with Admin / Concierge Desk (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col h-[650px]">
              
              {/* Chat Header in Forest Green Brand Style */}
              <div className="bg-[#1b3b2b] text-white p-4.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#264e3b] flex items-center justify-center font-bold text-white text-sm">
                      <FaComments className="w-4 h-4 text-emerald-300" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1b3b2b] animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">
                      Live Chat with Admin
                    </h3>
                    <p className="text-[11px] text-emerald-200 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Support Online • Message Anytime
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-900/60 hover:bg-emerald-800 text-white rounded-xl transition-colors shadow-xs"
                    title="Open in WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4 text-emerald-300" />
                  </a>
                </div>
              </div>

              {/* Product Reference Bar */}
              <div className="p-3 bg-[#fafaf8] border-b border-stone-200/80 flex items-center gap-2.5 shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs font-semibold">
                  <p className="font-bold text-slate-900 truncate">{product.title}</p>
                  <p className="text-[#1b3b2b] font-bold">
                    {product.price === 0 ? 'FREE Member Perk' : `$${product.price}`}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                  Active Item
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfbfa] custom-scrollbar">
                {messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-semibold">
                        {isCustomer ? 'You (Client)' : 'Admin Support'}
                      </span>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs font-medium ${
                          isCustomer
                            ? 'bg-[#1b3b2b] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-stone-200/90'
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
                            <p className="text-[10px] mt-1 opacity-80 text-center font-semibold">
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

                      <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-medium">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt suggestions for client */}
              <div className="px-3 py-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar font-medium">
                <button
                  onClick={() => sendCustomerMessage(`Hello! I want to apply to test & review "${product.title}" on Amazon.`)}
                  className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  I want to test & review this on Amazon
                </button>
                <button
                  onClick={() => sendCustomerMessage(`How does Amazon Prime shipping and review verification work for ${product.title}?`)}
                  className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Amazon Prime delivery question?
                </button>
                <button
                  onClick={() => sendCustomerMessage(`Can you provide the Amazon store link and instructions for ${product.title}?`)}
                  className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Get Amazon store link
                </button>
              </div>

              {/* Attached Image Preview Before Sending */}
              {selectedImage && (
                <div className="p-2.5 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 shrink-0">
                  <img
                    src={selectedImage}
                    alt="Upload preview"
                    className="w-11 h-11 object-cover rounded-lg border border-emerald-300"
                  />
                  <span className="text-xs text-emerald-900 font-bold flex-1">
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
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-[#1b3b2b] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
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
                  placeholder="Type a message to admin..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#fafaf8] text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] placeholder:text-slate-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImage}
                  className="p-2.5 bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                  title="Send message"
                >
                  <FaPaperPlane className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </main>

      {/* Footer (matching Home Page) */}
      <footer className="bg-white border-t border-stone-200/80 py-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ProductPerks. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 font-semibold">Home</Link>
            <Link href="/products" className="hover:text-slate-900 font-semibold">Products</Link>
            <Link href="/#how-it-works" className="hover:text-slate-900 font-semibold">How It Works</Link>
            <Link href="/admin" className="hover:text-slate-900 font-semibold">Admin Studio</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
