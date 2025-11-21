/**
 * Comment API Functions
 * Handles comment operations with backend
 */

import { clientAPI } from './fetchInstance';

/**
 * Create a new comment (requires authentication)
 * @param {string} packageId - Package ID (UUID)
 * @param {string} content - Comment content
 * @param {string} accessToken - JWT access token
 * @returns {Promise<Object>} Response with created comment
 */
export async function createComment(packageId, content, accessToken) {
  try {
    return await clientAPI.post('/comment/create-comment', {
      packageId,
      content
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

/**
 * Get approved comments for a package (public)
 * @param {string} packageId - Package ID (UUID)
 * @param {number} page - Page number (0-based)
 * @returns {Promise<Object>} Response with comments array
 */
export async function getCommentsByPackageId(packageId, page = 1) {
  try {
    return await clientAPI.post('/comment/get-comments-by-package-id', {
      packageId,
      page
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Get all comments by a specific user (public)
 * @param {string} userId - User ID (UUID)
 * @param {number} page - Page number (1-based)
 * @returns {Promise<Object>} Response with user's comments
 */
export async function getCommentsByUserId(userId, page = 1) {
  try {
    return await clientAPI.post('/comment/get-comments-by-user-id', {
      userId,
      page
    });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error;
  }
}

