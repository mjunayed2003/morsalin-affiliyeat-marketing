'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ShareModal } from '@/components/ShareModal';
import { AuthModal } from '@/components/AuthModal';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { Product } from '@/app/types';
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
  FaComments
} from 'react-icons/fa6';

// Pastel category badges map
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  'Skincare': { bg: 'bg-[#faebe6]', text: 'text-[#b85d43]' },
  'Tech': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Food & Beverage': { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
  'Home': { bg: 'bg-[#e0f2fe]', text: 'text-[#075985]' },
  'Lifestyle': { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]' },
  'Accessories': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]' },
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
    showToast
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

  // Handle "Get It Free" action
  const handleGetItFree = (product: Product) => {
    openDetailModal(product);
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
                <div className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-slate-500 uppercase flex items-center gap-2">
                  <span>REAL PRODUCTS</span>
                  <span className="text-slate-300">•</span>
                  <span>REAL PEOPLE</span>
                  <span className="text-slate-300">•</span>
                  <span>REAL REWARDS</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-[56px] text-slate-900 font-bold leading-[1.14] tracking-tight">
                  Discover Products.<br />
                  Share Your Opinion.<br />
                  Get Rewarded.
                </h1>

                {/* Paragraph Description */}
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                  Join ProductPerks and get FREE products to test, review and keep. Your feedback helps brands grow and you get rewarded!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        openAuthModal('register');
                      } else {
                        const el = document.getElementById('products');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Get Started Free</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/products"
                    className="bg-white hover:bg-slate-50 active:scale-95 text-slate-800 border border-slate-300/90 font-semibold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Browse Products</span>
                  </Link>
                </div>

                {/* Value Propositions / Trust Badges (4 Columns) */}
                <div className="pt-6 sm:pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                  
                  {/* Badge 1: Free Products */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <FaBoxOpen className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Free Products</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">No hidden fees</p>
                    </div>
                  </div>

                  {/* Badge 2: Secure & Private */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <FaShieldHalved className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Secure & Private</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Your data is protected</p>
                    </div>
                  </div>

                  {/* Badge 3: Real Rewards */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <FaAward className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Real Rewards</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Keep, review, get rewarded</p>
                    </div>
                  </div>

                  {/* Badge 4: USA Based */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <FaLocationDot className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">USA Based</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">For US residents only</p>
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
                      alt="ProductPerks Member Delivery Box"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Subtle warm lighting vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />

                    {/* Branded ProductPerks stamp badge centered on the box */}
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 bg-[#f4ebe1]/90 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-[#d6c5b3] shadow-md flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#1b3b2b] text-white flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 7h-2.18A3.996 3.996 0 0 0 16 3.07C14.89 2.43 13.56 2.5 12.63 3.25L12 3.75l-.63-.5C10.44 2.5 9.11 2.43 8 3.07 6.46 3.96 5.8 5.81 6.18 7H4c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h1v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h1c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2zm-9-3c.53 0 1.04.2 1.42.58l.58.58-1.06 1.06-.58-.58A1.99 1.99 0 0 1 11 4zm-3 2c0-.53.2-1.04.58-1.42.78-.78 2.05-.78 2.83 0l.58.58-1.99 1.99L8 6.15A1.99 1.99 0 0 1 8 6zm5 14H6v-8h7v8zm7 0h-5v-8h5v8zm0-10H4V9h16v1z" />
                        </svg>
                      </div>
                      <span className="font-bold text-sm tracking-tight text-slate-900">
                        Product<span className="text-[#1b3b2b]">Perks</span>
                      </span>
                    </div>

                  </div>

                  {/* Playful Handwritten Note Badge: "Small Reviews Big Impact ❤️" */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-stone-200/80 -rotate-3 hover:rotate-0 transition-transform">
                    <p className="font-handwriting text-slate-800 text-base sm:text-lg font-bold leading-tight text-center">
                      Small Reviews<br />
                      <span className="text-[#1b3b2b]">Big Impact ❤️</span>
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
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Featured Products
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Popular products from trusted brands.
                </p>
              </div>

              <Link
                href="/products"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View All Products</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Product Cards Grid (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {displayedProducts.map((prod) => {
                const badgeStyle = CATEGORY_STYLES[prod.category] || { 
                  bg: 'bg-stone-100', 
                  text: 'text-stone-700' 
                };

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-2xl border border-slate-100/90 hover:border-slate-300 p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Product Image Box */}
                      <div 
                        onClick={() => handleGetItFree(prod)}
                        className="relative w-full aspect-4/3 rounded-xl bg-[#f8f7f4] overflow-hidden mb-4 cursor-pointer flex items-center justify-center"
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Category Pill Badge */}
                      <div className="mb-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeStyle.bg} ${badgeStyle.text}`}>
                          {prod.category}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 
                        onClick={() => handleGetItFree(prod)}
                        className="font-bold text-slate-900 text-base leading-snug hover:text-[#1b3b2b] transition-colors cursor-pointer line-clamp-1"
                      >
                        {prod.title}
                      </h3>

                      {/* Subcategory / Niche */}
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {prod.subCategory || 'Quality Selection'}
                      </p>
                    </div>

                    {/* Action Button: "Get It Free" */}
                    <div className="pt-5">
                      <button
                        onClick={() => handleGetItFree(prod)}
                        className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-[#f4f3ef] hover:bg-[#1b3b2b] text-slate-700 hover:text-white transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        Get It Free
                      </button>
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
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  How It Works
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Just 4 simple steps to get started.
                </p>
              </div>

              {/* 4 Steps Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
                
                {/* Step 1: Sign Up */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaUser className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Sign Up
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Create your free account in just a minute.
                    </p>
                  </div>
                </div>

                {/* Step 2: Choose Products */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaClipboardList className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Choose Products
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Browse available products and apply.
                    </p>
                  </div>
                </div>

                {/* Step 3: Test & Review */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaTruckFast className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Test & Review
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Try the product and share your honest review.
                    </p>
                  </div>
                </div>

                {/* Step 4: Keep It! */}
                <div className="flex flex-col space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <FaBoxOpen className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Keep It!
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Some products are yours to keep - for free!
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
                  Trusted by Thousands
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Real people. Real feedback.
                </p>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 cursor-pointer">
                <span>What Our Members Say</span>
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
                      <div className="flex items-center text-amber-400 gap-0.5 text-xs mt-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed italic">
                    &ldquo;This is such a great platform! I&apos;ve received so many amazing products.&rdquo;
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
                      <div className="flex items-center text-amber-400 gap-0.5 text-xs mt-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed italic">
                    &ldquo;Easy to sign-up, simple process, and the products are fantastic!&rdquo;
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
                      <div className="flex items-center text-amber-400 gap-0.5 text-xs mt-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed italic">
                    &ldquo;I love being part of this community. Highly recommend!&rdquo;
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
                Everything you need to know about getting free products on ProductPerks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">Are the products really 100% free?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Yes! Verified members receive free products directly to their home. There are no surprise shipping fees or subscriptions. In return, we just ask for your honest review.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">How long does shipping take?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Standard delivery typically takes 3 to 5 business days across the United States. You will receive real-time package updates directly in your account.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900">Do I have to return the product after reviewing?</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Never! Once you receive and test the product, it is yours to keep forever.
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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-4 h-4 text-[#15803d]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 7h-2.18A3.996 3.996 0 0 0 16 3.07C14.89 2.43 13.56 2.5 12.63 3.25L12 3.75l-.63-.5C10.44 2.5 9.11 2.43 8 3.07 6.46 3.96 5.8 5.81 6.18 7H4c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h1v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h1c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2zm-9-3c.53 0 1.04.2 1.42.58l.58.58-1.06 1.06-.58-.58A1.99 1.99 0 0 1 11 4zm-3 2c0-.53.2-1.04.58-1.42.78-.78 2.05-.78 2.83 0l.58.58-1.99 1.99L8 6.15A1.99 1.99 0 0 1 8 6zm5 14H6v-8h7v8zm7 0h-5v-8h5v8zm0-10H4V9h16v1z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">ProductPerks</p>
                <p className="text-[11px] text-slate-400">Discover products. Get rewarded.</p>
              </div>
            </div>

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

            {/* Social Icons & Copyright Right */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors">
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors">
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors">
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Bottom Copyright & Discreet Portal Links */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© 2026 ProductPerks. All rights reserved.</p>
            
            <div className="flex items-center gap-4">
              <Link href="/chat" className="hover:text-slate-600 transition-colors flex items-center gap-1">
                <FaComments className="w-3 h-3" />
                <span>Live Chat</span>
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-slate-600 transition-colors flex items-center gap-1">
                <FaSliders className="w-3 h-3" />
                <span>Admin Studio</span>
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
                placeholder="e.g. prod-skincare or /p/prod-skincare"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
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
