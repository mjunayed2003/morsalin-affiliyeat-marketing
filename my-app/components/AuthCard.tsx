'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { validateUsaPhone, formatUsaPhoneInput } from '@/lib/phone';
import { 
  FaPhone, 
  FaLock, 
  FaUser, 
  FaShieldHalved, 
  FaArrowRight, 
  FaEye, 
  FaEyeSlash,
  FaLocationDot,
  FaEnvelope,
  FaArrowLeft,
  FaRotateRight,
  FaCircleCheck,
  FaKey
} from 'react-icons/fa6';

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  initialTab = 'login',
  onSuccess
}) => {
  const { 
    sendRegisterOtp,
    verifyRegisterOtp,
    sendForgotPasswordOtp,
    resetPassword,
    loginWithPassword
  } = useAuth();

  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Registration form state
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regError, setRegError] = useState('');
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [isVerifyingRegOtp, setIsVerifyingRegOtp] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTimer, setRegTimer] = useState<number>(600); // 10 mins

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isSendingForgotOtp, setIsSendingForgotOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [forgotTimer, setForgotTimer] = useState<number>(600);

  // Countdown timers
  useEffect(() => {
    let interval: any = null;
    if (regStep === 'otp' && regTimer > 0) {
      interval = setInterval(() => setRegTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [regStep, regTimer]);

  useEffect(() => {
    let interval: any = null;
    if (forgotStep === 'reset' && forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotStep, forgotTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await loginWithPassword(loginIdentifier, loginPassword);
      if (res.success) {
        showToast(res.message);
        if (onSuccess) onSuccess();
      } else {
        setLoginError(res.message);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Step 1: Send Registration OTP to Gmail
  const handleSendRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid Gmail / email address.');
      return;
    }

    // USA phone validation
    const phoneCheck = validateUsaPhone(regPhone);
    if (!phoneCheck.isValid) {
      setRegError(phoneCheck.error || 'Please enter a valid 10-digit USA phone number.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSendingRegOtp(true);
    try {
      const res = await sendRegisterOtp({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: phoneCheck.formattedE164,
        password: regPassword,
        address: regAddress.trim(),
        city: regCity.trim() || 'New York',
      });

      if (res.success) {
        showToast(`Verification code sent to ${regEmail}!`);
        setRegStep('otp');
        setRegTimer(600);
      } else {
        setRegError(res.message);
      }
    } catch (err: any) {
      setRegError(err.message || 'Failed to send OTP code.');
    } finally {
      setIsSendingRegOtp(false);
    }
  };

  // Handle Step 2: Verify Registration OTP
  const handleVerifyRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regOtp || regOtp.trim().length !== 6) {
      setRegError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingRegOtp(true);
    try {
      const res = await verifyRegisterOtp(regEmail.trim(), regOtp.trim());
      if (res.success) {
        showToast(res.message);
        if (onSuccess) onSuccess();
      } else {
        setRegError(res.message);
      }
    } catch (err: any) {
      setRegError(err.message || 'OTP verification failed.');
    } finally {
      setIsVerifyingRegOtp(false);
    }
  };

  // Handle Step 1: Send Forgot Password OTP
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter your registered Gmail address.');
      return;
    }

    setIsSendingForgotOtp(true);
    try {
      const res = await sendForgotPasswordOtp(forgotEmail.trim());
      if (res.success) {
        setForgotSuccess(`Reset code sent to ${forgotEmail}`);
        showToast(`Reset code sent to ${forgotEmail}!`);
        setForgotStep('reset');
        setForgotTimer(600);
      } else {
        setForgotError(res.message);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset code.');
    } finally {
      setIsSendingForgotOtp(false);
    }
  };

  // Handle Step 2: Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit code received on your email.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setForgotError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('New passwords do not match.');
      return;
    }

    setIsResettingPassword(true);
    try {
      const res = await resetPassword(forgotEmail.trim(), forgotOtp.trim(), newPassword);
      if (res.success) {
        showToast(res.message);
        setActiveTab('login');
        setLoginIdentifier(forgotEmail);
        setForgotStep('request');
        setForgotOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setForgotError(res.message);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Could not reset password.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="bg-[#1b3b2b] text-white p-6 relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
            Reviewer Portal
          </span>
          <span className="text-emerald-100 text-xs flex items-center gap-1 font-medium">
            <FaShieldHalved className="w-3 h-3 text-emerald-400" />
            Verified & Secure Access
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white">
          {title || (
            activeTab === 'login'
              ? 'Reviewer Sign In'
              : activeTab === 'register'
              ? 'New Reviewer Registration'
              : 'Password Recovery'
          )}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-normal leading-relaxed">
          {subtitle || (
            activeTab === 'login' 
              ? 'Enter your USA phone number or Gmail to access your account.' 
              : activeTab === 'register'
              ? 'Join FreeProducts.online Review Club. Gmail OTP verification is required.'
              : 'Reset your password using the OTP code sent to your Gmail.'
          )}
        </p>
      </div>

      {/* Tab Switcher */}
      {activeTab !== 'forgot' && (
        <div className="flex border-b border-stone-200 bg-stone-50 p-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
              setRegError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs border border-stone-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError('');
              setLoginError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs border border-stone-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Create Account</span>
          </button>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6 sm:p-7 space-y-4">
        
        {/* ======================================================== */}
        {/* TAB 1: LOGIN                                             */}
        {/* ======================================================== */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {loginError}
              </div>
            )}

            {/* USA Phone / Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FaPhone className="w-3 h-3 text-[#1b3b2b]" />
                USA Phone or Gmail Address
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 123-4567 or user@gmail.com"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                className="w-full bg-stone-50 text-slate-900 px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
              />
              <p className="text-[11px] text-slate-400">
                You can sign in using your USA mobile number (+1) or registered Gmail.
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FaLock className="w-3 h-3 text-[#1b3b2b]" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setForgotEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                    setForgotStep('request');
                    setForgotError('');
                    setForgotSuccess('');
                  }}
                  className="text-[11px] text-[#1b3b2b] hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full bg-stone-50 text-slate-900 px-4 py-2.5 pr-10 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingLogin || !loginIdentifier || !loginPassword}
              className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmittingLogin ? 'Signing In...' : 'Log In & Continue'}</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[#1b3b2b] font-semibold hover:underline"
                >
                  Create Reviewer Account
                </button>
              </span>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 2: REGISTER                                          */}
        {/* ======================================================== */}
        {activeTab === 'register' && (
          <div>
            {regError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {regError}
              </div>
            )}

            {/* Step 1: Registration Form */}
            {regStep === 'form' && (
              <form onSubmit={handleSendRegOtp} className="space-y-3.5 animate-in fade-in duration-150">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <FaCircleCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    A <strong>6-digit OTP</strong> will be sent to your Gmail for verification before opening your account.
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FaUser className="w-3 h-3 text-[#1b3b2b]" />
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                  />
                </div>

                {/* Gmail Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FaEnvelope className="w-3 h-3 text-[#1b3b2b]" />
                    Gmail / Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                  />
                  <p className="text-[11px] text-slate-500">
                    We will send a 6-digit OTP to this Gmail to verify your identity.
                  </p>
                </div>

                {/* USA Phone Number */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <FaPhone className="w-3 h-3 text-[#1b3b2b]" />
                      USA Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/50">
                      🇺🇸 USA Numbers Only
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-600 flex items-center gap-1 pointer-events-none select-none">
                      🇺🇸 +1
                    </span>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(formatUsaPhoneInput(e.target.value))}
                      required
                      className="w-full bg-stone-50 text-slate-900 pl-14 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Standard 10-digit US phone format.
                  </p>
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <FaLock className="w-3 h-3 text-[#1b3b2b]" />
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="Min 4 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 pr-9 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showRegPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <FaLock className="w-3 h-3 text-[#1b3b2b]" />
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Optional Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <FaLocationDot className="w-3 h-3 text-slate-400" />
                      City / State (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New York, NY"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full bg-stone-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Address (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Street / Apt"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full bg-stone-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Submit Step 1 Button */}
                <button
                  type="submit"
                  disabled={isSendingRegOtp || !regName || !regEmail || !regPhone || !regPassword}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-3"
                >
                  <FaEnvelope className="w-3.5 h-3.5" />
                  <span>{isSendingRegOtp ? 'Sending OTP to Gmail...' : 'Send Verification OTP'}</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-slate-500 hover:text-[#1b3b2b] font-semibold"
                  >
                    Already registered? <span className="underline">Click here to Log In</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification Screen */}
            {regStep === 'otp' && (
              <form onSubmit={handleVerifyRegOtp} className="space-y-4 animate-in fade-in duration-150">
                <div className="text-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Check Your Gmail</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    We sent a 6-digit verification code to:
                  </p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5 break-all">
                    {regEmail}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Code expires in: <strong className="text-slate-700 font-mono">{formatTimer(regTimer)}</strong>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    required
                    className="w-full tracking-[8px] text-center font-mono font-extrabold text-2xl py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] bg-stone-50 text-slate-900"
                  />
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isVerifyingRegOtp || regOtp.length !== 6}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaCircleCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isVerifyingRegOtp ? 'Verifying & Creating Account...' : 'Verify OTP & Open Account'}</span>
                </button>

                {/* Resend & Back buttons */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setRegStep('form')}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    <span>Edit details</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSendRegOtp(e as any)}
                    disabled={isSendingRegOtp || regTimer > 540} // 60s cooldown
                    className="text-[#1b3b2b] hover:underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <FaRotateRight className={`w-3 h-3 ${isSendingRegOtp ? 'animate-spin' : ''}`} />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: FORGOT PASSWORD                                   */}
        {/* ======================================================== */}
        {activeTab === 'forgot' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                {forgotSuccess}
              </div>
            )}

            {/* Step 1: Request OTP */}
            {forgotStep === 'request' && (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <FaKey className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    Enter your registered Gmail address. We will send a 6-digit OTP code to reset your password.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FaEnvelope className="w-3 h-3 text-[#1b3b2b]" />
                    Registered Gmail Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-stone-50 text-slate-900 px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingForgotOtp || !forgotEmail}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaEnvelope className="w-3.5 h-3.5" />
                  <span>{isSendingForgotOtp ? 'Sending Reset Code...' : 'Send Reset Code'}</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setForgotError('');
                    }}
                    className="text-xs text-slate-500 hover:text-[#1b3b2b] font-semibold inline-flex items-center gap-1"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    <span>Back to Log In</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Reset Password with OTP */}
            {forgotStep === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <p className="font-semibold">Reset code sent to: {forgotEmail}</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Code expires in: <span className="font-mono font-bold">{formatTimer(forgotTimer)}</span>
                  </p>
                </div>

                {/* 6-Digit Code */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Enter 6-Digit Reset Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full tracking-[6px] text-center font-mono font-bold text-xl py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] bg-stone-50 text-slate-900"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FaLock className="w-3 h-3 text-[#1b3b2b]" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Min 4 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FaLock className="w-3 h-3 text-[#1b3b2b]" />
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                  />
                </div>

                {/* Submit Reset */}
                <button
                  type="submit"
                  disabled={isResettingPassword || forgotOtp.length !== 6 || !newPassword}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <FaKey className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isResettingPassword ? 'Resetting Password...' : 'Save New Password & Sign In'}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    <span>Change email</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSendForgotOtp(e as any)}
                    disabled={isSendingForgotOtp || forgotTimer > 540}
                    className="text-[#1b3b2b] hover:underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <FaRotateRight className={`w-3 h-3 ${isSendingForgotOtp ? 'animate-spin' : ''}`} />
                    <span>Resend Code</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-stone-50 border-t border-stone-200/80 text-center text-[11px] text-slate-500">
        FreeProducts.online Amazon Review Club • USA Verified Members Only
      </div>
    </div>
  );
};
