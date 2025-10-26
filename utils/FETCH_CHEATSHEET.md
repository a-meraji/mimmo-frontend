# Fetch Instance Quick Reference

## 🚀 Quick Start

```js
// Client-side (React components)
import { clientAPI } from '@/utils/fetchInstance';

// Server-side (Server components, actions)
import { createServerAPI } from '@/utils/fetchInstance';

// Auto-detect
import { createAPI } from '@/utils/fetchInstance';
```

## 📍 Base URLs

| Context | Dev | Production |
|---------|-----|------------|
| **Client** | `http://5.75.203.252:3000` | `https://back.mimmoacademy.com` |
| **Server** | `http://5.75.203.252:3000` | `http://127.0.0.1:3000` |

## 🔧 Methods

### GET
```js
const data = await api.get('/endpoint');
const data = await api.get('/users/123');
```

### POST
```js
const result = await api.post('/endpoint', { key: 'value' });
```

### PUT
```js
const updated = await api.put('/users/123', { name: 'New Name' });
```

### PATCH
```js
const updated = await api.patch('/users/123', { email: 'new@email.com' });
```

### DELETE
```js
await api.delete('/users/123');
```

### Upload
```js
const formData = new FormData();
formData.append('file', file);
const result = await api.upload('/upload', formData);
```

## 🔐 With Authentication

```js
const data = await api.get('/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## ❌ Error Handling

```js
try {
  const data = await api.get('/endpoint');
} catch (error) {
  console.log(error.message);  // Error message
  console.log(error.status);   // HTTP status code
  console.log(error.data);     // Server error data
}
```

## 📦 Common Patterns

### Client Component
```jsx
'use client';
import { clientAPI } from '@/utils/fetchInstance';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    clientAPI.get('/endpoint')
      .then(setData)
      .catch(console.error);
  }, []);
  
  return <div>{data?.name}</div>;
}
```

### Server Component
```jsx
import { createServerAPI } from '@/utils/fetchInstance';

export default async function MyServerComponent() {
  const serverAPI = createServerAPI();
  const data = await serverAPI.get('/endpoint');
  
  return <div>{data.name}</div>;
}
```

### Server Action
```js
'use server';
import { createServerAPI } from '@/utils/fetchInstance';

export async function createItem(formData) {
  const serverAPI = createServerAPI();
  const result = await serverAPI.post('/items', {
    name: formData.get('name')
  });
  return result;
}
```

### API Route
```js
import { createServerAPI } from '@/utils/fetchInstance';
import { NextResponse } from 'next/server';

export async function GET() {
  const serverAPI = createServerAPI();
  const data = await serverAPI.get('/data');
  return NextResponse.json(data);
}
```

## 🎯 Best Practices

✅ **DO:**
- Use `clientAPI` in client components
- Use `createServerAPI()` in server components
- Always handle errors with try-catch
- Use `createAPI()` when context is dynamic

❌ **DON'T:**
- Use `clientAPI` in server components
- Ignore error handling
- Hardcode base URLs
- Make requests without authentication for protected routes

## 🔍 Debug

```js
const api = createAPI();
console.log('Base URL:', api.baseURL);
console.log('Is Server:', api.isServerSide);
console.log('Is Dev:', api.isDev);
```

## 📚 Full Documentation

See `FETCH_INSTANCE_GUIDE.md` for complete documentation and examples.

