/**
 * Image URL Utility
 * Builds correct image URLs using backend base URL
 */

/**
 * Get backend base URL based on environment
 * @returns {string} Backend base URL
 */
function getBackendBaseURL() {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Client-side: Use NEXT_PUBLIC_ prefixed vars
  if (typeof window !== 'undefined') {
    return isDev
      ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_API_URL_PROD || 'https://back.mimmoacademy.com';
  }
  
  // Server-side
  return isDev 
    ? process.env.API_URL_SERVER_DEV || 'http://localhost:3000'
    : process.env.API_URL_SERVER_PROD || 'http://127.0.0.1:3000';
}

/**
 * Build full image URL from filename or path
 * @param {string} imagePathOrFilename - Image path (e.g., "/images/file.jpg" or "file.jpg")
 * @returns {string} Full image URL with backend base URL
 */
export function getImageUrl(imagePathOrFilename) {
  if (!imagePathOrFilename) return '';
  
  // If already a full URL, return as is
  if (imagePathOrFilename.startsWith('http://') || imagePathOrFilename.startsWith('https://')) {
    return imagePathOrFilename;
  }
  
  const baseURL = getBackendBaseURL();
  
  // If path starts with /images/, use as is
  if (imagePathOrFilename.startsWith('/images/')) {
    return `${baseURL}${imagePathOrFilename}`;
  }
  
  // If just filename, add /images/ prefix
  return `${baseURL}/images/${imagePathOrFilename}`;
}

/**
 * Build image URL from filename (convenience function)
 * @param {string} filename - Image filename (e.g., "file-123456.jpg")
 * @returns {string} Full image URL
 */
export function buildImageUrl(filename) {
  if (!filename) return '';
  return getImageUrl(filename);
}

/**
 * Extract filename from image URL or path
 * @param {string} imageUrl - Full image URL or path
 * @returns {string} Just the filename
 */
export function getFilenameFromUrl(imageUrl) {
  if (!imageUrl) return '';
  
  // Extract filename from path
  const parts = imageUrl.split('/');
  return parts[parts.length - 1];
}

export default getImageUrl;

