import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FaAmazon } from 'react-icons/fa';
import { FaCircleInfo, FaArrowLeft, FaShieldHalved } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure & FTC Statement | FreeProducts.online',
  description: 'Official Amazon Associates Program compliance statement and FTC endorsement disclosure for FreeProducts.online.',
  alternates: {
    canonical: 'https://freeproducts.online/affiliate-disclosure',
  },
};

export default function AffiliateDisclosurePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-3 border border-amber-200">
            <FaCircleInfo className="w-3.5 h-3.5 text-amber-600" />
            <span>FTC &amp; Associate Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Affiliate Disclosure &amp; FTC Statement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: November 7, 2026 • In compliance with US Federal Trade Commission (16 CFR Part 255)
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">

          {/* Official Amazon Statement */}
          <section className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/90 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-base sm:text-lg">
              <FaAmazon className="w-5 h-5 text-[#ff9900]" />
              <span>Amazon Associates Program Operating Disclosure</span>
            </div>
            <p className="text-slate-800 font-medium">
              &quot;As an Amazon Associate I earn from qualifying purchases.&quot;
            </p>
            <p className="text-xs text-slate-600">
              FreeProducts.online is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for websites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              1. What Are Affiliate Links?
            </h2>
            <p>
              Some of the outbound links available on our platform are affiliate links. This means that if you click on the link and purchase the item or test the item through Amazon, FreeProducts.online may receive a small affiliate commission from Amazon at absolutely no extra cost to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              2. Editorial Independence &amp; Honest Opinions
            </h2>
            <p>
              Product recommendations and community reviews featured on FreeProducts.online represent authentic customer opinions. We do not accept payment to produce artificially positive ratings. Reviewers are encouraged and expected to submit truthful, unbiased assessments reflecting real-world performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              3. Trademark Disclaimer
            </h2>
            <p>
              Amazon, the Amazon logo, Amazon Prime, and all related marks and logos are trademarks of Amazon.com, Inc. or its affiliates. FreeProducts.online is an independent entity and is not affiliated with or endorsed by Amazon.com, Inc.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-stone-200">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              4. Questions &amp; Verification
            </h2>
            <p>
              For any questions regarding our affiliate disclosures or compliance policies, please contact:
            </p>
            <p className="font-semibold text-slate-900">
              Compliance Desk: <a href="mailto:support@freeproducts.online" className="text-emerald-800 underline">support@freeproducts.online</a>
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

