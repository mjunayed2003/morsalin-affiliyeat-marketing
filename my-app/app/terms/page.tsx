import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FaScaleBalanced, FaCircleCheck, FaTriangleExclamation, FaArrowLeft } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Terms of Service | FreeProducts.online',
  description: 'Review the official terms of service, participation guidelines, and reviewer eligibility rules for FreeProducts.online.',
  alternates: {
    canonical: 'https://freeproducts.online/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <FaScaleBalanced className="w-3.5 h-3.5" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: November 7, 2026 • Effective Date: November 7, 2026
          </p>
        </div>

        {/* Terms Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaCircleCheck className="w-4 h-4 text-emerald-700" />
              1. Acceptance of Terms &amp; Eligibility
            </h2>
            <p>
              By accessing or using FreeProducts.online (&quot;the Service&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the platform immediately.
            </p>
            <p className="text-slate-600">
              To be eligible for product testing membership:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>You must be at least 18 years of age.</li>
              <li>You must reside in the United States with an active shipping address.</li>
              <li>You must maintain an active, good-standing customer profile on participating e-commerce platforms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaCircleCheck className="w-4 h-4 text-emerald-700" />
              2. Authentic Reviewer Guidelines &amp; Honesty Policy
            </h2>
            <p>
              We pride ourselves on genuine consumer feedback. Reviewers agree to provide honest, unbiased feedback based exclusively on their actual experience with the physical product:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>No Coerced Ratings:</strong> You are under no obligation to leave a positive star rating. Honest assessments highlighting both pros and cons are strictly required.</li>
              <li><strong>No Fraudulent Orders:</strong> Claiming reimbursements with fake order IDs, canceled orders, or returned products is strictly prohibited and results in immediate account termination.</li>
              <li><strong>Compliance with Merchant Rules:</strong> You agree to follow all community guidelines of the merchant platform where products are ordered.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaTriangleExclamation className="w-4 h-4 text-amber-600" />
              3. Independent Entity Disclaimer
            </h2>
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs sm:text-sm">
              <p>
                <strong>Independent Status:</strong> FreeProducts.online is an independent testing and affiliate marketing directory. We are <strong>not</strong> an official subsidiary, agent, or joint venture of Amazon.com, Inc. All trademarks, service marks, and brand logos (including Amazon, Prime, and brand partners) are the property of their respective trademark holders.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              4. Account Termination &amp; Moderation
            </h2>
            <p>
              We reserve the right to review, suspend, or terminate any account found engaging in fraudulent behavior, automated bot submissions, spamming links across social media channels, or submitting multiple accounts under false names.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-stone-200">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              5. Governing Law and Support
            </h2>
            <p>
              These Terms are governed by and construed in accordance with applicable laws. For questions or disputes, contact:
            </p>
            <p className="font-semibold text-slate-900">
              FreeProducts.online Support Desk: <a href="mailto:support@freeproducts.online" className="text-emerald-800 underline">support@freeproducts.online</a>
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-slate-400">
        <p>© 2026 FreeProducts.online. All rights reserved.</p>
      </footer>
    </div>
  );
}

