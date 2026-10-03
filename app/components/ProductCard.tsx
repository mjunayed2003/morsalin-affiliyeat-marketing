'use client';

import React from 'react';
import { 
  FiShare2, 
  FiMessageCircle, 
  FiCopy, 
  FiStar, 
  FiCheck,
  FiArrowRight,
  FiTag,
  FiShoppingBag
} from 'react-icons/fi';
import { FaFacebookMessenger } from 'react-icons/fa';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onOpenShare: (product: Product) => void;
  onInquire: (product: Product) => void;
  onCopyLink: (product: Product) => void;
  copiedId: string | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onOpenShare,
  onInquire,
  onCopyLink,
  copiedId
}) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image Section */}
      <div 
        onClick={() => onOpenDetail(product)} 
        className="relative w-full aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-slate-900/90 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}% ছাড়
            </span>
          )}
        </div>

        {/* Commission Tag (Bottom of image) */}
        <div className="absolute bottom-2.5 right-2.5 bg-emerald-600/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 backdrop-blur-xs">
          <FiTag className="w-3 h-3" />
          <span>কমিশন: {product.commission}</span>
        </div>
      </div>

      {/* Product Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-500">
            <span className="font-medium text-slate-600 uppercase text-[11px] tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors mb-2"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Key Bullet Feature */}
          {product.features && product.features.length > 0 && (
            <p className="text-xs text-slate-600 line-clamp-1 mb-3">
              • {product.features[0]}
            </p>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg sm:text-xl font-bold text-slate-950">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-slate-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="ml-auto text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
              ইন-স্টক
            </span>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          
          {/* Main Inquiry & Chat Action */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onInquire(product)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white py-2 px-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <FiMessageCircle className="w-3.5 h-3.5" />
              <span>ইনকোয়ারি করুন</span>
            </button>

            {/* Messenger Direct Share Button */}
            <button
              onClick={() => onOpenShare(product)}
              className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white py-2 px-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="মেসেঞ্জারে ছবি সহ শেয়ার করুন"
            >
              <FaFacebookMessenger className="w-3.5 h-3.5" />
              <span>শেয়ার প্রিভিউ</span>
            </button>
          </div>

          {/* Sub Row: Copy Affiliate Link & Details */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <button
              onClick={() => onCopyLink(product)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                copiedId === product.id
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {copiedId === product.id ? (
                <>
                  <FiCheck className="w-3 h-3 text-emerald-600" />
                  <span>লিংক কপিড!</span>
                </>
              ) : (
                <>
                  <FiCopy className="w-3 h-3 text-slate-500" />
                  <span>অ্যাফিলিয়েট লিংক</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenDetail(product)}
              className="px-2 py-1.5 text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>বিস্তারিত</span>
              <FiArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
