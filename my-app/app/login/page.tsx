'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import { AuthCard } from '@/components/AuthCard';
import { FaAmazon } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans pb-16">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6 z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 space-y-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80 shadow-2xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-[#15803d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 7h-2.18A3.996 3.996 0 0 0 16 3.07C14.89 2.43 13.56 2.5 12.63 3.25L12 3.75l-.63-.5C10.44 2.5 9.11 2.43 8 3.07 6.46 3.96 5.8 5.81 6.18 7H4c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h1v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h1c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2zm-9-3c.53 0 1.04.2 1.42.58l.58.58-1.06 1.06-.58-.58A1.99 1.99 0 0 1 11 4zm-3 2c0-.53.2-1.04.58-1.42.78-.78 2.05-.78 2.83 0l.58.58-1.99 1.99L8 6.15A1.99 1.99 0 0 1 8 6zm5 14H6v-8h7v8zm7 0h-5v-8h5v8zm0-10H4V9h16v1z" />
              </svg>
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight text-slate-900">
              Product<span className="text-[#1b3b2b]">Perks</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
            <FaAmazon className="w-3 h-3 text-[#ff9900]" />
            <span>Amazon Reviewer Club Member Access</span>
          </div>
        </div>

        <AuthCard 
          title="Reviewer Portal"
          subtitle="Log in to manage your Amazon reviews and test free products."
          onSuccess={() => router.push('/')}
        />
      </main>
    </div>
  );
}
