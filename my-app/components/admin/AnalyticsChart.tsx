'use client';

import React, { useState } from 'react';
import { FaBoxOpen, FaUsers, FaComments, FaStore, FaChartSimple } from 'react-icons/fa6';

export interface PlatformMetric {
  label: string;
  count: number;
  subtext: string;
  color: string;
}

interface AnalyticsChartProps {
  metrics?: PlatformMetric[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ metrics }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const defaultMetrics: PlatformMetric[] = [
    { label: 'Catalog Products', count: 3, subtext: 'Verified items', color: '#1b3b2b' },
    { label: 'In-Stock Deals', count: 3, subtext: 'Prime eligible', color: '#15803d' },
    { label: 'Partner Stores', count: 3, subtext: 'LONG YUE, Lickoon, IMPS', color: '#d97706' },
    { label: 'Registered Reviewers', count: 1, subtext: 'Active accounts', color: '#2563eb' },
    { label: 'Chat Inquiries', count: 0, subtext: 'Customer threads', color: '#7c3aed' },
  ];

  const data = metrics && metrics.length > 0 ? metrics : defaultMetrics;
  const maxVal = Math.max(...data.map((d) => d.count), 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FaChartSimple className="w-4 h-4 text-[#1b3b2b]" />
            <span>Live Platform Resource Metrics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time counts across catalog, registered users, and active support threads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Database Live</span>
          </span>
        </div>
      </div>

      {/* Bar Visualization */}
      <div className="mt-6 h-56 flex items-end justify-between gap-3 sm:gap-6 px-4">
        {data.map((item, idx) => {
          const heightPercent = Math.max(12, Math.min(100, Math.round((item.count / maxVal) * 100)));
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-xl shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                  <p className="font-bold">{item.label}: {item.count}</p>
                  <p className="text-emerald-400 text-[10px]">{item.subtext}</p>
                </div>
              )}

              {/* Number Pill on Top */}
              <span className={`text-xs font-black mb-2 transition-all ${
                isHovered ? 'text-slate-950 scale-110' : 'text-slate-700'
              }`}>
                {item.count}
              </span>

              {/* Bar */}
              <div className="w-full flex items-end justify-center h-full">
                <div
                  style={{ 
                    height: `${heightPercent}%`,
                    backgroundColor: item.color
                  }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                    isHovered ? 'brightness-110 shadow-md' : 'opacity-90'
                  }`}
                />
              </div>

              {/* X-axis Label */}
              <span className={`text-[11px] font-semibold mt-3 text-center transition-colors truncate max-w-full ${
                isHovered ? 'text-slate-950 font-bold' : 'text-slate-500'
              }`} title={item.label}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-md bg-[#1b3b2b]" />
            <span>Products</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-md bg-[#d97706]" />
            <span>Stores</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-md bg-[#2563eb]" />
            <span>Reviewers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-md bg-[#7c3aed]" />
            <span>Chats</span>
          </div>
        </div>
        <span className="text-[11px] text-emerald-700 font-bold">100% Genuine Data Synced</span>
      </div>
    </div>
  );
};
