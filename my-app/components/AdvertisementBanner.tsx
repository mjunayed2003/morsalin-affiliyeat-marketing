'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaBullhorn, 
  FaArrowRight, 
  FaAmazon, 
  FaFire, 
  FaShieldHalved,
  FaXmark
} from 'react-icons/fa6';

interface AdvertisementBannerProps {
  className?: string;
}

export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="relative bg-gradient-to-r from-[#0d2218] via-[#1b3b2b] to-[#123122] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-lg text-white">
        
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          
          {/* Left Ad Content */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <FaBullhorn className="w-5 h-5 animate-bounce" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <FaFire className="w-2.5 h-2.5" />
                  Sponsored Ad
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <FaAmazon className="w-3 h-3 text-amber-400" />
                  Verified Brand Rebate Club
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 tracking-tight">
                Get 100% Free Amazon Products in Exchange for Honest Reviews
              </h4>
              <p className="text-xs text-emerald-100/80 mt-0.5 max-w-xl">
                Test new top-rated gadgets, home appliances, and accessories with zero upfront risk. Direct PayPal & Amazon reimbursement guaranteed.
              </p>
            </div>
          </div>

          {/* Right Action CTA & Close Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <Link
              href="/products"
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Explore Deals</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss ad"
            >
              <FaXmark className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
