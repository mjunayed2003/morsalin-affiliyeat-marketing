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
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About Us', href: '/#about-us' },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            {/* Emerald Gift Box Icon */}
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80 shadow-2xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-[#15803d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 7h-2.18A3.996 3.996 0 0 0 16 3.07C14.89 2.43 13.56 2.5 12.63 3.25L12 3.75l-.63-.5C10.44 2.5 9.11 2.43 8 3.07 6.46 3.96 5.8 5.81 6.18 7H4c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h1v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h1c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2zm-9-3c.53 0 1.04.2 1.42.58l.58.58-1.06 1.06-.58-.58A1.99 1.99 0 0 1 11 4zm-3 2c0-.53.2-1.04.58-1.42.78-.78 2.05-.78 2.83 0l.58.58-1.99 1.99L8 6.15A1.99 1.99 0 0 1 8 6zm5 14H6v-8h7v8zm7 0h-5v-8h5v8zm0-10H4V9h16v1z" />
              </svg>
            </div>
            
            {/* Logo Text & Tagline */}
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
                Product<span className="text-[#1b3b2b]">Perks</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                Discover products. Get rewarded.
              </span>
            </div>
          </Link>

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
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Search Icon / Input */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 w-44 sm:w-60 animate-in fade-in zoom-in-95 duration-150">
                  <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery || ''}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
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

            {/* Authenticated User Menu OR Log In / Sign Up Buttons */}
            {isAuthenticated && user ? (
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

                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
              <>
                {/* Log In Link */}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 px-2 py-1.5 transition-colors cursor-pointer"
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
              </>
            )}

            {/* Country Selector Dropdown */}
            <div className="relative" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="text-sm">🇺🇸</span>
                <span className="hidden sm:inline">{selectedCountry}</span>
                <FaChevronDown className="w-2.5 h-2.5 text-slate-500" />
              </button>

              {countryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCountry('USA');
                      setCountryDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-800 font-medium text-left"
                  >
                    <span>🇺🇸</span> USA
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCountry('CAN');
                      setCountryDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-800 font-medium text-left"
                  >
                    <span>🇨🇦</span> Canada
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCountry('UK');
                      setCountryDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-800 font-medium text-left"
                  >
                    <span>🇬🇧</span> UK
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <FaXmark className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {link.label}
              </button>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 rounded-full"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-[#1b3b2b] rounded-full"
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
