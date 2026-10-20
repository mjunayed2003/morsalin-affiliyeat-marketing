'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  clickable?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
  clickable = true,
  className = '',
}) => {
  const isDark = variant === 'dark';

  // Size configurations
  const sizeMap = {
    sm: {
      emblem: 'w-8 h-8 rounded-xl',
      svg: 'w-4.5 h-4.5',
      mainText: 'text-base sm:text-lg',
      tagText: 'text-[9px] px-1 py-0.2',
      tagline: 'text-[9px]',
    },
    md: {
      emblem: 'w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl',
      svg: 'w-5 h-5 sm:w-6 sm:h-6',
      mainText: 'text-[16px] sm:text-xl font-black',
      tagText: 'text-[9px] sm:text-[11px] px-1.5 py-0.5',
      tagline: 'text-[10px] sm:text-[11px]',
    },
    lg: {
      emblem: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
      svg: 'w-7 h-7 sm:w-8 sm:h-8',
      mainText: 'text-2xl sm:text-3xl font-black',
      tagText: 'text-xs px-2 py-0.5',
      tagline: 'text-xs',
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-2 sm:gap-3 group select-none ${className}`}>
      
      {/* 3D Isometric Glowing Gift Emblem */}
      <div 
        className={`relative ${sizeMap.emblem} bg-gradient-to-br from-[#1b3b2b] via-[#047857] to-[#10b981] p-0.5 flex items-center justify-center shrink-0 shadow-md shadow-emerald-900/15 border border-emerald-400/25 group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300`}
      >
        {/* Ambient Top Glow Layer */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none" />

        {/* Vector 3D Parcel Icon with Ribbon & Sparkle */}
        <svg 
          className={`${sizeMap.svg} text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110`} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fp-top" x1="16" y1="3" x2="16" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="fp-left" x1="5" y1="11" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="fp-right" x1="16" y1="11" x2="27" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#047857" />
              <stop offset="1" stopColor="#022c22" />
            </linearGradient>
            <linearGradient id="fp-ribbon" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="0.5" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Left Side */}
          <path d="M5 11.5L16 18V29L5 22.5V11.5Z" fill="url(#fp-left)" />
          
          {/* Right Side */}
          <path d="M16 18L27 11.5V22.5L16 29V18Z" fill="url(#fp-right)" />
          
          {/* Top Face */}
          <path d="M16 4L27 10.5L16 17L5 10.5L16 4Z" fill="url(#fp-top)" />

          {/* Ribbon Stripes on Top Face */}
          <path d="M13.8 5.2L24.8 11.7L23 12.8L12 6.3L13.8 5.2Z" fill="url(#fp-ribbon)" opacity="0.95" />
          <path d="M18.2 5.2L7.2 11.7L9 12.8L20 6.3L18.2 5.2Z" fill="url(#fp-ribbon)" opacity="0.95" />

          {/* Left Vertical Ribbon */}
          <path d="M9.2 14.1V25.1L11.2 26.3V15.3L9.2 14.1Z" fill="url(#fp-ribbon)" opacity="0.95" />

          {/* Right Vertical Ribbon */}
          <path d="M20.8 15.3V26.3L22.8 25.1V14.1L20.8 15.3Z" fill="url(#fp-ribbon)" opacity="0.95" />

          {/* Golden Sparkle Star */}
          <path 
            d="M25 2L26 4.8L29 5.8L26 6.8L25 9.6L24 6.8L21 5.8L24 4.8L25 2Z" 
            fill="#fef08a" 
            className="animate-pulse"
          />
        </svg>

        {/* Mini Accent Dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-xs" />
      </div>

      {/* Brand Text Block */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span 
            className={`tracking-tight ${sizeMap.mainText} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Free<span className="text-[#059669]">Products</span>
          </span>

          {/* Sleek Pill Badge for .online */}
          <span 
            className={`font-black uppercase tracking-wider rounded-md border shadow-2xs ${sizeMap.tagText} ${
              isDark 
                ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40' 
                : 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25'
            }`}
          >
            .online
          </span>
        </div>

        {/* Micro Tagline */}
        {showTagline && (
          <div 
            className={`hidden sm:flex items-center gap-1.5 font-semibold leading-none mt-1 ${sizeMap.tagline} ${
              isDark ? 'text-emerald-300/80' : 'text-emerald-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">100% Free Amazon Review Perks</span>
          </div>
        )}
      </div>

    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};
