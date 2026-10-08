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
  FaMagnifyingGlass, 
  FaSliders, 
  FaArrowRight, 
  FaStar,
  FaArrowLeft,
  FaRotateLeft,
  FaCheck
} from 'react-icons/fa6';
import { FaAmazon, FaStore } from 'react-icons/fa';

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

export default function ProductsPage() {
  const router = useRouter();
  const { 
    products, 
    activeDetailProduct, 
    activeShareProduct, 
    openDetailModal, 
    closeDetailModal, 
    closeShareModal, 
    openChatWithProduct, 
    openShareModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'priceLow' | 'priceHigh'>('featured');

  // Extract all categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q || 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q));
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        return 0; // featured/default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/40 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans">
      
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Featured Products
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Explore popular products available for test, honest review, and keep.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white border border-stone-200/80 px-3.5 py-1.5 rounded-full text-slate-600 shadow-2xs">
              <span>{filteredProducts.length} Products Found</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEARCH & FILTER BAR                                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-5">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Live Search Input */}
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by title, keyword, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-stone-50/80 text-slate-900 rounded-2xl text-xs sm:text-sm font-medium border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/30 focus:border-[#1b3b2b] placeholder:text-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-stone-200/80 px-2 py-0.5 rounded-lg cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-50/80 text-slate-900 border border-stone-200 text-xs sm:text-sm font-bold px-3.5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/30 cursor-pointer"
              >
                <option value="featured">Featured / Default</option>
                <option value="rating">Top Rated (★)</option>
                <option value="priceLow">Retail Value: Low to High</option>
                <option value="priceHigh">Retail Value: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-stone-100">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1b3b2b] text-white shadow-xs'
                      : 'bg-stone-100/80 text-slate-600 hover:bg-stone-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PRODUCT CARDS GRID                                                       */}
        {/* ========================================================================= */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-2xs space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-stone-100 text-slate-500 flex items-center justify-center mx-auto text-xl font-black">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                No products matched your search keyword or selected category filter. Try clearing filters to see all available items.
              </p>
              <div className="pt-2">
                <button
                  onClick={resetFilters}
                  className="bg-[#1b3b2b] hover:bg-[#142e20] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <FaRotateLeft className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredProducts.map((prod) => {
                const badgeStyle = CATEGORY_STYLES[prod.category] || { 
                  bg: 'bg-stone-100', 
                  text: 'text-stone-700' 
                };

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Product Image Box */}
                      <div 
                        onClick={() => openDetailModal(prod)}
                        className="relative w-full aspect-4/3 rounded-xl bg-[#f8f7f4] overflow-hidden mb-4 cursor-pointer flex items-center justify-center"
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {prod.badge && (
                          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {prod.badge}
                          </div>
                        )}
                      </div>

                      {/* Category Pill, Store & Rating */}
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeStyle.bg} ${badgeStyle.text}`}>
                            {prod.category}
                          </span>
                          {prod.store && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <FaStore className="w-2.5 h-2.5 text-amber-600" />
                              <span>{prod.store}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <FaStar className="w-3 h-3 text-amber-400" />
                          <span>{prod.rating}</span>
                          <span className="text-slate-400 font-normal">({prod.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <h3 
                        onClick={() => openDetailModal(prod)}
                        className="font-bold text-slate-900 text-base leading-snug hover:text-[#1b3b2b] transition-colors cursor-pointer line-clamp-1"
                      >
                        {prod.title}
                      </h3>

                      {/* Subcategory / Niche */}
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {prod.subCategory || prod.description.slice(0, 50) + '...'}
                      </p>
                    </div>

                    {/* Action Buttons: "Get It Free" + "Amazon" */}
                    <div className="pt-5 flex items-center gap-2">
                      <button
                        onClick={() => openDetailModal(prod)}
                        className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-[#f4f3ef] hover:bg-[#1b3b2b] text-slate-700 hover:text-white transition-all duration-200 cursor-pointer shadow-2xs text-center"
                      >
                        Get It Free
                      </button>
                      {prod.amazonUrl && (
                        <a
                          href={prod.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-2.5 px-3 rounded-xl font-bold text-xs bg-[#fff8e7] hover:bg-[#ff9900] text-[#92400e] hover:text-slate-950 border border-amber-300 hover:border-[#e08500] transition-all duration-200 inline-flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                          title={`View on Amazon (${prod.store || 'Amazon'})`}
                        >
                          <FaAmazon className="w-3.5 h-3.5 text-[#e08500]" />
                          <span>Amazon</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ProductPerks. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 font-semibold">Home</Link>
            <Link href="/products" className="hover:text-slate-900 font-semibold">Products</Link>
            <Link href="/chat" className="hover:text-slate-900 font-semibold">Support Desk</Link>
            <Link href="/admin" className="hover:text-slate-900 font-semibold">Admin Studio</Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductDetailModal
        product={activeDetailProduct}
        isOpen={!!activeDetailProduct}
        onClose={closeDetailModal}
        onInquire={openChatWithProduct}
        onOpenShare={openShareModal}
      />

      <ShareModal
        product={activeShareProduct}
        isOpen={!!activeShareProduct}
        onClose={closeShareModal}
      />

      <AuthModal />

    </div>
  );
}
