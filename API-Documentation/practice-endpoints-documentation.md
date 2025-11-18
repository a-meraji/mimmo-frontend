# Practice Module Endpoints Documentation

## Overview

The Practice Module provides endpoints for users to retrieve practice questions associated with lessons. Practice questions are multiple-choice questions used for learning and assessment within lessons.

## Module Dependencies

The Practice Module has the following structure:
- **PracticeController**: Handles practice retrieval endpoints
- **PracticeService**: Provides practice retrieval services
- **PracticeManagementService**: Provides practice management services (used by admin module)
- **Practice Entity**: TypeORM entity representing practice questions
- **PackageModule**: Dependency for lesson validation

## Authentication

All practice endpoints are **publicly accessible** (no authentication required).

---

## 1. Practice Retrieval Endpoints

**Base Path**: `/practice`  
**Guard**: None (publicly accessible)

### 1.1 Get Practices by Lesson ID

**Endpoint**: `POST /practice/get-practices-by-lesson-id`

**Description**: Get all practice questions associated with a specific lesson. Returns all practice questions including their questions, options, correct answers, explanations, and images.

**Request Body** (`GetPracticesByLessonIdDto`):
```typescript
{
  lessonId: string;  // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Practices retrieved successfully";
  data: Array<{
    id: string;                    // UUID
    question: string;              // Practice question text
    options: object;                // JSON object with options (e.g., { a: "option1", b: "option2", c: "option3", d: "option4" })
    imageUrl: string | null;        // Optional image URL for the question
    correctAnswer: string;          // Correct answer key (e.g., "a", "b", "c", or "d")
    explanation: string | null;     // Optional explanation for the correct answer
    lesson: {
      id: string;                  // UUID
      title: string;
      description: string;
      numericOrder: number;
      imageUrl: string;
      isFree: boolean;
      part: Part;                  // Part relation
      words: Word[];               // Array of word relations
      practices: Practice[];       // Array of practice relations
      questions: Question[];       // Array of question relations
    };
  }>;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving the practices";
}
```

**Notes**:
- Returns all practices for the specified lesson
- Practices are returned in the order they were created
- The `options` field is a JSON object that typically contains keys like "a", "b", "c", "d" with corresponding option text values
- The `correctAnswer` field contains the key (e.g., "a", "b", "c", "d") that corresponds to the correct option
- If a lesson has no practices, an empty array is returned
- The lesson relation is included in the response

---

## Common Response Patterns

### Success Response Structure
All successful responses follow this pattern:
```typescript
{
  status: number;      // HTTP status code (200, etc.)
  message: string;     // Success message
  data: T | null;      // Response data (type varies by endpoint)
}
```

### Error Response Structure
All error responses follow this pattern:
```typescript
{
  status: number;      // HTTP status code (500, etc.)
  message: string;     // Error message
  data?: null;         // Usually null for errors
}
```

## Type Definitions

### Entity Structure

**Practice**:
```typescript
{
  id: string;                    // UUID - Primary key
  question: string;              // Practice question text
  options: object;               // JSON object with options (typically { a: string, b: string, c: string, d: string })
  imageUrl: string | null;        // Optional image URL for the question
  correctAnswer: string;          // Correct answer key (e.g., "a", "b", "c", or "d")
  explanation: string | null;     // Optional explanation for the correct answer
  lesson: Lesson;                 // Lesson relation
}
```

### Options Object Structure

The `options` field is a JSON object that typically follows this structure:
```typescript
{
  a: string;  // Option A text
  b: string;  // Option B text
  c: string;  // Option C text
  d: string;  // Option D text
}
```

However, the structure is flexible and can contain any key-value pairs as needed.

### Example Practice Object

```typescript
{
  id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  question: "What is the correct syntax for a JavaScript function?",
  options: {
    a: "function myFunc() {}",
    b: "func myFunc() {}",
    c: "def myFunc() {}",
    d: "function: myFunc() {}"
  },
  imageUrl: "https://example.com/image.png",
  correctAnswer: "a",
  explanation: "In JavaScript, functions are declared using the function keyword.",
  lesson: {
    id: "lesson-uuid",
    title: "Introduction to JavaScript",
    description: "Learn the basics of JavaScript",
    numericOrder: 1,
    imageUrl: "https://example.com/lesson-image.png",
    isFree: true,
    part: { /* Part object */ },
    words: [ /* Word array */ ],
    practices: [ /* Practice array */ ],
    questions: [ /* Question array */ ]
  }
}
```

## Data Relationships

Practices are related to lessons in a many-to-one relationship:
- One lesson can have multiple practices
- Each practice belongs to exactly one lesson
- Practices are used for assessment and learning within lessons

## Notes

1. **Public Access**: All practice endpoints are publicly accessible and do not require authentication. Users can retrieve practice questions without logging in.

2. **No Pagination**: The endpoint returns all practices for a lesson in a single response. There is no pagination implemented.

3. **Options Format**: The `options` field is stored as JSONB in the database, allowing flexible option structures. The typical format includes keys "a", "b", "c", "d" with string values.

4. **Correct Answer**: The `correctAnswer` field contains the key that corresponds to the correct option in the `options` object (e.g., "a", "b", "c", "d").

5. **Image Support**: Practices can include an optional image URL to display images alongside the question.

6. **Explanation**: Practices can include an optional explanation that provides additional context or reasoning for the correct answer.

7. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

8. **Date Fields**: Practice entities do not have createdAt or updatedAt fields in the current implementation.

9. **Lesson Relation**: The lesson relation is included in the response, providing full lesson details for each practice.

10. **Empty Results**: If a lesson has no practices, the endpoint returns an empty array with a 200 status code.

11. **Error Handling**: All endpoints return consistent error responses with appropriate HTTP status codes:
    - `500`: Internal server error

12. **Database Storage**: 
    - `options` is stored as JSONB in PostgreSQL
    - `question` and `explanation` are stored as text
    - `imageUrl` and `correctAnswer` are stored as varchar

13. **Admin Management**: Practice creation, update, and deletion are handled through the Admin module endpoints (documented in admin-endpoints-documentation.md).

14. **Use Cases**: Practices are typically used for:
    - Learning assessment within lessons
    - Self-evaluation
    - Progress tracking
    - Exam preparation

15. **Integration**: Practices are integrated with the Exam module for creating exams and tracking user performance.

