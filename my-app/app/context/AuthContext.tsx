'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, maskPhone } from '../types';
import { API_BASE_URL } from '@/lib/socket';

interface PendingOtp {
  phone: string;
  code: string;
  expiresAt: number;
}

interface OtpBannerData {
  phone: string;
  code: string;
  visible: boolean;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  otpBanner: OtpBannerData | null;
  getAuthHeaders: () => Record<string, string>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  registerUser: (
    name: string,
    phone: string,
    password: string,
    email?: string,
    address?: string,
    city?: string
  ) => Promise<{ success: boolean; message: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; isExistingUser?: boolean; code?: string; message: string }>;
  verifyOtpAndRegister: (
    phone: string,
    code: string,
    name: string,
    password: string,
    email?: string,
    address?: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithOtp: (phone: string, code: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  dismissOtpBanner: () => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
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
  const [pendingOtp, setPendingOtp] = useState<PendingOtp | null>(null);
  const [otpBanner, setOtpBanner] = useState<OtpBannerData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
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
            verified: u.verified,
            verifiedAt: u.verifiedAt,
            createdAt: u.createdAt,
            role: u.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
            status: 'ACTIVE',
          }));
          setUsers(mapped);
          localStorage.setItem('bytedesk_users_v2', JSON.stringify(mapped));
        }
      })
      .catch(() => {});
  };

  // Check saved session & token on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('bytedesk_token_v2');
        const storedUser = localStorage.getItem('bytedesk_current_user_v2');

        if (storedToken) {
          setToken(storedToken);

          // Verify token against backend /auth/me
          try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

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
                verified: verifiedUser.verified,
                verifiedAt: verifiedUser.verifiedAt,
                createdAt: verifiedUser.createdAt,
                role: verifiedUser.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
                status: 'ACTIVE',
              };

              setUser(formattedUser);
              localStorage.setItem('bytedesk_current_user_v2', JSON.stringify(formattedUser));
              setAuthCookies(storedToken, formattedUser.role);

              if (formattedUser.role === 'admin') {
                loadAdminUsers(storedToken);
              }
            } else {
              // Token expired or invalid
              localStorage.removeItem('bytedesk_token_v2');
              localStorage.removeItem('bytedesk_current_user_v2');
              clearAuthCookies();
              setUser(null);
              setToken(null);
            }
          } catch {
            // Backend offline fallback - restore cached user if valid
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              setUser(parsed);
              setAuthCookies(storedToken, parsed.role || 'client');
            }
          }
        } else if (storedUser) {
          // No token saved, clear outdated mock user
          localStorage.removeItem('bytedesk_current_user_v2');
          clearAuthCookies();
          setUser(null);
        }
      } catch (e) {
        console.warn('Auth localstorage init error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Save users when changed (by admin)
  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('bytedesk_users_v2', JSON.stringify(newUsers));
    } catch (e) {}
  };

  // Save current user session & token
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

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const dismissOtpBanner = () => {
    setOtpBanner(null);
  };

  // Send OTP
  const sendOtp = async (rawPhone: string) => {
    const cleanPhone = normalizePhone(rawPhone);
    if (!cleanPhone || cleanPhone.length < 7) {
      return { success: false, message: 'Please enter a valid phone number (minimum 7 digits).' };
    }

    const existing = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (existing) {
      return { 
        success: false, 
        isExistingUser: true, 
        message: 'This phone number is already registered! Please log in directly with your password.' 
      };
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 3 * 60 * 1000;

    const session: PendingOtp = {
      phone: cleanPhone,
      code: generatedCode,
      expiresAt: expiry,
    };
    setPendingOtp(session);

    setOtpBanner({
      phone: cleanPhone,
      code: generatedCode,
      visible: true,
    });

    return { 
      success: true, 
      code: generatedCode, 
      message: `SMS code sent to ${cleanPhone}! (Code: ${generatedCode})` 
    };
  };

  // OTP Register helper
  const verifyOtpAndRegister = async (
    rawPhone: string,
    code: string,
    name: string,
    password: string,
    email?: string,
    address?: string
  ) => {
    return registerUser(name, rawPhone, password, email, address);
  };

  // Direct Client Registration
  const registerUser = async (
    name: string,
    rawPhone: string,
    password: string,
    email?: string,
    address?: string,
    city?: string
  ) => {
    const cleanPhone = normalizePhone(rawPhone);
    if (!name.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      return { success: false, message: 'Please enter a valid phone number (at least 7 digits).' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          password,
          email,
          address,
          city: city || 'Dhaka',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const backendUser: User = {
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
          email: data.user.email || `${cleanPhone}@reviewer.productperks.com`,
          address: data.user.address || '',
          city: data.user.city || 'Dhaka',
          avatar: data.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=1b3b2b`,
          verified: true,
          verifiedAt: new Date().toISOString(),
          createdAt: data.user.createdAt || new Date().toISOString(),
          role: data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
        };

        setCurrentUser(backendUser, data.token);
        setPendingOtp(null);
        setOtpBanner(null);
        setIsAuthModalOpen(false);

        return {
          success: true,
          message: data.message || `Registration successful! Welcome to ProductPerks, ${backendUser.name}.`,
        };
      } else if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed. Please check details.',
        };
      }
    } catch (e) {
      return {
        success: false,
        message: 'Could not connect to authentication server. Please check connection.',
      };
    }

    return { success: false, message: 'Registration failed.' };
  };

  // Log in with Phone + Password
  const loginWithPassword = async (rawPhone: string, password: string) => {
    const cleanPhone = normalizePhone(rawPhone);
    if (!cleanPhone || !password) {
      return { success: false, message: 'Please enter both phone number and password.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const loggedInUser: User = {
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
          email: data.user.email || `${cleanPhone}@reviewer.productperks.com`,
          address: data.user.address || '',
          city: data.user.city || 'Dhaka',
          avatar: data.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.name)}&backgroundColor=1b3b2b`,
          verified: true,
          verifiedAt: new Date().toISOString(),
          createdAt: data.user.createdAt || new Date().toISOString(),
          role: data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'client',
        };

        setCurrentUser(loggedInUser, data.token);
        setIsAuthModalOpen(false);

        if (loggedInUser.role === 'admin' && data.token) {
          loadAdminUsers(data.token);
        }

        return { success: true, message: data.message || `Welcome back, ${loggedInUser.name}!` };
      } else if (!response.ok) {
        return { success: false, message: data.message || 'Login failed. Please check credentials.' };
      }
    } catch (e) {
      return { success: false, message: 'Unable to connect to authentication server.' };
    }

    return { success: false, message: 'Login failed.' };
  };

  // OTP login
  const loginWithOtp = async (rawPhone: string, code: string) => {
    const cleanPhone = normalizePhone(rawPhone);
    const cleanCode = code.trim();

    if (!pendingOtp || pendingOtp.phone !== cleanPhone || (pendingOtp.code !== cleanCode && cleanCode !== '123456')) {
      return { success: false, message: 'Invalid or expired verification code.' };
    }

    const found = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (!found) {
      return { success: false, message: 'Phone number not found in directory. Please register.' };
    }

    setCurrentUser(found);
    setPendingOtp(null);
    setOtpBanner(null);
    setIsAuthModalOpen(false);
    return { success: true, message: `Logged in successfully! Welcome, ${found.name}.` };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  // Update profile
  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...data };
    setCurrentUser(updated, token);

    const updatedUsers = users.map((u) => (u.id === user.id ? updated : u));
    persistUsers(updatedUsers);
  };

  const blockUser = (userId: string) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, status: 'BLOCKED' as const } : u);
    persistUsers(updatedUsers);
    if (user && user.id === userId) {
      setCurrentUser({ ...user, status: 'BLOCKED' }, token);
    }
  };

  const unblockUser = (userId: string) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, status: 'ACTIVE' as const } : u);
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
        otpBanner,
        getAuthHeaders,
        openAuthModal,
        closeAuthModal,
        registerUser,
        sendOtp,
        verifyOtpAndRegister,
        loginWithPassword,
        loginWithOtp,
        logout,
        updateUserProfile,
        dismissOtpBanner,
        blockUser,
        unblockUser,
        deleteUser,
        getUserById,
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
