'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FaUsers, 
  FaUserShield, 
  FaUserSlash, 
  FaUserCheck, 
  FaFileCsv, 
  FaMagnifyingGlass, 
  FaEye, 
  FaBan, 
  FaCheck,
  FaPhone,
  FaLocationDot,
  FaArrowRight
} from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { User, maskPhone } from '@/app/types';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

export default function AdminUsersPage() {
  const { users, blockUser, unblockUser } = useAuth();
  const { showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedUserForAction, setSelectedUserForAction] = useState<{ user: User; action: 'block' | 'unblock' } | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const userStatus = u.status || 'ACTIVE';
      if (statusFilter === 'ALL') return true;
      return userStatus === statusFilter;
    });
  }, [users, statusFilter]);

  // Metrics
  const totalUsers = users.length;
  const activeCount = users.filter((u) => (u.status || 'ACTIVE') === 'ACTIVE').length;
  const blockedCount = users.filter((u) => u.status === 'BLOCKED').length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Role', 'Status', 'Verified', 'Created At'];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${maskPhone(u.phone)}"`,
      `"${u.email || ''}"`,
      u.role,
      u.status || 'ACTIVE',
      u.verified ? 'Yes' : 'No',
      u.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `productperks_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('User data exported successfully.');
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
            alt={u.name}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
          />
          <div className="min-w-0">
            <Link
              href={`/admin/users/${u.id}`}
              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors"
            >
              {u.name}
            </Link>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <FaPhone className="w-2.5 h-2.5 text-emerald-600" />
              <span>{maskPhone(u.phone)}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email / Location',
      render: (u) => (
        <div>
          <p className="text-slate-800 font-medium truncate max-w-[160px]">{u.email || '—'}</p>
          <p className="text-[11px] text-slate-400">{u.city || 'Dhaka'}, Bangladesh</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      sortable: true,
      render: (u) => {
        const status = u.status || 'ACTIVE';
        if (status === 'BLOCKED') return <Badge variant="blocked">Blocked</Badge>;
        if (status === 'PENDING') return <Badge variant="pending">Pending</Badge>;
        return <Badge variant="active">Active</Badge>;
      },
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <Badge variant={u.role === 'admin' ? 'admin' : 'client'}>
          {u.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'activity',
      header: 'Account Verification',
      render: (u) => (
        <div className="text-[11px]">
          <p className="text-emerald-700 font-bold flex items-center gap-1">
            <FaCheck className="w-2.5 h-2.5" />
            <span>Phone Verified</span>
          </p>
          <p className="text-slate-400 font-mono">{maskPhone(u.phone)}</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      sortable: true,
      render: (u) => (
        <span className="text-slate-500 text-[11px] font-mono">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/users/${u.id}`}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="View User Details"
          >
            <FaEye className="w-3.5 h-3.5" />
          </Link>

          {(u.status || 'ACTIVE') === 'BLOCKED' ? (
            <button
              onClick={() => setSelectedUserForAction({ user: u, action: 'unblock' })}
              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              title="Unblock User"
            >
              <FaCheck className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setSelectedUserForAction({ user: u, action: 'block' })}
              className="p-1.5 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
              title="Block User"
            >
              <FaBan className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered reviewers, account permissions, activity tracking, and access enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <FaFileCsv className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Reviewers</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalUsers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FaUsers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Active Members</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FaUserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Blocked Accounts</p>
            <p className="text-2xl font-bold text-rose-700 mt-1">{blockedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <FaUserSlash className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'ACTIVE', 'BLOCKED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === tab
                ? 'bg-[#1b3b2b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'ALL' ? 'All Accounts' : tab === 'ACTIVE' ? 'Active' : 'Blocked'}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchKey={(u) => `${u.name} ${u.phone} ${u.email || ''}`}
        searchPlaceholder="Search by name, phone, or email..."
        pageSize={8}
      />

      {/* Confirmation Modal */}
      {selectedUserForAction && (
        <ConfirmModal
          isOpen={!!selectedUserForAction}
          onClose={() => setSelectedUserForAction(null)}
          title={selectedUserForAction.action === 'block' ? 'Block User Account' : 'Unblock User Account'}
          message={
            selectedUserForAction.action === 'block'
              ? `Are you sure you want to block ${selectedUserForAction.user.name}? This user will not be able to log in or submit product inquiries.`
              : `Are you sure you want to unblock ${selectedUserForAction.user.name}? Their access to ProductPerks will be restored.`
          }
          confirmLabel={selectedUserForAction.action === 'block' ? 'Block Account' : 'Unblock Account'}
          isDestructive={selectedUserForAction.action === 'block'}
          onConfirm={() => {
            if (selectedUserForAction.action === 'block') {
              blockUser(selectedUserForAction.user.id);
              showToast(`Account ${selectedUserForAction.user.name} has been blocked.`);
            } else {
              unblockUser(selectedUserForAction.user.id);
              showToast(`Account ${selectedUserForAction.user.name} has been unblocked.`);
            }
          }}
        />
      )}

    </div>
  );
}
