import { UserRole } from '../types/auth';

/**
 * Role-based permission mapping
 */
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  // Admin has all permissions
  admin: [
    // Dashboard & Analytics
    'view_admin_dashboard',
    'view_analytics',
    'view_aggregated_data',
    'generate_reports',
    'view_usage_metrics',
    
    // Organization Management
    'manage_organization',
    'manage_departments',
    'manage_users',
    'manage_roles',
    
    // Benefits Management
    'manage_benefits',
    'view_benefits_utilization',
    'edit_benefits_plans',
    'view_roi_analytics',
    
    // Program Management
    'manage_programs',
    'manage_challenges',
    'manage_incentives',
    'manage_wellness_programs',
    
    // Communications
    'manage_communications',
    'send_notifications',
    'create_campaigns',
    'edit_templates',
    
    // Settings
    'manage_settings',
    'manage_integrations',
    'manage_security',
    'view_audit_logs',
    
    // Employee features
    'view_employee_dashboard',
    'manage_profile',
    'view_health_score',
    'schedule_appointments',
    'view_benefits',
    'participate_challenges',
    'view_care_timeline',
    'view_roi_tracker',
    'view_educational_resources',
  ],
  
  // Employer has organization-level permissions
  employer: [
    // Dashboard & Analytics
    'view_admin_dashboard',
    'view_analytics',
    'view_aggregated_data',
    'generate_reports',
    'view_usage_metrics',
    
    // Limited Organization Management
    'view_organization',
    'manage_departments',
    'view_users',
    
    // Benefits Management
    'view_benefits',
    'view_benefits_utilization',
    'view_roi_analytics',
    
    // Program Management
    'manage_programs',
    'manage_challenges',
    'manage_incentives',
    'manage_wellness_programs',
    
    // Communications
    'manage_communications',
    'send_notifications',
    'create_campaigns',
    'edit_templates',
    
    // Limited Settings
    'view_settings',
    'view_integrations',
  ],
  
  // Employee has personal feature permissions
  employee: [
    'view_employee_dashboard',
    'manage_profile',
    'view_health_score',
    'schedule_appointments',
    'view_benefits',
    'participate_challenges',
    'view_care_timeline',
    'view_roi_tracker',
    'view_educational_resources',
    'manage_family_members',
  ],
};

/**
 * Check if a role has a specific permission
 * 
 * @param role User role
 * @param permission Permission to check
 * @returns True if role has permission, false otherwise
 */
export const hasPermission = (role: UserRole | null, permission: string): boolean => {
  if (!role) return false;
  
  return ROLE_PERMISSIONS[role].includes(permission);
};

/**
 * Check if a role has all specified permissions
 * 
 * @param role User role
 * @param permissions Array of permissions to check
 * @returns True if role has all permissions, false otherwise
 */
export const hasAllPermissions = (role: UserRole | null, permissions: string[]): boolean => {
  if (!role) return false;
  
  return permissions.every(permission => ROLE_PERMISSIONS[role].includes(permission));
};

/**
 * Check if a role has any of the specified permissions
 * 
 * @param role User role
 * @param permissions Array of permissions to check
 * @returns True if role has any permission, false otherwise
 */
export const hasAnyPermission = (role: UserRole | null, permissions: string[]): boolean => {
  if (!role) return false;
  
  return permissions.some(permission => ROLE_PERMISSIONS[role].includes(permission));
};

/**
 * Get all permissions for a role
 * 
 * @param role User role
 * @returns Array of permissions
 */
export const getRolePermissions = (role: UserRole | null): string[] => {
  if (!role) return [];
  
  return [...ROLE_PERMISSIONS[role]];
};

/**
 * Check if a role can access employee features
 * 
 * @param role User role
 * @returns True if role can access employee features
 */
export const canAccessEmployeeFeatures = (role: UserRole | null): boolean => {
  if (!role) return false;
  
  return hasPermission(role, 'view_employee_dashboard');
};

/**
 * Check if a role can access employer/admin features
 * 
 * @param role User role
 * @returns True if role can access employer features
 */
export const canAccessEmployerFeatures = (role: UserRole | null): boolean => {
  if (!role) return false;
  
  return hasPermission(role, 'view_admin_dashboard');
};

/**
 * Permission resources for UI display
 */
export const PERMISSION_RESOURCES = [
  {
    group: 'Dashboard & Analytics',
    permissions: [
      { id: 'view_admin_dashboard', label: 'View Admin Dashboard' },
      { id: 'view_analytics', label: 'View Analytics' },
      { id: 'view_aggregated_data', label: 'View Aggregated Data' },
      { id: 'generate_reports', label: 'Generate Reports' },
      { id: 'view_usage_metrics', label: 'View Usage Metrics' },
    ],
  },
  {
    group: 'Organization Management',
    permissions: [
      { id: 'manage_organization', label: 'Manage Organization' },
      { id: 'view_organization', label: 'View Organization' },
      { id: 'manage_departments', label: 'Manage Departments' },
      { id: 'manage_users', label: 'Manage Users' },
      { id: 'view_users', label: 'View Users' },
      { id: 'manage_roles', label: 'Manage Roles' },
    ],
  },
  {
    group: 'Benefits Management',
    permissions: [
      { id: 'manage_benefits', label: 'Manage Benefits' },
      { id: 'view_benefits', label: 'View Benefits' },
      { id: 'view_benefits_utilization', label: 'View Benefits Utilization' },
      { id: 'edit_benefits_plans', label: 'Edit Benefits Plans' },
      { id: 'view_roi_analytics', label: 'View ROI Analytics' },
    ],
  },
  {
    group: 'Program Management',
    permissions: [
      { id: 'manage_programs', label: 'Manage Programs' },
      { id: 'manage_challenges', label: 'Manage Challenges' },
      { id: 'manage_incentives', label: 'Manage Incentives' },
      { id: 'manage_wellness_programs', label: 'Manage Wellness Programs' },
    ],
  },
  {
    group: 'Communications',
    permissions: [
      { id: 'manage_communications', label: 'Manage Communications' },
      { id: 'send_notifications', label: 'Send Notifications' },
      { id: 'create_campaigns', label: 'Create Campaigns' },
      { id: 'edit_templates', label: 'Edit Templates' },
    ],
  },
  {
    group: 'Settings',
    permissions: [
      { id: 'manage_settings', label: 'Manage Settings' },
      { id: 'view_settings', label: 'View Settings' },
      { id: 'manage_integrations', label: 'Manage Integrations' },
      { id: 'view_integrations', label: 'View Integrations' },
      { id: 'manage_security', label: 'Manage Security' },
      { id: 'view_audit_logs', label: 'View Audit Logs' },
    ],
  },
  {
    group: 'Employee Features',
    permissions: [
      { id: 'view_employee_dashboard', label: 'View Employee Dashboard' },
      { id: 'manage_profile', label: 'Manage Profile' },
      { id: 'view_health_score', label: 'View Health Score' },
      { id: 'schedule_appointments', label: 'Schedule Appointments' },
      { id: 'view_benefits', label: 'View Benefits' },
      { id: 'participate_challenges', label: 'Participate in Challenges' },
      { id: 'view_care_timeline', label: 'View Care Timeline' },
      { id: 'view_roi_tracker', label: 'View ROI Tracker' },
      { id: 'view_educational_resources', label: 'View Educational Resources' },
      { id: 'manage_family_members', label: 'Manage Family Members' },
    ],
  },
];