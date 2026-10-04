'use client';

import React, { useState, useEffect } from 'react';
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
  FaBolt,
  FaLocationDot,
  FaUserPlus
} from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    registerUser,
    loginWithPassword, 
    loginDemoClient
  } = useAuth();

  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Direct Registration form state (No OTP)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Dhaka');
  const [regError, setRegError] = useState('');
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Synchronize modal mode with activeTab
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
      setLoginError('');
      setRegError('');
    }
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Handle Returning Client Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await loginWithPassword(loginPhone, loginPassword);
      if (res.success) {
        showToast(res.message);
        closeAuthModal();
      } else {
        setLoginError(res.message);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Direct Registration (No OTP)
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
        closeAuthModal();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with ByteDesk Brand */}
        <div className="bg-[#0d5bff] text-white p-5 relative shrink-0">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#ccff00] text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider">
              Client Portal
            </span>
            <span className="text-blue-100 text-xs flex items-center gap-1">
              <FaShieldHalved className="w-3 h-3 text-[#ccff00]" />
              Secure Client Access
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {activeTab === 'login' ? 'Client Sign In' : 'New Client Registration'}
          </h2>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            {activeTab === 'login' 
              ? 'Returning clients can log in directly with phone & password.'
              : 'New clients can create an account directly with phone and password.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
              setRegError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Log In (লগইন)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError('');
              setLoginError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FaUserPlus className="w-3.5 h-3.5 text-[#0d5bff]" />
            <span>Registration (রেজিস্ট্রেশন)</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">

          {/* TAB 1: RETURNING CLIENT LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium animate-in fade-in">
                  {loginError}
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <FaCheck className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Already registered?</strong> Enter your phone number and password to log in directly.
                </span>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FaPhone className="w-3 h-3 text-[#0d5bff]" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 0171****678"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FaLock className="w-3 h-3 text-[#0d5bff]" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setRegPhone(loginPhone);
                    }}
                    className="text-[11px] text-[#0d5bff] hover:underline font-bold"
                  >
                    New user? Register
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingLogin || !loginPhone || !loginPassword}
                className="w-full bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-50 text-white font-black py-3 rounded-xl shadow-md shadow-blue-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmittingLogin ? 'Signing In...' : 'Log In Directly'}</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Demo Login Option */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    loginDemoClient();
                    showToast('Logged in as Demo Client: Morsalin Chowdhury');
                  }}
                  className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaBolt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Click Demo Client Login (Morsalin • 0171****678)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: DIRECT CLIENT REGISTRATION FORM (NO OTP) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium animate-in fade-in">
                  {regError}
                </div>
              )}

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Instant Registration:</strong> Create your account with your name & phone number directly.
                </span>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FaUser className="w-3 h-3 text-[#0d5bff]" />
                  Full Name (পূর্ণ নাম) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morsalin Chowdhury"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FaPhone className="w-3 h-3 text-[#0d5bff]" />
                  Phone Number (ফোন নম্বর) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0181****678"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FaLock className="w-3 h-3 text-[#0d5bff]" />
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Min 4 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 pr-8 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FaLock className="w-3 h-3 text-[#0d5bff]" />
                    Confirm <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Re-enter"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                  />
                </div>
              </div>

              {/* Delivery Address (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FaLocationDot className="w-3 h-3 text-slate-500" />
                  Delivery City / Address (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Banani, Dhaka"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRegister || !regName || !regPhone || !regPassword}
                className="w-full bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-50 text-white font-black py-3 rounded-xl shadow-md shadow-blue-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <FaUserPlus className="w-4 h-4" />
                <span>{isSubmittingRegister ? 'Creating Account...' : 'Complete Registration'}</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 shrink-0">
          ByteDesk Client Protection • Direct Client Registration
        </div>
      </div>
    </div>
  );
};
