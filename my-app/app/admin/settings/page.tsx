'use client';

import React, { useState } from 'react';
import { 
  FaGear, 
  FaAmazon, 
  FaShieldHalved, 
  FaBell, 
  FaFloppyDisk,
  FaCheck
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';

export default function AdminSettingsPage() {
  const { showToast } = useApp();

  const [amazonTag, setAmazonTag] = useState('bwbh00-20');
  const [platformName, setPlatformName] = useState('ProductPerks');
  const [supportEmail, setSupportEmail] = useState('support@productperks.com');
  const [currency, setCurrency] = useState('USD ($)');
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform settings saved successfully.');
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <FaFloppyDisk className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
