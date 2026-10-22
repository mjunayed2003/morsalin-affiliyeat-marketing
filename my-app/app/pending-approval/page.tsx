'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { 
  FaClock, 
  FaCircleCheck, 
  FaCircleXmark, 
  FaShieldHalved, 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaArrowRight, 
  FaRotateRight, 
  FaHeadset, 
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa6';
import { getSocket, API_BASE_URL } from '@/lib/socket';

interface RegistrationDetails {
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

function PendingApprovalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [details, setDetails] = useState<RegistrationDetails>({});
  const [status, setStatus] = useState<'PENDING' | 'ACTIVE' | 'REJECTED'>('PENDING');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string>('Just now');
  const [manualIdentifier, setManualIdentifier] = useState('');
  const [statusError, setStatusError] = useState('');

  // 1. Load initial applicant details from sessionStorage or URL query
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlPhone = searchParams.get('phone');

    try {
      const stored = sessionStorage.getItem('freeproducts_pending_registration');
      if (stored) {
        const parsed = JSON.parse(stored);
        setDetails(parsed);
        if (parsed.email) setManualIdentifier(parsed.email);
        else if (parsed.phone) setManualIdentifier(parsed.phone);
      } else if (urlEmail) {
        setDetails({ email: urlEmail });
        setManualIdentifier(urlEmail);
      } else if (urlPhone) {
        setDetails({ phone: urlPhone });
        setManualIdentifier(urlPhone);
      }
    } catch {}
  }, [searchParams]);

  // 2. Fetch live status from backend
  const checkStatus = async (identifierToCheck?: string) => {
    const identifier = identifierToCheck || manualIdentifier || details.email || details.phone;
    if (!identifier || !identifier.trim()) {
      setStatusError('Please enter your registered Gmail or phone number to check status.');
      return;
    }

    setIsChecking(true);
    setStatusError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/registration-status?identifier=${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        const newStatus = (data.status || 'PENDING').toUpperCase() as 'PENDING' | 'ACTIVE' | 'REJECTED';
        setStatus(newStatus);
        setRejectionReason(data.rejectionReason || null);
        setLastCheckedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

        if (data.name || data.email || data.phone) {
          setDetails((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            createdAt: data.createdAt || prev.createdAt,
          }));
        }
      } else {
        setStatusError(data.message || 'No registration record found for this identifier.');
      }
    } catch (err: any) {
      setStatusError(err.message || 'Unable to connect to verification server.');
    } finally {
      setIsChecking(false);
    }
  };

  // Check once on load if identifier is available
  useEffect(() => {
    const identifier = manualIdentifier || details.email || details.phone;
    if (identifier) {
      checkStatus(identifier);
    }
  }, [details.email, details.phone]);

  // 3. Real-time Socket.IO listener for instant approval/rejection updates
  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (payload: any) => {
      if (payload?.status) {
        const newStatus = payload.status.toUpperCase();
        if (newStatus === 'ACTIVE' || newStatus === 'REJECTED' || newStatus === 'PENDING') {
          setStatus(newStatus);
          if (payload.rejectionReason) {
            setRejectionReason(payload.rejectionReason);
          }
          setLastCheckedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    };

    socket.on('registration:status', handleStatusUpdate);

    return () => {
      socket.off('registration:status', handleStatusUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 my-6">
        <div className="w-full max-w-xl">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
            
            {/* Header Banner */}
            <div className={`p-6 sm:p-8 text-center text-white transition-colors duration-300 ${
              status === 'ACTIVE' 
                ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800'
                : status === 'REJECTED'
                ? 'bg-gradient-to-r from-rose-800 via-rose-700 to-stone-800'
                : 'bg-gradient-to-r from-[#1b3b2b] via-[#142e20] to-[#0e1d15]'
            }`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 shadow-inner border border-white/20">
                {status === 'ACTIVE' ? (
                  <FaCircleCheck className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-300 animate-in zoom-in-50 duration-300" />
                ) : status === 'REJECTED' ? (
                  <FaCircleXmark className="w-9 h-9 sm:w-11 sm:h-11 text-rose-300 animate-in zoom-in-50 duration-300" />
                ) : (
                  <FaClock className="w-9 h-9 sm:w-11 sm:h-11 text-amber-300 animate-pulse" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {status === 'ACTIVE' && 'Registration Approved!'}
                {status === 'REJECTED' && 'Registration Not Approved'}
                {status === 'PENDING' && 'Pending Administrator Approval'}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-stone-200 max-w-md mx-auto leading-relaxed">
                {status === 'ACTIVE' && 'Congratulations! Your account has been approved by our review team. You can now log in and claim 100% free Amazon products.'}
                {status === 'REJECTED' && 'Your account registration was not approved during administrative verification.'}
                {status === 'PENDING' && 'Your registration has been submitted and is awaiting admin review.'}
              </p>
            </div>

            {/* Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Applicant Info Summary */}
              {(details.name || details.email || details.phone) && (
                <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-3">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Registration Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {details.name && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <FaUser className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold truncate">{details.name}</span>
                      </div>
                    )}
                    {details.email && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <FaEnvelope className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold truncate">{details.email}</span>
                      </div>
                    )}
                    {details.phone && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <FaPhone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold">{details.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-700">
                      <FaShieldHalved className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Status: <strong className={status === 'ACTIVE' ? 'text-emerald-700 font-bold' : status === 'REJECTED' ? 'text-rose-700 font-bold' : 'text-amber-700 font-bold'}>{status}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Specific State Cards */}
              {status === 'PENDING' && (
                <>
                  {/* Timeline Stepper */}
                  <div className="space-y-3 pt-1">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Review Progress
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <FaCheck className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">1. Registration & Verification Code</p>
                          <p className="text-[11px] text-slate-500">Your email, USA phone number, and identity selfie were securely received.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                          <FaClock className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-900">2. Administrator Review (Current)</p>
                          <p className="text-[11px] text-slate-500">An administrator is reviewing your profile and verification selfie. This typically takes 15–30 minutes during business hours.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 opacity-50">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[11px] font-bold">3</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">3. Full Account Activation</p>
                          <p className="text-[11px] text-slate-400">Once approved, your account will be activated and you can sign in immediately.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Refresh and Check Button */}
                  <div className="pt-2 border-t border-stone-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 text-center sm:text-left">
                        <span>Last checked: <strong>{lastCheckedAt}</strong></span>
                        <p className="text-slate-400">This page will automatically update in real time when approved.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => checkStatus()}
                        disabled={isChecking}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-stone-300"
                      >
                        <FaRotateRight className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-emerald-700' : ''}`} />
                        <span>{isChecking ? 'Checking...' : 'Check Status Now'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ACTIVE STATE */}
              {status === 'ACTIVE' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <FaCheck className="w-3 h-3 text-emerald-600" />
                    <span>Account Active</span>
                  </div>

                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Your account has been fully verified and activated by our team. You can now sign in with your credentials to explore products and manage orders.
                  </p>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Proceed to Sign In</span>
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* REJECTED STATE */}
              {status === 'REJECTED' && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <FaCircleXmark className="w-4 h-4 text-rose-600" />
                    <span>Registration Decision</span>
                  </div>

                  <p className="text-xs text-rose-700 leading-relaxed">
                    We regret to inform you that your application was not approved at this time.
                  </p>

                  {rejectionReason && (
                    <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-900">
                      <span className="font-bold">Reason:</span> {rejectionReason}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500">
                    If you believe this is an error or would like to submit updated verification information, please contact our support team.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Link
                      href="/chat"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
                    >
                      <FaHeadset className="w-3.5 h-3.5" />
                      <span>Contact Support</span>
                    </Link>
                    <Link
                      href="/"
                      className="py-2.5 px-4 rounded-xl bg-white border border-stone-300 text-slate-700 hover:bg-stone-50 text-xs font-bold text-center transition-all"
                    >
                      Return Home
                    </Link>
                  </div>
                </div>
              )}

              {/* Manual Identifier Lookup if no details */}
              {(!details.email && !details.phone) && (
                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Lookup by Email or USA Phone:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. user@gmail.com or +1 555-123-4567"
                      value={manualIdentifier}
                      onChange={(e) => setManualIdentifier(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                    />
                    <button
                      type="button"
                      onClick={() => checkStatus(manualIdentifier)}
                      disabled={isChecking}
                      className="px-4 py-2 bg-[#1b3b2b] text-white rounded-xl text-xs font-bold hover:bg-[#142e20] transition-colors"
                    >
                      {isChecking ? 'Checking...' : 'Check'}
                    </button>
                  </div>
                  {statusError && (
                    <p className="text-[11px] text-rose-600 font-medium">{statusError}</p>
                  )}
                </div>
              )}

            </div>

            {/* Footer Navigation */}
            <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between text-xs text-slate-500">
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-emerald-800 font-medium">
                <FaArrowLeft className="w-3 h-3" />
                <span>Back to Home</span>
              </Link>
              <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-emerald-800 font-medium">
                <span>Already Approved? Sign In</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 rounded-full border-2 border-[#1b3b2b] border-t-transparent animate-spin" />
      </div>
    }>
      <PendingApprovalContent />
    </Suspense>
  );
}
