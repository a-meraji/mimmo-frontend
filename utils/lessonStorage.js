// LocalStorage utilities for lesson data with user isolation

const STORAGE_KEYS = {
  WORD_NOTES: 'mimmo_word_notes',
  LESSON_NOTES: 'mimmo_lesson_notes',
  QUESTION_NOTES: 'mimmo_question_notes',
  TEST_PREFERENCES: 'mimmo_test_preferences',
  QUESTION_STATS: 'mimmo_question_stats',
  TEST_HISTORY: 'mimmo_test_history'
};

/**
 * Safely get data from localStorage
 * @param {string} key - Storage key
 * @returns {Object|null} Parsed data or null
 */
function safeGetItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    // Handle quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
}

/**
 * Get user ID for namespacing (should be called with user from AuthContext)
 * @param {Object} user - User object from AuthContext
 * @returns {string} User ID or 'guest'
 */
function getUserId(user) {
  return user?.id || user?.email || 'guest';
}

// ============= WORD NOTES =============

/**
 * Get note for a specific word
 * @param {string} wordId - Word ID
 * @param {Object} user - User object
 * @returns {string} Note text or empty string
 */
export function getWordNote(wordId, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.WORD_NOTES) || {};
  
  if (!data[userId]) return '';
  return data[userId][wordId] || '';
}

/**
 * Save note for a specific word
 * @param {string} wordId - Word ID
 * @param {string} note - Note text
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function saveWordNote(wordId, note, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.WORD_NOTES) || {};
  
  if (!data[userId]) {
    data[userId] = {};
  }
  
  data[userId][wordId] = note;
  return safeSetItem(STORAGE_KEYS.WORD_NOTES, data);
}

/**
 * Get all word notes for a user
 * @param {Object} user - User object
 * @returns {Object} Object with wordId as keys and notes as values
 */
export function getAllWordNotes(user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.WORD_NOTES) || {};
  return data[userId] || {};
}

// ============= LESSON NOTES =============

/**
 * Get note for a specific lesson
 * @param {string} lessonId - Lesson ID
 * @param {Object} user - User object
 * @returns {string} Note text or empty string
 */
export function getLessonNote(lessonId, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.LESSON_NOTES) || {};
  
  if (!data[userId]) return '';
  return data[userId][lessonId] || '';
}

/**
 * Save note for a specific lesson
 * @param {string} lessonId - Lesson ID
 * @param {string} note - Note text
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function saveLessonNote(lessonId, note, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.LESSON_NOTES) || {};
  
  if (!data[userId]) {
    data[userId] = {};
  }
  
  data[userId][lessonId] = note;
  return safeSetItem(STORAGE_KEYS.LESSON_NOTES, data);
}

/**
 * Get all lesson notes for a user
 * @param {Object} user - User object
 * @returns {Object} Object with lessonId as keys and notes as values
 */
export function getAllLessonNotes(user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.LESSON_NOTES) || {};
  return data[userId] || {};
}

// ============= QUESTION NOTES =============

/**
 * Get note for a specific question
 * @param {string} questionId - Question ID
 * @param {Object} user - User object
 * @returns {string} Note text or empty string
 */
export function getQuestionNote(questionId, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_NOTES) || {};
  
  if (!data[userId]) return '';
  return data[userId][questionId] || '';
}

/**
 * Save note for a specific question
 * @param {string} questionId - Question ID
 * @param {string} note - Note text
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function saveQuestionNote(questionId, note, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_NOTES) || {};
  
  if (!data[userId]) {
    data[userId] = {};
  }
  
  data[userId][questionId] = note;
  return safeSetItem(STORAGE_KEYS.QUESTION_NOTES, data);
}

/**
 * Get all question notes for a user
 * @param {Object} user - User object
 * @returns {Object} Object with questionId as keys and notes as values
 */
export function getAllQuestionNotes(user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_NOTES) || {};
  return data[userId] || {};
}

// ============= TEST PREFERENCES =============

/**
 * Get test preferences for a user
 * @param {Object} user - User object
 * @returns {Object} Test preferences or defaults
 */
export function getTestPreferences(user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.TEST_PREFERENCES) || {};
  
  // Default preferences
  const defaults = {
    questionCount: 10,
    includeScope: 'this-lesson',
    previousLessons: [],
    questionMixture: 'all',
    timeLimit: false,
    feedbackMode: 'immediate'
  };
  
  return data[userId] || defaults;
}

/**
 * Save test preferences for a user
 * @param {Object} preferences - Test preferences object
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function saveTestPreferences(preferences, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.TEST_PREFERENCES) || {};
  
  data[userId] = {
    ...preferences,
    lastUpdated: new Date().toISOString()
  };
  
  return safeSetItem(STORAGE_KEYS.TEST_PREFERENCES, data);
}

// ============= QUESTION STATISTICS =============

/**
 * Get statistics for a specific question
 * @param {string} questionId - Question ID
 * @param {Object} user - User object
 * @returns {Object} Question stats or default
 */
export function getQuestionStats(questionId, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_STATS) || {};
  
  const defaults = {
    totalAttempts: 0,
    correct: 0,
    wrong: 0,
    doubt: 0
  };
  
  if (!data[userId]) return defaults;
  return data[userId][questionId] || defaults;
}

/**
 * Get all question statistics for a user
 * @param {Object} user - User object
 * @returns {Object} All question stats
 */
export function getAllQuestionStats(user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_STATS) || {};
  return data[userId] || {};
}

/**
 * Update statistics for a question
 * @param {string} questionId - Question ID
 * @param {string} resultType - 'correct', 'wrong', or 'doubt'
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function updateQuestionStats(questionId, resultType, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_STATS) || {};
  
  if (!data[userId]) {
    data[userId] = {};
  }
  
  if (!data[userId][questionId]) {
    data[userId][questionId] = {
      totalAttempts: 0,
      correct: 0,
      wrong: 0,
      doubt: 0
    };
  }
  
  const stats = data[userId][questionId];
  stats.totalAttempts += 1;
  
  if (resultType === 'correct') {
    stats.correct += 1;
  } else if (resultType === 'wrong') {
    stats.wrong += 1;
  } else if (resultType === 'doubt') {
    stats.doubt += 1;
  }
  
  return safeSetItem(STORAGE_KEYS.QUESTION_STATS, data);
}

/**
 * Batch update question statistics (for test completion)
 * @param {Array} results - Array of {questionId, resultType}
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function batchUpdateQuestionStats(results, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.QUESTION_STATS) || {};
  
  if (!data[userId]) {
    data[userId] = {};
  }
  
  results.forEach(({ questionId, resultType }) => {
    if (!data[userId][questionId]) {
      data[userId][questionId] = {
        totalAttempts: 0,
        correct: 0,
        wrong: 0,
        doubt: 0
      };
    }
    
    const stats = data[userId][questionId];
    stats.totalAttempts += 1;
    
    if (resultType === 'correct') {
      stats.correct += 1;
    } else if (resultType === 'wrong') {
      stats.wrong += 1;
    } else if (resultType === 'doubt') {
      stats.doubt += 1;
    }
  });
  
  return safeSetItem(STORAGE_KEYS.QUESTION_STATS, data);
}

// ============= TEST HISTORY =============

/**
 * Get test history for a user
 * @param {Object} user - User object
 * @param {number} limit - Maximum number of tests to return
 * @returns {Array} Array of test results
 */
export function getTestHistory(user, limit = 10) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.TEST_HISTORY) || {};
  
  const userTests = data[userId] || [];
  
  // Sort by timestamp descending (newest first)
  const sorted = [...userTests].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Save a test result
 * @param {Object} testResult - Test result object
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function saveTestResult(testResult, user) {
  const userId = getUserId(user);
  const data = safeGetItem(STORAGE_KEYS.TEST_HISTORY) || {};
  
  if (!data[userId]) {
    data[userId] = [];
  }
  
  const result = {
    ...testResult,
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  data[userId].push(result);
  
  // Keep only last 50 tests to avoid storage issues
  if (data[userId].length > 50) {
    data[userId] = data[userId].slice(-50);
  }
  
  return safeSetItem(STORAGE_KEYS.TEST_HISTORY, data);
}

/**
 * Get test history for a specific lesson
 * @param {string} lessonId - Lesson ID
 * @param {Object} user - User object
 * @returns {Array} Array of test results for the lesson
 */
export function getTestHistoryForLesson(lessonId, user) {
  const allTests = getTestHistory(user, null);
  return allTests.filter(test => test.lessonId === lessonId);
}

/**
 * Clear all data for a user (useful for testing or reset)
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function clearUserData(user) {
  const userId = getUserId(user);
  
  try {
    // Clear word notes
    const wordNotes = safeGetItem(STORAGE_KEYS.WORD_NOTES) || {};
    delete wordNotes[userId];
    safeSetItem(STORAGE_KEYS.WORD_NOTES, wordNotes);
    
    // Clear lesson notes
    const lessonNotes = safeGetItem(STORAGE_KEYS.LESSON_NOTES) || {};
    delete lessonNotes[userId];
    safeSetItem(STORAGE_KEYS.LESSON_NOTES, lessonNotes);
    
    // Clear question notes
    const questionNotes = safeGetItem(STORAGE_KEYS.QUESTION_NOTES) || {};
    delete questionNotes[userId];
    safeSetItem(STORAGE_KEYS.QUESTION_NOTES, questionNotes);
    
    // Clear test preferences
    const testPrefs = safeGetItem(STORAGE_KEYS.TEST_PREFERENCES) || {};
    delete testPrefs[userId];
    safeSetItem(STORAGE_KEYS.TEST_PREFERENCES, testPrefs);
    
    // Clear question stats
    const questionStats = safeGetItem(STORAGE_KEYS.QUESTION_STATS) || {};
    delete questionStats[userId];
    safeSetItem(STORAGE_KEYS.QUESTION_STATS, questionStats);
    
    // Clear test history
    const testHistory = safeGetItem(STORAGE_KEYS.TEST_HISTORY) || {};
    delete testHistory[userId];
    safeSetItem(STORAGE_KEYS.TEST_HISTORY, testHistory);
    
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
}

export default {
  getWordNote,
  saveWordNote,
  getAllWordNotes,
  getLessonNote,
  saveLessonNote,
  getAllLessonNotes,
  getQuestionNote,
  saveQuestionNote,
  getAllQuestionNotes,
  getTestPreferences,
  saveTestPreferences,
  getQuestionStats,
  getAllQuestionStats,
  updateQuestionStats,
  batchUpdateQuestionStats,
  getTestHistory,
  saveTestResult,
  getTestHistoryForLesson,
  clearUserData
};

