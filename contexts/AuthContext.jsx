"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies (refresh token)
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      }
      
      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  // Refresh access token using refresh token (HTTPOnly cookie)
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Send HTTPOnly refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.accessToken || data.access_token;
        
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          await fetchUserProfile(newAccessToken);
          return newAccessToken;
        }
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, logout user
      await logout();
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
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending phone OTP:', error);
      throw error;
    }
  }, []);

  // Send OTP to email
  const sendEmailOTP = useCallback(async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw error;
    }
  }, []);

  // Verify phone OTP
  const verifyPhoneOTP = useCallback(async (phoneNumber, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Receive refresh token cookie
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid OTP');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.access_token;
      
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
      const response = await fetch(`${API_BASE_URL}/auth/verify-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Receive refresh token cookie
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid OTP');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.access_token;
      
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
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
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
        const token = await refreshAccessToken();
        
        if (token) {
          setupRefreshTimer();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
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
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      }
    }

    return response;
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

