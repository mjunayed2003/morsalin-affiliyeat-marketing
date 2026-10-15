'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaArrowPointer, 
  FaAmazon, 
  FaStore, 
  FaFileCsv, 
  FaArrowUpRightFromSquare,
  FaCopy,
  FaCheck
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { Product } from '@/app/types';

export default function AdminClicksPage() {
  const { products, showToast } = useApp();

  const handleExportCSV = () => {
    const headers = ['Product ID', 'Title', 'Partner Store', 'Affiliate Code', 'Amazon URL'];
    const rows = products.map((p) => [
      p.id,
      `"${p.title}"`,
      `"${p.store || 'Amazon Store'}"`,
      p.affiliateCode,
      `"${p.amazonUrl || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `affiliate_campaigns_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Affiliate campaign routes exported to CSV.');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Amazon affiliate link copied to clipboard!');
  };

  const columns: Column<Product>[] = [
    {
      key: 'title',
      header: 'Product & Catalog Target',
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
              href={`/p/${p.id}`}
              target="_blank"
              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
            >
              {p.title}
            </Link>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="font-mono">{p.id}</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                <FaStore className="w-2.5 h-2.5" />
                {p.store}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'affiliateCode',
      header: 'Affiliate Code',
      sortable: true,
      render: (p) => (
        <code className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          {p.affiliateCode}
        </code>
      ),
    },
    {
      key: 'commission',
      header: 'Reviewer Reward Perk',
      render: (p) => (
        <span className="font-bold text-emerald-700 text-xs">
          {p.commission}
        </span>
      ),
    },
    {
      key: 'amazonUrl',
      header: 'Official Amazon Destination',
      render: (p) => (
        <div className="flex items-center gap-2">
          {p.amazonUrl ? (
            <>
              <a
                href={p.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80 transition-colors"
              >
                <FaAmazon className="w-3.5 h-3.5 text-[#ff9900]" />
                <span>Verified Listing</span>
                <FaArrowUpRightFromSquare className="w-2.5 h-2.5 opacity-60" />
              </a>

              <button
                onClick={() => copyUrl(p.amazonUrl!)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Copy Amazon URL"
              >
                <FaCopy className="w-3 h-3" />
              </button>
            </>
          ) : (
            <span className="text-slate-400 text-xs italic">No URL set</span>
          )}
        </div>
      ),
    },
    {
      key: 'inStock',
      header: 'Link Status',
      render: (p) => (
        <Badge variant={p.inStock ? 'active' : 'blocked'}>
          {p.inStock ? 'LIVE ROUTE' : 'PAUSED'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Affiliate Links & Campaign Outbound Routes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified Amazon seller links, campaign referral codes, and outbound redirection routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <FaFileCsv className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Campaign Links</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={products}
        searchKey={(p) => `${p.title} ${p.store} ${p.affiliateCode}`}
        searchPlaceholder="Filter affiliate routes by product or store..."
        pageSize={10}
      />

    </div>
  );
}
