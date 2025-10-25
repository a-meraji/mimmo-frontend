// API utility for making authenticated requests

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Make an authenticated API request
 * This should be used with the authenticatedFetch from AuthContext
 */
export async function apiRequest(url, options = {}, authenticatedFetch) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  try {
    const response = await authenticatedFetch(fullUrl, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(authenticatedFetch) {
  return apiRequest('/user/profile', { method: 'GET' }, authenticatedFetch);
}

/**
 * Update user profile
 */
export async function updateUserProfile(data, authenticatedFetch) {
  return apiRequest('/user/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  }, authenticatedFetch);
}

/**
 * Get all packages (public)
 */
export async function getAllPackages() {
  try {
    const response = await fetch(`${API_BASE_URL}/package/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

