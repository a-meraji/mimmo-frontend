# Uploader Module Endpoints Documentation

## Overview

The Uploader Module provides endpoints for uploading image files and retrieving uploaded image information. Users can upload images (PNG, JPG, JPEG, GIF) which are stored on the server and can be retrieved later. Uploaded images are served statically and their metadata is stored in the database.

## Module Dependencies

The Uploader Module imports the following modules:
- **TypeORM**: For database entity management (ImageInfo entity)

## Authentication

All uploader endpoints do not require authentication:
- **Upload File**: No authentication required
- **Get Images**: No authentication required

## Static File Serving

Uploaded images are served statically via the `ServeStaticModule` configured in `AppModule`:
- **Base Path**: `/images`
- **Storage Location**: `./uploads` directory
- **Access URL**: `http://<host>/images/<filename>`

---

## 1. File Upload Endpoints

**Base Path**: `/uploader` (for upload) and `/images` (for retrieval)  
**Guard**: None (no authentication required)

### 1.1 Upload Image

**Endpoint**: `POST /uploader/upload`

**Description**: Upload an image file to the server. The file is saved to the `./uploads` directory with a unique filename, and its metadata is stored in the database.

**Authentication**: Not required

**Request**:
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with a file field named `file`

**Request Body** (multipart/form-data):
```
file: File  // Required: Image file (PNG, JPG, JPEG, or GIF)
```

**Response**:
```typescript
// Success (201)
{
  status: 201;
  message: "Image info saved successfully";
  data: {
    id: string;                           // UUID (or number, depending on entity configuration)
    filename: string;                      // Generated unique filename (e.g., "file-1234567890-987654321.jpg")
    createdAt: Date;
  };
}

// Error (400) - File upload failed
{
  status: 400;
  message: "File upload failed";
  // Note: This is thrown as BadRequestException, not returned as JSON
}

// Error (400) - Invalid file type
{
  status: 400;
  message: "Only image files are allowed!";
  // Note: This is thrown as BadRequestException, not returned as JSON
}

// Error (500)
{
  status: 500;
  message: "Failed to save image info";
  data: null;
}
```

**Notes**:
- Only image files are allowed: PNG, JPG, JPEG, GIF
- File validation is performed based on MIME type: `image/png`, `image/jpg`, `image/jpeg`, `image/gif`
- Files are saved with a unique filename format: `file-<timestamp>-<randomNumber>.<extension>`
- The original filename is not preserved
- Files are stored in the `./uploads` directory
- After upload, the image can be accessed at: `/images/<filename>`
- The filename is stored in the database for later retrieval

---

### 1.2 Get Images

**Endpoint**: `POST /images`

**Description**: Retrieve a paginated list of all uploaded images, ordered by creation date (most recent first).

**Authentication**: Not required

**Request Body** (`GetImagesDto`):
```typescript
{
  page: number;  // Required: Page number (1-based)
}
```

**Response**:
```typescript
// Success (200)
{
  status: 200;
  message: "Images retrieved successfully";
  data: {
    images: Array<{
      id: string;                           // UUID (or number, depending on entity configuration)
      filename: string;                    // Image filename
      createdAt: Date;
    }>;
    total: number;                          // Total number of images
    page: number;                           // Current page number
    pageSize: 25;                           // Number of images per page
    totalPages: number;                     // Total number of pages
  };
}

// Error (500)
{
  status: 500;
  message: "Failed to retrieve images";
  data: null;
}
```

**Notes**:
- Pagination: 25 images per page
- Page numbers are 1-based (page 1 = first page)
- Images are returned in descending order by creation date (most recent first)
- Returns metadata only (filename, id, createdAt) - not the actual image files
- To access the actual image, use: `/images/<filename>`

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
  status: number;      // HTTP status code (400, 500, etc.)
  message: string;     // Error message
  data: null;          // Always null for errors (or exception thrown)
}
```

---

## Type Definitions

### ImageInfo Entity

```typescript
{
  id: string | number;  // UUID (or number, depending on entity configuration)
  filename: string;     // Generated unique filename
  createdAt: Date;      // Creation timestamp
}
```

---

## Notes

1. **No Authentication**: All uploader endpoints are publicly accessible without authentication.

2. **File Storage**:
   - Files are stored in the `./uploads` directory relative to the application root
   - Files are saved with unique names to prevent conflicts
   - Original filenames are not preserved

3. **File Naming**:
   - Format: `file-<timestamp>-<randomNumber>.<extension>`
   - Example: `file-1234567890123-987654321.jpg`
   - Ensures uniqueness even with concurrent uploads

4. **Supported Image Formats**:
   - PNG (image/png)
   - JPG (image/jpg)
   - JPEG (image/jpeg)
   - GIF (image/gif)
   - Other formats are rejected with a 400 error

5. **File Validation**:
   - Validation is performed based on MIME type
   - File extension is extracted from the original filename
   - Invalid file types are rejected before saving

6. **Static File Serving**:
   - Uploaded images are served via `ServeStaticModule`
   - Base URL: `/images`
   - Access pattern: `http://<host>/images/<filename>`
   - Configured in `AppModule` with `rootPath: './uploads'` and `serveRoot: '/images'`

7. **Pagination**: 
   - `get-images` uses pagination with 25 images per page
   - Page numbers are 1-based (page 1 = first page)
   - Returns total count and total pages for pagination UI

8. **Image Ordering**: 
   - Images are returned in descending order by `createdAt` (most recent first)
   - Useful for displaying latest uploads first

9. **UUID Format**: ID fields use UUID format (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`), though the entity may be configured differently

10. **Request Methods**: 
    - Upload endpoint uses `POST` method with `multipart/form-data`
    - Get images endpoint uses `POST` method with JSON body

11. **Date Fields**: All date fields are returned as ISO 8601 formatted strings or Date objects depending on the serialization configuration.

12. **Error Handling**: 
    - File upload errors (missing file, invalid type) throw `BadRequestException`
    - Database errors return status 500 with error message
    - All errors are logged to console

13. **File Size**: 
    - No explicit file size limit is set in the code
    - Default limits may apply from NestJS/Multer configuration
    - Consider implementing file size validation for production use

14. **Security Considerations**:
    - Files are stored with predictable naming patterns
    - No authentication required for uploads (consider adding in production)
    - No file content validation beyond MIME type (consider adding virus scanning)
    - Static file serving is public (consider adding access controls)

15. **Image Access**: 
    - Once uploaded, images can be accessed directly via: `/images/<filename>`
    - The filename returned in the upload response can be used to construct the image URL
    - Example: If filename is `file-1234567890-987654321.jpg`, access it at `/images/file-1234567890-987654321.jpg`

16. **Database Storage**: 
    - Only metadata (filename, id, createdAt) is stored in the database
    - Actual image files are stored on the filesystem
    - The database record links to the file via the filename

17. **File Cleanup**: 
    - No automatic cleanup of old files is implemented
    - Consider implementing a cleanup job for unused images
    - Database records may need to be cleaned up separately from files

