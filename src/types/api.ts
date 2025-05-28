import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

// Get API base URL from environment or use default
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.BenefitMetrics.health';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Don't add token for auth endpoints
    if (config.url?.startsWith('/auth') && !config.url.includes('/auth/validate') && !config.url.includes('/auth/profile')) {
      return config;
    }
    
    try {
      // Try to get token from storage
      const token = await AsyncStorage.getItem('@BenefitMetrics:token');
      
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding auth token to request:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Extract the error message
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Don't logout for login/register failures
      if (!error.config.url?.startsWith('/auth/login') && !error.config.url?.startsWith('/auth/register')) {
        try {
          // Clear token and trigger logout
          await AsyncStorage.removeItem('@BenefitMetrics:token');
          
          // We could trigger a global logout event here if needed
          // For now, let the application handle this manually
        } catch (storageError) {
          console.error('Error clearing auth token on 401:', storageError);
        }
      }
    }
    
    // Add custom error message property
    error.displayMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

// Helper function to detect network issues
export const isNetworkError = (error: any): boolean => {
  return !error.response && Boolean(error.request);
};

// Helper to extract error message from API error
export const getErrorMessage = (error: any): string => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your internet connection.';
  }
  
  return error.displayMessage || error.message || 'An unknown error occurred';
};

export default api;