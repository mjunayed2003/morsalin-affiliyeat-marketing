'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { BrandLogo } from '@/components/BrandLogo';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { 
  FaStar,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaComments,
  FaPaperPlane,
  FaImage,
  FaExpand,
  FaShieldHalved,
  FaAward,
  FaBoxOpen,
  FaLocationDot,
  FaArrowUpRightFromSquare,
  FaTag,
  FaCopy,
  FaShareNodes,
  FaLink,
  FaTelegram,
  FaLock,
  FaTrash,
  FaPenToSquare,
  FaThumbsUp
} from 'react-icons/fa6';
import { FaWhatsapp, FaAmazon, FaStore } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface ClientProductViewProps {
  productId: string;
}

// Pastel category badges map
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  'Skincare': { bg: 'bg-[#faebe6]', text: 'text-[#b85d43]' },
  'Tech': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Food & Beverage': { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
  'Home': { bg: 'bg-[#e0f2fe]', text: 'text-[#075985]' },
  'Lifestyle': { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]' },
  'Accessories': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]' },
  'Smart Gadgets': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Mobile Accessories': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Electronics': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Fashion & Lifestyle': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Pet Supplies': { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]' },
  'Home & Garden': { bg: 'bg-[#f0fdfa]', text: 'text-[#115e59]' },
  'Beauty & Personal Care': { bg: 'bg-[#fff1f2]', text: 'text-[#9f1239]' },
};

export const ClientProductView: React.FC<ClientProductViewProps> = ({ productId }) => {
  const { getProductById, messages, sendCustomerMessage, showToast, openShareModal, addReview, deleteReview, getProductReviews } = useApp();
  const { isAuthModalOpen, closeAuthModal, isAuthenticated, user, openAuthModal } = useAuth();
  const product = getProductById(productId);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previewChatImage, setPreviewChatImage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFilter, setReviewFilter] = useState<number | 'ALL'>('ALL');
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset active image when productId changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [productId]);

  // Auto-scroll inside chat feed only (prevents whole page from jumping down to bottom)
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages, selectedImage]);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50/40 text-slate-900 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center p-6 text-center my-16">
          <div className="w-16 h-16 rounded-3xl bg-stone-200 text-stone-600 flex items-center justify-center mb-4">
            <FaBoxOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-600 max-w-sm mb-6">
            The requested product may have expired or was removed from the catalog.
          </p>
          <Link
            href="/"
            className="bg-[#1b3b2b] hover:bg-[#142e20] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            ← Return to Home Catalog
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [product.image];
  const currentDisplayImage = galleryImages[activeImageIndex] || product.image;

  const badgeStyle = CATEGORY_STYLES[product.category] || { 
    bg: 'bg-stone-100', 
    text: 'text-stone-700' 
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    sendCustomerMessage(
      inputText.trim() || `I want to order: ${product.title}`,
      selectedImage || undefined,
      {
        title: product.title,
        price: product.price,
        image: product.image
      }
    );

    setInputText('');
    setSelectedImage(null);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const cleanPhone = '8801340376081';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello! I am inquiring about: ${product.title} (Price: $${product.price})\nStore: ${product.store || 'FreeProducts.online'}\nProduct Page: ${currentUrl}`
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(
    `🔥 Free Amazon Review Perk: ${product.title} (Est. Amazon Retail: $${product.originalPrice})`
  )}`;

  // Review calculations & handlers
  const productReviews = getProductReviews(product.id);
  const totalReviewsCount = productReviews.length;
  const averageRating = totalReviewsCount > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : (product.rating || 5.0).toFixed(1);

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach((r) => {
    const val = Math.max(1, Math.min(5, Math.round(r.rating)));
    starCounts[val] = (starCounts[val] || 0) + 1;
  });

  const filteredProductReviews = productReviews.filter((r) => {
    if (reviewFilter === 'ALL') return true;
    return Math.round(r.rating) === reviewFilter;
  });

  const canUserReview = isAuthenticated && (user?.role === 'admin' || user?.canReview === true);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUserReview) {
      showToast('Review access restricted: Admin authorization is required.');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please enter your review comments.');
      return;
    }

    const res = addReview({
      productId: product.id,
      rating: reviewRating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
    });

    if (res.success) {
      setReviewComment('');
      setReviewTitle('');
      setReviewRating(5);
      setIsWritingReview(false);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleAmazonLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      showToast('Please sign in or create an account to view and claim the Amazon review perk.');
      openAuthModal('login');
    }
  };

  const handleCopyProductLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      showToast('Website product link copied! Ready to share with anyone.');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleShareProduct = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        if (product.image && navigator.canShare) {
          try {
            const res = await fetch(product.image, { mode: 'cors' });
            if (res.ok) {
              const blob = await res.blob();
              const file = new File([blob], `${product.id}.jpg`, { type: blob.type || 'image/jpeg' });
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                  title: product.title,
                  text: `🔥 Free Amazon Review Perk: ${product.title}\nEst. Retail: $${product.originalPrice}\nClaim free unit: ${currentUrl}`,
                  files: [file],
                });
                showToast('Product shared with image successfully!');
                return;
              }
            }
          } catch (fileErr) {
            // fallback to standard share
          }
        }
        await navigator.share({
          title: product.title,
          text: `🔥 Free Amazon Review Perk: ${product.title}\nEst. Retail: $${product.originalPrice}\nClaim free unit: ${currentUrl}`,
          url: currentUrl,
        });
        showToast('Product link shared successfully!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          openShareModal(product);
        }
      }
    } else {
      openShareModal(product);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/40 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans">
      
      {/* Top Main Navbar */}
      <Navbar />

      {/* Auth Modal for account actions */}
      <AuthModal />

      {/* Lightbox for zooming main product image */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
            >
              <FiX className="w-6 h-6" />
            </button>
            <img
              src={currentDisplayImage}
              alt={product.title}
              className="max-h-[85vh] w-auto object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Lightbox for chat attachment zoom */}
      {previewChatImage && (
        <div 
          onClick={() => setPreviewChatImage(null)}
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh]">
            <button
              onClick={() => setPreviewChatImage(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800 p-2 rounded-full cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={previewChatImage}
              alt="Zoomed Attachment"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <FaArrowLeft className="w-3 h-3" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {product.store && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                <FaStore className="w-3 h-3 text-amber-600" />
                <span>Store: {product.store}</span>
              </span>
            )}
            <span className="bg-white border border-stone-200/80 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 shadow-2xs">
              ID: {product.id}
            </span>
          </div>
        </div>

        {/* 2-Column Product Showcase & Live Messaging Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Product Showcase & Overview (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Product Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-stone-200/80 shadow-2xs space-y-4 sm:space-y-5">
              
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden bg-[#f8f7f4] group cursor-pointer border border-stone-100 flex items-center justify-center" 
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={currentDisplayImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />

                {/* Badge Pills in Top Left */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <span className="bg-[#1b3b2b] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                    <span>Amazon Review Perk</span>
                  </span>
                </div>

                {/* Click to Zoom indicator */}
                <div className="absolute bottom-3.5 right-3.5 bg-slate-900/80 text-white text-xs font-semibold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                  <FaExpand className="w-3 h-3 text-stone-200" />
                  <span>Click to Zoom</span>
                </div>
              </div>

              {/* Multi-angle Gallery Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Product Photos ({galleryImages.length} angles):
                  </p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-[#f8f7f4] ${
                          activeImageIndex === idx
                            ? 'border-[#1b3b2b] ring-2 ring-[#1b3b2b]/30 shadow-xs scale-102'
                            : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Category Row */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${badgeStyle.bg} ${badgeStyle.text}`}>
                    {product.category}
                  </span>
                  {product.store && (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <FaStore className="w-3 h-3 text-amber-600" />
                      <span>Store: {product.store}</span>
                    </span>
                  )}
                  {/* Rating Score Badge */}
                  <a
                    href="#reviews"
                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg text-xs border border-amber-200/60 transition-colors ml-auto"
                    title="Jump to Customer Reviews"
                  >
                    <FaStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{averageRating}</span>
                    <span className="text-slate-500 font-normal">({totalReviewsCount} reviews)</span>
                  </a>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug tracking-tight">
                  {product.title}
                </h1>

                {/* Pricing & Free Review Card */}
                <div className="p-4 sm:p-5 bg-[#fafaf8] rounded-2xl border border-stone-200/80 space-y-3.5">
                  <div className="flex flex-wrap items-baseline gap-3">
                    {product.price === 0 ? (
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#1b3b2b]">
                        FREE
                      </span>
                    ) : (
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                        ${product.price.toLocaleString()}
                      </span>
                    )}
                    {product.originalPrice > 0 && (
                      <span className="text-base text-slate-400 line-through font-semibold">
                        Est. Amazon Retail: ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                      <span>100% Free Amazon Review Perk</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Test this product at zero cost, share your honest review on Amazon, and keep the item forever.
                  </p>

                  {/* Amazon, WhatsApp & Telegram Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
                    {product.amazonUrl && (
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleAmazonLinkClick}
                        className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer border ${
                          isAuthenticated
                            ? 'bg-[#ff9900] hover:bg-[#eb8c00] active:scale-98 text-slate-950 border-[#e08500]'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                        }`}
                        title={isAuthenticated ? `View on Amazon (${product.store || 'Store'})` : 'Sign in to access Amazon review link'}
                      >
                        <FaAmazon className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>
                          {isAuthenticated
                            ? `View on Amazon (${product.store || 'Store'})`
                            : `Sign In to View on Amazon`}
                        </span>
                        {isAuthenticated ? (
                          <FaArrowUpRightFromSquare className="w-3 h-3 opacity-75 shrink-0" />
                        ) : (
                          <FaLock className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                        )}
                      </a>
                    )}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                    >
                      <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Order</span>
                    </a>
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white hover:bg-sky-50 border border-sky-300 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                    >
                      <FaTelegram className="w-4 h-4 text-[#229ED9]" />
                      <span>Telegram</span>
                    </a>
                  </div>

                  {/* Website Product Link & Sharing Box */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FaLink className="w-3 h-3 text-[#1b3b2b]" />
                        <span>Website Product Link (Share with any person):</span>
                      </span>
                      {isCopied && (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 animate-in fade-in">
                          <FaCheck className="w-3 h-3" />
                          <span>Link Copied!</span>
                        </span>
                      )}
                    </div>

                    {/* Rich Product Image Preview Card for Sharing */}
                    <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200 shadow-2xs">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded">
                          Image
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                          Preview attached when shared
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {product.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          100% Free Amazon Review Perk • Est. ${product.originalPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          readOnly
                          value={currentUrl}
                          className="w-full bg-stone-50 hover:bg-stone-100/80 text-slate-700 text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 font-mono select-all focus:outline-none focus:border-stone-400 transition-colors"
                        />
                      </div>

                      {/* Copy Product Link Button */}
                      <button
                        type="button"
                        onClick={handleCopyProductLink}
                        className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs ${
                          isCopied 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-[#1b3b2b] hover:bg-[#28573f] text-white active:scale-95'
                        }`}
                        title="Copy direct product link"
                      >
                        {isCopied ? <FaCheck className="w-3.5 h-3.5" /> : <FaCopy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied!' : 'Copy Product Link'}</span>
                      </button>

                      {/* Share Option Button */}
                      <button
                        type="button"
                        onClick={handleShareProduct}
                        className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-lg text-xs font-bold bg-[#0d5bff] hover:bg-[#0047d4] text-white transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
                        title="Share this product link with any person"
                      >
                        <FaShareNodes className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Instant Share Channels */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="text-[11px] font-medium">Quick Share:</span>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-[11px] transition-colors"
                          title="Share to WhatsApp"
                        >
                          <FaWhatsapp className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={telegramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium text-[11px] transition-colors"
                          title="Share to Telegram"
                        >
                          <FaTelegram className="w-3 h-3 text-[#229ED9]" />
                          <span>Telegram</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => openShareModal(product)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-slate-700 hover:bg-stone-200 font-medium text-[11px] transition-colors cursor-pointer"
                          title="Open full promotional preview and share options"
                        >
                          <FaShareNodes className="w-3 h-3 text-blue-600" />
                          <span>More Share Options</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Product Overview Section */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Key Features & Specifications */}
              <div className="pt-3 border-t border-stone-100 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Specifications & Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-[#fafaf8] p-3 rounded-xl border border-stone-200/70 font-medium">
                      <FaCheck className="w-3.5 h-3.5 text-[#1b3b2b] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 Value Propositions (matching Home Page aesthetic) */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaBoxOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Free Product</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">No hidden fee</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaShieldHalved className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">100% Genuine</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Original sealed</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaAward className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Keep & Review</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Real rewards</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fafaf8] p-2.5 rounded-xl border border-stone-200/60">
                  <div className="w-7 h-7 rounded-full bg-stone-200/70 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FaLocationDot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">USA Based</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Fast shipping</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Chat with Admin / Concierge Desk (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col h-[650px]">
              
              {/* Chat Header in Forest Green Brand Style */}
              <div className="bg-[#1b3b2b] text-white p-4.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#264e3b] flex items-center justify-center font-bold text-white text-sm">
                      <FaComments className="w-4 h-4 text-emerald-300" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1b3b2b] animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">
                      Live Chat with Admin
                    </h3>
                    <p className="text-[11px] text-emerald-200 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Support Online • Message Anytime
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-900/60 hover:bg-emerald-800 text-white rounded-xl transition-colors shadow-xs"
                    title="Open in WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4 text-emerald-300" />
                  </a>
                </div>
              </div>

              {/* Product Reference Bar */}
              <div className="p-3 bg-[#fafaf8] border-b border-stone-200/80 flex items-center gap-2.5 shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs font-semibold">
                  <p className="font-bold text-slate-900 truncate">{product.title}</p>
                  <p className="text-[#1b3b2b] font-bold">
                    {product.price === 0 ? 'FREE Member Perk' : `$${product.price}`}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                  Active Item
                </span>
              </div>

              {/* Message Feed */}
              <div ref={chatFeedRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfbfa] custom-scrollbar">
                {messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-semibold">
                        {isCustomer ? 'You (Client)' : 'Admin Support'}
                      </span>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs font-medium ${
                          isCustomer
                            ? 'bg-[#1b3b2b] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-stone-200/90'
                        }`}
                      >
                        {msg.image && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                            <img
                              src={msg.image}
                              alt="Attachment"
                              onClick={() => setPreviewChatImage(msg.image || null)}
                              className="max-h-44 w-auto object-cover rounded-lg cursor-pointer hover:opacity-95"
                            />
                            <p className="text-[10px] mt-1 opacity-80 text-center font-semibold">
                              (Click to zoom)
                            </p>
                          </div>
                        )}

                        {msg.text && (
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-medium">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Prompt suggestions for client */}
              <div className="px-3 py-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar font-medium">
                <button
                  onClick={() => sendCustomerMessage(`Hello! I want to apply to test & review "${product.title}" on Amazon.`)}
                  className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  I want to test & review this on Amazon
                </button>
                <button
                  onClick={() => sendCustomerMessage(`How does Amazon Prime shipping and review verification work for ${product.title}?`)}
                  className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Amazon Prime delivery question?
                </button>
                <button
                  onClick={() => sendCustomerMessage(`Can you provide the Amazon store link and instructions for ${product.title}?`)}
                  className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Get Amazon store link
                </button>
              </div>

              {/* Attached Image Preview Before Sending */}
              {selectedImage && (
                <div className="p-2.5 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 shrink-0">
                  <img
                    src={selectedImage}
                    alt="Upload preview"
                    className="w-11 h-11 object-cover rounded-lg border border-emerald-300"
                  />
                  <span className="text-xs text-emerald-900 font-bold flex-1">
                    Photo attached. Ready to send.
                  </span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-md cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input Form with Image Attachment Button */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-[#1b3b2b] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Attach screenshot or photo"
                >
                  <FaImage className="w-4 h-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                <input
                  type="text"
                  placeholder="Type a message to admin..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#fafaf8] text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] placeholder:text-slate-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImage}
                  className="p-2.5 bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                  title="Send message"
                >
                  <FaPaperPlane className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* Full-width Customer Reviews Section */}
        <section id="reviews" className="mt-14 pt-8 border-t border-stone-200/90 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Community Feedback</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Verified Customer Reviews
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic feedback from verified Amazon testers and FreeProducts.online members.
              </p>
            </div>

            {/* Quick Action Button */}
            {canUserReview && (
              <button
                type="button"
                onClick={() => setIsWritingReview((prev) => !prev)}
                className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <FaPenToSquare className="w-3.5 h-3.5" />
                <span>{isWritingReview ? 'Close Review Form' : 'Write a Customer Review'}</span>
              </button>
            )}
          </div>

          {/* Rating Summary Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Average Rating Big Display (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-stone-100 md:pr-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{averageRating}</span>
                  <span className="text-lg font-bold text-slate-400">/ 5.0</span>
                </div>

                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(Number(averageRating))
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs font-semibold text-slate-700">
                  Based on {totalReviewsCount} verified review{totalReviewsCount === 1 ? '' : 's'}
                </p>
                <span className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  100% Verified Reviewers
                </span>
              </div>

              {/* Star Breakdown Progress Bars (5 cols) */}
              <div className="md:col-span-5 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = starCounts[stars] || 0;
                  const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 w-14 shrink-0 font-semibold text-slate-700">
                        <span>{stars}</span>
                        <FaStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-slate-400 font-mono text-[11px]">{pct}%</span>
                      <span className="w-6 text-right text-slate-500 font-semibold text-[11px]">({count})</span>
                    </div>
                  );
                })}
              </div>

              {/* Review Permission Status Card (3 cols) */}
              <div className="md:col-span-3 bg-[#fafaf8] rounded-2xl border border-stone-200/80 p-4 flex flex-col justify-between h-full">
                {canUserReview ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                      <FaCheck className="w-3.5 h-3.5" />
                      <span>Reviewer Status: Authorized</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      You are an approved reviewer. Share your experience with photos and feedback.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(true)}
                      className="w-full bg-[#1b3b2b] hover:bg-[#142e20] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Write Review
                    </button>
                  </div>
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                      <FaLock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Review Permission Restricted</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Admin review permission is required to post. Contact admin via chat to request access.
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      <span>Request Access via WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                      <FaLock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tester Sign In Required</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Log in to check your verified reviewer authorization status.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="w-full bg-[#1b3b2b] hover:bg-[#142e20] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Sign In to Review
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Write a Review Form */}
          {isWritingReview && (
            <div className="bg-[#fafaf8] rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Write Your Review for {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your feedback helps other members test and evaluate products.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Overall Rating:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setReviewHoverRating(star)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <FaStar
                            className={`w-6 h-6 transition-colors ${
                              (reviewHoverRating || reviewRating) >= star
                                ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {reviewRating === 5 && '5 - Excellent (Highly Recommended)'}
                      {reviewRating === 4 && '4 - Very Good'}
                      {reviewRating === 3 && '3 - Good'}
                      {reviewRating === 2 && '2 - Fair'}
                      {reviewRating === 1 && '1 - Poor'}
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Review Headline:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solid build quality, our dog learned the bell on day 2!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Detailed Experience & Feedback: *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how the product performed, build quality, shipping time, ease of setup, or testing results..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs sm:text-sm p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!reviewComment.trim()}
                    className="bg-[#1b3b2b] hover:bg-[#142e20] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-40 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setReviewFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  reviewFilter === 'ALL'
                    ? 'bg-[#1b3b2b] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                All ({totalReviewsCount})
              </button>
              {[5, 4, 3, 2, 1].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setReviewFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    reviewFilter === st
                      ? 'bg-[#1b3b2b] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{st}</span>
                  <FaStar className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] opacity-75 font-mono">({starCounts[st] || 0})</span>
                </button>
              ))}
            </div>

            {user?.role === 'admin' && (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                Admin Mode: You can delete any review below
              </span>
            )}
          </div>

          {/* Reviews List */}
          {filteredProductReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center text-slate-400 space-y-2">
              <FaStar className="w-10 h-10 text-stone-200 mx-auto" />
              <p className="font-bold text-slate-700">No reviews found in this filter.</p>
              <p className="text-xs">Be the first to share your experience with this item!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProductReviews.map((rev) => {
                const isHelpful = !!helpfulMap[rev.id];
                return (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-3 transition-all hover:border-stone-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.userName)}&backgroundColor=1b3b2b`}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900">{rev.userName}</h4>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <FaCheck className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Verified Reviewer</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[1, 2, 3, 4, 5].map((st) => (
                                <FaStar
                                  key={st}
                                  className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400' : 'text-stone-200'}`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Delete Action */}
                      {(user?.role === 'admin' || user?.id === rev.userId) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          title="Delete review (Admin action)"
                        >
                          <FaTrash className="w-3 h-3" />
                          <span>Delete Review</span>
                        </button>
                      )}
                    </div>

                    {rev.title && (
                      <h5 className="font-bold text-slate-900 text-sm leading-snug">
                        {rev.title}
                      </h5>
                    )}

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                      {rev.comment}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => toggleHelpful(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isHelpful
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'hover:bg-stone-100 text-slate-600'
                        }`}
                      >
                        <FaThumbsUp className={`w-3 h-3 ${isHelpful ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{isHelpful ? 'Helpful (1)' : 'Helpful'}</span>
                      </button>

                      <span className="text-[11px] text-slate-400">
                        FreeProducts.online Tester Network
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </section>

      </main>

      {/* Footer (matching Home Page) */}
      <footer className="bg-white border-t border-stone-200/80 py-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-5 font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <Link href="/products" className="hover:text-slate-900">Products</Link>
            <Link href="/#how-it-works" className="hover:text-slate-900">How It Works</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <p>© 2026 FreeProducts.online. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
