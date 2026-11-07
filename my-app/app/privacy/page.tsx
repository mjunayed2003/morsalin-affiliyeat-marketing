import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { BrandLogo } from '@/components/BrandLogo';
import { FaShieldHalved, FaLock, FaUserCheck, FaEnvelope, FaArrowLeft } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Privacy Policy | FreeProducts.online',
  description: 'Learn how FreeProducts.online collects, uses, and safeguards your personal data under CCPA, GDPR, and US consumer protection standards.',
  alternates: {
    canonical: 'https://freeproducts.online/privacy',
  },
};

export default function PrivacyPolicyPage() {
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
            <FaShieldHalved className="w-3.5 h-3.5" />
            <span>Official Legal Notice</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: November 7, 2026 • Effective Date: November 7, 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
          
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaUserCheck className="w-4 h-4 text-emerald-700" />
              1. Information We Collect
            </h2>
            <p>
              FreeProducts.online (&quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) collects information to facilitate product testing, community moderation, and order tracking. We only collect information that you knowingly and voluntarily provide:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, verified USA telephone number, and email address for account authorization and password recovery.</li>
              <li><strong>Profile Information:</strong> Public Amazon reviewer profile link and optional verification selfie image used strictly to verify authentic reviewer status and prevent bot abuse.</li>
              <li><strong>Reimbursement Coordinates:</strong> PayPal email address or relevant payment identifiers supplied for product testing reimbursements.</li>
              <li><strong>Inquiry &amp; Support Messages:</strong> Direct chat messages, inquiries, order confirmation numbers, and feedback submitted through our live chat desk.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaLock className="w-4 h-4 text-emerald-700" />
              2. How We Use and Protect Your Data
            </h2>
            <p>
              Your data is never sold, rented, or traded to third-party data brokers. We utilize your information exclusively to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Verify your reviewer identity and approve platform membership.</li>
              <li>Facilitate product testing allocations and deliver relevant product links.</li>
              <li>Process review reimbursements through secure electronic payment channels (such as PayPal).</li>
              <li>Notify you of support responses, application status changes, and testing announcements.</li>
            </ul>
            <p className="text-xs text-slate-500 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <strong>Data Security:</strong> All account passwords are encrypted using one-way cryptographic bcrypt hashing. Network communications are secured with TLS/SSL encryption across all endpoints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              3. Cookies and Analytics
            </h2>
            <p>
              We use first-party session cookies and Google Analytics (GTAG) solely to measure aggregate site performance, prevent malicious bots, and keep you authenticated during active sessions. We do not use intrusive cross-site tracking or advertising pixels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              4. Your Rights (CCPA / GDPR / Data Deletion)
            </h2>
            <p>
              Under California Consumer Privacy Act (CCPA) and General Data Protection Regulation (GDPR) frameworks, you retain full ownership of your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Right to Access:</strong> You can request a complete copy of all data tied to your account.</li>
              <li><strong>Right to Erasure / Deletion:</strong> You can request immediate permanent deletion of your account, phone number, and submitted data at any time.</li>
              <li><strong>Right to Rectification:</strong> You can update your profile details directly from your account page.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-stone-200">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaEnvelope className="w-4 h-4 text-emerald-700" />
              5. Contact Our Privacy Office
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request data erasure, please contact our administrative team:
            </p>
            <div className="bg-[#1b3b2b] text-white p-5 rounded-2xl space-y-1 text-xs sm:text-sm">
              <p className="font-bold">FreeProducts.online Compliance &amp; Privacy Desk</p>
              <p>Email: <a href="mailto:support@freeproducts.online" className="underline hover:text-amber-200">support@freeproducts.online</a></p>
              <p>Response Time: Within 24-48 business hours</p>
            </div>
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

