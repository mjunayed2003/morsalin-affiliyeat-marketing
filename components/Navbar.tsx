'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaBagShopping, 
  FaSliders, 
  FaComments, 
  FaUser,
  FaCheck,
  FaArrowRightFromBracket,
  FaPhone,
  FaShieldHalved,
  FaHouse
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { maskPhone } from '@/app/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useApp();
  const { user, isAuthenticated, isLoading, openAuthModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = pathname.startsWith('/admin');
  const isHome = pathname === '/';
  const isChat = pathname === '/chat';
  const isProfile = pathname === '/profile';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Login na korle navbar hide thakbe (Desktop header & Mobile bottom dock completely hidden)
  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-[#0a2e8c] text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#ccff00] text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px]">
              ByteDesk
            </span>
            <span className="hidden sm:inline text-slate-300 text-[11px] font-medium">
              Verified Client Portal • 1-on-1 Real-time Chat with Admin & Direct Ordering
            </span>
            <span className="sm:hidden text-slate-300 text-[11px]">
              Client Portal • Live Chat Desk
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {isAuthenticated ? (
              <span className="text-[#ccff00] font-semibold flex items-center gap-1">
                <FaCheck className="w-3 h-3" />
                Verified Client: {maskPhone(user?.phone)}
              </span>
            ) : (
              <button
                onClick={() => openAuthModal('register')}
                className="text-[#ccff00] hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <span>New client? Register your account →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                  Client Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Store, Real-time Chat & Profile</p>
            </div>
          </Link>

          {/* Navigation Links: 3 Core Icons (Home, Chat, Profile) */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* 1. Home Icon */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isHome
                  ? 'bg-white text-[#0d5bff] shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FaHouse className={`w-3.5 h-3.5 ${isHome ? 'text-[#0d5bff]' : 'text-slate-500'}`} />
              <span>Home</span>
            </Link>

            {/* 2. Chat Icon */}
            <Link
              href="/chat"
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isChat
                  ? 'bg-white text-[#0d5bff] shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FaComments className={`w-3.5 h-3.5 ${isChat ? 'text-[#0d5bff]' : 'text-slate-500'}`} />
              <span>Chat</span>
              {unreadCount > 0 && (
                <span className="bg-[#ccff00] text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-slate-300">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* 3. Profile Icon */}
            <Link
              href="/profile"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isProfile
                  ? 'bg-white text-[#0d5bff] shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FaUser className={`w-3.5 h-3.5 ${isProfile ? 'text-[#0d5bff]' : 'text-slate-500'}`} />
              <span>Profile</span>
              {isAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </Link>
          </nav>

          {/* Action Buttons & Auth */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Admin Studio Link */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isAdmin
                  ? 'bg-[#ccff00] text-slate-950 border-[#b8e600] shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              <FaSliders className="w-3 h-3 text-[#0d5bff]" />
              <span>{isAdmin ? 'Admin (Active)' : 'Admin'}</span>
            </Link>

            {/* User Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 py-1.5 px-2.5 sm:px-3 rounded-xl transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-blue-200"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-tight flex items-center gap-1">
                      {user.name.split(' ')[0]}
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]" title="Verified Client">
                        ✓
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono font-medium">{maskPhone(user.phone)}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <FaPhone className="w-2.5 h-2.5 text-emerald-600" />
                        {maskPhone(user.phone)}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <FaCheck className="w-2.5 h-2.5" />
                        Verified Account
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0d5bff] transition-colors"
                      >
                        <FaHouse className="w-3.5 h-3.5 text-slate-400" />
                        <span>Home Store</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0d5bff] transition-colors"
                      >
                        <FaUser className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Profile & Shipping</span>
                      </Link>

                      <Link
                        href="/chat"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0d5bff] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <FaComments className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chat with Admin</span>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-[#ccff00] text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0d5bff] transition-colors"
                      >
                        <FaSliders className="w-3.5 h-3.5 text-slate-400" />
                        <span>Admin Studio</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <FaArrowRightFromBracket className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Sign In Button */}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0d5bff] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                {/* Direct Register Button */}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 text-white font-black px-3.5 py-2 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FaPhone className="w-3 h-3 text-[#ccff00]" />
                  <span>Register</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Responsive Mobile Bottom Navigation Bar with the 3 Core Icons */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-6 shadow-2xl flex items-center justify-around">
        {/* 1. Home Icon */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-5 rounded-2xl transition-all cursor-pointer ${
            isHome 
              ? 'text-[#0d5bff] bg-blue-50/90 font-black' 
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          <div className="relative">
            <FaHouse className={`w-5 h-5 transition-transform ${isHome ? 'scale-110 text-[#0d5bff]' : 'text-slate-500'}`} />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. Chat Icon */}
        <Link
          href="/chat"
          className={`relative flex flex-col items-center justify-center gap-1 py-1.5 px-5 rounded-2xl transition-all cursor-pointer ${
            isChat 
              ? 'text-[#0d5bff] bg-blue-50/90 font-black' 
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          <div className="relative">
            <FaComments className={`w-5 h-5 transition-transform ${isChat ? 'scale-110 text-[#0d5bff]' : 'text-slate-500'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-3 bg-[#ccff00] text-slate-950 font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Chat</span>
        </Link>

        {/* 3. Profile Icon */}
        <Link
          href="/profile"
          className={`relative flex flex-col items-center justify-center gap-1 py-1.5 px-5 rounded-2xl transition-all cursor-pointer ${
            isProfile 
              ? 'text-[#0d5bff] bg-blue-50/90 font-black' 
              : 'text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          <div className="relative">
            <FaUser className={`w-5 h-5 transition-transform ${isProfile ? 'scale-110 text-[#0d5bff]' : 'text-slate-500'}`} />
            {isAuthenticated && (
              <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Profile</span>
        </Link>
      </div>
    </header>
  );
};

