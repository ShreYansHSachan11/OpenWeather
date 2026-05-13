import axios, { AxiosError, AxiosInstance } from 'axios';

/**
 * Axios instance configured for OpenWeatherMap API
 * 
 * Features:
 * - Base URL configuration from environment variables
 * - API key injection via params
 * - Centralized error handling via response interceptor
 * - Timeout configuration
 */

// Get configuration from environment variables
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Validate API key is configured
if (!API_KEY) {
  console.error('VITE_OPENWEATHER_API_KEY is not configured. Please check your .env file.');
}

/**
 * Transform API errors into user-friendly messages
 * 
 * Handles different error types:
 * - 404: City not found
 * - 429: Rate limit exceeded
 * - 401: Authentication/configuration error
 * - 500/502/503: Server errors
 * - Network errors: No internet connection
 * - Other errors: Generic error message
 * 
 * @param error - The error object from Axios
 * @returns User-friendly error message
 * 
 * **Validates: Requirements 5.3, 5.4, 1.6, 1.7**
 */
export function handleAPIError(error: AxiosError | Error | unknown): string {
  // Check if it's an Axios error with a response
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // HTTP error responses (4xx, 5xx)
      const status = error.response.status;
      
      switch (status) {
        case 404:
          return 'City not found. Please check the spelling and try again.';
        
        case 401:
          return 'Configuration error. Please contact support.';
        
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        
        case 500:
        case 502:
        case 503:
          return 'Weather service is temporarily unavailable. Please try again later.';
        
        default:
          return 'An error occurred while fetching weather data. Please try again.';
      }
    } else if (error.request) {
      // Network errors (no response received)
      return 'No internet connection. Please check your network and try again.';
    }
  }
  
  // Other errors (request setup, generic errors, etc.)
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Create and configure Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  params: {
    appid: API_KEY, // API key included in all requests
    units: 'metric', // Use metric units (Celsius, meters/sec)
  },
});

/**
 * Response interceptor for centralized error handling
 * 
 * Transforms API errors into user-friendly messages using handleAPIError
 * Handles both HTTP errors and network errors
 */
apiClient.interceptors.response.use(
  // Success response - pass through unchanged
  (response) => response,
  
  // Error response - transform to descriptive message
  (error: AxiosError) => {
    const message = handleAPIError(error);
    throw new Error(message);
  }
);

export default apiClient;
