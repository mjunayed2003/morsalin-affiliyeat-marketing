'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaLocationDot, 
  FaCalendarDays, 
  FaShieldHalved, 
  FaBan, 
  FaCheck, 
  FaClock, 
  FaChartLine, 
  FaArrowPointer,
  FaComments,
  FaKey
} from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { Badge } from '@/components/admin/Badge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { maskPhone } from '@/app/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getUserById, blockUser, unblockUser } = useAuth();
  const { messages, showToast } = useApp();

  const user = getUserById(id);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto mt-12">
        <FaUser className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">User Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested reviewer could not be found or has been removed.
        </p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 bg-[#1b3b2b] text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Users List</span>
        </Link>
      </div>
    );
  }

  const isBlocked = user.status === 'BLOCKED';

  // Customer messages from this user
  const userMessages = messages.filter((m) => m.sender === 'customer');

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <Badge variant={isBlocked ? 'blocked' : 'active'}>
                {isBlocked ? 'Blocked' : 'Active'}
              </Badge>
              {user.verified && <Badge variant="verified">Verified</Badge>}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {user.id}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isBlocked ? (
            <button
              onClick={() => {
                unblockUser(user.id);
                showToast(`${user.name} has been unblocked.`);
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <FaCheck className="w-3 h-3" />
              <span>Unblock Account</span>
            </button>
          ) : (
            <button
              onClick={() => setConfirmBlockOpen(true)}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <FaBan className="w-3 h-3" />
              <span>Block Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: User Profile Details + Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Profile Info Card */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/20 shadow-xs mb-3"
            />
            <h3 className="font-bold text-base text-slate-900">{user.name}</h3>
            <p className="text-xs text-slate-500">{user.role.toUpperCase()} Member</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <FaPhone className="w-3 h-3 text-emerald-600" />
                Phone Number
              </span>
              <span className="font-mono font-bold text-slate-800">{maskPhone(user.phone)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <FaEnvelope className="w-3 h-3 text-slate-400" />
                Email Address
              </span>
              <span className="font-medium text-slate-800 truncate max-w-[180px]">{user.email || 'None'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <FaLocationDot className="w-3 h-3 text-slate-400" />
                City / Region
              </span>
              <span className="font-medium text-slate-800">{user.city || 'Dhaka'}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-400 flex items-center gap-2 shrink-0">
                <FaLocationDot className="w-3 h-3 text-slate-400" />
                Delivery Address
              </span>
              <span className="font-medium text-slate-800 text-right max-w-[180px]">
                {user.address || 'Not provided'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-400 flex items-center gap-2">
                <FaCalendarDays className="w-3 h-3 text-slate-400" />
                Registered On
              </span>
              <span className="font-mono text-slate-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Lifetime Analytics & Inquiries */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Lifetime Activity Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Affiliate Clicks</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{user.clicksCount ?? 14}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Outbound referrals</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Page Views</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{user.viewsCount ?? 48}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Product impressions</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Support Messages</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{userMessages.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Chat inquiries</p>
            </div>
          </div>

          {/* User Support Messages History */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaComments className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">Recent Customer Inquiries</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{userMessages.length} total</span>
            </div>

            {userMessages.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No inquiries logged from this reviewer yet.</p>
            ) : (
              <div className="space-y-3">
                {userMessages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">
                        {msg.productInfo ? `Inquiry: ${msg.productInfo.title}` : 'General Support'}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmBlockOpen}
        onClose={() => setConfirmBlockOpen(false)}
        title="Confirm Account Block"
        message={`Are you sure you want to block ${user.name}? This will revoke their ability to access FreeProducts.online.`}
        confirmLabel="Block User"
        isDestructive={true}
        onConfirm={() => {
          blockUser(user.id);
          showToast(`Account ${user.name} has been blocked.`);
        }}
      />

    </div>
  );
}
