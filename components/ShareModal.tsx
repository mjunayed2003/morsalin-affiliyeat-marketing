'use client';

import React, { useState, useRef } from 'react';
import { 
  FaShareNodes, 
  FaUpload, 
  FaCopy, 
  FaCheck, 
  FaCircleInfo, 
  FaCircleCheck, 
  FaImage,
  FaFileLines
} from 'react-icons/fa6';
import { FaFacebookMessenger, FaWhatsapp, FaAmazon } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Product } from '../app/types';
import { useApp } from '../app/context/AppContext';

interface ShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  product,
  isOpen,
  onClose,
  onShowToast: onShowToastProp
}) => {
  const { showToast } = useApp();
  const onShowToast = onShowToastProp || showToast;
  const [copied, setCopied] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !product) return null;

  // Compute shareable link directly pointing to dedicated /p/[id] route
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://productperks.com';
  const shareableUrl = `${origin}/p/${product.id}`;
  
  // Active preview image (either custom uploaded or original product image)
  const activeImage = customImage || product.image;

  // Handle Custom Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string);
      setIsUploading(false);
      onShowToast('Custom promotional image uploaded! Check the Messenger preview.');
    };
    reader.readAsDataURL(file);
  };

  // Copy Link to Clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    onShowToast('Product link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Copy Formatted Post (Caption + Link)
  const handleCopyFormattedPost = () => {
    let text = `🔥 Free Amazon Review Perk: ${product.title}\n\n`;
    if (product.store) text += `🏪 Amazon Store: ${product.store}\n`;
    text += `💰 Deal: 100% Free / Rebate (Amazon Retail: $${product.originalPrice.toLocaleString()})\n✨ Highlights: ${product.features.join(', ')}\n\n👉 Claim free unit to test & review:\n${shareableUrl}`;
    if (product.amazonUrl) {
      text += `\n\n🛒 Official Amazon Listing:\n${product.amazonUrl}`;
    }
    navigator.clipboard.writeText(text);
    onShowToast('Caption and links copied! Paste into Messenger or WhatsApp.');
  };

  // Direct Web Share API (with Image File if supported)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        if (customImage && navigator.canShare) {
          const res = await fetch(customImage);
          const blob = await res.blob();
          const file = new File([blob], `${product.id}-share.jpg`, { type: 'image/jpeg' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: product.title,
              text: `Special Offer: $${product.price} - ${product.title}`,
              url: shareableUrl,
              files: [file]
            });
            onShowToast('Shared successfully!');
            return;
          }
        }

        await navigator.share({
          title: product.title,
          text: `🔥 ${product.title} - Deal Price: $${product.price}`,
          url: shareableUrl
        });
        onShowToast('Shared successfully!');
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
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareableUrl)}&app_id=291494419195325&redirect_uri=${encodeURIComponent(shareableUrl)}`;
    window.open(messengerUrl, '_blank', 'width=650,height=550');
  };

  // Open WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `🔥 *${product.title}*\nPrice: $${product.price}\nView details: ${shareableUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header (ByteSpace Cobalt Blue) */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-[#0d5bff] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ccff00] text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <FaFacebookMessenger className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black">
                Messenger & Social Share Preview
              </h2>
              <p className="text-xs text-blue-100 font-medium">Preview image & link appearance before sharing to clients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Messenger Live Card Preview (Simulated Messenger Chat Bubble) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Facebook Messenger Preview
              </span>
              {customImage && (
                <button
                  onClick={() => setCustomImage(null)}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset to Original Image
                </button>
              )}
            </div>

            {/* Simulated Facebook Messenger Chat Bubble */}
            <div className="bg-[#f0f2f5] p-3.5 rounded-2xl border border-slate-200">
              <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden border border-slate-300 shadow-md">
                
                {/* Preview Image */}
                <div className="relative aspect-16/9 bg-slate-200 overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    Preview Image
                  </div>
                </div>

                {/* Messenger Snippet Details */}
                <div className="p-3.5 bg-white">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    AFFILIHUB.COM
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mt-0.5">
                    {product.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                    Special Price: ${product.price.toLocaleString()} • Regular: ${product.originalPrice.toLocaleString()} • Cash on Delivery
                  </p>
                </div>
              </div>

              <div className="text-center mt-2.5">
                <span className="text-[11px] text-slate-500 font-medium">
                  When shared on Messenger, clients will see this rich preview card with the image.
                </span>
              </div>
            </div>
          </div>

          {/* Image Upload Option for Client Sharing */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FaUpload className="w-3.5 h-3.5 text-blue-600" />
                  Upload Custom Image for Client
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Upload your own real unboxing photo or custom promotional banner to send to the client.
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FaImage className="w-3.5 h-3.5" />
                <span>Upload Image</span>
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
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-950 bg-[#ccff00]/40 border border-[#ccff00] px-3 py-2 rounded-xl font-bold">
                <FaCircleCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Custom image applied! This image will now appear in the share preview.</span>
              </div>
            )}
          </div>

          {/* Action Sharing Buttons Grid */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">
              Direct Sharing Options:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Native Mobile Share Button */}
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 bg-[#0a2e8c] hover:bg-[#0d5bff] active:scale-98 text-white p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <FaShareNodes className="w-3.5 h-3.5" />
                <span>Share to Apps (Web Share)</span>
              </button>

              {/* Direct Messenger Button */}
              <button
                onClick={handleMessengerShare}
                className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <FaFacebookMessenger className="w-4 h-4" />
                <span>Messenger Dialog</span>
              </button>

              {/* Direct WhatsApp Button */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>

              {/* Copy Ready-to-paste Caption */}
              <button
                onClick={handleCopyFormattedPost}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-300"
              >
                <FaFileLines className="w-3.5 h-3.5" />
                <span>Copy Caption & Link</span>
              </button>
            </div>
          </div>

          {/* Product Unique URL Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Affiliate Tracking Link (Unique Product URL):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-slate-50 text-slate-700 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono select-all focus:outline-none font-semibold"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 shadow-xs'
                }`}
              >
                {copied ? <FaCheck className="w-3.5 h-3.5" /> : <FaCopy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Official Amazon URL Input */}
          {product.amazonUrl && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FaAmazon className="w-3.5 h-3.5 text-[#ff9900]" />
                  <span>Amazon Store Link ({product.store || 'Amazon'}):</span>
                </label>
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Open in New Tab ↗
                </a>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={product.amazonUrl}
                  className="flex-1 bg-amber-50/40 text-slate-700 text-xs px-3.5 py-2.5 rounded-xl border border-amber-200 font-mono select-all focus:outline-none font-semibold"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(product.amazonUrl!);
                    onShowToast('Amazon product link copied!');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-[#ff9900] hover:bg-[#eb8c00] text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <FaCopy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          )}

          {/* Helpful Technical Explanation Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <FaCircleInfo className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">How Image Preview in Messenger Works:</p>
              <p className="text-[11px] leading-relaxed text-amber-800">
                When you share this link on Messenger, Facebook's crawler automatically scrapes the page's Open Graph meta image tag to generate the thumbnail preview. On mobile devices, clicking <span className="font-semibold">"Share to Apps"</span> attaches the actual image file directly into your Messenger chat.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
