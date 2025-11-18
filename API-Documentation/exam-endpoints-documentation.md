# Exam Module Endpoints Documentation

## Overview

The Exam Module provides endpoints for creating, managing, and completing exams. Users can create exams from practice questions in selected lessons, answer questions, track their progress, and view results. All exam endpoints are protected by the `AccessTokenGuard`, which verifies that the requesting user has a valid JWT token.

## Module Dependencies

The Exam Module uses the following entities:
- **Exam**: Main exam entity
- **ExamQuestion**: Individual questions within an exam
- **PracticeHistory**: History of practice attempts
- **Practice**: Practice questions from lessons
- **ProgressTracker**: Tracks user progress through lessons

## Authentication

All exam endpoints require:
- **Authorization Header**: `Authorization: Bearer <JWT_TOKEN>`
- **User Authentication**: Verified by `AccessTokenGuard`

The `AccessTokenGuard` extracts the JWT token from the Authorization header and verifies it. The user ID is extracted from the token and used to associate exams with the authenticated user.

---

## 1. Exam Creation and Management

**Base Path**: `/exam`  
**Guard**: `AccessTokenGuard` (required)

### 1.1 Create Exam

**Endpoint**: `POST /exam/create`

**Description**: Create a new exam with randomized questions from selected lessons. The exam will be created in `IN_PROGRESS` status. Users can only have one in-progress exam at a time.

**Request Body** (`CreateExamDto`):
```typescript
{
  lessonIds: string[];                    // Required: Array of lesson IDs (UUIDs) - at least 1 lesson
  totalQuestions: number;                 // Required: Total number of questions (minimum: 1)
  timeLimitMinutes?: number;              // Optional: Time limit in minutes (minimum: 1 if provided)
  showAnswersAfterEachQuestion: boolean;  // Required: Whether to show answers after each question or at the end
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Exam created successfully";
  data: {
    examId: string;                       // UUID
    totalQuestions: number;
    timeLimitMinutes: number | null;
    showAnswersAfterEachQuestion: boolean;
  };
}

// Error (400) - User already has an in-progress exam
{
  status: 400;
  message: "User already has an in-progress exam";
  data: null;
}

// Error (400) - No practices found
{
  status: 400;
  message: "No practices found for the selected lessons";
  data: null;
}

// Error (400) - Not enough practices
{
  status: 400;
  message: "Not enough practices available";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

---

### 1.2 Start Exam

**Endpoint**: `POST /exam/start`

**Description**: Start an exam by setting the `startedAt` timestamp. This begins the timer if a time limit is set. The exam must be in `IN_PROGRESS` status and not already started.

**Request Body** (`StartExamDto`):
```typescript
{
  examId: string;  // Required: Exam ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Exam started successfully";
  data: {
    examId: string;
    startedAt: Date;
    timeLimitMinutes: number | null;
  };
}

// Error (404) - Exam not found
{
  status: 404;
  message: "Exam not found";
  data: null;
}

// Error (400) - Exam not in progress
{
  status: 400;
  message: "Exam is not in progress";
  data: null;
}

// Error (400) - Exam already started
{
  status: 400;
  message: "Exam already started";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

---

### 1.3 Get Current Question

**Endpoint**: `POST /exam/current-question`

**Description**: Get the current question for an exam. Optionally navigate to a specific question by providing `questionNumber`. The response does not include the correct answer unless the exam is completed or `showAnswersAfterEachQuestion` is enabled and the question has been answered.

**Request Body** (`GetCurrentQuestionDto`):
```typescript
{
  examId: string;         // Required: Exam ID (UUID)
  questionNumber?: number; // Optional: Question number to navigate to (1-based, minimum: 1)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Current question retrieved successfully";
  data: {
    questionId: string;                   // UUID
    questionNumber: number;                // 1-based question number
    totalQuestions: number;
    practice: {
      id: string;                         // Practice ID (UUID)
      question: string;
      options: object;                    // JSON object with options (e.g., { a: "option1", b: "option2", c: "option3", d: "option4" })
      imageUrl: string | null;
    };
    timeRemaining: number | null;         // Minutes remaining (null if no time limit)
  };
}

// Error (404) - Exam not found
{
  status: 404;
  message: "Exam not found";
  data: null;
}

// Error (400) - Exam already completed
{
  status: 400;
  message: "Exam is already completed";
  data: null;
}

// Error (400) - Time limit exceeded
{
  status: 400;
  message: "Exam time limit exceeded";
  data: null;
}

// Error (400) - Invalid question number
{
  status: 400;
  message: "Question number must be between 1 and {totalQuestions}";
  data: null;
}

// Error (404) - No more questions
{
  status: 404;
  message: "No more questions available";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

---

### 1.4 Answer Question

**Endpoint**: `POST /exam/answer`

**Description**: Submit an answer for a question in an exam. The answer is validated against the correct answer, and the result is saved. If `showAnswersAfterEachQuestion` is enabled, the correct answer and explanation are returned immediately. The question cannot be answered again if answers are shown after each question and it has already been answered.

**Request Body** (`AnswerQuestionDto`):
```typescript
{
  examId: string;           // Required: Exam ID (UUID)
  questionId: string;       // Required: Exam question ID (UUID)
  userAnswer?: string;      // Optional: User's selected answer (e.g., "a", "b", "c", "d") - can be null if not answered
  isUnsure: IsUnsure;       // Required: Whether user selected "I am not sure" - "unsure" | "sure" | "not_answered"
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Answer submitted successfully";
  data: {
    questionId: string;
    questionNumber: number;
    isAnswered: boolean;
    currentQuestionIndex: number;
    result?: {                            // Only included if showAnswersAfterEachQuestion is true
      correctAnswer: string;
      isCorrect: IsCorrect;              // "correct" | "incorrect" | "not_answered"
      explanation: string | null;
    };
  };
}

// Error (404) - Exam not found
{
  status: 404;
  message: "Exam not found";
  data: null;
}

// Error (400) - Exam not in progress
{
  status: 400;
  message: "Exam is not in progress";
  data: null;
}

// Error (404) - Question not found
{
  status: 404;
  message: "Question not found in this exam";
  data: null;
}

// Error (400) - Question already answered
{
  status: 400;
  message: "Question already answered and cannot be answered again because answers are shown after each question";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

---

### 1.5 Complete Exam

**Endpoint**: `POST /exam/complete`

**Description**: Complete an exam and mark it as `COMPLETED`. This also tracks progress for the specified lesson. The exam must be in `IN_PROGRESS` status.

**Request Body** (`CompleteExamDto`):
```typescript
{
  examId: string;   // Required: Exam ID (UUID)
  lessonId: string; // Required: Lesson ID (UUID) for progress tracking
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Exam completed successfully";
  data: null;
}

// Error (404) - Exam not found
{
  status: 404;
  message: "Exam not found";
}

// Error (400) - Exam already completed
{
  status: 400;
  message: "Exam is already completed";
}

// Error (500)
{
  status: 500;
  message: "Failed to complete exam";
}
```

---

### 1.6 Get Exam Result

**Endpoint**: `GET /exam/result`

**Description**: Get detailed results for a completed exam, including all questions, user answers, correct answers, and overall statistics.

**Query Parameters** (`GetExamResultDto`):
```typescript
{
  examId: string;  // Required: Exam ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Exam results retrieved successfully";
  data: {
    examId: string;
    status: ExamStatus;                  // "in_progress" | "completed" | "abandoned"
    totalQuestions: number;
    totalAnswered: number;
    totalCorrect: number;
    totalUnsure: number;
    score: number;                        // Percentage score (0-100)
    startedAt: Date | null;
    completedAt: Date | null;
    questions: Array<{
      questionNumber: number;
      practice: {
        id: string;                      // Practice ID (UUID)
        question: string;
        options: object;
        imageUrl: string | null;
        correctAnswer: string;
        explanation: string | null;
      };
      userAnswer: string | null;
      isUnsure: IsUnsure;                // "unsure" | "sure" | "not_answered"
      isCorrect: IsCorrect | null;       // "correct" | "incorrect" | "not_answered"
      isAnswered: boolean;
    }>;
  };
}

// Error (404) - Exam not found
{
  status: 404;
  message: "Exam not found";
}

// Error (500)
{
  status: 500;
  message: "Failed to get exam result";
}
```

---

### 1.7 Get User Exams

**Endpoint**: `GET /exam/my-exams`

**Description**: Get all exams for the authenticated user, ordered by creation date (newest first).

**Request Body**: None

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "User exams retrieved successfully";
  data: Array<{
    examId: string;
    status: ExamStatus;                  // "in_progress" | "completed" | "abandoned"
    totalQuestions: number;
    currentQuestionIndex: number;
    timeLimitMinutes: number | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
  }>;
}

// Error (500)
{
  status: 500;
  message: "Failed to get user exams";
}
```

---

## 2. Practice History

**Base Path**: `/exam`  
**Guard**: `AccessTokenGuard` (required)

### 2.1 Get Practice History

**Endpoint**: `GET /exam/practice-history`

**Description**: Get the history of attempts for a specific practice question across all exams for the authenticated user. Returns statistics including total attempts, correct/wrong/not answered counts, and unsure count.

**Query Parameters** (`GetPracticeHistoryDto`):
```typescript
{
  practiceId: string;  // Required: Practice ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Practice history retrieved successfully";
  data: {
    practiceId: string;
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    notAnsweredCount: number;
    unsureCount: number;
  };
}

// Error (500)
{
  status: 500;
  message: "Failed to get practice history";
}
```

---

## 3. Progress Tracking

**Base Path**: `/exam`  
**Guard**: `AccessTokenGuard` (required)

### 3.1 Get Progress Tracker

**Endpoint**: `POST /exam/progress-tracker`

**Description**: Get progress tracker records for specified lessons. Progress is tracked when an exam is completed for a lesson.

**Request Body** (`GetProgressTrackerDto`):
```typescript
{
  lessonId: string[];  // Required: Array of lesson IDs (UUIDs)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Progress tracker retrieved successfully";
  data: Array<{
    id: string;                           // UUID
    user: User;                           // User relation
    lesson: Lesson;                       // Lesson relation
    createdAt: Date;
  }>;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

---

## Common Response Patterns

### Success Response Structure
All successful responses follow this pattern:
```typescript
{
  status: number;      // HTTP status code (200, 201, etc.)
  message: string;     // Success message
  data: T | null;      // Response data (type varies by endpoint)
}
```

### Error Response Structure
All error responses follow this pattern:
```typescript
{
  status: number;      // HTTP status code (400, 404, 500, etc.)
  message: string;     // Error message
  data?: null;         // Usually null for errors
}
```

---

## Type Definitions

### Enums

**ExamStatus**:
```typescript
enum ExamStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}
```

**IsCorrect**:
```typescript
enum IsCorrect {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  NOT_ANSWERED = 'not_answered',
}
```

**IsUnsure**:
```typescript
enum IsUnsure {
  UNSURE = 'unsure',
  SURE = 'sure',
  NOT_ANSWERED = 'not_answered',
}
```

---

## Entity Structures

### Exam Entity
```typescript
{
  id: string;                              // UUID
  user: User;                              // User relation
  lessonIds: string[];                     // Array of lesson IDs
  totalQuestions: number;
  timeLimitMinutes: number | null;
  status: ExamStatus;
  showAnswersAfterEachQuestion: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
  currentQuestionIndex: number;
  questions: ExamQuestion[];               // Array of exam questions
  createdAt: Date;
  updatedAt: Date;
}
```

### ExamQuestion Entity
```typescript
{
  id: string;                              // UUID
  exam: Exam;                               // Exam relation
  practice: Practice;                       // Practice relation
  orderIndex: number;                       // Position in exam (0-based)
  userAnswer: string | null;                // Selected option (e.g., "a", "b", "c", "d")
  isUnsure: IsUnsure;
  isCorrect: IsCorrect;
  answeredAt: Date | null;
  createdAt: Date;
}
```

### PracticeHistory Entity
```typescript
{
  id: string;                              // UUID
  user: User;                               // User relation
  practice: Practice;                       // Practice relation
  exam: Exam;                               // Exam relation
  userAnswer: string | null;
  isCorrect: IsCorrect;
  isUnsure: IsUnsure;
  createdAt: Date;
}
```

### ProgressTracker Entity
```typescript
{
  id: string;                              // UUID
  user: User;                               // User relation
  lesson: Lesson;                           // Lesson relation
  createdAt: Date;
}
```

---

## Notes

1. **AccessTokenGuard**: All endpoints require the `AccessTokenGuard`, which verifies:
   - Valid JWT token in `Authorization: Bearer <token>` header
   - User ID is extracted from the token and used for all operations

2. **One In-Progress Exam**: Users can only have one exam in `IN_PROGRESS` status at a time. Attempting to create a new exam while one is in progress will return an error.

3. **Question Randomization**: Questions are randomly selected from the available practices in the selected lessons using database-level randomization (`RANDOM()`).

4. **Time Limit**: 
   - If a time limit is set, the exam will be automatically completed when the time expires
   - Time remaining is calculated and returned with each question
   - Time limit is checked when getting the current question

5. **Answer Display Modes**:
   - `showAnswersAfterEachQuestion: true`: Correct answer and explanation are shown immediately after answering
   - `showAnswersAfterEachQuestion: false`: Answers are only shown when viewing exam results after completion

6. **Question Navigation**: Users can navigate to any question by providing `questionNumber` in the `getCurrentQuestion` endpoint. The `currentQuestionIndex` is updated when navigating.

7. **Practice History**: Every answer submission creates a record in `PracticeHistory`, allowing users to track their performance on individual practice questions across all exams.

8. **Progress Tracking**: Progress is tracked when an exam is completed. A `ProgressTracker` record is created for the lesson, indicating the user has completed an exam for that lesson.

9. **Score Calculation**: The score is calculated as `(totalCorrect / totalAnswered) * 100`. If no questions are answered, the score is 0.

10. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

11. **Request Methods**: 
    - Most endpoints use `POST` method
    - `GET /exam/result` and `GET /exam/practice-history` use `GET` method
    - `GET /exam/my-exams` uses `GET` method

12. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

13. **Options Format**: Practice options are stored as JSON objects with keys typically being "a", "b", "c", "d" and values being the option text.

14. **Auto-Complete**: If a time limit is set and exceeded, the exam is automatically marked as completed when attempting to get the current question.

15. **Question Re-answering**: If `showAnswersAfterEachQuestion` is enabled, questions cannot be answered again after being answered once. This prevents users from changing their answers after seeing the correct answer.
