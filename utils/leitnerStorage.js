/**
 * Leitner Flashcard System - Local Storage Implementation
 * 
 * 5-Box Spaced Repetition System:
 * - Box 1: Review daily (1 day interval)
 * - Box 2: Review every 2 days
 * - Box 3: Review every 4 days
 * - Box 4: Review every 8 days
 * - Box 5: Review every 16 days
 */

const STORAGE_KEY = 'leitner_flashcards';

// Box intervals in days
const BOX_INTERVALS = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
};

// Box colors for UI
export const BOX_COLORS = {
  1: { bg: 'from-red-500 to-orange-500', text: 'text-red-600', badge: 'bg-red-500/10 text-red-600' },
  2: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-600', badge: 'bg-orange-500/10 text-orange-600' },
  3: { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-600', badge: 'bg-amber-500/10 text-amber-600' },
  4: { bg: 'from-lime-500 to-green-500', text: 'text-lime-600', badge: 'bg-lime-500/10 text-lime-600' },
  5: { bg: 'from-green-500 to-emerald-500', text: 'text-green-600', badge: 'bg-green-500/10 text-green-600' },
};

/**
 * Generate unique ID
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all flashcards from local storage
 */
const getAllFlashcards = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading flashcards:', error);
    return [];
  }
};

/**
 * Save flashcards to local storage
 */
const saveFlashcards = (flashcards) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
    // Dispatch custom event for cross-tab/component sync
    window.dispatchEvent(new CustomEvent('leitnerUpdate', { detail: flashcards }));
  } catch (error) {
    console.error('Error saving flashcards:', error);
  }
};

/**
 * Add a new flashcard
 */
export const addFlashcard = (front, back, courseId = null, lessonId = null, sourcePage = null) => {
  if (!front || !back) {
    throw new Error('Front and back are required');
  }

  const flashcard = {
    id: generateId(),
    front: front.trim(),
    back: back.trim(),
    box: 1, // Always start in Box 1
    lastReviewDate: null, // Never reviewed
    createdDate: new Date().toISOString(),
    courseId,
    lessonId,
    sourcePage,
    reviewCount: 0,
    correctCount: 0,
  };

  const flashcards = getAllFlashcards();
  flashcards.push(flashcard);
  saveFlashcards(flashcards);

  return flashcard;
};

/**
 * Get flashcards with optional filters
 */
export const getFlashcards = (filters = {}) => {
  let flashcards = getAllFlashcards();

  // Filter by course
  if (filters.courseId) {
    flashcards = flashcards.filter(card => card.courseId === filters.courseId);
  }

  // Filter by lesson
  if (filters.lessonId) {
    flashcards = flashcards.filter(card => card.lessonId === filters.lessonId);
  }

  // Filter by box
  if (filters.box) {
    flashcards = flashcards.filter(card => card.box === filters.box);
  }

  // Filter by due for review
  if (filters.dueForReview) {
    const now = new Date();
    flashcards = flashcards.filter(card => {
      if (!card.lastReviewDate) return true; // Never reviewed
      
      const lastReview = new Date(card.lastReviewDate);
      const interval = BOX_INTERVALS[card.box] || 1;
      const nextReviewDate = new Date(lastReview);
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);
      
      return now >= nextReviewDate;
    });
  }

  return flashcards;
};

/**
 * Get a single flashcard by ID
 */
export const getFlashcard = (id) => {
  const flashcards = getAllFlashcards();
  return flashcards.find(card => card.id === id);
};

/**
 * Update a flashcard
 */
export const updateFlashcard = (id, updates) => {
  const flashcards = getAllFlashcards();
  const index = flashcards.findIndex(card => card.id === id);

  if (index === -1) {
    throw new Error('Flashcard not found');
  }

  flashcards[index] = {
    ...flashcards[index],
    ...updates,
  };

  saveFlashcards(flashcards);
  return flashcards[index];
};

/**
 * Delete a flashcard
 */
export const deleteFlashcard = (id) => {
  const flashcards = getAllFlashcards();
  const filtered = flashcards.filter(card => card.id !== id);

  if (filtered.length === flashcards.length) {
    throw new Error('Flashcard not found');
  }

  saveFlashcards(filtered);
  return true;
};

/**
 * Move flashcard based on review result (core Leitner logic)
 */
export const moveFlashcard = (id, isCorrect) => {
  const flashcard = getFlashcard(id);
  
  if (!flashcard) {
    throw new Error('Flashcard not found');
  }

  let newBox = flashcard.box;

  if (isCorrect) {
    // Move up to next box (max Box 5)
    newBox = Math.min(flashcard.box + 1, 5);
  } else {
    // Move back to Box 1
    newBox = 1;
  }

  const updates = {
    box: newBox,
    lastReviewDate: new Date().toISOString(),
    reviewCount: (flashcard.reviewCount || 0) + 1,
    correctCount: (flashcard.correctCount || 0) + (isCorrect ? 1 : 0),
  };

  return updateFlashcard(id, updates);
};

/**
 * Get cards due for review
 */
export const getCardsDueForReview = (courseId = null) => {
  return getFlashcards({ dueForReview: true, courseId });
};

/**
 * Get statistics
 */
export const getStatistics = (courseId = null) => {
  const flashcards = courseId 
    ? getFlashcards({ courseId })
    : getAllFlashcards();

  const cardsDue = getCardsDueForReview(courseId).length;
  
  const boxDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let totalReviews = 0;
  let totalCorrect = 0;

  flashcards.forEach(card => {
    boxDistribution[card.box] = (boxDistribution[card.box] || 0) + 1;
    totalReviews += card.reviewCount || 0;
    totalCorrect += card.correctCount || 0;
  });

  const successRate = totalReviews > 0 
    ? Math.round((totalCorrect / totalReviews) * 100)
    : 0;

  return {
    total: flashcards.length,
    cardsDue,
    boxDistribution,
    totalReviews,
    totalCorrect,
    successRate,
  };
};

/**
 * Get all unique courses that have flashcards
 */
export const getCoursesList = () => {
  const flashcards = getAllFlashcards();
  const courses = {};

  flashcards.forEach(card => {
    if (card.courseId && !courses[card.courseId]) {
      courses[card.courseId] = {
        id: card.courseId,
        count: 0,
      };
    }
    if (card.courseId) {
      courses[card.courseId].count++;
    }
  });

  return Object.values(courses);
};

/**
 * Clear all flashcards (for testing/reset)
 */
export const clearAllFlashcards = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('leitnerUpdate', { detail: [] }));
};

/**
 * Export flashcards as JSON (for backup)
 */
export const exportFlashcards = () => {
  const flashcards = getAllFlashcards();
  return JSON.stringify(flashcards, null, 2);
};

/**
 * Import flashcards from JSON (for restore)
 */
export const importFlashcards = (jsonString) => {
  try {
    const flashcards = JSON.parse(jsonString);
    if (!Array.isArray(flashcards)) {
      throw new Error('Invalid format');
    }
    saveFlashcards(flashcards);
    return flashcards.length;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

