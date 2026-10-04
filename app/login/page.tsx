'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import { AuthCard } from '@/components/AuthCard';
import { FaBagShopping } from 'react-icons/fa6';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-[#ccff00] selection:text-slate-950 font-sans relative overflow-hidden pb-16">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0d5bff]/20 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6 z-10">
        {/* Brand Logo (Navbar is hidden when logged out) */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#0d5bff] text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            <FaBagShopping className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl text-white tracking-tight">
                Byte<span className="text-[#0d5bff]">Desk</span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00] text-slate-950">
                Client Portal
              </span>
            </div>
          </div>
        </div>

        <AuthCard 
          title="Client Sign In & Registration"
          subtitle="New clients register directly with phone & password. Returning clients log in."
          onSuccess={() => router.push('/')}
        />
      </main>
    </div>
  );
}
