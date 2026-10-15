'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { 
  FaPhone, 
  FaLock, 
  FaUser, 
  FaCheck, 
  FaShieldHalved, 
  FaArrowRight, 
  FaEye, 
  FaEyeSlash,
  FaLocationDot,
  FaUserPlus
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
    registerUser,
    loginWithPassword
  } = useAuth();

  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Direct Registration form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regError, setRegError] = useState('');
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Handle Returning Client Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await loginWithPassword(loginPhone, loginPassword);
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

  // Handle Direct Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regPhone.trim() || regPhone.trim().length < 7) {
      setRegError('Please enter a valid phone number (at least 7 digits).');
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

    setIsSubmittingRegister(true);
    try {
      const res = await registerUser(
        regName,
        regPhone,
        regPassword,
        undefined,
        regAddress,
        regCity
      );

      if (res.success) {
        showToast(res.message);
        if (onSuccess) onSuccess();
      } else {
        setRegError(res.message);
      }
    } catch (err: any) {
      setRegError(err.message || 'Registration failed.');
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden flex flex-col">
      {/* Card Header in Home Page Forest Green */}
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
          {title || (activeTab === 'login' ? 'Reviewer Sign In' : 'New Reviewer Registration')}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-normal leading-relaxed">
          {subtitle || (
            activeTab === 'login' 
              ? 'Enter your phone number and password to log in.' 
              : 'Create your account to start testing free Amazon products.'
          )}
        </p>
      </div>

      {/* Simple Tab Switcher */}
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
          <FaUserPlus className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span>New Registration</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-7 space-y-4">
        
        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {loginError}
              </div>
            )}

            <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
              <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                Log in with your registered phone number and password to access products and chat.
              </span>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FaPhone className="w-3 h-3 text-[#1b3b2b]" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 0171****678"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                required
                className="w-full bg-stone-50 text-slate-900 px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
              />
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
                    setActiveTab('register');
                    setRegPhone(loginPhone);
                  }}
                  className="text-[11px] text-[#1b3b2b] hover:underline font-semibold"
                >
                  New here? Register
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
              disabled={isSubmittingLogin || !loginPhone || !loginPassword}
              className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSubmittingLogin ? 'Signing In...' : 'Log In & Continue'}</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* TAB 2: REGISTRATION */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-150">
            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {regError}
              </div>
            )}

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
              <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                Instant registration. No OTP required — start testing products right away.
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
                placeholder="e.g. Morsalin Chowdhury"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FaPhone className="w-3 h-3 text-[#1b3b2b]" />
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 0181****678"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
                className="w-full bg-stone-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
              />
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
                  City (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, Dhaka"
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
                  placeholder="Street / Area"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full bg-stone-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingRegister || !regName || !regPhone || !regPassword}
              className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <FaUserPlus className="w-3.5 h-3.5" />
              <span>{isSubmittingRegister ? 'Creating Account...' : 'Complete Registration'}</span>
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

      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-stone-50 border-t border-stone-200/80 text-center text-[11px] text-slate-500">
        ProductPerks Amazon Review Club • Safe & Secure Access
      </div>
    </div>
  );
};
