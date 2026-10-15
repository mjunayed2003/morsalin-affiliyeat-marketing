'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  FaShieldHalved, 
  FaLock, 
  FaArrowRightFromBracket, 
  FaHouse, 
  FaKey, 
  FaCircleExclamation, 
  FaUserShield 
} from 'react-icons/fa6';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading, openAuthModal, logout } = useAuth();

  // 1. Loading State - Verification Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse">
            <FaShieldHalved className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>
          <div className="absolute inset-0 rounded-3xl border border-emerald-500/30 animate-ping opacity-25" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">
          Verifying Security Credentials
        </h2>
        <p className="text-sm text-slate-400 max-w-sm text-center">
          Checking administrator authorization and validating active cryptographic session...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State - Login Required
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <FaLock className="w-8 h-8 text-amber-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
            <FaKey className="w-3 h-3" />
            Restricted System Area
          </span>

          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Administrator Access Required
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            This administration portal is secured. You must log in with authorized credentials to manage products, catalog, and reviewer inquiries.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#1b3b2b] hover:bg-[#142d21] text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaUserShield className="w-4 h-4 text-emerald-300" />
              Sign In as Administrator
            </button>

            <Link
              href="/"
              className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold text-sm border border-slate-700/60 flex items-center justify-center gap-2 transition-all"
            >
              <FaHouse className="w-4 h-4 text-slate-400" />
              Return to Public Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Insufficient Permissions (Role is CLIENT)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 selection:bg-rose-500 selection:text-white">
        <div className="max-w-md w-full bg-slate-900/90 border border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <FaCircleExclamation className="w-8 h-8 text-rose-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 mb-3">
            403 • Unauthorized Role
          </span>

          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Your account does not have administrator privileges to view or configure this console.
          </p>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 mb-6 text-left text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Account:</span>
              <span className="font-semibold text-slate-200">{user.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phone:</span>
              <span className="font-mono text-slate-300">{user.phone}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Role:</span>
              <span className="uppercase font-bold text-amber-400">{user.role}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Required:</span>
              <span className="uppercase font-bold text-emerald-400">ADMIN</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <FaHouse className="w-4 h-4 text-emerald-400" />
              Return to Catalog Home
            </Link>

            <button
              onClick={() => {
                logout();
                openAuthModal('login');
              }}
              className="w-full py-3 px-5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 font-semibold text-sm border border-rose-800/40 flex items-center justify-center gap-2 transition-all"
            >
              <FaArrowRightFromBracket className="w-4 h-4 text-rose-400" />
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin: Render Protected Administration Area
  return <>{children}</>;
};
