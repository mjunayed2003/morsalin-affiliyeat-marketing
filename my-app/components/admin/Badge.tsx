'use client';

import React from 'react';

export type BadgeVariant = 
  | 'active' 
  | 'blocked' 
  | 'pending' 
  | 'published' 
  | 'draft' 
  | 'archived' 
  | 'hot' 
  | 'verified' 
  | 'admin' 
  | 'client' 
  | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  children,
  size = 'sm'
}) => {
  const styles: Record<BadgeVariant, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    blocked: 'bg-rose-50 text-rose-700 border-rose-200/80',
    archived: 'bg-slate-100 text-slate-600 border-slate-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200/80',
    draft: 'bg-amber-50 text-amber-800 border-amber-200/80',
    hot: 'bg-purple-50 text-purple-700 border-purple-200/80',
    admin: 'bg-[#1b3b2b] text-emerald-200 border-[#2b5942]',
    client: 'bg-blue-50 text-blue-700 border-blue-200/80',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full border ${styles[variant]} ${sizeClass} tracking-wide`}>
      {children}
    </span>
  );
};
