# Image URL Utility Guide

## Overview

The `imageUrl.js` utility provides a consistent way to build image URLs throughout the application. It automatically handles the backend base URL for different environments (development/production).

## Why Use This?

- **Consistent URLs**: All images use the correct backend URL
- **Environment-aware**: Automatically switches between dev/prod URLs
- **DRY Principle**: Single source of truth for image URL building
- **Easy to maintain**: Change base URL logic in one place

## Base URLs

### Development
- Client-side: `http://localhost:3000`
- Server-side: `http://localhost:3000`

### Production
- Client-side: `https://back.mimmoacademy.com`
- Server-side: `http://127.0.0.1:3000`

## Functions

### `getImageUrl(imagePathOrFilename)`

Main function to build image URLs. Handles various input formats:

```javascript
import { getImageUrl } from '@/utils/imageUrl';

// From filename
getImageUrl('file-123456.jpg')
// → 'https://back.mimmoacademy.com/images/file-123456.jpg'

// From path
getImageUrl('/images/file-123456.jpg')
// → 'https://back.mimmoacademy.com/images/file-123456.jpg'

// From full URL (returns as-is)
getImageUrl('https://example.com/image.jpg')
// → 'https://example.com/image.jpg'

// Empty/null returns empty string
getImageUrl('')
// → ''
```

### `buildImageUrl(filename)`

Convenience alias for `getImageUrl`:

```javascript
import { buildImageUrl } from '@/utils/imageUrl';

buildImageUrl('file-123456.jpg')
// → 'https://back.mimmoacademy.com/images/file-123456.jpg'
```

### `getFilenameFromUrl(imageUrl)`

Extract just the filename from a full URL or path:

```javascript
import { getFilenameFromUrl } from '@/utils/imageUrl';

getFilenameFromUrl('https://back.mimmoacademy.com/images/file-123456.jpg')
// → 'file-123456.jpg'

getFilenameFromUrl('/images/file-123456.jpg')
// → 'file-123456.jpg'
```

## Usage Examples

### In React Components

```javascript
import { getImageUrl } from '@/utils/imageUrl';

function PackageCard({ pkg }) {
  return (
    <div>
      <img 
        src={getImageUrl(pkg.imageUrl)} 
        alt={pkg.packageName} 
      />
    </div>
  );
}
```

### In Forms

```javascript
import { getImageUrl } from '@/utils/imageUrl';

function MyForm() {
  const [imageUrl, setImageUrl] = useState('/images/file-123.jpg');
  
  return (
    <div>
      {/* Store the path in state */}
      <input 
        type="text" 
        value={imageUrl} 
        onChange={(e) => setImageUrl(e.target.value)} 
      />
      
      {/* Use getImageUrl for display */}
      {imageUrl && (
        <img src={getImageUrl(imageUrl)} alt="Preview" />
      )}
    </div>
  );
}
```

### In List/Gallery Views

```javascript
import { getImageUrl } from '@/utils/imageUrl';

function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <img
          key={image.id}
          src={getImageUrl(image.filename)}
          alt="Gallery"
        />
      ))}
    </div>
  );
}
```

### With API Responses

```javascript
import { getImageUrl } from '@/utils/imageUrl';

async function fetchPackages() {
  const response = await clientAPI.post('/package/all', { page: 1 });
  const packages = response.data.packages;
  
  // Use getImageUrl when rendering
  return packages.map(pkg => ({
    ...pkg,
    displayImageUrl: getImageUrl(pkg.imageUrl) // For immediate use
  }));
}
```

## Storage Convention

### Store Relative Paths

When storing image URLs in your state or forms, **store the relative path**:

```javascript
// ✅ Good - Store relative path
const [imageUrl, setImageUrl] = useState('/images/file-123.jpg');

// ❌ Bad - Don't store full URL
const [imageUrl, setImageUrl] = useState('https://back.mimmoacademy.com/images/file-123.jpg');
```

### Display with Full URL

When rendering images, **use getImageUrl() to get the full URL**:

```javascript
// ✅ Good - Build full URL for display
<img src={getImageUrl(imageUrl)} alt="Preview" />

// ❌ Bad - Direct use of stored path
<img src={imageUrl} alt="Preview" />
```

## Integration Points

### Already Updated

These components/pages already use `getImageUrl`:

1. ✅ `components/admin/forms/ImageUpload.jsx`
   - Preview images
   - Gallery selection

2. ✅ `app/admin/packages/page.js`
   - Package card images

3. ✅ `components/admin/packages/WordsManagement.jsx`
   - Word thumbnail images

### To Update

If you find image rendering in these files, update them to use `getImageUrl`:

- Any component displaying lesson images
- Any component displaying word images
- Public-facing package displays
- User profile images (if implemented)
- Any other image rendering

## Best Practices

### DO ✅

```javascript
// Import the utility
import { getImageUrl } from '@/utils/imageUrl';

// Use for all image src attributes
<img src={getImageUrl(imageUrl)} alt="Description" />

// Store relative paths in database/state
const imagePath = '/images/file-123.jpg';

// Use for background images too
<div style={{ backgroundImage: `url(${getImageUrl(imagePath)})` }} />
```

### DON'T ❌

```javascript
// Don't hardcode backend URLs
<img src={`https://back.mimmoacademy.com${imagePath}`} />

// Don't build URLs manually
<img src={`${process.env.NEXT_PUBLIC_API_URL_PROD}${imagePath}`} />

// Don't use paths directly without the utility
<img src={imagePath} />

// Don't store full URLs in database/state
const imageUrl = 'https://back.mimmoacademy.com/images/file.jpg'; // Bad!
```

## Testing

### Test in Development

1. Start dev server: `npm run dev`
2. Check images load from `http://localhost:3000/images/`
3. Open browser DevTools → Network tab
4. Verify image requests go to localhost

### Test in Production

1. Build: `npm run build`
2. Start: `npm start`
3. Check images load from `https://back.mimmoacademy.com/images/`
4. Verify no CORS errors

## Troubleshooting

### Images not loading?

1. Check the base URL in `utils/fetchInstance.js`
2. Verify environment variables are set correctly
3. Check browser console for CORS errors
4. Verify the image exists on the backend

### Wrong URL in dev/prod?

1. Check `process.env.NODE_ENV`
2. Verify `.env.local` has correct values
3. Restart dev server after changing env vars

### CORS errors?

1. Backend must allow requests from frontend domain
2. Check backend CORS configuration
3. Verify `Access-Control-Allow-Origin` headers

## Summary

Always use `getImageUrl()` when displaying images:

```javascript
import { getImageUrl } from '@/utils/imageUrl';

<img src={getImageUrl(imageUrl)} alt="Description" />
```

This ensures images always load from the correct backend URL in all environments!

