'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/app/context/AppContext';
import { 
  FaBagShopping, 
  FaTags, 
  FaTruckFast, 
  FaShieldHalved, 
  FaArrowRight, 
  FaUserTie, 
  FaImage, 
  FaPlus,
  FaCheck
} from 'react-icons/fa6';
import { FaFacebookMessenger } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const {
    products,
    openDetailModal,
    openShareModal,
    openChatWithProduct,
    copyClientLink,
    copiedId
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Smart Gadgets',
    'Mobile Accessories',
    'Fashion & Lifestyle',
    'Lifestyle',
    'Electronics'
  ];

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#ccff00] selection:text-slate-950">
      {/* Top Navbar with ByteSpace Cobalt & Lime */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1 pb-16">
        
        {/* ByteSpace Signature Cobalt Blue Hero Banner */}
        <div className="bg-[#0d5bff] text-white relative overflow-hidden border-b border-blue-700">
          
          {/* Playful ByteSpace Decorative Geometric Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Hero Text */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#ccff00] text-slate-950 font-black px-3.5 py-1 rounded-full text-xs shadow-md">
                  <FaUserTie className="w-3.5 h-3.5" />
                  <span>ByteSpace Client & Affiliate Architecture</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Upload Image, Share to Client & <span className="text-[#ccff00]">Preview on Messenger</span>
                </h1>

                <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl">
                  A private system built exclusively for <strong className="text-white font-bold">you and your client</strong>. Each item has its own dedicated route <code className="bg-blue-900/60 px-2 py-0.5 rounded text-[#ccff00] text-xs font-bold">/client/[id]</code>. When shared on Messenger, clients see the exact shared photo in high resolution with a direct private chat desk.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Primary CTA (ByteSpace Electric Lime) */}
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-black/10 transition-all cursor-pointer"
                  >
                    <FaPlus className="w-3.5 h-3.5" />
                    <span>Upload New Item for Client</span>
                  </Link>

                  {/* Secondary Outline Button */}
                  {products.length > 0 && (
                    <Link
                      href={`/client/${products[0].id}`}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl border border-white/25 transition-all cursor-pointer backdrop-blur-xs"
                    >
                      <FaImage className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span>Preview Client Route (/client/{products[0].id})</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Hero Info Card (ByteSpace Card Style) */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3.5">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <FaFacebookMessenger className="w-4 h-4 text-[#ccff00]" />
                      ByteSpace Routing Architecture
                    </span>
                    <span className="text-[10px] bg-[#ccff00] text-slate-950 px-2.5 py-0.5 rounded-full font-black">
                      App Router Ready
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs text-blue-100 font-medium">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#ccff00] text-slate-950 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5 shadow-xs">
                        1
                      </span>
                      <p><strong className="text-white font-bold">/admin</strong>: Owner Studio to upload images, set deal prices, and reply to client inquiries.</p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#ccff00] text-slate-950 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5 shadow-xs">
                        2
                      </span>
                      <p><strong className="text-[#ccff00] font-bold">/client/[id]</strong>: Dedicated client landing route with dynamic Open Graph tags for automatic Messenger photo preview.</p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#ccff00] text-slate-950 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5 shadow-xs">
                        3
                      </span>
                      <p><strong className="text-white font-bold">1-on-1 Chat</strong>: Client messages and attached photos sync directly to your Owner Studio inbox.</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100 font-semibold">
                    <span>✓ Clean Next.js Dynamic Routing</span>
                    <Link 
                      href="/admin"
                      className="text-[#ccff00] hover:underline font-black cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Manage in Studio</span>
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Trust Guarantees Bar (Clean White with ByteSpace Cobalt & Lime Accents) */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-800 font-semibold">
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0d5bff] flex items-center justify-center">
                  <FaTruckFast className="w-3.5 h-3.5" />
                </div>
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FaShieldHalved className="w-3.5 h-3.5" />
                </div>
                <span>100% Genuine Guaranteed</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FaTags className="w-3.5 h-3.5" />
                </div>
                <span>Special Client Pricing</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#ccff00]/30 text-slate-900 flex items-center justify-center">
                  <FaUserTie className="w-3.5 h-3.5" />
                </div>
                <span>Direct 1-on-1 Messaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Catalog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          
          {/* Header & Categories */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                <FaBagShopping className="w-5 h-5 text-[#0d5bff]" />
                <span>Your Curated Client Collection</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ccff00] text-slate-950">
                  {filteredProducts.length} Items
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Click "Client View" to open the client route <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-800">/client/[id]</code> or "Share Preview" for Messenger
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0d5bff] text-white shadow-md shadow-blue-600/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <FaBagShopping className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                No matching items found
              </h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-5 py-2.5 bg-[#0d5bff] text-white text-xs font-bold rounded-xl hover:bg-[#0045d8] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
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
                  onOpenClientView={(p) => router.push(`/client/${p.id}`)}
                  copiedId={copiedId}
                />
              ))}
            </div>
          )}

        </div>

      </main>

      {/* ByteSpace Dark Blue Footer */}
      <footer className="bg-[#0a2e8c] text-slate-300 text-xs py-10 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ccff00] text-slate-950 flex items-center justify-center font-black text-sm">
              <FaBagShopping className="w-4 h-4" />
            </div>
            <span className="font-black text-white text-base">ByteDesk</span>
            <span className="text-slate-400">• Private Client Showcase & Messenger Direct Share</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/admin"
              className="text-[#ccff00] hover:underline cursor-pointer"
            >
              Owner Studio (/admin)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
