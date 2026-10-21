'use client';

import React, { useState } from 'react';
import { 
  FaBoxOpen, 
  FaUsers, 
  FaComments, 
  FaStore, 
  FaLayerGroup,
  FaShieldHalved
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { StatCard } from '@/components/admin/StatCard';
import { AnalyticsChart, PlatformMetric } from '@/components/admin/AnalyticsChart';

export default function AdminAnalyticsPage() {
  const { products, messages } = useApp();
  const { users } = useAuth();
  const [activeRange, setActiveRange] = useState('all');

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalMessages = messages.length;
  const uniqueStores = Array.from(new Set(products.map((p) => p.store).filter(Boolean))) as string[];

  // Real store breakdown
  const storeDistribution = uniqueStores.map((store) => {
    const prods = products.filter((p) => p.store === store);
    const percentage = totalProducts > 0 ? Math.round((prods.length / totalProducts) * 100) : 0;
    return {
      store,
      count: prods.length,
      percentage: `${percentage}%`,
    };
  });

  const chartMetrics: PlatformMetric[] = [
    { label: 'Catalog Products', count: totalProducts, subtext: 'Verified items', color: '#1b3b2b' },
    { label: 'Partner Stores', count: uniqueStores.length, subtext: uniqueStores.join(', ') || 'Amazon sellers', color: '#d97706' },
    { label: 'Registered Reviewers', count: totalUsers, subtext: 'Active accounts', color: '#2563eb' },
    { label: 'Chat Inquiries', count: totalMessages, subtext: 'Customer threads', color: '#7c3aed' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Platform Analytics & Resource Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time counts across catalog products, partner stores, reviewer accounts, and customer communications.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          {['all'].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className="px-3 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider bg-white text-slate-900 shadow-2xs font-bold"
            >
              Live Data
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Catalog Products"
          value={totalProducts}
          change={totalProducts}
          icon={FaBoxOpen}
          accentColor="emerald"
        />
        <StatCard
          title="Registered Reviewers"
          value={totalUsers}
          change={totalUsers}
          icon={FaUsers}
          accentColor="blue"
        />
        <StatCard
          title="Support Messages"
          value={totalMessages}
          change={totalMessages}
          icon={FaComments}
          accentColor="purple"
        />
        <StatCard
          title="Partner Stores"
          value={uniqueStores.length}
          change={uniqueStores.length}
          icon={FaStore}
          accentColor="amber"
        />
      </div>

      {/* Main Chart */}
      <AnalyticsChart metrics={chartMetrics} />

      {/* Partner Store Breakdown Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FaStore className="w-4 h-4 text-amber-600" />
            <span>Amazon Partner Seller Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Verified sellers with active listings in the catalog</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {storeDistribution.map((item) => (
            <div key={item.store} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{item.store}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.percentage} of catalog
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {item.count} verified Amazon product campaign{item.count === 1 ? '' : 's'} live
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
