'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  FaKey,
  FaCamera,
  FaCheck,
  FaImage
} from 'react-icons/fa6';
import { FaPaypal, FaAmazon } from 'react-icons/fa';

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
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Registration form state
  const [regStep, setRegStep] = useState<'form' | 'otp' | 'selfie'>('form');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regAmazonProfile, setRegAmazonProfile] = useState('');
  const [regPaypalEmail, setRegPaypalEmail] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regError, setRegError] = useState('');
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [isVerifyingRegOtp, setIsVerifyingRegOtp] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTimer, setRegTimer] = useState<number>(600); // 10 mins

  // Camera & Selfie state (Strictly Live Camera Snap Only)
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const selfieFileRef = React.useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported on this browser. You can upload a photo instead.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 480 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera permission denied or unavailable:', err);
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device detected on this computer. You can upload your selfie photo below.');
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was blocked. Please allow camera in browser or upload your photo below.');
      } else {
        setCameraError('Camera is currently unavailable. You can upload your selfie photo below.');
      }
      setIsCameraActive(false);
    }
  };

  const handleSelfieFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCameraError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelfieImage(reader.result as string);
      setCameraError(null);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelfieImage(dataUrl);
      stopCamera();
    }
  };

  // Auto-launch camera when user advances to the selfie verification step
  useEffect(() => {
    if (regStep === 'selfie' && !selfieImage && !isCameraActive) {
      startCamera();
    }
  }, [regStep]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
        amazonProfileUrl: regAmazonProfile.trim() || undefined,
        paypalEmail: regPaypalEmail.trim() || undefined,
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

  // Handle Step 2: Validate OTP & Proceed to Selfie Verification
  const handleProceedToSelfie = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regOtp || regOtp.trim().length !== 6) {
      setRegError('Please enter the 6-digit verification code.');
      return;
    }

    setRegStep('selfie');
    startCamera();
  };

  // Handle Step 3: Submit Selfie & Complete Registration
  const handleFinalSubmitWithSelfie = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!selfieImage) {
      setRegError('Please snap a live front camera selfie to complete your account registration.');
      return;
    }

    setIsVerifyingRegOtp(true);
    try {
      const res = await verifyRegisterOtp(
        regEmail.trim(), 
        regOtp.trim(), 
        selfieImage, 
        regAmazonProfile.trim() || undefined, 
        regPaypalEmail.trim() || undefined
      );
      if (res.success) {
        showToast(res.message);
        stopCamera();
        if (onSuccess) onSuccess();
        if (res.status === 'PENDING') {
          router.push('/pending-approval');
        }
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
      {/* Card Header with Original Logo */}
      <div className="bg-[#1b3b2b] p-5 sm:p-6 flex items-center justify-center">
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-md flex items-center justify-center">
          <img
            src="/logo.jpeg"
            alt="FreeProducts.online"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </div>
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
              <div className={`p-3.5 border rounded-xl text-xs font-medium ${
                loginError.toLowerCase().includes('pending') || loginError.toLowerCase().includes('awaiting')
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <p>{loginError}</p>
                {(loginError.toLowerCase().includes('pending') || loginError.toLowerCase().includes('awaiting')) && (
                  <button
                    type="button"
                    onClick={() => router.push('/pending-approval')}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer"
                  >
                    View Pending Approval Status &rarr;
                  </button>
                )}
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

                {/* Reviewer Credentials: Amazon Profile & PayPal */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FaAmazon className="w-3 h-3 text-amber-600" />
                      Reviewer Payout & Verification Info
                    </span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      Required for Cash Back
                    </span>
                  </div>

                  {/* 1. Amazon Profile Link */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FaAmazon className="w-3.5 h-3.5 text-amber-600" />
                        1. Amazon Profile Link <span className="text-rose-500">*</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Public profile</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.amazon.com/gp/profile/amzn1.account..."
                      value={regAmazonProfile}
                      onChange={(e) => setRegAmazonProfile(e.target.value)}
                      className="w-full bg-white text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                    <p className="text-[10px] text-slate-500">
                      Paste your public Amazon profile link to verify your reviewer eligibility.
                    </p>
                  </div>

                  {/* 2. PayPal Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FaPaypal className="w-3.5 h-3.5 text-blue-600" />
                        2. PayPal Email Address <span className="text-rose-500">*</span>
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">100% Refund</span>
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@paypal.com"
                      value={regPaypalEmail}
                      onChange={(e) => setRegPaypalEmail(e.target.value)}
                      className="w-full bg-white text-slate-900 px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium transition-all"
                    />
                    <p className="text-[10px] text-slate-500">
                      Where our team will send your 100% item refund & testing incentives.
                    </p>
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
              <form onSubmit={handleProceedToSelfie} className="space-y-4 animate-in fade-in duration-150">
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

                {/* Continue to Selfie Button */}
                <button
                  type="submit"
                  disabled={regOtp.length !== 6}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue to Selfie Verification</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
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
                    disabled={isSendingRegOtp || regTimer > 540}
                    className="text-[#1b3b2b] hover:underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <FaRotateRight className={`w-3 h-3 ${isSendingRegOtp ? 'animate-spin' : ''}`} />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Selfie Verification Screen */}
            {regStep === 'selfie' && (
              <form onSubmit={handleFinalSubmitWithSelfie} className="space-y-4 animate-in fade-in duration-200">
                {/* Header Card */}
                <div className="text-center p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 shadow-xs">
                    <FaCamera className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Identity Selfie Verification</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Step 3 of 3: Snap a live front camera selfie to complete your reviewer registration.
                  </p>
                </div>

                {cameraError && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                    {cameraError}
                  </div>
                )}

                {/* Camera / Preview Frame */}
                <div className="relative w-full aspect-4/3 max-w-[340px] mx-auto rounded-2xl bg-slate-900 overflow-hidden border-2 border-stone-200 shadow-md flex items-center justify-center">
                  {/* Case 1: Live Video Camera Stream */}
                  {isCameraActive && (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      {/* Face guideline frame */}
                      <div className="absolute inset-4 sm:inset-6 rounded-full border-2 border-dashed border-emerald-400/70 pointer-events-none animate-pulse" />
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={captureSelfie}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FaCamera className="w-3.5 h-3.5" />
                          <span>Snap Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-2 rounded-full cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case 2: Selfie Photo Captured or Uploaded */}
                  {!isCameraActive && selfieImage && (
                    <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                      <img
                        src={selfieImage}
                        alt="Selfie Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <FaCheck className="w-2.5 h-2.5" />
                        <span>Selfie Ready</span>
                      </div>
                      <div className="absolute bottom-2.5 left-0 right-0 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelfieImage(null);
                            startCamera();
                          }}
                          className="bg-slate-900/85 hover:bg-slate-950 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FaRotateRight className="w-3 h-3" />
                          <span>Retake Photo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case 3: Empty State (Prompt to Open Camera or Upload) */}
                  {!isCameraActive && !selfieImage && (
                    <div className="text-center p-6 text-white space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <FaUser className="w-7 h-7 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        Ensure good lighting with your face clearly visible.
                      </p>
                    </div>
                  )}
                </div>

                {/* Camera / Upload Controls */}
                {!isCameraActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full bg-[#1b3b2b] hover:bg-[#142e20] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FaCamera className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{selfieImage ? 'Re-open Camera' : 'Use Camera'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => selfieFileRef.current?.click()}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200 shadow-xs"
                    >
                      <FaImage className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                )}

                <input
                  ref={selfieFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelfieFileUpload}
                />

                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
                  <p className="text-[11px] text-slate-600 font-medium">
                    🔒 <strong>Identity Verification:</strong> Use your front camera or upload a clear, front-facing selfie to verify your USA reviewer profile.
                  </p>
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifyingRegOtp || !selfieImage}
                  className="w-full bg-[#1b3b2b] hover:bg-[#142e20] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-bold py-3.5 rounded-xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <FaCircleCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isVerifyingRegOtp
                      ? 'Verifying & Creating Account...'
                      : selfieImage
                      ? 'Submit Selfie & Finish Registration'
                      : 'Take or Upload Selfie First'}
                  </span>
                </button>

                {/* Back to OTP */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setRegStep('otp');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    <span>Back to OTP Code</span>
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
