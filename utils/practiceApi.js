/**
 * Practice API - Practice Questions and Exercises
 * Handles all practice-related API calls for retrieving practice questions by lesson
 */

import { clientAPI } from './fetchInstance';

/**
 * Get all practice questions for a specific lesson
 * @param {string} lessonId - Lesson ID (UUID)
 * @returns {Promise<Object>} Practice questions for the lesson
 */
export async function getPracticesByLessonId(lessonId) {
  try {
    const response = await clientAPI.post('/practice/get-practices-by-lesson-id', {
      lessonId
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch practices'
    };
  } catch (error) {
    console.error('Error fetching practices:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

