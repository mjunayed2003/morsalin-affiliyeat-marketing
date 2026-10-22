'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaBullhorn, 
  FaPaperPlane, 
  FaUsers, 
  FaUserShield, 
  FaUserCheck, 
  FaImage, 
  FaLink, 
  FaCircleCheck, 
  FaTriangleExclamation,
  FaClock,
  FaRotate,
  FaEye,
  FaShieldHalved
} from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';

interface BroadcastLog {
  id: string;
  adminId: string;
  adminName: string;
  title: string;
  body: string;
  targetGroup: string;
  recipientsCount: number;
  fcmSuccessCount: number;
  fcmFailureCount: number;
  createdAt: string;
}

export default function AdminBroadcastNotificationsPage() {
  const { user, token } = useAuth();
  const { showToast } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('/products');
  const [targetGroup, setTargetGroup] = useState<'ALL' | 'CLIENT' | 'ADMIN'>('ALL');

  // UI State
  const [isSending, setIsSending] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [lastSentHash, setLastSentHash] = useState<string>('');
  const [lastSentTime, setLastSentTime] = useState<number>(0);
  const [resultBanner, setResultBanner] = useState<{
    type: 'success' | 'error';
    message: string;
    metrics?: { recipientsCount: number; fcmSuccess: number; fcmFailure: number };
  } | null>(null);

  // Broadcast History
  const [logs, setLogs] = useState<BroadcastLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/broadcasts`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : (data?.logs || []));
      }
    } catch (e) {
      console.warn('Could not fetch broadcast history:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  // Validation
  const validationError = useMemo(() => {
    if (!title.trim()) return 'Notification title is required.';
    if (title.length > 100) return 'Title must be 100 characters or fewer.';
    if (!body.trim()) return 'Message body is required.';
    if (body.length > 500) return 'Message body must be 500 characters or fewer.';
    return null;
  }, [title, body]);

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) {
      showToast(validationError);
      return;
    }

    // Duplicate submission safeguard
    const currentHash = `${title.trim()}_${body.trim()}_${targetGroup}`;
    const now = Date.now();
    if (lastSentHash === currentHash && now - lastSentTime < 10000) {
      showToast('⚠️ Duplicate broadcast prevented. Please wait a moment before resending the same announcement.');
      return;
    }

    // Confirmation step for broadcast to everyone
    setConfirmModalOpen(true);
  };

  const handleConfirmSend = async () => {
    setConfirmModalOpen(false);
    setIsSending(true);
    setResultBanner(null);

    const payload = {
      title: title.trim(),
      body: body.trim(),
      image: image.trim() || undefined,
      link: link.trim() || '/products',
      targetGroup,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const fcmSuccess = data.fcmResults?.successCount || 0;
        const fcmFailure = data.fcmResults?.failureCount || 0;
        const count = data.recipientsCount || 0;

        setResultBanner({
          type: 'success',
          message: `Broadcast successfully sent to ${targetGroup === 'ALL' ? 'All Users' : targetGroup}!`,
          metrics: {
            recipientsCount: count,
            fcmSuccess,
            fcmFailure,
          },
        });
        showToast('📢 Notification broadcast distributed successfully!');

        // Record duplicate protection hash
        setLastSentHash(`${title.trim()}_${body.trim()}_${targetGroup}`);
        setLastSentTime(Date.now());

        // Reset form fields
        setTitle('');
        setBody('');
        setImage('');
        setLink('/products');

        // Refresh audit table
        fetchLogs();
      } else {
        setResultBanner({
          type: 'error',
          message: data.message || 'Failed to dispatch broadcast. Ensure you have admin privileges.',
        });
        showToast(data.message || 'Error sending broadcast.');
      }
    } catch (err: any) {
      setResultBanner({
        type: 'error',
        message: err.message || 'Network connection failed while sending broadcast.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Quick preset templates for admin convenience
  const applyTemplate = (tmpl: { title: string; body: string; link: string }) => {
    setTitle(tmpl.title);
    setBody(tmpl.body);
    setLink(tmpl.link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1b3b2b]/10 text-[#1b3b2b] flex items-center justify-center text-lg font-bold">
              <FaBullhorn className="w-5 h-5 text-[#1b3b2b]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Broadcast Notifications</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Send push alerts & real-time announcements via Firebase Cloud Messaging (FCM) & Socket.IO
              </p>
            </div>
          </div>
        </div>

        {/* System Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Socket.IO Real-time: Connected
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Firebase Admin SDK: Ready
          </span>
        </div>
      </div>

      {/* Result Status Banner */}
      {resultBanner && (
        <div 
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            resultBanner.type === 'success' 
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50/90 border-rose-200 text-rose-950'
          }`}
        >
          {resultBanner.type === 'success' ? (
            <FaCircleCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <FaTriangleExclamation className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm">{resultBanner.message}</p>
            {resultBanner.metrics && (
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-emerald-800 font-semibold">
                <span>Total Recipients: {resultBanner.metrics.recipientsCount}</span>
                <span>FCM Push Delivered: {resultBanner.metrics.fcmSuccess}</span>
                {resultBanner.metrics.fcmFailure > 0 && (
                  <span className="text-amber-800">FCM Inactive/Unregistered: {resultBanner.metrics.fcmFailure}</span>
                )}
              </div>
            )}
          </div>
          <button 
            type="button" 
            onClick={() => setResultBanner(null)} 
            className="text-xs opacity-60 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FaPaperPlane className="text-[#1b3b2b]" /> Compose Notification
              </h2>

              {/* Quick Template Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Quick Template:</span>
                <button
                  type="button"
                  onClick={() => applyTemplate({
                    title: 'New Review Club Perk Available! 🎁',
                    body: 'A limited-batch Amazon USA test product has just been listed. Grab your 100% free sample link now!',
                    link: '/products',
                  })}
                  className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  New Product
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate({
                    title: 'System Notice: Live Audio Support Active 📞',
                    body: 'Need help claiming your test product? You can now start a direct live audio call with our support team.',
                    link: '/chat',
                  })}
                  className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  Live Audio
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitAttempt} className="space-y-4">
              {/* Recipient Target Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Target Recipients <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetGroup('ALL')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      targetGroup === 'ALL'
                        ? 'border-[#1b3b2b] bg-[#1b3b2b]/5 ring-1 ring-[#1b3b2b]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaUsers className={`w-4 h-4 ${targetGroup === 'ALL' ? 'text-[#1b3b2b]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">All Users</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Clients & Admins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('CLIENT')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      targetGroup === 'CLIENT'
                        ? 'border-[#1b3b2b] bg-[#1b3b2b]/5 ring-1 ring-[#1b3b2b]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaUserCheck className={`w-4 h-4 ${targetGroup === 'CLIENT' ? 'text-[#1b3b2b]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">Customers</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Verified Reviewers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('ADMIN')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      targetGroup === 'ADMIN'
                        ? 'border-[#1b3b2b] bg-[#1b3b2b]/5 ring-1 ring-[#1b3b2b]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaUserShield className={`w-4 h-4 ${targetGroup === 'ADMIN' ? 'text-[#1b3b2b]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">Admins Only</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Internal Team</span>
                  </button>
                </div>
              </div>

              {/* Notification Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Notification Title <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${title.length > 90 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                    {title.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Product Perks Dropped! 🎁"
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] transition"
                  required
                />
              </div>

              {/* Notification Message Body */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Message Body <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${body.length > 450 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                    {body.length}/500
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter the notification announcement details here..."
                  maxLength={500}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] transition resize-y"
                  required
                />
              </div>

              {/* Optional Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Optional Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaImage className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... (optional banner or product picture)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] transition"
                  />
                </div>
              </div>

              {/* Optional Destination Route / URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination Route / URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaLink className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="/products or /chat or custom URL"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/20 focus:border-[#1b3b2b] transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending || Boolean(validationError)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1b3b2b] to-[#142e21] hover:from-[#142e21] hover:to-[#0d1e15] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Distributing Broadcast...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-3.5 h-3.5" />
                      <span>Send Broadcast Notification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview Column (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <FaEye className="text-slate-500" /> Live Notification Preview
            </h3>

            {/* Notification Center Popover Card Preview */}
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-emerald-800 uppercase tracking-wider">
                  In-App Notification Center
                </span>
                <span>Just now</span>
              </div>

              <div className="flex items-start gap-3">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-white text-[#1b3b2b] border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <FaBullhorn className="w-4 h-4 text-emerald-700" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {title || 'Announcement Title'}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-3 mt-0.5 leading-relaxed">
                    {body || 'Your message preview will appear here as users will experience it.'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-emerald-800 font-bold">
                    <span>Target: {targetGroup === 'ALL' ? 'Everyone' : targetGroup}</span>
                    <span>•</span>
                    <span className="text-slate-400 truncate">Route: {link || '/'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Browser Push Toast Preview */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-xl space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <FaShieldHalved className="w-2.5 h-2.5" /> Web Push Notification
                </span>
                <span>FreeProducts.online</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-xs font-black shrink-0">
                  FP
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate text-white">{title || 'Push Notification Title'}</p>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                    {body || 'Push alert notification text body...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Specifications */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1.5">
              <p className="font-bold text-slate-700">Delivery Rules:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Connected users receive immediate Socket.IO toast & unread counter bump.</li>
                <li>Background/offline devices receive background FCM multicast payload.</li>
                <li>Announcement is saved in DB for persistent Notification Center history.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History & Audit Logs Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaClock className="text-[#1b3b2b]" />
            <h2 className="text-sm font-bold text-slate-900">Broadcast Audit Log & History</h2>
          </div>
          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoadingLogs}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold transition cursor-pointer"
          >
            <FaRotate className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Title & Body</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Recipients</th>
                <th className="py-2.5 px-3">FCM Push Stats</th>
                <th className="py-2.5 px-3">Sent By</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {isLoadingLogs ? 'Loading broadcast logs...' : 'No broadcast announcements sent yet.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-3 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{log.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{log.body}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.targetGroup}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {log.recipientsCount}
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <span className="text-emerald-700 font-bold">✓ {log.fcmSuccessCount}</span>
                      {log.fcmFailureCount > 0 && (
                        <span className="text-slate-400 ml-1.5">({log.fcmFailureCount} inactive)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {log.adminName || 'Admin'}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
              <FaBullhorn />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Broadcast Notification
              </h3>
              <p className="text-xs text-slate-500">
                You are about to distribute this notification to{' '}
                <strong className="text-slate-900">
                  {targetGroup === 'ALL' ? 'ALL platform users' : `${targetGroup} users`}
                </strong>
                .
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1 text-left">
              <p className="font-bold text-slate-900 truncate">Title: {title}</p>
              <p className="text-slate-600 line-clamp-2">Message: {body}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="flex-1 py-2.5 rounded-xl bg-[#1b3b2b] hover:bg-[#142e21] text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
