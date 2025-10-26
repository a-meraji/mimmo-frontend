/**
 * Fetch Instance Class
 * A robust and minimal fetch wrapper that automatically handles client-side and server-side API calls
 * with different base URLs based on the environment
 */

class FetchInstance {
  constructor(isServerSide = false) {
    this.isServerSide = isServerSide;
    this.isDev = process.env.NODE_ENV === 'development';
    this.baseURL = this.getBaseURL();
    this.validateEnvironment();
  }

  /**
   * Validate that required environment variables are set
   * Provides helpful error messages if configuration is missing
   */
  validateEnvironment() {
    const requiredVars = this.getRequiredEnvVars();
    const missing = [];

    for (const [key, description] of Object.entries(requiredVars)) {
      if (!process.env[key]) {
        missing.push(`${key} (${description})`);
      }
    }

    if (missing.length > 0 && !this.hasValidFallback()) {
      console.warn(
        '⚠️  Missing environment variables. Using fallback values.\n' +
        'For production deployment, please set:\n' +
        missing.map(v => `  - ${v}`).join('\n') +
        '\n\nCopy .env.example to .env.local and configure your values.'
      );
    }
  }

  /**
   * Get required environment variables based on context
   * @returns {Object} Map of env var names to descriptions
   */
  getRequiredEnvVars() {
    if (this.isServerSide) {
      return this.isDev
        ? { 'API_URL_SERVER_DEV': 'Server-side development API URL' }
        : { 'API_URL_SERVER_PROD': 'Server-side production API URL' };
    } else {
      return this.isDev
        ? { 'NEXT_PUBLIC_API_URL_DEV': 'Client-side development API URL' }
        : { 'NEXT_PUBLIC_API_URL_PROD': 'Client-side production API URL' };
    }
  }

  /**
   * Check if fallback values are acceptable
   * @returns {boolean}
   */
  hasValidFallback() {
    // In development, localhost fallback is acceptable
    // In production, we should warn but not crash
    return this.isDev;
  }

  /**
   * Determine the appropriate base URL based on environment and execution context
   * @returns {string} Base URL for API requests
   */
  getBaseURL() {
    // Server-side requests
    if (this.isServerSide) {
      if (this.isDev) {
        // Dev mode: Read from environment variable
        return process.env.API_URL_SERVER_DEV || 'http://localhost:3000';
      } else {
        // Production mode: Internal call - Read from environment variable
        return process.env.API_URL_SERVER_PROD || 'http://127.0.0.1:3000';
      }
    }
    
    // Client-side requests (uses NEXT_PUBLIC_ prefix for browser access)
    if (this.isDev) {
      // Dev mode: Read from public environment variable
      return process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000';
    } else {
      // Production mode: External domain - Read from public environment variable
      return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://back.mimmoacademy.com';
    }
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint (e.g., '/user/profile')
   * @returns {string} Full URL
   */
  buildURL(endpoint) {
    // If endpoint is already a full URL, return as is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${path}`;
  }

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    // Build fetch options
    const fetchOptions = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, fetchOptions);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP Error ${response.status}: ${response.statusText}`,
        }));

        const error = new Error(errorData.message || 'Request failed');
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Handle empty responses (204 No Content, etc.)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
      }

      // Parse JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // Return text for non-JSON responses
      return await response.text();
    } catch (error) {
      // If it's already our custom error with status, re-throw as is
      if (error.status) {
        throw error;
      }
      
      // Handle network errors (fetch failed, CORS, etc.)
      const networkError = new Error(
        error.message || 'Network request failed'
      );
      networkError.isNetworkError = true;
      networkError.originalError = error;
      throw networkError;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Upload file(s) with multipart/form-data
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - FormData with files
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async upload(endpoint, formData, options = {}) {
    const uploadOptions = {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...options.headers,
      },
    };

    // Remove Content-Type if it was set in default headers
    delete uploadOptions.headers['Content-Type'];

    return this.request(endpoint, uploadOptions);
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

