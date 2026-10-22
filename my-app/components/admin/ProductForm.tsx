'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUpload, 
  FaFloppyDisk, 
  FaAmazon, 
  FaStore, 
  FaImage, 
  FaCheck,
  FaTrashCan,
  FaPlus
} from 'react-icons/fa6';
import { Product } from '@/app/types';
import { useApp } from '@/app/context/AppContext';

interface ProductFormProps {
  initialProduct?: Product;
  isEditMode?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialProduct, 
  isEditMode = false 
}) => {
  const router = useRouter();
  const { addProduct, updateProduct, showToast, formatAmazonUrl, settings } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialProduct?.title || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Pet Supplies');
  const [subCategory, setSubCategory] = useState(initialProduct?.subCategory || '');
  const [store, setStore] = useState(initialProduct?.store || '');
  const [amazonUrl, setAmazonUrl] = useState(initialProduct?.amazonUrl || '');
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.originalPrice?.toString() || '29');
  const [price, setPrice] = useState(initialProduct?.price?.toString() || '0');
  const [commissionAmount, setCommissionAmount] = useState(initialProduct?.commissionAmount?.toString() || '6');
  const [image, setImage] = useState(initialProduct?.image || '');
  const [gallery, setGallery] = useState<string[]>(initialProduct?.gallery || []);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [features, setFeatures] = useState(initialProduct?.features?.join('\n') || '');
  const [badge, setBadge] = useState(initialProduct?.badge || 'Amazon Choice');
  const [inStock, setInStock] = useState(initialProduct ? initialProduct.inStock : true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Compress local image file using canvas to keep payload small (<200KB)
  const compressImageFile = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Handle local image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    showToast('Optimizing image...');
    const optimized = await compressImageFile(file);
    if (optimized) {
      setImage(optimized);
      if (!gallery.includes(optimized)) {
        setGallery((prev) => [optimized, ...prev]);
      }
      showToast('Image uploaded and set as primary.');
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Product title is required.');
      return;
    }

    if (!originalPrice || parseFloat(originalPrice) <= 0) {
      setError('Please provide a valid original retail price.');
      return;
    }

    if (!image.trim()) {
      setError('Product primary image URL or upload is required.');
      return;
    }

    setIsSubmitting(true);

    const featureList = features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const productPayload: Product = {
      id: initialProduct?.id || `prod-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      description: description.trim() || 'Verified quality Amazon perk product for testers.',
      category: category.trim(),
      subCategory: subCategory.trim() || undefined,
      store: store.trim() || 'Amazon Partner Store',
      amazonUrl: amazonUrl.trim() ? formatAmazonUrl(amazonUrl.trim()) : undefined,
      originalPrice: parseFloat(originalPrice) || 29,
      price: parseFloat(price) || 0,
      commission: `$${commissionAmount} (${Math.round((parseFloat(commissionAmount) / parseFloat(originalPrice)) * 100)}%)`,
      commissionAmount: parseFloat(commissionAmount) || 0,
      image: image.trim(),
      gallery: gallery.length > 0 ? gallery : [image.trim()],
      features: featureList.length > 0 ? featureList : ['100% Free Testing Perk', 'Prime Fast Shipping'],
      badge: badge.trim() || undefined,
      inStock: inStock,
      rating: initialProduct?.rating || 4.8,
      reviewsCount: initialProduct?.reviewsCount || 120,
      affiliateCode: initialProduct?.affiliateCode || `AFF-${Date.now().toString().slice(-4)}`,
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
    };

    try {
      const res = isEditMode
        ? await updateProduct(productPayload)
        : await addProduct(productPayload);

      if (res && (res as any).success === false) {
        setError((res as any).message || 'Failed to save product to server.');
        setIsSubmitting(false);
        return;
      }

      showToast(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      setIsSubmitting(false);
      router.push('/admin/products');
    } catch (err: any) {
      setError(err?.message || 'Error occurred while communicating with server.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditMode ? `Edit Product: ${initialProduct?.title}` : 'Add New Amazon Product'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in product information, Amazon store details, and perk incentives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            <FaFloppyDisk className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
          {error}
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Core Fields */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ZGLONG Bamboo Dog Doorbell for Potty Training"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              required
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              >
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Smart Gadgets">Smart Gadgets</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Subcategory</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Dog Training & Behavior"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
            </div>
          </div>

          {/* Store Name & Amazon Affiliate URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <FaStore className="w-3 h-3 text-amber-600" />
                <span>Amazon Store Name *</span>
              </label>
              <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="e.g. LONG YUE, Lickoon"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <FaAmazon className="w-3 h-3 text-[#ff9900]" />
                <span>Official Amazon URL</span>
              </label>
              <input
                type="url"
                value={amazonUrl}
                onChange={(e) => setAmazonUrl(e.target.value)}
                placeholder="https://www.amazon.com/dp/B0GXTXF8T4"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
              {settings.amazonTag && (
                <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <span>Default Tag:</span>
                  <code className="font-mono font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">{settings.amazonTag}</code>
                  <span className="text-slate-400">(auto-appended on customer clicks)</span>
                </p>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Retail Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="29.00"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Perk Reviewer Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0 (Free)"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Commission Bonus ($)</label>
              <input
                type="number"
                step="0.01"
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(e.target.value)}
                placeholder="6.00"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the product, benefits, and usage instructions..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Key Features (One per line)</label>
            <textarea
              rows={3}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Solid Brass Bell&#10;No Drilling Required&#10;100% Pet-Safe Design"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
            />
          </div>

        </div>

        {/* Right Column (4 cols): Media & Badges */}
        <div className="md:col-span-4 space-y-5">
          
          {/* Image Upload / Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <label className="block text-xs font-bold text-slate-800">Primary Product Image *</label>

            {image ? (
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                >
                  <FaTrashCan className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1b3b2b] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100/70"
              >
                <FaUpload className="w-6 h-6 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Click to upload photo</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, or WebP</p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div>
              <p className="text-[11px] text-slate-500 mb-1">Or paste image URL:</p>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
            </div>
          </div>

          {/* Badge & Stock Status */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Promotional Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              >
                <option value="Amazon Choice">Amazon Choice</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Hot Deal">Hot Deal</option>
                <option value="New Arrival">New Arrival</option>
                <option value="">None</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800">In Stock / Available</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1b3b2b]"></div>
              </label>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
};
