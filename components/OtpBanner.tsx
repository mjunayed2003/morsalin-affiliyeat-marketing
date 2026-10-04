'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FaMobileScreen, FaCopy, FaCheck } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';

interface OtpBannerProps {
  onAutoFill?: (code: string) => void;
}

export const OtpBanner: React.FC<OtpBannerProps> = ({ onAutoFill }) => {
  const { otpBanner, dismissOtpBanner } = useAuth();
  const [copied, setCopied] = React.useState(false);

  if (!otpBanner || !otpBanner.visible) return null;

  const handleCopyOrFill = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(otpBanner.code);
    }
    setCopied(true);
    if (onAutoFill) {
      onAutoFill(otpBanner.code);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-lg animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-4 shadow-2xl shadow-blue-950/40">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#0d5bff] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <FaMobileScreen className="w-5 h-5 text-[#ccff00]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ccff00]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-[#ccff00] px-2 py-0.5 rounded-full border border-blue-400/30">
                  Simulated SMS
                </span>
                <span className="text-xs text-slate-400 font-medium">ByteDesk Security</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                Verification code for <span className="text-white font-bold">{otpBanner.phone}</span> is:
              </p>
            </div>
          </div>

          <button
            onClick={dismissOtpBanner}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-lg sm:text-xl font-black tracking-widest text-[#ccff00] font-mono select-all">
              {otpBanner.code}
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Expires in 3 mins</span>
          </div>

          <button
            onClick={handleCopyOrFill}
            className="flex items-center gap-1.5 bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <FaCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FaCopy className="w-3.5 h-3.5 text-slate-900" />
                <span>Auto-fill Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
