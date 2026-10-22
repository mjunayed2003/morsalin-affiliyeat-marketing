'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import { AuthCard } from '@/components/AuthCard';
import { FaShieldHalved } from 'react-icons/fa6';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/';
  const hasError = searchParams.get('error') === 'admin_required';

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectPath.startsWith('/admin')) {
        if (isAdmin) {
          router.push(redirectPath);
        } else {
          router.push('/');
        }
      } else {
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, isAdmin, redirectPath, router]);

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 z-10 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1b3b2b] border-t-transparent animate-spin mb-2" />
        <p className="text-xs text-slate-500 font-medium">Checking session...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6 z-10">
      {hasError && (
        <div className="mb-4 inline-flex items-center gap-1.5 bg-rose-50 text-rose-900 border border-rose-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <FaShieldHalved className="w-3.5 h-3.5 text-rose-600" />
          <span>Admin Authorization Required to access {redirectPath}</span>
        </div>
      )}

      <AuthCard 
        title={hasError ? "Administrator Sign In" : "Reviewer Portal"}
        subtitle={hasError ? "Sign in with your admin credentials to access the console." : "Log in to manage your Amazon reviews and test free products."}
        onSuccess={() => {
          if (redirectPath.startsWith('/admin')) {
            router.push(redirectPath);
          } else {
            router.push(redirectPath || '/');
          }
        }}
      />
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-slate-900 selection:bg-[#1b3b2b] selection:text-white font-sans pb-16">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-slate-400">Loading portal...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
