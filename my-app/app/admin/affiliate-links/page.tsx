'use client';

import React, { useState } from 'react';
import { 
  FaLink, 
  FaCopy, 
  FaCheck, 
  FaAmazon, 
  FaStore, 
  FaArrowUpRightFromSquare,
  FaShieldHalved
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Product } from '@/app/types';

export default function AdminAffiliateLinksPage() {
  const { products, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    showToast(`${label} copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const columns: Column<Product>[] = [
    {
      key: 'title',
      header: 'Product & Campaign',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <img
            src={p.image}
            alt={p.title}
            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200"
          />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{p.title}</p>
            <p className="text-[11px] text-slate-400 font-medium">{p.store || 'Amazon Store'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'affiliateCode',
      header: 'Affiliate Code',
      render: (p) => (
        <div className="flex items-center gap-2">
          <code className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-emerald-800">
            {p.affiliateCode || 'AFF-PERK'}
          </code>
          <button
            onClick={() => handleCopy(p.affiliateCode || 'AFF-PERK', 'Affiliate code')}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
            title="Copy Code"
          >
            {copiedCode === p.affiliateCode ? <FaCheck className="w-3 h-3 text-emerald-600" /> : <FaCopy className="w-3 h-3" />}
          </button>
        </div>
      ),
    },
    {
      key: 'amazonUrl',
      header: 'Target Listing URL',
      render: (p) => (
        <div className="flex items-center gap-2 max-w-[280px]">
          <span className="text-[11px] text-slate-500 font-mono truncate">
            {p.amazonUrl || 'https://www.amazon.com'}
          </span>
          {p.amazonUrl && (
            <button
              onClick={() => handleCopy(p.amazonUrl!, 'Amazon URL')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 shrink-0"
              title="Copy URL"
            >
              {copiedCode === p.amazonUrl ? <FaCheck className="w-3 h-3 text-emerald-600" /> : <FaCopy className="w-3 h-3" />}
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'commission',
      header: 'Commission',
      render: (p) => (
        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
          {p.commission || `$${p.commissionAmount}`}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Direct Test',
      className: 'text-right',
      render: (p) => (
        p.amazonUrl ? (
          <a
            href={p.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-semibold transition-colors"
          >
            <FaAmazon className="w-3 h-3 text-[#ff9900]" />
            <span>Open Amazon</span>
            <FaArrowUpRightFromSquare className="w-2.5 h-2.5 opacity-60" />
          </a>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Affiliate Link Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking tags, Amazon Associates store references, and outbound affiliate links.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <FaAmazon className="w-4 h-4 text-[#ff9900] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Amazon Associates Compliance Notice</p>
          <p className="text-amber-800/90 mt-0.5 leading-relaxed">
            All outbound links automatically include partner store tracking tags (<code className="font-mono bg-amber-100 px-1 py-0.2 rounded">tag=bwbh00-20</code>). Ensure products are tested by verified US Amazon buyers for authentic customer reviews.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={products}
        searchKey={(p) => `${p.title} ${p.store || ''} ${p.affiliateCode || ''}`}
        searchPlaceholder="Search affiliate links by product or code..."
        pageSize={8}
      />

    </div>
  );
}
