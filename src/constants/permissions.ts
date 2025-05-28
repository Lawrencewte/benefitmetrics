/**
 * Permission definitions for the application
 * Defines roles and permissions for access control
 */
export const permissions = {
  /**
   * User roles in the system
   */
  roles: {
    /**
     * Employee roles
     */
    EMPLOYEE: 'employee',
    EMPLOYEE_ADMIN: 'employee_admin', // Employee with admin privileges for family members
    
    /**
     * Employer/HR roles
     */
    EMPLOYER_ADMIN: 'employer_admin', // Super admin for employer
    EMPLOYER_HR: 'employer_hr', // HR staff
    EMPLOYER_BENEFITS: 'employer_benefits', // Benefits coordinator
    EMPLOYER_WELLNESS: 'employer_wellness', // Wellness program coordinator
    
    /**
     * System roles
     */
    SYSTEM_ADMIN: 'system_admin', // System administrator
    API_CLIENT: 'api_client', // API integration clients
  },
  
  /**
   * Permission definitions
   * These are combined into permission sets assigned to roles
   */
  permissions: {
    // Employee profile permissions
    VIEW_OWN_PROFILE: 'view_own_profile',
    EDIT_OWN_PROFILE: 'edit_own_profile',
    VIEW_FAMILY_PROFILES: 'view_family_profiles',
    EDIT_FAMILY_PROFILES: 'edit_family_profiles',
    
    // Appointment permissions
    VIEW_OWN_APPOINTMENTS: 'view_own_appointments',
    SCHEDULE_OWN_APPOINTMENTS: 'schedule_own_appointments',
    VIEW_FAMILY_APPOINTMENTS: 'view_family_appointments',
    SCHEDULE_FAMILY_APPOINTMENTS: 'schedule_family_appointments',
    
    // Benefit permissions
    VIEW_OWN_BENEFITS: 'view_own_benefits',
    TRACK_BENEFIT_USAGE: 'track_benefit_usage',
    
    // Health tracking permissions
    VIEW_HEALTH_SCORE: 'view_health_score',
    VIEW_ROI_TRACKER: 'view_roi_tracker',
    VIEW_CARE_TIMELINE: 'view_care_timeline',
    
    // Challenge permissions
    JOIN_CHALLENGES: 'join_challenges',
    TRACK_CHALLENGE_PROGRESS: 'track_challenge_progress',
    
    // Employer analytics permissions
    VIEW_AGGREGATED_ANALYTICS: 'view_aggregated_analytics',
    VIEW_BENEFITS_OPTIMIZATION: 'view_benefits_optimization',
    VIEW_HEALTH_METRICS: 'view_health_metrics',
    VIEW_ROI_REPORTS: 'view_roi_reports',
    VIEW_UTILIZATION_DATA: 'view_utilization_data',
    CREATE_CUSTOM_REPORTS: 'create_custom_reports',
    
    // Employer program management permissions
    MANAGE_CHALLENGES: 'manage_challenges',
    MANAGE_INCENTIVES: 'manage_incentives',
    MANAGE_WELLNESS_PROGRAMS: 'manage_wellness_programs',
    
    // Employer employee management permissions
    VIEW_EMPLOYEE_DIRECTORY: 'view_employee_directory',
    MANAGE_DEPARTMENTS: 'manage_departments',
    VIEW_EMPLOYEE_AGGREGATED_DATA: 'view_employee_aggregated_data',
    
    // Employer communication permissions
    SEND_ANNOUNCEMENTS: 'send_announcements',
    MANAGE_CAMPAIGNS: 'manage_campaigns',
    MANAGE_TEMPLATES: 'manage_templates',
    
    // Employer benefits management permissions
    MANAGE_BENEFIT_PLANS: 'manage_benefit_plans',
    MANAGE_BENEFIT_OPTIMIZATION: 'manage_benefit_optimization',
    MANAGE_PROVIDERS: 'manage_providers',
    
    // Employer settings permissions
    MANAGE_COMPANY_SETTINGS: 'manage_company_settings',
    MANAGE_USERS: 'manage_users',
    MANAGE_INTEGRATIONS: 'manage_integrations',
    MANAGE_COMPLIANCE: 'manage_compliance',
    MANAGE_DATA_RETENTION: 'manage_data_retention',
    
    // System permissions
    ACCESS_SYSTEM_SETTINGS: 'access_system_settings',
    ACCESS_AUDIT_LOGS: 'access_audit_logs',
    PERFORM_DATA_OPERATIONS: 'perform_data_operations',
  },
  
  /**
   * Permission sets for roles
   * Maps roles to sets of permissions
   */
  rolesToPermissions: {
    // Employee role permissions
    'employee': [
      'view_own_profile',
      'edit_own_profile',
      'view_own_appointments',
      'schedule_own_appointments',
      'view_own_benefits',
      'track_benefit_usage',
      'view_health_score',
      'view_roi_tracker',
      'view_care_timeline',
      'join_challenges',
      'track_challenge_progress',
    ],
    
    // Employee admin (for family) permissions
    'employee_admin': [
      'view_own_profile',
      'edit_own_profile',
      'view_family_profiles',
      'edit_family_profiles',
      'view_own_appointments',
      'schedule_own_appointments',
      'view_family_appointments',
      'schedule_family_appointments',
      'view_own_benefits',
      'track_benefit_usage',
      'view_health_score',
      'view_roi_tracker',
      'view_care_timeline',
      'join_challenges',
      'track_challenge_progress',
    ],
    
    // Employer admin permissions (full access)
    'employer_admin': [
      'view_aggregated_analytics',
      'view_benefits_optimization',
      'view_health_metrics',
      'view_roi_reports',
      'view_utilization_data',
      'create_custom_reports',
      'manage_challenges',
      'manage_incentives',
      'manage_wellness_programs',
      'view_employee_directory',
      'manage_departments',
      'view_employee_aggregated_data',
      'send_announcements',
      'manage_campaigns',
      'manage_templates',
      'manage_benefit_plans',
      'manage_benefit_optimization',
      'manage_providers',
      'manage_company_settings',
      'manage_users',
      'manage_integrations',
      'manage_compliance',
      'manage_data_retention',
    ],
    
    // HR role permissions
    'employer_hr': [
      'view_aggregated_analytics',
      'view_health_metrics',
      'view_utilization_data',
      'view_employee_directory',
      'manage_departments',
      'view_employee_aggregated_data',
      'send_announcements',
      'manage_users',
    ],
    
    // Benefits coordinator permissions
    'employer_benefits': [
      'view_benefits_optimization',
      'view_roi_reports',
      'view_utilization_data',
      'manage_benefit_plans',
      'manage_benefit_optimization',
      'manage_providers',
      'view_employee_aggregated_data',
      'send_announcements',
    ],
    
    // Wellness coordinator permissions
    'employer_wellness': [
      'view_health_metrics',
      'manage_challenges',
      'manage_incentives',
      'manage_wellness_programs',
      'view_employee_aggregated_data',
      'send_announcements',
      'manage_campaigns',
      'manage_templates',
    ],
    
    // System admin permissions
    'system_admin': [
      'access_system_settings',
      'access_audit_logs',
      'perform_data_operations',
    ],
    
    // API client permissions (limited)
    'api_client': [
      'view_aggregated_analytics',
      'view_utilization_data',
    ],
  },
  
  /**
   * Permission checking function
   * Returns true if the user has the required permission
   */
  hasPermission: (userRoles: string[], permission: string): boolean => {
    // If no roles provided, access denied
    if (!userRoles || userRoles.length === 0) {
      return false;
    }
    
    // System admin has all permissions
    if (userRoles.includes('system_admin')) {
      return true;
    }
    
    // Check each role for the required permission
    return userRoles.some(role => {
      const rolePermissions = permissions.rolesToPermissions[role] || [];
      return rolePermissions.includes(permission);
    });
  },
  
  /**
   * Check if a user has any of the specified permissions
   */
  hasAnyPermission: (userRoles: string[], requiredPermissions: string[]): boolean => {
    // If no permissions required, access granted
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    // Check each permission
    return requiredPermissions.some(permission => 
      permissions.hasPermission(userRoles, permission)
    );
  },
  
  /**
   * Check if a user has all of the specified permissions
   */
  hasAllPermissions: (userRoles: string[], requiredPermissions: string[]): boolean => {
    // If no permissions required, access granted
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    // Check each permission
    return requiredPermissions.every(permission => 
      permissions.hasPermission(userRoles, permission)
    );
  },
};