'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/app/context/AppContext';
import { 
  FaBagShopping, 
  FaComments, 
  FaSliders, 
  FaMagnifyingGlass, 
  FaFire, 
  FaShieldHalved, 
  FaTruckFast, 
  FaArrowRight, 
  FaUserTie,
  FaImage,
  FaArrowTrendUp,
  FaPlus
} from 'react-icons/fa6';
import { FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { 
    products, 
    openDetailModal, 
    openShareModal, 
    openChatWithProduct, 
    copyClientLink, 
    copiedId,
    openChat
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'priceLow' | 'priceHigh' | 'rating'>('featured');
  const [directCode, setDirectCode] = useState('');
  const [directError, setDirectError] = useState('');

  // Extract unique categories
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
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured / default order
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Handle direct code / link lookup
  const handleOpenDirect = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = directCode.trim();
    if (!trimmed) {
      setDirectError('Please enter a product ID or code.');
      return;
    }

    let prodId = trimmed;
    if (prodId.includes('/p/')) {
      prodId = prodId.split('/p/')[1]?.split(/[?#]/)[0] || trimmed;
    } else if (prodId.includes('/client/')) {
      prodId = prodId.split('/client/')[1]?.split(/[?#]/)[0] || trimmed;
    }

    const found = products.find((p) => p.id.toLowerCase() === prodId.toLowerCase());
    if (found) {
      setDirectError('');
      router.push(`/p/${found.id}`);
    } else {
      router.push(`/p/${prodId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#ccff00] selection:text-slate-950 font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Showcase Banner */}
      <section className="bg-[#0d5bff] text-white relative overflow-hidden border-b border-blue-600">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
          <div className="max-w-3xl space-y-5">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 bg-[#ccff00] text-slate-950 font-black px-4 py-1.5 rounded-full text-xs shadow-md">
              <FaFire className="w-3.5 h-3.5 text-rose-600" />
              <span>Public Storefront • Live Admin Catalog</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Explore Trending Products. <br />
              <span className="text-[#ccff00]">Click for Details & Chat with Admin.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl">
              All items and photos uploaded by the admin are public. Click any product to inspect high-resolution images and specifications, or send a live message to the admin directly.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openChat}
                className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                <FaComments className="w-4 h-4 text-slate-900" />
                <span>Message Admin Live</span>
              </button>

              <Link
                href="/admin"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                <FaUserTie className="w-4 h-4 text-[#ccff00]" />
                <span>Admin Studio (Upload Products)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Public Catalog Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Search, Category Filter & Sorting Controls */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by title, category, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 text-slate-900 rounded-2xl text-xs sm:text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-lg"
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
                className="bg-slate-50 text-slate-900 border border-slate-200 text-xs sm:text-sm font-bold px-3.5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 cursor-pointer"
              >
                <option value="featured">Featured / Newest</option>
                <option value="priceLow">Price: Low to High ($)</option>
                <option value="priceHigh">Price: High to Low ($)</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0d5bff] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Public Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                <span>Public Catalog</span>
                <span className="text-xs bg-[#ccff00] text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                  {filteredProducts.length} Available
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Click any product to inspect full details, or click &ldquo;Message Admin&rdquo; to send a direct message.
              </p>
            </div>

            {/* Direct Admin Upload Shortcut */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#0d5bff] font-bold hover:underline cursor-pointer bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
            >
              <FaPlus className="w-3 h-3" />
              <span>Admin: Upload New Product</span>
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0d5bff] flex items-center justify-center mx-auto font-black text-xl">
                <FaBagShopping className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No Products Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                No products matched your search or category filter. Try clearing filters or open Admin Studio to upload new products.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <Link
                  href="/admin"
                  className="bg-[#0d5bff] hover:bg-[#0045d8] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Enter Admin Studio
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenDetail={openDetailModal}
                  onOpenShare={openShareModal}
                  onInquire={openChatWithProduct}
                  onCopyLink={copyClientLink}
                  onOpenClientView={(p) => router.push(`/p/${p.id}`)}
                  copiedId={copiedId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0d5bff] flex items-center justify-center font-black">
              <FaImage className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              Admin Uploaded & Public
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Every image uploaded by the admin is immediately public. Visitors can browse high-resolution photos and specifications.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <FaComments className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              Direct Live Chat with Admin
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Click &ldquo;Message Admin&rdquo; on any product card to start a 1-on-1 live chat with product photo attached.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <FaTruckFast className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              Dollar ($) Pricing & Fast Order
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Clear international dollar pricing on all items. Inquire via live chat or WhatsApp with one single click.
            </p>
          </div>

        </div>

        {/* Direct Link Resolver Box (for clients who have a specific link / code) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider">
                Direct Code Lookup
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                Have a specific product share link or code?
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Enter the product ID (e.g. prod-101) or paste the link to jump straight to that product page.
              </p>
            </div>

            <form
              onSubmit={handleOpenDirect}
              className="flex items-center gap-2 sm:max-w-md w-full"
            >
              <input
                type="text"
                value={directCode}
                onChange={(e) => {
                  setDirectCode(e.target.value);
                  if (directError) setDirectError('');
                }}
                placeholder="e.g. prod-101 or /p/prod-101"
                className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ccff00] placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Open</span>
                <FaArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>

          {directError && (
            <p className="text-xs font-bold text-rose-400">
              {directError}
            </p>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="w-6 h-6 rounded-lg bg-[#0d5bff] text-white flex items-center justify-center text-xs">
              <FaBagShopping className="w-3 h-3" />
            </div>
            <span>ByteDesk • Public Storefront & Admin Live Desk</span>
          </div>

          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <button
              onClick={openChat}
              className="hover:text-[#0d5bff] transition-colors cursor-pointer"
            >
              Live Chat Desk
            </button>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#0d5bff] transition-colors">
              Admin Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
