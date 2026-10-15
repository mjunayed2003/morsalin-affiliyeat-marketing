'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaBoxOpen, 
  FaPlus, 
  FaPenToSquare, 
  FaTrashCan, 
  FaAmazon, 
  FaStore, 
  FaStar,
  FaArrowUpRightFromSquare,
  FaRotate,
  FaFilter,
  FaEye
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { Product } from '@/app/types';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, deleteProduct, resetProducts, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products;
    return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  const columns: Column<Product>[] = [
    {
      key: 'title',
      header: 'Product',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <img
            src={p.image}
            alt={p.title}
            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
          />
          <div className="min-w-0">
            <Link
              href={`/admin/products/${p.id}/edit`}
              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
            >
              {p.title}
            </Link>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="font-mono">{p.id}</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                <FaStar className="w-2.5 h-2.5" />
                {p.rating} ({p.reviewsCount})
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category / Store',
      sortable: true,
      render: (p) => (
        <div>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {p.category}
          </span>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
            <FaStore className="w-2.5 h-2.5 text-amber-600" />
            <span>{p.store || 'Amazon Store'}</span>
          </p>
        </div>
      ),
    },
    {
      key: 'originalPrice',
      header: 'Retail & Perk',
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-bold text-slate-900">${p.originalPrice.toFixed(2)}</p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
            100% Free / Perk
          </span>
        </div>
      ),
    },
    {
      key: 'badge',
      header: 'Badge',
      render: (p) => (
        p.badge ? <Badge variant="hot">{p.badge}</Badge> : <span className="text-slate-400">—</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        p.inStock ? <Badge variant="published">Published</Badge> : <Badge variant="archived">Out of Stock</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/p/${p.id}`}
            target="_blank"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Preview Public Page"
          >
            <FaEye className="w-3.5 h-3.5" />
          </Link>

          {p.amazonUrl && (
            <a
              href={p.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              title="Official Amazon Listing"
            >
              <FaAmazon className="w-3.5 h-3.5 text-[#e08500]" />
            </a>
          )}

          <Link
            href={`/admin/products/${p.id}/edit`}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Edit Product"
          >
            <FaPenToSquare className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setProductToDelete(p)}
            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Product"
          >
            <FaTrashCan className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage tested Amazon items, commission rates, verified seller links, and reviewer availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            title="Restore official Amazon products"
          >
            <FaRotate className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#1b3b2b] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        searchKey={(p) => `${p.title} ${p.store || ''} ${p.category} ${p.id}`}
        searchPlaceholder="Search products by title, store, or ID..."
        pageSize={8}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <ConfirmModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          title="Delete Product"
          message={`Are you sure you want to remove "${productToDelete.title}"? This product will no longer appear on the public catalog.`}
          confirmLabel="Delete Product"
          isDestructive={true}
          onConfirm={() => {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }}
        />
      )}

      {/* Reset Defaults Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="Reset Catalog to Defaults"
        message="Are you sure you want to restore the official verified Amazon catalog (LONG YUE Doorbell, Lickoon Repellent, IMPS Hair Fibers)? Any custom products created locally will be reset."
        confirmLabel="Reset Catalog"
        isDestructive={false}
        onConfirm={() => {
          resetProducts();
          setConfirmResetOpen(false);
        }}
      />

    </div>
  );
}
