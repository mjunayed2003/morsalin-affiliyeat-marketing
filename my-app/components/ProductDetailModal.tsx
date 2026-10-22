'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaStar, 
  FaTag, 
  FaCheck, 
  FaTruckFast, 
  FaShieldHalved, 
  FaClock, 
  FaComments,
  FaArrowUpRightFromSquare,
  FaCopy,
  FaShareNodes,
  FaLink,
  FaTelegram,
  FaLock,
  FaTrash
} from 'react-icons/fa6';
import { FaFacebookMessenger, FaAmazon, FaStore, FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Product } from '../app/types';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';

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
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { getProductReviews, deleteReview, showToast } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://freeproducts.online';
  const productPageUrl = `${origin}/p/${product.id}`;
  const cleanPhone = '8801340376081';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello! I want to order/review: ${product.title}\nProduct: ${productPageUrl}`
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productPageUrl)}&text=${encodeURIComponent(
    `🔥 Free Amazon Review Perk: ${product.title}`
  )}`;

  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal('login');
    }
  };

  const handleCopyProductLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(productPageUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const galleryImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [product.image];
  const currentDisplayImage = galleryImages[activeImageIndex] || product.image;

  const discountAmount = product.originalPrice - product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {product.category}
            </span>
            {product.store && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                <FaStore className="w-3 h-3 text-amber-700" />
                <span>Store: {product.store}</span>
              </span>
            )}
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
        <div className="p-4 sm:p-6 max-h-[82dvh] sm:max-h-[75vh] overflow-y-auto custom-scrollbar overscroll-contain space-y-4 sm:space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image Preview & Gallery */}
            <div className="space-y-2.5">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={currentDisplayImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-200"
                />
                {product.commission && (
                  <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                    <FaTag className="w-3 h-3 text-emerald-200" />
                    <span>Bonus: {product.commission.replace(/৳/g, '$')}</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 custom-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-13 h-13 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-slate-50 ${
                        activeImageIndex === idx
                          ? 'border-[#1b3b2b] ring-2 ring-[#1b3b2b]/30'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-baseline gap-2">
                  {product.price === 0 ? (
                    <span className="text-2xl font-black text-[#1b3b2b]">
                      FREE
                    </span>
                  ) : (
                    <span className="text-2xl font-black text-slate-950">
                      ${product.price.toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      Est. Retail: ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                    <span>Amazon Review Perk</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Availability: <span className="text-emerald-700 font-semibold">Available for Review & Keep on Amazon</span>
                </p>

                {product.amazonUrl && (
                  <div className="pt-2 border-t border-stone-200/80 space-y-2">
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleAmazonClick}
                      className={`flex items-center justify-center gap-2 w-full font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer border ${
                        isAuthenticated
                          ? 'bg-[#ff9900] hover:bg-[#ea8b00] active:scale-[0.99] text-slate-950 border-[#e08500]'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                      }`}
                      title={isAuthenticated ? 'View Product on Amazon' : 'Sign in to access Amazon review link'}
                    >
                      <FaAmazon className="w-4 h-4 text-slate-950 shrink-0" />
                      <span>{isAuthenticated ? 'View Product on Amazon' : 'Sign In to View on Amazon'}</span>
                      {isAuthenticated ? (
                        <FaArrowUpRightFromSquare className="w-3 h-3 opacity-75 shrink-0" />
                      ) : (
                        <FaLock className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                      )}
                    </a>
                    {product.store && (
                      <p className="text-[11px] text-slate-500 text-center">
                        Sold by <span className="font-bold text-slate-800">{product.store}</span> on Amazon
                      </p>
                    )}
                  </div>
                )}

                {/* WhatsApp & Telegram Order Links */}
                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Order</span>
                  </a>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <FaTelegram className="w-3.5 h-3.5 text-[#229ED9]" />
                    <span>Telegram</span>
                  </a>
                </div>

                {/* Website Product Link & Copy/Share Box */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <FaLink className="w-3 h-3 text-[#1b3b2b]" />
                      <span>Website Product Link (Share with anyone):</span>
                    </span>
                    {isCopied && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <FaCheck className="w-3 h-3" />
                        <span>Copied!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={productPageUrl}
                      className="flex-1 bg-white text-slate-700 text-xs px-3 py-2 rounded-lg border border-stone-200 font-mono select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyProductLink}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isCopied ? 'bg-emerald-600 text-white' : 'bg-[#1b3b2b] hover:bg-[#28573f] text-white'
                      }`}
                    >
                      {isCopied ? <FaCheck className="w-3 h-3" /> : <FaCopy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenShare(product)}
                      className="px-3 py-2 rounded-lg text-xs font-bold bg-[#0d5bff] hover:bg-[#0047d4] text-white transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <FaShareNodes className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
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

          {/* Customer Reviews Preview inside Modal */}
          {(() => {
            const productReviews = getProductReviews(product.id);
            return (
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Verified Reviews ({productReviews.length})
                    </h4>
                  </div>
                  <a
                    href={`/p/${product.id}#reviews`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>Write Review / View All</span>
                    <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
                  </a>
                </div>

                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-1">No reviews yet for this product.</p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {productReviews.map((rev) => (
                      <div key={rev.id} className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((st) => (
                                <FaStar
                                  key={st}
                                  className={`w-2.5 h-2.5 ${st <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                            {user?.role === 'admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  deleteReview(rev.id);
                                  showToast('Review deleted.');
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                title="Admin delete review"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        {rev.title && <p className="font-semibold text-slate-800">{rev.title}</p>}
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
            <div className="flex flex-col items-center gap-1 text-slate-700">
              <FaTruckFast className="w-4 h-4 text-[#0d5bff]" />
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
              <span className="text-[10px] text-slate-500">Direct Chat with Admin</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenShare(product);
              }}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <FaFacebookMessenger className="w-4 h-4" />
              <span>Messenger Share</span>
            </button>
            <a
              href={`/p/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-slate-900 font-bold px-3 py-2.5 rounded-xl hover:bg-slate-200/70 transition-colors"
            >
              Dedicated Page ↗
            </a>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {product.amazonUrl && (
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#ea8b00] active:scale-95 text-slate-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer border border-[#e08500]"
              >
                <FaAmazon className="w-4 h-4" />
                <span>Buy on Amazon</span>
              </a>
            )}
            <button
              onClick={() => {
                onClose();
                onInquire(product);
              }}
              className="flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <FaComments className="w-4 h-4" />
              <span>Apply & Chat with Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
