'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaBagShopping, 
  FaSliders, 
  FaComments, 
  FaUserTie,
  FaLock
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { unreadCount, openChat } = useApp();

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notice Bar with ByteSpace Cobalt */}
      <div className="bg-[#0a2e8c] text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#ccff00] text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px]">
              Public Store
            </span>
            <span className="hidden sm:inline text-slate-300 text-[11px] font-medium">
              Click any product to inspect details & chat 1-on-1 with Admin in real-time ($ USD)
            </span>
            <span className="sm:hidden text-slate-300 text-[11px]">
              Public Store • Live Chat Desk ($)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link 
              href={isAdmin ? '/' : '/admin'}
              className="text-[#ccff00] hover:underline font-bold cursor-pointer flex items-center gap-1"
            >
              <span>{isAdmin ? '← Public Store' : 'Admin Studio →'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0d5bff] text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-[#0045d8] transition-colors">
              <FaBagShopping className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl text-slate-950 tracking-tight">
                  Byte<span className="text-[#0d5bff]">Desk</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00] text-slate-950">
                  Public
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Public Catalog & Live Chat Desk</p>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Route Switcher Button */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                isAdmin
                  ? 'bg-[#ccff00] text-slate-950 border-[#b8e600] shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              <FaSliders className="w-3.5 h-3.5 text-[#0d5bff]" />
              <span className="hidden sm:inline">
                {isAdmin ? 'Admin Studio (Active)' : 'Admin Studio'}
              </span>
              <span className="sm:hidden">
                {isAdmin ? 'Admin' : 'Admin'}
              </span>
            </Link>

            {/* Live Customer Inbox Button */}
            <button
              onClick={openChat}
              className="relative flex items-center gap-2 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FaComments className="w-4 h-4" />
              <span className="hidden sm:inline">Live Chat</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ccff00] text-slate-950 font-black text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
