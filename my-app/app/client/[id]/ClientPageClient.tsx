'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/app/context/AppContext';
import { ClientSharedView } from '@/components/ClientSharedView';
import { FaBagShopping, FaArrowLeft } from 'react-icons/fa6';

interface ClientPageClientProps {
  productId: string;
}

export const ClientPageClient: React.FC<ClientPageClientProps> = ({ productId }) => {
  const router = useRouter();
  const { getProductById, messages, sendCustomerMessage } = useApp();

  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mb-4">
          <FaBagShopping className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Item Not Found</h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6">
          This shared link may have expired or been removed by the owner.
        </p>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span>Browse Available Items</span>
        </button>
      </div>
    );
  }

  return (
    <ClientSharedView
      product={product}
      messages={messages}
      onSendMessage={sendCustomerMessage}
      onBackToOverview={() => router.push('/')}
      onOpenAdmin={() => router.push('/admin')}
    />
  );
};
