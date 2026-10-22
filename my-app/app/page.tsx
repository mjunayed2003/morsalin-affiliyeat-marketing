'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ShareModal } from '@/components/ShareModal';
import { AuthModal } from '@/components/AuthModal';
import { BrandLogo } from '@/components/BrandLogo';
import { AdvertisementBanner } from '@/components/AdvertisementBanner';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { Product } from '@/app/types';
import { FaAmazon, FaStore, FaWhatsapp } from 'react-icons/fa';
import { 
  FaArrowRight, 
  FaCheck, 
  FaStar, 
  FaTruckFast, 
  FaShieldHalved, 
  FaAward,
  FaLocationDot,
  FaUser,
  FaClipboardList,
  FaBoxOpen,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaSliders,
  FaComments,
  FaTelegram,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa6';

// Pastel category badges map
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  'Skincare': { bg: 'bg-[#faebe6]', text: 'text-[#b85d43]' },
  'Tech': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Food & Beverage': { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
  'Home': { bg: 'bg-[#e0f2fe]', text: 'text-[#075985]' },
  'Lifestyle': { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]' },
  'Accessories': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]' },
  'Pet Supplies': { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]' },
  'Home & Garden': { bg: 'bg-[#f0fdfa]', text: 'text-[#115e59]' },
  'Beauty & Personal Care': { bg: 'bg-[#fff1f2]', text: 'text-[#9f1239]' },
};

export default function Home() {
  const router = useRouter();
  const { 
    products, 
    activeDetailProduct, 
    activeShareProduct, 
    openDetailModal, 
    closeDetailModal, 
    closeShareModal, 
    openChatWithProduct, 
    openShareModal,
    showToast,
    settings
  } = useApp();
  
  const { isAuthenticated, openAuthModal } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [directCode, setDirectCode] = useState('');
  const [directError, setDirectError] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Filtered products based on search
  const displayedProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => 
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  // Handle product click -> navigate directly to dedicated product page
  const handleGetItFree = (product: Product) => {
    router.push(`/p/${product.id}`);
  };

  // Direct code lookup
  const handleDirectLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = directCode.trim();
    if (!trimmed) {
      setDirectError('Please enter a product ID or code.');
      return;
    }
    let prodId = trimmed;
    if (prodId.includes('/p/')) {
      prodId = prodId.split('/p/')[1]?.split(/[?#]/)[0] || trimmed;
    }
    const found = products.find((p) => p.id.toLowerCase() === prodId.toLowerCase());
    if (found) {
      setDirectError('');
      setShowCodeModal(false);
      router.push(`/p/${found.id}`);
    } else {
      setShowCodeModal(false);
      router.push(`/p/${prodId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-stone-50/50 via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Headline, Subtitle, CTAs, Badges */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                {/* Eyebrow / Overline */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/90 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-2xs">
                    <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                    <span>Amazon Reviewer Club</span>
                  </span>
                  <span className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                    100% Free Products
                  </span>
                  <span className="inline-flex items-center bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                    Verified Sellers
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-headline text-2xl sm:text-4xl lg:text-[54px] text-slate-900 font-extrabold leading-[1.2] sm:leading-[1.14] tracking-tight">
                  Get Free Products Online.<br className="hidden sm:inline" />{' '}
                  Test Top Amazon Items.<br className="hidden sm:inline" />{' '}
                  <span className="text-[#1b3b2b]">Keep Them 100% Free.</span>
                </h1>

                {/* Paragraph Description */}
                <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                  Looking for free products? Join the FreeProducts.online review club! Test quality items from verified Amazon sellers (LONG YUE, Lickoon, Imps Hair & more). Share your authentic customer feedback and keep every product with zero fees.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      const el = document.getElementById('products');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto justify-center bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Claim Free Products</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="#how-it-works"
                    className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 active:scale-95 text-slate-800 border border-slate-300/90 font-semibold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>How Review Program Works</span>
                  </a>
                </div>

                {/* Value Propositions / Trust Badges (4 Columns) */}
                <div className="pt-5 sm:pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-5">
                  
                  {/* Badge 1: 100% Free Items */}
                  <div className="flex items-start gap-2 sm:gap-2.5 p-2 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 border border-emerald-100">
                      <FaBoxOpen className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">100% Free Items</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">Zero cost to reviewer</p>
                    </div>
                  </div>

                  {/* Badge 2: Verified Amazon Stores */}
                  <div className="flex items-start gap-2 sm:gap-2.5 p-2 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-800 shrink-0 mt-0.5 border border-amber-200/80">
                      <FaAmazon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#e08500]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Verified Sellers</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">LONG YUE & more</p>
                    </div>
                  </div>

                  {/* Badge 3: Keep Forever */}
                  <div className="flex items-start gap-2 sm:gap-2.5 p-2 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <FaAward className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Keep Forever</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">Tested items yours</p>
                    </div>
                  </div>

                  {/* Badge 4: USA Prime Delivery */}
                  <div className="flex items-start gap-2 sm:gap-2.5 p-2 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <FaTruckFast className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Fast US Shipping</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">Amazon Prime</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Aesthetic Lifestyle Image with Cardboard Box & Handwritten Note */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[480px] rounded-3xl overflow-hidden shadow-xl border border-stone-200/60 bg-stone-100">
                  
                  {/* Lifestyle photo of cardboard box on table with plants */}
                  <div className="relative aspect-4/3 sm:aspect-5/4 w-full overflow-hidden bg-stone-100">
                    <img 
                      src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80" 
                      alt="FreeProducts.online Member Delivery Box"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Subtle warm lighting vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />

                    {/* Branded FreeProducts.online stamp badge centered on the box */}
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 bg-[#f4ebe1]/95 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-[#d6c5b3] shadow-md flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#1b3b2b] text-white flex items-center justify-center">
                        <FaAmazon className="w-4 h-4 text-[#ff9900]" />
                      </div>
                      <span className="font-bold text-sm tracking-tight text-slate-900">
                        Amazon<span className="text-[#1b3b2b]">ReviewHub</span>
                      </span>
                    </div>

                  </div>

                  {/* Playful Handwritten Note Badge */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-stone-200/80 -rotate-3 hover:rotate-0 transition-transform">
                    <p className="font-handwriting text-slate-800 text-base sm:text-lg font-bold leading-tight text-center">
                      Honest Reviews<br />
                      <span className="text-[#1b3b2b]">Big Amazon Impact ⭐</span>
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FEATURED PRODUCTS SECTION                                             */}
        {/* ========================================================================= */}
        <section id="products" className="py-14 sm:py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2">
                  <FaAmazon className="w-3 h-3 text-[#e08500]" />
                  <span>Amazon Seller Partners</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Featured Amazon Products
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Active testing campaigns from top verified Amazon sellers. Claim your free unit today!
                </p>
              </div>

              <Link
                href="/products"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View All Amazon Products</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Sponsored Deals / Advertisement Banner */}
            <AdvertisementBanner className="mb-6" />

            {/* Product Cards Grid (2 Columns on mobile, 3 on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
              {displayedProducts.map((prod) => {
                const badgeStyle = CATEGORY_STYLES[prod.category] || { 
                  bg: 'bg-stone-100', 
                  text: 'text-stone-700' 
                };

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-xl sm:rounded-2xl border border-slate-100/90 hover:border-slate-300 p-2.5 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Product Image Link */}
                      <Link 
                        href={`/p/${prod.id}`}
                        className="block relative w-full aspect-4/3 rounded-lg sm:rounded-xl bg-[#f8f7f4] overflow-hidden mb-2 sm:mb-4 cursor-pointer flex items-center justify-center group/img"
                        title={`View ${prod.title}`}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          loading="lazy"
                        />
                      </Link>

                      {/* Category Pill & Store Badge */}
                      <div className="mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <span className={`inline-block px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold ${badgeStyle.bg} ${badgeStyle.text} truncate max-w-[85px] sm:max-w-none`}>
                          {prod.category}
                        </span>
                        {prod.store && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 truncate max-w-[80px] sm:max-w-none">
                            <FaStore className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-amber-600 shrink-0" />
                            <span className="truncate">{prod.store}</span>
                          </span>
                        )}
                        {prod.badge && (
                          <span className="inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-slate-900 text-white">
                            {prod.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Title */}
                      <Link 
                        href={`/p/${prod.id}`}
                        className="block font-bold text-slate-900 text-xs sm:text-base leading-snug hover:text-[#1b3b2b] transition-colors cursor-pointer line-clamp-2 sm:line-clamp-1"
                      >
                        {prod.title}
                      </Link>

                      {/* Subcategory / Niche */}
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {prod.subCategory || 'Quality Selection'}
                      </p>
                    </div>

                    {/* Action Buttons: "Get It Free" + "Amazon" */}
                    <div className="pt-2.5 sm:pt-5 flex items-center gap-1.5 sm:gap-2">
                      <Link
                        href={`/p/${prod.id}`}
                        className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm bg-[#1b3b2b] hover:bg-[#142e20] text-white transition-all duration-200 cursor-pointer shadow-2xs text-center whitespace-nowrap"
                      >
                        <span className="sm:hidden">Get Free</span>
                        <span className="hidden sm:inline">Get It Free</span>
                      </Link>
                      {prod.amazonUrl && (
                        <a
                          href={prod.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              e.preventDefault();
                              showToast('Please sign in to view the official Amazon product link.');
                              openAuthModal('login');
                            }
                          }}
                          className={`py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs border transition-all duration-200 inline-flex items-center justify-center gap-1 shadow-2xs cursor-pointer shrink-0 ${
                            isAuthenticated
                              ? 'bg-[#fff8e7] hover:bg-[#ff9900] text-[#92400e] hover:text-slate-950 border-amber-300 hover:border-[#e08500]'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                          }`}
                          title={isAuthenticated ? `View on Amazon (${prod.store || 'Amazon'})` : 'Sign in to access Amazon review link'}
                        >
                          <FaAmazon className="w-3.5 h-3.5 text-[#e08500]" />
                          <span className="hidden sm:inline">{isAuthenticated ? 'Amazon' : 'Amazon 🔒'}</span>
                          <span className="sm:hidden">{isAuthenticated ? '' : '🔒'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {displayedProducts.length === 0 && (
              <div className="text-center py-12 bg-stone-50 rounded-2xl p-8">
                <p className="text-sm font-semibold text-slate-600">No products matched your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-bold text-[#1b3b2b] hover:underline"
                >
                  Clear search and view all products
                </button>
              </div>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. HOW IT WORKS SECTION                                                  */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Rounded Soft Container */}
            <div className="bg-[#fafaf8] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-100 shadow-2xs">
              
              {/* Header */}
              <div className="mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b3b2b] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-2">
                  <FaCheck className="w-3 h-3 text-[#1b3b2b]" />
                  <span>Simple 4-Step Review Process</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  How The Amazon Review Program Works
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Just 4 simple steps to start receiving free Amazon products at your doorstep.
                </p>
              </div>

              {/* 4 Steps Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
                
                {/* Step 1: Pick An Amazon Item */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1b3b2b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaClipboardList className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Pick An Amazon Item
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Select any product from verified partner sellers like LONG YUE, Lickoon & Imps Hair.
                    </p>
                  </div>
                </div>

                {/* Step 2: Apply & Order On Amazon */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1b3b2b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaAmazon className="w-3.5 h-3.5 text-[#e08500]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Order On Amazon
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Click &ldquo;Get It Free&rdquo; or message admin live to claim and order directly with Prime.
                    </p>
                  </div>
                </div>

                {/* Step 3: Test & Review On Amazon */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1b3b2b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaStar className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Test & Post Review
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Receive your package, test the product thoroughly, and publish your honest Amazon review.
                    </p>
                  </div>
                </div>

                {/* Step 4: Keep It 100% Free! */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1b3b2b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaBoxOpen className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Keep It 100% Free!
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Confirm your review with admin. The product is 100% yours to keep at zero expense!
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TRUSTED BY THOUSANDS (TESTIMONIALS)                                   */}
        {/* ========================================================================= */}
        <section id="about-us" className="py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  About Us Experience
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Real shoppers who test, review, and keep top Amazon seller products.
                </p>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 cursor-pointer">
                <span>Verified Shopper Reviews</span>
                <FaArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Testimonials 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Testimonial 1: Hannah W. */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Hannah W."
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Hannah W.</h4>
                      <p className="text-[11px] text-emerald-800 font-semibold">Verified Reviewer • Pet Care</p>
                      <div className="flex items-center text-amber-400 gap-0.5 text-xs mt-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed italic">
                    &ldquo;Received the ZGLONG Bamboo Dog Doorbell via Amazon Prime in 2 days. Solid bamboo and loud clear brass bell. Training our golden retriever was effortless, and communication with admin was so smooth!&rdquo;
                  </p>
                </div>
              </div>

              {/* Testimonial 2: Brian S. */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Brian S."
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Brian S.</h4>
                      <p className="text-[11px] text-emerald-800 font-semibold">Prime Member • Home & Garden</p>
                      <div className="flex items-center text-amber-400 gap-0.5 text-xs mt-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed italic">
                    &ldquo;Got the Lickoon 24-pouch mouse repellent for our garage. 100% genuine sealed pack, natural peppermint scent works great. Getting brand-name Amazon items to test and keep is fantastic!&rdquo;
                  </p>
                </div>
              </div>

              {/* Testimonial 3: Sophia L. */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Sophia L."
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Sophia L.</h4>
                      <p className="text-[11px] text-emerald-800 font-semibold">Verified Reviewer • Beauty Care</p>
                      <div className="flex items-center text-amber-400 gap-0.5 text-xs mt-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed italic">
                    &ldquo;The IMPS hair building fibers powder was a perfect match for my electric applicator. Testing top-rated Amazon products and keeping them for free has been an incredible experience!&rdquo;
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FAQ SECTION                                                           */}
        {/* ========================================================================= */}
        <section id="faq" className="py-12 sm:py-16 bg-[#fafaf8] border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Everything you need to know about testing and keeping free products from partner Amazon stores.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">Are these Amazon products really 100% free?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Yes! Verified partner Amazon stores (such as LONG YUE, Lickoon, and Imps Hair) sponsor these units to gather authentic feedback from real shoppers. There are no hidden fees or subscriptions — every approved product is yours to keep forever.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">How do I order and submit my Amazon review?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Browse any item, click &ldquo;Get It Free&rdquo; to view its dedicated page or live chat directly with our admin. You will receive the official Amazon link to place your order with Prime, test the item at home, and publish your helpful, honest review on Amazon.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">Do I need an active Amazon account?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Yes. This program is designed for active US shoppers with an Amazon account in good standing so you can receive fast Prime delivery and post verified customer reviews.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">Do I ever have to return the products?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Never! Every single item you test through FreeProducts.online is 100% yours to keep permanently.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 6. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-100 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            
            {/* Logo Left */}
            <BrandLogo size="sm" />

            {/* Links Middle */}
            <div className="flex flex-wrap items-center justify-center gap-5 font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-950 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-slate-950 transition-colors">Products</Link>
              <a href="#how-it-works" className="hover:text-slate-950 transition-colors">How It Works</a>
              <a href="#about-us" className="hover:text-slate-950 transition-colors">About Us</a>
              <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
              <button 
                onClick={() => setShowCodeModal(true)} 
                className="hover:text-slate-950 transition-colors cursor-pointer"
              >
                Direct Code
              </button>
            </div>

            {/* Social Icons & Contact Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://www.facebook.com/share/1dAcJt9QhV/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#1877F2] hover:bg-slate-200 transition-colors shadow-2xs"
                title="Facebook Page"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://t.me/+8801603383215" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#229ED9] hover:bg-slate-200 transition-colors shadow-2xs"
                title="Telegram Support: 01603383215"
              >
                <FaTelegram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://wa.me/8801340376081" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#25D366] hover:bg-slate-200 transition-colors shadow-2xs"
                title="WhatsApp: 01340376081"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.instagram.com/onlinefreeproducts" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#e1306c] hover:bg-slate-200 transition-colors shadow-2xs"
                title="Instagram (@onlinefreeproducts)"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href={`mailto:${settings.supportEmail || 'support@freeproducts.online'}`} 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#EA4335] hover:bg-slate-200 transition-colors shadow-2xs"
                title={`Email: ${settings.supportEmail || 'support@freeproducts.online'}`}
              >
                <FaEnvelope className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Bottom Copyright & Contact Info */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <p>© 2026 {settings.platformName || 'FreeProducts.online'}. All rights reserved.</p>
              <span className="hidden sm:inline text-slate-300">•</span>
              <a href={`mailto:${settings.supportEmail || 'support@freeproducts.online'}`} className="hover:text-slate-600 transition-colors">
                {settings.supportEmail || 'support@freeproducts.online'}
              </a>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Telegram: 01603383215</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/chat" className="hover:text-slate-600 transition-colors flex items-center gap-1 font-semibold text-emerald-800">
                <FaComments className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Support Desk</span>
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODALS & OVERLAYS                                                        */}
      {/* ========================================================================= */}
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeDetailProduct}
        isOpen={!!activeDetailProduct}
        onClose={closeDetailModal}
        onInquire={openChatWithProduct}
        onOpenShare={openShareModal}
      />

      {/* Share Modal */}
      <ShareModal
        product={activeShareProduct}
        isOpen={!!activeShareProduct}
        onClose={closeShareModal}
        onShowToast={showToast}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Direct Code Lookup Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Direct Product Code Lookup</h3>
              <button 
                onClick={() => {
                  setShowCodeModal(false);
                  setDirectError('');
                }}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Have a product link or referral code? Enter it below to go straight to the product page.
            </p>
            <form onSubmit={handleDirectLookup} className="space-y-3">
              <input
                type="text"
                value={directCode}
                onChange={(e) => {
                  setDirectCode(e.target.value);
                  setDirectError('');
                }}
                placeholder="e.g. prod-long-yue-doorbell or /p/prod-long-yue-doorbell"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
                autoFocus
              />
              {directError && (
                <p className="text-[11px] font-bold text-rose-500">{directError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1b3b2b] hover:bg-[#142e20]"
                >
                  Open Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
