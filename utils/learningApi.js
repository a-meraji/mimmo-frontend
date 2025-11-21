/**
 * Learning API - Package, Lesson, and Personal Notes
 * Handles all learning-related API calls for packages, chapters, parts, lessons, words, and personal notes
 */

import { clientAPI } from './fetchInstance';

/**
 * Get user's payment records to determine owned packages (requires authentication)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Payment records with packages
 */
export async function getUserPayments(authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/payment/get-user-payments', {
      method: 'POST'
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch user payments'
    };
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get user's bought packages (requires authentication)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Bought packages
 */
export async function getBoughtPackages(authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/payment/get-bought-packages', {
      method: 'POST'
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch bought packages'
    };
  } catch (error) {
    console.error('Error fetching bought packages:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get packages from a specific payment
 * @param {string} paymentId - Payment ID (UUID)
 * @returns {Promise<Object>} Payment with packages
 */
export async function getPaidPackages(paymentId) {
  try {
    const response = await clientAPI.post('/payment/get-paid-packages-by-payment-id', {
      paymentId
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch paid packages'
    };
  } catch (error) {
    console.error('Error fetching paid packages:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get all chapters of a package
 * @param {string} packageId - Package ID (UUID)
 * @returns {Promise<Object>} Package chapters
 */
export async function getPackageChapters(packageId) {
  try {
    const response = await clientAPI.post('/package/chapters', {
      packageId
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data?.chapters || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch package chapters'
    };
  } catch (error) {
    console.error('Error fetching package chapters:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get all parts of a chapter
 * @param {string} chapterId - Chapter ID (UUID)
 * @returns {Promise<Object>} Chapter parts
 */
export async function getChapterParts(chapterId) {
  try {
    const response = await clientAPI.post('/package/parts', {
      chapterId
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data?.parts || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch chapter parts'
    };
  } catch (error) {
    console.error('Error fetching chapter parts:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get all lessons of a part
 * @param {string} partId - Part ID (UUID)
 * @returns {Promise<Object>} Part lessons (id, title, numericOrder only)
 */
export async function getPartLessons(partId) {
  try {
    const response = await clientAPI.post('/package/lessons', {
      partId
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data?.lessons || []
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch part lessons'
    };
  } catch (error) {
    console.error('Error fetching part lessons:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get a free lesson by ID
 * @param {string} lessonId - Lesson ID (UUID)
 * @returns {Promise<Object>} Free lesson details
 */
export async function getFreeLesson(lessonId) {
  try {
    const response = await clientAPI.post('/package/free-lesson', {
      lessonId
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data?.lesson || null
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: 'Free lesson not found',
        notFree: true
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch free lesson'
    };
  } catch (error) {
    console.error('Error fetching free lesson:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get a paid lesson (requires authentication and payment)
 * @param {string} packageId - Package ID (UUID)
 * @param {string} lessonId - Lesson ID (UUID)
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Paid lesson details
 */
export async function getPaidLesson(packageId, lessonId, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/payment/get-lesson', {
      method: 'POST',
      body: JSON.stringify({
        packageId,
        lessonId
      })
    });
    
    if (response && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    }
    
    if (response && response.status === 403) {
      return {
        success: false,
        error: response.message || 'Access denied',
        accessDenied: true
      };
    }
    
    if (response && response.status === 404) {
      return {
        success: false,
        error: 'Lesson not found',
        notFound: true
      };
    }
    
    if (response && response.status === 503) {
      return {
        success: false,
        error: response.message || 'Unknown payment status',
        unknownStatus: true
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to fetch paid lesson'
    };
  } catch (error) {
    console.error('Error fetching paid lesson:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Get all words for a lesson
 * @param {string} lessonId - Lesson ID (UUID)
 * @returns {Promise<Object>} Lesson words
 */
export async function getLessonWords(lessonId) {
  try {
    const response = await clientAPI.post('/package/words', {
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
      error: response?.message || 'Failed to fetch lesson words'
    };
  } catch (error) {
    console.error('Error fetching lesson words:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

/**
 * Create or update a personal note for a word (requires authentication)
 * @param {string} wordId - Word ID (UUID)
 * @param {string} content - Note content
 * @param {Function} authenticatedFetch - Authenticated fetch function from AuthContext
 * @returns {Promise<Object>} Success/error response
 */
export async function createPersonalNote(wordId, content, authenticatedFetch) {
  try {
    const response = await authenticatedFetch('/package/personal-note', {
      method: 'POST',
      body: JSON.stringify({
        wordId,
        content
      })
    });
    
    if (response && (response.status === 200 || response.status === 201)) {
      return {
        success: true,
        message: response.message,
        isUpdate: response.status === 200
      };
    }
    
    return {
      success: false,
      error: response?.message || 'Failed to save personal note'
    };
  } catch (error) {
    console.error('Error creating personal note:', error);
    return {
      success: false,
      error: error?.message || 'Network error'
    };
  }
}

