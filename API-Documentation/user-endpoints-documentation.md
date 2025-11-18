# User Module Endpoints Documentation

## Overview

The User Module provides endpoints for users to manage their own profile information. All user endpoints require authentication via the `AccessTokenGuard`, which verifies that the requesting user has a valid JWT access token.

## Module Dependencies

The User Module has the following structure:
- **UserController**: Handles user profile endpoints
- **UserService**: Provides user profile management services
- **UserManagmentService**: Provides user management services (used by admin module)
- **User Entity**: TypeORM entity representing the user data model

## Authentication

All user endpoints require:
- **Authorization Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Access Token**: Valid JWT access token (verified by AccessTokenGuard)

The AccessTokenGuard:
- Extracts the JWT token from the Authorization header
- Verifies the token signature using `ACCESS_TOKEN_SECRET`
- Attaches the `userId` and `role` from the token payload to the request object
- Denies access if the token is invalid, expired, or missing

---

## 1. User Profile Endpoints

**Base Path**: `/user`  
**Guard**: `AccessTokenGuard` (required for all endpoints)

### 1.1 Get User Profile

**Endpoint**: `GET /user/profile`

**Description**: Get the authenticated user's profile information. Returns all user fields except the hashed refresh token, updatedAt, and ID.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body**: None

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "User found";
  data: {
    phoneNumber: string | null;
    email: string | null;
    role: UserRole;                  // "user" | "admin"
    createdAt: Date;
    name: string | null;
    familyName: string | null;
    telegramId: string | null;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
  };
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Note**: The response excludes:
- `id` (user ID)
- `updatedAt` (last update timestamp)
- `hashedRefreshToken` (sensitive authentication data)
- Relations (payments, comments, questions, etc.)

---

### 1.2 Update User Profile

**Endpoint**: `POST /user/profile`

**Description**: Update the authenticated user's profile information. Only the fields provided in the request body will be updated. The user cannot update certain fields like `id`, `role`, `createdAt`, `updatedAt`, `hashedRefreshToken`, `isEmailVerified`, and `isPhoneNumberVerified`.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`UpdateProfileDto`):
```typescript
{
  name?: string;          // Optional: User name (e.g., "John")
  familyName?: string;   // Optional: User family name (e.g., "Doe")
  email?: string;        // Optional: User email (e.g., "john.doe@example.com")
  telegramId?: string;   // Optional: User telegram ID (e.g., "telegramId123")
  phoneNumber?: string;  // Optional: User phone number (e.g., "09153139046")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Profile updated successfully";
  data: null;
}

// Error (400) - No fields to update
{
  status: 400;
  message: "No fields to update";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Important Notes**:
1. **At least one field must be provided** in the request body. If no fields are provided, the endpoint returns a 400 error.
2. **Email and Phone Number Updates**: The front-end should ensure that users cannot update email or phone number that is already verified to avoid confusion.
3. **Non-updatable Fields**: The following fields cannot be updated through this endpoint:
   - `id` (user ID)
   - `role` (user role - "user" or "admin")
   - `createdAt` (creation timestamp)
   - `updatedAt` (last update timestamp)
   - `hashedRefreshToken` (authentication token)
   - `isEmailVerified` (email verification status)
   - `isPhoneNumberVerified` (phone verification status)

---

## Common Response Patterns

### Success Response Structure
All successful responses follow this pattern:
```typescript
{
  status: number;      // HTTP status code (200, etc.)
  message: string;      // Success message
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

## Type Definitions

### Enums

**UserRole**:
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

### User Entity Structure

The complete User entity structure (for reference):
```typescript
{
  id: string;                    // UUID - Primary key
  name: string | null;           // User's first name
  familyName: string | null;     // User's last name
  email: string | null;          // User's email address
  telegramId: string | null;      // User's Telegram ID (unique)
  isEmailVerified: boolean;       // Email verification status
  phoneNumber: string | null;     // User's phone number (unique)
  isPhoneNumberVerified: boolean; // Phone number verification status
  role: UserRole;                // User role - "user" | "admin"
  hashedRefreshToken: string | null; // Hashed refresh token (not returned in responses)
  payments: Payment[];           // Array of payment relations
  comments: Comment[];           // Array of comment relations
  questions: Question[];         // Array of question relations
  personalNotes: PersonalNote[]; // Array of personal note relations
  exams: Exam[];                 // Array of exam relations
  practiceHistories: PracticeHistory[]; // Array of practice history relations
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

## Authentication Flow

1. **Obtain Access Token**: User must first authenticate through the Auth module to obtain a JWT access token.
2. **Include Token in Requests**: All requests to User endpoints must include the access token in the Authorization header:
   ```
   Authorization: Bearer <JWT_ACCESS_TOKEN>
   ```
3. **Token Verification**: The AccessTokenGuard verifies:
   - Token is present in the Authorization header
   - Token format is correct (Bearer token)
   - Token signature is valid
   - Token is not expired
4. **User Identification**: Upon successful verification, the `userId` and `role` from the token payload are attached to the request object, allowing the endpoint to identify the authenticated user.

## Service Methods

The UserService provides the following methods (used internally by the controller):

### `findById(userId: string)`
- Finds a user by ID
- Returns selected fields (excludes sensitive data)
- Used by: `GET /user/profile`

### `updateProfile(userId: string, updateProfileDto: UpdateProfileDto)`
- Updates user profile fields
- Validates that at least one field is provided
- Used by: `POST /user/profile`

### `findByIdWithSensitiveInfo(userId: string)`
- Finds a user by ID with all fields including sensitive data
- Used internally by other modules (not exposed via UserController)

### `verifyEmail(userId: string)`
- Marks user's email as verified
- Used internally by Auth module

### `verifyPhoneNumber(userId: string)`
- Marks user's phone number as verified
- Used internally by Auth module

### `updateRefreshToken(userId: string, refreshToken: string)`
- Updates the user's hashed refresh token
- Used internally by Auth module

### `compareRefreshToken(refreshToken: string, userId: string)`
- Compares a refresh token with the stored hashed token
- Used internally by Auth module

### `logoutUser(userId: string)`
- Clears the user's refresh token (logout)
- Used internally by Auth module

### `findOrCreate(identifier: string, identifierType: 'phone' | 'email')`
- Finds a user by phone or email, or creates a new user if none exists
- Used internally by Auth module

## Notes

1. **Authentication Required**: All endpoints require a valid JWT access token. Requests without a token or with an invalid/expired token will be rejected.

2. **User Identification**: The user is identified from the JWT token payload (`sub` field contains the userId). The user can only access and modify their own profile.

3. **Field Restrictions**: Users cannot update certain system-managed fields:
   - `id`, `role`, `createdAt`, `updatedAt` are system-managed
   - `hashedRefreshToken` is managed by the Auth module
   - `isEmailVerified` and `isPhoneNumberVerified` are managed through verification processes

4. **Email/Phone Updates**: While the API allows updating email and phone number, the front-end should prevent updates to verified email/phone to avoid confusion. The verification status cannot be changed through this endpoint.

5. **Response Data**: The `GET /user/profile` endpoint returns a subset of user fields for security reasons. Sensitive fields like `hashedRefreshToken` and `id` are excluded.

6. **Update Validation**: The `POST /user/profile` endpoint requires at least one field to be provided. An empty request body will result in a 400 error.

7. **UUID Format**: User IDs use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

8. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

9. **Nullability**: Most user fields are nullable, allowing for partial profile information during account creation and updates.

10. **Unique Constraints**: 
    - `telegramId` must be unique across all users
    - `phoneNumber` must be unique across all users
    - Attempting to set a duplicate value will result in a database error (500 status)

