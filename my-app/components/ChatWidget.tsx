'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  FaComments, 
  FaPaperPlane, 
  FaImage, 
  FaShieldHalved,
  FaCircleCheck,
  FaLock
} from 'react-icons/fa6';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { ChatMessage, Product } from '../app/types';
import { useAuth } from '../app/context/AuthContext';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string, productInfo?: { title: string; price: number; image: string }) => void;
  inquiryProduct: Product | null;
  onClearInquiryProduct: () => void;
  onSwitchToAdmin: () => void;
  unreadCount?: number;
  isTyping?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  messages,
  onSendMessage,
  inquiryProduct,
  onClearInquiryProduct,
  onSwitchToAdmin,
  unreadCount = 0,
  isTyping = false,
  onTyping,
}) => {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  // Auto-scroll inside chat feed internally
  useEffect(() => {
    if (isOpen && chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages, isOpen, selectedImage, isTyping]);

  // If already on full /chat page or any /admin route, don't show floating widget
  if (pathname === '/chat' || pathname?.startsWith('/admin')) return null;

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Submit Message
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage && !inquiryProduct) return;

    let productPayload = undefined;
    if (inquiryProduct) {
      productPayload = {
        title: inquiryProduct.title,
        price: inquiryProduct.price,
        image: inquiryProduct.image
      };
    }

    onSendMessage(
      inputText.trim() || (inquiryProduct ? `Hello! I would like to inquire about this product: ${inquiryProduct.title}` : ''),
      selectedImage || undefined,
      productPayload
    );

    setInputText('');
    setSelectedImage(null);
    onClearInquiryProduct();
    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    onSendMessage(question);
  };

  // Generate WhatsApp destination URL
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+880 1873-597814';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const defaultWhatsAppText = inquiryProduct
    ? `Hello ProductPerks! I am inquiring about this Amazon product:\n• ${inquiryProduct.title}\n• Price: $${inquiryProduct.price}\n• Store: ${inquiryProduct.store || 'Amazon Store'}`
    : `Hello ProductPerks! I want to learn more about testing Amazon products and joining the review club.`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultWhatsAppText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultWhatsAppText)}`;

  return (
    <>
      {/* Lightbox for zooming attached chat images */}
      {previewModalImage && (
        <div 
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-transparent">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800/80 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={previewModalImage}
              alt="Zoomed Attachment"
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Floating Action Buttons (WhatsApp & Live Chat at Right Bottom) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
          {/* WhatsApp Floating Action */}
          <div className="relative group flex items-center">
            {/* Tooltip on hover */}
            <div className="hidden sm:flex items-center gap-1.5 absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Chat on WhatsApp</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white shadow-xl shadow-emerald-950/25 hover:shadow-2xl hover:shadow-emerald-900/35 flex items-center justify-center transition-all duration-200 cursor-pointer group"
              title="Chat with us on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
              </span>
            </a>
          </div>

          {/* Live Chat Floating Action */}
          <div className="relative group flex items-center">
            {/* Tooltip on hover */}
            <div className="hidden sm:flex items-center gap-1.5 absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Live Support Chat</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                  {unreadCount}
                </span>
              )}
            </div>

            <button
              onClick={onOpen}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 text-white shadow-xl shadow-stone-900/30 hover:shadow-2xl hover:shadow-stone-900/40 flex items-center justify-center transition-all duration-200 cursor-pointer group"
              title="Live Chat Support"
              aria-label="Open Live Chat"
            >
              <FaComments className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-18 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-96 h-[540px] max-h-[78vh] sm:max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#1b3b2b] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#264e3b] flex items-center justify-center font-bold text-white text-sm">
                  <FaShieldHalved className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1b3b2b]"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-white">
                  ProductPerks Support Desk
                </h3>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Admin Online • Amazon Perks Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 py-1 rounded-md font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Chat with us directly on WhatsApp"
              >
                <FaWhatsapp className="w-3 h-3" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              {user?.role === 'admin' && (
                <button
                  onClick={onSwitchToAdmin}
                  className="text-[10px] bg-white text-slate-900 px-2.5 py-1 rounded-md font-bold shadow-xs hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Switch to Admin Mode to reply"
                >
                  Admin View
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isAuthenticated || !user ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-stone-50/70 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#1b3b2b] flex items-center justify-center text-2xl shadow-inner">
                <FaLock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Sign In for Live Support Chat
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in or register so the admin can send you private Amazon review perks and product test orders.
                </p>
              </div>
              <div className="w-full space-y-2 pt-2 max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaCircleCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Log In / Register</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Product Inquiry Context Bar (if initiated from a product) */}
          {inquiryProduct && (
            <div className="p-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2.5 shrink-0">
              <img
                src={inquiryProduct.image}
                alt={inquiryProduct.title}
                className="w-11 h-11 object-cover rounded-lg border border-stone-300 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-[#1b3b2b]">
                  Inquiring About Amazon Product:
                </p>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {inquiryProduct.title}
                </p>
                <p className="text-xs font-bold text-[#1b3b2b]">
                  {inquiryProduct.price === 0 ? 'FREE Review Perk' : `$${inquiryProduct.price.toLocaleString()}`}
                </p>
              </div>
              <button
                onClick={onClearInquiryProduct}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Remove product context"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div ref={chatFeedRef} className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-stone-50/60 custom-scrollbar">
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender indicator */}
                  <span className="text-[10px] text-slate-500 mb-1 px-1 font-medium">
                    {isCustomer ? 'You (Reviewer)' : 'ProductPerks Admin'}
                  </span>

                  {/* Message Bubble Container */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isCustomer
                        ? 'bg-[#1b3b2b] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-stone-200'
                    }`}
                  >
                    {/* Attached Product Card in Message */}
                    {msg.productInfo && (
                      <div className="mb-2 p-2 bg-black/10 rounded-xl flex items-center gap-2 border border-white/20">
                        <img
                          src={msg.productInfo.image}
                          alt={msg.productInfo.title}
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0 text-left">
                          <p className="font-semibold text-xs truncate">
                            {msg.productInfo.title}
                          </p>
                          <p className="font-bold text-[11px] opacity-90">
                            {msg.productInfo.price === 0 ? 'FREE Perk' : `$${msg.productInfo.price.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Attached Image in Message */}
                    {msg.image && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                        <img
                          src={msg.image}
                          alt="Attachment"
                          onClick={() => setPreviewModalImage(msg.image || null)}
                          className="max-h-48 w-auto object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        />
                        <p className="text-[10px] mt-1 opacity-80 text-center">
                          (Click image to expand)
                        </p>
                      </div>
                    )}

                    {/* Text */}
                    {msg.text && (
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <span className="text-[10px] text-slate-500 mb-1 px-1 font-medium">
                  ProductPerks Admin
                </span>
                <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-stone-200 flex items-center gap-1.5 shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <button
              onClick={() => handleQuickQuestion('How does the Amazon review testing program work?')}
              className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              How It Works?
            </button>
            <button
              onClick={() => handleQuickQuestion('Are these Amazon products really 100% free?')}
              className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              100% Free Items?
            </button>
            <button
              onClick={() => handleQuickQuestion('Can you send the Amazon order link and instructions?')}
              className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              Get Amazon Link
            </button>
          </div>

          {/* Selected Image Preview (Before Send) */}
          {selectedImage && (
            <div className="p-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 shrink-0">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected upload"
                  className="w-12 h-12 object-cover rounded-lg border border-emerald-300"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-xs hover:bg-rose-600 cursor-pointer"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-emerald-900 font-medium">
                Photo attached. Ready to deliver to admin.
              </span>
            </div>
          )}

          {/* Input & Action Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            {/* Image Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-[#1b3b2b] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
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

            {/* Message Text Input */}
            <input
              type="text"
              placeholder={inquiryProduct ? "Ask about this Amazon product or request review link..." : "Type your message to admin..."}
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 bg-stone-50 text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] placeholder:text-slate-400 font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !selectedImage && !inquiryProduct}
              className="p-2.5 bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              title="Send Message"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
            </button>
          </form>
            </>
          )}

        </div>
      )}
    </>
  );
};
