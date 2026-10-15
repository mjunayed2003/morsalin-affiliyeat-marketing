'use client';

import React from 'react';
import { 
  FaStar, 
  FaTag, 
  FaCheck, 
  FaCopy, 
  FaArrowRight, 
  FaCommentDots,
  FaShareNodes
} from 'react-icons/fa6';
import { FaFacebookMessenger } from 'react-icons/fa';
import { Product } from '../app/types';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onOpenShare: (product: Product) => void;
  onInquire: (product: Product) => void;
  onCopyLink: (product: Product) => void;
  onOpenClientView: (product: Product) => void;
  copiedId: string | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onOpenShare,
  onInquire,
  onCopyLink,
  onOpenClientView,
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
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Commission Tag (Bottom of image) */}
        {product.commission && (
          <div className="absolute bottom-2.5 right-2.5 bg-emerald-600/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
            <FaTag className="w-3 h-3 text-emerald-200" />
            <span>Bonus: {product.commission.replace(/৳/g, '$')}</span>
          </div>
        )}
      </div>

      {/* Product Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <FaStar className="w-3.5 h-3.5 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-[#0d5bff] cursor-pointer transition-colors mb-2"
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
            <span className="text-xl sm:text-2xl font-black text-slate-950">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-slate-400 line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="ml-auto text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
              In Stock
            </span>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          
          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onInquire(product)}
              className="flex items-center justify-center gap-1.5 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-98 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Send direct message to admin about this item"
            >
              <FaCommentDots className="w-3.5 h-3.5" />
              <span>Message Admin</span>
            </button>

            {/* View Details Button */}
            <button
              onClick={() => onOpenDetail(product)}
              className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="View full specs and zoomed images"
            >
              <FaArrowRight className="w-3 h-3 text-slate-600" />
              <span>View Details</span>
            </button>
          </div>

          {/* Sub Row: Share & Direct Link */}
          <div className="flex items-center justify-between gap-1.5 pt-1 text-xs">
            <button
              onClick={() => onOpenShare(product)}
              className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-[11px] font-bold border border-sky-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Share photo to Messenger"
            >
              <FaFacebookMessenger className="w-3 h-3" />
              <span>Share</span>
            </button>

            <button
              onClick={() => onCopyLink(product)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                copiedId === product.id
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {copiedId === product.id ? (
                <>
                  <FaCheck className="w-3 h-3 text-emerald-600" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <FaCopy className="w-3 h-3 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
