/**
 * Simple Fetch Instance
 * Minimal wrapper that handles client-side and server-side API calls
 */

class FetchInstance {
  constructor(isServerSide = false) {
    this.baseURL = this.getBaseURL(isServerSide);
  }

  /**
   * Get base URL based on environment
   */
  getBaseURL(isServerSide) {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Server-side
    if (isServerSide) {
      return isDev 
        ? process.env.API_URL_SERVER_DEV || 'http://localhost:3000'
        : process.env.API_URL_SERVER_PROD || 'http://127.0.0.1:3000';
    }
    
    // Client-side
    return isDev
      ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_API_URL_PROD || 'https://mimmoacademy.com/api';
  }

  /**
   * Build full URL
   */
  buildURL(endpoint) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${path}`;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    
    console.log(`[FetchInstance] Request to: ${endpoint}`);
    
    // Simple headers
    const headers = {
      'accept': '*/*',
      ...options.headers,
    };

    // Only set Content-Type for JSON bodies (not for FormData or no body)
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // ✅ FIX: Remove body property for GET/HEAD requests
    // Browser throws error if body is present (even if null) for GET/HEAD
    const method = options.method?.toUpperCase() || 'GET';
    const fetchOptions = { ...options };
    
    if (method === 'GET' || method === 'HEAD') {
      delete fetchOptions.body;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include', // ✅ CRITICAL: Include cookies (refresh token)
    });

    console.log(`[FetchInstance] Response from ${endpoint}:`, response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Return JSON if available
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    // Don't send body if data is null or undefined
    if (data === null || data === undefined) {
      return this.request(endpoint, { ...options, method: 'POST' });
    }
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    // Don't send body if data is null or undefined
    if (data === null || data === undefined) {
      return this.request(endpoint, { ...options, method: 'PUT' });
    }
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    // Don't send body if data is null or undefined
    if (data === null || data === undefined) {
      return this.request(endpoint, { ...options, method: 'PATCH' });
    }
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Create a client-side fetch instance
 * Use this in React components, client-side hooks, etc.
 */
export const createClientAPI = () => {
  return new FetchInstance(false);
};

/**
 * Create a server-side fetch instance
 * Use this in Server Components, API routes, server actions, etc.
 */
export const createServerAPI = () => {
  return new FetchInstance(true);
};

/**
 * Default client-side instance for convenient importing
 */
export const clientAPI = createClientAPI();

/**
 * Helper to determine if code is running on server
 * Useful for conditionally creating the right instance
 */
export const isServer = () => typeof window === 'undefined';

/**
 * Auto-detect and create appropriate instance
 * Use this when you're unsure of the execution context
 */
export const createAPI = () => {
  return isServer() ? createServerAPI() : createClientAPI();
};

// Default export for backward compatibility
export default FetchInstance;

