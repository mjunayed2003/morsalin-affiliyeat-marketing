'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaComments, 
  FaPaperPlane, 
  FaImage, 
  FaCheck, 
  FaTrashCan,
  FaPhone,
  FaClock,
  FaStore
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { ChatMessage } from '@/app/types';

export default function AdminInboxPage() {
  const { messages, sendAdminReply, clearMessages, showToast, isTyping, typingSender, emitTyping } = useApp();
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'admin'>('all');
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll chat feed internally (does not scroll page)
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages, selectedImage, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
    if (emitTyping) {
      emitTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        emitTyping(false);
      }, 2000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !selectedImage) return;

    if (emitTyping) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      emitTyping(false);
    }

    sendAdminReply(replyText.trim(), selectedImage || undefined);
    setReplyText('');
    setSelectedImage(null);
    showToast('Admin reply sent to reviewer.');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'customer') return m.sender === 'customer';
    if (activeTab === 'admin') return m.sender === 'admin';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Support & Customer Inbox
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time chat inquiries from reviewers about Amazon products, delivery, and review verification.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear chat history?')) {
              clearMessages();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
        >
          <FaTrashCan className="w-3 h-3" />
          <span>Clear Chat History</span>
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col h-[600px]">
        
        {/* Chat Header Filter Bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Filter View:</span>
            {['all', 'customer', 'admin'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Messages' : tab === 'customer' ? 'Customer Inquiries' : 'Admin Replies'}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {messages.length} messages logged
          </span>
        </div>

        {/* Message Thread */}
        <div ref={chatFeedRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/30">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <FaComments className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-xs font-medium">No messages found in this filter.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 font-medium">
                    <span>{isAdmin ? 'Owner / Admin' : msg.senderName || 'Reviewer'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Attached Product Box */}
                  {msg.productInfo && (
                    <div className="mb-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3 max-w-sm">
                      <img
                        src={msg.productInfo.image}
                        alt={msg.productInfo.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {msg.productInfo.title}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          Price: ${msg.productInfo.price} (Free Perk)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image Attachment */}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden max-w-xs border border-slate-200 shadow-xs">
                      <img src={msg.image} alt="User upload" className="w-full h-auto max-h-48 object-cover" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isAdmin
                        ? 'bg-[#1b3b2b] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}

          {/* Real-time Reviewer Typing Indicator */}
          {isTyping && typingSender !== 'admin' && (
            <div className="flex flex-col items-start animate-in fade-in duration-200">
              <span className="text-[11px] text-slate-400 font-medium mb-1">
                Reviewer is typing...
              </span>
              <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white space-y-2">
          {selectedImage && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 w-fit">
              <img src={selectedImage} alt="Attachment" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs text-slate-600 font-medium">Photo attached</span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-rose-600 text-xs ml-1"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Attach photo"
            >
              <FaImage className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <input
              type="text"
              value={replyText}
              onChange={handleInputChange}
              placeholder="Type an official admin reply..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b] focus:bg-white transition-all"
            />

            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#1b3b2b] hover:bg-[#142e20] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Send reply"
            >
              <FaPaperPlane className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
