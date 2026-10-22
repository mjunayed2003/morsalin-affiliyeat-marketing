'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaMagnifyingGlass, 
  FaUser, 
  FaCheck, 
  FaArrowRightFromBracket,
  FaPhone,
  FaComments,
  FaSliders,
  FaChevronDown,
  FaBars,
  FaXmark
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { maskPhone } from '@/app/types';
import { TopBar } from '@/components/TopBar';
import { BrandLogo } from '@/components/BrandLogo';
import { NotificationCenter } from '@/components/NotificationCenter';

interface NavbarProps {
  onSearchClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearchClick, 
  searchQuery, 
  onSearchChange 
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useApp();
  const { user, isAuthenticated, isAdmin, isLoading, openAuthModal, logout } = useAuth();
  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Amazon Products', href: '/products' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Reviewers', href: '/#about-us' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        router.push('/' + href);
      } else {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      router.push(href);
    }
  };

  return (
    <header className="sticky top-0 z-40 transition-all">
      <TopBar />
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className={`text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer ${
                  link.label === 'Home' && pathname === '/'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Search Icon / Input */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-2.5 sm:px-3 py-1.5 w-36 sm:w-60 animate-in fade-in zoom-in-95 duration-150">
                  <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
                  <input
                    type="text"
                    value={searchQuery || ''}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none min-w-0"
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      setShowSearchInput(false);
                      onSearchChange?.('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchInput(true);
                    onSearchClick?.();
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Search"
                >
                  <FaMagnifyingGlass className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Authenticated User Menu OR Log In / Sign Up Buttons */}
            {isLoading ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-9 rounded-full bg-slate-100/90 animate-pulse border border-slate-200/50" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 py-1.5 px-3 rounded-full transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <FaChevronDown className="w-2.5 h-2.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <FaPhone className="w-2.5 h-2.5 text-emerald-600" />
                        {maskPhone(user.phone)}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <FaCheck className="w-2.5 h-2.5" />
                        Verified Member
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FaUser className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/chat"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <FaComments className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chat Support</span>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                        >
                          <FaSliders className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Admin Studio</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <FaArrowRightFromBracket className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                {/* Log In Link */}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  Log In
                </button>

                {/* Sign Up Pill Button */}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="bg-[#1b3b2b] hover:bg-[#142e21] text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Country Badge */}
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100/90 border border-slate-200/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full select-none tracking-wide">
              USA
            </span>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FaXmark className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className={`text-left py-2.5 px-3 text-sm font-semibold rounded-xl transition-colors ${
                  link.label === 'Home' && pathname === '/'
                    ? 'bg-slate-100 text-slate-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Authenticated user menu in drawer */}
          {isLoading ? (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center py-2">
              <div className="w-full h-10 rounded-xl bg-slate-100 animate-pulse" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{maskPhone(user.phone)}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  <FaUser className="w-3 h-3 text-slate-500" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  <FaComments className="w-3 h-3 text-emerald-600" />
                  <span>Live Chat</span>
                </Link>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl"
                >
                  <FaSliders className="w-3 h-3 text-emerald-700" />
                  <span>Admin Studio Dashboard</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
              >
                <FaArrowRightFromBracket className="w-3 h-3 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-[#1b3b2b] hover:bg-[#142e20] rounded-full transition-colors cursor-pointer shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
