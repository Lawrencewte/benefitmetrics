/**
 * Security policy constants for the application
 * These define the security requirements and configurations
 */
export const securityPolicies = {
  /**
   * Password policies
   */
  passwords: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    expirationDays: 90,
    preventReuse: 5, // Number of previous passwords to check
    maxAttempts: 5, // Max failed login attempts before lockout
  },
  
  /**
   * Session security settings
   */
  sessions: {
    maxIdleMinutes: 30, // Auto-logout after inactivity
    maxDurationHours: 12, // Max session duration
    renewalWindow: 15, // Minutes before expiry to renew
    enforceHttpsOnly: true,
    secureCookieAttributes: true,
    sameSitePolicy: 'strict' as const,
  },
  
  /**
   * API security settings
   */
  api: {
    rateLimits: {
      default: 100, // Requests per minute
      login: 5, // Login attempts per minute
      sensitiveOperations: 20, // Sensitive operations per minute
    },
    tokenExpiration: {
      access: 30, // Minutes
      refresh: 7, // Days
    },
    requiredHeaders: [
      'X-Request-ID',
      'X-API-Key',
    ],
  },
  
  /**
   * Data encryption requirements
   */
  encryption: {
    algorithm: 'AES-GCM',
    keyLength: 256,
    pbkdf2Iterations: 100000,
    minimumTlsVersion: 'TLS 1.2',
    dataAtRest: true,
    dataInTransit: true,
    sensitiveFieldsInMemory: true,
  },
  
  /**
   * Audit logging requirements
   */
  auditLogging: {
    loggedEvents: [
      'authentication',
      'authorization',
      'data_access',
      'data_modification',
      'security_configuration',
      'user_management',
      'consent_management',
    ],
    retentionPeriod: 365, // Days
    protectedFields: [
      'password',
      'securityAnswer',
      'creditCard',
      'ssn',
    ],
  },
  
  /**
   * Data privacy settings
   */
  dataPrivacy: {
    dataRetentionPeriods: {
      userProfile: 730, // Days (2 years)
      healthRecords: 2190, // Days (6 years)
      auditLogs: 2190, // Days (6 years)
      analyticsData: 365, // Days (1 year)
    },
    minimumNecessaryAccess: true,
    requireExplicitConsent: true,
    allowDataExport: true,
    allowDataDeletion: true,
  },
  
  /**
   * Access control settings
   */
  accessControl: {
    enforceRoleSeparation: true,
    enforceMultiFactorAuth: {
      admins: true,
      employees: true,
      patients: false,
    },
    privilegedOperationVerification: true,
    maxPrivilegedSessionDuration: 60, // Minutes
  },
};