'use client';

import React, { useState, useRef } from 'react';
import { 
  FiX, 
  FiCopy, 
  FiCheck, 
  FiShare2, 
  FiUpload, 
  FiImage, 
  FiDownload, 
  FiExternalLink,
  FiInfo,
  FiCheckCircle
} from 'react-icons/fi';
import { FaFacebookMessenger, FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import { Product } from '../types';

interface ShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  product,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !product) return null;

  // Compute shareable link with affiliate ref & product id
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://affilihub.com';
  const shareableUrl = `${origin}?product=${product.id}&ref=${product.affiliateCode || 'affiliate_direct'}`;
  
  // Active preview image (either custom uploaded or original product image)
  const activeImage = customImage || product.image;

  // Handle Custom Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('দয়া করে সঠিক ইমেজ ফাইল (JPG, PNG, WebP) সিলেক্ট করুন।');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string);
      setIsUploading(false);
      onShowToast('কাস্টম ছবি সফলভাবে যুক্ত হয়েছে! মেসেঞ্জার প্রিভিউতে দেখুন।');
    };
    reader.readAsDataURL(file);
  };

  // Copy Link to Clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    onShowToast('প্রোডাক্ট অ্যাফিলিয়েট লিংক কপি হয়েছে!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Copy Formatted Message (Caption + Link)
  const handleCopyFormattedPost = () => {
    const text = `🔥 ${product.title}\n\n💰 অফার প্রাইজ: ৳${product.price.toLocaleString()} (রেগুলার: ৳${product.originalPrice.toLocaleString()})\n✨ বৈশিষ্ট্য: ${product.features.join(', ')}\n\n👉 অর্ডার বা বিস্তারিত দেখতে ক্লিক করুন:\n${shareableUrl}`;
    navigator.clipboard.writeText(text);
    onShowToast('ক্যাপশন ও লিংক কপি হয়েছে! মেসেঞ্জারে পেস্ট করুন।');
  };

  // Direct Web Share API (with Image File if supported)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        // Try sharing with file if possible
        if (customImage && navigator.canShare) {
          // Convert data URI to Blob
          const res = await fetch(customImage);
          const blob = await res.blob();
          const file = new File([blob], `${product.id}-share.jpg`, { type: 'image/jpeg' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: product.title,
              text: `অফার মূল্য: ৳${product.price} - ${product.title}`,
              url: shareableUrl,
              files: [file]
            });
            onShowToast('শেয়ার সম্পন্ন হয়েছে!');
            return;
          }
        }

        // Standard link share
        await navigator.share({
          title: product.title,
          text: `🔥 ${product.title} - অফার প্রাইজ: ৳${product.price}`,
          url: shareableUrl
        });
        onShowToast('শেয়ার সম্পন্ন হয়েছে!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Open Direct Messenger Send Dialog
  const handleMessengerShare = () => {
    // Facebook Messenger send dialog
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareableUrl)}&app_id=291494419195325&redirect_uri=${encodeURIComponent(shareableUrl)}`;
    window.open(messengerUrl, '_blank', 'width=650,height=550');
  };

  // Open WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `🔥 *${product.title}*\nদাম: ৳${product.price}\nক্লিক করে দেখুন: ${shareableUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center">
              <FaFacebookMessenger className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                মেসেঞ্জার ও সোশ্যাল শেয়ারিং প্রিভিউ
              </h2>
              <p className="text-xs text-slate-500">ক্লায়েন্টকে পাঠানোর আগে ছবির প্রিভিউ দেখে নিন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Messenger Live Card Preview (Simulated Messenger Bubble) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                মেসেঞ্জারে যেমন দেখাবে (Live Messenger Preview)
              </span>
              {customImage && (
                <button
                  onClick={() => setCustomImage(null)}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  মূল ছবিতে ফিরুন
                </button>
              )}
            </div>

            {/* Simulated Facebook Messenger Chat Bubble */}
            <div className="bg-[#f0f2f5] p-3 rounded-2xl border border-slate-200">
              <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden border border-slate-300 shadow-md">
                
                {/* Preview Image */}
                <div className="relative aspect-16/9 bg-slate-200 overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    প্রিভিউ ইমেজ
                  </div>
                </div>

                {/* Messenger Snippet Details */}
                <div className="p-3 bg-white">
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                    AFFILIHUB.COM
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mt-0.5">
                    {product.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                    অফার মূল্য: ৳{product.price.toLocaleString()} • রেগুলার: ৳{product.originalPrice.toLocaleString()} • ক্যাশ অন ডেলিভারি
                  </p>
                </div>
              </div>

              <div className="text-center mt-2">
                <span className="text-[11px] text-slate-500">
                  মেসেঞ্জারে লিংক পাঠালে ক্লায়েন্ট ওপরের কার্ডটির মতো দেখতে পাবে
                </span>
              </div>
            </div>
          </div>

          {/* Image Upload Option for Client Sharing */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FiUpload className="w-4 h-4 text-blue-600" />
                  নতুন ছবি আপলোড করতে চান? (Custom Image Upload)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  আপনি চাইলে নিজস্ব তোলা ছবি বা স্পেশাল অফার ব্যানার আপলোড করে ক্লায়েন্টকে শেয়ার করতে পারেন।
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiImage className="w-3.5 h-3.5" />
                <span>ছবি বাছুন</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {customImage && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>কাস্টম ছবি সিলেক্ট করা হয়েছে! মেসেঞ্জারে এটিই প্রিভিউতে যাবে।</span>
              </div>
            )}
          </div>

          {/* Action Sharing Buttons Grid */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-700 block">
              সরাসরি ক্লায়েন্টকে পাঠানোর অপশন:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Native Mobile Share Button */}
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
              >
                <FiShare2 className="w-4 h-4" />
                <span>সরাসরি শেয়ার (Share to Apps)</span>
              </button>

              {/* Direct Messenger Button */}
              <button
                onClick={handleMessengerShare}
                className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
              >
                <FaFacebookMessenger className="w-4 h-4" />
                <span>Messenger ডায়ালগ</span>
              </button>

              {/* Direct WhatsApp Button */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে শেয়ার</span>
              </button>

              {/* Copy Ready-to-paste Caption */}
              <button
                onClick={handleCopyFormattedPost}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-slate-300"
              >
                <FiCopy className="w-4 h-4" />
                <span>ক্যাপশন সহ কপি করুন</span>
              </button>
            </div>
          </div>

          {/* Product Unique URL Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              প্রোডাক্ট ইউনিক লিংক (Affiliate Tracking URL):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
              </button>
            </div>
          </div>

          {/* Helpful Technical Explanation Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <FiInfo className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">💡 মেসেঞ্জারে ছবি প্রিভিউ সংক্রান্ত তথ্য:</p>
              <p className="text-[11px] leading-relaxed text-amber-800">
                ফেসবুক মেসেঞ্জারে লিঙ্ক দিলে মেসেঞ্জার বট স্বয়ংক্রিয়ভাবে লিঙ্কের ছবি পড়ে নেয়। আপনি মোবাইল থেকে <span className="font-semibold">"সরাসরি শেয়ার"</span> দিলে আসল ছবিটি সরাসরি মেসেঞ্জার অ্যাপে অ্যাটাচ হয়ে যায়।
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
