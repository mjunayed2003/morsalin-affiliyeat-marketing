'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaComments, 
  FaPaperPlane, 
  FaImage, 
  FaShieldHalved,
  FaCircleCheck
} from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { ChatMessage, Product } from '../app/types';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string, productInfo?: { title: string; price: number; image: string }) => void;
  inquiryProduct: Product | null;
  onClearInquiryProduct: () => void;
  onSwitchToAdmin: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  messages,
  onSendMessage,
  inquiryProduct,
  onClearInquiryProduct,
  onSwitchToAdmin
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, selectedImage]);

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
  };

  const handleQuickQuestion = (question: string) => {
    onSendMessage(question);
  };

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

      {/* Floating Launcher Button (ByteSpace Cobalt & Lime) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 text-white p-4 rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center transition-all cursor-pointer group"
          title="Customer Support Desk"
        >
          <FaComments className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ccff00] border-2 border-[#0d5bff]"></span>
          </span>
        </button>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header (ByteSpace Cobalt Blue) */}
          <div className="bg-[#0d5bff] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#0045d8] flex items-center justify-center font-bold text-white text-sm">
                  <FaShieldHalved className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ccff00] rounded-full border-2 border-[#0d5bff]"></span>
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight flex items-center gap-1.5">
                  ByteDesk Support Desk
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span>
                  Admin Online • Live Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onSwitchToAdmin}
                className="text-[10px] bg-[#ccff00] text-slate-950 px-2.5 py-1 rounded-md font-black shadow-xs hover:bg-[#b8e600] transition-colors cursor-pointer"
                title="Switch to Admin Mode to reply"
              >
                Admin View
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Inquiry Context Bar (if initiated from a product) */}
          {inquiryProduct && (
            <div className="p-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2.5 shrink-0">
              <img
                src={inquiryProduct.image}
                alt={inquiryProduct.title}
                className="w-11 h-11 object-cover rounded-lg border border-amber-300 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-amber-800">
                  Inquiring About Product:
                </p>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {inquiryProduct.title}
                </p>
                <p className="text-xs font-bold text-blue-700">
                  ৳{inquiryProduct.price.toLocaleString()}
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
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/70 custom-scrollbar">
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender indicator */}
                  <span className="text-[10px] text-slate-500 mb-1 px-1 font-medium">
                    {isCustomer ? 'You (Customer)' : 'Support Team (Admin)'}
                  </span>

                  {/* Message Bubble Container */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isCustomer
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
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
                            ৳{msg.productInfo.price.toLocaleString()}
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
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <button
              onClick={() => handleQuickQuestion('Is Cash on Delivery available?')}
              className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              Cash on Delivery?
            </button>
            <button
              onClick={() => handleQuickQuestion('What is the delivery timeline and charge?')}
              className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              Delivery Timeline?
            </button>
            <button
              onClick={() => handleQuickQuestion('How do I confirm my order?')}
              className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              How to Order?
            </button>
          </div>

          {/* Selected Image Preview (Before Send) */}
          {selectedImage && (
            <div className="p-2 bg-blue-50 border-t border-blue-200 flex items-center gap-2 shrink-0">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected upload"
                  className="w-12 h-12 object-cover rounded-lg border border-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-xs hover:bg-rose-600 cursor-pointer"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-blue-900 font-medium">
                Image attached. Click send button to deliver.
              </span>
            </div>
          )}

          {/* Input & Action Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            {/* Image Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Attach and send image"
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
              placeholder={inquiryProduct ? "Type your product inquiry message..." : "Type your message..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] placeholder:text-slate-400 font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !selectedImage && !inquiryProduct}
              className="p-2.5 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
              title="Send Message"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
