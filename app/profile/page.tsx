'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaLocationDot, 
  FaCheck, 
  FaShieldHalved, 
  FaComments, 
  FaLock, 
  FaArrowRightFromBracket,
  FaArrowRight,
  FaBolt,
  FaBagShopping,
  FaFloppyDisk
} from 'react-icons/fa6';
import { AuthCard } from '@/components/AuthCard';
import { maskPhone } from '@/app/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUserProfile, openAuthModal, loginDemoClient } = useAuth();
  const { messages, showToast } = useApp();

  // Form states for profile edit
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Dhaka');
  const [isSaving, setIsSaving] = useState(false);

  // Security password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Active tab inside profile
  const [activeSection, setActiveSection] = useState<'info' | 'inquiries' | 'security'>('info');

  // Update local inputs when user loads
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
      setCity(user.city || 'Dhaka');
    }
  }, [user]);

  // Handle saving profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateUserProfile({
        name,
        email,
        address,
        city
      });
      setIsSaving(false);
      showToast('Profile information updated successfully!');
    }, 400);
  };

  // Handle password update
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordMsg('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.');
      return;
    }

    updateUserProfile({ password: newPassword });
    setPasswordMsg('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated! You can use this for future logins.');
  };

  // Customer messages sent by this client
  const clientMessages = messages.filter((m) => m.sender === 'customer');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#ccff00] selection:text-slate-950 font-sans pb-24 md:pb-12">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* If user is NOT logged in */}
        {!isAuthenticated || !user ? (
          <div className="max-w-lg mx-auto py-8">
            {/* Brand Logo (Navbar is hidden when logged out) */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#0d5bff] text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <FaBagShopping className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl text-slate-900 tracking-tight">
                    Byte<span className="text-[#0d5bff]">Desk</span>
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00] text-slate-950">
                    Client Portal
                  </span>
                </div>
              </div>
            </div>

            <AuthCard 
              title="Client Profile Portal"
              subtitle="Register or log in to manage your profile and view your chats."
            />
          </div>
        ) : (
          /* When User IS logged in */
          <div className="space-y-6">

            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* User Avatar */}
                  <div className="relative">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#0d5bff]/20 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs border-2 border-white" title="Verified Phone">
                      <FaCheck className="w-3 h-3" />
                    </span>
                  </div>

                  {/* User Information */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                        {user.name}
                      </h1>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        <FaCheck className="w-3 h-3 text-emerald-600" />
                        Verified Client
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-mono flex items-center gap-2">
                      <FaPhone className="w-3 h-3 text-emerald-600" />
                      <span>{maskPhone(user.phone)}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-sans">Verified Client</span>
                    </p>

                    <p className="text-xs text-slate-400">
                      Client ID: <span className="font-mono text-slate-600">{user.id}</span>
                    </p>
                  </div>
                </div>

                {/* Right Action: Sign Out button */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Link
                    href="/chat"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#0d5bff] hover:bg-[#0045d8] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <FaComments className="w-4 h-4" />
                    <span>Open Live Chat</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      showToast('You have been signed out.');
                      router.push('/');
                    }}
                    className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FaArrowRightFromBracket className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>

              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone Status</p>
                  <p className="text-sm font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                    <FaCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chat Messages</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {clientMessages.length} inquiries
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City / Region</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {user.city || 'Dhaka, BD'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Login Method</p>
                  <p className="text-sm font-black text-[#0d5bff] mt-0.5">
                    Phone + Password
                  </p>
                </div>
              </div>

            </div>

            {/* Profile Tab Navigation */}
            <div className="flex border-b border-slate-200 gap-2">
              <button
                onClick={() => setActiveSection('info')}
                className={`py-3 px-4 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === 'info'
                    ? 'border-[#0d5bff] text-[#0d5bff]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FaUser className="w-3.5 h-3.5" />
                <span>Client & Shipping Details</span>
              </button>

              <button
                onClick={() => setActiveSection('inquiries')}
                className={`py-3 px-4 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === 'inquiries'
                    ? 'border-[#0d5bff] text-[#0d5bff]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FaComments className="w-3.5 h-3.5" />
                <span>My Inquiries ({clientMessages.length})</span>
              </button>

              <button
                onClick={() => setActiveSection('security')}
                className={`py-3 px-4 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === 'security'
                    ? 'border-[#0d5bff] text-[#0d5bff]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FaShieldHalved className="w-3.5 h-3.5" />
                <span>Security & Password</span>
              </button>
            </div>

            {/* TAB CONTENT 1: PERSONAL & SHIPPING DETAILS */}
            {activeSection === 'info' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-black text-lg text-slate-950">Client Profile & Delivery Information</h3>
                    <p className="text-xs text-slate-500">
                      Keep your shipping address updated so when you inquire about products in chat, admin can quote delivery immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FaUser className="w-3 h-3 text-[#0d5bff]" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                      />
                    </div>

                    {/* Phone (Verified, Read-Only) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FaPhone className="w-3 h-3 text-emerald-600" />
                          Phone Number (Verified)
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <FaCheck className="w-3 h-3" /> Verified Account
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={maskPhone(user.phone)}
                          disabled
                          className="w-full bg-slate-100 text-slate-600 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 font-mono font-medium cursor-not-allowed select-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FaEnvelope className="w-3 h-3 text-[#0d5bff]" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. client@example.com"
                        className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                      />
                    </div>

                    {/* City / Division */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FaLocationDot className="w-3 h-3 text-[#0d5bff]" />
                        City / Division
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Dhaka, Chittagong, Sylhet"
                        className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FaLocationDot className="w-3 h-3 text-[#0d5bff]" />
                      Full Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 42, Road 11, Block D, Banani"
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <FaFloppyDisk className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT 2: RECENT INQUIRIES & CHATS */}
            {activeSection === 'inquiries' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-lg text-slate-950">Product Inquiries & Chat Activity</h3>
                    <p className="text-xs text-slate-500">
                      Messages you sent to the admin support desk are synced in real time.
                    </p>
                  </div>
                  <Link
                    href="/chat"
                    className="flex items-center gap-1.5 bg-[#ccff00] text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-xs hover:bg-[#b8e600] transition-colors"
                  >
                    <span>Open Chat Desk</span>
                    <FaArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {clientMessages.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0d5bff] flex items-center justify-center mx-auto">
                      <FaComments className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No chat inquiries yet</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Browse products in the home catalog and click &ldquo;Inquire &amp; Chat&rdquo; to start a private conversation with Admin.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-[#0d5bff] text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      <FaBagShopping className="w-3.5 h-3.5" />
                      <span>Explore Products</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clientMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          {msg.productInfo ? (
                            <img
                              src={msg.productInfo.image}
                              alt={msg.productInfo.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0d5bff] flex items-center justify-center shrink-0">
                              <FaComments className="w-5 h-5" />
                            </div>
                          )}

                          <div>
                            {msg.productInfo && (
                              <p className="text-xs font-bold text-slate-900">
                                Product: {msg.productInfo.title} (${msg.productInfo.price})
                              </p>
                            )}
                            <p className="text-xs text-slate-700 mt-0.5 line-clamp-2">
                              &ldquo;{msg.text}&rdquo;
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                              Sent at {msg.timestamp}
                            </span>
                          </div>
                        </div>

                        <Link
                          href="/chat"
                          className="text-xs font-bold text-[#0d5bff] hover:underline flex items-center gap-1 shrink-0 self-end sm:self-center"
                        >
                          <span>View in Chat</span>
                          <FaArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: SECURITY & PASSWORD */}
            {activeSection === 'security' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-black text-lg text-slate-950">Security & Login Credentials</h3>
                  <p className="text-xs text-slate-500">
                    Your client phone number is registered. You can update your password to log in directly anytime.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950">Registered Client Phone</h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Phone: <span className="font-mono font-bold">{maskPhone(user.phone)}</span>. Your client account is active and you can log in directly with your password.
                    </p>
                  </div>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Change Account Password</h4>
                  
                  {passwordMsg && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                      {passwordMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FaLock className="w-3 h-3 text-[#0d5bff]" />
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="At least 4 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FaLock className="w-3 h-3 text-[#0d5bff]" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Re-type your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:border-[#0d5bff] font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newPassword || !confirmPassword}
                    className="bg-[#0d5bff] hover:bg-[#0045d8] active:scale-95 disabled:opacity-50 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
