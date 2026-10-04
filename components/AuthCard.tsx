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
  FaBolt,
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
    loginWithPassword, 
    loginDemoClient
  } = useAuth();

  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
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

  // Handle Direct Registration (No OTP!)
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
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="bg-[#0d5bff] text-white p-6 relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#ccff00] text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider">
            Verified Client Portal
          </span>
          <span className="text-blue-100 text-xs flex items-center gap-1">
            <FaShieldHalved className="w-3 h-3 text-[#ccff00]" />
            Secure Client Access
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {title || (activeTab === 'login' ? 'Client Sign In' : 'New Client Registration')}
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1.5 font-medium leading-relaxed">
          {subtitle || (
            activeTab === 'login' 
              ? 'Enter your phone number & password to unlock the store.' 
              : 'Fill in your details below to create your client account directly.'
          )}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setLoginError('');
            setRegError('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'login'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200'
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
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FaUserPlus className="w-3.5 h-3.5 text-[#0d5bff]" />
          <span>New Registration (রেজিস্ট্রেশন)</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-7 space-y-4">
        
        {/* TAB 1: RETURNING CLIENT LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium animate-in fade-in">
                {loginError}
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
              <FaCheck className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
              <span>
                <strong>Already registered?</strong> Log in directly with your phone number and password to access the catalog and live chat.
              </span>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FaPhone className="w-3 h-3 text-[#0d5bff]" />
                Client Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 0171****678"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                required
                className="w-full bg-slate-50 text-slate-900 px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
              />
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
                  className="w-full bg-slate-50 text-slate-900 px-4 py-3 pr-10 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
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
              className="w-full bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSubmittingLogin ? 'Signing In...' : 'Log In & View Store'}</span>
              <FaArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login Option */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  loginDemoClient();
                  showToast('Logged in as Demo Client: Morsalin Chowdhury');
                  if (onSuccess) onSuccess();
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
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium animate-in fade-in">
                {regError}
              </div>
            )}

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2">
              <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Instant Registration:</strong> Fill out the form below to create your account immediately. No OTP code needed!
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
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
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
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
              />
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FaLock className="w-3 h-3 text-[#0d5bff]" />
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Min 4 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 pr-9 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
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
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FaLock className="w-3 h-3 text-[#0d5bff]" />
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>
            </div>

            {/* Delivery Address & City (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FaLocationDot className="w-3 h-3 text-slate-500" />
                  City / Division (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Delivery Address (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Banani, Road 11"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingRegister || !regName || !regPhone || !regPassword}
              className="w-full bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>{isSubmittingRegister ? 'Creating Account...' : 'Complete Registration & Enter Store'}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-slate-500 hover:text-[#0d5bff] font-bold"
              >
                Already registered? <span className="underline">Click here to Log In</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Footer info */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
        ByteDesk Client Protection • Direct & Secure Registration
      </div>
    </div>
  );
};
