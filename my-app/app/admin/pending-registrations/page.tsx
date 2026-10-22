'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  FaClock, 
  FaUserCheck, 
  FaUserXmark, 
  FaEye, 
  FaCheck, 
  FaBan, 
  FaMagnifyingGlass, 
  FaRotateRight, 
  FaEnvelope, 
  FaPhone, 
  FaLocationDot, 
  FaAmazon, 
  FaPaypal, 
  FaCamera, 
  FaTriangleExclamation,
  FaShieldHalved,
  FaArrowUpRightFromSquare,
  FaXmark,
  FaUser
} from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { User, maskPhone } from '@/app/types';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { getSocket, API_BASE_URL } from '@/lib/socket';

export default function AdminPendingRegistrationsPage() {
  const { user: currentAdmin, getAuthHeaders } = useAuth();
  const { showToast } = useApp();

  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'ALL' | 'ACTIVE' | 'REJECTED'>('PENDING');

  // Modal States
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);
  const [userToReject, setUserToReject] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Identity verification criteria not met');
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Fetch pending registrations from backend
  const fetchPendingRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const queryParam = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const res = await fetch(`${API_BASE_URL}/users/pending?${queryParam.toString()}`, {
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        setPendingUsers(data.users || []);
        setTotal(data.total || 0);
      } else {
        showToast('Failed to load pending registrations.');
      }
    } catch (err: any) {
      showToast('Error connecting to backend API.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, getAuthHeaders, showToast]);

  useEffect(() => {
    fetchPendingRegistrations();
  }, [fetchPendingRegistrations]);

  // Socket.IO real-time listener for incoming registrations & status updates
  useEffect(() => {
    const socket = getSocket();

    const handleNewRegistration = (newUser: any) => {
      showToast(`🔔 New registration submitted: ${newUser.name || 'Reviewer'}`);
      fetchPendingRegistrations();
    };

    const handleApproved = (data: any) => {
      setPendingUsers((prev) => prev.filter((u) => u.id !== data.userId));
      setTotal((t) => Math.max(0, t - 1));
    };

    const handleRejected = (data: any) => {
      setPendingUsers((prev) => prev.filter((u) => u.id !== data.userId));
      setTotal((t) => Math.max(0, t - 1));
    };

    socket.on('registration:pending', handleNewRegistration);
    socket.on('registration:approved', handleApproved);
    socket.on('registration:rejected', handleRejected);

    return () => {
      socket.off('registration:pending', handleNewRegistration);
      socket.off('registration:approved', handleApproved);
      socket.off('registration:rejected', handleRejected);
    };
  }, [fetchPendingRegistrations, showToast]);

  // Handle Approve Action
  const handleConfirmApprove = async () => {
    if (!userToApprove) return;
    setIsActionLoading(true);

    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/users/${userToApprove.id}/approve`, {
        method: 'PATCH',
        headers,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Registration approved for ${userToApprove.name}!`);
        // Remove from list or update
        setPendingUsers((prev) => prev.filter((u) => u.id !== userToApprove.id));
        setTotal((t) => Math.max(0, t - 1));
        setUserToApprove(null);
        if (selectedUserForDetails?.id === userToApprove.id) {
          setSelectedUserForDetails(null);
        }
      } else {
        showToast(data.message || 'Approval failed.');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error approving user.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Reject Action
  const handleConfirmReject = async () => {
    if (!userToReject) return;
    setIsActionLoading(true);

    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/users/${userToReject.id}/reject`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason: rejectionReason.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Registration for ${userToReject.name} was rejected.`);
        setPendingUsers((prev) => prev.filter((u) => u.id !== userToReject.id));
        setTotal((t) => Math.max(0, t - 1));
        setUserToReject(null);
        setRejectionReason('Identity verification criteria not met');
        if (selectedUserForDetails?.id === userToReject.id) {
          setSelectedUserForDetails(null);
        }
      } else {
        showToast(data.message || 'Rejection failed.');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error rejecting user.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Table Columns
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={u.selfieImage || u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
              alt={u.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
            />
            {u.selfieImage && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-2xs" title="Live Selfie Photo Available">
                <FaCamera className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{u.name}</p>
            <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <FaPhone className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span>{maskPhone(u.phone)}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: true,
      render: (u) => (
        <div className="text-xs text-slate-700 flex items-center gap-1.5 font-medium truncate max-w-[200px]">
          <FaEnvelope className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{u.email || 'None provided'}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registration Date',
      sortable: true,
      render: (u) => (
        <div className="text-xs text-slate-600">
          <p className="font-semibold text-slate-800">{formatDate(u.createdAt)}</p>
          <span className="text-[10px] text-slate-400">Awaiting approval</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role / Type',
      render: (u) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {u.role?.toUpperCase() || 'CLIENT'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>PENDING</span>
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Review Actions',
      render: (u) => (
        <div className="flex items-center gap-1.5">
          {/* View Details */}
          <button
            onClick={() => setSelectedUserForDetails(u)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="View Registration Details"
          >
            <FaEye className="w-4 h-4" />
          </button>

          {/* Approve Button */}
          <button
            onClick={() => setUserToApprove(u)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            title="Approve User Registration"
          >
            <FaCheck className="w-3 h-3" />
            <span>Approve</span>
          </button>

          {/* Reject Button */}
          <button
            onClick={() => setUserToReject(u)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
            title="Reject Registration"
          >
            <FaBan className="w-3 h-3" />
            <span>Reject</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pending Registrations
            </h1>
            {total > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-2xs animate-pulse">
                {total} Awaiting
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review new applicant accounts, inspect identity selfies, and grant or deny platform access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchPendingRegistrations()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <FaRotateRight className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 bg-[#1b3b2b] hover:bg-[#142e20] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <FaUserCheck className="w-3.5 h-3.5" />
            <span>All Active Users</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200/90 p-4 shadow-2xs flex items-center justify-between bg-gradient-to-r from-amber-50/40 to-white">
          <div>
            <p className="text-[11px] text-amber-800 font-semibold uppercase">Awaiting Admin Review</p>
            <p className="text-2xl font-black text-amber-900 mt-1">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <FaClock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Security Rule</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Backend Enforced</p>
            <p className="text-[10px] text-slate-400">Tokens blocked until approved</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FaShieldHalved className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Review Queue Status</p>
            <p className="text-xs font-bold text-emerald-800 mt-1">
              {total === 0 ? 'Queue Clear' : 'Action Required'}
            </p>
            <p className="text-[10px] text-slate-400">Socket.IO real-time active</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${total === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <FaUserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search pending registrations by applicant name, email, or USA phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b2b]/15 focus:border-[#1b3b2b] font-medium shadow-2xs"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={pendingUsers}
          searchKey="name"
          searchPlaceholder="Filter listed users..."
        />
        {pendingUsers.length === 0 && !isLoading && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <FaCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Pending Registrations</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All registered reviewer accounts have been reviewed and processed. New signups will appear here automatically.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW REGISTRATION DETAILS                         */}
      {/* ========================================================= */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  PENDING REVIEW
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  Applicant Profile Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            {/* Selfie Section */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <FaCamera className="w-3.5 h-3.5 text-emerald-700" />
                Live Camera Selfie Verification:
              </p>
              {selectedUserForDetails.selfieImage ? (
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video max-h-56 flex items-center justify-center">
                  <img
                    src={selectedUserForDetails.selfieImage}
                    alt={selectedUserForDetails.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform cursor-pointer"
                    onClick={() => setZoomedImage(selectedUserForDetails.selfieImage!)}
                  />
                  <div 
                    onClick={() => setZoomedImage(selectedUserForDetails.selfieImage!)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold cursor-pointer"
                  >
                    <FaEye className="w-4 h-4" />
                    <span>Click to Zoom</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-slate-400">
                  No selfie photograph provided
                </div>
              )}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Full Name</p>
                <p className="font-bold text-slate-900 mt-0.5">{selectedUserForDetails.name}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">USA Phone Number</p>
                <p className="font-bold text-slate-900 mt-0.5">{selectedUserForDetails.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Gmail / Email</p>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{selectedUserForDetails.email || 'None'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <FaLocationDot className="w-3 h-3 text-emerald-700" />
                  Address & City
                </p>
                <p className="font-medium text-slate-800 mt-0.5">
                  {selectedUserForDetails.address ? `${selectedUserForDetails.address}, ` : ''}{selectedUserForDetails.city || 'New York, USA'}
                </p>
              </div>

              {/* Amazon Profile URL */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 sm:col-span-2">
                <p className="text-[10px] uppercase font-bold text-amber-900 flex items-center gap-1">
                  <FaAmazon className="w-3 h-3 text-amber-700" />
                  Amazon Reviewer Profile
                </p>
                {selectedUserForDetails.amazonProfileUrl ? (
                  <a
                    href={selectedUserForDetails.amazonProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 underline hover:text-amber-700 truncate max-w-full"
                  >
                    <span className="truncate">{selectedUserForDetails.amazonProfileUrl}</span>
                    <FaArrowUpRightFromSquare className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <p className="text-slate-400 mt-0.5 italic">Not submitted at registration</p>
                )}
              </div>

              {/* PayPal Email */}
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 sm:col-span-2">
                <p className="text-[10px] uppercase font-bold text-blue-900 flex items-center gap-1">
                  <FaPaypal className="w-3 h-3 text-blue-700" />
                  PayPal Payout Email
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedUserForDetails.paypalEmail || 'Not submitted'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2 text-[11px] text-slate-500">
                <span>Registration Date: <strong>{formatDate(selectedUserForDetails.createdAt)}</strong></span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserToReject(selectedUserForDetails);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserToApprove(selectedUserForDetails);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs transition-colors cursor-pointer"
              >
                Approve Registration
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CONFIRM APPROVAL MODAL                            */}
      {/* ========================================================= */}
      {userToApprove && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setUserToApprove(null)}
          onConfirm={handleConfirmApprove}
          title="Approve Registration?"
          message={`Are you sure you want to approve ${userToApprove.name}'s registration? Their account will be activated immediately and they will be able to sign in and claim products.`}
          confirmLabel="Yes, Approve Account"
          isDestructive={false}
          isLoading={isActionLoading}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CONFIRM REJECTION MODAL WITH REASON               */}
      {/* ========================================================= */}
      {userToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <FaTriangleExclamation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Reject Registration</h3>
                  <p className="text-xs text-slate-500">Applicant: <strong>{userToReject.name}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setUserToReject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please provide a reason for rejecting this registration. The reason will be recorded and displayed to the user.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Rejection Reason:</label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Identity verification criteria not met">Identity verification criteria not met</option>
                <option value="Selfie photograph does not match or is blurry">Selfie photograph does not match or is blurry</option>
                <option value="Amazon profile URL is invalid or inaccessible">Amazon profile URL is invalid or inaccessible</option>
                <option value="Applicant must reside within the United States">Applicant must reside within the United States</option>
                <option value="Duplicate account detected">Duplicate account detected</option>
                <option value="Custom">Custom Reason (Type below)...</option>
              </select>

              {rejectionReason === 'Custom' && (
                <textarea
                  rows={3}
                  placeholder="Type specific rejection reason..."
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white mt-2 focus:ring-2 focus:ring-rose-500/20"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setUserToReject(null)}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
              >
                {isActionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: IMAGE ZOOM VIEWER                                 */}
      {/* ========================================================= */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Verification Zoom"
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg font-bold"
            >
              <FaXmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
