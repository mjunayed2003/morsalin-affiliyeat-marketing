'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { API_BASE_URL } from '@/lib/socket';

export type AuthModalMode = 'login' | 'register' | 'forgot-password';

interface AuthContextType {
  user: User | null;
  users: User[];
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  getAuthHeaders: () => Record<string, string>;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  sendRegisterOtp: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    address?: string;
    city?: string;
    amazonProfileUrl?: string;
    paypalEmail?: string;
  }) => Promise<{ success: boolean; message: string; email?: string; phone?: string }>;
  verifyRegisterOtp: (
    email: string,
    code: string,
    selfieImage?: string,
    amazonProfileUrl?: string,
    paypalEmail?: string
  ) => Promise<{ success: boolean; message: string; status?: string; user?: User }>;
  uploadUserSelfie: (selfieImage: string) => Promise<{ success: boolean; message: string }>;
  sendForgotPasswordOtp: (
    email: string
  ) => Promise<{ success: boolean; message: string; email?: string }>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
  toggleUserReviewPermission: (userId: string, allow?: boolean) => void;
  startGuestChat: (name: string, phone: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-()]/g, '').trim();
};

const setAuthCookies = (token: string, role: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `bytedesk_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `bytedesk_role=${encodeURIComponent(role)}; path=/; max-age=604800; SameSite=Lax`;
  }
};

const clearAuthCookies = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'bytedesk_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'bytedesk_role=; path=/; max-age=0; SameSite=Lax';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Return standard auth headers with token
  const getAuthHeaders = (): Record<string, string> => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null);
    if (currentToken) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  };

  // Helper to load users for admins
  const loadAdminUsers = (authToken: string) => {
    fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((backendUsers) => {
        if (Array.isArray(backendUsers)) {
          const mapped: User[] = backendUsers.map((u) => ({
            id: u.id,
            phone: u.phone,
            name: u.name,
            email: u.email,
            address: u.address,
            city: u.city,
            avatar: u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=1b3b2b`,
            selfieImage: u.selfieImage || undefined,
            amazonProfileUrl: u.amazonProfileUrl || undefined,
            paypalEmail: u.paypalEmail || undefined,
            verified: u.verified,
            verifiedAt: u.verifiedAt,
            createdAt: u.createdAt,
            role: u.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
            status: (u.status || 'ACTIVE') as any,
            reviewedAt: u.reviewedAt,
            reviewedBy: u.reviewedBy,
            rejectionReason: u.rejectionReason,
            canReview: u.canReview ?? (u.role?.toLowerCase() === 'admin'),
          }));
          setUsers(mapped);
          localStorage.setItem('bytedesk_users_v2', JSON.stringify(mapped));
        }
      })
      .catch(() => {});
  };

  // Check saved session & token on initial load
  useEffect(() => {
    let activeToken: string | null = null;

    try {
      const storedToken = localStorage.getItem('bytedesk_token_v2');
      const storedUser = localStorage.getItem('bytedesk_current_user_v2');

      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed.id || parsed.phone || parsed.name)) {
            setUser(parsed);
            setToken(storedToken);
            activeToken = storedToken;
            setAuthCookies(storedToken, parsed.role || 'client');

            if (parsed.role?.toLowerCase() === 'admin') {
              loadAdminUsers(storedToken);
            }
          }
        } catch (err) {
          console.warn('Auth cached user parse error:', err);
        }
      } else if (storedToken) {
        setToken(storedToken);
        activeToken = storedToken;
      } else if (storedUser) {
        localStorage.removeItem('bytedesk_current_user_v2');
        clearAuthCookies();
        setUser(null);
      }

      // Initialize users from storage if available
      const storedUsers = localStorage.getItem('bytedesk_users_v2');
      if (storedUsers) {
        try {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
          } else {
            setUsers([]);
          }
        } catch {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.warn('Auth localstorage init error:', e);
    } finally {
      // Local storage restore is synchronous and immediate (0ms) - UI is never blocked!
      setIsLoading(false);
    }

    // Verify token with backend /auth/me in background without blocking UI
    if (activeToken) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
        .then(async (res) => {
          if (res.ok) {
            const verifiedUser = await res.json();
            const formattedUser: User = {
              id: verifiedUser.id,
              phone: verifiedUser.phone,
              name: verifiedUser.name,
              email: verifiedUser.email,
              address: verifiedUser.address,
              city: verifiedUser.city,
              avatar: verifiedUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(verifiedUser.name)}&backgroundColor=1b3b2b`,
              selfieImage: verifiedUser.selfieImage || undefined,
              amazonProfileUrl: verifiedUser.amazonProfileUrl || undefined,
              paypalEmail: verifiedUser.paypalEmail || undefined,
              verified: verifiedUser.verified,
              verifiedAt: verifiedUser.verifiedAt,
              createdAt: verifiedUser.createdAt || new Date().toISOString(),
              role: verifiedUser.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
              status: (verifiedUser.status || 'ACTIVE') as any,
              reviewedAt: verifiedUser.reviewedAt,
              reviewedBy: verifiedUser.reviewedBy,
              rejectionReason: verifiedUser.rejectionReason,
              canReview: verifiedUser.canReview ?? (verifiedUser.role?.toLowerCase() === 'admin'),
            };

            // Non-admin accounts must be ACTIVE
            if (formattedUser.role !== 'admin' && formattedUser.status !== 'ACTIVE') {
              localStorage.removeItem('bytedesk_token_v2');
              localStorage.removeItem('bytedesk_current_user_v2');
              clearAuthCookies();
              setUser(null);
              setToken(null);
              return;
            }

            setUser(formattedUser);
            localStorage.setItem('bytedesk_current_user_v2', JSON.stringify(formattedUser));
            setAuthCookies(activeToken!, formattedUser.role);

            if (formattedUser.role === 'admin') {
              loadAdminUsers(activeToken!);
            }
          } else if (res.status === 401 || res.status === 403) {
            // Token is explicitly expired or invalid on server
            localStorage.removeItem('bytedesk_token_v2');
            localStorage.removeItem('bytedesk_current_user_v2');
            clearAuthCookies();
            setUser(null);
            setToken(null);
          }
        })
        .catch((err) => {
          // Network error or offline: Keep local authenticated session intact
          console.warn('Backend /auth/me check failed (offline/network):', err);
        });
    }
  }, []);

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('bytedesk_users_v2', JSON.stringify(newUsers));
    } catch (e) {}
  };

  const setCurrentUser = (usr: User | null, authToken?: string | null) => {
    setUser(usr);
    try {
      if (usr) {
        localStorage.setItem('bytedesk_current_user_v2', JSON.stringify(usr));
        if (authToken) {
          setToken(authToken);
          localStorage.setItem('bytedesk_token_v2', authToken);
          setAuthCookies(authToken, usr.role);
        }
      } else {
        localStorage.removeItem('bytedesk_current_user_v2');
        localStorage.removeItem('bytedesk_token_v2');
        clearAuthCookies();
        setToken(null);
      }
    } catch (e) {}
  };

  const openAuthModal = (mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };


  /**
   * STEP 1: Send Registration OTP to Gmail
   */
  const sendRegisterOtp = async (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    address?: string;
    city?: string;
    amazonProfileUrl?: string;
    paypalEmail?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-register-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: resData.message || 'Failed to send verification code. Please check your details.',
        };
      }

      return {
        success: true,
        message: resData.message || 'Verification code sent to your email.',
        email: resData.email,
        phone: resData.phone,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error connecting to verification server.',
      };
    }
  };

  /**
   * STEP 2: Verify Registration OTP and Complete Sign Up
   */
  const verifyRegisterOtp = async (
    email: string, 
    code: string, 
    selfieImage?: string,
    amazonProfileUrl?: string,
    paypalEmail?: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-register-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, selfieImage, amazonProfileUrl, paypalEmail }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const userStatus = data.user.status || data.status || 'PENDING';
        const backendUser: User = {
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
          email: data.user.email,
          address: data.user.address || '',
          city: data.user.city || 'New York',
          avatar: data.user.avatar || selfieImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.name)}&backgroundColor=1b3b2b`,
          selfieImage: data.user.selfieImage || selfieImage,
          amazonProfileUrl: data.user.amazonProfileUrl || amazonProfileUrl,
          paypalEmail: data.user.paypalEmail || paypalEmail,
          verified: true,
          verifiedAt: new Date().toISOString(),
          createdAt: data.user.createdAt || new Date().toISOString(),
          role: data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
          status: userStatus,
        };

        // Approval workflow: PENDING accounts are not issued session tokens
        if (userStatus === 'PENDING') {
          try {
            sessionStorage.setItem(
              'freeproducts_pending_registration',
              JSON.stringify({
                name: backendUser.name,
                email: backendUser.email,
                phone: backendUser.phone,
                createdAt: backendUser.createdAt,
              })
            );
          } catch {}

          setIsAuthModalOpen(false);

          return {
            success: true,
            status: 'PENDING',
            message: data.message || 'Your registration has been submitted and is awaiting admin review.',
            user: backendUser,
          };
        }

        setCurrentUser(backendUser, data.token);
        setIsAuthModalOpen(false);

        return {
          success: true,
          status: 'ACTIVE',
          message: data.message || `Welcome to FreeProducts.online, ${backendUser.name}!`,
          user: backendUser,
        };
      }

      return {
        success: false,
        message: data.message || 'Invalid or expired OTP code.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Could not verify code. Please try again.',
      };
    }
  };

  /**
   * FORGOT PASSWORD - STEP 1: Send Reset OTP to Email
   */
  const sendForgotPasswordOtp = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Could not send reset code.',
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset code sent to your email.',
        email: data.email,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Unable to connect to server.',
      };
    }
  };

  /**
   * FORGOT PASSWORD - STEP 2: Verify OTP and Reset Password
   */
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to reset password.',
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset successfully! Please log in.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Error communicating with server.',
      };
    }
  };


  // Log in with USA Phone OR Email + Password
  const loginWithPassword = async (phoneOrEmail: string, password: string) => {
    const input = phoneOrEmail.trim();
    if (!input || !password) {
      return { success: false, message: 'Please enter both your phone/email and password.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneOrEmail: input,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const loggedInUser: User = {
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
          email: data.user.email || `${input}@reviewer.freeproducts.online`,
          address: data.user.address || '',
          city: data.user.city || 'New York',
          avatar: data.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.name)}&backgroundColor=1b3b2b`,
          selfieImage: data.user.selfieImage || undefined,
          amazonProfileUrl: data.user.amazonProfileUrl || undefined,
          paypalEmail: data.user.paypalEmail || undefined,
          verified: true,
          verifiedAt: new Date().toISOString(),
          createdAt: data.user.createdAt || new Date().toISOString(),
          role: data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
          canReview: data.user.canReview ?? (data.user.role?.toLowerCase() === 'admin'),
        };

        setCurrentUser(loggedInUser, data.token);
        setIsAuthModalOpen(false);

        if (loggedInUser.role === 'admin' && data.token) {
          loadAdminUsers(data.token);
        }

        return { success: true, message: data.message || `Welcome back, ${loggedInUser.name}!` };
      } else {
        return { success: false, message: data.message || 'Login failed. Please check credentials.' };
      }
    } catch (e: any) {
      return { success: false, message: e.message || 'Unable to connect to authentication server.' };
    }
  };


  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...data };
    setCurrentUser(updated, token);
    const updatedUsers = users.map((u) => (u.id === user.id ? updated : u));
    persistUsers(updatedUsers);
  };

  const uploadUserSelfie = async (selfieImage: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'You must be logged in to upload a selfie.' };
    }
    const updatedUser: User = { ...user, selfieImage, avatar: selfieImage };
    setCurrentUser(updatedUser, token);
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    persistUsers(updatedUsers);

    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null);
    if (currentToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${user.id}/selfie`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ selfieImage }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, message: data.message || 'Failed to update selfie on server' };
        }
        return { success: true, message: 'Selfie uploaded successfully!' };
      } catch {
        return { success: true, message: 'Selfie saved locally.' };
      }
    }
    return { success: true, message: 'Selfie saved.' };
  };

  const blockUser = (userId: string) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, status: 'BLOCKED' as const } : u));
    persistUsers(updatedUsers);
    if (user && user.id === userId) {
      setCurrentUser({ ...user, status: 'BLOCKED' }, token);
    }
  };

  const unblockUser = (userId: string) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE' as const } : u));
    persistUsers(updatedUsers);
    if (user && user.id === userId) {
      setCurrentUser({ ...user, status: 'ACTIVE' }, token);
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    persistUsers(updatedUsers);
    if (user && user.id === userId) {
      logout();
    }
  };

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  const toggleUserReviewPermission = (userId: string, allow?: boolean) => {
    let newStatus = false;
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        newStatus = typeof allow === 'boolean' ? allow : !u.canReview;
        return { ...u, canReview: newStatus };
      }
      return u;
    });
    persistUsers(updatedUsers);

    if (user && user.id === userId) {
      const updatedCurrentUser: User = { ...user, canReview: newStatus };
      setCurrentUser(updatedCurrentUser, token);
    }

    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bytedesk_token_v2') : null);
    if (currentToken) {
      fetch(`${API_BASE_URL}/users/${userId}/review-permission`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ canReview: newStatus }),
      }).catch(() => {});
    }
  };

  const startGuestChat = async (name: string, phone: string) => {
    try {
      const cleanName = name.trim();
      const cleanPhone = phone.trim();
      if (!cleanName) return { success: false, message: 'Please enter your name.' };
      if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 6) {
        return { success: false, message: 'Please enter a valid phone number (at least 6 digits).' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, phone: cleanPhone }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const guestUserObj: User = {
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
          email: data.user.email || `${cleanPhone}@guest.freeproducts.online`,
          address: data.user.address || '',
          city: data.user.city || 'Dhaka',
          avatar: data.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1b3b2b`,
          verified: false,
          verifiedAt: data.user.verifiedAt || undefined,
          createdAt: new Date().toISOString(),
          role: 'client',
          canReview: false,
        };

        setCurrentUser(guestUserObj, data.token);
        return { success: true, message: data.message || 'Chat profile ready!' };
      } else {
        const fallbackId = `guest_${Date.now()}`;
        const fallbackUser: User = {
          id: fallbackId,
          phone: cleanPhone,
          name: cleanName,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1b3b2b`,
          verified: false,
          verifiedAt: undefined,
          createdAt: new Date().toISOString(),
          role: 'client',
          canReview: false,
        };
        setCurrentUser(fallbackUser, null);
        return { success: true, message: 'Welcome to chat support!' };
      }
    } catch (err: any) {
      const fallbackId = `guest_${Date.now()}`;
      const fallbackUser: User = {
        id: fallbackId,
        phone: phone.trim(),
        name: name.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=1b3b2b`,
        verified: false,
        verifiedAt: undefined,
        createdAt: new Date().toISOString(),
        role: 'client',
        canReview: false,
      };
      setCurrentUser(fallbackUser, null);
      return { success: true, message: 'Welcome to chat support!' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        isAuthModalOpen,
        authModalMode,
        getAuthHeaders,
        openAuthModal,
        closeAuthModal,
        sendRegisterOtp,
        verifyRegisterOtp,
        sendForgotPasswordOtp,
        resetPassword,
        loginWithPassword,
        logout,
        updateUserProfile,
        blockUser,
        unblockUser,
        deleteUser,
        getUserById,
        toggleUserReviewPermission,
        startGuestChat,
        uploadUserSelfie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
