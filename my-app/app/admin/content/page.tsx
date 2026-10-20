'use client';

import React, { useState } from 'react';
import { 
  FaGlobe, 
  FaFloppyDisk, 
  FaQuestion, 
  FaBullhorn, 
  FaCheck 
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';

export default function AdminContentPage() {
  const { showToast } = useApp();

  const [heroHeadline, setHeroHeadline] = useState(
    'Test Top Amazon Products. Share Honest Reviews. Keep Them 100% Free.'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Join FreeProducts.online Review Club! Get brand-new items from verified Amazon stores (LONG YUE, Lickoon, Imps Hair Creates & more).'
  );
  const [announcementBanner, setAnnouncementBanner] = useState(
    '🔥 New Spring Review Perks Added! Test pet care, home & beauty gadgets 100% free with Amazon Prime delivery.'
  );
  const [seoMetaTitle, setSeoMetaTitle] = useState(
    'FreeProducts.online - Amazon Product Reviews & Free Testing Club USA'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Content and SEO settings saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Content & SEO Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure homepage copywriting, top announcements, reviewer FAQs, and search metadata.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Homepage Hero Copy Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FaBullhorn className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Hero Section Messaging</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Main H1 Headline</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Hero Subtitle Paragraph</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Top Announcement Ribbon</label>
            <input
              type="text"
              value={announcementBanner}
              onChange={(e) => setAnnouncementBanner(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
            />
          </div>
        </div>

        {/* SEO Metadata Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FaGlobe className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">Global SEO & OpenGraph Meta</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Meta Title Tag</label>
            <input
              type="text"
              value={seoMetaTitle}
              onChange={(e) => setSeoMetaTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <FaFloppyDisk className="w-3.5 h-3.5" />
            <span>Save Content Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
}
