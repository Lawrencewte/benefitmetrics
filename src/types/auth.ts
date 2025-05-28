/**
 * Represents user roles in the application
 */
export type UserRole = 'employee' | 'employer' | 'admin';

/**
 * User authentication model
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  departmentId?: string;
  profileCompleted: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login response from the API
 */
export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

/**
 * Registration parameters
 */
export interface RegistrationParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  inviteCode?: string;
}

/**
 * Registration response from the API
 */
export interface RegistrationResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

/**
 * Response from validating a token
 */
export interface ValidateTokenResponse {
  success: boolean;
  user: User;
  message?: string;
}

/**
 * Response from password reset request
 */
export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

/**
 * Response from password update
 */
export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Response from updating onboarding status
 */
export interface UpdateOnboardingResponse {
  success: boolean;
  message: string;
}

/**
 * Represents a user permission
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

/**
 * Logout response from the API
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}