# Data Structure and Entities Documentation

This document provides a comprehensive overview of the database structure, entities, and their relationships in the MIMO project.

---

## Table of Contents

1. [Database Overview](#database-overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Core Entities](#core-entities)
   - [User](#user)
   - [Package](#package)
   - [Chapter](#chapter)
   - [Part](#part)
   - [Lesson](#lesson)
   - [Word](#word)
4. [Payment Entities](#payment-entities)
   - [Payment](#payment)
   - [Installment](#installment)
   - [DiscountCode](#discountcode)
5. [Content Interaction Entities](#content-interaction-entities)
   - [Comment](#comment)
   - [Question](#question)
   - [PersonalNote](#personalnote)
6. [Learning & Assessment Entities](#learning--assessment-entities)
   - [Practice](#practice)
   - [Exam](#exam)
   - [ExamQuestion](#examquestion)
   - [PracticeHistory](#practicehistory)
7. [Utility Entities](#utility-entities)
   - [ImageInfo](#imageinfo)
8. [Entity Relationships Summary](#entity-relationships-summary)

---

## Database Overview

**Database Type:** PostgreSQL  
**ORM:** TypeORM  
**Primary Key Strategy:** UUID (Universally Unique Identifier)  
**Timestamps:** Most entities include `createdAt` and `updatedAt` timestamps

The database follows a relational model with clear hierarchical structures for educational content and comprehensive tracking of user interactions, payments, and learning progress.

---

## Entity Relationship Diagram

```
User
├── OneToMany → Payment
├── OneToMany → Comment
├── OneToMany → Question
├── OneToMany → PersonalNote
├── OneToMany → Exam
└── OneToMany → PracticeHistory

Package
├── OneToMany → Chapter
├── ManyToMany → Payment
└── OneToMany → Comment

Chapter
├── ManyToOne → Package
└── OneToMany → Part

Part
├── ManyToOne → Chapter
└── OneToMany → Lesson

Lesson
├── ManyToOne → Part
├── OneToMany → Word
├── OneToMany → Practice
└── OneToMany → Question

Word
├── ManyToOne → Lesson
└── OneToMany → PersonalNote

Payment
├── ManyToOne → User
├── ManyToMany → Package
└── OneToMany → Installment

Exam
├── ManyToOne → User
└── OneToMany → ExamQuestion

ExamQuestion
├── ManyToOne → Exam
└── ManyToOne → Practice

PracticeHistory
├── ManyToOne → User
├── ManyToOne → Practice
└── ManyToOne → Exam
```

---

## Core Entities

### User

**Location:** `src/User/entities/user.entity.ts`  
**Table Name:** `user`

The central entity representing users of the system. Supports both regular users and administrators.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `name` | varchar | Nullable | User's first name |
| `familyName` | varchar | Nullable | User's last name |
| `email` | varchar | Nullable | Email address |
| `telegramId` | varchar | Unique, Nullable | Telegram user ID |
| `isEmailVerified` | boolean | Default: false | Email verification status |
| `phoneNumber` | varchar | Unique, Nullable | Phone number |
| `isPhoneNumberVerified` | boolean | Default: false | Phone verification status |
| `role` | enum | Default: USER | User role (USER, ADMIN) |
| `hashedRefreshToken` | varchar | Nullable | JWT refresh token hash |
| `createdAt` | timestamp | Auto | Creation timestamp |
| `updatedAt` | timestamp | Auto | Last update timestamp |

#### Relationships

- **OneToMany** → `Payment[]` - User's payment transactions
- **OneToMany** → `Comment[]` - User's comments on packages
- **OneToMany** → `Question[]` - User's questions about lessons
- **OneToMany** → `PersonalNote[]` - User's personal notes on words
- **OneToMany** → `Exam[]` - User's exam attempts
- **OneToMany** → `PracticeHistory[]` - User's practice attempt history

#### Enums

```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

---

### Package

**Location:** `src/package/entities/package.entity.ts`  
**Table Name:** `package`

Represents educational packages/courses available for purchase. Contains hierarchical content structure.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `packageName` | varchar | Required | Package name |
| `subtitle` | varchar | Required | Package subtitle |
| `level` | varchar | Required | Difficulty level |
| `category` | text[] | Array | Categories/tags |
| `rate` | float | Nullable | Average rating |
| `rateCount` | int | Nullable | Number of ratings |
| `description` | text | Required | Package description |
| `originalPrice` | numeric | Required | Original price |
| `discountedPrice` | numeric | Nullable | Discounted price |
| `discountTitle` | varchar | Required | Discount label |
| `isInstallmentAvailable` | boolean | Required | Installment option flag |
| `installmentCount` | int | Nullable | Number of installments |
| `source` | varchar | Required | Package source |
| `imageUrl` | varchar | Required | Package image URL |
| `badge` | varchar | Required | Badge/label |
| `specifications` | jsonb | Nullable | Array of spec objects `{icon, label, value}` |
| `createdAt` | timestamp | Auto | Creation timestamp |
| `updatedAt` | timestamp | Auto | Last update timestamp |

#### Relationships

- **OneToMany** → `Chapter[]` - Package chapters (CASCADE delete)
- **ManyToMany** → `Payment[]` - Payments that include this package
- **OneToMany** → `Comment[]` - Comments on this package

---

### Chapter

**Location:** `src/package/entities/chapter.entity.ts`  
**Table Name:** `chapter`

Represents a chapter within a package. Part of the hierarchical content structure.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `title` | varchar | Required | Chapter title |
| `numericOrder` | int | Required | Display order |

#### Relationships

- **ManyToOne** → `Package` - Parent package (CASCADE delete)
- **OneToMany** → `Part[]` - Chapter parts

---

### Part

**Location:** `src/package/entities/part.entity.ts`  
**Table Name:** `part`

Represents a part within a chapter. Further subdivision of content.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `title` | varchar | Required | Part title |
| `numericOrder` | int | Required | Display order |

#### Relationships

- **ManyToOne** → `Chapter` - Parent chapter
- **OneToMany** → `Lesson[]` - Part lessons (CASCADE)

---

### Lesson

**Location:** `src/package/entities/lesson.entity.ts`  
**Table Name:** `lesson`

Represents an individual lesson containing words, practices, and questions.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `title` | varchar | Required | Lesson title |
| `description` | varchar | Required | Lesson description |
| `numericOrder` | int | Required | Display order |
| `imageUrl` | varchar | Required | Lesson image URL |
| `isFree` | boolean | Required | Free access flag |

#### Relationships

- **ManyToOne** → `Part` - Parent part (CASCADE delete)
- **OneToMany** → `Word[]` - Lesson vocabulary words
- **OneToMany** → `Practice[]` - Lesson practice exercises
- **OneToMany** → `Question[]` - User questions about lesson

---

### Word

**Location:** `src/package/entities/words.entity.ts`  
**Table Name:** `word`

Represents vocabulary words within a lesson.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `word` | varchar | Required | The word itself |
| `title` | varchar | Required | Word title |
| `subtitle` | varchar | Required | Word subtitle |
| `description` | varchar | Required | Word description |
| `imageUrl` | varchar | Required | Word image URL |

#### Relationships

- **ManyToOne** → `Lesson` - Parent lesson (CASCADE delete)
- **OneToMany** → `PersonalNote[]` - User notes on this word

---

## Payment Entities

### Payment

**Location:** `src/payment/entity/payment.entity.ts`  
**Table Name:** `payment`

Represents a payment transaction for one or more packages.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `totalPrice` | numeric | Required | Total price before discounts |
| `status` | enum | Required | Payment status |
| `paymentMethod` | enum | Required | Payment method type |
| `paymentType` | enum | Required | Payment processing type |
| `discountCode` | varchar | Nullable | Applied discount code |
| `discoundPercentage` | numeric | Nullable | Discount percentage applied |
| `finalPrice` | numeric | Required | Final price after discounts |
| `createdAt` | timestamp | Auto | Creation timestamp |
| `updatedAt` | timestamp | Auto | Last update timestamp |

#### Relationships

- **ManyToOne** → `User` - Payment owner
- **ManyToMany** → `Package[]` - Packages included in payment
- **OneToMany** → `Installment[]` - Payment installments (CASCADE)

#### Enums

```typescript
enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL_PAYMENT = 'PARTIAL_PAYMENT',
  SUSPENDED = 'SUSPENDED',
}

enum PaymentMethod {
  INSTALLMENT = 'INSTALLMENT',
  FULL_PAYMENT = 'FULL_PAYMENT',
}

enum PaymentType {
  CARD_TO_CARD = 'CARD_TO_CARD',
  GATEWAY_PAYMENT = 'GATEWAY_PAYMENT',
}
```

---

### Installment

**Location:** `src/payment/entity/installment.entity.ts`  
**Table Name:** `installment`

Represents individual installment payments for a payment transaction.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `amount` | numeric | Required | Installment amount |
| `paidAt` | timestamp | Nullable | Payment completion timestamp |
| `isPaid` | boolean | Default: false | Payment status |

#### Relationships

- **ManyToOne** → `Payment` - Parent payment transaction

---

### DiscountCode

**Location:** `src/payment/entity/discount-code.entity.ts`  
**Table Name:** `discount_code`

Represents discount codes that can be applied to payments.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `code` | varchar | Unique, Required | Discount code string |
| `percentage` | numeric | Required | Discount percentage |
| `createdAt` | timestamp | Auto | Creation timestamp |
| `updatedAt` | timestamp | Auto | Last update timestamp |

#### Relationships

- None (standalone entity)

---

## Content Interaction Entities

### Comment

**Location:** `src/comment/entity/comment.entity.ts`  
**Table Name:** `comment`

Represents user comments on packages. Requires admin approval before display.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `content` | text | Required | Comment text |
| `status` | enum | Default: PENDING | Approval status |
| `createdAt` | timestamp | Auto | Creation timestamp |

#### Relationships

- **ManyToOne** → `User` - Comment author (EAGER load)
- **ManyToOne** → `Package` - Commented package (EAGER load)

#### Enums

```typescript
enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}
```

---

### Question

**Location:** `src/question/entity/question.entity.ts`  
**Table Name:** `question`

Represents user questions about lessons. Can be public or private.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `content` | varchar | Required | Question text |
| `answer` | varchar | Required | Answer text |
| `status` | enum | Default: PENDING | Answer status |
| `visibility` | enum | Default: PRIVATE | Visibility setting |
| `createdAt` | timestamp | Auto | Creation timestamp |

#### Relationships

- **ManyToOne** → `User` - Question author (CASCADE delete)
- **ManyToOne** → `Lesson` - Related lesson (CASCADE delete)

#### Enums

```typescript
enum QuestionStatus {
  PENDING = 'PENDING',
  ANSWERED = 'ANSWERED',
}

enum QuestionVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
```

---

### PersonalNote

**Location:** `src/package/entities/personal-notes.entity.ts`  
**Table Name:** `personal_note`

Represents user's personal notes on vocabulary words.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `content` | varchar | Required | Note content |
| `createdAt` | timestamp | Auto | Creation timestamp |

#### Relationships

- **ManyToOne** → `User` - Note owner
- **ManyToOne** → `Word` - Related word

---

## Learning & Assessment Entities

### Practice

**Location:** `src/practice/entity/practice.entity.ts`  
**Table Name:** `practice`

Represents practice exercises/questions for lessons.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `question` | text | Required | Practice question |
| `options` | jsonb | Required | Answer options object |
| `imageUrl` | varchar | Nullable | Question image URL |
| `correctAnswer` | varchar | Required | Correct answer |
| `explanation` | text | Nullable | Answer explanation |

#### Relationships

- **ManyToOne** → `Lesson` - Parent lesson

---

### Exam

**Location:** `src/exam/entity/exam.entity.ts`  
**Table Name:** `exam`

Represents an exam session containing multiple practice questions from various lessons.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `lessonIds` | jsonb | Required | Array of lesson IDs included |
| `totalQuestions` | int | Required | Total number of questions |
| `timeLimitMinutes` | int | Nullable | Time limit (null = unlimited) |
| `status` | enum | Default: IN_PROGRESS | Exam status |
| `showAnswersAfterEachQuestion` | boolean | Default: false | Answer display mode |
| `startedAt` | timestamp | Nullable | Exam start time |
| `completedAt` | timestamp | Nullable | Exam completion time |
| `currentQuestionIndex` | int | Default: 0 | Current question position |
| `createdAt` | timestamp | Auto | Creation timestamp |
| `updatedAt` | timestamp | Auto | Last update timestamp |

#### Relationships

- **ManyToOne** → `User` - Exam owner (CASCADE delete)
- **OneToMany** → `ExamQuestion[]` - Exam questions (CASCADE)

#### Enums

```typescript
enum ExamStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}
```

---

### ExamQuestion

**Location:** `src/exam/entity/exam-question.entity.ts`  
**Table Name:** `exam_question`

Represents a practice question within an exam, tracking user answers and performance.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `orderIndex` | int | Required | Question position in exam |
| `userAnswer` | varchar | Nullable | User's selected answer |
| `isUnsure` | boolean | Default: false | "I am not sure" flag |
| `isCorrect` | boolean | Nullable | Answer correctness (null = unanswered) |
| `isAnswered` | boolean | Default: false | Answer submission status |
| `answeredAt` | timestamp | Nullable | Answer submission time |
| `createdAt` | timestamp | Auto | Creation timestamp |

#### Relationships

- **ManyToOne** → `Exam` - Parent exam (CASCADE delete)
- **ManyToOne** → `Practice` - Source practice question (EAGER load)

---

### PracticeHistory

**Location:** `src/exam/entity/practice-history.entity.ts`  
**Table Name:** `practice_history`

Tracks user's historical attempts at practice questions, linked to exams.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `userAnswer` | varchar | Nullable | User's answer |
| `isCorrect` | boolean | Required | Answer correctness |
| `isUnsure` | boolean | Required | "I am not sure" flag |
| `wasAnswered` | boolean | Required | Whether question was answered |
| `createdAt` | timestamp | Auto | Creation timestamp |

#### Relationships

- **ManyToOne** → `User` - User who attempted (CASCADE delete)
- **ManyToOne** → `Practice` - Practice question (EAGER load)
- **ManyToOne** → `Exam` - Related exam (CASCADE delete)

#### Indexes

- Composite index on `(user, practice)` for faster queries

---

## Utility Entities

### ImageInfo

**Location:** `src/uploader/entity/imageInfo.entity.ts`  
**Table Name:** `image_info`

Tracks uploaded image files.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `filename` | varchar | Required | Image filename |
| `createdAt` | timestamp | Auto | Creation timestamp |

#### Relationships

- None (standalone entity)

---

## Entity Relationships Summary

### Hierarchical Content Structure

```
Package
  └── Chapter (OneToMany, CASCADE)
      └── Part (OneToMany)
          └── Lesson (OneToMany, CASCADE)
              ├── Word (OneToMany, CASCADE)
              ├── Practice (OneToMany)
              └── Question (OneToMany, CASCADE)
```

### User-Centric Relationships

- **User → Payment**: One user can have many payments
- **User → Comment**: One user can have many comments
- **User → Question**: One user can have many questions
- **User → PersonalNote**: One user can have many personal notes
- **User → Exam**: One user can have many exams
- **User → PracticeHistory**: One user can have many practice history records

### Payment Relationships

- **Payment ↔ Package**: Many-to-many relationship (one payment can include multiple packages, one package can be in multiple payments)
- **Payment → Installment**: One payment can have many installments

### Learning & Assessment Relationships

- **Exam → ExamQuestion**: One exam contains many questions
- **ExamQuestion → Practice**: Each exam question references a practice question
- **PracticeHistory**: Links User, Practice, and Exam together to track attempts

### Content Interaction Relationships

- **Comment**: Links User and Package
- **Question**: Links User and Lesson
- **PersonalNote**: Links User and Word

---

## Database Design Patterns

### 1. UUID Primary Keys
All entities use UUID primary keys for better distribution and security.

### 2. Soft Deletes
Currently not implemented, but CASCADE deletes are used in parent-child relationships.

### 3. Timestamps
Most entities include `createdAt` and `updatedAt` for audit trails.

### 4. Enum Types
Used for status fields, payment types, and user roles to ensure data integrity.

### 5. JSONB Fields
Used for flexible data storage:
- `Package.specifications`: Array of specification objects
- `Practice.options`: Answer options object
- `Exam.lessonIds`: Array of lesson IDs

### 6. Eager Loading
Some relationships use eager loading for performance:
- `Comment.user` and `Comment.package`
- `PracticeHistory.practice`
- `ExamQuestion.practice`

### 7. Cascade Deletes
Used to maintain referential integrity:
- Package → Chapter (CASCADE)
- Part → Lesson (CASCADE)
- Lesson → Word (CASCADE)
- User → Question (CASCADE)
- User → Exam (CASCADE)
- Exam → ExamQuestion (CASCADE)
- User → PracticeHistory (CASCADE)

---

## Notes

- The database uses PostgreSQL with TypeORM for ORM functionality
- Auto-synchronization is enabled in non-production environments
- All entities are automatically loaded by TypeORM (`autoLoadEntities: true`)
- The system supports both email and phone number authentication
- Payment system supports both full payment and installment options
- Exam system allows flexible question selection from multiple lessons
- Practice history provides comprehensive tracking of user learning progress

---

*Last Updated: Based on current codebase structure*

