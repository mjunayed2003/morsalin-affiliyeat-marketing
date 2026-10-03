'use client';

import React from 'react';
import { 
  FiShoppingBag, 
  FiSearch, 
  FiMessageCircle, 
  FiSliders, 
  FiTag,
  FiExternalLink
} from 'react-icons/fi';
import { ViewMode } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadCount: number;
  openChat: () => void;
  productsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  unreadCount,
  openChat,
  productsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Affiliate Micro-bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold text-[11px]">
              <FiTag className="w-3 h-3" /> স্পেশাল কমিশন
            </span>
            <span className="hidden sm:inline text-slate-300">
              প্রতিটি প্রডাক্টে সরাসরি ১২% থেকে ২৫% পর্যন্ত ইনস্ট্যান্ট অ্যাফিলিয়েট কমিশন!
            </span>
            <span className="sm:hidden text-slate-300">
              ১২%-২৫% অ্যাফিলিয়েট কমিশন
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="hidden md:inline">লাইভ মেসেঞ্জার ও হোয়াটসঅ্যাপ প্রিভিউ সাপোর্টেড</span>
            <button 
              onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
              className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
            >
              {viewMode === 'store' ? 'অ্যাডমিন মোড অন করুন' : 'কাস্টমার স্টোরে ফিরুন'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setViewMode('store')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition-colors">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Affili<span className="text-blue-600">Hub</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Affiliate
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">প্রোডাক্ট শোকেস ও ডাইরেক্ট চ্যাট হাব</p>
            </div>
          </div>

          {/* Search Box (Store Mode Only) */}
          {viewMode === 'store' && (
            <div className="flex-1 max-w-md mx-2 hidden sm:block">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="প্রোডাক্টের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Toggle Button */}
            <button
              onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                viewMode === 'admin'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              <FiSliders className="w-4 h-4" />
              <span className="hidden md:inline">
                {viewMode === 'admin' ? 'অ্যাডমিন প্যানেল (Active)' : 'অ্যাডমিন ড্যাশবোর্ড'}
              </span>
              <span className="md:hidden">
                {viewMode === 'admin' ? 'অ্যাডমিন' : 'ড্যাশবোর্ড'}
              </span>
            </button>

            {/* Live Customer Inbox Button */}
            <button
              onClick={openChat}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FiMessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">ওয়েবসাইট ইনবক্স</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        {viewMode === 'store' && (
          <div className="mt-3 sm:hidden">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="প্রোডাক্ট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
