/**
 * Question API - User Questions and Answers
 * Handles all question-related API calls for creating, viewing, and managing lesson questions
 */

import { clientAPI } from './fetchInstance';

/**
 * Get all questions asked by a specific user for a specific lesson
 * @param {string} userId - User ID (UUID)
 * @param {string} lessonId - Lesson ID (UUID)
 * @returns {Promise<Object>} User's questions on the lesson
 */
export async function getUserQuestionsOnLesson(userId, lessonId) {
  try {
    const response = await clientAPI.post('/question/get-user-questions-on-lesson', {
      userId,
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
      error: response?.message || 'Failed to fetch user questions'
    };
  } catch (error) {
    console.error('Error fetching user questions:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Create a new question for a lesson (requires authentication)
 * @param {string} content - Question content/text
 * @param {string} lessonId - Lesson ID (UUID)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Created question
 */
export async function createQuestion(content, lessonId, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/question/create-question', {
      method: 'POST',
      body: JSON.stringify({
        content,
        lessonId
      })
    });
    
    if (response && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to create question'
    };
  } catch (error) {
    console.error('Error creating question:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get public answered questions for a lesson with pagination
 * @param {string} lessonId - Lesson ID (UUID)
 * @param {number} page - Page number (1-based)
 * @returns {Promise<Object>} Public questions with pagination info
 */
export async function getLessonPublicQuestions(lessonId, page = 1) {
  try {
    const response = await clientAPI.post('/question/get-lesson-public-questions', {
      lessonId,
      page
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data?.questions || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        pageSize: response.data?.pageSize || 10,
        totalPages: Math.ceil((response.data?.total || 0) / (response.data?.pageSize || 10))
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch public questions'
    };
  } catch (error) {
    console.error('Error fetching public questions:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

