'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaGear, 
  FaAmazon, 
  FaShieldHalved, 
  FaBell, 
  FaFloppyDisk,
  FaCheck,
  FaTriangleExclamation,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { API_BASE_URL } from '@/lib/socket';

export default function AdminSettingsPage() {
  const { settings, updateSettings, showToast } = useApp();

  const [amazonTag, setAmazonTag] = useState(settings.amazonTag || 'bwbh00-20');
  const [platformName, setPlatformName] = useState(settings.platformName || 'FreeProducts.online');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || 'support@freeproducts.online');
  const [currency, setCurrency] = useState(settings.currency || 'USD ($)');
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(settings.enableSoundAlerts ?? true);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode ?? false);
  const [isSaving, setIsSaving] = useState(false);

  // Resend email test state
  const [testEmail, setTestEmail] = useState('delivered@resend.dev');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; id?: string } | null>(null);

  // Sync inputs whenever global settings change
  useEffect(() => {
    setAmazonTag(settings.amazonTag || 'bwbh00-20');
    setPlatformName(settings.platformName || 'FreeProducts.online');
    setSupportEmail(settings.supportEmail || 'support@freeproducts.online');
    setCurrency(settings.currency || 'USD ($)');
    setEnableSoundAlerts(settings.enableSoundAlerts ?? true);
    setMaintenanceMode(settings.maintenanceMode ?? false);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateSettings({
      amazonTag: amazonTag.trim(),
      platformName: platformName.trim(),
      supportEmail: supportEmail.trim(),
      currency,
      enableSoundAlerts,
      maintenanceMode,
    });
    setIsSaving(false);
    if (res.success) {
      showToast('✅ Platform settings saved and synced across store!');
    } else {
      showToast(`⚠️ ${res.message || 'Failed to save settings'}`);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/mail/test-resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail.trim(),
          subject: `Test Resend Dispatch from ${platformName}`,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Email dispatched successfully via Resend!`,
          id: data.id,
        });
        showToast('✉️ Test email dispatched successfully via Resend!');
      } else {
        setTestResult({
          success: false,
          message: data.error?.message || data.message || 'Failed to send test email',
        });
        showToast('⚠️ Test email failed. Check Resend domain setup.');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network request failed',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global Amazon affiliate configurations, support channels, and platform preferences.
          </p>
        </div>
      </div>

      {settings.maintenanceMode && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <FaTriangleExclamation className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Public Maintenance Mode is currently active:</span>
            <span className="ml-1">Regular visitors are restricted from browsing the public catalog. Administrators can still access the admin dashboard.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Amazon Associates Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FaAmazon className="w-4 h-4 text-[#ff9900]" />
            <h3 className="text-sm font-bold text-slate-900">Amazon Associates Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Default Amazon Associate Tag
              </label>
              <input
                type="text"
                value={amazonTag}
                onChange={(e) => setAmazonTag(e.target.value)}
                placeholder="e.g. bwbh00-20"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
              <p className="text-[11px] text-slate-400 mt-1">Appended to all outbound merchant product links.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              >
                <option value="USD ($)">USD ($) - United States</option>
                <option value="CAD ($)">CAD ($) - Canada</option>
                <option value="GBP (£)">GBP (£) - United Kingdom</option>
              </select>
            </div>
          </div>
        </div>

        {/* General Platform Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FaGear className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">General Platform Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Support Notification Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Audio Chime Notifications</p>
                <p className="text-[11px] text-slate-500">Play Web Audio chime on customer chat messages.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSoundAlerts}
                  onChange={(e) => setEnableSoundAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1b3b2b]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Public Maintenance Mode</p>
                <p className="text-[11px] text-slate-500">Temporarily restrict public store access to reviewers.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Platform Settings */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Platform Settings...</span>
              </>
            ) : (
              <>
                <FaFloppyDisk className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Resend Email API Integration Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FaEnvelope className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Resend Email Delivery Integration</h3>
          </div>
          <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <FaCheck className="w-3 h-3 text-emerald-600" />
            <span>Resend SDK Connected</span>
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Customer OTP verification codes and password recovery emails are powered by the official <strong>Resend Node.js SDK</strong> with automatic fallback to secondary SMTP.
        </p>

        <form onSubmit={handleSendTestEmail} className="pt-2 space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Dispatch Live Test Email via Resend
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="e.g. delivered@resend.dev or your personal email"
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
              required
            />
            <button
              type="submit"
              disabled={isSendingTest}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {isSendingTest ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="w-3 h-3" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Tip: Use <code className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">delivered@resend.dev</code> to simulate instant delivery, or enter your verified email.
          </p>

          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs border ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {testResult.success ? (
                  <>
                    <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{testResult.message}</span>
                  </>
                ) : (
                  <>
                    <FaTriangleExclamation className="w-3.5 h-3.5 text-rose-600" />
                    <span>{testResult.message}</span>
                  </>
                )}
              </div>
              {testResult.id && (
                <p className="text-[11px] font-mono mt-1 text-emerald-700">
                  Resend Message ID: {testResult.id}
                </p>
              )}
            </div>
          )}
        </form>
      </div>

    </div>
  );
}
