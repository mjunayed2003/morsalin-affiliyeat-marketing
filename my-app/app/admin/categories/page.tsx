'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FaTags, 
  FaPlus, 
  FaBoxOpen, 
  FaArrowRight, 
  FaLayerGroup,
  FaCheck
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';

export default function AdminCategoriesPage() {
  const { products, showToast } = useApp();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Compute product counts per category
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    customCategories.forEach((cat) => {
      if (!map.has(cat)) {
        map.set(cat, 0);
      }
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products, customCategories]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (categoryStats.some((c) => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      showToast('This category already exists.');
      return;
    }

    setCustomCategories((prev) => [...prev, newCategoryName.trim()]);
    showToast(`Category "${newCategoryName.trim()}" added.`);
    setNewCategoryName('');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize Amazon product niches, public category pills, and promotional groupings.
          </p>
        </div>
      </div>

      {/* Add Category Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Create New Category</h3>
        <p className="text-xs text-slate-500 mb-3">Add a new niche for Amazon partner stores</p>

        <form onSubmit={handleAddCategory} className="flex items-center gap-3 max-w-md">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Smart Kitchen, Fitness Gear"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs"
          >
            <FaPlus className="w-3 h-3" />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold text-sm">
                  <FaTags className="w-4 h-4 text-[#15803d]" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                </span>
              </div>

              <h4 className="font-bold text-base text-slate-900">{cat.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Active testing category</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/admin/products?search=${encodeURIComponent(cat.name)}`}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>View Products</span>
                <FaArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
