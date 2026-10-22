'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  FaComments, 
  FaPaperPlane, 
  FaImage, 
  FaTrashCan,
  FaPhone,
  FaClock,
  FaUser,
  FaMagnifyingGlass,
  FaShieldHalved,
  FaEnvelope,
  FaCircleCheck,
  FaArrowLeft,
  FaWhatsapp
} from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { ChatMessage, User } from '@/app/types';

function formatPhone(phone?: string): string {
  if (!phone) return 'No Phone';
  const digits = phone.replace(/\D/g, '');
  const usDigits = digits.length > 10 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (usDigits.length === 10) {
    return `+1 (${usDigits.slice(0, 3)}) ${usDigits.slice(3, 6)}-${usDigits.slice(6)}`;
  }
  return phone;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface ConversationItem {
  id: string; // userId or 'guest'
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  lastMessage?: ChatMessage;
  lastMessageTime: number; // timestamp in ms for sorting
  unreadCount: number;
  totalMessages: number;
  isGuest?: boolean;
}

export default function AdminInboxPage() {
  const { 
    messages, 
    sendAdminReply, 
    clearMessages, 
    showToast, 
    isTyping, 
    typingSender, 
    emitTyping, 
    markConversationAsRead,
    hasMoreMessages,
    isLoadingOlderMessages,
    loadOlderMessages,
    chatTotal,
    audioCall,
    startAudioCall,
  } = useApp();
  const { users } = useAuth();

  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'admin'>('all');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const chatFeedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Group and sort conversations: NEWEST MESSAGE ALWAYS ON TOP
  const conversations = useMemo(() => {
    const convMap = new Map<string, ConversationItem>();

    // 1. Seed conversations from registered users
    users.forEach((usr) => {
      convMap.set(usr.id, {
        id: usr.id,
        name: usr.name || 'Registered User',
        phone: usr.phone || '',
        email: usr.email,
        avatar: usr.avatar,
        lastMessageTime: new Date(usr.createdAt || 0).getTime(),
        unreadCount: 0,
        totalMessages: 0,
      });
    });

    // 2. Aggregate messages per user & discover unknown/guest users
    messages.forEach((msg) => {
      const convId = msg.userId || 'guest';

      if (!convMap.has(convId)) {
        if (convId === 'guest') {
          convMap.set('guest', {
            id: 'guest',
            name: 'Guest Visitors (Unregistered)',
            phone: 'General Support',
            lastMessageTime: 0,
            unreadCount: 0,
            totalMessages: 0,
            isGuest: true,
          });
        } else {
          convMap.set(convId, {
            id: convId,
            name: msg.senderName || msg.userPhone || 'Reviewer',
            phone: msg.userPhone || '',
            email: msg.userEmail,
            lastMessageTime: 0,
            unreadCount: 0,
            totalMessages: 0,
          });
        }
      }

      const item = convMap.get(convId)!;
      item.totalMessages += 1;

      // Update phone/name from message metadata if missing
      if (!item.phone && msg.userPhone) item.phone = msg.userPhone;
      if (item.name === 'Reviewer' && msg.senderName && msg.senderName !== 'Reviewer') {
        item.name = msg.senderName;
      }

      const msgTime = new Date(msg.createdAt || Date.now()).getTime();
      if (!item.lastMessage || msgTime >= item.lastMessageTime) {
        item.lastMessage = msg;
        item.lastMessageTime = msgTime;
      }

      if (msg.sender === 'customer' && !msg.read) {
        item.unreadCount += 1;
      }
    });

    // 3. Sort list: Conversation with latest message / activity appears on top
    const list = Array.from(convMap.values());
    list.sort((a, b) => {
      // Prioritize conversations that actually have messages
      if (a.lastMessage && !b.lastMessage) return -1;
      if (!a.lastMessage && b.lastMessage) return 1;
      return b.lastMessageTime - a.lastMessageTime;
    });

    return list;
  }, [users, messages]);

  // Filter conversations by search input (Name, Phone, Email)
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  // Set initial selected conversation
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Active selected conversation data
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || conversations[0] || null;
  }, [conversations, selectedConversationId]);

  // Messages filtered for the active conversation
  const activeMessages = useMemo(() => {
    if (!activeConversation) return [];
    const isGuest = activeConversation.id === 'guest';

    return messages.filter((m) => {
      const matchConv = isGuest ? !m.userId : m.userId === activeConversation.id;
      if (!matchConv) return false;

      if (activeTab === 'customer') return m.sender === 'customer';
      if (activeTab === 'admin') return m.sender === 'admin';
      return true;
    });
  }, [messages, activeConversation, activeTab]);

  // Auto mark conversation messages as read when active
  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation?.id, messages.length]);

  // Auto scroll chat feed internally when messages change
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [activeMessages, selectedImage, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
    const targetUserId = activeConversation && !activeConversation.isGuest ? activeConversation.id : undefined;
    if (emitTyping) {
      emitTyping(true, targetUserId);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        emitTyping(false, targetUserId);
      }, 2000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !selectedImage) return;

    const targetUserId = activeConversation && !activeConversation.isGuest ? activeConversation.id : undefined;

    if (emitTyping) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      emitTyping(false, targetUserId);
    }

    sendAdminReply(replyText.trim(), selectedImage || undefined, targetUserId);
    setReplyText('');
    setSelectedImage(null);
    showToast(`Reply sent to ${activeConversation?.name || 'Reviewer'}.`);
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

  return (
    <div className="w-full max-w-7xl mx-auto font-sans h-[calc(100dvh-6rem)] sm:h-[calc(100dvh-7rem)] flex flex-col min-h-0">
      
      {/* Main Two-Pane Chat Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row flex-1 min-h-0 h-full">
        
        {/* ========================================================= */}
        {/* LEFT PANE: USER LIST WITH PHONE NUMBERS                   */}
        {/* ========================================================= */}
        <div className={`w-full md:w-[360px] lg:w-[400px] border-r border-stone-200 flex flex-col shrink-0 bg-stone-50/50 h-full min-h-0 overflow-hidden ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Search Header */}
          <div className="p-3.5 border-b border-stone-200 bg-white space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FaComments className="w-3.5 h-3.5 text-[#1b3b2b]" />
                Conversations ({conversations.length})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Sorted by Latest
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search user name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] text-slate-900 font-medium transition-all"
              />
            </div>
          </div>

          {/* User Conversations List */}
          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-stone-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <FaUser className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-semibold">No users found</p>
                <p className="text-[11px] mt-0.5">Try a different name or phone number.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                const hasUnread = conv.unreadCount > 0;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => {
                      setSelectedConversationId(conv.id);
                      setMobileShowChat(true);
                      markConversationAsRead(conv.id);
                    }}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-l-4 border-[#1b3b2b] shadow-2xs'
                        : 'hover:bg-white bg-transparent'
                    }`}
                  >
                    {/* User Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs ${
                        isSelected 
                          ? 'bg-[#1b3b2b] text-white' 
                          : conv.isGuest
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-slate-700'
                      }`}>
                        {conv.isGuest ? 'G' : conv.name.slice(0, 1).toUpperCase()}
                      </div>
                      {conv.totalMessages > 0 && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-bold truncate ${
                          isSelected ? 'text-[#1b3b2b]' : 'text-slate-900'
                        }`}>
                          {conv.name}
                        </span>
                        
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {formatRelativeTime(conv.lastMessage?.createdAt)}
                        </span>
                      </div>

                      {/* Phone Number Display (PROMINENT) */}
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 mb-1">
                        <FaPhone className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span className="font-mono tracking-tight truncate">
                          {formatPhone(conv.phone)}
                        </span>
                        {conv.phone && conv.phone.startsWith('+1') && (
                          <span className="text-[9px] bg-emerald-100/80 text-emerald-700 px-1 py-0.2 rounded font-bold">
                            🇺🇸 USA
                          </span>
                        )}
                      </div>

                      {/* Last Message Snippet */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-500 truncate font-normal">
                          {conv.lastMessage ? (
                            <span>
                              {conv.lastMessage.sender === 'admin' ? (
                                <strong className="text-slate-700">You: </strong>
                              ) : null}
                              {conv.lastMessage.text || (conv.lastMessage.image ? '📷 [Photo Attached]' : 'Inquiry message')}
                            </span>
                          ) : (
                            <span className="italic text-slate-400">No chat messages yet</span>
                          )}
                        </p>

                        {hasUnread && (
                          <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: ACTIVE CONVERSATION THREAD                    */}
        {/* ========================================================= */}
        <div className={`flex-1 flex flex-col bg-white min-w-0 min-h-0 h-full overflow-hidden ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Active Conversation Top Bar */}
          <div className="p-3.5 sm:p-4 border-b border-stone-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-[#1b3b2b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {activeConversation?.isGuest ? 'G' : (activeConversation?.name?.slice(0, 1) || 'U').toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-snug">
                  {activeConversation?.name || 'Reviewer'}
                </h2>

                {/* Status & Phone Bar */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5 flex-wrap">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                    {activeConversation?.isGuest ? 'Guest' : 'Verified'}
                  </span>

                  <span className="flex items-center gap-1 font-semibold text-emerald-800 text-xs shrink-0">
                    <FaPhone className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>{formatPhone(activeConversation?.phone)}</span>
                  </span>

                  {activeConversation?.email && (
                    <span className="hidden sm:flex items-center gap-1 text-slate-500 text-[11px] truncate">
                      <FaEnvelope className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span className="truncate">{activeConversation.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions (Filter, Audio Call, Delete) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Filter Toggle */}
              <div className="hidden lg:flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[11px] shrink-0 mr-0.5">
                {(['all', 'customer', 'admin'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'customer' ? 'Customer' : 'Admin'}
                  </button>
                ))}
              </div>

              {/* Call Option */}
              <button
                type="button"
                onClick={() => startAudioCall(activeConversation?.id, activeConversation?.name)}
                disabled={!activeConversation || !!audioCall}
                className="bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
                title={`Start Live Audio Call with ${activeConversation?.name || 'Reviewer'}`}
              >
                <FaPhone className="w-3 h-3 text-emerald-200 shrink-0" />
                <span className="hidden sm:inline">Audio Call</span>
              </button>

              {/* Delete / Clear Conversation Button */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to clear chat history for ${activeConversation?.name || 'this reviewer'}?`)) {
                    clearMessages(activeConversation?.id);
                  }
                }}
                disabled={!activeConversation}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-stone-200 transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0 disabled:opacity-40"
                title={`Clear chat history for ${activeConversation?.name || 'this reviewer'}`}
              >
                <FaTrashCan className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div ref={chatFeedRef} className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-5 space-y-3.5 bg-stone-50/40">
            {hasMoreMessages && (
              <div className="flex justify-center my-1">
                <button
                  type="button"
                  onClick={async () => {
                    const container = chatFeedRef.current;
                    const prevScrollHeight = container ? container.scrollHeight : 0;
                    await loadOlderMessages();
                    requestAnimationFrame(() => {
                      if (container) {
                        container.scrollTop += (container.scrollHeight - prevScrollHeight);
                      }
                    });
                  }}
                  disabled={isLoadingOlderMessages}
                  className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-[#1b3b2b] text-xs font-bold rounded-full border border-stone-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingOlderMessages ? (
                    <>
                      <div className="w-3 h-3 rounded-full border-2 border-[#1b3b2b] border-t-transparent animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>⬆ Load Earlier Messages</span>
                      {chatTotal > messages.length && (
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                          +{chatTotal - messages.length}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            )}

            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <FaComments className="w-12 h-12 mb-2 opacity-30 text-emerald-800" />
                <p className="text-xs font-bold text-slate-700">No chat history with this user</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                  Type a reply below to start the conversation with {activeConversation?.name}.
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isAdmin = msg.sender === 'admin';

                {/* Check for Audio Call or Missed Call Event */}
                if (msg.text?.startsWith('📞')) {
                  const isMissed = msg.text.includes('Missed') || msg.text.includes('declined');
                  return (
                    <div key={msg.id} className="flex justify-center my-3 w-full animate-in fade-in">
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
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-100`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium px-1">
                      <span>{isAdmin ? 'Admin (You)' : msg.senderName || activeConversation?.name || 'Reviewer'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Attached Product Box */}
                    {msg.productInfo && (
                      <div className="mb-1 p-2 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center gap-2.5 max-w-sm">
                        <img
                          src={msg.productInfo.image}
                          alt={msg.productInfo.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {msg.productInfo.title}
                          </p>
                          <p className="text-[11px] text-emerald-700 font-bold">
                            Price: ${msg.productInfo.price} (Free Perk)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Attached Image */}
                    {msg.image && (
                      <div className="mb-1 rounded-xl overflow-hidden max-w-xs border border-stone-200 shadow-2xs">
                        <img 
                          src={msg.image} 
                          alt="Attachment" 
                          onClick={() => setPreviewImage(msg.image || null)}
                          className="w-full h-auto max-h-48 object-cover cursor-pointer hover:opacity-95" 
                        />
                      </div>
                    )}

                    {/* Text Bubble */}
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAdmin
                          ? 'bg-[#1b3b2b] text-white rounded-br-xs shadow-xs font-normal'
                          : 'bg-white text-slate-800 border border-stone-200 rounded-bl-xs shadow-2xs font-normal'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}

            {/* Real-Time Reviewer Typing Indicator */}
            {isTyping && typingSender !== 'admin' && (
              <div className="flex flex-col items-start animate-in fade-in duration-150">
                <span className="text-[10px] text-slate-400 font-medium mb-1">
                  {activeConversation?.name || 'Reviewer'} is typing...
                </span>
                <div className="bg-white px-3 py-2 rounded-2xl border border-stone-200 flex items-center gap-1.5 shadow-2xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Replying Status & Form */}
          <div className="border-t border-stone-200 bg-white shrink-0 sticky bottom-0 z-10">
            {/* Attached Photo Preview */}
            {selectedImage && (
              <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
                <img src={selectedImage} alt="Attachment" className="w-10 h-10 rounded-lg object-cover border border-emerald-200" />
                <span className="text-xs text-emerald-900 font-medium">Image attached</span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-slate-400 hover:text-rose-600 text-xs ml-auto cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-2.5 sm:p-3 flex items-center gap-2 bg-white">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl border border-stone-200 text-slate-500 hover:bg-stone-50 hover:text-[#1b3b2b] transition-colors cursor-pointer flex items-center justify-center shrink-0"
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
                placeholder={`Type reply to ${activeConversation?.name || 'Reviewer'}...`}
                className="flex-1 h-10 px-4 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] focus:bg-white transition-all font-medium text-slate-900"
              />

              <button
                type="submit"
                disabled={!replyText.trim() && !selectedImage}
                className="h-10 px-4 sm:px-5 rounded-xl bg-[#1b3b2b] hover:bg-emerald-800 active:scale-95 disabled:opacity-35 disabled:hover:bg-[#1b3b2b] disabled:pointer-events-none text-white shadow-xs transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0"
                title="Send reply"
              >
                <span className="hidden sm:inline">Send</span>
                <FaPaperPlane className="w-3.5 h-3.5 text-emerald-200" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Zooming Photos */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Zoomed Attachment"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
