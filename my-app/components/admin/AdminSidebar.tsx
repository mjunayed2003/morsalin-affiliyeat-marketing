'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaChartPie, 
  FaUsers, 
  FaBoxOpen, 
  FaTags, 
  FaLink, 
  FaBullhorn, 
  FaChartLine, 
  FaArrowPointer, 
  FaFileLines, 
  FaComments, 
  FaSliders, 
  FaGlobe, 
  FaShieldHalved, 
  FaGear,
  FaArrowUpRightFromSquare,
  FaXmark,
  FaAmazon
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { unreadCount, products } = useApp();
  const { user } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'Analytics & Overview',
      items: [
        { label: 'Overview', href: '/admin', icon: FaChartPie },
        { label: 'Analytics', href: '/admin/analytics', icon: FaChartLine },
        { label: 'Affiliate Clicks', href: '/admin/clicks', icon: FaArrowPointer },
      ],
    },
    {
      title: 'Catalog & Growth',
      items: [
        { label: 'Products', href: '/admin/products', icon: FaBoxOpen, badge: products.length },
        { label: 'Categories', href: '/admin/categories', icon: FaTags },
        { label: 'Affiliate Links', href: '/admin/affiliate-links', icon: FaLink },
        { label: 'Campaigns', href: '/admin/campaigns', icon: FaBullhorn },
      ],
    },
    {
      title: 'Users & Relations',
      items: [
        { label: 'Users', href: '/admin/users', icon: FaUsers },
        { 
          label: 'Support Inbox', 
          href: '/admin/inbox', 
          icon: FaComments, 
          badge: unreadCount > 0 ? unreadCount : undefined 
        },
        { label: 'Reports', href: '/admin/reports', icon: FaFileLines },
      ],
    },
    {
      title: 'Platform Management',
      items: [
        { label: 'Content & SEO', href: '/admin/content', icon: FaGlobe },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: FaShieldHalved },
        { label: 'Settings', href: '/admin/settings', icon: FaGear },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0e1d15] text-slate-200 border-r border-[#1e3a2b] flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[#1b3b2b] flex items-center justify-between shrink-0 bg-[#0a1610]">
          <Link href="/admin" className="flex items-center gap-2.5 group min-w-0">
            <div className="bg-white px-2 py-1 rounded-xl shadow-xs flex items-center shrink-0 border border-emerald-900/40 group-hover:scale-102 transition-transform">
              <img
                src="/logo.jpeg"
                alt="FreeProducts.online Logo"
                className="h-7 w-auto object-contain max-w-[125px]"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-white tracking-tight leading-tight truncate">
                Admin Studio
              </span>
              <span className="text-[9px] font-semibold text-emerald-400 leading-tight tracking-wider uppercase mt-0.5">
                Control Center
              </span>
            </div>
          </Link>

          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b3b2b] transition-colors shrink-0"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onClose()}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group
                        ${active 
                          ? 'bg-[#1b3b2b] text-white font-semibold shadow-xs border border-emerald-600/40' 
                          : 'text-slate-300 hover:bg-[#14281e] hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 transition-colors ${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          active 
                            ? 'bg-emerald-400 text-[#0e1d15]' 
                            : 'bg-[#1e3a2b] text-emerald-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Quick Public Link & User Card */}
        <div className="p-3 border-t border-[#1b3b2b] bg-[#0a1610]/70 space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-[#14281e] text-emerald-300 hover:bg-[#1b3b2b] hover:text-white border border-[#214332] transition-colors"
          >
            <div className="flex items-center gap-2">
              <FaGlobe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Website</span>
            </div>
            <FaArrowUpRightFromSquare className="w-2.5 h-2.5 opacity-70" />
          </Link>

          <div className="px-3 py-2 rounded-xl bg-[#0e1d15] border border-[#1e3a2b] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=Admin`} 
                alt="Admin" 
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-emerald-500/40"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
