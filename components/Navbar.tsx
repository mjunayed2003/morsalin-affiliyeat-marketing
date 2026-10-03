'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaBagShopping, 
  FaSliders, 
  FaComments, 
  FaMagnifyingGlass,
  FaArrowRightArrowLeft,
  FaUserTie
} from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useApp } from '@/app/context/AppContext';

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery = '',
  setSearchQuery
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount, openChat, products } = useApp();

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Personal Workspace Micro-bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
              <FaUserTie className="w-3 h-3 text-blue-400" /> Personal Affiliate Workspace
            </span>
            <span className="hidden sm:inline text-slate-300">
              Only You & Your Client • Direct Image Sharing with Live Messenger Preview
            </span>
            <span className="sm:hidden text-slate-300">
              Private Client Desk
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link 
              href={isAdmin ? '/' : '/admin'}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <FaArrowRightArrowLeft className="w-2.5 h-2.5" />
              <span>{isAdmin ? 'Back to Overview' : 'Open Owner Studio'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition-colors">
              <FaBagShopping className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Personal<span className="text-blue-600">Desk</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Client & Owner
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Private Showcase & Direct Order Desk</p>
            </div>
          </Link>

          {/* Search Box (Show only if setSearchQuery is provided) */}
          {setSearchQuery && (
            <div className="flex-1 max-w-md mx-2 hidden sm:block">
              <div className="relative">
                <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search your curated client items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm pl-10 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Route Switcher Button */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isAdmin
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              <FaSliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isAdmin ? 'Owner Studio (Active)' : 'Owner Studio'}
              </span>
              <span className="md:hidden">
                {isAdmin ? 'Studio' : 'Studio'}
              </span>
            </Link>

            {/* Live Customer Inbox Button */}
            <button
              onClick={openChat}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FaComments className="w-4 h-4" />
              <span className="hidden sm:inline">Client Inbox</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        {setSearchQuery && (
          <div className="mt-3 sm:hidden">
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search products..."
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
