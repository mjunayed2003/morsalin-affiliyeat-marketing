'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaBars, 
  FaMagnifyingGlass, 
  FaBell, 
  FaChevronRight, 
  FaCalendarDays, 
  FaUser, 
  FaGear, 
  FaArrowRightFromBracket,
  FaCheck,
  FaSliders
} from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onToggleSidebar, 
  dateRange, 
  onDateRangeChange 
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Compute breadcrumbs from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const url = '/' + pathParts.slice(0, index + 1).join('/');
    const title = part === 'admin' 
      ? 'Dashboard' 
      : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return { title, url };
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      
      {/* Left: Hamburger, Mobile Logo & Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Toggle Navigation"
        >
          <FaBars className="w-4 h-4" />
        </button>

        {/* Mobile Brand Logo */}
        <Link href="/admin" className="lg:hidden flex items-center shrink-0">
          <img
            src="/logo.jpeg"
            alt="FreeProducts.online"
            className="h-7 w-auto object-contain max-w-[130px]"
          />
        </Link>

        {/* Breadcrumb Trail */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 overflow-hidden truncate">
          <Link 
            href="/admin" 
            className="font-bold text-slate-900 hover:text-emerald-700 transition-colors shrink-0"
          >
            FreeProducts.online Admin
          </Link>
          {breadcrumbs.slice(1).map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
              <Link
                href={crumb.url}
                className={`truncate ${
                  idx === breadcrumbs.length - 2 
                    ? 'font-bold text-slate-900' 
                    : 'font-medium hover:text-slate-900'
                }`}
              >
                {crumb.title}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        
        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search (products, ASIN)..."
            className="w-52 lg:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b] focus:bg-white transition-all"
          />
        </form>

        {/* Date Range Selector */}
        <div className="flex items-center bg-slate-100/90 border border-slate-200/90 rounded-xl p-0.5 text-xs">
          {['today', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => onDateRangeChange(range)}
              className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-all ${
                dateRange === range
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative"
            title="Notifications"
          >
            <FaBell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">FreeProducts.online Store</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Verified Amazon sellers actively tracking review campaigns.</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">Live Support Ready</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Customer inbox monitoring is active.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=Admin`}
              alt="Admin"
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">
              {user?.name?.split(' ')[0] || 'Admin'}
            </span>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-emerald-600 font-mono">admin@freeproducts.online</p>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <FaGear className="w-3.5 h-3.5 text-slate-400" />
                  <span>Platform Settings</span>
                </Link>
                <Link
                  href="/admin/audit-logs"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <FaSliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audit Logs</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                    router.push('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                >
                  <FaArrowRightFromBracket className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
