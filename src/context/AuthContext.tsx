import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthService from '../services/auth';
import { UserRole } from '../types/auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  profileCompleted: boolean;
  lastLogin: Date;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organizationId?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  updateOnboardingStatus: (completed: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_TOKEN_KEY = '@BenefitMetrics:token';
const STORAGE_ONBOARDED_KEY = '@BenefitMetrics:onboarded';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    isOnboarded: false,
    error: null,
  });

  // Load token from storage on startup
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
        const onboardedStatus = await AsyncStorage.getItem(STORAGE_ONBOARDED_KEY);
        
        if (token) {
          try {
            // Validate token and get user info
            const user = await AuthService.validateToken(token);
            
            setState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              isOnboarded: onboardedStatus === 'true',
              error: null,
            });
          } catch (error) {
            // Token is invalid, clear it
            await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
            
            setState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isOnboarded: false,
              error: null,
            });
          }
        } else {
          setState({
            ...state,
            isLoading: false,
          });
        }
      } catch (error) {
        setState({
          ...state,
          isLoading: false,
          error: 'Failed to load authentication state',
        });
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      const { user, token } = await AuthService.login(email, password);
      
      // Save token to storage
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
      
      // Check if user has completed onboarding
      const onboardedStatus = user.profileCompleted ? 'true' : 'false';
      await AsyncStorage.setItem(STORAGE_ONBOARDED_KEY, onboardedStatus);

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isOnboarded: user.profileCompleted,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      });
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organizationId?: string;
  }) => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      const { user, token } = await AuthService.register(userData);
      
      // Save token to storage
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
      
      // New users are not onboarded
      await AsyncStorage.setItem(STORAGE_ONBOARDED_KEY, 'false');

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isOnboarded: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to register',
      });
    }
  };

  const logout = async () => {
    setState({
      ...state,
      isLoading: true,
    });

    try {
      // Call logout API to invalidate token on server
      if (state.token) {
        await AuthService.logout(state.token);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear token from storage
      await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
      await AsyncStorage.removeItem(STORAGE_ONBOARDED_KEY);

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isOnboarded: false,
        error: null,
      });
    }
  };

  const resetPassword = async (email: string) => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      await AuthService.resetPassword(email);
      
      setState({
        ...state,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset password',
      });
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!state.token) {
      setState({
        ...state,
        error: 'Not authenticated',
      });
      return;
    }

    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      await AuthService.updatePassword(oldPassword, newPassword, state.token);
      
      setState({
        ...state,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update password',
      });
    }
  };

  const clearError = () => {
    setState({
      ...state,
      error: null,
    });
  };

  const refreshUser = async () => {
    if (!state.token) {
      return;
    }

    setState({
      ...state,
      isLoading: true,
    });

    try {
      const user = await AuthService.getUserProfile(state.token);
      
      setState({
        ...state,
        user,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh user data',
      });
    }
  };

  const updateOnboardingStatus = async (completed: boolean) => {
    if (!state.user || !state.token) {
      return;
    }

    try {
      // Update onboarding status on server
      await AuthService.updateOnboardingStatus(completed, state.token);
      
      // Update local storage
      await AsyncStorage.setItem(STORAGE_ONBOARDED_KEY, completed ? 'true' : 'false');

      // Update user in state
      setState({
        ...state,
        user: {
          ...state.user,
          profileCompleted: completed,
        },
        isOnboarded: completed,
      });
    } catch (error) {
      setState({
        ...state,
        error: error instanceof Error ? error.message : 'Failed to update onboarding status',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        clearError,
        refreshUser,
        updateOnboardingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;