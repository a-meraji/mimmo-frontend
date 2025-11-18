# Admin Module Endpoints Documentation

## Overview

The Admin Module provides administrative endpoints for managing users, packages, payments, comments, practices, and questions. All admin endpoints are protected by the `AdminGuard`, which verifies that the requesting user has the `admin` role.

## Module Dependencies

The Admin Module imports the following modules:
- **UserModule**: User management services
- **PackageModule**: Package management services
- **PaymentModule**: Payment management services
- **CommentModule**: Comment management services
- **PracticeModule**: Practice management services

## Authentication

All admin endpoints (except where noted) require:
- **Authorization Header**: `Authorization: Bearer <JWT_TOKEN>`
- **User Role**: `admin` (verified by AdminGuard)

The AdminGuard extracts the JWT token from the Authorization header, verifies it, and checks that the user's role is `admin`.

---

## 1. User Management Endpoints

**Base Path**: `/admin/user`  
**Guard**: `AdminGuard` (required)

### 1.1 Create User

**Endpoint**: `POST /admin/user/create-user`

**Description**: Create a new user account.

**Request Body** (`CreateUserDto`):
```typescript
{
  name?: string;              // Optional: User name (e.g., "John")
  familyName?: string;        // Optional: User family name (e.g., "Doe")
  email?: string;             // Optional: User email (e.g., "john_doe@example.com")
  telegramId?: string;        // Optional: User telegram ID (e.g., "john_doe_123")
  phoneNumber?: string;       // Optional: User phone number (e.g., "09035083850")
  role?: UserRole;            // Optional: User role - "user" or "admin"
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "User created successfully";
  data: {
    id: string;                    // UUID
    name: string | null;
    familyName: string | null;
    email: string | null;
    telegramId: string | null;
    isEmailVerified: boolean;
    phoneNumber: string | null;
    isPhoneNumberVerified: boolean;
    role: UserRole;                 // "user" | "admin"
    payments: Payment[];            // Array of payment relations
    comments: Comment[];           // Array of comment relations
    questions: Question[];         // Array of question relations
    personalNotes: PersonalNote[];  // Array of personal note relations
    exams: Exam[];                  // Array of exam relations
    practiceHistories: PracticeHistory[]; // Array of practice history relations
    hashedRefreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (500)
{
  status: 500;
  message: "An error occurred while creating the user";
}
```

---

### 1.2 Get All Users

**Endpoint**: `GET /admin/user/users`

**Description**: Get all users with pagination (20 users per page).

**Request Body** (`GetAllUsersDto`):
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
  message: "Users retrieved successfully";
  data: {
    users: Array<{
      id: string;
      email: string | null;
      name: string | null;
      familyName: string | null;
      role: UserRole;
      phoneNumber: string | null;
      telegramId: string | null;
      isEmailVerified: boolean;
      isPhoneNumberVerified: boolean;
      createdAt: Date;
    }>;
    total: number;           // Total number of users
    page: number;           // Current page number
    pageSize: 20;           // Number of users per page
    totalPages: number;     // Total number of pages
  };
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving users";
}
```

---

### 1.3 Get Specific User

**Endpoint**: `POST /admin/user/specific-user`

**Description**: Get users filtered by specific criteria (email, name, familyName, or phoneNumber).

**Request Body** (`GetSpecificUserDto`):
```typescript
{
  email?: string;        // Optional: Filter by email
  name?: string;         // Optional: Filter by name
  familyName?: string;   // Optional: Filter by family name
  phoneNumber?: string;  // Optional: Filter by phone number
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Users retrieved successfully";
  data: Array<{
    id: string;
    name: string | null;
    familyName: string | null;
    email: string | null;
    telegramId: string | null;
    isEmailVerified: boolean;
    phoneNumber: string | null;
    isPhoneNumberVerified: boolean;
    role: UserRole;
    payments: Payment[];
    comments: Comment[];
    questions: Question[];
    personalNotes: PersonalNote[];
    exams: Exam[];
    practiceHistories: PracticeHistory[];
    hashedRefreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

// Error (400) - No filters provided
{
  status: 400;
  message: "At least one filter must be provided";
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving users";
}
```

---

### 1.4 Update User Profile

**Endpoint**: `POST /admin/user/update-user`

**Description**: Update a user's profile information.

**Request Body** (`UpdateUserProfileDto`):
```typescript
{
  id: string;            // Required: User ID (UUID)
  email?: string;       // Optional: User email
  name?: string;        // Optional: User name
  familyName?: string;  // Optional: User family name
  telegramId?: string;  // Optional: User telegram ID
  phoneNumber?: string; // Optional: User phone number
  role?: UserRole;      // Optional: User role - "user" or "admin"
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "User profile updated successfully";
  data: {
    id: string;
    name: string | null;
    familyName: string | null;
    email: string | null;
    telegramId: string | null;
    isEmailVerified: boolean;
    phoneNumber: string | null;
    isPhoneNumberVerified: boolean;
    role: UserRole;
    payments: Payment[];
    comments: Comment[];
    questions: Question[];
    personalNotes: PersonalNote[];
    exams: Exam[];
    practiceHistories: PracticeHistory[];
    hashedRefreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
}

// Error (500)
{
  status: 500;
  message: "An error occurred while updating the user profile";
}
```

---

### 1.5 Delete User

**Endpoint**: `POST /admin/user/delete-user`

**Description**: Delete a user by their ID.

**Request Body** (`DeleteUserDto`):
```typescript
{
  userId: string;  // Required: User ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "User deleted successfully";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while deleting the user";
}
```

---

## 2. Package Management Endpoints

**Base Path**: `/admin/package`  
**Guard**: `AdminGuard` (required)

### 2.1 Create Package

**Endpoint**: `POST /admin/package/create-package`

**Description**: Create a new package.

**Request Body** (`CreatePackageDto`):
```typescript
{
  packageName: string;                    // Required: Package name
  subtitle: string;                       // Required: Package subtitle
  level: string;                         // Required: Package level
  category: string[];                     // Required: Array of category strings
  rate: number;                          // Required: Package rating
  rateCount: number;                     // Required: Number of ratings
  badge: string;                         // Required: Package badge
  specifications: Array<{                 // Required: Array of specification objects
    icon: string;
    label: string;
    value: string;
  }>;
  description: string;                   // Required: Package description
  originalPrice: number;                 // Required: Original price
  discountedPrice: number;              // Required: Discounted price
  discountTitle: string;                // Required: Discount title
  isInstallmentAvailable: boolean;       // Required: Whether installment is available
  installmentCount: number;              // Required: Number of installments
  source: string;                        // Required: Package source
  imageUrl: string;                      // Required: Package image URL
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Package created successfully";
  data: {
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
  };
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to create a package";
  data: null;
}
```

---

### 2.2 Update Package

**Endpoint**: `POST /admin/package/update-package`

**Description**: Update an existing package.

**Request Body** (`UpdatePackageDto`):
```typescript
{
  id: string;                            // Required: Package ID (UUID)
  packageName?: string;                  // Optional: Package name
  subtitle?: string;                     // Optional: Package subtitle
  level?: string;                        // Optional: Package level
  category?: string[];                  // Optional: Array of category strings
  rate?: number;                        // Optional: Package rating
  rateCount?: number;                   // Optional: Number of ratings
  badge?: string;                       // Optional: Package badge
  specifications?: Array<{               // Optional: Array of specification objects
    icon: string;
    label: string;
    value: string;
  }>;
  description?: string;                  // Optional: Package description
  originalPrice?: number;                // Optional: Original price
  discountedPrice?: number;             // Optional: Discounted price
  discountTitle?: string;               // Optional: Discount title
  isInstallmentAvailable?: boolean;     // Optional: Whether installment is available
  installmentCount?: number;            // Optional: Number of installments
  source?: string;                      // Optional: Package source
  imageUrl?: string;                    // Optional: Package image URL
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Package updated successfully";
  data: {
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
    payments: Payment[];
    chapters: Chapter[];
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (404) - Package not found
{
  status: 404;
  message: "Package not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to update a package";
  data: null;
}
```

---

### 2.3 Delete Package

**Endpoint**: `POST /admin/package/delete-package`

**Description**: Delete a package by its ID.

**Request Body** (`DeletePackageDto`):
```typescript
{
  id: string;  // Required: Package ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Package deleted successfully";
  data: null;
}

// Error (404) - Package not found
{
  status: 404;
  message: "Package not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to delete a package";
  data: null;
}
```

---

### 2.4 Create Chapter

**Endpoint**: `POST /admin/package/create-chapter`

**Description**: Create a new chapter within a package.

**Request Body** (`CreateChapterDto`):
```typescript
{
  title: string;        // Required: Chapter title
  numericOrder: number; // Required: Chapter order number
  packageId: string;    // Required: Package ID (UUID)
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Chapter created successfully";
  data: {
    id: string;                    // UUID
    title: string;
    numericOrder: number;
    package: Package;               // Package relation
    parts: Part[];                 // Array of part relations
  };
}

// Error (404) - Package not found
{
  status: 404;
  message: "Package not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to create a chapter";
  data: null;
}
```

---

### 2.5 Update Chapter

**Endpoint**: `POST /admin/package/update-chapter`

**Description**: Update an existing chapter.

**Request Body** (`UpdateChapterDto`):
```typescript
{
  id: string;           // Required: Chapter ID (UUID)
  title?: string;       // Optional: Chapter title
  description?: string; // Optional: Chapter description
  numericOrder?: number; // Optional: Chapter order number
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Chapter updated successfully";
  data: {
    id: string;
    title?: string;
    description?: string;
    numericOrder?: number;
  };
}

// Error (404) - Chapter not found
{
  status: 404;
  message: "Chapter not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to update a chapter";
  data: null;
}
```

---

### 2.6 Delete Chapter

**Endpoint**: `POST /admin/package/delete-chapter`

**Description**: Delete a chapter by its ID.

**Request Body** (`DeleteChapterDto`):
```typescript
{
  id: string;  // Required: Chapter ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Chapter deleted successfully";
  data: null;
}

// Error (404) - Chapter not found
{
  status: 404;
  message: "Chapter not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to delete a chapter";
  data: null;
}
```

---

### 2.7 Create Part

**Endpoint**: `POST /admin/package/create-part`

**Description**: Create a new part within a chapter.

**Request Body** (`CreatePartDto`):
```typescript
{
  title: string;        // Required: Part title
  numericOrder: number; // Required: Part order number
  chapterId: string;    // Required: Chapter ID (UUID)
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Part created successfully";
  data: {
    id: string;                    // UUID
    title: string;
    numericOrder: number;
    chapter: Chapter;              // Chapter relation
    lessons: Lesson[];              // Array of lesson relations
  };
}

// Error (404) - Chapter not found
{
  status: 404;
  message: "Chapter not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to create a part";
  data: null;
}
```

---

### 2.8 Update Part

**Endpoint**: `POST /admin/package/update-part`

**Description**: Update an existing part.

**Request Body** (`UpdatePartDto`):
```typescript
{
  id: string;           // Required: Part ID (UUID)
  chapterId?: string;   // Optional: Chapter ID (UUID)
  title?: string;       // Optional: Part title
  numericOrder?: number; // Optional: Part order number
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Part updated successfully";
  data: {
    id: string;
    chapterId?: string;
    title?: string;
    numericOrder?: number;
  };
}

// Error (404) - Part not found
{
  status: 404;
  message: "Part not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to update a part";
  data: null;
}
```

---

### 2.9 Delete Part

**Endpoint**: `POST /admin/package/delete-part`

**Description**: Delete a part by its ID.

**Request Body** (`DeletePartDto`):
```typescript
{
  id: string;  // Required: Part ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Part deleted successfully";
  data: null;
}

// Error (404) - Part not found
{
  status: 404;
  message: "Part not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to delete a part";
  data: null;
}
```

---

### 2.10 Get Lesson

**Endpoint**: `POST /admin/package/get-lesson`

**Description**: Get a lesson by its ID.

**Request Body** (`GetLessonDto`):
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
  message: "Lesson found successfully";
  data: {
    id: string;                    // UUID
    title: string;
    description: string;
    numericOrder: number;
    imageUrl: string;
    isFree: boolean;
    part: Part;                    // Part relation
    words: Word[];                 // Array of word relations
    practices: Practice[];          // Array of practice relations
    questions: Question[];          // Array of question relations
  };
}

// Error (404) - Lesson not found
{
  status: 404;
  message: "Lesson not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get a lesson";
  data: null;
}
```

---

### 2.11 Create Lesson

**Endpoint**: `POST /admin/package/create-lesson`

**Description**: Create a new lesson within a part.

**Request Body** (`CreateLessonDto`):
```typescript
{
  title: string;        // Required: Lesson title
  description: string; // Required: Lesson description
  numericOrder: number; // Required: Lesson order number
  imageUrl: string;     // Required: Lesson image URL
  partId: string;        // Required: Part ID (UUID)
  isFree: boolean;      // Required: Whether the lesson is free
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Lesson created successfully";
  data: {
    id: string;                    // UUID
    title: string;
    description: string;
    numericOrder: number;
    imageUrl: string;
    isFree: boolean;
    part: Part;                    // Part relation
    words: Word[];                 // Array of word relations
    practices: Practice[];         // Array of practice relations
    questions: Question[];         // Array of question relations
  };
}

// Error (404) - Part not found
{
  status: 404;
  message: "Part not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to create a lesson";
  data: null;
}
```

---

### 2.12 Update Lesson

**Endpoint**: `POST /admin/package/update-lesson`

**Description**: Update an existing lesson.

**Request Body** (`UpdateLessonDto`):
```typescript
{
  id: string;           // Required: Lesson ID (UUID)
  title?: string;       // Optional: Lesson title
  description?: string; // Optional: Lesson description
  numericOrder?: number; // Optional: Lesson order number
  imageUrl?: string;    // Optional: Lesson image URL
  partId?: string;      // Optional: Part ID (UUID)
  isFree?: boolean;     // Optional: Whether the lesson is free
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Lesson updated successfully";
  data: {
    id: string;
    title?: string;
    description?: string;
    numericOrder?: number;
    imageUrl?: string;
    partId?: string;
    isFree?: boolean;
  };
}

// Error (400) - No data provided
{
  status: 400;
  message: "No data provided to update";
  data: null;
}

// Error (404) - Lesson not found
{
  status: 404;
  message: "Lesson not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to update a lesson";
  data: null;
}
```

---

### 2.13 Delete Lesson

**Endpoint**: `POST /admin/package/delete-lesson`

**Description**: Delete a lesson by its ID.

**Request Body** (`DeleteLessonDto`):
```typescript
{
  id: string;  // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Lesson deleted successfully";
  data: null;
}

// Error (404) - Lesson not found
{
  status: 404;
  message: "Lesson not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to delete a lesson";
  data: null;
}
```

---

### 2.14 Create Word

**Endpoint**: `POST /admin/package/create-word`

**Description**: Create a new word within a lesson.

**Request Body** (`CreateWordDto`):
```typescript
{
  word: string;        // Required: Word text
  title: string;       // Required: Title of the word
  subtitle: string;    // Required: Subtitle of the word
  description: string;  // Required: Description of the word
  imageUrl: string;     // Required: Image URL of the word
  lessonId: string;     // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Word created successfully";
  data: {
    id: string;                    // UUID
    word: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    lesson: Lesson;                // Lesson relation
    personalNotes: PersonalNote[]; // Array of personal note relations
  };
}

// Error (404) - Lesson not found
{
  status: 404;
  message: "Lesson not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to create a word";
  data: null;
}
```

---

### 2.15 Update Word

**Endpoint**: `POST /admin/package/update-word`

**Description**: Update an existing word.

**Request Body** (`UpdateWordDto`):
```typescript
{
  id: string;          // Required: Word ID (UUID)
  word?: string;       // Optional: Word text
  title?: string;      // Optional: Title of the word
  subtitle?: string;   // Optional: Subtitle of the word
  description?: string; // Optional: Description of the word
  imageUrl?: string;    // Optional: Image URL of the word
  // Note: lessonId is omitted in UpdateWordDto
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Word updated successfully";
  data: {
    id: string;
    word?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
  };
}

// Error (404) - Word not found
{
  status: 404;
  message: "Word not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to update a word";
  data: null;
}
```

---

### 2.16 Delete Word

**Endpoint**: `POST /admin/package/delete-word`

**Description**: Delete a word by its ID.

**Request Body** (`DeleteWordDto`):
```typescript
{
  id: string;  // Required: Word ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Word deleted successfully";
  data: null;
}

// Error (404) - Word not found
{
  status: 404;
  message: "Word not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to delete a word";
  data: null;
}
```

---

## 3. Payment Management Endpoints

**Base Path**: `/admin/payments`  
**Guard**: `AdminGuard` (required)

### 3.1 Create Payment by Admin

**Endpoint**: `POST /admin/payments/create-payment`

**Description**: Create a payment record manually by admin.

**Request Body** (`CreatePaymentByAdminDto`):
```typescript
{
  userId: string;                    // Required: User ID (UUID)
  packageIds: string[];              // Required: Array of package IDs
  finalPrice: number;                // Required: Final price after discounts
  paymentMethod: PaymentMethod;       // Required: Payment method enum - "FULL_PAYMENT" | "INSTALLMENT"
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "payment created";
  data: {
    id: string;                      // UUID
    totalPrice: number;              // Total price of packages without discount
    status: PaymentStatus;           // "PENDING" | "COMPLETED" | "FAILED" | "PARTIAL_PAYMENT" | "SUSPENDED"
    paymentMethod: PaymentMethod;    // "INSTALLMENT" | "FULL_PAYMENT"
    paymentType: PaymentType;        // "CARD_TO_CARD" | "GATEWAY_PAYMENT"
    user: User;                      // User relation
    discountCode: string | null;
    discoundPercentage: number | null;
    finalPrice: number;              // Final price after applying discount codes
    installments: Installment[];     // Array of installment relations
    packages: Package[];            // Array of package relations
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (400) - Some packages not found
{
  status: 400;
  message: "some packages not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occurred while creating payment";
  data: null;
}
```

---

### 3.2 Get All Payments

**Endpoint**: `POST /admin/payments/get-all-payments`

**Description**: Retrieve all payment records.

**Request Body**: None

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "getting all payments successfully";
  data: {
    payments: Array<{
      id: string;
      totalPrice: number;
      status: PaymentStatus;
      paymentMethod: PaymentMethod;
      paymentType: PaymentType;
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
      discountCode: string | null;
      discoundPercentage: number | null;
      finalPrice: number;
      installments: Installment[];
      packages: Package[];
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get all payments";
  data: null;
}
```

---

### 3.3 Get Payment by ID

**Endpoint**: `POST /admin/payments/get-payment-by-id`

**Description**: Get a specific payment by its ID.

**Request Body** (`GetPaymentByIdDTO`):
```typescript
{
  paymentId: string;  // Required: Payment ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "payment found";
  data: {
    id: string;
    totalPrice: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentType: PaymentType;
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
    discountCode: string | null;
    discoundPercentage: number | null;
    finalPrice: number;
    installments: Installment[];
    packages: Array<{
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
    }>;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (404) - Payment not found
{
  status: 404;
  message: "payment not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "an error occur while trying to get payment by Id";
  data: null;
}
```

---

### 3.4 Search Payments

**Endpoint**: `POST /admin/payments/search-payments`

**Description**: Search payments by user email or phone number.

**Request Body** (`SearchPaymentAdminDTO`):
```typescript
{
  email?: string;        // Optional: User email (at least 3 characters if partial match)
  phoneNumber?: string;  // Optional: User phone number (at least 4 digits, digits only)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Payments found" | "No payments match your search criteria";
  data: Array<{
    id: string;
    totalPrice: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentType: PaymentType;
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
    discountCode: string | null;
    discoundPercentage: number | null;
    finalPrice: number;
    installments: Installment[];
    packages: Package[];
    createdAt: Date;
    updatedAt: Date;
  }>;
}

// Error (400) - No search criteria provided
{
  status: 400;
  message: "No search criteria provided";
  data: null;
}

// Error (400) - Invalid search parameters
{
  status: 400;
  message: "Please provide at least 3 characters for email search" | "Please provide at least 4 digits for phone number search" | "Phone number should contain digits only";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while searching for payments";
  data: null;
}
```

---

## 4. Comment Management Endpoints

**Base Path**: `/admin/comment`  
**Guard**: `AdminGuard` (required)

### 4.1 Delete Comment by ID

**Endpoint**: `POST /admin/comment/delete-by-id`

**Description**: Delete a comment by its ID.

**Request Body** (`DeleteCommentByIdDto`):
```typescript
{
  commentId: string;  // Required: Comment ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Comment deleted successfully";
  data: null;
}

// Error (404) - Comment not found
{
  status: 404;
  message: "Comment not found";
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

### 4.2 Get All Comments

**Endpoint**: `POST /admin/comment/get-all`

**Description**: Get all comments with pagination and status filter (10 comments per page).

**Request Body** (`GetAllCommentsDto`):
```typescript
{
  status: CommentStatus;  // Required: Comment status enum - "PENDING" | "APPROVED"
  page: number;           // Required: Page number (minimum: 1)
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
      id: string;                    // UUID
      content: string;
      status: CommentStatus;         // "PENDING" | "APPROVED"
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
    total: number;         // Total number of comments
    page: number;          // Current page number
    pageSize: 10;          // Number of comments per page
  };
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

---

### 4.3 Change Comment Status

**Endpoint**: `POST /admin/comment/change-status`

**Description**: Change the status of a comment.

**Request Body** (`ChangeCommentStatusDto`):
```typescript
{
  commentId: string;        // Required: Comment ID (UUID)
  newStatus: CommentStatus; // Required: New status enum - "PENDING" | "APPROVED"
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Comment status updated successfully";
  data: null;
}

// Error (404) - Comment not found
{
  status: 404;
  message: "Comment not found";
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

## 5. Practice Management Endpoints

**Base Path**: `/admin/practices`  
**Guard**: None (Note: This controller does not use AdminGuard, but should be protected)

### 5.1 Get All Practices by Lesson ID

**Endpoint**: `POST /admin/practices/get-by-lessonId`

**Description**: Get all practices for a specific lesson.

**Request Body** (`GetAllPracticeDto`):
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
    question: string;
    options: object;                // JSON object with options (e.g., { a: "option1", b: "option2", c: "option3", d: "option4" })
    imageUrl: string | null;
    correctAnswer: string;
    explanation: string | null;
    lesson: Lesson;                // Lesson relation
  }>;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving practices";
}
```

---

### 5.2 Create Practice

**Endpoint**: `POST /admin/practices/create`

**Description**: Create a new practice question for a lesson.

**Request Body** (`CreatePracticeDto`):
```typescript
{
  question: string;        // Required: Practice question text
  options: object;         // Required: Options object (e.g., { a: "option1", b: "option2", c: "option3", d: "option4" })
  imageUrl?: string;       // Optional: Image URL for the question
  correctAnswer: string;   // Required: Correct answer key (e.g., "a", "b", "c", or "d")
  explanation?: string;   // Optional: Explanation for the correct answer
  lessonId: string;        // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Practice created successfully";
  data: {
    id: string;                    // UUID
    question: string;
    options: object;
    imageUrl: string | null;
    correctAnswer: string;
    explanation: string | null;
    lesson: {
      id: string;
      title: string;
      description: string;
      numericOrder: number;
      imageUrl: string;
      isFree: boolean;
      part: Part;
      words: Word[];
      practices: Practice[];
      questions: Question[];
    };
  };
}

// Error (404) - Lesson not found
{
  status: 404;
  message: "Lesson not found";
}

// Error (400) - Invalid lesson data
{
  status: 400;
  message: "Invalid lesson data";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while creating the practice";
}
```

---

### 5.3 Update Practice

**Endpoint**: `POST /admin/practices/update`

**Description**: Update an existing practice.

**Request Body** (`UpdatePracticeDto`):
```typescript
{
  id: string;              // Required: Practice ID (UUID)
  question?: string;       // Optional: Practice question text
  options?: object;        // Optional: Options object
  imageUrl?: string;       // Optional: Image URL
  correctAnswer?: string; // Optional: Correct answer key
  explanation?: string;    // Optional: Explanation
  // Note: lessonId is omitted in UpdatePracticeDto
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Practice updated successfully";
  data: {
    id: string;
    question: string;
    options: object;
    imageUrl: string | null;
    correctAnswer: string;
    explanation: string | null;
    lesson: Lesson;
  };
}

// Error (404) - Practice not found
{
  status: 404;
  message: "Practice not found";
}

// Error (500)
{
  status: 500;
  message: "An error occurred while updating the practice";
}
```

---

### 5.4 Delete Practice

**Endpoint**: `POST /admin/practices/delete`

**Description**: Delete a practice by its ID.

**Request Body** (`DeletePracticeDto`):
```typescript
{
  id: string;  // Required: Practice ID (UUID)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Practice deleted successfully";
  data: null;
}

// Error (404) - Practice not found
{
  status: 404;
  message: "Practice not found";
}

// Error (500)
{
  status: 500;
  message: "An error occurred while deleting the practice";
}
```

---

## 6. Question Management Endpoints

**Base Path**: `/admin/questions`  
**Guard**: None (Note: This controller does not use AdminGuard, but should be protected)

**Note**: The `AdminQuestionController` exists but is not currently registered in the `AdminModule`. It should be added to the module's controllers array.

### 6.1 Get All Questions

**Endpoint**: `POST /admin/questions/get-questions`

**Description**: Get all questions with optional status filter (25 questions per page).

**Request Body** (`GetAllQuestionDto`):
```typescript
{
  status?: QuestionStatus;  // Optional: Question status enum - "PENDING" | "ANSWERED"
  page: number;             // Required: Page number
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  data: {
    questions: Array<{
      id: string;                    // UUID
      content: string;
      answer: string;
      status: string;                 // "PENDING" | "ANSWERED"
      visibility: string;             // "PUBLIC" | "PRIVATE"
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
      lesson: {
        id: string;
        title: string;
        description: string;
        numericOrder: number;
        imageUrl: string;
        isFree: boolean;
        part: Part;
        words: Word[];
        practices: Practice[];
        questions: Question[];
      };
      createdAt: Date;
    }>;
    total: number;          // Total number of questions
    page: number;           // Current page number
    pageSize: 25;           // Number of questions per page
  };
  message: "Questions retrieved successfully";
}

// Error (500)
{
  status: 500;
  message: "An error occurred while retrieving questions";
  data: null;
}
```

---

### 6.2 Answer Question

**Endpoint**: `POST /admin/questions/answer-question`

**Description**: Answer a specific question.

**Request Body** (`AnswerQuestionDto`):
```typescript
{
  questionId: string;  // Required: Question ID (UUID)
  answer: string;      // Required: Answer content
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Question answered successfully";
  data: {
    id: string;                    // UUID
    content: string;
    answer: string;                // Updated answer
    status: string;                // Set to "ANSWERED"
    visibility: string;            // "PUBLIC" | "PRIVATE"
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
    lesson: {
      id: string;
      title: string;
      description: string;
      numericOrder: number;
      imageUrl: string;
      isFree: boolean;
      part: Part;
      words: Word[];
      practices: Practice[];
      questions: Question[];
    };
    createdAt: Date;
  };
}

// Error (404) - Question not found
{
  status: 404;
  message: "Question not found";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "An error occurred while answering the question";
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

## Type Definitions

### Enums

**UserRole**:
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

**PaymentStatus**:
```typescript
enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL_PAYMENT = 'PARTIAL_PAYMENT',
  SUSPENDED = 'SUSPENDED',
}
```

**PaymentMethod**:
```typescript
enum PaymentMethod {
  INSTALLMENT = 'INSTALLMENT',
  FULL_PAYMENT = 'FULL_PAYMENT',
}
```

**PaymentType**:
```typescript
enum PaymentType {
  CARD_TO_CARD = 'CARD_TO_CARD',
  GATEWAY_PAYMENT = 'GATEWAY_PAYMENT',
}
```

**CommentStatus**:
```typescript
enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}
```

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

## Notes

1. **AdminGuard**: Most endpoints require the `AdminGuard`, which verifies:
   - Valid JWT token in `Authorization: Bearer <token>` header
   - User role is `admin`

2. **Missing Guards**: The following controllers do not currently use `AdminGuard`:
   - `AdminPracticeController`
   - `AdminQuestionController`

3. **Module Registration**: `AdminQuestionController` exists but is not registered in `AdminModule`. It should be added to the module's controllers array.

4. **Pagination**: 
   - Users: 20 per page
   - Comments: 10 per page
   - Questions: 25 per page

5. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

6. **Request Methods**: 
   - Most endpoints use `POST` method
   - `GET /admin/user/users` is the only `GET` endpoint

7. **Relations**: When entities are returned with relations, the related objects may include nested data. The depth of relations depends on the service implementation and query configuration.

8. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.
