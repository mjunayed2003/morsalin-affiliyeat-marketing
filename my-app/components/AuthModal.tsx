'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { AuthCard } from './AuthCard';
import { FiX } from 'react-icons/fi';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();

  if (!isAuthModalOpen) return null;

  const getInitialTab = (): 'login' | 'register' => {
    if (authModalMode === 'register') return 'register';
    return 'login';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div 
        className="relative w-full max-w-lg my-auto"
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <FiX className="w-5 h-5" />
        </button>

        <AuthCard 
          initialTab={getInitialTab()}
          onSuccess={() => {
            closeAuthModal();
          }}
        />
      </div>
    </div>
  );
};
