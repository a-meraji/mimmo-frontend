/**
 * Fetch Instance Usage Examples
 * Copy and adapt these patterns for your use cases
 */

import { clientAPI, createServerAPI, createAPI } from './fetchInstance';

// ============================================================
// CLIENT-SIDE EXAMPLES (React Components, Hooks)
// ============================================================

/**
 * Example 1: Simple GET request in a client component
 */
export async function fetchUserProfile() {
  try {
    const profile = await clientAPI.get('/user/profile');
    return profile;
  } catch (error) {
    console.error('Failed to fetch profile:', error.message);
    throw error;
  }
}

/**
 * Example 2: POST request with data
 */
export async function loginUser(email, password) {
  try {
    const response = await clientAPI.post('/auth/login', {
      email,
      password,
    });
    return response;
  } catch (error) {
    if (error.status === 401) {
      throw new Error('بیمیل یا رمز عبور اشتباه است');
    }
    throw error;
  }
}

/**
 * Example 3: Authenticated request with token
 */
export async function fetchProtectedResource(token) {
  try {
    const data = await clientAPI.get('/protected/resource', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    if (error.status === 401) {
      // Token expired or invalid
      // Redirect to login or refresh token
    }
    throw error;
  }
}

/**
 * Example 4: Update user data
 */
export async function updateUserProfile(userId, data, token) {
  try {
    const updated = await clientAPI.put(`/users/${userId}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return updated;
  } catch (error) {
    console.error('Failed to update profile:', error.message);
    throw error;
  }
}

/**
 * Example 5: File upload
 */
export async function uploadAvatar(file, token) {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const result = await clientAPI.upload('/user/avatar', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return result;
  } catch (error) {
    console.error('Failed to upload avatar:', error.message);
    throw error;
  }
}

// ============================================================
// SERVER-SIDE EXAMPLES (Server Components, Actions)
// ============================================================

/**
 * Example 6: Fetch data in a server component
 */
export async function getProductsServerSide() {
  const serverAPI = createServerAPI();
  
  try {
    const products = await serverAPI.get('/products/all');
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error.message);
    return [];
  }
}

/**
 * Example 7: Server action to create a resource
 */
export async function createProductServerAction(formData) {
  'use server';
  
  const serverAPI = createServerAPI();
  
  const productData = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
  };
  
  try {
    const newProduct = await serverAPI.post('/products', productData);
    return { success: true, product: newProduct };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Example 8: Internal API call from API route
 */
export async function fetchDataForAPIRoute() {
  const serverAPI = createServerAPI();
  
  try {
    // This will use internal URL in production (127.0.0.1:3000)
    const data = await serverAPI.get('/internal/data');
    return data;
  } catch (error) {
    console.error('Internal API call failed:', error.message);
    throw error;
  }
}

// ============================================================
// AUTO-DETECT EXAMPLES (Works Everywhere)
// ============================================================

/**
 * Example 9: Universal function that works on both client and server
 */
export async function getPackages() {
  const api = createAPI(); // Auto-detects context
  
  try {
    const packages = await api.get('/packages/all');
    return packages;
  } catch (error) {
    console.error('Failed to fetch packages:', error.message);
    return [];
  }
}

// ============================================================
// ADVANCED PATTERNS
// ============================================================

/**
 * Example 10: Batch requests
 */
export async function fetchDashboardData(token) {
  try {
    const [profile, orders, notifications] = await Promise.all([
      clientAPI.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      clientAPI.get('/user/orders', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      clientAPI.get('/user/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    
    return { profile, orders, notifications };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error.message);
    throw error;
  }
}

/**
 * Example 11: Paginated requests
 */
export async function fetchPaginatedProducts(page = 1, limit = 20) {
  try {
    const data = await clientAPI.get(`/products?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error.message);
    throw error;
  }
}

/**
 * Example 12: Search with debounce
 */
export async function searchProducts(query) {
  try {
    const results = await clientAPI.get(`/products/search?q=${encodeURIComponent(query)}`);
    return results;
  } catch (error) {
    console.error('Search failed:', error.message);
    return [];
  }
}

/**
 * Example 13: Retry logic wrapper
 */
export async function fetchWithRetry(endpoint, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const data = await clientAPI.get(endpoint);
      return data;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

/**
 * Example 14: Create authenticated instance wrapper
 */
export function createAuthenticatedClient(token) {
  return {
    get: (endpoint, options = {}) => 
      clientAPI.get(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      }),
    
    post: (endpoint, data, options = {}) => 
      clientAPI.post(endpoint, data, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      }),
    
    put: (endpoint, data, options = {}) => 
      clientAPI.put(endpoint, data, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      }),
    
    delete: (endpoint, options = {}) => 
      clientAPI.delete(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      }),
  };
}

// Usage of authenticated client:
// const authAPI = createAuthenticatedClient(userToken);
// const profile = await authAPI.get('/user/profile');

