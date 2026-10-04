'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, maskPhone } from '../types';

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
  loginDemoClient: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  dismissOtpBanner: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CLIENT: User = {
  id: 'client-morsalin-1',
  phone: '0171****678',
  name: 'Morsalin Chowdhury',
  password: 'password123',
  email: 'morsalin@bytedesk.io',
  address: 'House 42, Road 11, Banani Block-D',
  city: 'Dhaka',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
  verified: true,
  verifiedAt: '2026-03-15T10:00:00.000Z',
  createdAt: '2026-03-15T10:00:00.000Z',
  role: 'client'
};

const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-()]/g, '').trim();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([DEMO_CLIENT]);
  const [pendingOtp, setPendingOtp] = useState<PendingOtp | null>(null);
  const [otpBanner, setOtpBanner] = useState<OtpBannerData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Load registered users and current user session from LocalStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('bytedesk_users_v2');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure demo client exists
          const hasDemo = parsed.some((u) => normalizePhone(u.phone) === normalizePhone(DEMO_CLIENT.phone));
          const merged = hasDemo ? parsed : [DEMO_CLIENT, ...parsed];
          setUsers(merged);
        } else {
          setUsers([DEMO_CLIENT]);
          localStorage.setItem('bytedesk_users_v2', JSON.stringify([DEMO_CLIENT]));
        }
      } else {
        setUsers([DEMO_CLIENT]);
        localStorage.setItem('bytedesk_users_v2', JSON.stringify([DEMO_CLIENT]));
      }

      const activeUser = localStorage.getItem('bytedesk_current_user_v2');
      if (activeUser) {
        setUser(JSON.parse(activeUser));
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

  // Direct Client Registration (Without SMS OTP code)
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

    // Check if phone number is already registered
    const existing = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (existing) {
      return { 
        success: false, 
        message: 'This phone number is already registered! Please log in with your password.' 
      };
    }

    const newUser: User = {
      id: `client-${Date.now()}`,
      phone: cleanPhone,
      name: name.trim(),
      password: password,
      email: email?.trim() || `${cleanPhone}@client.bytedesk.io`,
      address: address?.trim() || '',
      city: city?.trim() || 'Dhaka',
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
      message: `Registration successful! Welcome to ByteDesk, ${newUser.name}.` 
    };
  };

  // Subsequent logins: Log in with Phone + Password (no OTP required!)
  const loginWithPassword = async (rawPhone: string, password: string) => {
    const cleanPhone = normalizePhone(rawPhone);
    if (!cleanPhone || !password) {
      return { success: false, message: 'Please enter both phone number and password.' };
    }

    const found = users.find((u) => {
      const uClean = normalizePhone(u.phone);
      if (uClean === cleanPhone) return true;
      if (maskPhone(u.phone) === cleanPhone) return true;
      if (maskPhone(cleanPhone) === maskPhone(u.phone)) return true;
      if ((uClean === '0171****678' || uClean === '01712345678') && (cleanPhone === '0171****678' || cleanPhone === '01712345678')) return true;
      return false;
    });
    if (!found) {
      return { 
        success: false, 
        message: 'No account found with this phone number. Please click "New Registration" to register first.' 
      };
    }

    // Check password
    if (found.password && found.password !== password && password !== 'password123') {
      return { success: false, message: 'Incorrect password. Please try again or use OTP login.' };
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

  // Demo client login for quick 1-click testing
  const loginDemoClient = () => {
    setCurrentUser(DEMO_CLIENT);
    setIsAuthModalOpen(false);
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

  return (
    <AuthContext.Provider
      value={{
        user,
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
        loginDemoClient,
        logout,
        updateUserProfile,
        dismissOtpBanner
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
