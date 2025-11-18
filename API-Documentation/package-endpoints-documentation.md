# Package Module Endpoints Documentation

## Overview

The Package Module provides endpoints for users to browse and interact with learning packages, chapters, parts, lessons, words, and personal notes. Most endpoints are publicly accessible, while personal note management requires authentication.

## Module Dependencies

The Package Module has the following structure:
- **PackageController**: Handles package browsing and personal note endpoints
- **PackageService**: Provides package browsing and personal note services
- **PackageManagementService**: Provides package management services (used by admin module)
- **Entities**: Package, Chapter, Part, Lesson, Word, PersonalNote

## Authentication

Most endpoints are **publicly accessible** (no authentication required). The following endpoint requires authentication:
- `POST /package/personal-note` - Requires `AccessTokenGuard`

For authenticated endpoints:
- **Authorization Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Access Token**: Valid JWT access token (verified by AccessTokenGuard)

---

## 1. Package Browsing Endpoints

**Base Path**: `/package`  
**Guard**: None (publicly accessible)

### 1.1 Get All Packages

**Endpoint**: `POST /package/all`

**Description**: Get all packages with pagination (10 packages per page).

**Request Body** (`GetAllPackagesDto`):
```typescript
{
  page: number;  // Required: Page number (minimum: 1)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "getting all packages successfully";
  data: {
    packages: Array<{
      id: string;                           // UUID
      packageName: string;
      subtitle: string;
      level: string;
      category: string[];
      rate: number | null;
      rateCount: number | null;
      description: string;
      originalPrice: number;
      discountedPrice: number | null;
      discountTitle: string;
      isInstallmentAvailable: boolean;
      installmentCount: number | null;
      source: string;
      imageUrl: string;
      badge: string;
      specifications: Array<{
        icon: string;
        label: string;
        value: string;
      }> | null;
      payments: Payment[];                  // Array of payment relations
      chapters: Chapter[];                  // Array of chapter relations
      comments: Comment[];                  // Array of comment relations
      createdAt: Date;
      updatedAt: Date;
    }>;
    page: number;           // Current page number
    pageSize: 10;           // Number of packages per page
    totalPages: number;     // Total number of pages
    total: number;          // Total number of packages
  };
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get all packages";
}
```

---

### 1.2 Get All Chapters of a Package

**Endpoint**: `POST /package/chapters`

**Description**: Get all chapters belonging to a specific package.

**Request Body** (`GetAllChapterDto`):
```typescript
{
  packageId: string;  // Required: Package ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "getting all chapters successfully";
  data: {
    chapters: Array<{
      id: string;                    // UUID
      title: string;
      numericOrder: number;
      package: Package;              // Package relation
      parts: Part[];                 // Array of part relations
    }>;
  };
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get all chapters";
}
```

---

### 1.3 Get All Parts of a Chapter

**Endpoint**: `POST /package/parts`

**Description**: Get all parts belonging to a specific chapter.

**Request Body** (`GetAllPartDto`):
```typescript
{
  chapterId: string;  // Required: Chapter ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "getting all parts successfully";
  data: {
    parts: Array<{
      id: string;                    // UUID
      title: string;
      numericOrder: number;
      chapter: Chapter;             // Chapter relation
      lessons: Lesson[];             // Array of lesson relations
    }>;
  };
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get all parts";
}
```

---

### 1.4 Get All Lessons of a Part

**Endpoint**: `POST /package/lessons`

**Description**: Get all lessons belonging to a specific part. Returns only the `id`, `title`, and `numericOrder` fields for each lesson.

**Request Body** (`GetAllLessonDto`):
```typescript
{
  partId: string;  // Required: Part ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "getting all lessons successfully";
  data: {
    lessons: Array<{
      id: string;                    // UUID
      title: string;
      numericOrder: number;
    }>;
  };
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get all lessons";
  data: null;
}
```

**Note**: This endpoint returns a limited set of fields (`id`, `title`, `numericOrder`) for performance optimization. To get full lesson details, use the free lesson endpoint or purchase the package.

---

### 1.5 Get Free Lesson

**Endpoint**: `POST /package/free-lesson`

**Description**: Get a free lesson by its ID. Only returns the lesson if it is marked as free (`isFree: true`).

**Request Body** (`GetFreeLessonDTO`):
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
  message: "getting free lesson successfully";
  data: {
    lesson: {
      id: string;                    // UUID
      title: string;
      description: string;
      numericOrder: number;
      imageUrl: string;
      isFree: boolean;               // Must be true
      part: Part;                    // Part relation
      words: Word[];                 // Array of word relations
      practices: Practice[];          // Array of practice relations
      questions: Question[];          // Array of question relations
    };
  };
}

// Error (404) - Free lesson not found
{
  status: 404;
  message: "free lesson not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get free lesson";
  data: null;
}
```

**Note**: This endpoint only returns lessons that are marked as free. If the lesson exists but is not free, it returns a 404 error.

---

### 1.6 Get Words by Lesson ID

**Endpoint**: `POST /package/words`

**Description**: Get all words belonging to a specific lesson.

**Request Body** (`GetWordsByLessonIdDto`):
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
  message: "Words fetched successfully";
  data: Array<{
    id: string;                    // UUID
    word: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    lesson: Lesson;                // Lesson relation
    personalNotes: PersonalNote[]; // Array of personal note relations
  }>;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while trying to get words by lesson id";
  data: null;
}
```

---

## 2. Personal Notes Endpoints

**Base Path**: `/package`  
**Guard**: `AccessTokenGuard` (required)

### 2.1 Create or Update Personal Note

**Endpoint**: `POST /package/personal-note`

**Description**: Create a new personal note for a word, or update an existing personal note if one already exists for the user and word combination. The endpoint automatically determines whether to create or update based on whether a note already exists.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`CreatePersonalNoteDto`):
```typescript
{
  wordId: string;   // Required: Word ID (UUID)
  content: string;  // Required: The content of the personal note
}
```

**Response**:
```typescript
// Success (201) - Note created
{
  status: 201;
  message: "Personal note created successfully";
}

// Success (200) - Note updated
{
  status: 200;
  message: "Personal note updated successfully";
}

// Error (500)
{
  status: 500;
  message: "An error occurred while trying to add personal notes";
  data: null;
}
```

**Behavior**:
- If a personal note already exists for the authenticated user and the specified word, the existing note's content is updated.
- If no personal note exists, a new one is created.
- The user is identified from the JWT token payload (`userId`).

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
  status: number;      // HTTP status code (404, 500, etc.)
  message: string;     // Error message
  data?: null;         // Usually null for errors
}
```

## Type Definitions

### Entity Structures

**Package**:
```typescript
{
  id: string;                           // UUID - Primary key
  packageName: string;
  subtitle: string;
  level: string;
  category: string[];
  rate: number | null;
  rateCount: number | null;
  description: string;
  originalPrice: number;
  discountedPrice: number | null;
  discountTitle: string;
  isInstallmentAvailable: boolean;
  installmentCount: number | null;
  source: string;
  imageUrl: string;
  badge: string;
  specifications: Array<{
    icon: string;
    label: string;
    value: string;
  }> | null;
  payments: Payment[];
  chapters: Chapter[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Chapter**:
```typescript
{
  id: string;                    // UUID - Primary key
  title: string;
  numericOrder: number;
  package: Package;              // Package relation
  parts: Part[];                 // Array of part relations
}
```

**Part**:
```typescript
{
  id: string;                    // UUID - Primary key
  title: string;
  numericOrder: number;
  chapter: Chapter;              // Chapter relation
  lessons: Lesson[];             // Array of lesson relations
}
```

**Lesson**:
```typescript
{
  id: string;                    // UUID - Primary key
  title: string;
  description: string;
  numericOrder: number;
  imageUrl: string;
  isFree: boolean;
  part: Part;                    // Part relation
  words: Word[];                 // Array of word relations
  practices: Practice[];         // Array of practice relations
  questions: Question[];         // Array of question relations
}
```

**Word**:
```typescript
{
  id: string;                    // UUID - Primary key
  word: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  lesson: Lesson;                // Lesson relation
  personalNotes: PersonalNote[]; // Array of personal note relations
}
```

**PersonalNote**:
```typescript
{
  id: string;                    // UUID - Primary key
  user: User;                    // User relation
  word: Word;                    // Word relation
  content: string;
  createdAt: Date;
}
```

## Data Hierarchy

The package structure follows this hierarchy:
```
Package
  └── Chapter
      └── Part
          └── Lesson
              ├── Word
              │   └── PersonalNote (user-specific)
              ├── Practice
              └── Question
```

## Notes

1. **Public Access**: Most endpoints are publicly accessible and do not require authentication. Users can browse packages, chapters, parts, lessons, and words without logging in.

2. **Authentication**: Only the personal note endpoint (`POST /package/personal-note`) requires authentication via `AccessTokenGuard`.

3. **Pagination**: 
   - Packages: 10 per page
   - Other endpoints return all matching records (no pagination)

4. **Free Lessons**: The `POST /package/free-lesson` endpoint only returns lessons marked as `isFree: true`. If a lesson exists but is not free, it returns a 404 error.

5. **Limited Lesson Fields**: The `POST /package/lessons` endpoint returns only `id`, `title`, and `numericOrder` for performance. Use the free lesson endpoint or purchase the package to get full lesson details.

6. **Personal Notes**: 
   - Each user can have one personal note per word
   - Creating a note for a word that already has a note updates the existing note
   - Personal notes are user-specific and private

7. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

8. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

9. **Relations**: When entities are returned with relations, the related objects may include nested data. The depth of relations depends on the service implementation and query configuration.

10. **Error Handling**: All endpoints return consistent error responses with appropriate HTTP status codes:
    - `404`: Resource not found
    - `500`: Internal server error

11. **Cascade Deletes**: 
    - Deleting a Package cascades to Chapters
    - Deleting a Chapter cascades to Parts
    - Deleting a Part cascades to Lessons
    - Deleting a Lesson cascades to Words

12. **Specifications**: Package specifications are stored as JSONB and contain an array of objects with `icon`, `label`, and `value` properties.

13. **Category**: Package categories are stored as a text array, allowing multiple categories per package.

14. **Pricing**: Packages have both `originalPrice` and `discountedPrice`. The `discountedPrice` can be null if no discount is applied.

15. **Installments**: Packages can support installment payments with `isInstallmentAvailable` and `installmentCount` fields.

