# Module Documentation

This document provides a comprehensive overview of all modules in the project, describing what each module does and which modules it imports.

---

## Table of Contents

1. [AppModule](#appmodule)
2. [AdminModule](#adminmodule)
3. [ExamModule](#exammodule)
4. [PracticeModule](#practicemodule)
5. [PackageModule](#packagemodule)
6. [PaymentModule](#paymentmodule)
7. [CommentModule](#commentmodule)
8. [QuestionModule](#questionmodule)
9. [InteractionModule](#interactionmodule)
10. [AiAdminModule](#aiadminmodule)
11. [UploaderModule](#uploadermodule)
12. [AuthModule](#authmodule)
13. [RedisModule](#redismodule)
14. [UserModule](#usermodule)

---

## AppModule

**Location:** `src/app.module.ts`

**Purpose:** 
The root module of the application. It serves as the main entry point that configures and imports all other modules, sets up global configurations including database connection (PostgreSQL via TypeORM), static file serving, environment configuration, and Redis caching.

**Imports:**
- `UserModule` - User management functionality
- `RedisModule` - Redis caching service (global)
- `AuthModule` - Authentication and authorization
- `AdminModule` - Admin panel functionality
- `InteractionModule` - Email and SMS interaction services
- `UploaderModule` - File upload functionality
- `PaymentModule` - Payment processing
- `CommentModule` - Comment management
- `QuestionModule` - Question management
- `PracticeModule` - Practice exercises management
- `ExamModule` - Exam functionality
- External modules:
  - `ConfigModule` (global) - Environment configuration
  - `TypeOrmModule` - Database ORM configuration
  - `ServeStaticModule` - Static file serving for uploaded images

---

## AdminModule

**Location:** `src/admin/admin.module.ts`

**Purpose:** 
Provides administrative functionality for managing various aspects of the system. It includes controllers for managing packages, users, payments, comments, and practices. This module acts as a centralized admin interface that delegates operations to respective management services.

**Imports:**
- `UserModule` - For user management operations
- `PackageModule` - For package management operations
- `PaymentModule` - For payment management operations
- `CommentModule` - For comment management operations
- `PracticeModule` - For practice management operations

**Controllers:**
- `AdminPackageController` - Package administration
- `AdminUserController` - User administration
- `AdminPaymentController` - Payment administration
- `AdminPracticeController` - Practice administration

---

## ExamModule

**Location:** `src/exam/exam.module.ts`

**Purpose:** 
Manages exam functionality including creating exams from practice questions, tracking exam progress, managing exam questions, and storing practice history. It handles exam lifecycle from creation to completion, including time limits, question ordering, and answer tracking.

**Imports:**
- `TypeOrmModule.forFeature([Exam, ExamQuestion, PracticeHistory, Practice])` - Database entities for exams

**Exports:**
- `ExamManagementService` - Exam management operations
- `ExamService` - Exam business logic

**Note:** This module uses the `Practice` entity from the PracticeModule but doesn't import the module directly, instead importing the entity through TypeORM.

---

## PracticeModule

**Location:** `src/practice/practice.module.ts`

**Purpose:** 
Manages practice exercises that are associated with lessons. It handles creating, updating, and retrieving practice questions that students can use to test their knowledge. Practices are used as the source for exam questions.

**Imports:**
- `TypeOrmModule.forFeature([Practice])` - Practice entity
- `PackageModule` - To access lesson information for creating practices

**Exports:**
- `PracticeService` - Practice retrieval operations
- `PracticeManagementService` - Practice CRUD operations

---

## PackageModule

**Location:** `src/package/package.module.ts`

**Purpose:** 
Manages the core learning content structure including packages, chapters, parts, lessons, words, and personal notes. This is the central module for organizing educational content in a hierarchical structure (Package → Chapter → Part → Lesson). It also handles vocabulary (words) and user personal notes.

**Imports:**
- `TypeOrmModule.forFeature([Package, Chapter, Part, Lesson, Word, PersonalNote])` - All package-related entities

**Exports:**
- `PackageService` - Package retrieval and user operations
- `PackageManagementService` - Package CRUD operations

**Note:** This module does not import other application modules, making it a foundational module that other modules depend on.

---

## PaymentModule

**Location:** `src/payment/payment.module.ts`

**Purpose:** 
Handles payment processing, payment creation, payment tracking, and installment management. It manages the relationship between users, packages, and payments, including payment status, methods, and installment plans.

**Imports:**
- `TypeOrmModule.forFeature([Payment, Installment])` - Payment and installment entities
- `PackageModule` - To validate and retrieve package information for payments
- `UserModule` - To validate and retrieve user information for payments

**Exports:**
- `PaymentManagementService` - Payment management operations (used by AdminModule)

---

## CommentModule

**Location:** `src/comment/comment.module.ts`

**Purpose:** 
Manages user comments on packages. It handles comment creation, retrieval, and moderation. Comments can be in PENDING or APPROVED status, allowing for moderation workflow.

**Imports:**
- `TypeOrmModule.forFeature([Comment])` - Comment entity
- `UserModule` - To validate users when creating comments
- `PackageModule` - To validate packages when creating comments

**Exports:**
- `CommentManagementService` - Comment moderation operations (used by AdminModule)

---

## QuestionModule

**Location:** `src/question/question.module.ts`

**Purpose:** 
Manages user-submitted questions about lessons. Users can ask questions about specific lessons, and these questions can be public or private. Questions go through a moderation process (PENDING status) before being answered by admins.

**Imports:**
- `TypeOrmModule.forFeature([Question])` - Question entity

**Exports:**
- `QuestionManagementService` - Question moderation and answering operations (used by AdminModule)

**Note:** This module does not import other application modules directly, but the Question entity has relationships with User and Lesson entities.

---

## InteractionModule

**Location:** `src/interaction/interaction.module.ts`

**Purpose:** 
Provides communication services including SMS (via Kavenegar API) and email functionality. It handles sending OTP codes via SMS and email for authentication purposes. This is a utility module used by the authentication system.

**Imports:**
- `HttpModule` (from `@nestjs/axios`) - For making HTTP requests to SMS API
- `MailerModule` (from `@nestjs-modules/mailer`) - For sending emails via SMTP

**Exports:**
- `InteractionService` - Communication service (used by AuthModule)

**Note:** This module does not import other application modules, making it a utility service module.

---

## AiAdminModule

**Location:** `src/ai-admin/ai-admin.module.ts`

**Purpose:** 
Provides a specialized interface for AI bots to create users in the system. It uses a custom guard (AiAdminGuard) that validates requests based on a secret token in headers, allowing automated user creation by AI systems.

**Imports:**
- `UserModule` - To create users via UserManagementService

**Exports:**
- None

---

## UploaderModule

**Location:** `src/uploader/uploader.module.ts`

**Purpose:** 
Handles file uploads, specifically image uploads. It manages the storage of uploaded images and maintains metadata about uploaded files. Images are stored in the `uploads` directory and served statically.

**Imports:**
- `TypeOrmModule.forFeature([ImageInfo])` - Image metadata entity

**Exports:**
- None

---

## AuthModule

**Location:** `src/Auth/auth.module.ts`

**Purpose:** 
Handles authentication and authorization. It manages OTP-based authentication (via phone and email), JWT token generation and validation, user login/logout, and token refresh. It provides guards for protecting routes (AccessTokenGuard, AdminGuard).

**Imports:**
- `InteractionModule` - To send OTP codes via SMS and email
- `JwtModule` (global) - For JWT token operations
- `UserModule` - To find or create users during authentication

**Exports:**
- None (but provides guards that are used throughout the application)

---

## RedisModule

**Location:** `src/redis/redis.module.ts`

**Purpose:** 
Provides Redis caching functionality as a global service. It manages Redis connection and provides a RedisService for storing and retrieving cached data. Used primarily for storing OTP codes with expiration times.

**Imports:**
- None (uses external Redis client)

**Exports:**
- `REDIS_CLIENT` - Redis client instance
- `RedisService` - Redis operations service

**Note:** This is a `@Global()` module, meaning its exports are available to all modules without explicit import.

---

## UserModule

**Location:** `src/User/user.module.ts`

**Purpose:** 
Manages user accounts, user profiles, and user-related operations. It handles user CRUD operations, profile updates, user authentication state (refresh tokens), and user role management. This is a foundational module used by many other modules.

**Imports:**
- `TypeOrmModule.forFeature([User])` - User entity

**Exports:**
- `UserService` - User retrieval and profile operations
- `UserManagmentService` - User CRUD operations (used by AdminModule and AiAdminModule)

---

## Module Dependency Graph

```
AppModule (Root)
├── UserModule
│   └── (no module dependencies)
├── RedisModule (Global)
│   └── (no module dependencies)
├── AuthModule
│   ├── UserModule
│   ├── InteractionModule
│   │   └── (no module dependencies)
│   └── JwtModule (external)
├── AdminModule
│   ├── UserModule
│   ├── PackageModule
│   │   └── (no module dependencies)
│   ├── PaymentModule
│   │   ├── PackageModule
│   │   └── UserModule
│   ├── CommentModule
│   │   ├── UserModule
│   │   └── PackageModule
│   └── PracticeModule
│       └── PackageModule
├── InteractionModule
│   └── (no module dependencies)
├── UploaderModule
│   └── (no module dependencies)
├── PaymentModule
│   ├── PackageModule
│   └── UserModule
├── CommentModule
│   ├── UserModule
│   └── PackageModule
├── QuestionModule
│   └── (no module dependencies)
├── PracticeModule
│   └── PackageModule
├── ExamModule
│   └── (uses Practice entity via TypeORM)
└── AiAdminModule
    └── UserModule
```

---

## Summary

The application follows a modular architecture where:

1. **Core Modules** (no dependencies on other app modules):
   - `UserModule` - User management
   - `PackageModule` - Content structure
   - `RedisModule` - Caching (global)
   - `InteractionModule` - Communication utilities
   - `UploaderModule` - File uploads
   - `QuestionModule` - User questions

2. **Feature Modules** (depend on core modules):
   - `AuthModule` - Authentication (uses UserModule, InteractionModule)
   - `PaymentModule` - Payments (uses UserModule, PackageModule)
   - `CommentModule` - Comments (uses UserModule, PackageModule)
   - `PracticeModule` - Practices (uses PackageModule)
   - `ExamModule` - Exams (uses Practice entity)

3. **Administrative Modules**:
   - `AdminModule` - Admin interface (uses multiple feature modules)
   - `AiAdminModule` - AI bot interface (uses UserModule)

4. **Root Module**:
   - `AppModule` - Orchestrates all modules and global configuration

