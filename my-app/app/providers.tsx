'use client';

import React from 'react';
import { AppProvider, useApp } from '@/app/context/AppContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { ShareModal } from '@/components/ShareModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ChatWidget } from '@/components/ChatWidget';
import { NotificationToast } from '@/components/NotificationToast';
import { AuthModal } from '@/components/AuthModal';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MaintenanceScreen } from '@/components/MaintenanceScreen';

const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { settings } = useApp();

  const isAdmin = user?.role === 'admin';
  const isAdminOrAuthRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (settings.maintenanceMode && !isAdmin && !isAdminOrAuthRoute) {
    return (
      <MaintenanceScreen
        platformName={settings.platformName}
        supportEmail={settings.supportEmail}
      />
    );
  }

  return (
    <>
      {settings.maintenanceMode && isAdmin && (
        <div className="bg-amber-400 text-stone-950 px-3.5 py-1.5 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-amber-500/40">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-stone-950 text-white px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider shrink-0">
                Admin Notice
              </span>
              <span className="truncate">
                Public Maintenance Mode is ACTIVE. Visitors cannot browse the public store.
              </span>
            </div>
            <Link href="/admin/settings" className="underline hover:text-stone-900 font-bold shrink-0 text-[11px]">
              Platform Settings &rarr;
            </Link>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

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
    unreadCount,
    sendCustomerMessage,
    inquiryProduct,
    clearInquiryProduct,
    isTyping,
    emitTyping,
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

      {/* Global Floating Chat & WhatsApp Actions (Right Bottom) */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={closeChat}
        onOpen={openChat}
        messages={messages}
        unreadCount={unreadCount}
        isTyping={isTyping}
        onTyping={emitTyping}
        onSendMessage={sendCustomerMessage}
        inquiryProduct={inquiryProduct}
        onClearInquiryProduct={clearInquiryProduct}
        onSwitchToAdmin={() => {
          closeChat();
          router.push('/admin');
        }}
      />

      {/* Notification Toast */}
      <NotificationToast message={toastMessage} />
    </>
  );
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>
        <MaintenanceGuard>
          {children}
          <GlobalModals />
        </MaintenanceGuard>
      </AppProvider>
    </AuthProvider>
  );
};

