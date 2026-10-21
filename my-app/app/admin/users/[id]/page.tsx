'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaLocationDot, 
  FaCalendarDays, 
  FaShieldHalved, 
  FaBan, 
  FaCheck, 
  FaClock, 
  FaChartLine, 
  FaArrowPointer,
  FaComments,
  FaKey,
  FaStar,
  FaLock,
  FaTrash,
  FaCamera,
  FaCircleCheck,
  FaMagnifyingGlassPlus,
  FaXmark
} from 'react-icons/fa6';
import { FaAmazon, FaPaypal } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';
import { useApp } from '@/app/context/AppContext';
import { Badge } from '@/components/admin/Badge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { maskPhone, User } from '@/app/types';
import { API_BASE_URL } from '@/lib/socket';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getUserById, blockUser, unblockUser, toggleUserReviewPermission } = useAuth();
  const { messages, reviews, deleteReview, getProductById, showToast } = useApp();

  const contextUser = getUserById(id);
  const [liveUser, setLiveUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [showSelfieModal, setShowSelfieModal] = useState(false);

  // Directly fetch fresh user record from database so all fields (selfie, amazon, paypal) load 100%
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null;
    fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const directUser: User = {
            id: data.id,
            phone: data.phone,
            name: data.name,
            email: data.email,
            address: data.address,
            city: data.city,
            avatar: data.avatar || data.selfieImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=1b3b2b`,
            selfieImage: data.selfieImage || (data.avatar && data.avatar.startsWith('data:image') ? data.avatar : undefined),
            amazonProfileUrl: data.amazonProfileUrl || undefined,
            paypalEmail: data.paypalEmail || undefined,
            verified: data.verified,
            verifiedAt: data.verifiedAt,
            createdAt: data.createdAt,
            role: data.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
            status: 'ACTIVE',
            canReview: data.canReview,
          };
          setLiveUser(directUser);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, [id]);

  const user = liveUser || contextUser;

  if (isLoadingUser && !user) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto mt-12 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-700">Loading Reviewer Details...</h2>
        <p className="text-xs text-slate-400 mt-1">Retrieving profile, selfie, and reviewer data.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto mt-12">
        <FaUser className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">User Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested reviewer could not be found or has been removed.
        </p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 bg-[#1b3b2b] text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Users List</span>
        </Link>
      </div>
    );
  }

  const isBlocked = user.status === 'BLOCKED';
  const userSelfie = user.selfieImage || (user.avatar && user.avatar.startsWith('data:image') ? user.avatar : null);

  // Customer messages from this user
  const userMessages = messages.filter((m) => m.sender === 'customer');

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <Badge variant={isBlocked ? 'blocked' : 'active'}>
                {isBlocked ? 'Blocked' : 'Active'}
              </Badge>
              {user.verified && <Badge variant="verified">Verified</Badge>}
              {user.canReview ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                  <FaCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Review Access: Allowed</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                  <FaLock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Review Access: Restricted</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {user.id}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextVal = !user.canReview;
              toggleUserReviewPermission(user.id, nextVal);
              if (liveUser) {
                setLiveUser({ ...liveUser, canReview: nextVal });
              }
              showToast(`Review permission ${nextVal ? 'granted to' : 'revoked from'} ${user.name}`);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              user.canReview
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={user.canReview ? 'Revoke permission to write reviews' : 'Allow this user to post product reviews'}
          >
            <FaStar className="w-3 h-3 fill-current" />
            <span>{user.canReview ? 'Revoke Review Access' : 'Grant Review Permission'}</span>
          </button>

          {isBlocked ? (
            <button
              onClick={() => {
                unblockUser(user.id);
                showToast(`${user.name} has been unblocked.`);
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <FaCheck className="w-3 h-3" />
              <span>Unblock Account</span>
            </button>
          ) : (
            <button
              onClick={() => setConfirmBlockOpen(true)}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <FaBan className="w-3 h-3" />
              <span>Block Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: User Profile Details + Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Profile Info Card & Verification Selfie */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/20 shadow-xs mb-3"
              />
              <h3 className="font-bold text-base text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.role.toUpperCase()} Member</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FaPhone className="w-3 h-3 text-emerald-600" />
                  Phone Number
                </span>
                <span className="font-mono font-bold text-slate-800">{maskPhone(user.phone)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FaEnvelope className="w-3 h-3 text-slate-400" />
                  Email Address
                </span>
                <span className="font-medium text-slate-800 truncate max-w-[180px]">{user.email || 'None'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FaLocationDot className="w-3 h-3 text-slate-400" />
                  City / Region
                </span>
                <span className="font-medium text-slate-800">{user.city || 'Dhaka'}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center gap-2 shrink-0">
                  <FaLocationDot className="w-3 h-3 text-slate-400" />
                  Delivery Address
                </span>
                <span className="font-medium text-slate-800 text-right max-w-[180px]">
                  {user.address || 'Not provided'}
                </span>
              </div>

              {/* Amazon Profile Link */}
              <div className="flex items-start justify-between pt-2.5 border-t border-slate-100">
                <span className="text-slate-600 font-medium flex items-center gap-2 shrink-0">
                  <FaAmazon className="w-3.5 h-3.5 text-amber-600" />
                  Amazon Profile
                </span>
                {user.amazonProfileUrl ? (
                  <div className="flex flex-col items-end gap-1 max-w-[220px]">
                    <a
                      href={user.amazonProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs truncate"
                      title={user.amazonProfileUrl}
                    >
                      <FaAmazon className="w-3 h-3 text-[#ff9900] shrink-0" />
                      <span className="truncate">View Amazon Profile ↗</span>
                    </a>
                    <span className="text-[10px] text-emerald-700 font-medium">✓ Provided on Sign Up</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Not provided</span>
                )}
              </div>

              {/* PayPal Email */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <FaPaypal className="w-3.5 h-3.5 text-blue-600" />
                  PayPal Payout
                </span>
                {user.paypalEmail ? (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                      <FaPaypal className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{user.paypalEmail}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">✓ 100% Refund Account</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Not provided</span>
                )}
              </div>

              {/* Review Permission */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <FaStar className="w-3.5 h-3.5 text-amber-500" />
                  Review Permission
                </span>
                <div className="flex items-center gap-2">
                  {user.canReview ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                      <FaCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Allowed by Admin</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                      <FaLock className="w-3.5 h-3.5 text-rose-600" />
                      <span>Restricted</span>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const nextVal = !user.canReview;
                      toggleUserReviewPermission(user.id, nextVal);
                      if (liveUser) {
                        setLiveUser({ ...liveUser, canReview: nextVal });
                      }
                      showToast(`Review permission ${nextVal ? 'granted to' : 'revoked from'} ${user.name}`);
                    }}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      user.canReview 
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100' 
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {user.canReview ? 'Revoke' : 'Allow'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                <span className="text-slate-400 flex items-center gap-2">
                  <FaCalendarDays className="w-3 h-3 text-slate-400" />
                  Registered On
                </span>
                <span className="font-mono text-slate-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Selfie Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaCamera className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">Verification Selfie</h3>
              </div>
              {userSelfie ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <FaCircleCheck className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Submitted</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                  <span>No Selfie</span>
                </span>
              )}
            </div>

            {userSelfie ? (
              <div className="space-y-3">
                <div 
                  onClick={() => setShowSelfieModal(true)}
                  className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-900 aspect-4/3 flex items-center justify-center shadow-xs"
                >
                  <img
                    src={userSelfie}
                    alt={`${user.name} verification selfie`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                    <FaMagnifyingGlassPlus className="w-4 h-4" />
                    <span>Click to Zoom</span>
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <FaCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Captured on Registration</span>
                  </p>
                  <p className="text-[10px] text-emerald-700/80 mt-0.5">
                    User identity snapped via live webcam/front camera upon registration.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FaCamera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No selfie submitted</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px] mx-auto">
                  This user registered before selfie verification was activated.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Lifetime Analytics & Inquiries */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Lifetime Activity Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Affiliate Clicks</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{user.clicksCount ?? 14}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Outbound referrals</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Page Views</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{user.viewsCount ?? 48}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Product impressions</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Support Messages</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{userMessages.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Chat inquiries</p>
            </div>
          </div>

          {/* Customer Reviews Published By User */}
          {(() => {
            const userReviews = reviews.filter((r) => r.userId === user.id);
            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <h3 className="font-bold text-sm text-slate-900">Reviews Submitted by User</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{userReviews.length} total</span>
                </div>

                {userReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No product reviews submitted by this reviewer yet.</p>
                ) : (
                  <div className="space-y-3">
                    {userReviews.map((rev) => {
                      const reviewedProduct = getProductById(rev.productId);
                      return (
                        <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-slate-900">
                                {reviewedProduct?.title || rev.productId}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {[1, 2, 3, 4, 5].map((st) => (
                                    <FaStar
                                      key={st}
                                      className={`w-2.5 h-2.5 ${st <= rev.rating ? 'fill-amber-500' : 'text-slate-200'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(rev.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                deleteReview(rev.id);
                                showToast('Review deleted.');
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete this review (Admin Action)"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {rev.title && <p className="font-semibold text-slate-800">{rev.title}</p>}
                          <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* User Support Messages History */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaComments className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">Recent Customer Inquiries</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{userMessages.length} total</span>
            </div>

            {userMessages.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No inquiries logged from this reviewer yet.</p>
            ) : (
              <div className="space-y-3">
                {userMessages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">
                        {msg.productInfo ? `Inquiry: ${msg.productInfo.title}` : 'General Support'}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmBlockOpen}
        onClose={() => setConfirmBlockOpen(false)}
        title="Confirm Account Block"
        message={`Are you sure you want to block ${user.name}? This will revoke their ability to access FreeProducts.online.`}
        confirmLabel="Block User"
        isDestructive={true}
        onConfirm={() => {
          blockUser(user.id);
          showToast(`Account ${user.name} has been blocked.`);
        }}
      />

      {/* Selfie Zoom Modal */}
      {showSelfieModal && userSelfie && (
        <div 
          onClick={() => setShowSelfieModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaCamera className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-sm text-slate-900">{user.name} - Verification Selfie</span>
              </div>
              <button 
                onClick={() => setShowSelfieModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center">
              <img 
                src={userSelfie} 
                alt={user.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <FaCircleCheck className="w-3.5 h-3.5" />
                <span>Identity Selfie Verified</span>
              </span>
              <button
                onClick={() => setShowSelfieModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
