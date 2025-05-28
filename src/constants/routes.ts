/**
 * Application route definitions
 * Centralized routing configuration for the application
 */
export const routes = {
  /**
   * Public routes accessible without authentication
   */
  public: {
    landing: '/',
    login: '/auth/login',
    register: '/auth/register',
    passwordReset: '/auth/password-reset',
    termsOfService: '/legal/terms',
    privacyPolicy: '/legal/privacy',
  },
  
  /**
   * Onboarding flow routes
   */
  onboarding: {
    root: '/onboarding',
    roleSelection: '/onboarding/role-selection',
    employee: {
      profileSetup: '/onboarding/employee/settings/profile-setup',
      healthHistory: '/onboarding/employee/health-history',
      benefitsConnect: '/onboarding/employee/benefits-connect',
      appTour: '/onboarding/employee/app-tour',
      initialActions: '/onboarding/employee/initial-actions',
    },
    employer: {
      companyProfile: '/onboarding/employer/company-profile',
      teamSetup: '/onboarding/employer/team-setup',
      benefitsUpload: '/onboarding/employer/benefits-upload',
      adminTour: '/onboarding/employer/admin-tour',
    },
  },
  
  /**
   * Employee role routes
   */
  employee: {
    dashboard: '/employee',
    appointments: {
      list: '/employee/appointments',
      schedule: '/employee/appointments/schedule',
      details: (id: string) => `/employee/appointments/details/${id}`,
    },
    profile: {
      overview: '/employee/settings/profile',
      healthInfo: '/employee/settings/profile/health-info',
      familyHistory: '/employee/settings/profile/family-history',
      medications: '/employee/settings/profile/medications',
      privacy: '/employee/settings/profile/privacy',
    },
    benefits: {
      overview: '/employee/benefits',
      coverage: '/employee/benefits/coverage',
      usage: '/employee/benefits/usage',
      savings: '/employee/benefits/savings',
    },
    challenges: '/employee/challenges',
    checkups: '/employee/appointments/checkups',
    incentives: '/employee/benefits/incentives',
    education: {
      resources: '/employee/education',
      articles: (id?: string) => id ? `/employee/education/articles/${id}` : '/employee/education/articles',
      benefitsGuides: '/employee/education/benefits-guides',
      providerDirectory: '/employee/education/provider-directory',
    },
    notifications: '/employee/settings/notifications',
    tips: '/employee/features/tips',
    healthScore: '/employee/features/health-score',
    roiTracker: '/employee/features/roi-tracker',
    careTimeline: '/employee/features/care-timeline',
    family: {
      list: '/employee/settings/family',
      addMember: '/employee/settings/family/add-member',
      memberDetails: (id: string) => `/employee/settings/family/${id}`,
      memberAppointments: (id: string) => `/employee/settings/family/${id}/appointments`,
    },
    settings: {
      overview: '/employee/settings',
      account: '/employee/settings/account',
      notifications: '/employee/settings/notifications',
      integrations: '/employee/settings/integrations',
      dataPrivacy: '/employee/settings/data-privacy',
      export: '/employee/settings/export',
    },
  },
  
  /**
   * Employer/HR role routes
   */
  employer: {
    dashboard: '/employer',
    analytics: {
      overview: '/employer/analytics',
      benefitsOptimization: '/employer/analytics/benefits-optimization',
      healthMetrics: '/employer/analytics/health-metrics',
      roiReport: '/employer/analytics/roi-report',
      utilization: '/employer/analytics/utilization',
      customReports: '/employer/analytics/custom-reports',
    },
    program: {
      overview: '/employer/program',
      challenges: '/employer/program/challenges',
      incentives: '/employer/program/incentives',
      wellness: '/employer/program/wellness',
    },
    employees: {
      directory: '/employer/employees',
      departments: '/employer/employees/departments',
      aggregatedData: '/employer/employees/aggregated-data',
    },
    communications: {
      dashboard: '/employer/communications',
      announcements: '/employer/communications/announcements',
      campaigns: '/employer/communications/campaigns',
      templates: '/employer/communications/templates',
    },
    benefits: {
      overview: '/employer/benefits',
      plans: '/employer/benefits/plans',
      optimization: '/employer/benefits/optimization',
      providers: '/employer/benefits/providers',
    },
    settings: {
      overview: '/employer/settings',
      company: '/employer/settings/company',
      users: '/employer/settings/users',
      integrations: '/employer/settings/integrations',
      compliance: '/employer/settings/compliance',
      dataRetention: '/employer/settings/data-retention',
    },
  },
  
  /**
   * API routes for data fetching/manipulation
   */
  api: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      refreshToken: '/api/auth/refresh',
      logout: '/api/auth/logout',
      resetPassword: '/api/auth/reset-password',
    },
    employee: {
      profile: '/api/employee/settings/profile',
      appointments: '/api/employee/appointments',
      benefits: '/api/employee/benefits',
      challenges: '/api/employee/challenges',
      healthScore: '/api/employee/features/health-score',
      roiTracker: '/api/employee/features/roi-tracker',
      careTimeline: '/api/employee/features/care-timeline',
      family: '/api/employee/settings/family',
    },
    employer: {
      analytics: '/api/employer/analytics',
      program: '/api/employer/program',
      employees: '/api/employer/employees',
      communications: '/api/employer/communications',
      benefits: '/api/employer/benefits',
    },
    common: {
      notifications: '/api/notifications',
      education: '/api/education',
    },
    security: {
      consent: '/api/security/consent',
      auditLog: '/api/security/audit-log',
      dataPrivacy: '/api/security/data-privacy',
    },
  },
};