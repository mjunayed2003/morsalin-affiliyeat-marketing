'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaBell, 
  FaCheckDouble, 
  FaComments, 
  FaPhone, 
  FaGift, 
  FaStar, 
  FaBagShopping, 
  FaTrashCan,
  FaShieldHalved
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { NotificationItem } from '@/app/types';

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const router = useRouter();
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    requestPushNotifications 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check current browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return <FaComments className="w-3.5 h-3.5 text-emerald-600" />;
      case 'call':
        return <FaPhone className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />;
      case 'order':
        return <FaBagShopping className="w-3.5 h-3.5 text-amber-600" />;
      case 'review':
        return <FaStar className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <FaGift className="w-3.5 h-3.5 text-emerald-700" />;
    }
  };

  const handleItemClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleEnablePush = async () => {
    await requestPushNotifications();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 transition-all cursor-pointer focus:outline-none"
        title="Notifications"
        aria-label="View Notifications"
      >
        <FaBell className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
        
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex items-center justify-center min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 px-1 text-[9px] sm:text-[10px] font-black text-white bg-rose-500 rounded-full ring-2 ring-white shadow-xs">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      {isOpen && (
        <>
          {/* Mobile Backdrop Overlay for outside tap */}
          <div 
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-2xs sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-3 top-[104px] sm:top-auto sm:inset-x-auto sm:absolute sm:top-full sm:right-0 sm:mt-2 w-auto sm:w-96 max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 to-[#1b3b2b] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBell className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>

            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-medium text-emerald-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <FaCheckDouble className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Push Notification Banner */}
          {pushStatus !== 'granted' && (
            <div className="px-3.5 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="font-bold text-emerald-950 text-[11px]">Browser Alerts</p>
                <p className="text-[10px] text-emerald-700 truncate">Receive instant audio & message notifications</p>
              </div>
              <button
                onClick={handleEnablePush}
                className="shrink-0 bg-[#1b3b2b] hover:bg-[#142e21] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs cursor-pointer"
              >
                Enable
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread ({unreadNotificationsCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FaBell className="w-4 h-4 opacity-50" />
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  You will receive real-time alerts when messages or new product perks arrive.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 sm:p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !item.read ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Icon Avatar */}
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60 shadow-2xs">
                    {getIcon(item.type)}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs truncate ${!item.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.body}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 ring-2 ring-emerald-100" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FaTrashCan className="w-2.5 h-2.5" />
                <span>Clear All</span>
              </button>
            )}

            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 ml-auto cursor-pointer"
            >
              <FaComments className="w-3 h-3 text-emerald-600" />
              <span>Chat Support</span>
            </Link>
          </div>
        </div>
      </>
    )}
  </div>
  );
};
