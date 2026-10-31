'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { getCategoryStyle } from '@/lib/constants';
import { FaStar } from 'react-icons/fa6';
import { FaAmazon, FaStore } from 'react-icons/fa';

export interface ProductCardProps {
  product: Product;
  showRating?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showRating = false,
  className = '',
}) => {
  const badgeStyle = getCategoryStyle(product.category);

  return (
    <div
      className={`group bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 hover:border-stone-300 p-2.5 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div>
        {/* Product Image Link */}
        <Link
          href={`/p/${product.id}`}
          className="block relative w-full aspect-4/3 rounded-lg sm:rounded-xl bg-[#f8f7f4] overflow-hidden mb-2 sm:mb-4 cursor-pointer flex items-center justify-center group/img"
          title={`View ${product.title}`}
        >
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer ${
              !product.inStock ? 'opacity-75' : ''
            }`}
            loading="lazy"
          />

          {/* Stock Out Badge */}
          {!product.inStock && (
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-rose-600 text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-xs z-10">
              Stock Out
            </div>
          )}

          {/* Promotional / Custom Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-slate-900/90 text-white font-semibold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-xs">
              {product.badge}
            </div>
          )}
        </Link>

        {/* Category Pill, Store & Rating */}
        <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span
              className={`inline-block px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold ${badgeStyle.bg} ${badgeStyle.text} truncate max-w-[85px] sm:max-w-none`}
            >
              {product.category}
            </span>

            {product.store && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 truncate max-w-[80px] sm:max-w-none">
                <FaStore className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-amber-600 shrink-0" />
                <span className="truncate">{product.store}</span>
              </span>
            )}
          </div>

          {showRating && (
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold text-[10px] sm:text-xs shrink-0">
              <FaStar className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">
                ({product.reviewsCount})
              </span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <Link
          href={`/p/${product.id}`}
          className="block font-bold text-slate-900 text-xs sm:text-base leading-snug hover:text-[#1b3b2b] transition-colors cursor-pointer line-clamp-2 sm:line-clamp-1"
        >
          {product.title}
        </Link>

        {/* Subcategory / Niche Description */}
        <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
          {product.subCategory || (product.description ? product.description.slice(0, 50) + '...' : 'Quality Selection')}
        </p>
      </div>

      {/* Action Buttons: "Get It Free" + "Amazon" */}
      <div className="pt-2.5 sm:pt-5 flex items-center gap-1.5 sm:gap-2">
        {product.inStock ? (
          <Link
            href={`/p/${product.id}`}
            className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm bg-[#1b3b2b] hover:bg-[#142e20] text-white transition-all duration-200 cursor-pointer shadow-2xs text-center whitespace-nowrap"
          >
            <span className="sm:hidden">Get Free</span>
            <span className="hidden sm:inline">Get It Free</span>
          </Link>
        ) : (
          <Link
            href={`/p/${product.id}`}
            className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm bg-rose-100 text-rose-800 hover:bg-rose-200 transition-all duration-200 cursor-pointer shadow-2xs text-center whitespace-nowrap"
          >
            <span>Stock Out</span>
          </Link>
        )}

        {product.amazonUrl && (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs border transition-all duration-200 inline-flex items-center justify-center gap-1 shadow-2xs cursor-pointer shrink-0 bg-[#fff8e7] hover:bg-[#ff9900] text-[#92400e] hover:text-slate-950 border-amber-300 hover:border-[#e08500]"
            title={`View on Amazon (${product.store || 'Amazon'})`}
          >
            <FaAmazon className="w-3.5 h-3.5 text-[#e08500]" />
            <span className="hidden sm:inline">Amazon</span>
            <span className="sm:hidden">🛒</span>
          </a>
        )}
      </div>
    </div>
  );
};

