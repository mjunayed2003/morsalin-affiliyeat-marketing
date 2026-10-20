'use client';

import React from 'react';
import { 
  FaFileLines, 
  FaFileCsv, 
  FaDownload, 
  FaCalendarDays, 
  FaBoxOpen,
  FaUsers,
  FaComments
} from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { useAuth } from '@/app/context/AuthContext';
import { maskPhone } from '@/app/types';

export default function AdminReportsPage() {
  const { products, messages, showToast } = useApp();
  const { users } = useAuth();

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}.csv successfully!`);
  };

  const handleExportProducts = () => {
    const headers = ['ID', 'Title', 'Category', 'Store', 'Price', 'RetailPrice', 'Commission', 'Rating', 'ReviewsCount', 'AmazonURL'];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.store || ''}"`,
      p.price,
      p.originalPrice,
      `"${p.commission}"`,
      p.rating,
      p.reviewsCount,
      `"${p.amazonUrl || ''}"`,
    ]);
    downloadCSV('freeproducts_catalog_export', headers, rows);
  };

  const handleExportUsers = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Role', 'Status', 'CreatedAt'];
    const rows = users.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${maskPhone(u.phone)}"`,
      `"${u.email || ''}"`,
      u.role,
      u.status || 'ACTIVE',
      u.createdAt,
    ]);
    downloadCSV('freeproducts_reviewers_export', headers, rows);
  };

  const handleExportMessages = () => {
    const headers = ['ID', 'Sender', 'SenderName', 'Message', 'Timestamp'];
    const rows = messages.map((m) => [
      m.id,
      m.sender,
      `"${m.senderName || ''}"`,
      `"${m.text.replace(/"/g, '""')}"`,
      `"${m.timestamp}"`,
    ]);
    downloadCSV('freeproducts_chat_messages_export', headers, rows);
  };

  const reports = [
    {
      id: 'rep-01',
      title: 'Amazon Product Catalog Export',
      description: `Complete export of all ${products.length} live Amazon partner products, commissions, and affiliate links.`,
      recordsCount: `${products.length} Products`,
      action: handleExportProducts,
      icon: FaBoxOpen,
    },
    {
      id: 'rep-02',
      title: 'Registered Reviewer Accounts Export',
      description: `Complete database export of all ${users.length} verified client and reviewer accounts.`,
      recordsCount: `${users.length} Reviewers`,
      action: handleExportUsers,
      icon: FaUsers,
    },
    {
      id: 'rep-03',
      title: 'Support & Chat Communication Logs',
      description: `Complete archive of ${messages.length} customer inquiries and support messages.`,
      recordsCount: `${messages.length} Messages`,
      action: handleExportMessages,
      icon: FaComments,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Reports & Live Data Export Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export genuine real-time data from your PostgreSQL database into standard CSV format.
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1b3b2b]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{rep.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-xl">{rep.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-2">
                    <span className="flex items-center gap-1 font-mono text-emerald-700 font-bold">
                      <FaCalendarDays className="w-3 h-3" />
                      {rep.recordsCount}
                    </span>
                    <span>•</span>
                    <span>Format: CSV</span>
                    <span>•</span>
                    <span>Live Database Sync</span>
                  </div>
                </div>
              </div>

              <button
                onClick={rep.action}
                className="inline-flex items-center justify-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <FaDownload className="w-3.5 h-3.5" />
                <span>Export Real CSV</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
