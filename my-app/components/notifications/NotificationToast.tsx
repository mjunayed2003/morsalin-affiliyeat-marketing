'use client';

import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';

interface NotificationToastProps {
  message: string | null;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-70 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-slate-700 text-xs sm:text-sm max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-3 duration-200">
      <FaCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="font-medium truncate">{message}</span>
    </div>
  );
};
