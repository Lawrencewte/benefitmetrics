import {
  LoginResponse,
  LogoutResponse,
  PasswordResetResponse,
  RegistrationParams,
  RegistrationResponse,
  UpdateOnboardingResponse,
  UpdatePasswordResponse,
  User,
  UserRole,
  ValidateTokenResponse
} from '../types/auth';
import api from './api';

/**
 * Login user
 * 
 * @param email User's email
 * @param password User's password
 * @returns Login response with user and token
 * @throws Error if login fails
 */
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Login failed');
    }
    
    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Register a new user
 * 
 * @param userData User registration data
 * @returns Registration response with user and token
 * @throws Error if registration fails
 */
export const register = async (userData: RegistrationParams): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post<RegistrationResponse>('/auth/register', userData);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Registration failed');
    }
    
    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Logout user
 * 
 * @param token Auth token
 * @returns Logout response
 */
export const logout = async (token: string): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data ?? { success: false, message: 'Logout failed' };
  } catch (error) {
    console.error('Logout error:', error);
    // Return success even on error to ensure client-side logout
    return { success: true, message: 'Logged out locally' };
  }
};

/**
 * Validate user token and get user info
 * 
 * @param token Auth token
 * @returns User object if token is valid
 * @throws Error if token is invalid
 */
export const validateToken = async (token: string): Promise<User> => {
  try {
    const response = await api.get<ValidateTokenResponse>(
      '/auth/validate',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.data) {
      throw new Error('No response data received');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Invalid token');
    }
    
    return response.data.user;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Request password reset
 * 
 * @param email User's email
 * @returns Password reset response
 * @throws Error if request fails
 */
export const resetPassword = async (email: string): Promise<PasswordResetResponse> => {
  try {
    const response = await api.post<PasswordResetResponse>('/auth/reset-password', { email });
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Password reset request failed');
    }
    
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Update user password
 * 
 * @param oldPassword Current password
 * @param newPassword New password
 * @param token Auth token
 * @returns Password update response
 * @throws Error if update fails
 */
export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
  token: string
): Promise<UpdatePasswordResponse> => {
  try {
    const response = await api.post<UpdatePasswordResponse>(
      '/auth/update-password',
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Password update failed');
    }
    
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get user profile
 * 
 * @param token Auth token
 * @returns User profile
 * @throws Error if request fails
 */
export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get<ValidateTokenResponse>(
      '/auth/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to get user profile');
    }
    
    return response.data.user;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Update onboarding status
 * 
 * @param completed Whether onboarding is completed
 * @param token Auth token
 * @returns Onboarding update response
 * @throws Error if update fails
 */
export const updateOnboardingStatus = async (
  completed: boolean,
  token: string
): Promise<UpdateOnboardingResponse> => {
  try {
    const response = await api.post<UpdateOnboardingResponse>(
      '/auth/onboarding-status',
      { completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to update onboarding status');
    }
    
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Switch user role (admin only)
 * 
 * @param role New role to switch to
 * @param token Auth token
 * @returns User with updated role
 * @throws Error if switch fails
 */
export const switchRole = async (role: UserRole, token: string): Promise<User> => {
  try {
    const response = await api.post<ValidateTokenResponse>(
      '/auth/switch-role',
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.data) {
      throw new Error('No response data received');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to switch role');
    }
    
    return response.data.user;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};