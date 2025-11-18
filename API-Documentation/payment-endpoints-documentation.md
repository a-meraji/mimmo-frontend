# Payment Module Endpoints Documentation

## Overview

The Payment Module provides endpoints for users to manage payments, access paid content, and track their payment history. The module supports both full payment and installment payment methods, and acts as a shopping cart/basket system for packages.

## Module Dependencies

The Payment Module has the following structure:
- **PaymentController**: Handles payment endpoints
- **PaymentService**: Provides payment management services
- **PaymentManagementService**: Provides payment management services (used by admin module)
- **Payment Entity**: TypeORM entity representing payment records
- **Installment Entity**: TypeORM entity representing installment payments
- **PackageModule**: Dependency for package validation and access
- **UserModule**: Dependency for user validation

## Authentication

All payment endpoints require authentication via the `AccessTokenGuard`, which verifies that the requesting user has a valid JWT access token.

For authenticated endpoints:
- **Authorization Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Access Token**: Valid JWT access token (verified by AccessTokenGuard)

---

## 1. Payment Management Endpoints

**Base Path**: `/payment`  
**Guard**: `AccessTokenGuard` (required for all endpoints)

### 1.1 Get User Payments

**Endpoint**: `POST /payment/get-user-payments`

**Description**: Get all payment records for the authenticated user.

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
  message: "User payment fetched successfully";
  data: Array<{
    id: string;                      // UUID
    totalPrice: number;              // Total price of packages without discount
    status: PaymentStatus;           // "PENDING" | "COMPLETED" | "FAILED" | "PARTIAL_PAYMENT" | "SUSPENDED"
    paymentMethod: PaymentMethod;    // "INSTALLMENT" | "FULL_PAYMENT"
    paymentType: PaymentType;         // "CARD_TO_CARD" | "GATEWAY_PAYMENT"
    user: User;                      // User relation
    discountCode: string | null;
    discoundPercentage: number | null;
    finalPrice: number;              // Final price after applying discount codes
    installments: Installment[];     // Array of installment relations
    packages: Package[];            // Array of package relations
    createdAt: Date;
    updatedAt: Date;
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

### 1.2 Get Paid Packages by Payment ID

**Endpoint**: `POST /payment/get-paid-packages-by-payment-id`

**Description**: Get all packages associated with a specific payment ID.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`GetPaidPackageByPaymentIdDto`):
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
  message: "Payment found";
  data: {
    id: string;                      // UUID
    totalPrice: number;              // Total price of packages without discount
    status: PaymentStatus;           // "PENDING" | "COMPLETED" | "FAILED" | "PARTIAL_PAYMENT" | "SUSPENDED"
    paymentMethod: PaymentMethod;    // "INSTALLMENT" | "FULL_PAYMENT"
    paymentType: PaymentType;         // "CARD_TO_CARD" | "GATEWAY_PAYMENT"
    user: User;                      // User relation
    discountCode: string | null;
    discoundPercentage: number | null;
    finalPrice: number;              // Final price after applying discount codes
    installments: Installment[];     // Array of installment relations
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
  message: "Payment not found";
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

### 1.3 Get Paid Lesson

**Endpoint**: `POST /payment/get-lesson`

**Description**: Get a lesson if the user has paid for it or if the lesson is free. This endpoint checks payment status and grants access based on:
- Free lessons: Always accessible
- Completed payments: Full access
- Installment payments: Partial access based on paid installments

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`GetPaidLessonDTO`):
```typescript
{
  packageId: string;  // Required: Package ID (UUID)
  lessonId: string;   // Required: Lesson ID (UUID)
}
```

**Response**:
```typescript
// Success (200) - Free lesson or paid lesson access granted
{
  status: 200;
  message: "Lesson is free, access granted" | "Access granted to paid lesson";
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

// Error (403) - Access denied (payment not found, failed, or suspended)
{
  status: 403;
  message: "Access denied. Payment not found or failed for this lesson." | "Access denied. Payment is suspended please contact support." | "Access denied. Please complete more installments to access this lesson.";
  data: null;
}

// Error (404) - Lesson not found
{
  status: 404;
  message: "Lesson not found";
  data: null;
}

// Error (500) - Lesson retrieval error
{
  status: 500;
  message: "An error occurred while retrieving the lesson";
  data: null;
}

// Error (503) - Unknown payment status
{
  status: 503;
  message: "Access denied due to unknown payment status.";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Access Logic**:
1. **Free Lessons**: Always accessible regardless of payment status
2. **Completed Payments**: Full access to all lessons in the package
3. **Installment Payments (COMPLETED)**: Full access to all lessons
4. **Installment Payments (PARTIAL_PAYMENT)**: Access to lessons based on proportion of paid installments
   - Accessible lesson count = `floor(totalLessons * (paidInstallments / totalInstallments))`
   - Lessons are sorted by `numericOrder` and access is granted to the first N lessons
5. **Failed Payments**: Access denied
6. **Suspended Payments**: Access denied
7. **Pending Payments**: Access denied (payment not completed)

---

### 1.4 Create Payment (Shopping Cart)

**Endpoint**: `POST /payment/create-payment`

**Description**: Create a new payment (acts like a shopping cart/basket). If the user already has a pending payment, the package is added to the existing payment. If no pending payment exists, a new one is created. The payment is created with PENDING status and can be completed later through a payment gateway.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`CreatePaymentDto`):
```typescript
{
  packageId: string;  // Required: Package ID (UUID)
}
```

**Response**:
```typescript
// Success (201) - New payment created
{
  status: 201;
  message: "Payment created successfully";
  data: {
    id: string;                      // UUID
    totalPrice: number;              // Total price of packages without discount (originalPrice)
    status: PaymentStatus;           // "PENDING"
    paymentMethod: PaymentMethod;    // "FULL_PAYMENT"
    paymentType: PaymentType;         // "GATEWAY_PAYMENT"
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
    discountCode: null;
    discoundPercentage: null;
    finalPrice: number;              // Final price (discountedPrice if available, otherwise originalPrice)
    installments: [];                // Empty array (no installments for pending payments)
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

// Success (200) - Payment updated (package added to existing pending payment)
{
  status: 200;
  message: "Payment updated successfully";
  data: {
    id: string;                      // UUID
    totalPrice: number;              // Updated total price (sum of all package originalPrices)
    status: PaymentStatus;           // "PENDING"
    paymentMethod: PaymentMethod;    // "FULL_PAYMENT"
    paymentType: PaymentType;         // "GATEWAY_PAYMENT"
    user: User;                      // User relation
    discountCode: null;
    discoundPercentage: null;
    finalPrice: number;              // Updated final price (sum of all package discountedPrices or originalPrices)
    installments: [];                // Empty array
    packages: Package[];            // Array of all packages in the payment
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (400) - Package already exists in pending payment
{
  status: 400;
  message: "Package already exists in pending payment";
  data: null;
}

// Error (400) - Invalid package data
{
  status: 400;
  message: "Invalid package data";
  data: null;
}

// Error (404) - Package not found
{
  status: 404;
  message: "Package not found";
  data: null;
}

// Error (404) - User not found
{
  status: 404;
  message: "User not found";
  data: null;
}

// Error (500) - Multiple pending payments found (system error)
{
  status: 500;
  message: "Internal server error";
  data: null;
}

// Error (500) - Internal server error
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Behavior**:
- If user has no pending payment: Creates a new payment with the package
- If user has a pending payment: Adds the package to the existing payment and updates prices
- If package already exists in pending payment: Returns 400 error
- Price calculation: Uses `discountedPrice` if available and > 0, otherwise uses `originalPrice`
- Payment defaults: `FULL_PAYMENT` method, `GATEWAY_PAYMENT` type, `PENDING` status

---

### 1.5 Get Active Payment

**Endpoint**: `POST /payment/get-active-payment`

**Description**: Get the active (pending) payment for the authenticated user. This is the current shopping cart.

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
  message: "Pending payment found";
  data: {
    id: string;                      // UUID
    totalPrice: number;              // Total price of packages without discount
    status: PaymentStatus;           // "PENDING"
    paymentMethod: PaymentMethod;    // "INSTALLMENT" | "FULL_PAYMENT"
    paymentType: PaymentType;         // "CARD_TO_CARD" | "GATEWAY_PAYMENT"
    user: User;                      // User relation
    discountCode: string | null;
    discoundPercentage: number | null;
    finalPrice: number;              // Final price after applying discount codes
    installments: Installment[];     // Array of installment relations
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

// Error (404) - No pending payment found
{
  status: 404;
  message: "No pending payment found";
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

### 1.6 Delete Pending Payment

**Endpoint**: `POST /payment/delete-pending-payment`

**Description**: Delete a pending payment by its ID. Only pending payments belonging to the authenticated user can be deleted.

**Request Headers**:
```typescript
{
  Authorization: string;  // Required: "Bearer <JWT_ACCESS_TOKEN>"
}
```

**Request Body** (`DeletePendingPaymentDto`):
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
  message: "Pending payment deleted successfully";
  data: null;
}

// Error (404) - Payment not found or not pending
{
  status: 404;
  message: "user does not have pending payment with this id";
  data: null;
}

// Error (500)
{
  status: 500;
  message: "Internal server error";
  data: null;
}
```

**Notes**:
- Only pending payments can be deleted
- Only payments belonging to the authenticated user can be deleted
- Completed, failed, or suspended payments cannot be deleted through this endpoint

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
  status: number;      // HTTP status code (400, 403, 404, 500, 503, etc.)
  message: string;     // Error message
  data: null;          // Always null for errors
}
```

## Type Definitions

### Enums

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

### Entity Structures

**Payment**:
```typescript
{
  id: string;                      // UUID - Primary key
  totalPrice: number;              // Total price of packages without any discount
  status: PaymentStatus;           // Payment status enum
  paymentMethod: PaymentMethod;    // Payment method enum
  paymentType: PaymentType;         // Payment type enum
  user: User;                      // User relation
  discountCode: string | null;      // Optional discount code
  discoundPercentage: number | null; // Optional discount percentage
  finalPrice: number;              // Final price after applying discount codes
  installments: Installment[];     // Array of installment relations
  packages: Package[];            // Array of package relations (many-to-many)
  createdAt: Date;                 // Payment creation timestamp
  updatedAt: Date;                  // Last update timestamp
}
```

**Installment**:
```typescript
{
  id: string;                    // UUID - Primary key
  amount: number;                // Installment amount
  paidAt: Date | null;           // Timestamp when installment was paid
  isPaid: boolean;               // Whether the installment has been paid
  payment: Payment;              // Payment relation
}
```

## Payment Flow

### Shopping Cart Flow:
```
1. User adds package to cart → POST /payment/create-payment
   → Creates or updates pending payment
   → Returns payment with PENDING status

2. User views cart → POST /payment/get-active-payment
   → Returns pending payment with all packages

3. User removes item → POST /payment/delete-pending-payment
   → Deletes the entire pending payment

4. User completes payment → (External payment gateway)
   → Payment status updated to COMPLETED
   → User gains access to paid content
```

### Access Control Flow:
```
1. User requests lesson → POST /payment/get-lesson
   → System checks if lesson is free
   → If not free, checks payment status
   → Grants or denies access based on payment status
   → For installments, calculates accessible lessons based on paid installments
```

## Notes

1. **Authentication Required**: All endpoints require a valid JWT access token. Requests without a token or with an invalid/expired token will be rejected.

2. **Shopping Cart Behavior**: The payment system acts as a shopping cart:
   - Users can have only one pending payment at a time
   - Multiple packages can be added to a single pending payment
   - Packages cannot be added twice to the same pending payment

3. **Price Calculation**:
   - `totalPrice`: Sum of all package `originalPrice` values
   - `finalPrice`: Sum of package `discountedPrice` (if available and > 0) or `originalPrice`
   - Discount codes and percentages are not applied in the create payment endpoint (handled separately)

4. **Payment Statuses**:
   - **PENDING**: Payment created but not completed (shopping cart)
   - **COMPLETED**: Payment successfully completed
   - **FAILED**: Payment failed
   - **PARTIAL_PAYMENT**: Installment payment with some installments paid
   - **SUSPENDED**: Payment suspended (contact support)

5. **Access Control**:
   - Free lessons are always accessible
   - Completed payments grant full access
   - Installment payments with PARTIAL_PAYMENT status grant proportional access
   - Failed or suspended payments deny access

6. **Installment Access Logic**:
   - Accessible lessons = `floor(totalLessons * (paidInstallments / totalInstallments))`
   - Lessons are sorted by `numericOrder`
   - Access is granted to the first N lessons based on the calculation

7. **Payment Methods**:
   - **FULL_PAYMENT**: Single payment for the entire amount
   - **INSTALLMENT**: Payment split into multiple installments

8. **Payment Types**:
   - **GATEWAY_PAYMENT**: Payment through external payment gateway
   - **CARD_TO_CARD**: Direct card-to-card transfer

9. **UUID Format**: All ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

10. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

11. **Error Handling**: All endpoints return consistent error responses with appropriate HTTP status codes:
    - `400`: Bad request (invalid data, package already in cart, etc.)
    - `403`: Forbidden (access denied to lesson)
    - `404`: Not found (payment, package, user, or lesson not found)
    - `500`: Internal server error
    - `503`: Service unavailable (unknown payment status)

12. **Discount Codes**: Discount codes and percentages are not applied in the create payment endpoint. These features are handled in separate functions (not documented in this module).

13. **Installment Support**: Installments are created separately and linked to payments. The create payment endpoint does not create installments automatically.

14. **Multiple Pending Payments**: The system should only allow one pending payment per user. If multiple pending payments are found, it's considered a system error.

15. **Package Validation**: All packages are validated before being added to payments. Invalid or non-existent packages return appropriate error responses.

