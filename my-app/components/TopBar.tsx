'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaPhone, 
  FaMagnifyingGlass, 
  FaRegBookmark, 
  FaRegCommentDots, 
  FaFacebookF, 
  FaWhatsapp, 
  FaTelegram,
  FaYoutube, 
  FaInstagram, 
  FaXTwitter 
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';

export const TopBar: React.FC = () => {
  const router = useRouter();
  const { openChat, settings } = useApp();
  const [searchValue, setSearchValue] = useState('');

  const phoneNumber = '+880 1340-376081';
  const cleanPhoneForLink = '8801340376081';
  const telegramNumber = '01603383215';
  const whatsappUrl = `https://wa.me/${cleanPhoneForLink}?text=${encodeURIComponent(`Hello ${settings.platformName || 'FreeProducts.online'} Support, I would like to inquire about Amazon review products.`)}`;
  const telegramUrl = `https://t.me/+8801603383215`;
  const facebookUrl = 'https://www.facebook.com/share/1dAcJt9QhV/';
  const emailUrl = `mailto:${settings.supportEmail || 'support@freeproducts.online'}`;
  const telUrl = `tel:+${cleanPhoneForLink}`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="w-full bg-[#0b1329] text-slate-200 border-b border-slate-800/80 text-xs select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 sm:h-10 gap-2 sm:gap-3">
          
          {/* Left / Phone Contact */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a 
              href={telUrl}
              className="group flex items-center gap-1.5 sm:gap-2 text-white hover:text-pink-400 font-semibold tracking-wide transition-colors py-1"
              title="Call us"
            >
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-500/15 flex items-center justify-center text-[#e91e63] group-hover:scale-110 transition-transform">
                <FaPhone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#e91e63]" />
              </span>
              <span className="text-[11px] sm:text-[13px]">{phoneNumber}</span>
            </a>
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Search Input (Desktop only) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                className="w-36 lg:w-48 bg-[#162038] hover:bg-[#1a2642] focus:bg-[#1a2642] text-slate-100 placeholder-slate-400 text-xs rounded-full pl-3 pr-8 py-1 border border-slate-700/60 focus:border-pink-500/60 focus:outline-none transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-2.5 text-slate-400 hover:text-white transition-colors"
                title="Search products"
              >
                <FaMagnifyingGlass className="w-3 h-3" />
              </button>
            </form>

            {/* Quick Links (Tablet/Desktop) */}
            <div className="hidden sm:flex items-center gap-3 text-slate-300 text-xs font-medium">
              <Link 
                href="/#how-it-works" 
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                Leave a Review
              </Link>
              <Link 
                href="/login" 
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                For Providers
              </Link>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-3.5 w-px bg-slate-700/80" />

            {/* Action Icons (Bookmark & Chat) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/profile"
                className="text-slate-300 hover:text-white p-1 hover:scale-110 transition-transform"
                title="Saved Deals & Profile"
              >
                <FaRegBookmark className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={openChat}
                className="text-slate-300 hover:text-white p-1 hover:scale-110 transition-transform cursor-pointer"
                title="Live Support Chat"
              >
                <FaRegCommentDots className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-3.5 w-px bg-slate-700/80" />

            {/* Social Icons (WhatsApp & Instagram always visible; others on sm+ screens) */}
            <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-[#25D366] transition-transform hover:scale-110 p-0.5" 
                title={`WhatsApp: ${phoneNumber}`}
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.instagram.com/onlinefreeproducts" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-[#e1306c] transition-transform hover:scale-110 p-0.5" 
                title="Instagram (@onlinefreeproducts)"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href={telegramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden sm:inline-flex text-slate-300 hover:text-[#229ED9] transition-transform hover:scale-110 p-0.5" 
                title={`Telegram: ${telegramNumber}`}
              >
                <FaTelegram className="w-3.5 h-3.5" />
              </a>
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden sm:inline-flex text-slate-300 hover:text-[#1877F2] transition-transform hover:scale-110 p-0.5" 
                title="Facebook Official Page"
              >
                <FaFacebookF className="w-3 h-3" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden md:inline-flex hover:text-[#ff0000] transition-transform hover:scale-110 p-0.5" 
                title="YouTube"
              >
                <FaYoutube className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden md:inline-flex hover:text-white transition-transform hover:scale-110 p-0.5" 
                title="Twitter / X"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
