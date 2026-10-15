'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaBullhorn, 
  FaPlus, 
  FaStar, 
  FaStore,
  FaCheck,
  FaAmazon,
  FaArrowUpRightFromSquare
} from 'react-icons/fa6';
import { Badge } from '@/components/admin/Badge';
import { useApp } from '@/app/context/AppContext';

export default function AdminCampaignsPage() {
  const { products, showToast } = useApp();

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Marketing & Review Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active Amazon seller sponsored campaigns and verified product review drives.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>New Product Campaign</span>
        </Link>
      </div>

      {/* Campaigns Grid from Real Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={p.inStock ? 'active' : 'blocked'}>
                  {p.inStock ? 'ACTIVE CAMPAIGN' : 'PAUSED'}
                </Badge>
                <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
              </div>

              <div className="flex items-start gap-3 my-2">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{p.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                    <FaStore className="w-2.5 h-2.5 text-amber-600" />
                    <span>{p.store || 'Amazon Store'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Amazon Reviews</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <FaStar className="w-3 h-3 text-amber-500" />
                  <span>{p.rating} ({p.reviewsCount} reviews)</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Reviewer Perk</span>
                <span className="font-bold text-emerald-700">{p.commission}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Retail: ${p.originalPrice.toFixed(2)}</span>
                {p.amazonUrl && (
                  <a
                    href={p.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    <span>Amazon Listing</span>
                    <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
