'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { 
  FaComments, 
  FaPaperPlane, 
  FaImage, 
  FaShieldHalved, 
  FaTrashCan,
  FaCheck,
  FaCheckDouble,
  FaPhone,
  FaBagShopping,
  FaLock,
  FaUser
} from 'react-icons/fa6';
import { FaWhatsapp, FaAmazon } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Product, maskPhone } from '@/app/types';
import { AuthCard } from '@/components/AuthCard';

export default function ChatPage() {
  const { 
    messages, 
    sendCustomerMessage, 
    inquiryProduct, 
    clearInquiryProduct, 
    openChatWithProduct,
    products, 
    clearMessages,
    openDetailModal,
    isTyping: realIsTyping,
    typingSender,
    emitTyping,
    audioCall,
    startAudioCall,
    requestPushNotifications,
    hasMoreMessages,
    isLoadingOlderMessages,
    loadOlderMessages,
    chatTotal,
    markConversationAsRead,
  } = useApp();

  const { user, isAuthenticated, isLoading, openAuthModal, startGuestChat } = useAuth();

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestSubmitting, setGuestSubmitting] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [authViewTab, setAuthViewTab] = useState<'guest' | 'login'>('guest');
  const isTyping = Boolean(realIsTyping && typingSender === 'admin');
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const chatFeedRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const isNearBottomRef = useRef(true);
  const prevMsgCountRef = useRef<number>(0);

  const handleScroll = () => {
    if (!chatFeedRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatFeedRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 120;
    isNearBottomRef.current = isNearBottom;
    setShowScrollBottom(!isNearBottom);
  };

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    } else if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  };

  // Auto scroll to bottom only when user is near bottom or initial load
  useEffect(() => {
    const hasNew = messages.length > prevMsgCountRef.current;
    prevMsgCountRef.current = messages.length;
    if (hasNew && isNearBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom(true));
    }
  }, [messages.length]);

  // Auto mark incoming admin messages as read when viewing chat
  useEffect(() => {
    markConversationAsRead();
  }, [messages.length]);

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

    const messageText = inputText.trim() || (inquiryProduct ? `Hello! I would like to inquire about this product: ${inquiryProduct.title}` : '');

    sendCustomerMessage(
      messageText,
      selectedImage || undefined,
      productPayload
    );

    setInputText('');
    setSelectedImage(null);
    clearInquiryProduct();

    if (emitTyping) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      emitTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendCustomerMessage(question);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (emitTyping) {
      emitTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        emitTyping(false);
      }, 2000);
    }
  };

  // WhatsApp quick url
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+880 1340-376081';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const defaultWhatsAppText = inquiryProduct
    ? `Hello FreeProducts.online! I am inquiring about this Amazon product:\n• ${inquiryProduct.title}\n• Price: $${inquiryProduct.price}\n• Store: ${inquiryProduct.store || 'Amazon Store'}`
    : `Hello FreeProducts.online! I want to learn more about testing Amazon products and joining the review club.`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultWhatsAppText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultWhatsAppText)}`;

  const handleStartGuestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError(null);
    if (!guestName.trim()) {
      setGuestError('Please enter your full name.');
      return;
    }
    const cleanDigits = guestPhone.replace(/\D/g, '');
    if (!guestPhone.trim() || cleanDigits.length < 6) {
      setGuestError('Please enter a valid phone number (at least 6 digits).');
      return;
    }

    setGuestSubmitting(true);
    try {
      const res = await startGuestChat(guestName.trim(), guestPhone.trim());
      if (!res.success) {
        setGuestError(res.message);
      }
    } catch (err: any) {
      setGuestError(err.message || 'Error connecting to chat.');
    } finally {
      setGuestSubmitting(false);
    }
  };

  // Loading view
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50/50 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans pb-16">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-12 z-10 text-center">
          <div className="w-10 h-10 rounded-full border-3 border-[#1b3b2b] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Connecting to chat desk...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated view
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50/50 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans pb-16">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-8 z-10">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-200/80">
              <img
                src="/logo.jpeg"
                alt="FreeProducts.online"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
          </div>

          {authViewTab === 'guest' ? (
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xl space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3b2b] text-white flex items-center justify-center shadow-xs">
                    <FaComments className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Direct Live Chat</h3>
                    <p className="text-[11px] text-slate-500 font-medium">No account required</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </div>

              {guestError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                  {guestError}
                </div>
              )}

              <form onSubmit={handleStartGuestChat} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Morsalin"
                      className="w-full bg-stone-50/80 text-slate-900 pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/25 focus:border-[#1b3b2b] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="e.g. 01340376081 or +1..."
                      className="w-full bg-stone-50/80 text-slate-900 pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/25 focus:border-[#1b3b2b] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={guestSubmitting}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-98 disabled:opacity-60 text-white py-3.5 px-5 rounded-xl font-bold text-sm shadow-md shadow-emerald-950/15 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{guestSubmitting ? 'Starting Chat Session...' : 'Start Live Chat Now'}</span>
                  <FaPaperPlane className="w-3.5 h-3.5 text-emerald-300" />
                </button>
              </form>

              <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-2 text-xs text-slate-500">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>

                <div className="flex items-center gap-1 pt-1">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => setAuthViewTab('login')}
                    className="font-bold text-[#1b3b2b] hover:underline cursor-pointer"
                  >
                    Log In with Password
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-3">
              <AuthCard 
                title="Access Reviewer Desk"
                subtitle="Sign in with your phone or email to sync your chat history."
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthViewTab('guest')}
                  className="text-xs font-bold text-[#1b3b2b] hover:underline cursor-pointer"
                >
                  ← Back to Direct Chat with Name & Phone
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen flex flex-col bg-stone-50/50 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Chat Hub Container - strictly viewport-contained */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex flex-col min-h-0 overflow-hidden">
        
        {/* Unified Chat Box Container: Everything in ONE box */}
        <div className="flex-1 w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden flex flex-col min-h-0 relative">
          
          {/* Clean Modern Chat Header */}
          <div className="bg-[#1b3b2b] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-sm flex items-center justify-between gap-2.5 shrink-0 border-b border-emerald-900/40">
            {/* Left: Support Desk & User Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-white tracking-tight leading-none">
                    Support Desk
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online & Active" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-200/90 mt-1 leading-none">
                  <span className="opacity-75">User:</span>
                  <span className="font-semibold text-white truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[260px]">
                    {user?.name || 'Reviewer'}
                  </span>
                  <FaCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* Right: Quick Actions (Call, WhatsApp, Delete) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Audio Call button */}
              <button
                type="button"
                onClick={() => startAudioCall()}
                disabled={!!audioCall}
                className="bg-emerald-700/90 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                title="Start Live Audio Call with Support Desk"
              >
                <FaPhone className="w-3 h-3 text-emerald-200 shrink-0" />
                <span className="hidden sm:inline">Audio Call</span>
              </button>

              {/* Direct WhatsApp shortcut */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Open WhatsApp chat"
              >
                <FaWhatsapp className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Delete / Clear Chat History */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your chat history?')) {
                    clearMessages();
                  }
                }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-500/80 active:scale-95 text-stone-200 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                title="Clear chat history"
              >
                <FaTrashCan className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        {/* Messages Scroll Area - ONLY THIS SCROLLS */}
        <div 
          ref={chatFeedRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 bg-stone-50/40 min-h-0 relative"
        >
            {/* Welcome Banner */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1.5 bg-white text-slate-600 text-[11px] font-medium px-3.5 py-1 rounded-full border border-stone-200 shadow-2xs">
                <FaShieldHalved className="w-3 h-3 text-[#1b3b2b]" />
                Official FreeProducts.online Review Club Chat • Verified Admin
              </span>
            </div>

            {/* Pagination: Load Earlier Messages */}
            {hasMoreMessages && (
              <div className="flex justify-center my-2">
                <button
                  type="button"
                  onClick={async () => {
                    const scrollContainer = chatFeedRef.current;
                    const prevScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;
                    await loadOlderMessages();
                    requestAnimationFrame(() => {
                      if (scrollContainer) {
                        const newScrollHeight = scrollContainer.scrollHeight;
                        scrollContainer.scrollTop += (newScrollHeight - prevScrollHeight);
                      }
                    });
                  }}
                  disabled={isLoadingOlderMessages}
                  className="px-4 py-1.5 bg-white hover:bg-stone-100 text-[#1b3b2b] text-xs font-bold rounded-full border border-stone-200 shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingOlderMessages ? (
                    <>
                      <div className="w-3 h-3 rounded-full border-2 border-[#1b3b2b] border-t-transparent animate-spin" />
                      <span>Loading earlier messages...</span>
                    </>
                  ) : (
                    <>
                      <span>⬆ Load Earlier Messages</span>
                      {chatTotal > messages.length && (
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
                          +{chatTotal - messages.length}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Messages List */}
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';

              {/* Messenger-like Call Bubble */}
              if (msg.text?.startsWith('📞')) {
                const isMissed = msg.text.includes('Missed') || msg.text.includes('declined');
                return (
                  <div key={msg.id} className="flex justify-center my-2.5 w-full animate-in fade-in">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold shadow-xs border ${
                      isMissed
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${
                        isMissed ? 'bg-rose-500' : 'bg-emerald-600'
                      }`}>
                        <FaPhone className="w-3 h-3" />
                      </div>
                      <span>{msg.text}</span>
                      <span className="text-[10px] opacity-60 font-mono ml-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-150`}
                >
                  <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                    
                    {/* Admin Avatar */}
                    {!isCustomer && (
                      <div className="w-7 h-7 rounded-full bg-[#1b3b2b] text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mb-1 shadow-xs">
                        PP
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-3.5 shadow-xs ${
                        isCustomer
                          ? 'bg-[#1b3b2b] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-stone-200 rounded-bl-xs'
                      }`}
                    >
                      {/* Attached Product Card (If any) */}
                      {msg.productInfo && (
                        <div 
                          onClick={() => {
                            const found = products.find(p => p.title === msg.productInfo?.title);
                            if (found) openDetailModal(found);
                          }}
                          className={`mb-2.5 p-2 rounded-xl flex items-center gap-2.5 border cursor-pointer hover:opacity-90 transition-opacity ${
                            isCustomer 
                              ? 'bg-black/15 border-white/20 text-white' 
                              : 'bg-stone-50 border-stone-200 text-slate-900'
                          }`}
                        >
                          <img
                            src={msg.productInfo.image}
                            alt={msg.productInfo.title}
                            className="w-11 h-11 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div className="overflow-hidden text-left">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
                              Inquiry Product
                            </span>
                            <p className="text-xs font-bold truncate max-w-[200px]">
                              {msg.productInfo.title}
                            </p>
                            <p className="text-xs font-bold">
                              {msg.productInfo.price === 0 ? 'FREE Review Perk' : `$${msg.productInfo.price.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Image Attachment (If any) */}
                      {msg.image && (
                        <div className="mb-2">
                          <img
                            src={msg.image}
                            alt="Attachment"
                            onClick={() => setPreviewModalImage(msg.image || null)}
                            className="max-h-48 rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity border border-stone-200 shadow-xs"
                          />
                        </div>
                      )}

                      {/* Text Message */}
                      {msg.text && (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-normal">
                          {msg.text}
                        </p>
                      )}

                      {/* Timestamp & checkmark */}
                      <div className={`flex items-center justify-end gap-1.5 text-[10px] mt-1.5 ${
                        isCustomer ? 'text-emerald-200' : 'text-slate-400'
                      }`}>
                        <span className="font-mono">{msg.timestamp}</span>
                        {isCustomer && (
                          msg.read ? (
                            <span className="inline-flex items-center gap-1 text-sky-300 font-bold" title="Seen by Support Desk">
                              <FaCheckDouble className="w-3 h-3 text-sky-300" />
                              <span className="text-[9px]">Seen</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-200/70 font-normal" title="Delivered to Support Desk">
                              <FaCheck className="w-2.5 h-2.5 text-emerald-200/70" />
                              <span className="text-[9px]">Sent</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Customer Avatar */}
                    {isCustomer && (
                      <div className="w-7 h-7 rounded-full bg-stone-200 text-[#1b3b2b] flex items-center justify-center text-[10px] font-bold shrink-0 mb-1 shadow-xs">
                        {user ? user.name.slice(0, 1).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <div className="w-7 h-7 rounded-full bg-[#1b3b2b] text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                  PP
                </div>
                <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-stone-200 flex items-center gap-1.5 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
              <div ref={messagesEndRef} />
            </div>

            {/* Floating Jump to Latest Button */}
            {showScrollBottom && (
              <button
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-24 right-5 z-20 bg-[#1b3b2b] hover:bg-[#142e20] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer animate-in fade-in transition-all"
              >
                <span>Latest Messages</span>
                <span className="text-emerald-300 font-bold">↓</span>
              </button>
            )}

            {/* Quick FAQ Suggestion Chips */}
            <div className="px-3 py-1.5 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick Ask:</span>
              <button
                onClick={() => handleQuickQuestion('How does the Amazon review testing program work?')}
                className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full border border-stone-200/80 transition-colors cursor-pointer"
              >
                How It Works?
              </button>
              <button
                onClick={() => handleQuickQuestion('Are these Amazon products really 100% free?')}
                className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full border border-stone-200/80 transition-colors cursor-pointer"
              >
                100% Free Items?
              </button>
              <button
                onClick={() => handleQuickQuestion('Can you send the Amazon order link and instructions?')}
                className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full border border-stone-200/80 transition-colors cursor-pointer"
              >
                Get Amazon Link
              </button>
              <button
                onClick={() => handleQuickQuestion('Which Amazon sellers are verified for reviews?')}
                className="shrink-0 bg-stone-100 hover:bg-[#1b3b2b] hover:text-white text-slate-700 px-3 py-1 rounded-full border border-stone-200/80 transition-colors cursor-pointer"
              >
                Verified Sellers?
              </button>
            </div>

            {/* Attached Inquiry Product Preview */}
            {inquiryProduct && (
              <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={inquiryProduct.image}
                    alt={inquiryProduct.title}
                    className="w-10 h-10 object-cover rounded-lg border border-stone-300"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b3b2b]">
                      Product Context Attached:
                    </span>
                    <p className="text-xs font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {inquiryProduct.title} ({inquiryProduct.price === 0 ? 'FREE' : `$${inquiryProduct.price}`})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearInquiryProduct}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                  title="Remove attached product"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Attached Image Preview */}
            {selectedImage && (
              <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-3 shrink-0">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected upload"
                    className="w-12 h-12 object-cover rounded-xl border border-emerald-300"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 cursor-pointer"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-emerald-900 font-medium">
                  Photo ready to send with message.
                </span>
              </div>
            )}

            {/* Message Input Bar (Fixed at bottom inside the box) */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
              
              {/* Attach Image button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-500 hover:text-[#1b3b2b] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Attach screenshot or photo"
              >
                <FaImage className="w-5 h-5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              {/* Attach Product from Catalog button */}
              <button
                type="button"
                onClick={() => setShowProductPicker(true)}
                className="p-2.5 text-slate-500 hover:text-[#1b3b2b] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0 hidden sm:block"
                title="Attach Amazon product"
              >
                <FaBagShopping className="w-5 h-5" />
              </button>

              {/* Input field */}
              <input
                type="text"
                placeholder={inquiryProduct ? `Ask about "${inquiryProduct.title}"...` : "Write message to FreeProducts.online Support..."}
                value={inputText}
                onChange={handleInputChange}
                className="flex-1 bg-stone-50 text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
              />

              {/* Send button in Forest Green */}
              <button
                type="submit"
                disabled={!inputText.trim() && !selectedImage && !inquiryProduct}
                className="p-2.5 sm:px-5 sm:py-2.5 bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-xs transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0"
              >
                <span className="hidden sm:inline">Send</span>
                <FaPaperPlane className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </main>

      {/* Lightbox Modal for Zooming Photos */}
      {previewModalImage && (
        <div 
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={previewModalImage}
              alt="Zoomed Attachment"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Product Picker Modal */}
      {showProductPicker && (
        <div 
          onClick={() => setShowProductPicker(false)}
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-stone-200 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaBagShopping className="w-4 h-4 text-[#1b3b2b]" />
                Select Amazon Product to Inquire About
              </h3>
              <button
                onClick={() => setShowProductPicker(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2 flex-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    openChatWithProduct(p);
                    setShowProductPicker(false);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all cursor-pointer group"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#1b3b2b] truncate">
                      {p.title}
                    </p>
                    <p className="text-xs font-bold text-[#1b3b2b] mt-0.5">
                      {p.price === 0 ? 'FREE Review Perk' : `$${p.price.toLocaleString()}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1b3b2b] bg-emerald-50 group-hover:bg-[#1b3b2b] group-hover:text-white px-3 py-1.5 rounded-xl shrink-0 transition-colors">
                    Attach
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
