'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/app/context/AppContext';
import { AdminPanel } from '@/components/AdminPanel';

export const AdminPageClient: React.FC = () => {
  const router = useRouter();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    messages,
    sendAdminReply,
    clearMessages,
    openShareModal,
    showToast
  } = useApp();

  return (
    <AdminPanel
      products={products}
      onAddProduct={addProduct}
      onUpdateProduct={updateProduct}
      onDeleteProduct={deleteProduct}
      onResetProducts={resetProducts}
      messages={messages}
      onAdminReply={sendAdminReply}
      onClearMessages={clearMessages}
      onOpenShareModal={openShareModal}
      onShowToast={showToast}
      onCloseAdmin={() => router.push('/')}
    />
  );
};
