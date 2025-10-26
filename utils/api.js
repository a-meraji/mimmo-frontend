// API utility for making authenticated requests
import { clientAPI } from './fetchInstance';

/**
 * Make an authenticated API request
 * This should be used with the authenticatedFetch from AuthContext
 * The authenticatedFetch now returns data directly and throws errors
 */
export async function apiRequest(endpoint, options = {}, authenticatedFetch) {
  try {
    // authenticatedFetch now handles base URL and returns data directly
    return await authenticatedFetch(endpoint, options);
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
    // Use clientAPI for public endpoints - it handles base URL and JSON parsing
    return await clientAPI.get('/package/all');
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

