/**
 * Exam API - Exam Creation, Execution, and Results
 * Handles all exam-related API calls including creation, answering, and result retrieval
 */

import { clientAPI } from './fetchInstance';

/**
 * Create a new exam (requires authentication)
 * @param {string[]} lessonIds - Array of lesson IDs (UUIDs)
 * @param {number} totalQuestions - Total number of questions (minimum: 1)
 * @param {number|null} timeLimitMinutes - Time limit in minutes (optional)
 * @param {boolean} showAnswersAfterEachQuestion - Whether to show answers immediately
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Created exam details
 */
export async function createExam(lessonIds, totalQuestions, timeLimitMinutes, showAnswersAfterEachQuestion, authenticatedFetch) {
  try {
    const body = {
      lessonIds,
      totalQuestions,
      showAnswersAfterEachQuestion
    };
    
    if (timeLimitMinutes) {
      body.timeLimitMinutes = timeLimitMinutes;
    }
    
    const response = await authenticatedFetch('/exam/create', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    
    if (response && response.status === 201) {
      return {
        success: true,
        data: response.data
      };
    }
    
    if (response && response.status === 400) {
      return {
        success: false,
        error: response.message,
        alreadyInProgress: response.message?.includes('in-progress')
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to create exam'
    };
  } catch (error) {
    console.error('Error creating exam:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Start an exam (begins timer if time limit is set)
 * @param {string} examId - Exam ID (UUID)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Started exam details
 */
export async function startExam(examId, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/exam/start', {
      method: 'POST',
      body: JSON.stringify({ examId })
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    if (response && response.status === 400) {
      return {
        success: false,
        error: response.message,
        alreadyStarted: response.message?.includes('already started'),
        notInProgress: response.message?.includes('not in progress')
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: 'Exam not found',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to start exam'
    };
  } catch (error) {
    console.error('Error starting exam:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get current question for an exam
 * @param {string} examId - Exam ID (UUID)
 * @param {number|null} questionNumber - Optional question number to navigate to (1-based)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Current question details
 */
export async function getCurrentQuestion(examId, questionNumber, authenticatedFetch) {
  try {
    const body = { examId };
    if (questionNumber) {
      body.questionNumber = questionNumber;
    }
    
    const response = await authenticatedFetch('/exam/current-question', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    if (response && response.status === 400) {
      return {
        success: false,
        error: response.message,
        timeLimitExceeded: response.message?.includes('time limit'),
        alreadyCompleted: response.message?.includes('already completed')
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: response.message || 'Exam or question not found',
        noMoreQuestions: response.message?.includes('No more questions')
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to get current question'
    };
  } catch (error) {
    console.error('Error getting current question:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Answer a question in an exam
 * @param {string} examId - Exam ID (UUID)
 * @param {string} questionId - Exam question ID (UUID)
 * @param {string|null} userAnswer - User's selected answer (e.g., "a", "b", "c", "d")
 * @param {string} isUnsure - Whether user is unsure: "unsure" | "sure" | "not_answered"
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Answer submission result
 */
export async function answerQuestion(examId, questionId, userAnswer, isUnsure, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/exam/answer', {
      method: 'POST',
      body: JSON.stringify({
        examId,
        questionId,
        userAnswer,
        isUnsure
      })
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    if (response && response.status === 400) {
      return {
        success: false,
        error: response.message,
        alreadyAnswered: response.message?.includes('already answered'),
        notInProgress: response.message?.includes('not in progress')
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: response.message || 'Exam or question not found',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to submit answer'
    };
  } catch (error) {
    console.error('Error answering question:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Complete an exam
 * @param {string} examId - Exam ID (UUID)
 * @param {string} lessonId - Lesson ID (UUID) for progress tracking
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Completion result
 */
export async function completeExam(examId, lessonId, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/exam/complete', {
      method: 'POST',
      body: JSON.stringify({
        examId,
        lessonId
      })
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        message: response.message
      };
    }
    
    if (response && response.status === 400) {
      return {
        success: false,
        error: response.message,
        alreadyCompleted: response.message?.includes('already completed')
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: 'Exam not found',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to complete exam'
    };
  } catch (error) {
    console.error('Error completing exam:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get exam results
 * @param {string} examId - Exam ID (UUID)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Exam results with all questions and answers
 */
export async function getExamResult(examId, authenticatedFetch) {
  try {
    const response = await authenticatedFetch(`/exam/result?examId=${examId}`, {
      method: 'GET'
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: 'Exam not found',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch exam results'
    };
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get all exams for authenticated user
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} List of user's exams
 */
export async function getUserExams(authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/exam/my-exams', {
      method: 'GET'
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch user exams'
    };
  } catch (error) {
    console.error('Error fetching user exams:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get practice history for a specific practice question
 * @param {string} practiceId - Practice ID (UUID)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Practice attempt history and statistics
 */
export async function getPracticeHistory(practiceId, authenticatedFetch) {
  try {
    const response = await authenticatedFetch(`/exam/practice-history?practiceId=${practiceId}`, {
      method: 'GET'
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch practice history'
    };
  } catch (error) {
    console.error('Error fetching practice history:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get progress tracker for specific lessons
 * @param {string[]} lessonIds - Array of lesson IDs (UUIDs)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Progress tracker records
 */
export async function getProgressTracker(lessonIds, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/exam/progress-tracker', {
      method: 'POST',
      body: JSON.stringify({
        lessonId: lessonIds
      })
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch progress tracker'
    };
  } catch (error) {
    console.error('Error fetching progress tracker:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

