'use client';

import React from 'react';
import { AppProvider, useApp } from '@/app/context/AppContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { ShareModal } from '@/components/ShareModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ChatWidget } from '@/components/ChatWidget';
import { NotificationToast } from '@/components/NotificationToast';
import { AuthModal } from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

const GlobalModals: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const {
    activeShareProduct,
    closeShareModal,
    activeDetailProduct,
    closeDetailModal,
    openShareModal,
    openChatWithProduct,
    isChatOpen,
    openChat,
    closeChat,
    messages,
    sendCustomerMessage,
    inquiryProduct,
    clearInquiryProduct,
    toastMessage,
    showToast
  } = useApp();

  return (
    <>
      {/* Client Registration & Password Login Modal */}
      <AuthModal />

      {/* Share Modal with Live Messenger Preview */}
      <ShareModal
        product={activeShareProduct}
        isOpen={!!activeShareProduct}
        onClose={closeShareModal}
        onShowToast={showToast}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeDetailProduct}
        isOpen={!!activeDetailProduct}
        onClose={closeDetailModal}
        onInquire={(prod) => {
          closeDetailModal();
          openChatWithProduct(prod);
        }}
        onOpenShare={(prod) => {
          closeDetailModal();
          openShareModal(prod);
        }}
      />

      {/* Global Floating Chat Widget (Only visible when logged in) */}
      {isAuthenticated && user && (
        <ChatWidget
          isOpen={isChatOpen}
          onClose={closeChat}
          onOpen={openChat}
          messages={messages}
          onSendMessage={sendCustomerMessage}
          inquiryProduct={inquiryProduct}
          onClearInquiryProduct={clearInquiryProduct}
          onSwitchToAdmin={() => {
            closeChat();
            router.push('/admin');
          }}
        />
      )}

      {/* Notification Toast */}
      <NotificationToast message={toastMessage} />
    </>
  );
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
        <GlobalModals />
      </AppProvider>
    </AuthProvider>
  );
};

