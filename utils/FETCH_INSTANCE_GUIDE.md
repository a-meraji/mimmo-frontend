# Fetch Instance Guide

A robust and minimal fetch wrapper for making API requests in Next.js applications with automatic environment detection and proper client/server-side handling.

## 🎯 Problem Solved

Different base URLs are needed depending on:
1. **Execution context** (client-side vs server-side)
2. **Environment** (development vs production)

### Base URL Configuration

| Context | Development | Production |
|---------|-------------|------------|
| **Client-side** | `http://5.75.203.252:3000` | `https://back.mimmoacademy.com` |
| **Server-side** | `http://5.75.203.252:3000` | `http://127.0.0.1:3000` (internal) |

The class automatically detects both the execution context and environment to use the correct base URL.

## 📦 Installation

The fetch instance is already created in `utils/fetchInstance.js`. No additional installation needed.

## 🚀 Usage

### 1. Client-Side Usage (React Components, Client Hooks)

```jsx
'use client';

import { clientAPI } from '@/utils/fetchInstance';
import { useState, useEffect } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // GET request
    const fetchUser = async () => {
      try {
        const data = await clientAPI.get('/user/profile');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error.message);
      }
    };

    fetchUser();
  }, []);

  return <div>{user?.name}</div>;
}
```

### 2. Server-Side Usage (Server Components, Server Actions)

```jsx
import { createServerAPI } from '@/utils/fetchInstance';

export default async function ServerComponent() {
  const serverAPI = createServerAPI();
  
  try {
    const data = await serverAPI.get('/products/featured');
    
    return (
      <div>
        {data.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    );
  } catch (error) {
    return <div>Error loading products</div>;
  }
}
```

### 3. Auto-Detection (Works Everywhere)

```jsx
import { createAPI } from '@/utils/fetchInstance';

export function DataFetcher() {
  // Automatically creates the right instance based on execution context
  const api = createAPI();
  
  const data = await api.get('/endpoint');
  return data;
}
```

## 📚 API Methods

### GET Request

```js
const data = await api.get('/users');
const user = await api.get('/users/123');

// With options
const data = await api.get('/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### POST Request

```js
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// With custom headers
const data = await api.post('/auth/login', 
  { email, password },
  {
    headers: {
      'X-Custom-Header': 'value'
    }
  }
);
```

### PUT Request

```js
const updated = await api.put('/users/123', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

### PATCH Request

```js
const updated = await api.patch('/users/123', {
  email: 'newemail@example.com'
});
```

### DELETE Request

```js
await api.delete('/users/123');

// With options
await api.delete('/users/123', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### File Upload

```js
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'Profile photo');

const result = await api.upload('/upload/avatar', formData);
```

### Custom Request

```js
const data = await api.request('/custom-endpoint', {
  method: 'POST',
  headers: {
    'Custom-Header': 'value'
  },
  body: JSON.stringify({ data: 'value' })
});
```

## 🔐 Authentication Example

### With Token in Headers

```js
'use client';

import { clientAPI } from '@/utils/fetchInstance';

export async function fetchProtectedData(token) {
  try {
    const data = await clientAPI.get('/protected/resource', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    if (error.status === 401) {
      // Handle unauthorized
      console.log('Not authenticated');
    }
    throw error;
  }
}
```

### Creating an Authenticated Instance

```js
export function createAuthenticatedAPI(token, isServer = false) {
  const FetchInstance = isServer 
    ? createServerAPI() 
    : createClientAPI();
  
  // Wrap request method to add auth header
  const originalRequest = FetchInstance.request.bind(FetchInstance);
  
  FetchInstance.request = async (endpoint, options = {}) => {
    return originalRequest(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  };
  
  return FetchInstance;
}

// Usage
const authenticatedAPI = createAuthenticatedAPI(userToken);
const profile = await authenticatedAPI.get('/user/profile');
```

## 🎨 Real-World Examples

### Example 1: Login Form (Client-Side)

```jsx
'use client';

import { clientAPI } from '@/utils/fetchInstance';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await clientAPI.post('/auth/login', {
        email,
        password
      });

      // Store token
      localStorage.setItem('token', response.token);
      
      // Redirect or update state
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Example 2: Server Component Fetching Data

```jsx
import { createServerAPI } from '@/utils/fetchInstance';

export default async function ProductsPage() {
  const serverAPI = createServerAPI();
  
  let products = [];
  let error = null;

  try {
    products = await serverAPI.get('/products');
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <div className="grid">
        {products.map(product => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Server Action

```js
'use server';

import { createServerAPI } from '@/utils/fetchInstance';

export async function createProduct(formData) {
  const serverAPI = createServerAPI();
  
  const productData = {
    name: formData.get('name'),
    price: formData.get('price'),
    description: formData.get('description')
  };

  try {
    const newProduct = await serverAPI.post('/products', productData);
    return { success: true, product: newProduct };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Example 4: API Route Handler

```js
import { createServerAPI } from '@/utils/fetchInstance';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const serverAPI = createServerAPI();
  
  try {
    const data = await serverAPI.get('/external-data');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## 🛡️ Error Handling

The fetch instance provides structured error handling:

```js
try {
  const data = await api.get('/endpoint');
} catch (error) {
  // error.status - HTTP status code (if available)
  // error.message - Error message
  // error.data - Additional error data from server
  
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 404) {
    // Handle not found
  } else if (error.status === 500) {
    // Handle server error
  } else {
    // Handle network or other errors
  }
}
```

## ⚙️ Configuration

### Environment Variables (Required)

The instance reads from environment variables for maximum security and flexibility.

#### Setup Instructions

1. **Copy the template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your values** in `.env.local`:

```env
# Client-side URLs (visible in browser)
NEXT_PUBLIC_API_URL_DEV=http://5.75.203.252:3000
NEXT_PUBLIC_API_URL_PROD=https://back.mimmoacademy.com

# Server-side URLs (private, server only)
API_URL_SERVER_DEV=http://5.75.203.252:3000
API_URL_SERVER_PROD=http://127.0.0.1:3000
```

#### Environment Variable Reference

| Variable | Context | Visibility | Purpose |
|----------|---------|------------|---------|
| `NEXT_PUBLIC_API_URL_DEV` | Client | Public | Browser requests in development |
| `NEXT_PUBLIC_API_URL_PROD` | Client | Public | Browser requests in production |
| `API_URL_SERVER_DEV` | Server | Private | Server requests in development |
| `API_URL_SERVER_PROD` | Server | Private | Server requests in production |

#### Security Notes

- ✅ **Client vars** (`NEXT_PUBLIC_*`) are embedded in the browser bundle
- ✅ **Server vars** (no prefix) remain server-side only and are more secure
- ✅ Never commit `.env.local` to version control
- ✅ `.env.example` provides a template for other developers
- ✅ Fallback values are provided for development convenience

#### Fallback Values

If environment variables are not set, the instance uses safe fallback values:

- Development: `http://localhost:3000` (safe for local dev)
- Production: Shows a warning and uses hardcoded fallbacks

### Custom Configuration (Advanced)

If you need to override the base URL dynamically:

```js
import FetchInstance from '@/utils/fetchInstance';

const customAPI = new FetchInstance(false);
customAPI.baseURL = 'https://custom-api.com';

const data = await customAPI.get('/endpoint');
```

### Production Deployment

When deploying to production, set environment variables via your hosting platform:

**Vercel**:
```bash
vercel env add NEXT_PUBLIC_API_URL_PROD
vercel env add API_URL_SERVER_PROD
```

**Environment variables are automatically loaded from your hosting platform's dashboard.**

## 🎯 Best Practices

### 1. Use the Right Instance

```js
// ✅ Good - Client component
'use client';
import { clientAPI } from '@/utils/fetchInstance';

// ✅ Good - Server component
import { createServerAPI } from '@/utils/fetchInstance';

// ✅ Good - Auto-detect
import { createAPI } from '@/utils/fetchInstance';
```

### 2. Error Handling

```js
// ✅ Good - Always handle errors
try {
  const data = await api.get('/endpoint');
  return data;
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error appropriately
  throw error; // or return default value
}

// ❌ Bad - No error handling
const data = await api.get('/endpoint');
```

### 3. Type Safety (with TypeScript)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user = await api.get<User>('/user/profile');
// user is typed as User
```

### 4. Reusable API Functions

```js
// lib/api/users.js
import { clientAPI } from '@/utils/fetchInstance';

export async function getUser(userId) {
  return clientAPI.get(`/users/${userId}`);
}

export async function updateUser(userId, data) {
  return clientAPI.put(`/users/${userId}`, data);
}

export async function deleteUser(userId) {
  return clientAPI.delete(`/users/${userId}`);
}
```

## 🔍 Debugging

To debug which base URL is being used:

```js
import { createAPI } from '@/utils/fetchInstance';

const api = createAPI();
console.log('Base URL:', api.baseURL);
console.log('Is Server:', api.isServerSide);
console.log('Is Dev:', api.isDev);
```

## 🚨 Common Pitfalls

### 1. Using Client API in Server Components

```js
// ❌ Wrong
import { clientAPI } from '@/utils/fetchInstance';

export default async function ServerComponent() {
  const data = await clientAPI.get('/data'); // This will use wrong URL!
  return <div>{data}</div>;
}

// ✅ Correct
import { createServerAPI } from '@/utils/fetchInstance';

export default async function ServerComponent() {
  const serverAPI = createServerAPI();
  const data = await serverAPI.get('/data');
  return <div>{data}</div>;
}
```

### 2. Not Handling Errors

```js
// ❌ Wrong - No error handling
const data = await api.get('/endpoint');

// ✅ Correct
try {
  const data = await api.get('/endpoint');
} catch (error) {
  // Handle error
}
```

## 📊 Performance Tips

1. **Reuse instances** when making multiple requests
2. **Use server-side fetching** for initial data to improve performance
3. **Implement caching** for frequently accessed data
4. **Use parallel requests** when fetching multiple independent resources

```js
// Parallel requests
const [users, products, orders] = await Promise.all([
  api.get('/users'),
  api.get('/products'),
  api.get('/orders')
]);
```

## 🔄 Migration from Old API Utility

If you're migrating from the old `utils/api.js`:

```js
// Before
import { API_BASE_URL } from '@/utils/api';
const response = await fetch(`${API_BASE_URL}/endpoint`);
const data = await response.json();

// After
import { clientAPI } from '@/utils/fetchInstance';
const data = await clientAPI.get('/endpoint');
```

## ✅ Summary

- ✅ Automatic environment detection (dev/prod)
- ✅ Automatic context detection (client/server)
- ✅ Proper base URL selection
- ✅ Built-in error handling
- ✅ Support for all HTTP methods
- ✅ File upload support
- ✅ Clean and minimal API
- ✅ TypeScript ready
- ✅ No external dependencies

The fetch instance handles all the complexity of routing API requests to the right place automatically! 🎉

