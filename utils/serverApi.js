/**
 * Server-Side API Utility
 * For use in Server Components and build-time data fetching (SSG/ISR)
 */

import { createServerAPI } from './fetchInstance';

// Create server API instance
const serverAPI = createServerAPI();

/**
 * Fetch all packages from all pages
 * Iterates through pagination until all packages are retrieved
 * @returns {Promise<Array>} All packages from all pages
 */
export async function getAllPackagesPages() {
  const allPackages = [];
  let currentPage = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const response = await serverAPI.post('/package/all', { page: currentPage });
      
      const packages = response?.data?.packages || [];
      const totalPages = response?.data?.totalPages || 1;
      
      allPackages.push(...packages);
      
      // Check if there are more pages
      hasMorePages = currentPage < totalPages;
      currentPage++;
    }

    return allPackages;
  } catch (error) {
    console.error('Error fetching all packages:', error);
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
}

/**
 * Fetch a single package by ID
 * Note: Backend doesn't have a direct endpoint for single package
 * So we fetch all packages and filter by ID
 * @param {string} packageId - Package ID (UUID)
 * @returns {Promise<Object|null>} Package object or null if not found
 */
export async function getPackageById(packageId) {
  try {
    // Fetch all packages
    const allPackages = await getAllPackagesPages();
    
    // Find the specific package
    const packageData = allPackages.find(pkg => pkg.id === packageId);
    
    return packageData || null;
  } catch (error) {
    console.error(`Error fetching package ${packageId}:`, error);
    return null;
  }
}

/**
 * Fetch all chapters of a package
 * @param {string} packageId - Package ID (UUID)
 * @returns {Promise<Array>} Array of chapters
 */
export async function getPackageChapters(packageId) {
  try {
    const response = await serverAPI.post('/package/chapters', { packageId });
    return response?.data?.chapters || [];
  } catch (error) {
    console.error(`Error fetching chapters for package ${packageId}:`, error);
    return [];
  }
}

/**
 * Fetch all parts of a chapter
 * @param {string} chapterId - Chapter ID (UUID)
 * @returns {Promise<Array>} Array of parts
 */
export async function getChapterParts(chapterId) {
  try {
    const response = await serverAPI.post('/package/parts', { chapterId });
    return response?.data?.parts || [];
  } catch (error) {
    console.error(`Error fetching parts for chapter ${chapterId}:`, error);
    return [];
  }
}

/**
 * Fetch all lessons of a part
 * @param {string} partId - Part ID (UUID)
 * @returns {Promise<Array>} Array of lessons (id, title, numericOrder only)
 */
export async function getPartLessons(partId) {
  try {
    const response = await serverAPI.post('/package/lessons', { partId });
    return response?.data?.lessons || [];
  } catch (error) {
    console.error(`Error fetching lessons for part ${partId}:`, error);
    return [];
  }
}

/**
 * Build complete package structure with chapters, parts, and lessons
 * @param {string} packageId - Package ID (UUID)
 * @returns {Promise<Object>} Complete package structure
 */
export async function getCompletePackageStructure(packageId) {
  try {
    const packageData = await getPackageById(packageId);
    if (!packageData) return null;

    const chapters = await getPackageChapters(packageId);
    
    // Fetch parts for each chapter
    const chaptersWithParts = await Promise.all(
      chapters.map(async (chapter) => {
        const parts = await getChapterParts(chapter.id);
        
        // Fetch lessons for each part
        const partsWithLessons = await Promise.all(
          parts.map(async (part) => {
            const lessons = await getPartLessons(part.id);
            return {
              ...part,
              lessons
            };
          })
        );
        
        return {
          ...chapter,
          parts: partsWithLessons
        };
      })
    );

    return {
      ...packageData,
      chapters: chaptersWithParts
    };
  } catch (error) {
    console.error(`Error building complete structure for package ${packageId}:`, error);
    return null;
  }
}

