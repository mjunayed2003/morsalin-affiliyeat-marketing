'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaWrench, 
  FaShieldHalved, 
  FaEnvelope, 
  FaWhatsapp, 
  FaLock,
  FaAmazon
} from 'react-icons/fa6';

interface MaintenanceScreenProps {
  platformName?: string;
  supportEmail?: string;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  platformName = 'FreeProducts.online',
  supportEmail = 'support@freeproducts.online',
}) => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+880 1340-376081';
  const cleanPhone = whatsappNumber.replace(/[^\d+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    `Hello ${platformName} Support Team! I am reaching out regarding scheduled maintenance.`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1a13] via-[#142e20] to-[#0c1a13] text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <FaShieldHalved className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            {platformName}
          </span>
        </div>

        <Link
          href="/login?redirect=/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white text-xs font-semibold transition-all border border-white/10"
        >
          <FaLock className="w-3 h-3" />
          <span>Staff Login</span>
        </Link>
      </header>

      {/* Main Hero Notice */}
      <main className="max-w-xl w-full mx-auto my-auto text-center py-12 px-4">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-inner">
          <FaWrench className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Scheduled Catalog Upgrade in Progress</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
          We are upgrading our review perk catalog
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed mb-8">
          {platformName} is temporarily undergoing system maintenance while our merchants sync fresh, 100% free Amazon product campaigns. We will be back online shortly!
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
              <FaAmazon className="w-3.5 h-3.5 text-[#ff9900]" />
              <span>Amazon Review Club</span>
            </div>
            <p className="text-[11px] text-stone-300">
              Active test campaigns and orders are securely preserved in the cloud database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
              <FaShieldHalved className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Downtime Data</span>
            </div>
            <p className="text-[11px] text-stone-300">
              Reviewer desks and approved inquiries remain fully safe and verified.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>Chat with Support on WhatsApp</span>
          </a>

          {supportEmail && (
            <a
              href={`mailto:${supportEmail}?subject=Inquiry%20during%20Maintenance`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              <FaEnvelope className="w-3.5 h-3.5 text-emerald-300" />
              <span>Email Support Team</span>
            </a>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center py-4 text-xs text-emerald-300/60 border-t border-emerald-800/40">
        <p>© {new Date().getFullYear()} {platformName}. All rights reserved.</p>
      </footer>
    </div>
  );
};
