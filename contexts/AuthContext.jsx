"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clientAPI } from '../utils/fetchInstance';

const AuthContext = createContext(undefined);

// Auto-refresh token every 13 minutes (access token expires in 15 min)
const REFRESH_INTERVAL = 13 * 60 * 1000;

// Decode JWT to get payload
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // Clear all auth state
  const clearAuth = useCallback(() => {
    console.log('[Auth] Clearing auth state');
    setAccessToken(null);
    setUser(null);
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Load user profile from backend
  const loadUserProfile = useCallback(async (token) => {
    if (!token) {
      console.error('[Auth] Cannot load profile: no token provided');
      return null;
    }

    try {
      console.log('[Auth] Loading user profile...');
      const response = await clientAPI.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('[Auth] Profile response:', response);
      
      // Backend returns: { status: 200, message: "User found", data: {...} }
      if (response && response.status === 200 && response.data) {
        const payload = decodeToken(token);
        const userData = {
          ...response.data,
          userId: payload?.sub,
          role: payload?.role || response.data.role || 'user',
        };
        
        console.log('[Auth] User profile loaded:', userData);
        setUser(userData);
        return userData;
      } else {
        console.error('[Auth] Invalid profile response structure:', response);
        return null;
      }
    } catch (error) {
      console.error('[Auth] Error loading user profile:', error);
      return null;
    }
  }, []);

  // Refresh access token using HTTP-only refresh token cookie
  const refreshAccessToken = useCallback(async (silent = false) => {
    // Prevent concurrent refresh attempts
    if (isRefreshingRef.current) {
      if (!silent) console.log('[Auth] Refresh already in progress, skipping...');
      return null;
    }

    isRefreshingRef.current = true;
    
    // Log cookie information
    if (typeof document !== 'undefined') {
      const cookies = document.cookie;
      console.log(`[Auth] 🍪 Browser cookies: ${cookies || '(empty)'}`);
      console.log(`[Auth] 🍪 Has refresh_token cookie: ${cookies.includes('refresh_token')}`);
    }
    
    if (!silent) console.log('[Auth] 📡 Sending refresh request to /auth/refresh...');

    try {
      // Backend expects: POST /auth/refresh with refresh_token cookie
      // Backend returns: 
      // - Success (200): { status: 200, message: "Refresh token validated", data: { accessToken: string } }
      // - No cookie/Invalid (403): { status: 403, message: "Invalid refresh token", data: null }
      const response = await clientAPI.post('/auth/refresh', null);
      
      console.log('[Auth] 📥 Refresh response:', JSON.stringify(response, null, 2));
      
      if (response && response.status === 200 && response.data && response.data.accessToken) {
        const newToken = response.data.accessToken;
        console.log('[Auth] ✅ New access token received, length:', newToken.length);
        
        setAccessToken(newToken);
        
        // Load user profile with new token
        const userData = await loadUserProfile(newToken);
        
        if (userData) {
          console.log('[Auth] ✅ Token refresh successful, user:', userData.email || userData.phoneNumber);
          return newToken;
        } else {
          console.error('[Auth] ❌ Failed to load user profile after refresh');
          if (!silent) {
            clearAuth();
          }
          return null;
        }
      } else if (response && response.status === 403) {
        // 403 is expected when no refresh token exists (not logged in or token expired)
        console.log('[Auth] ⚠️  No valid refresh token found (403) - User not logged in or token expired');
        return null;
      } else {
        // Unexpected response structure
        console.error('[Auth] ❌ Unexpected refresh response structure:', response);
        if (!silent) {
          clearAuth();
        }
        return null;
      }
    } catch (error) {
      // Network or other errors
      if (error?.status === 403 || error?.response?.status === 403) {
        // 403 is expected, not an error
        console.log('[Auth] ⚠️  No valid refresh token (403 error) - User not logged in');
      } else {
        console.error('[Auth] ❌ Token refresh error:', error);
        if (!silent) {
          clearAuth();
        }
      }
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [loadUserProfile, clearAuth]);

  // Start auto-refresh timer
  const startAutoRefresh = useCallback(() => {
    console.log('[Auth] Starting auto-refresh timer (14 min interval)');
    
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    
    // Start new timer
    refreshTimerRef.current = setInterval(() => {
      console.log('[Auth] Auto-refresh triggered');
      refreshAccessToken(false);
    }, REFRESH_INTERVAL);
  }, [refreshAccessToken]);

  // Stop auto-refresh timer
  const stopAutoRefresh = useCallback(() => {
    console.log('[Auth] Stopping auto-refresh timer');
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Initialize authentication on mount (restore session)
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('='.repeat(60));
      console.log('[Auth] 🚀 INITIALIZING AUTHENTICATION');
      console.log('='.repeat(60));
      setIsLoading(true);
      
      // Check cookies on initialization
      if (typeof document !== 'undefined') {
        const cookies = document.cookie;
        console.log(`[Auth] 🍪 Initial cookies: ${cookies || '(empty)'}`);
        console.log(`[Auth] 🍪 Has refresh_token cookie: ${cookies.includes('refresh_token')}`);
      }
      
      try {
        // Try to restore session from HTTP-only refresh token cookie
        console.log('[Auth] 🔄 Attempting to restore session...');
        const token = await refreshAccessToken(true); // Silent mode - won't log expected errors
        
        if (token) {
          console.log('[Auth] ✅ SESSION RESTORED SUCCESSFULLY');
          console.log('[Auth] 👤 User:', user?.email || user?.phoneNumber || 'Unknown');
          startAutoRefresh();
        } else {
          console.log('[Auth] ⚠️  NO EXISTING SESSION TO RESTORE (user not logged in)');
        }
      } catch (error) {
        console.error('[Auth] ❌ Auth initialization error:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('[Auth] 🏁 Initialization complete');
        console.log('='.repeat(60));
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, [isInitialized, refreshAccessToken, startAutoRefresh, stopAutoRefresh, user]);

  // Start/stop auto-refresh based on token presence
  useEffect(() => {
    if (accessToken && isInitialized) {
      console.log('[Auth] 🔑 Access token is set, starting auto-refresh');
      console.log('[Auth] 👤 Current user:', user?.email || user?.phoneNumber || 'Loading...');
      startAutoRefresh();
    } else {
      console.log('[Auth] ⚠️  No access token, stopping auto-refresh');
      console.log('[Auth] 📊 State - accessToken:', !!accessToken, 'isInitialized:', isInitialized, 'user:', !!user);
      stopAutoRefresh();
    }
  }, [accessToken, isInitialized, user, startAutoRefresh, stopAutoRefresh]);

  // Send phone OTP
  const sendPhoneOTP = useCallback(async (phoneNumber) => {
    console.log('[Auth] Sending phone OTP to:', phoneNumber);
    // Backend returns: { status: 200, message: "OTP sent successfully", data: { phoneNumber } }
    const response = await clientAPI.post('/auth/send-otp', { phoneNumber });
    return { success: true, message: response?.message || 'OTP sent successfully' };
  }, []);

  // Send email OTP
  const sendEmailOTP = useCallback(async (email) => {
    console.log('[Auth] Sending email OTP to:', email);
    // Backend returns: { status: 200, message: "OTP sent successfully", data: { email } }
    const response = await clientAPI.post('/auth/send-email-otp', { email });
    return { success: true, message: response?.message || 'OTP sent successfully' };
  }, []);

  // Verify phone OTP and login
  const verifyPhoneOTP = useCallback(async (phoneNumber, otp) => {
    console.log('[Auth] 📱 Verifying phone OTP for:', phoneNumber);
    // Backend returns: { status: 200, message: "OTP verified successfully", data: { user, accessToken } }
    // Backend also sets HTTP-only refresh_token cookie
    const response = await clientAPI.post('/auth/verify-otp', { phoneNumber, otp });
    
    console.log('[Auth] 📥 Login response:', JSON.stringify(response, null, 2));
    
    // Check cookies after login
    if (typeof document !== 'undefined') {
      const cookies = document.cookie;
      console.log(`[Auth] 🍪 Cookies after login: ${cookies || '(empty)'}`);
      console.log(`[Auth] 🍪 Has refresh_token cookie: ${cookies.includes('refresh_token')}`);
    }
    
    if (response && response.status === 200 && response.data && response.data.accessToken) {
      const token = response.data.accessToken;
      console.log('[Auth] ✅ Phone OTP verified, access token received, length:', token.length);
      
      setAccessToken(token);
      await loadUserProfile(token);
      startAutoRefresh();
      
      console.log('[Auth] ✅ Login complete, user authenticated');
      return { success: true };
    } else {
      console.error('[Auth] ❌ No access token in response');
      throw new Error('No access token received');
    }
  }, [loadUserProfile, startAutoRefresh]);

  // Verify email OTP and login
  const verifyEmailOTP = useCallback(async (email, otp) => {
    console.log('[Auth] 📧 Verifying email OTP for:', email);
    // Backend returns: { status: 200, message: "OTP verified successfully", data: { user, accessToken } }
    // Backend also sets HTTP-only refresh_token cookie
    const response = await clientAPI.post('/auth/verify-email-otp', { email, otp });
    
    console.log('[Auth] 📥 Login response:', JSON.stringify(response, null, 2));
    
    // Check cookies after login
    if (typeof document !== 'undefined') {
      const cookies = document.cookie;
      console.log(`[Auth] 🍪 Cookies after login: ${cookies || '(empty)'}`);
      console.log(`[Auth] 🍪 Has refresh_token cookie: ${cookies.includes('refresh_token')}`);
    }
    
    if (response && response.status === 200 && response.data && response.data.accessToken) {
      const token = response.data.accessToken;
      console.log('[Auth] ✅ Email OTP verified, access token received, length:', token.length);
      
      setAccessToken(token);
      await loadUserProfile(token);
      startAutoRefresh();
      
      console.log('[Auth] ✅ Login complete, user authenticated');
      return { success: true };
    } else {
      console.error('[Auth] ❌ No access token in response');
      throw new Error('No access token received');
    }
  }, [loadUserProfile, startAutoRefresh]);

  // Logout
  const logout = useCallback(async () => {
    console.log('[Auth] Logging out...');
    stopAutoRefresh();
    
    if (accessToken) {
      try {
        // Backend returns: { status: 200, message: "Logged out successfully", data: null }
        await clientAPI.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('[Auth] Logout successful');
      } catch (error) {
        console.error('[Auth] Logout error:', error);
      }
    }
    
    clearAuth();
    router.push('/');
  }, [accessToken, clearAuth, stopAutoRefresh, router]);

  // Refresh user profile manually
  const refreshUserProfile = useCallback(async () => {
    console.log('[Auth] Manually refreshing user profile');
    if (accessToken) {
      await loadUserProfile(accessToken);
    }
  }, [accessToken, loadUserProfile]);

  // Make authenticated requests with auto-retry on 401
  const authenticatedFetch = useCallback(async (endpoint, options = {}) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await clientAPI.request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      return response;
    } catch (error) {
      // Auto-retry once with refreshed token on 401
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('[Auth] Got 401, attempting token refresh and retry...');
        const newToken = await refreshAccessToken(false);
        
        if (newToken) {
          console.log('[Auth] Retrying request with new token');
          // Retry with new token
          return await clientAPI.request(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`
            }
          });
        }
      }
      
      throw error;
    }
  }, [accessToken, refreshAccessToken]);

  const value = {
    // State
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    
    // Auth methods
    sendPhoneOTP,
    sendEmailOTP,
    verifyPhoneOTP,
    verifyEmailOTP,
    logout,
    
    // API methods
    authenticatedFetch,
    refreshUserProfile,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
