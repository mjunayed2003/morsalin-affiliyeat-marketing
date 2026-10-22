'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHouse, FaBagShopping, FaComments } from 'react-icons/fa6';
import { FaWhatsapp } from 'react-icons/fa';
import { useApp } from '@/app/context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { unreadCount, settings } = useApp();

  // Exclude admin console so admin management tools are not affected
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Active route checks
  const isHomeActive = pathname === '/';
  const isProductsActive = pathname === '/products' || pathname.startsWith('/products/') || pathname.startsWith('/p/');
  const isChatActive = pathname === '/chat' || pathname.startsWith('/chat/');

  // WhatsApp link configuration
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+880 1340-376081';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const platformName = settings?.platformName || 'FreeProducts.online';
  const defaultWhatsAppText = `Hello ${platformName} Support, I would like to inquire about Amazon review products.`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultWhatsAppText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultWhatsAppText)}`;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: FaHouse,
      isActive: isHomeActive,
      isExternal: false,
    },
    {
      id: 'products',
      label: 'Products',
      href: '/products',
      icon: FaBagShopping,
      isActive: isProductsActive,
      isExternal: false,
    },
    {
      id: 'chat',
      label: 'Chat',
      href: '/chat',
      icon: FaComments,
      isActive: isChatActive,
      isExternal: false,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: whatsappUrl,
      icon: FaWhatsapp,
      isActive: false,
      isExternal: true,
      accentColor: '#25D366',
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              className={`flex flex-col items-center justify-center gap-1 w-full h-full py-1.5 transition-all duration-200 select-none ${
                item.isActive
                  ? 'text-[#1b3b2b]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-11 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    item.isActive
                      ? 'bg-emerald-50 text-[#1b3b2b] shadow-2xs'
                      : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      item.isActive ? 'scale-110 text-[#1b3b2b]' : ''
                    }`}
                    style={item.id === 'whatsapp' ? { color: '#25D366' } : undefined}
                  />
                </div>

                {/* Unread badge on chat */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] leading-none tracking-tight transition-all ${
                  item.isActive
                    ? 'font-bold text-[#1b3b2b]'
                    : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex items-center justify-center h-full active:scale-95 transition-transform cursor-pointer group"
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className="flex items-center justify-center h-full active:scale-95 transition-transform cursor-pointer group"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
