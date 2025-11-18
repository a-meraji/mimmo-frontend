# Auth Module Endpoints Documentation

## Overview

The Auth Module provides authentication and authorization endpoints for user registration, login, token management, and email/phone verification. The module uses OTP (One-Time Password) verification for authentication and JWT tokens for session management.

## Module Dependencies

The Auth Module has the following structure:
- **AuthController**: Handles authentication endpoints
- **AuthService**: Provides authentication and token management services
- **JwtModule**: JWT token generation and verification
- **UserModule**: User management services
- **InteractionModule**: OTP sending services (SMS and Email)
- **RedisService**: OTP storage and management

## Authentication Flow

The authentication system uses a two-step process:
1. **OTP Request**: User requests an OTP via phone number or email
2. **OTP Verification**: User verifies the OTP to complete login/registration

Upon successful verification:
- Access token (JWT) is returned in the response body (expires in 15 minutes)
- Refresh token (JWT) is set as an HTTP-only cookie (expires in 7 days)

## Token Management

- **Access Token**: Short-lived token (15 minutes) used for API authentication
- **Refresh Token**: Long-lived token (7 days) stored in HTTP-only cookie, used to obtain new access tokens
- **Token Storage**: Refresh tokens are hashed and stored in the user's database record

---

## 1. Phone Authentication Endpoints

**Base Path**: `/auth`  
**Guard**: None (publicly accessible)

### 1.1 Send Phone OTP

**Endpoint**: `POST /auth/send-otp`

**Description**: Send a 4-digit OTP to the specified phone number. The OTP is stored in Redis with a 90-second expiration. If an OTP was already sent and is still valid, the endpoint returns a 425 status code.

**Request Body** (`SendOtpDto`):
```typescript
{
  phoneNumber: string;  // Required: Phone number (e.g., "+989153139046")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "OTP sent successfully";
  data: {
    phoneNumber: string;
  };
}

// Error (425) - OTP already sent
{
  status: 425;
  message: "OTP already sent. Please wait before requesting a new one.";
  data: null;
}

// Error (500) - Failed to send OTP
{
  status: 500;
  message: "Failed to send OTP";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- OTP expires after 90 seconds
- Only one OTP can be active per phone number at a time
- OTP is a 4-digit number (1000-9999)

---

### 1.2 Verify Phone OTP

**Endpoint**: `POST /auth/verify-otp`

**Description**: Verify the OTP for the given phone number. If valid, creates or finds the user, generates JWT tokens, and returns the access token. The refresh token is set as an HTTP-only cookie.

**Request Body** (`VerifyOtpDto`):
```typescript
{
  phoneNumber: string;  // Required: Phone number (e.g., "+989153139046")
  otp: string;         // Required: 4-digit OTP code (e.g., "1234")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "OTP verified successfully";
  data: {
    user: {
      id: string;                    // UUID
      phoneNumber: string | null;
      email: string | null;
    };
    accessToken: string;              // JWT access token (expires in 15 minutes)
  };
}
// Note: refresh_token is set as HTTP-only cookie (expires in 7 days)

// Error (400) - Invalid OTP
{
  status: 400;
  message: "Invalid OTP";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- If user doesn't exist, a new user is created automatically
- Phone number is marked as verified upon successful authentication
- OTP is deleted from Redis after successful verification
- Refresh token is stored in database (hashed) and set as HTTP-only cookie

---

## 2. Email Authentication Endpoints

**Base Path**: `/auth`  
**Guard**: None (publicly accessible)

### 2.1 Send Email OTP

**Endpoint**: `POST /auth/send-email-otp`

**Description**: Send a 4-digit OTP to the specified email address. The OTP is stored in Redis with a 90-second expiration. If an OTP was already sent and is still valid, the endpoint returns a 425 status code.

**Request Body** (`SendEmailOtpDto`):
```typescript
{
  email: string;  // Required: Email address (e.g., "example@example.com")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "OTP sent successfully";
  data: {
    email: string;
  };
}

// Error (425) - OTP already sent
{
  status: 425;
  message: "OTP already sent. Please wait before requesting a new one.";
  data: null;
}

// Error (500) - Failed to send OTP
{
  status: 500;
  message: "Failed to send OTP";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- OTP expires after 90 seconds
- Only one OTP can be active per email address at a time
- OTP is a 4-digit number (1000-9999)

---

### 2.2 Verify Email OTP

**Endpoint**: `POST /auth/verify-email-otp`

**Description**: Verify the OTP for the given email address. If valid, creates or finds the user, generates JWT tokens, and returns the access token. The refresh token is set as an HTTP-only cookie.

**Request Body** (`VerifyEmailOtpDto`):
```typescript
{
  email: string;  // Required: Email address (e.g., "example@example.com")
  otp: string;    // Required: 4-digit OTP code (e.g., "1234")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "OTP verified successfully";
  data: {
    user: {
      id: string;                    // UUID
      phoneNumber: string | null;
      email: string | null;
    };
    accessToken: string;              // JWT access token (expires in 15 minutes)
  };
}
// Note: refresh_token is set as HTTP-only cookie (expires in 7 days)

// Error (400) - Invalid OTP
{
  status: 400;
  message: "Invalid OTP";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- If user doesn't exist, a new user is created automatically
- Email is marked as verified upon successful authentication
- OTP is deleted from Redis after successful verification
- Refresh token is stored in database (hashed) and set as HTTP-only cookie

---

## 3. Token Management Endpoints

**Base Path**: `/auth`  
**Guard**: Varies by endpoint

### 3.1 Refresh Access Token

**Endpoint**: `POST /auth/refresh`

**Description**: Validate the refresh token from cookies and generate a new access token. The refresh token must be valid and not expired.

**Request Cookies**:
```typescript
{
  refresh_token: string;  // Required: JWT refresh token (from HTTP-only cookie)
}
```

**Request Body**: None

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Refresh token validated";
  data: {
    accessToken: string;  // New JWT access token (expires in 15 minutes)
  };
}

// Error (403) - Invalid refresh token
{
  status: 403;
  message: "Invalid refresh token";
  data: null;
}

// Error (403) - Refresh token expired
{
  status: 403;
  message: "Refresh token expired";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Refresh token is read from HTTP-only cookie named `refresh_token`
- Refresh token must match the hashed token stored in the database
- New access token expires in 15 minutes
- Refresh token itself is not renewed (expires after 7 days)

---

### 3.2 Logout

**Endpoint**: `POST /auth/logout`

**Description**: Logout the authenticated user by clearing their refresh token from the database.

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
  message: "Logged out successfully";
  data: null;
}

// Error (500) - Logout failed
{
  status: 500;
  message: "Logout failed";
  data: null;
}
```

**Notes**:
- Requires valid access token
- Clears the refresh token from the database
- User will need to authenticate again to obtain new tokens

---

## 4. Email Verification Endpoints

**Base Path**: `/auth`  
**Guard**: `AccessTokenGuard` (required for all endpoints)

### 4.1 Send Email Verification OTP

**Endpoint**: `POST /auth/verify-email`

**Description**: Send a verification OTP to the specified email address for an authenticated user. The OTP is stored in Redis with a 300-second (5 minute) expiration.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`SendEmailOtpDto`):
```typescript
{
  email: string;  // Required: Email address to verify (e.g., "example@example.com")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Verification email sent successfully";
  data: null;
}

// Error (400) - Email already verified
{
  status: 400;
  message: "Email is already verified";
  data: null;
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
  data: null;
}

// Error (500) - Failed to send verification email
{
  status: 500;
  message: "Failed to send verification email";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Requires authentication
- User's email must not already be verified
- OTP expires after 5 minutes (300 seconds)
- OTP is stored with key `EMAIL_VERIFY_OTP:{userId}` in Redis

---

### 4.2 Verify Email Verification Code

**Endpoint**: `POST /auth/verify-email-verification-code`

**Description**: Verify the email verification OTP for an authenticated user. Upon successful verification, the user's email is marked as verified.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`VerifyEmailOtpDto`):
```typescript
{
  email: string;  // Required: Email address (e.g., "example@example.com")
  otp: string;    // Required: 4-digit OTP code (e.g., "1234")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Email verified successfully";
  data: null;
}

// Error (400) - Invalid OTP
{
  status: 400;
  message: "Invalid OTP";
  data: null;
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Requires authentication
- OTP must match the one stored in Redis
- User's `isEmailVerified` field is set to `true` upon successful verification
- OTP is deleted from Redis after successful verification

---

## 5. Phone Verification Endpoints

**Base Path**: `/auth`  
**Guard**: `AccessTokenGuard` (required for all endpoints)

### 5.1 Send Phone Verification OTP

**Endpoint**: `POST /auth/verify-phone-otp`

**Description**: Send a verification OTP to the user's phone number for an authenticated user. The OTP is stored in Redis with a 300-second (5 minute) expiration.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`VerifyOtpDto`):
```typescript
{
  phoneNumber: string;  // Required: Phone number (e.g., "+989153139046")
  otp: string;          // Required: OTP code (Note: This field is not used for sending, only for consistency with DTO)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Verification SMS sent successfully";
  data: null;
}

// Error (400) - Phone number already verified
{
  status: 400;
  message: "Phone number is already verified";
  data: null;
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
  data: null;
}

// Error (500) - Failed to send verification SMS
{
  status: 500;
  message: "Failed to send verification SMS";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Requires authentication
- User's phone number must not already be verified
- OTP expires after 5 minutes (300 seconds)
- OTP is stored with key `PHONE_VERIFY_OTP:{userId}` in Redis
- Note: The endpoint uses the phone number from the request body, not from the user's profile

---

### 5.2 Verify Phone Verification Code

**Endpoint**: `POST /auth/verify-phone-verification-code`

**Description**: Verify the phone verification OTP for an authenticated user. Upon successful verification, the user's phone number is marked as verified.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`VerifyOtpDto`):
```typescript
{
  phoneNumber: string;  // Required: Phone number (e.g., "+989153139046")
  otp: string;          // Required: 4-digit OTP code (e.g., "1234")
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Phone number verified successfully";
  data: null;
}

// Error (400) - Invalid OTP
{
  status: 400;
  message: "Invalid OTP";
  data: null;
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Requires authentication
- OTP must match the one stored in Redis
- User's `isPhoneNumberVerified` field is set to `true` upon successful verification
- OTP is deleted from Redis after successful verification

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
  status: number;      // HTTP status code (400, 403, 404, 425, 500, etc.)
  message: string;     // Error message
  data: null;          // Always null for errors
}
```

## Type Definitions

### DTOs

**SendOtpDto**:
```typescript
{
  phoneNumber: string;  // Phone number (e.g., "+989153139046")
}
```

**VerifyOtpDto**:
```typescript
{
  phoneNumber: string;  // Phone number (e.g., "+989153139046")
  otp: string;         // 4-digit OTP code (e.g., "1234")
}
```

**SendEmailOtpDto**:
```typescript
{
  email: string;  // Email address (e.g., "example@example.com")
}
```

**VerifyEmailOtpDto**:
```typescript
{
  email: string;  // Email address (e.g., "example@example.com")
  otp: string;    // 4-digit OTP code (e.g., "1234")
}
```

### Token Structure

**Access Token Payload**:
```typescript
{
  sub: string;   // User ID (UUID)
  role: string;   // User role ("user" | "admin")
  iat: number;    // Issued at timestamp
  exp: number;    // Expiration timestamp (15 minutes from issue)
}
```

**Refresh Token Payload**:
```typescript
{
  sub: string;   // User ID (UUID)
  iat: number;    // Issued at timestamp
  exp: number;    // Expiration timestamp (7 days from issue)
}
```

## Authentication Flow Diagram

```
1. User Registration/Login Flow:
   User → POST /auth/send-otp (or send-email-otp)
        → Receives OTP via SMS/Email
        → POST /auth/verify-otp (or verify-email-otp)
        → Receives accessToken (in response)
        → Receives refreshToken (in HTTP-only cookie)
        → Can now make authenticated requests

2. Token Refresh Flow:
   User → POST /auth/refresh (with refresh_token cookie)
        → Receives new accessToken
        → Can continue making authenticated requests

3. Email/Phone Verification Flow (for authenticated users):
   User → POST /auth/verify-email (or verify-phone-otp)
        → Receives OTP via Email/SMS
        → POST /auth/verify-email-verification-code (or verify-phone-verification-code)
        → Email/Phone marked as verified
```

## Notes

1. **OTP Expiration**:
   - Authentication OTPs: 90 seconds
   - Verification OTPs: 300 seconds (5 minutes)

2. **OTP Format**: All OTPs are 4-digit numbers (1000-9999)

3. **Token Expiration**:
   - Access Token: 15 minutes
   - Refresh Token: 7 days

4. **Token Storage**:
   - Access Token: Returned in response body, stored client-side
   - Refresh Token: Stored as HTTP-only cookie and hashed in database

5. **User Creation**: Users are automatically created during OTP verification if they don't exist

6. **Verification Status**: 
   - Phone numbers are automatically verified upon successful phone OTP authentication
   - Emails are automatically verified upon successful email OTP authentication
   - Additional verification endpoints allow users to verify additional emails/phone numbers

7. **Rate Limiting**: The system prevents sending multiple OTPs by checking Redis. If an OTP exists, a 425 status is returned.

8. **Security**:
   - Refresh tokens are HTTP-only cookies (not accessible via JavaScript)
   - Refresh tokens are hashed before storage in database
   - Access tokens are short-lived (15 minutes)
   - OTPs expire quickly to prevent replay attacks

9. **Redis Keys**:
   - Authentication OTPs: `OTP:{phoneNumber}` or `OTP:{email}`
   - Email verification OTPs: `EMAIL_VERIFY_OTP:{userId}`
   - Phone verification OTPs: `PHONE_VERIFY_OTP:{userId}`

10. **Cookie Settings**:
    - Refresh token cookie: HTTP-only, expires in 7 days (14 * 24 * 60 * 60 * 1000 milliseconds)

11. **Error Handling**: All endpoints return consistent error responses with appropriate HTTP status codes:
    - `400`: Bad request (invalid OTP, already verified, etc.)
    - `403`: Forbidden (invalid/expired refresh token)
    - `404`: Not found (user not found)
    - `425`: Too Early (OTP already sent, please wait)
    - `500`: Internal server error

12. **UUID Format**: User IDs use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

13. **JWT Algorithm**: All tokens use HS256 algorithm

14. **Token Secrets**: 
    - Access tokens use `ACCESS_TOKEN_SECRET` environment variable
    - Refresh tokens use `REFRESH_TOKEN_SECRET` environment variable

15. **User Roles**: Users can have roles "user" or "admin" (default is "user")

