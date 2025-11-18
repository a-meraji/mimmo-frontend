# Comment Module Endpoints Documentation

## Overview

The Comment Module provides endpoints for users to create and view comments on packages. Users can create comments on packages, view approved comments for a package, and view all comments made by a specific user. Comments require admin approval before being visible to other users.

## Module Dependencies

The Comment Module imports the following modules:
- **UserModule**: User management services (for validating users when creating comments)
- **PackageModule**: Package management services (for validating packages when creating comments)

## Authentication

Comment endpoints have different authentication requirements:
- **Create Comment**: Requires `AccessTokenGuard` (JWT token)
- **Get Comments by Package ID**: No authentication required
- **Get Comments by User ID**: No authentication required

The `AccessTokenGuard` extracts the JWT token from the Authorization header, verifies it, and extracts the `userId` from the token payload.

---

## 1. Comment Management Endpoints

**Base Path**: `/comment`  
**Guard**: Varies by endpoint (see individual endpoint descriptions)

### 1.1 Create Comment

**Endpoint**: `POST /comment/create-comment`

**Description**: Create a new comment for a specific package. Comments are created with status `PENDING` by default and require admin approval before being visible to other users.

**Authentication**: Required (`AccessTokenGuard`)

**Request Body** (`CreateCommentDto`):
```typescript
{
  content: string;  // Required: The comment content/text
  packageId: string; // Required: Package ID (UUID)
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Comment created successfully";
  data: {
    comment: {
      id: string;                           // UUID
      content: string;
      status: CommentStatus;                // "PENDING"
      user: User;                           // User relation (current user)
      package: Package;                     // Package relation
      createdAt: Date;
    };
  };
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found or error occurred";
  data: null;
}

// Error (404) - Package not found
{
  status: 404;
  message: "Package not found or error occurred";
  data: null;
}

// Error (400) - Empty content
{
  status: 400;
  message: "Comment content cannot be empty";
  data: null;
}

// Error (400) - Failed to create
{
  status: 400;
  message: "Failed to create comment";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while creating the comment";
  data: null;
}
```

**Notes**:
- Comments are automatically associated with the authenticated user
- New comments are created with `status: "PENDING"` - waiting for admin approval
- Comment content cannot be empty or whitespace-only
- Only admins can approve comments (via admin endpoints)
- Once approved, comments become visible to all users when querying package comments

---

### 1.2 Get Comments by Package ID

**Endpoint**: `POST /comment/get-comments-by-package-id`

**Description**: Retrieve approved comments for a specific package with pagination. Only returns comments with status `APPROVED`. Useful for displaying package reviews and feedback.

**Authentication**: Not required

**Request Body** (`GetPackageCommentsDto`):
```typescript
{
  packageId: string; // Required: Package ID (UUID)
  page: number;      // Required: Page number (minimum: 0)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Comments retrieved successfully";
  data: {
    comments: Array<{
      id: string;                           // UUID
      content: string;
      status: CommentStatus;                // "APPROVED"
      user: {
        id: string;
        name: string | null;
        familyName: string | null;
        email: string | null;
        telegramId: string | null;
        isEmailVerified: boolean;
        phoneNumber: string | null;
        isPhoneNumberVerified: boolean;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
      };
      package: Package;                     // Package relation
      createdAt: Date;
    }>;
  };
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving comments";
  data: null;
}
```

**Notes**:
- Only returns comments with status `APPROVED`
- Pagination: 10 comments per page
- Page numbers are 0-based (page 0 = first page)
- Comments are returned in the order they were created
- User relation is included in the response
- Pending comments are not included in the results

---

### 1.3 Get Comments by User ID

**Endpoint**: `POST /comment/get-comments-by-user-id`

**Description**: Retrieve all comments made by a specific user with pagination. Returns all comments regardless of status (both PENDING and APPROVED). Useful for users to view their own comment history.

**Authentication**: Not required

**Request Body** (`GetUserCommentsDto`):
```typescript
{
  userId: string; // Required: User ID (UUID)
  page: number;     // Required: Page number (minimum: 1)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "User comments retrieved successfully";
  data: {
    comments: Array<{
      id: string;                           // UUID
      content: string;
      status: CommentStatus;                // "PENDING" | "APPROVED"
      user: User;                           // User relation
      package: {
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
      };
      createdAt: Date;
    }>;
  };
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving user comments";
  data: null;
}
```

**Notes**:
- Returns all comments for the specified user, regardless of status
- Pagination: 10 comments per page
- Page numbers are 1-based (page 1 = first page)
- Comments are returned in the order they were created
- Package relation is included in the response
- Includes both pending and approved comments

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
  data: null;          // Always null for errors
}
```

---

## Type Definitions

### Enums

**CommentStatus**:
```typescript
enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}
```

---

## Notes

1. **AccessTokenGuard**: Only the `create-comment` endpoint requires authentication. The guard verifies:
   - Valid JWT token in `Authorization: Bearer <token>` header
   - Extracts `userId` from the token payload

2. **Comment Lifecycle**:
   - User creates a comment → Status: `PENDING`
   - Admin approves the comment → Status: `APPROVED`
   - Approved comments are visible to all users when querying package comments
   - Pending comments are only visible to the user who created them (via get-comments-by-user-id)

3. **Comment Status**:
   - **PENDING**: Comment has been created but not yet approved by admin
   - **APPROVED**: Comment has been approved by admin and is visible to all users

4. **Admin Operations**: 
   - Approving comments, changing status, and deleting comments are handled through admin endpoints (see Admin Module documentation)
   - Admin endpoints are in `/admin/comment` (not part of this module)

5. **Pagination**: 
   - `get-comments-by-package-id` uses 0-based pagination (page 0 = first page)
   - `get-comments-by-user-id` uses 1-based pagination (page 1 = first page)
   - Both endpoints return 10 comments per page

6. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

7. **Request Methods**: All endpoints use `POST` method

8. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

9. **Relations**: 
    - Comments are linked to both `User` (who made the comment) and `Package` (which package it's about)
    - Relations are included in responses when using TypeORM's `find` operations
    - User relation is `eager: true` in the entity, so it's always loaded
    - Package relation is `eager: true` in the entity, so it's always loaded

10. **Content Validation**: 
    - Comment content cannot be empty
    - Comment content cannot be whitespace-only
    - Content is validated before saving

11. **User and Package Validation**: 
    - When creating a comment, both the user and package are validated
    - If user or package is not found, the comment creation fails with a 404 error

12. **Comment Visibility**:
    - Pending comments are only visible to the user who created them (via get-comments-by-user-id)
    - Approved comments are visible to all users (via get-comments-by-package-id)
    - Users can see all their own comments regardless of status

13. **Error Handling**: All endpoints return a consistent error format with appropriate status codes and error messages.

14. **Comment Content**: The `content` field contains the actual comment text written by the user.

