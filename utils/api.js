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
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Response with packages, pagination info
 */
export async function getAllPackages(page = 1) {
  try {
    // Use clientAPI.post(endpoint, data, options)
    return await clientAPI.post('/package/all', { page });
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

/**
 * Get all chapters of a package (public)
 * @param {string} packageId - Package ID
 */
export async function getPackageChapters(packageId) {
  try {
    return await clientAPI.post('/package/chapters', { packageId });
  } catch (error) {
    console.error('Error fetching package chapters:', error);
    throw error;
  }
}

/**
 * Get all parts of a chapter (public)
 * @param {string} chapterId - Chapter ID
 */
export async function getChapterParts(chapterId) {
  try {
    return await clientAPI.post('/package/parts', { chapterId });
  } catch (error) {
    console.error('Error fetching chapter parts:', error);
    throw error;
  }
}

/**
 * Get all lessons of a part (public)
 * @param {string} partId - Part ID
 */
export async function getPartLessons(partId) {
  try {
    return await clientAPI.post('/package/lessons', { partId });
  } catch (error) {
    console.error('Error fetching part lessons:', error);
    throw error;
  }
}

/**
 * Get uploaded images with pagination (public)
 * @param {number} page - Page number (1-based)
 */
export async function getUploadedImages(page = 1) {
  try {
    return await clientAPI.post('/images', { page });
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

