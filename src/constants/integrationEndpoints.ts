// Integration endpoints configuration for external services

export const INTEGRATION_ENDPOINTS = {
  // Calendar Integrations
  GOOGLE_CALENDAR: {
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN_URL: 'https://oauth2.googleapis.com/token',
    API_BASE: 'https://www.googleapis.com/calendar/v3',
    SCOPES: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  },
  
  OUTLOOK_CALENDAR: {
    AUTH_URL: 'https://login.microsoftonline.com/Common/oauth2/v2.0/authorize',
    TOKEN_URL: 'https://login.microsoftonline.com/Common/oauth2/v2.0/token',
    API_BASE: 'https://graph.microsoft.com/v1.0',
    SCOPES: [
      'https://graph.microsoft.com/calendars.read',
      'https://graph.microsoft.com/calendars.readwrite'
    ]
  },

  // Electronic Health Records (EHR)
  EPIC: {
    SANDBOX_BASE: 'https://fhir.epic.com/interconnect-fhir-oauth',
    PRODUCTION_BASE: 'https://fhir.epic.com/interconnect-fhir-oauth',
    AUTH_URL: '/oauth2/authorize',
    TOKEN_URL: '/oauth2/token',
    FHIR_VERSION: 'R4',
    SCOPES: [
      'patient/Patient.read',
      'patient/Observation.read',
      'patient/Appointment.read',
      'patient/Appointment.write'
    ]
  },

  CERNER: {
    SANDBOX_BASE: 'https://fhir-ehr-code.cerner.com/r4',
    PRODUCTION_BASE: 'https://fhir-ehr.cerner.com/r4',
    AUTH_URL: '/oauth2/authorize',
    TOKEN_URL: '/oauth2/token',
    FHIR_VERSION: 'R4',
    SCOPES: [
      'patient/Patient.read',
      'patient/Observation.read',
      'patient/Appointment.read',
      'patient/Appointment.write'
    ]
  },

  // Insurance Providers
  BLUE_CROSS: {
    API_BASE: 'https://api.bcbs.com/v1',
    AUTH_ENDPOINT: '/oauth/token',
    COVERAGE_ENDPOINT: '/coverage',
    CLAIMS_ENDPOINT: '/claims',
    PROVIDER_DIRECTORY: '/providers'
  },

  UNITED_HEALTHCARE: {
    API_BASE: 'https://api.uhc.com/v1',
    AUTH_ENDPOINT: '/oauth/token',
    COVERAGE_ENDPOINT: '/member/coverage',
    CLAIMS_ENDPOINT: '/member/claims',
    PROVIDER_DIRECTORY: '/providers/search'
  },

  AETNA: {
    API_BASE: 'https://api.aetna.com/v1',
    AUTH_ENDPOINT: '/oauth/token',
    COVERAGE_ENDPOINT: '/members/coverage',
    CLAIMS_ENDPOINT: '/members/claims',
    PROVIDER_DIRECTORY: '/providers'
  },

  // HRIS (Human Resources Information Systems)
  WORKDAY: {
    API_BASE: 'https://wd2-impl-services1.workday.com',
    AUTH_ENDPOINT: '/oauth2/token',
    EMPLOYEE_ENDPOINT: '/ccx/service/customreport2',
    BENEFITS_ENDPOINT: '/ccx/service/benefits',
    TIME_OFF_ENDPOINT: '/ccx/service/absence'
  },

  BAMBOO_HR: {
    API_BASE: 'https://api.bamboohr.com/api/gateway.php',
    AUTH_TYPE: 'basic', // Uses API key
    EMPLOYEE_ENDPOINT: '/employees/directory',
    TIME_OFF_ENDPOINT: '/time_off/requests',
    BENEFITS_ENDPOINT: '/benefits/settings'
  },

  ADP: {
    API_BASE: 'https://api.adp.com',
    AUTH_ENDPOINT: '/auth/oauth/v2/token',
    WORKER_ENDPOINT: '/hr/v2/workers',
    BENEFITS_ENDPOINT: '/benefits/v1/workers',
    TIME_OFF_ENDPOINT: '/time/v2/workers'
  },

  // Health & Fitness Integrations
  APPLE_HEALTH: {
    FRAMEWORK: 'HealthKit', // Native iOS integration
    DATA_TYPES: [
      'HKQuantityTypeIdentifierStepCount',
      'HKQuantityTypeIdentifierDistanceWalkingRunning',
      'HKQuantityTypeIdentifierActiveEnergyBurned',
      'HKQuantityTypeIdentifierHeartRate'
    ]
  },

  GOOGLE_FIT: {
    API_BASE: 'https://www.googleapis.com/fitness/v1',
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN_URL: 'https://oauth2.googleapis.com/token',
    SCOPES: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read'
    ]
  },

  FITBIT: {
    API_BASE: 'https://api.fitbit.com/1',
    AUTH_URL: 'https://www.fitbit.com/oauth2/authorize',
    TOKEN_URL: 'https://api.fitbit.com/oauth2/token',
    SCOPES: [
      'activity',
      'heartrate',
      'sleep',
      'weight'
    ]
  },

  // Benefits Administration Platforms
  BENEFITS_SOLVE: {
    API_BASE: 'https://api.benefitssolve.com/v1',
    AUTH_ENDPOINT: '/auth/token',
    ENROLLMENT_ENDPOINT: '/enrollment',
    PLANS_ENDPOINT: '/plans',
    CLAIMS_ENDPOINT: '/claims'
  },

  NAMELY: {
    API_BASE: 'https://api.namely.com/api/v1',
    AUTH_TYPE: 'bearer', // Uses access token
    PROFILES_ENDPOINT: '/profiles',
    BENEFITS_ENDPOINT: '/benefits',
    TIME_OFF_ENDPOINT: '/time_off_requests'
  }
};

// Environment-specific endpoint configuration
export const getEndpointForEnvironment = (
  integration: keyof typeof INTEGRATION_ENDPOINTS,
  environment: 'development' | 'staging' | 'production' = 'production'
) => {
  const baseEndpoints = INTEGRATION_ENDPOINTS[integration];
  
  // For EHR systems, use sandbox in non-production environments
  if (integration === 'EPIC' || integration === 'CERNER') {
    return environment === 'production' 
      ? baseEndpoints.PRODUCTION_BASE 
      : baseEndpoints.SANDBOX_BASE;
  }
  
  return baseEndpoints.API_BASE || baseEndpoints;
};

// Common headers for different integration types
export const INTEGRATION_HEADERS = {
  FHIR: {
    'Accept': 'application/fhir+json',
    'Content-Type': 'application/fhir+json'
  },
  
  OAUTH2: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  
  REST_API: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Rate limiting configuration per integration
export const RATE_LIMITS = {
  EPIC: {
    requestsPerMinute: 60,
    requestsPerHour: 1000
  },
  
  CERNER: {
    requestsPerMinute: 120,
    requestsPerHour: 2000
  },
  
  GOOGLE_CALENDAR: {
    requestsPerMinute: 250,
    requestsPerDay: 1000000
  },
  
  OUTLOOK_CALENDAR: {
    requestsPerMinute: 2000,
    requestsPerHour: 10000
  },
  
  DEFAULT: {
    requestsPerMinute: 60,
    requestsPerHour: 1000
  }
};

// Webhook endpoints for real-time data sync
export const WEBHOOK_ENDPOINTS = {
  CALENDAR_UPDATES: '/webhooks/calendar/updates',
  EHR_APPOINTMENTS: '/webhooks/ehr/appointments',
  INSURANCE_CLAIMS: '/webhooks/insurance/claims',
  HRIS_CHANGES: '/webhooks/hris/employee-changes',
  BENEFITS_ENROLLMENT: '/webhooks/benefits/enrollment-changes'
};

// Integration status and health check endpoints
export const HEALTH_CHECK_ENDPOINTS = {
  EPIC: '/metadata',
  CERNER: '/metadata',
  GOOGLE_CALENDAR: '/calendar/v3/users/me/calendarList',
  OUTLOOK_CALENDAR: '/me/calendars',
  WORKDAY: '/ccx/service/test',
  BAMBOO_HR: '/employees/directory',
  ADP: '/hr/v2/workers'
};