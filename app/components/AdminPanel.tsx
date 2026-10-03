'use client';

import React, { useState, useRef } from 'react';
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
  FaSliders
} from 'react-icons/fa6';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
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
      onShowToast('Product photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
        commission: `৳${pCommAmt} (${commPercent}%)`,
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
        commission: `৳${pCommAmt} (${commPercent}%)`,
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
                Products, Images, Affiliate Links & Live Customer Desk
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Affiliate Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Add new products, upload custom images, adjust commission rates, and reply to client inquiries with image attachments.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FaBagShopping className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Products</p>
              <h3 className="text-lg font-bold text-slate-900">{products.length} Items</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaComments className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Inbox Messages</p>
              <h3 className="text-lg font-bold text-slate-900">{messages.length} Chats</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FaDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Avg Commission</p>
              <h3 className="text-lg font-bold text-slate-900">৳350+ / Sale</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <FaFacebookMessenger className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Messenger Preview</p>
              <h3 className="text-lg font-bold text-emerald-600">100% Ready</h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaBagShopping className="w-3.5 h-3.5" />
            <span>Product & Image Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'inbox'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaComments className="w-3.5 h-3.5" />
            <span>Live Chat Inbox Manager</span>
            {messages.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('previewLab')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'previewLab'
                ? 'border-blue-600 text-blue-600'
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
              <h2 className="text-base font-bold text-slate-900">
                All Listed Products
              </h2>
              <button
                onClick={onResetProducts}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <FaRotate className="w-3 h-3" />
                <span>Reset Demo Catalog</span>
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
                      Commission: {prod.commission}
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
                        className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <FaPenToSquare className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onOpenShareModal(prod)}
                        className="flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="View Messenger Preview"
                      >
                        <FaFacebookMessenger className="w-3 h-3" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prod.title}"?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <FaTrashCan className="w-3 h-3" />
                        <span>Delete</span>
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
                  Customer Live Inquiries
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Read client inquiries and send direct admin replies with photos.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs text-blue-900">
                <p className="font-semibold flex items-center gap-1.5">
                  <FaCircleCheck className="w-3.5 h-3.5 text-blue-600" />
                  Direct Image Send & Receive
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  When a client sends a screenshot or photo, you can inspect it in full zoom, and attach your own parcel slips or real product photos in response.
                </p>
              </div>

              <button
                onClick={onClearMessages}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                Clear Chat History
              </button>
            </div>

            {/* Right: Message Stream & Admin Reply Box */}
            <div className="lg:col-span-2 flex flex-col h-[550px]">
              
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FaComments className="w-8 h-8 mb-2" />
                    <span>No chat messages yet.</span>
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
                          {isAdmin ? 'Admin (You)' : 'Customer (Client)'}
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
                    Image attached to reply.
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
                  placeholder="Type an official admin response to the customer..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />

                <button
                  type="submit"
                  disabled={!adminReplyText.trim() && !adminReplyImage}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Messenger & Open Graph Social Preview Lab
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect how social crawlers and Facebook Messenger render your product images and details.
              </p>
            </div>

            {/* Product Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">
                Select Product to Inspect:
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
                    <span>Facebook Messenger Live Card Simulation:</span>
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden border border-slate-300 shadow-md">
                    <div className="aspect-16/9 bg-slate-200 overflow-hidden">
                      <img
                        src={selectedLabProduct.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
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
                    className="w-full mt-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaFacebookMessenger className="w-4 h-4" />
                    <span>Open Live Messenger Share Modal</span>
                  </button>
                </div>

                {/* Technical Meta Tags Inspector */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-3 font-mono text-xs overflow-x-auto">
                  <div className="flex items-center justify-between text-slate-400 font-sans text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold">Generated Open Graph Meta Tags</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Valid & Verified</span>
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
                    Facebook Messenger crawlers scrape these tags automatically to produce high-resolution link previews with images.
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
                {editingProduct ? 'Edit Product Details' : 'Add New Affiliate Product'}
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
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T900 Ultra Series 9 Smart Watch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
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
                    Highlight Badge
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
                    Deal Price (৳) *
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
                    Regular Price (৳)
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
                    Commission (৳)
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
                  Product Image Upload *
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Image URL or click upload button"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <FaUpload className="w-3 h-3" />
                    <span>Upload</span>
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
                      Image preview active (will appear on Messenger share)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide essential details about the product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Features */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Key Specifications (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fast Wireless Charging, Bluetooth HD Calling, Water Resistant"
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
