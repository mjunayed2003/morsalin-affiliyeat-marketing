'use client';

import React, { useState, useRef } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMessageCircle, 
  FiUpload, 
  FiImage, 
  FiCheck, 
  FiX, 
  FiTag, 
  FiEye, 
  FiSend,
  FiShoppingBag,
  FiTrendingUp,
  FiShare2,
  FiRefreshCw,
  FiDollarSign,
  FiExternalLink
} from 'react-icons/fi';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';
import { Product, ChatMessage } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  messages: ChatMessage[];
  onAdminReply: (text: string, image?: string) => void;
  onClearMessages: () => void;
  onOpenShareModal: (product: Product) => void;
  onShowToast: (message: string) => void;
  onCloseAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  messages,
  onAdminReply,
  onClearMessages,
  onOpenShareModal,
  onShowToast,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'inbox' | 'previewLab'>('products');
  
  // Product Form State (for Add or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Smart Gadgets');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [commissionAmount, setCommissionAmount] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [badge, setBadge] = useState('Hot Deal');
  const [affiliateCode, setAffiliateCode] = useState('');
  
  // Admin Chat Reply State
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminReplyImage, setAdminReplyImage] = useState<string | null>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Selected Product for Preview Lab
  const [selectedLabProduct, setSelectedLabProduct] = useState<Product>(products[0] || null);

  // Open Form for Adding New Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Smart Gadgets');
    setPrice('1500');
    setOriginalPrice('2000');
    setCommissionAmount('250');
    setImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
    setDescription('নতুন প্রিমিয়াম কোয়ালিটি প্রোডাক্ট। লাইভ সাপোর্ট ও হোম ডেলিভারি এভেইলেবল।');
    setFeatures('১০০% আসল প্রোডাক্ট, ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি, ফাস্ট চার্জিং সাপোর্ট');
    setBadge('Hot Deal');
    setAffiliateCode(`AFF-${Date.now().toString().slice(-5)}`);
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Product
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setCategory(prod.category);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice.toString());
    setCommissionAmount(prod.commissionAmount.toString());
    setImage(prod.image);
    setDescription(prod.description);
    setFeatures(prod.features.join(', '));
    setBadge(prod.badge || 'Trending');
    setAffiliateCode(prod.affiliateCode);
    setIsFormOpen(true);
  };

  // Handle Image Upload from Admin Device
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      onShowToast('ছবি আপলোড সম্পন্ন হয়েছে!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !image) {
      alert('দয়া করে প্রোডাক্টের নাম, মূল্য এবং ছবি প্রদান করুন।');
      return;
    }

    const pPrice = parseFloat(price) || 0;
    const pOrigPrice = parseFloat(originalPrice) || pPrice;
    const pCommAmt = parseFloat(commissionAmount) || Math.round(pPrice * 0.15);
    const commPercent = Math.round((pCommAmt / pPrice) * 100);

    const featureList = features
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title,
        category,
        price: pPrice,
        originalPrice: pOrigPrice,
        commission: `৳${pCommAmt} (${commPercent}%)`,
        commissionAmount: pCommAmt,
        image,
        description,
        features: featureList.length > 0 ? featureList : editingProduct.features,
        badge,
        affiliateCode: affiliateCode || editingProduct.affiliateCode
      };
      onUpdateProduct(updated);
      onShowToast('প্রোডাক্ট সফলভাবে আপডেট হয়েছে!');
    } else {
      const newProd: Product = {
        id: `prod-${Date.now().toString().slice(-6)}`,
        title,
        category,
        price: pPrice,
        originalPrice: pOrigPrice,
        commission: `৳${pCommAmt} (${commPercent}%)`,
        commissionAmount: pCommAmt,
        image,
        description,
        features: featureList.length > 0 ? featureList : ['১০০% অরিজিনাল কোয়ালিটি', 'ক্যাশ অন ডেলিভারি এভেইলেবল'],
        rating: 4.8,
        reviewsCount: 1,
        badge,
        affiliateCode: affiliateCode || `AFF-${Date.now().toString().slice(-4)}`,
        inStock: true,
        createdAt: new Date().toISOString()
      };
      onAddProduct(newProd);
      onShowToast('নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে!');
    }

    setIsFormOpen(false);
  };

  // Handle Admin Chat Image Attachment
  const handleAdminChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAdminReplyImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Submit Admin Chat Reply
  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() && !adminReplyImage) return;

    onAdminReply(adminReplyText.trim(), adminReplyImage || undefined);
    setAdminReplyText('');
    setAdminReplyImage(null);
    onShowToast('অ্যাডমিন রিপ্লাই পাঠানো হয়েছে!');
  };

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-80px)] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header Banner */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full">
                Admin Control Room
              </span>
              <span className="text-xs text-slate-500">
                প্রোডাক্ট, ইমেজ, অ্যাফিলিয়েট ও ইনবক্স কন্ট্রোল
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              অ্যাডমিন ড্যাশবোর্ড ও ম্যানেজমেন্ট প্যানেল
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              এখান থেকে নতুন প্রোডাক্ট যোগ করুন, ছবি এডিট করুন এবং কাস্টমারদের ইনবক্স মেসেজে রিপ্লাই ও ছবি পাঠান।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>নতুন প্রোডাক্ট যোগ করুন</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              স্টোরে ফিরুন
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">মোট প্রোডাক্টস</p>
              <h3 className="text-lg font-bold text-slate-900">{products.length} টি</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FiMessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">ইনবক্স মেসেজ</p>
              <h3 className="text-lg font-bold text-slate-900">{messages.length} টি</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">গড় কমিশন</p>
              <h3 className="text-lg font-bold text-slate-900">৳৩৫০+ / সেল</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <FaFacebookMessenger className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">মেসেঞ্জার প্রিভিউ</p>
              <h3 className="text-lg font-bold text-emerald-600">১০০% রেডি</h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>প্রোডাক্ট ও ইমেজ ম্যানেজমেন্ট ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inbox'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiMessageCircle className="w-4 h-4" />
            <span>লাইভ চ্যাট ইনবক্স ম্যানেজার</span>
            {messages.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('previewLab')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'previewLab'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaFacebookMessenger className="w-4 h-4 text-sky-500" />
            <span>মেসেঞ্জার প্রিভিউ ল্যাব</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                সকল প্রোডাক্ট তালিকা
              </h2>
              <button
                onClick={onResetProducts}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>রিসেট ডেমো ডাটা</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {prod.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      কমিশন: {prod.commission}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {prod.description}
                      </p>
                      
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-lg font-bold text-slate-900">
                          ৳{prod.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ৳{prod.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="এডিট করুন"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>

                      <button
                        onClick={() => onOpenShareModal(prod)}
                        className="flex items-center justify-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="মেসেঞ্জার প্রিভিউ দেখুন"
                      >
                        <FaFacebookMessenger className="w-3.5 h-3.5" />
                        <span>প্রিভিউ</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${prod.title}" প্রোডাক্টটি মুছে ফেলতে চান?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INBOX & MESSAGES MANAGER */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-3">
            
            {/* Left: Chat Statistics & Quick Actions */}
            <div className="p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  কাস্টমার লাইভ কনভারসেশন
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  কাস্টমারদের আসা মেসেজগুলো পড়ুন এবং এখান থেকেই রিপ্লাই দিন।
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs text-blue-900">
                <p className="font-semibold flex items-center gap-1.5">
                  <FiCheck className="w-4 h-4 text-blue-600" />
                  সরাসরি ইমেজ পাঠানোর সুবিধা
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  কাস্টমার কোনো ছবি পাঠালে তা চ্যাটে বড় করে দেখতে পারবেন এবং আপনিও প্রোডাক্টের আসল ছবি বা ইনভয়েস কাস্টমারকে পাঠাতে পারবেন।
                </p>
              </div>

              <button
                onClick={onClearMessages}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                চ্যাট হিস্ট্রি ক্লিয়ার করুন
              </button>
            </div>

            {/* Right: Message Stream & Admin Reply Box */}
            <div className="lg:col-span-2 flex flex-col h-[550px]">
              
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FiMessageCircle className="w-8 h-8 mb-2" />
                    <span>কোনো মেসেজ নেই।</span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-medium">
                          {isAdmin ? 'অ্যাডমিন (আপনি)' : 'কাস্টমার (Client)'}
                        </span>

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                            isAdmin
                              ? 'bg-slate-900 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                          }`}
                        >
                          {/* Attached Product */}
                          {msg.productInfo && (
                            <div className="mb-2 p-2 bg-black/10 rounded-xl flex items-center gap-2 border border-white/20">
                              <img
                                src={msg.productInfo.image}
                                alt={msg.productInfo.title}
                                className="w-9 h-9 object-cover rounded-md"
                              />
                              <div className="min-w-0 text-left text-xs">
                                <p className="font-semibold truncate">{msg.productInfo.title}</p>
                                <p className="opacity-90 font-bold">৳{msg.productInfo.price}</p>
                              </div>
                            </div>
                          )}

                          {/* Attached Image */}
                          {msg.image && (
                            <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                              <img
                                src={msg.image}
                                alt="Chat Attachment"
                                className="max-h-44 w-auto object-cover rounded-md"
                              />
                            </div>
                          )}

                          {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                        </div>

                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Admin Reply Image Preview */}
              {adminReplyImage && (
                <div className="p-2 bg-blue-50 border-t border-blue-200 flex items-center gap-2">
                  <img
                    src={adminReplyImage}
                    alt="Admin reply attachment"
                    className="w-10 h-10 object-cover rounded-lg border border-blue-300"
                  />
                  <span className="text-xs text-blue-900 font-medium flex-1">
                    ছবি এটাচ করা হয়েছে।
                  </span>
                  <button
                    onClick={() => setAdminReplyImage(null)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-md cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Admin Input Form */}
              <form onSubmit={handleSendAdminReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adminFileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  title="কাস্টমারকে ছবি পাঠান"
                >
                  <FiImage className="w-5 h-5" />
                </button>

                <input
                  ref={adminFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAdminChatImageUpload}
                />

                <input
                  type="text"
                  placeholder="অ্যাডমিন হিসেবে কাস্টমারকে রিপ্লাই লিখুন..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />

                <button
                  type="submit"
                  disabled={!adminReplyText.trim() && !adminReplyImage}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                  title="রিপ্লাই পাঠান"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>
        )}

        {/* TAB 3: MESSENGER PREVIEW LAB */}
        {activeTab === 'previewLab' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                মেসেঞ্জার ও ওপেন-গ্রাফ (Open Graph) প্রিভিউ ল্যাব
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ক্লায়েন্ট মেসেঞ্জারে লিংক দিলে কীভাবে ছবি ও ডিটেইলস ভেসে ওঠে তা পরীক্ষা করুন।
              </p>
            </div>

            {/* Product Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">
                যাচাইয়ের জন্য প্রোডাক্ট বেছে নিন:
              </label>
              <select
                value={selectedLabProduct?.id || ''}
                onChange={(e) => {
                  const found = products.find((p) => p.id === e.target.value);
                  if (found) setSelectedLabProduct(found);
                }}
                className="bg-slate-50 border border-slate-300 text-xs sm:text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (৳{p.price})
                  </option>
                ))}
              </select>
            </div>

            {selectedLabProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Visual Messenger Chat Simulation */}
                <div className="bg-[#f0f2f5] p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
                    <FaFacebookMessenger className="w-4 h-4 text-sky-500" />
                    <span>Facebook Messenger প্রিভিউ কার্ড:</span>
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden border border-slate-300 shadow-md">
                    <div className="aspect-16/9 bg-slate-200 overflow-hidden">
                      <img
                        src={selectedLabProduct.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">
                        AFFILIHUB.COM
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                        {selectedLabProduct.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        ৳{selectedLabProduct.price.toLocaleString()} • {selectedLabProduct.features.join(' | ')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenShareModal(selectedLabProduct)}
                    className="w-full mt-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FaFacebookMessenger className="w-4 h-4" />
                    <span>মেসেঞ্জারে লাইভ শেয়ার উইন্ডো ওপেন করুন</span>
                  </button>
                </div>

                {/* Technical Meta Tags Inspector */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-3 font-mono text-xs overflow-x-auto">
                  <div className="flex items-center justify-between text-slate-400 font-sans text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold">Generated Open Graph Meta Tags</span>
                    <span className="text-[10px] text-emerald-400">Valid & Verified</span>
                  </div>

                  <p className="text-emerald-400">
                    &lt;meta property="og:type" content="product" /&gt;
                  </p>
                  <p className="text-emerald-400">
                    &lt;meta property="og:title" content="{selectedLabProduct.title}" /&gt;
                  </p>
                  <p className="text-emerald-400 break-all">
                    &lt;meta property="og:image" content="{selectedLabProduct.image}" /&gt;
                  </p>
                  <p className="text-emerald-400">
                    &lt;meta property="og:price:amount" content="{selectedLabProduct.price}" /&gt;
                  </p>
                  <p className="text-emerald-400">
                    &lt;meta property="og:price:currency" content="BDT" /&gt;
                  </p>

                  <div className="pt-2 border-t border-slate-800 font-sans text-[11px] text-slate-400">
                    ফেসবুক স্ক্র্যাপার এই ট্যাগগুলো পড়ে স্বয়ংক্রিয়ভাবে থাম্বনেইল প্রদর্শন করে।
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingProduct ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যোগ করুন'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  প্রোডাক্টের নাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: T900 Ultra Series 9 Smart Watch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Smart Gadgets">Smart Gadgets</option>
                    <option value="Mobile Accessories">Mobile Accessories</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    হাইলাইট ব্যাজ
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Hot Deal">Hot Deal</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Affiliate Pick">Affiliate Pick</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
              </div>

              {/* Price, Original Price & Commission */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    অফার মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1850"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    রেগুলার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="2450"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    কমিশন (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="320"
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Image Upload Option */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  প্রোডাক্ট ছবি আপলোড (Image Upload) *
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="ইমেজ URL অথবা নিচের বাটন থেকে ছবি আপলোড করুন"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <FiUpload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড</span>
                  </button>
                </div>

                <input
                  ref={productFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageUpload}
                />

                {image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={image}
                      alt="Thumbnail preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                    />
                    <span className="text-[11px] text-slate-500">
                      ইমেজ প্রিভিউ লোড হয়েছে (মেসেঞ্জারেও এটি দেখাবে)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="প্রোডাক্ট সম্পর্কে প্রয়োজনীয় তথ্য..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Features */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  মূল বৈশিষ্ট্যসমূহ (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ফাস্ট চার্জিং, ব্লুটুথ কলিং, ওয়াটারপ্রুফ"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {editingProduct ? 'আপডেট করুন' : 'প্রোডাক্ট সংরক্ষণ করুন'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
