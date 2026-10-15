'use client';

import React from 'react';
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from 'react-icons/fa6';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'emerald' | 'amber' | 'blue' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  accentColor = 'emerald'
}) => {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-100',
    },
  }[accentColor];

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl ${colorStyles.bg} ${colorStyles.text} border ${colorStyles.border} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
            isPositive
              ? 'text-emerald-700 bg-emerald-50'
              : isNegative
              ? 'text-rose-700 bg-rose-50'
              : 'text-slate-600 bg-slate-100'
          }`}>
            {isPositive && <FaArrowTrendUp className="w-2.5 h-2.5" />}
            {isNegative && <FaArrowTrendDown className="w-2.5 h-2.5" />}
            {!isPositive && !isNegative && <FaMinus className="w-2.5 h-2.5" />}
            <span>{isPositive ? `+${change}%` : `${change}%`}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};
