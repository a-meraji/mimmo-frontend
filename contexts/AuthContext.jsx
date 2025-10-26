"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clientAPI } from '../utils/fetchInstance';

const AuthContext = createContext(undefined);

// Token refresh interval: 14 minutes (before 15-minute expiry)
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000;

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // Fetch user profile with access token
  const fetchUserProfile = useCallback(async (token) => {
    if (!token) {
      console.warn('No token provided to fetchUserProfile');
      return null;
    }
    
    try {
      const userData = await clientAPI.get('/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  // Refresh access token using refresh token (HTTPOnly cookie)
  const refreshAccessToken = useCallback(async (isInitializing = false) => {
    try {
      const data = await clientAPI.post('/auth/refresh', null);

      const newAccessToken = data.data.accessToken || null;
      
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        await fetchUserProfile(newAccessToken);
        return newAccessToken;
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      // If this is during initialization, silently handle expected errors
      if (isInitializing) {
        // 401 = No refresh token (expected for non-authenticated users)
        // Network errors = Server might not be running in dev mode
        if (error.status === 401 || error.isNetworkError) {
          return null;
        }
      }
      
      // For other errors or non-initialization cases, log and handle
      if (!isInitializing) {
        console.error('Error refreshing token:', error);
        // If refresh fails, logout user
        await logout();
      }
      
      return null;
    }
  }, [fetchUserProfile]);

  // Setup auto-refresh timer
  const setupRefreshTimer = useCallback(() => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Setup new timer to refresh token every 14 minutes
    refreshTimerRef.current = setInterval(() => {
      refreshAccessToken();
    }, TOKEN_REFRESH_INTERVAL);
  }, [refreshAccessToken]);

  // Send OTP to phone
  const sendPhoneOTP = useCallback(async (phoneNumber) => {
    try {
      await clientAPI.post('/auth/send-otp', { phoneNumber });
      return { success: true };
    } catch (error) {
      console.error('Error sending phone OTP:', error);
      throw error;
    }
  }, []);

  // Send OTP to email
  const sendEmailOTP = useCallback(async (email) => {
    try {
      await clientAPI.post('/auth/send-email-otp', { email });
      return { success: true };
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw error;
    }
  }, []);

  // Verify phone OTP
  const verifyPhoneOTP = useCallback(async (phoneNumber, otp) => {
    try {
      const data = await clientAPI.post('/auth/verify-otp', 
        { phoneNumber, otp }
      );
      
      // Check if response has the expected structure
      if (!data || !data.data) {
        throw new Error(data?.message || 'Invalid response from server');
      }
      
      const newAccessToken = data.data.accessToken || null;
      
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        await fetchUserProfile(newAccessToken);
        setupRefreshTimer();
        return { success: true };
      }

      throw new Error('No access token received');
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      throw error;
    }
  }, [fetchUserProfile, setupRefreshTimer]);

  // Verify email OTP
  const verifyEmailOTP = useCallback(async (email, otp) => {
    try {
      const data = await clientAPI.post('/auth/verify-email-otp',
        { email, otp }
      );
      
      // Check if response has the expected structure
      if (!data || !data.data) {
        throw new Error(data?.message || 'Invalid response from server');
      }
      
      const newAccessToken = data.data.accessToken || null;
      
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        await fetchUserProfile(newAccessToken);
        setupRefreshTimer();
        return { success: true };
      }

      throw new Error('No access token received');
    } catch (error) {
      console.error('Error verifying email OTP:', error);
      throw error;
    }
  }, [fetchUserProfile, setupRefreshTimer]);

  // Logout
  const logout = useCallback(async () => {
    try {
      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }

      // Call logout endpoint if we have an access token
      if (accessToken) {
        await clientAPI.post('/auth/logout', null, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
      }

      // Clear state
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if API call fails
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    }
  }, [accessToken, router]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh token (in case we have a valid refresh token cookie)
        // Pass true to indicate this is during initialization
        const token = await refreshAccessToken(true);
        
        if (token) {
          setupRefreshTimer();
        }
      } catch (error) {
        // Silently fail - user is simply not authenticated
        // This is expected for first-time visitors
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshAccessToken, setupRefreshTimer]);

  // Make authenticated API requests
  const authenticatedFetch = useCallback(async (endpoint, options = {}) => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await clientAPI.request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      return response;
    } catch (error) {
      // If unauthorized, try to refresh token
      if (error.status === 401) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Retry request with new token
          return clientAPI.request(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            }
          });
        }
      }
      
      throw error;
    }
  }, [accessToken, refreshAccessToken]);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    sendPhoneOTP,
    sendEmailOTP,
    verifyPhoneOTP,
    verifyEmailOTP,
    logout,
    refreshAccessToken,
    authenticatedFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

