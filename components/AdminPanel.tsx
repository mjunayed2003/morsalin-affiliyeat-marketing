'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  FaPlus, 
  FaPenToSquare, 
  FaTrashCan, 
  FaComments, 
  FaUpload, 
  FaImage, 
  FaCheck, 
  FaPaperPlane,
  FaBagShopping,
  FaDollarSign,
  FaRotate,
  FaCircleCheck,
  FaSliders,
  FaShareNodes,
  FaCopy,
  FaArrowUpRightFromSquare,
  FaLock
} from 'react-icons/fa6';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Product, ChatMessage } from '../app/types';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewChatImage, setPreviewChatImage] = useState<string | null>(null);
  
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
    setPrice('29');
    setOriginalPrice('39');
    setCommissionAmount('8');
    setImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
    setDescription('High performance smart gadget with premium build quality, fast charging, and full manufacturer warranty.');
    setFeatures('100% Original Authentic, 7-Day Replacement Guarantee, Fast Wireless Charging');
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
    setBadge(prod.badge || 'Hot Deal');
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
      onShowToast('Product photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Copy Direct Client Link
  const handleCopyClientLink = (prod: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://affilihub.com';
    const link = `${origin}/p/${prod.id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(prod.id);
    onShowToast(`Client link copied: /p/${prod.id}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !image) {
      alert('Please provide Product Title, Price, and Image.');
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
        commission: `$${pCommAmt} (${commPercent}%)`,
        commissionAmount: pCommAmt,
        image,
        description,
        features: featureList.length > 0 ? featureList : editingProduct.features,
        badge,
        affiliateCode: affiliateCode || editingProduct.affiliateCode
      };
      onUpdateProduct(updated);
      onShowToast('Product details updated successfully!');
    } else {
      const newProd: Product = {
        id: `prod-${Date.now().toString().slice(-6)}`,
        title,
        category,
        price: pPrice,
        originalPrice: pOrigPrice,
        commission: `$${pCommAmt} (${commPercent}%)`,
        commissionAmount: pCommAmt,
        image,
        description,
        features: featureList.length > 0 ? featureList : ['100% Original Quality', 'Cash on Delivery Available'],
        rating: 4.8,
        reviewsCount: 1,
        badge,
        affiliateCode: affiliateCode || `AFF-${Date.now().toString().slice(-4)}`,
        inStock: true,
        createdAt: new Date().toISOString()
      };
      onAddProduct(newProd);
      onShowToast('New product added to catalog!');
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
    onShowToast('Reply sent to customer inbox!');
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-6 px-4 sm:px-6 lg:px-8 selection:bg-[#ccff00] selection:text-slate-950 font-sans">
      
      {/* Lightbox for zooming attached chat images */}
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

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header Banner (ByteSpace Cobalt Blue) */}
        <div className="bg-[#0d5bff] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-600/15 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden border border-blue-600">
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#ccff00] text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-xs">
                Admin Control Room
              </span>
              <span className="text-xs text-blue-100 font-medium">
                Add, Edit, Share with Clients & Live Chat Desk
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Admin Product & Inquiry Studio
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl font-medium">
              Upload product photos, set prices in USD ($), and manage client inquiries. All uploaded products are published publicly on the storefront where clients can view details and chat with you.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-slate-950 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-black/10 transition-all cursor-pointer"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-2xl border border-white/20 transition-colors cursor-pointer"
            >
              Public Store (Home)
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0d5bff] flex items-center justify-center font-black">
              <FaBagShopping className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Products</p>
              <h3 className="text-lg font-black text-slate-950">{products.length} Items</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <FaComments className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Inbox Messages</p>
              <h3 className="text-lg font-black text-slate-950">{messages.length} Chats</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#ccff00]/30 text-slate-900 flex items-center justify-center font-black">
              <FaDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Affiliate Profit</p>
              <h3 className="text-lg font-black text-slate-950">$15+ / Sale</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
              <FaFacebookMessenger className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Messenger Ready</p>
              <h3 className="text-lg font-black text-emerald-600">OG Images Active</h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation (ByteSpace Styling) */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-black border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#0d5bff] text-[#0d5bff]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaBagShopping className="w-3.5 h-3.5" />
            <span>Product Catalog & Share Links ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-black border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'inbox'
                ? 'border-[#0d5bff] text-[#0d5bff]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaComments className="w-3.5 h-3.5" />
            <span>Live Chat Desk with Clients</span>
            {messages.length > 0 && (
              <span className="bg-[#ccff00] text-slate-950 text-[11px] px-2 py-0.5 rounded-full font-black">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('previewLab')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-black border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'previewLab'
                ? 'border-[#0d5bff] text-[#0d5bff]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaFacebookMessenger className="w-3.5 h-3.5 text-sky-500" />
            <span>Messenger Preview Lab</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  Published Products (Public Storefront)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  All items below are live on the public storefront. Click "Share to Client" or "Copy Link" to send directly to clients.
                </p>
              </div>

              <button
                onClick={onResetProducts}
                className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-950 bg-white border border-slate-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer font-bold"
              >
                <FaRotate className="w-3 h-3" />
                <span>Reset Demo Items</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div>
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="bg-slate-950/85 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-xs">
                          {prod.category}
                        </span>
                        {prod.badge && (
                          <span className="bg-[#ccff00] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-md">
                        Profit: {prod.commission}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-black text-slate-950 text-sm line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                        {prod.description}
                      </p>
                      
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-black text-slate-950">
                          ${prod.price.toLocaleString()}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-slate-400 line-through font-semibold">
                            ${prod.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Direct Client URL Display */}
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-700">
                        <span className="truncate max-w-[190px]">/p/{prod.id}</span>
                        <span className="text-[10px] bg-[#ccff00] text-slate-950 px-1.5 py-0.5 rounded font-black font-sans">
                          Direct Link
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Action Buttons */}
                  <div className="p-4 pt-0 space-y-2">
                    
                    {/* Primary Sharing Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenShareModal(prod)}
                        className="flex items-center justify-center gap-1.5 bg-[#0d5bff] hover:bg-[#0045d8] text-white py-2 px-3 rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                        title="Share with photo to Messenger or WhatsApp"
                      >
                        <FaFacebookMessenger className="w-3.5 h-3.5" />
                        <span>Share to Client</span>
                      </button>

                      <button
                        onClick={() => handleCopyClientLink(prod)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          copiedId === prod.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 shadow-xs'
                        }`}
                        title="Copy direct client link"
                      >
                        {copiedId === prod.id ? <FaCheck className="w-3.5 h-3.5" /> : <FaCopy className="w-3.5 h-3.5" />}
                        <span>{copiedId === prod.id ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>

                    {/* Secondary Management Row */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                      <Link
                        href={`/p/${prod.id}`}
                        target="_blank"
                        className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Open client landing view"
                      >
                        <FaArrowUpRightFromSquare className="w-3 h-3 text-slate-600" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Edit Product Details"
                      >
                        <FaPenToSquare className="w-3 h-3 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prod.title}"?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <FaTrashCan className="w-3 h-3 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INBOX & LIVE CHAT MANAGER */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-3">
            
            {/* Left: Chat Statistics & Instructions */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50 space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Client Live Chat Desk
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Direct communication desk between you and your clients.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs text-blue-900">
                <p className="font-bold flex items-center gap-1.5">
                  <FaCircleCheck className="w-4 h-4 text-[#0d5bff]" />
                  <span>Images & Screenshots Supported</span>
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                  Clients can upload product inquiry photos or payment receipts from their product link. You can inspect photos in full zoom, and reply with custom photos or parcel slips.
                </p>
              </div>

              <button
                onClick={onClearMessages}
                className="w-full py-2.5 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
              >
                Clear Chat History
              </button>
            </div>

            {/* Right: Message Stream & Admin Reply Box */}
            <div className="lg:col-span-2 flex flex-col h-[580px]">
              
              {/* Message Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/50 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FaComments className="w-10 h-10 mb-2 opacity-50" />
                    <span className="font-semibold">No chat messages yet.</span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdm = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdm ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-bold">
                          {isAdm ? 'Admin (You)' : 'Client'}
                        </span>

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs font-medium ${
                            isAdm
                              ? 'bg-[#0d5bff] text-white rounded-br-xs'
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
                                <p className="font-bold truncate">{msg.productInfo.title}</p>
                                <p className="opacity-90 font-black">${msg.productInfo.price}</p>
                              </div>
                            </div>
                          )}

                          {/* Attached Image (Click to Zoom) */}
                          {msg.image && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                              <img
                                src={msg.image}
                                alt="Chat Attachment"
                                onClick={() => setPreviewChatImage(msg.image || null)}
                                className="max-h-48 w-auto object-cover rounded-xl cursor-pointer hover:opacity-95"
                              />
                              <p className="text-[10px] mt-1 opacity-80 text-center font-bold">
                                (Click to zoom)
                              </p>
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
                <div className="p-3 bg-blue-50 border-t border-blue-200 flex items-center gap-2">
                  <img
                    src={adminReplyImage}
                    alt="Admin reply attachment"
                    className="w-12 h-12 object-cover rounded-xl border border-blue-300"
                  />
                  <span className="text-xs text-blue-900 font-bold flex-1">
                    Image attached to reply.
                  </span>
                  <button
                    onClick={() => setAdminReplyImage(null)}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
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
                  className="p-2.5 text-slate-600 hover:text-[#0d5bff] hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                  title="Attach and send photo to client"
                >
                  <FaImage className="w-4 h-4" />
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
                  placeholder="Type an official admin response to the client..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />

                <button
                  type="submit"
                  disabled={!adminReplyText.trim() && !adminReplyImage}
                  className="p-3 bg-[#0d5bff] hover:bg-[#0045d8] disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer font-bold"
                  title="Send Reply"
                >
                  <FaPaperPlane className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>
        )}

        {/* TAB 3: MESSENGER PREVIEW LAB */}
        {activeTab === 'previewLab' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Facebook Messenger & Social Share Simulator
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Inspect how social crawlers and Facebook Messenger render your product images and details.
              </p>
            </div>

            {/* Product Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">
                Select Product to Inspect:
              </label>
              <select
                value={selectedLabProduct?.id || ''}
                onChange={(e) => {
                  const found = products.find((p) => p.id === e.target.value);
                  if (found) setSelectedLabProduct(found);
                }}
                className="bg-slate-50 border border-slate-300 text-xs sm:text-sm rounded-xl px-3.5 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price})
                  </option>
                ))}
              </select>
            </div>

            {selectedLabProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Visual Messenger Chat Simulation */}
                <div className="bg-[#f0f2f5] p-5 rounded-3xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                    <FaFacebookMessenger className="w-4 h-4 text-sky-500" />
                    <span>Facebook Messenger Card Simulation:</span>
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-300 shadow-md">
                    <div className="aspect-16/9 bg-slate-200 overflow-hidden">
                      <img
                        src={selectedLabProduct.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                        AFFILIHUB.COM
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                        {selectedLabProduct.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
                        ${selectedLabProduct.price.toLocaleString()} • {selectedLabProduct.features.join(' | ')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenShareModal(selectedLabProduct)}
                    className="w-full mt-2 py-3 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaFacebookMessenger className="w-4 h-4" />
                    <span>Open Live Messenger Share Modal</span>
                  </button>
                </div>

                {/* Technical Meta Tags Inspector */}
                <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl space-y-3 font-mono text-xs overflow-x-auto shadow-md">
                  <div className="flex items-center justify-between text-slate-400 font-sans text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold text-white">Generated Open Graph Meta Tags</span>
                    <span className="text-[10px] bg-[#ccff00] text-slate-950 font-black px-2 py-0.5 rounded-full">
                      Crawler Verified
                    </span>
                  </div>

                  <p className="text-emerald-400">
                    &lt;meta property="og:type" content="website" /&gt;
                  </p>
                  <p className="text-emerald-400">
                    &lt;meta property="og:title" content="{selectedLabProduct.title} - Special Client Offer" /&gt;
                  </p>
                  <p className="text-emerald-400 break-all">
                    &lt;meta property="og:image" content="{selectedLabProduct.image}" /&gt;
                  </p>
                  <p className="text-emerald-400">
                    &lt;meta property="og:url" content="https://affilihub.com/p/{selectedLabProduct.id}" /&gt;
                  </p>

                  <div className="pt-2 border-t border-slate-800 font-sans text-[11px] text-slate-400 font-medium">
                    When you share the link <code className="text-[#ccff00]">/p/{selectedLabProduct.id}</code> on Messenger, Facebook's crawler automatically scrapes these tags to render the photo preview.
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
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-[#0d5bff] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ccff00] text-slate-950 flex items-center justify-center font-black">
                  <FaPlus className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-base font-black">
                  {editingProduct ? 'Edit Product Details' : 'Add New Affiliate Product'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar font-sans">
              
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T900 Ultra Series 9 Smart Watch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                  >
                    <option value="Smart Gadgets">Smart Gadgets</option>
                    <option value="Mobile Accessories">Mobile Accessories</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hot Deal / Best Seller"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                  >
                  </input>
                </div>
              </div>

              {/* Prices & Profit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Client Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="29"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="39"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Profit ($)
                  </label>
                  <input
                    type="number"
                    placeholder="8"
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                  />
                </div>
              </div>

              {/* Product Image (URL or Local Upload) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Image * (Upload from Device or Paste URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Image URL..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                  >
                    <FaImage className="w-3.5 h-3.5 text-[#0d5bff]" />
                    <span>Upload</span>
                  </button>
                  <input
                    ref={productFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProductImageUpload}
                  />
                </div>

                {image && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <span className="text-xs text-slate-600 font-medium">Image active and ready.</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description for client..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Key Specifications (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="100% Original, Cash on Delivery, 7 Days Replacement"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>{editingProduct ? 'Save Changes' : 'Add to Catalog'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
