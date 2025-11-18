/**
 * Admin API Utility
 * Wrappers for all admin endpoints
 * Uses authenticatedFetch from AuthContext
 */

// ============================================================
// USER MANAGEMENT
// ============================================================

export const userManagement = {
  /**
   * Get all users with pagination (20 per page)
   * @param {number} page - Page number (1-based)
   * @param {Function} authenticatedFetch
   */
  getAllUsers: async (page, authenticatedFetch) => {
    return authenticatedFetch('/admin/user/users', {
      method: 'POST',
      body: JSON.stringify({ page }),
    });
  },

  /**
   * Search for specific users
   * @param {Object} filters - { email?, name?, familyName?, phoneNumber? }
   * @param {Function} authenticatedFetch
   */
  searchUsers: async (filters, authenticatedFetch) => {
    return authenticatedFetch('/admin/user/specific-user', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {Function} authenticatedFetch
   */
  createUser: async (userData, authenticatedFetch) => {
    return authenticatedFetch('/admin/user/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @param {Function} authenticatedFetch
   */
  updateUser: async (id, userData, authenticatedFetch) => {
    return authenticatedFetch('/admin/user/update-user', {
      method: 'POST',
      body: JSON.stringify({ id, ...userData }),
    });
  },

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @param {Function} authenticatedFetch
   */
  deleteUser: async (userId, authenticatedFetch) => {
    return authenticatedFetch('/admin/user/delete-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

// ============================================================
// PACKAGE MANAGEMENT
// ============================================================

export const packageManagement = {
  /**
   * Create a new package
   * @param {Object} packageData - Package data
   * @param {Function} authenticatedFetch
   */
  createPackage: async (packageData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/create-package', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  },

  /**
   * Update a package
   * @param {string} id - Package ID
   * @param {Object} packageData - Updated package data
   * @param {Function} authenticatedFetch
   */
  updatePackage: async (id, packageData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/update-package', {
      method: 'POST',
      body: JSON.stringify({ id, ...packageData }),
    });
  },

  /**
   * Delete a package
   * @param {string} id - Package ID
   * @param {Function} authenticatedFetch
   */
  deletePackage: async (id, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/delete-package', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Chapter Management
  /**
   * Create a new chapter
   * @param {Object} chapterData - { title, numericOrder, packageId }
   * @param {Function} authenticatedFetch
   */
  createChapter: async (chapterData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/create-chapter', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  },

  /**
   * Update a chapter
   * @param {string} id - Chapter ID
   * @param {Object} chapterData - Updated chapter data
   * @param {Function} authenticatedFetch
   */
  updateChapter: async (id, chapterData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/update-chapter', {
      method: 'POST',
      body: JSON.stringify({ id, ...chapterData }),
    });
  },

  /**
   * Delete a chapter
   * @param {string} id - Chapter ID
   * @param {Function} authenticatedFetch
   */
  deleteChapter: async (id, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/delete-chapter', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Part Management
  /**
   * Create a new part
   * @param {Object} partData - { title, numericOrder, chapterId }
   * @param {Function} authenticatedFetch
   */
  createPart: async (partData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/create-part', {
      method: 'POST',
      body: JSON.stringify(partData),
    });
  },

  /**
   * Update a part
   * @param {string} id - Part ID
   * @param {Object} partData - Updated part data
   * @param {Function} authenticatedFetch
   */
  updatePart: async (id, partData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/update-part', {
      method: 'POST',
      body: JSON.stringify({ id, ...partData }),
    });
  },

  /**
   * Delete a part
   * @param {string} id - Part ID
   * @param {Function} authenticatedFetch
   */
  deletePart: async (id, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/delete-part', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Lesson Management
  /**
   * Get a lesson by ID
   * @param {string} lessonId - Lesson ID
   * @param {Function} authenticatedFetch
   */
  getLesson: async (lessonId, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/get-lesson', {
      method: 'POST',
      body: JSON.stringify({ lessonId }),
    });
  },

  /**
   * Create a new lesson
   * @param {Object} lessonData - Lesson data
   * @param {Function} authenticatedFetch
   */
  createLesson: async (lessonData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/create-lesson', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  },

  /**
   * Update a lesson
   * @param {string} id - Lesson ID
   * @param {Object} lessonData - Updated lesson data
   * @param {Function} authenticatedFetch
   */
  updateLesson: async (id, lessonData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/update-lesson', {
      method: 'POST',
      body: JSON.stringify({ id, ...lessonData }),
    });
  },

  /**
   * Delete a lesson
   * @param {string} id - Lesson ID
   * @param {Function} authenticatedFetch
   */
  deleteLesson: async (id, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/delete-lesson', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Word Management
  /**
   * Create a new word
   * @param {Object} wordData - Word data
   * @param {Function} authenticatedFetch
   */
  createWord: async (wordData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/create-word', {
      method: 'POST',
      body: JSON.stringify(wordData),
    });
  },

  /**
   * Update a word
   * @param {string} id - Word ID
   * @param {Object} wordData - Updated word data
   * @param {Function} authenticatedFetch
   */
  updateWord: async (id, wordData, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/update-word', {
      method: 'POST',
      body: JSON.stringify({ id, ...wordData }),
    });
  },

  /**
   * Delete a word
   * @param {string} id - Word ID
   * @param {Function} authenticatedFetch
   */
  deleteWord: async (id, authenticatedFetch) => {
    return authenticatedFetch('/admin/package/delete-word', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },
};

// ============================================================
// PRACTICE MANAGEMENT
// ============================================================

export const practiceManagement = {
  /**
   * Get all practices for a lesson
   * @param {string} lessonId - Lesson ID
   * @param {Function} authenticatedFetch
   */
  getByLessonId: async (lessonId, authenticatedFetch) => {
    return authenticatedFetch('/admin/practices/get-by-lessonId', {
      method: 'POST',
      body: JSON.stringify({ lessonId }),
    });
  },

  /**
   * Create a new practice
   * @param {Object} practiceData - Practice data
   * @param {Function} authenticatedFetch
   */
  create: async (practiceData, authenticatedFetch) => {
    return authenticatedFetch('/admin/practices/create', {
      method: 'POST',
      body: JSON.stringify(practiceData),
    });
  },

  /**
   * Update a practice
   * @param {string} id - Practice ID
   * @param {Object} practiceData - Updated practice data
   * @param {Function} authenticatedFetch
   */
  update: async (id, practiceData, authenticatedFetch) => {
    return authenticatedFetch('/admin/practices/update', {
      method: 'POST',
      body: JSON.stringify({ id, ...practiceData }),
    });
  },

  /**
   * Delete a practice
   * @param {string} id - Practice ID
   * @param {Function} authenticatedFetch
   */
  delete: async (id, authenticatedFetch) => {
    return authenticatedFetch('/admin/practices/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },
};

// ============================================================
// PAYMENT MANAGEMENT
// ============================================================

export const paymentManagement = {
  /**
   * Create a payment manually
   * @param {Object} paymentData - Payment data
   * @param {Function} authenticatedFetch
   */
  createPayment: async (paymentData, authenticatedFetch) => {
    return authenticatedFetch('/admin/payments/create-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  /**
   * Get all payments
   * @param {Function} authenticatedFetch
   */
  getAllPayments: async (authenticatedFetch) => {
    return authenticatedFetch('/admin/payments/get-all-payments', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @param {Function} authenticatedFetch
   */
  getPaymentById: async (paymentId, authenticatedFetch) => {
    return authenticatedFetch('/admin/payments/get-payment-by-id', {
      method: 'POST',
      body: JSON.stringify({ paymentId }),
    });
  },

  /**
   * Search payments by email or phone
   * @param {Object} searchParams - { email?, phoneNumber? }
   * @param {Function} authenticatedFetch
   */
  searchPayments: async (searchParams, authenticatedFetch) => {
    return authenticatedFetch('/admin/payments/search-payments', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  },
};

// ============================================================
// COMMENT MANAGEMENT
// ============================================================

export const commentManagement = {
  /**
   * Get all comments with pagination
   * @param {string} status - Comment status (PENDING or APPROVED)
   * @param {number} page - Page number
   * @param {Function} authenticatedFetch
   */
  getAll: async (status, page, authenticatedFetch) => {
    return authenticatedFetch('/admin/comment/get-all', {
      method: 'POST',
      body: JSON.stringify({ status, page }),
    });
  },

  /**
   * Change comment status
   * @param {string} commentId - Comment ID
   * @param {string} newStatus - New status (PENDING or APPROVED)
   * @param {Function} authenticatedFetch
   */
  changeStatus: async (commentId, newStatus, authenticatedFetch) => {
    return authenticatedFetch('/admin/comment/change-status', {
      method: 'POST',
      body: JSON.stringify({ commentId, newStatus }),
    });
  },

  /**
   * Delete comment by ID
   * @param {string} commentId - Comment ID
   * @param {Function} authenticatedFetch
   */
  deleteById: async (commentId, authenticatedFetch) => {
    return authenticatedFetch('/admin/comment/delete-by-id', {
      method: 'POST',
      body: JSON.stringify({ commentId }),
    });
  },
};

// ============================================================
// QUESTION MANAGEMENT
// ============================================================

export const questionManagement = {
  /**
   * Get all questions with pagination
   * @param {string} status - Question status (optional: PENDING or ANSWERED)
   * @param {number} page - Page number
   * @param {Function} authenticatedFetch
   */
  getQuestions: async (status, page, authenticatedFetch) => {
    const body = { page };
    if (status) {
      body.status = status;
    }
    return authenticatedFetch('/admin/questions/get-questions', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Answer a question
   * @param {string} questionId - Question ID
   * @param {string} answer - Answer text
   * @param {Function} authenticatedFetch
   */
  answerQuestion: async (questionId, answer, authenticatedFetch) => {
    return authenticatedFetch('/admin/questions/answer-question', {
      method: 'POST',
      body: JSON.stringify({ questionId, answer }),
    });
  },
};

// ============================================================
// UPLOADER
// ============================================================

export const uploader = {
  /**
   * Upload an image file
   * @param {File} file - Image file
   * @param {Function} authenticatedFetch
   */
  uploadImage: async (file, authenticatedFetch) => {
    const formData = new FormData();
    formData.append('file', file);

    // Note: Don't set Content-Type header - browser will set it automatically with boundary
    return authenticatedFetch('/uploader/upload', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Get uploaded images with pagination
   * @param {number} page - Page number
   * @param {Function} authenticatedFetch
   */
  getImages: async (page, authenticatedFetch) => {
    return authenticatedFetch('/images', {
      method: 'POST',
      body: JSON.stringify({ page }),
    });
  },
};

