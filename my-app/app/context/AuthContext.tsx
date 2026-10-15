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
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  otpBanner: OtpBannerData | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingOtp, setPendingOtp] = useState<PendingOtp | null>(null);
  const [otpBanner, setOtpBanner] = useState<OtpBannerData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Load registered users and current user session from LocalStorage
  useEffect(() => {
    try {
      // 1. Fetch real users from Backend API (PostgreSQL database)
      fetch(`${API_BASE_URL}/users`)
        .then((res) => res.json())
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
        .catch(() => {
          const storedUsers = localStorage.getItem('bytedesk_users_v2');
          if (storedUsers) {
            try {
              const parsed = JSON.parse(storedUsers);
              if (Array.isArray(parsed)) {
                setUsers(parsed);
              }
            } catch (e) {}
          }
        });

      const activeUser = localStorage.getItem('bytedesk_current_user_v2');
      if (activeUser) {
        const parsedActive = JSON.parse(activeUser);
        if (
          parsedActive?.id === 'client-morsalin-1' ||
          parsedActive?.email === 'morsalin@bytedesk.io' ||
          parsedActive?.phone?.includes('*')
        ) {
          localStorage.removeItem('bytedesk_current_user_v2');
          setUser(null);
        } else {
          setUser(parsedActive);
        }
      }
    } catch (e) {
      console.warn('Auth localstorage error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save users when changed
  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('bytedesk_users_v2', JSON.stringify(newUsers));
    } catch (e) {}
  };

  // Save current user session
  const setCurrentUser = (usr: User | null) => {
    setUser(usr);
    try {
      if (usr) {
        localStorage.setItem('bytedesk_current_user_v2', JSON.stringify(usr));
      } else {
        localStorage.removeItem('bytedesk_current_user_v2');
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

  // Send OTP (Verification code) for first time client registration
  const sendOtp = async (rawPhone: string) => {
    const cleanPhone = normalizePhone(rawPhone);
    if (!cleanPhone || cleanPhone.length < 7) {
      return { success: false, message: 'Please enter a valid phone number (minimum 7 digits).' };
    }

    // Check if phone number is already registered
    const existing = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (existing) {
      return { 
        success: false, 
        isExistingUser: true, 
        message: 'This phone number is already registered! Please log in directly with your password.' 
      };
    }

    // Generate random 6-digit code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 3 * 60 * 1000; // 3 minutes

    const session: PendingOtp = {
      phone: cleanPhone,
      code: generatedCode,
      expiresAt: expiry
    };
    setPendingOtp(session);

    // Show simulated SMS notification banner
    setOtpBanner({
      phone: cleanPhone,
      code: generatedCode,
      visible: true
    });

    return { 
      success: true, 
      code: generatedCode, 
      message: `SMS code sent to ${cleanPhone}! (Code: ${generatedCode})` 
    };
  };

  // First time client: Verify OTP and Register account
  const verifyOtpAndRegister = async (
    rawPhone: string,
    code: string,
    name: string,
    password: string,
    email?: string,
    address?: string
  ) => {
    const cleanPhone = normalizePhone(rawPhone);
    const cleanCode = code.trim();

    if (!pendingOtp || pendingOtp.phone !== cleanPhone) {
      // Allow fallback test code 123456
      if (cleanCode !== '123456') {
        return { success: false, message: 'No OTP session found for this number. Please request a new code.' };
      }
    } else {
      if (Date.now() > pendingOtp.expiresAt) {
        return { success: false, message: 'Verification code has expired. Please request a new code.' };
      }
      if (pendingOtp.code !== cleanCode && cleanCode !== '123456') {
        return { success: false, message: 'Incorrect 6-digit code. Please verify the SMS.' };
      }
    }

    if (!name.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const newUser: User = {
      id: `client-${Date.now()}`,
      phone: cleanPhone,
      name: name.trim(),
      password: password,
      email: email?.trim() || `${cleanPhone}@client.bytedesk.io`,
      address: address?.trim() || '',
      city: 'Dhaka',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=0d5bff,0045d8,1e293b`,
      verified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      role: 'client'
    };

    const updatedUsers = [newUser, ...users.filter((u) => normalizePhone(u.phone) !== cleanPhone)];
    persistUsers(updatedUsers);
    setCurrentUser(newUser);
    setPendingOtp(null);
    setOtpBanner(null);
    setIsAuthModalOpen(false);

    return { 
      success: true, 
      message: `Registration successful! Welcome, ${newUser.name}. Your phone number is verified.` 
    };
  };

  // Direct Client Registration (Connected to Backend API)
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
          role: 'client',
        };

        const updatedUsers = [backendUser, ...users.filter((u) => normalizePhone(u.phone) !== cleanPhone)];
        persistUsers(updatedUsers);
        setCurrentUser(backendUser);
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
      // Fallback to client local persistence if backend is offline
    }

    const newUser: User = {
      id: `client-${Date.now()}`,
      phone: cleanPhone,
      name: name.trim(),
      password: password,
      email: email?.trim() || `${cleanPhone}@reviewer.productperks.com`,
      address: address?.trim() || '',
      city: city?.trim() || 'Dhaka',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=1b3b2b`,
      verified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      role: 'client'
    };

    const updatedUsers = [newUser, ...users.filter((u) => normalizePhone(u.phone) !== cleanPhone)];
    persistUsers(updatedUsers);
    setCurrentUser(newUser);
    setPendingOtp(null);
    setOtpBanner(null);
    setIsAuthModalOpen(false);

    return { 
      success: true, 
      message: `Registration successful! Welcome to ProductPerks, ${newUser.name}.` 
    };
  };

  // Log in with Phone + Password (Connected to Backend API)
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
          role: data.user.role === 'ADMIN' ? 'admin' : 'client',
        };

        setCurrentUser(loggedInUser);
        setIsAuthModalOpen(false);
        return { success: true, message: data.message || `Welcome back, ${loggedInUser.name}!` };
      } else if (!response.ok) {
        return { success: false, message: data.message || 'Login failed. Please check credentials.' };
      }
    } catch (e) {
      // Fallback to client local persistence
    }

    const found = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (!found) {
      return { 
        success: false, 
        message: 'No account found with this phone number. Please click "New Registration" to register first.' 
      };
    }

    // Check password
    if (found.password && found.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    return { success: true, message: `Welcome back, ${found.name}!` };
  };

  // Optional OTP login for users who forgot password
  const loginWithOtp = async (rawPhone: string, code: string) => {
    const cleanPhone = normalizePhone(rawPhone);
    const cleanCode = code.trim();

    const found = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (!found) {
      return { success: false, message: 'Phone number not registered. Please register first.' };
    }

    if (!pendingOtp || pendingOtp.phone !== cleanPhone || (pendingOtp.code !== cleanCode && cleanCode !== '123456')) {
      return { success: false, message: 'Invalid or expired verification code.' };
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
    setCurrentUser(updated);

    const updatedUsers = users.map((u) => (u.id === user.id ? updated : u));
    persistUsers(updatedUsers);
  };

  const blockUser = (userId: string) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, status: 'BLOCKED' as const } : u);
    persistUsers(updatedUsers);
    if (user && user.id === userId) {
      setCurrentUser({ ...user, status: 'BLOCKED' });
    }
  };

  const unblockUser = (userId: string) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, status: 'ACTIVE' as const } : u);
    persistUsers(updatedUsers);
    if (user && user.id === userId) {
      setCurrentUser({ ...user, status: 'ACTIVE' });
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
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        otpBanner,
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
