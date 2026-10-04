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
  FaCircleCheck, 
  FaArrowRight, 
  FaTrashCan,
  FaCheck,
  FaPhone,
  FaBagShopping,
  FaCircleDot,
  FaSliders,
  FaLock
} from 'react-icons/fa6';
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
    openDetailModal
  } = useApp();

  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, selectedImage]);

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

    // Show simulated typing indicator for admin reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1400);
  };

  const handleQuickQuestion = (question: string) => {
    sendCustomerMessage(question);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1400);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-[#ccff00] selection:text-slate-950 font-sans relative overflow-hidden pb-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0d5bff]/20 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-8 z-10">
          {/* Brand Logo (Navbar is hidden when logged out) */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-[#0d5bff] text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <FaComments className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl text-white tracking-tight">
                  Byte<span className="text-[#0d5bff]">Desk</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00] text-slate-950">
                  Live Chat
                </span>
              </div>
            </div>
          </div>

          <div className="text-center max-w-lg mb-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-[#ccff00] text-slate-950 px-3.5 py-1 rounded-full text-xs font-black shadow-md">
              <FaLock className="w-3 h-3" />
              <span>Live Support Authentication</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Please Log In to Chat with Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              To keep your product inquiries, orders, and chats securely synced, please register or log in.
            </p>
          </div>

          <AuthCard 
            title="Access Live Chat Desk"
            subtitle="Register your account or log in with your phone & password to start chatting."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-[#ccff00] selection:text-slate-950 font-sans pb-24 md:pb-6">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Chat Hub Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col">
        
        {/* Chat Header Card */}
        <div className="bg-[#0d5bff] text-white rounded-t-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0045d8] border border-blue-400/30 flex items-center justify-center font-bold text-white shadow-md">
                <FaShieldHalved className="w-6 h-6 text-[#ccff00]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ccff00] rounded-full border-2 border-[#0d5bff]"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  ByteDesk Support & Client Desk
                </h1>
                <span className="bg-[#ccff00] text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Admin Online • Typically replies in less than 2 minutes</span>
              </p>
            </div>
          </div>

          {/* Client Identity Status */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-blue-500/50 pt-2 sm:pt-0">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-blue-900/60 px-3 py-1.5 rounded-xl border border-blue-400/30 text-xs">
                <span className="text-blue-200">Chatting as:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {user.name}
                  <FaCheck className="w-2.5 h-2.5 text-[#ccff00]" />
                </span>
                <span className="text-[10px] text-blue-200 font-mono hidden sm:inline">({maskPhone(user.phone)})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FaPhone className="w-3 h-3" />
                <span>Register & Save History</span>
              </button>
            )}

            <button
              onClick={clearMessages}
              className="text-blue-200 hover:text-white p-2 rounded-xl hover:bg-blue-800/50 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Clear chat history"
            >
              <FaTrashCan className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

        </div>

        {/* Chat Window Body */}
        <div className="flex-1 bg-white border-x border-slate-200 flex flex-col justify-between overflow-hidden min-h-[440px] h-[60vh] sm:h-[65vh] shadow-md">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Encryption & Welcome Pill */}
            <div className="text-center my-2">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium px-3.5 py-1 rounded-full border border-slate-200">
                <FaShieldHalved className="w-3 h-3 text-[#0d5bff]" />
                End-to-End verified client connection with ByteDesk Admin
              </span>
            </div>

            {/* Messages List */}
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-200`}
                >
                  <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                    
                    {/* Admin Avatar */}
                    {!isCustomer && (
                      <div className="w-7 h-7 rounded-xl bg-[#0d5bff] text-white flex items-center justify-center text-xs font-black shrink-0 mb-1 shadow-xs">
                        BD
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-3.5 shadow-xs ${
                        isCustomer
                          ? 'bg-[#0d5bff] text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {/* Attached Product Card (If any) */}
                      {msg.productInfo && (
                        <div 
                          onClick={() => {
                            const found = products.find(p => p.title === msg.productInfo?.title);
                            if (found) openDetailModal(found);
                          }}
                          className={`mb-2.5 p-2 rounded-xl flex items-center gap-3 border cursor-pointer hover:opacity-90 transition-opacity ${
                            isCustomer 
                              ? 'bg-blue-700/60 border-blue-400/40 text-white' 
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          <img
                            src={msg.productInfo.image}
                            alt={msg.productInfo.title}
                            className="w-12 h-12 object-cover rounded-lg border border-white/20 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
                              Product Inquiry
                            </span>
                            <p className="text-xs font-black truncate max-w-[200px]">
                              {msg.productInfo.title}
                            </p>
                            <p className="text-xs font-bold text-[#ccff00]">
                              ${msg.productInfo.price.toLocaleString()}
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
                            className="max-h-48 rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity border border-white/20 shadow-xs"
                          />
                        </div>
                      )}

                      {/* Text */}
                      {msg.text && (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-normal">
                          {msg.text}
                        </p>
                      )}

                      {/* Timestamp & read status */}
                      <div className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 ${
                        isCustomer ? 'text-blue-200' : 'text-slate-400'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isCustomer && (
                          <FaCheck className="w-2.5 h-2.5 text-[#ccff00]" />
                        )}
                      </div>
                    </div>

                    {/* Customer Avatar */}
                    {isCustomer && (
                      <div className="w-7 h-7 rounded-xl bg-slate-900 text-[#ccff00] flex items-center justify-center text-xs font-black shrink-0 mb-1 shadow-xs">
                        {user ? user.name.slice(0, 1) : 'U'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <div className="w-7 h-7 rounded-xl bg-[#0d5bff] text-white flex items-center justify-center text-xs font-bold">
                  BD
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Prompts Chips */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Ask:</span>
            <button
              onClick={() => handleQuickQuestion('Is home delivery available all across Bangladesh?')}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              Delivery time in Dhaka?
            </button>
            <button
              onClick={() => handleQuickQuestion('Can I pay Cash on Delivery (COD)?')}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              Cash on delivery available?
            </button>
            <button
              onClick={() => handleQuickQuestion('Can I get a discount if I purchase today?')}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              Any discount available?
            </button>
            <button
              onClick={() => handleQuickQuestion('Is this official product with warranty?')}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              Warranty policy?
            </button>
          </div>

          {/* Attached Inquiry Product Preview */}
          {inquiryProduct && (
            <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={inquiryProduct.image}
                  alt={inquiryProduct.title}
                  className="w-10 h-10 object-cover rounded-lg border border-blue-300"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    Product Attached to Message:
                  </span>
                  <p className="text-xs font-black text-slate-900 truncate max-w-xs sm:max-w-md">
                    {inquiryProduct.title} (${inquiryProduct.price})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearInquiryProduct}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                title="Remove attached product"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attached Image Preview */}
          {selectedImage && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center gap-3 shrink-0">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected upload"
                  className="w-12 h-12 object-cover rounded-xl border border-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 cursor-pointer"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-blue-900 font-medium">
                Photo ready to send with message.
              </span>
            </div>
          )}

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            
            {/* Attach Image button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-500 hover:text-[#0d5bff] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Attach photo"
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
              className="p-2.5 text-slate-500 hover:text-[#0d5bff] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer shrink-0 hidden sm:block"
              title="Attach product from store"
            >
              <FaBagShopping className="w-5 h-5" />
            </button>

            {/* Input field */}
            <input
              type="text"
              placeholder={inquiryProduct ? `Ask about "${inquiryProduct.title}"...` : "Write your message to Admin..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !selectedImage && !inquiryProduct}
              className="p-3 sm:px-5 sm:py-3 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-2xl shadow-md shadow-blue-600/20 transition-all cursor-pointer font-black text-xs sm:text-sm flex items-center gap-2 shrink-0"
            >
              <span className="hidden sm:inline">Send</span>
              <FaPaperPlane className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

        {/* Footer info bar */}
        <div className="bg-slate-900 text-slate-300 rounded-b-3xl px-5 py-3 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span>
            <span>ByteDesk Secure Messenger • Live client response desk</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              ← Back to Catalog
            </Link>
            <Link href="/profile" className="hover:text-white transition-colors">
              My Profile →
            </Link>
          </div>
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
          className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <FaBagShopping className="w-5 h-5 text-[#0d5bff]" />
                Select Product to Inquire About
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
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-black text-slate-900 group-hover:text-[#0d5bff] truncate">
                      {p.title}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      ${p.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#0d5bff] bg-blue-100 px-3 py-1.5 rounded-xl shrink-0 group-hover:bg-[#0d5bff] group-hover:text-white transition-colors">
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
