// API service for centralized backend URL configuration

// Use environment variables for production deployments, fallback to localhost for development
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || API_URL;

// Log the backend URL being used
console.log('API service initialized with URL:', API_URL);
console.log('Socket URL:', SOCKET_URL);

// Helper function for making API calls with the correct URL
export const apiCall = async (endpoint, options = {}) => {
  // Ensure endpoint starts with a / and remove any duplicate slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;
  
  // Default options for fetch
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Make credentials optional based on endpoint
    credentials: endpoint.includes('/socket.io') ? 'omit' : 'include'
  };
  
  // Merge default options with provided options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };
  
  try {
    console.log(`Making API call to: ${url} with credentials: ${fetchOptions.credentials}`);
    const response = await fetch(url, fetchOptions);
    
    // Log response status
    console.log(`API response status: ${response.status}`);
    
    if (response.status === 404) {
      console.error(`API endpoint not found: ${endpoint}`);
      throw new Error(`API endpoint not found: ${endpoint}`);
    }
    
    return response;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // Add more detailed error info
    if (error.message === 'Failed to fetch') {
      console.error('This likely indicates a network issue or CORS problem. Check that the backend is accessible.');
    }
    throw error;
  }
};

// Export default for convenience
export default {
  API_URL,
  SOCKET_URL,
  apiCall
}; 