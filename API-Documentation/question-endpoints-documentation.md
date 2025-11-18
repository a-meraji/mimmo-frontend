# Question Module Endpoints Documentation

## Overview

The Question Module provides endpoints for users to ask questions about lessons and view questions from other users. Users can create questions, view their own questions on specific lessons, and browse public answered questions. The module supports both private and public question visibility, with questions requiring admin approval before being answered.

## Module Dependencies

The Question Module imports the following modules:
- **TypeORM**: For database entity management (Question entity)

## Authentication

Question endpoints have different authentication requirements:
- **Create Question**: Requires `AccessTokenGuard` (JWT token)
- **Get User Questions on Lesson**: No authentication required
- **Get Lesson Public Questions**: No authentication required

The `AccessTokenGuard` extracts the JWT token from the Authorization header, verifies it, and extracts the `userId` from the token payload.

---

## 1. Question Management Endpoints

**Base Path**: `/question`  
**Guard**: Varies by endpoint (see individual endpoint descriptions)

### 1.1 Get User Questions on Lesson

**Endpoint**: `POST /question/get-user-questions-on-lesson`

**Description**: Retrieve all questions asked by a specific user for a specific lesson. Returns all questions regardless of status or visibility.

**Authentication**: Not required

**Request Body** (`GetUserQuestionsOnLessonDto`):
```typescript
{
  userId: string;   // Required: User ID (UUID)
  lessonId: string; // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "User questions on lesson retrieved successfully";
  data: Array<{
    id: string;                           // UUID
    content: string;                      // Question content
    answer: string;                       // Answer (may be empty if not answered)
    status: QuestionStatus;               // "PENDING" | "ANSWERED"
    visibility: QuestionVisibility;        // "PUBLIC" | "PRIVATE"
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

**Notes**:
- Returns all questions for the specified user and lesson, regardless of status or visibility
- Questions are returned in the order they were created
- Includes both answered and pending questions
- Includes both public and private questions

---

### 1.2 Create Question

**Endpoint**: `POST /question/create-question`

**Description**: Create a new question for a specific lesson. Questions are created with status `PENDING` and visibility `PRIVATE` by default. An admin must answer the question before it can be made public.

**Authentication**: Required (`AccessTokenGuard`)

**Request Body** (`CreateQuestionDto`):
```typescript
{
  content: string;  // Required: The question content/text
  lessonId: string; // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Question created successfully";
  data: {
    id: string;                           // UUID
    content: string;
    answer: string;                       // Empty string initially
    status: QuestionStatus;               // "PENDING"
    visibility: QuestionVisibility;        // "PRIVATE"
    user: User;                           // User relation (current user)
    lesson: Lesson;                       // Lesson relation
    createdAt: Date;
  };
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Questions are automatically associated with the authenticated user
- New questions are created with:
  - `status: "PENDING"` - Waiting for admin to answer
  - `visibility: "PRIVATE"` - Only visible to the user who created it
  - `answer: ""` - Empty answer until admin responds
- Only admins can answer questions (via admin endpoints)
- Once answered, admins can change visibility to `PUBLIC` if appropriate

---

### 1.3 Get Lesson Public Questions

**Endpoint**: `POST /question/get-lesson-public-questions`

**Description**: Retrieve public answered questions for a specific lesson with pagination. Only returns questions that are both `PUBLIC` and `ANSWERED`. Useful for users to see common questions and answers from other users.

**Authentication**: Not required

**Request Body** (`GetLessonPublicQuestionDto`):
```typescript
{
  lessonId: string; // Required: Lesson ID (UUID)
  page: number;      // Required: Page number (1-based)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Public questions on lesson retrieved successfully";
  data: {
    questions: Array<{
      id: string;                           // UUID
      content: string;
      answer: string;                       // Admin-provided answer
      status: QuestionStatus;               // "ANSWERED"
      visibility: QuestionVisibility;        // "PUBLIC"
      user: User;                           // User who asked the question
      lesson: Lesson;                       // Lesson relation
      createdAt: Date;
    }>;
    total: number;                          // Total number of public answered questions
    page: number;                           // Current page number
    pageSize: 10;                           // Number of questions per page
  };
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Only returns questions that are both `PUBLIC` and `ANSWERED`
- Pagination: 10 questions per page
- Questions are returned in the order they were created
- Useful for users to browse common questions and learn from answers
- Private questions and pending questions are not included

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
  status: number;      // HTTP status code (500, etc.)
  message: string;     // Error message
  data: null;          // Always null for errors
}
```

---

## Type Definitions

### Enums

**QuestionStatus**:
```typescript
enum QuestionStatus {
  PENDING = 'PENDING',
  ANSWERED = 'ANSWERED',
}
```

**QuestionVisibility**:
```typescript
enum QuestionVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
```

---

## Notes

1. **AccessTokenGuard**: Only the `create-question` endpoint requires authentication. The guard verifies:
   - Valid JWT token in `Authorization: Bearer <token>` header
   - Extracts `userId` from the token payload

2. **Question Lifecycle**:
   - User creates a question → Status: `PENDING`, Visibility: `PRIVATE`
   - Admin answers the question → Status: `ANSWERED`
   - Admin can change visibility to `PUBLIC` if appropriate
   - Public answered questions are visible to all users

3. **Question Visibility**:
   - **PRIVATE**: Only visible to the user who created it
   - **PUBLIC**: Visible to all users (only if answered)

4. **Question Status**:
   - **PENDING**: Question has been asked but not yet answered by admin
   - **ANSWERED**: Question has been answered by admin

5. **Admin Operations**: 
   - Answering questions and changing visibility are handled through admin endpoints (see Admin Module documentation)
   - Admin endpoints are in `/admin/questions` (not part of this module)

6. **Pagination**: 
   - `get-lesson-public-questions` uses pagination with 10 questions per page
   - Page numbers are 1-based

7. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

8. **Request Methods**: All endpoints use `POST` method

9. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

10. **Relations**: 
    - Questions are linked to both `User` (who asked) and `Lesson` (which lesson it's about)
    - Relations are included in responses when using TypeORM's `find` operations

11. **Error Handling**: All endpoints return a consistent error format with status 500 and "Internal server error" message for unexpected errors.

12. **Question Content**: The `content` field contains the actual question text asked by the user.

13. **Answer Field**: 
    - Initially empty when question is created
    - Populated by admin when answering the question
    - Only visible in responses if the question is answered

