'use client';

import React from 'react';
import { 
  FaStar, 
  FaTag, 
  FaCheck, 
  FaTruckFast, 
  FaShieldHalved, 
  FaClock, 
  FaComments
} from 'react-icons/fa6';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onInquire: (product: Product) => void;
  onOpenShare: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onInquire,
  onOpenShare
}) => {
  if (!isOpen || !product) return null;

  const discountAmount = product.originalPrice - product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image Preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                <FaTag className="w-3 h-3 text-emerald-200" />
                <span>Affiliate Commission: {product.commission}</span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold mb-1">
                  <FaStar className="w-4 h-4 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} Customer Reviews)</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Price Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-950">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {discountAmount > 0 && (
                    <span className="ml-auto text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                      Save ৳{discountAmount.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Availability: <span className="text-emerald-600 font-semibold">In Stock (Ready to Ship)</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Product Overview:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications / Features */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Key Specifications:
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
            <div className="flex flex-col items-center gap-1 text-slate-700">
              <FaTruckFast className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">Fast Delivery</span>
              <span className="text-[10px] text-slate-500">Nationwide Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-700">
              <FaShieldHalved className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">100% Genuine</span>
              <span className="text-[10px] text-slate-500">Quality Checked</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-700">
              <FaClock className="w-4 h-4 text-amber-600" />
              <span className="font-semibold">Live Support</span>
              <span className="text-[10px] text-slate-500">Direct Chat Desk</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenShare(product);
            }}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            <FaFacebookMessenger className="w-4 h-4" />
            <span>Messenger Share Preview</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onInquire(product);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FaComments className="w-4 h-4" />
              <span>Inquire via Chat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
