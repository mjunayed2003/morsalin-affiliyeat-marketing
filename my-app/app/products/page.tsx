'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Navbar, 
  ProductCard, 
  ProductDetailModal, 
  ShareModal, 
  AuthModal, 
  BrandLogo, 
  AdvertisementBanner 
} from '@/components';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { Product } from '@/types';
import { 
  FaMagnifyingGlass, 
  FaRotateLeft,
  FaArrowLeft
} from 'react-icons/fa6';
import { FaAmazon } from 'react-icons/fa';

export default function ProductsPage() {
  const router = useRouter();
  const { 
    products, 
    isProductsLoading,
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
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>Featured Amazon Products</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Explore verified Amazon products, exclusive deals, and honest customer reviews across top categories.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white border border-stone-200/80 px-3.5 py-1.5 rounded-full text-slate-600 shadow-2xs">
              <FaAmazon className="w-3.5 h-3.5 text-[#ff9900]" />
              <span>{filteredProducts.length} Amazon Items Active</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEARCH & FILTER BAR                                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4 sm:space-y-5">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Live Search Input */}
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Amazon products by title, store, or category..."
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
        {/* SPONSORED PROMOTION / ADVERTISEMENT SYSTEM                                */}
        {/* ========================================================================= */}
        <AdvertisementBanner className="mb-6" />

        {/* ========================================================================= */}
        {/* PRODUCT CARDS GRID                                                       */}
        {/* ========================================================================= */}
        <div>
          {isProductsLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 p-3 sm:p-5 animate-pulse space-y-3">
                  <div className="w-full aspect-4/3 rounded-lg bg-stone-200" />
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-5 bg-stone-200 rounded w-4/5" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-9 bg-stone-200 rounded-xl w-full pt-2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  showRating={true}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-5 font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <Link href="/products" className="hover:text-slate-900">Products</Link>
            <Link href="/chat" className="hover:text-slate-900">Support Desk</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <p>© 2026 {settings.platformName || 'FreeProducts.online'}. All rights reserved.</p>
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
