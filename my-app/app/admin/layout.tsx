'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminGuard } from '@/components/auth/AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7d');

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans antialiased selection:bg-[#1b3b2b] selection:text-white">
        {/* Dedicated Admin Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Top Sticky Header */}
          <AdminHeader
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
