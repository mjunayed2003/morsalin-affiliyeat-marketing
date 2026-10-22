'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  clickable = true,
  className = '',
}) => {
  const isDark = variant === 'dark';

  // Size configurations for logo.jpeg (aspect ratio ~3:1) - optimized for mobile responsiveness
  const sizeMap = {
    sm: {
      img: 'h-8 sm:h-9',
    },
    md: {
      img: 'h-9 sm:h-12 lg:h-14',
    },
    lg: {
      img: 'h-12 sm:h-16',
    },
  }[size];

  const content = (
    <div className={`flex items-center group select-none ${className}`}>
      <div 
        className={`flex items-center shrink-0 transition-transform duration-300 group-hover:scale-102 ${
          isDark ? 'bg-white p-1 rounded-xl shadow-xs' : ''
        }`}
      >
        <img
          src="/logo.jpeg"
          alt="FreeProducts.online - Amazon Product Reviews & Free Testing Club USA"
          title="FreeProducts.online - Test Free Amazon Products"
          className={`${sizeMap.img} w-auto object-contain max-w-[145px] sm:max-w-[240px] md:max-w-[280px]`}
          loading="eager"
        />
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-flex shrink-0 items-center">
        {content}
      </Link>
    );
  }

  return content;
};


