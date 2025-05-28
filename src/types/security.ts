/**
 * Security-related type definitions
 */

/**
 * Audit log entry types
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  username?: string;
  userRoles?: string[];
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  status: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  sessionId?: string;
}

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'password_change'
  | 'mfa_enable'
  | 'mfa_disable'
  | 'account_create'
  | 'account_update'
  | 'account_delete'
  | 'permission_change'
  | 'role_change'
  | 'data_view'
  | 'data_create'
  | 'data_update'
  | 'data_delete'
  | 'data_export'
  | 'data_import'
  | 'consent_grant'
  | 'consent_withdraw'
  | 'system_config_change'
  | 'security_alert';

/**
 * User consent record
 */
export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  consentVersion: string;
  status: 'granted' | 'denied' | 'expired' | 'withdrawn';
  grantedAt: string;
  expiresAt?: string;
  withdrawnAt?: string;
  dataCategories: string[];
  purposes: string[];
  displayText?: string;
  proofOfConsent?: string;
}

export type ConsentType = 
  | 'privacy_policy'
  | 'terms_of_service'
  | 'data_sharing'
  | 'marketing_communications'
  | 'health_data_collection'
  | 'research_participation'
  | 'third_party_access'
  | 'location_tracking'
  | 'biometric_data';

/**
 * Data encryption information
 */
export interface EncryptionInfo {
  algorithm: string;
  keyId: string;
  iv: string; // Initialization vector
  authTag?: string; // For authenticated encryption modes
  encryptedFields: string[];
}

/**
 * Security event for monitoring
 */
export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  affectedResource?: string;
  affectedUser?: string;
  ipAddress?: string;
  status: 'detected' | 'in_progress' | 'resolved' | 'false_positive';
  resolution?: string;
  relatedEvents?: string[];
}

export type SecurityEventType = 
  | 'authentication_failure'
  | 'brute_force_attempt'
  | 'suspicious_login'
  | 'unusual_location'
  | 'unusual_access_pattern'
  | 'permission_violation'
  | 'data_exfiltration'
  | 'malware_detection'
  | 'ddos_attempt'
  | 'api_abuse'
  | 'privacy_violation'
  | 'system_misconfiguration';

/**
 * Role-based access control types
 */
export interface RbacPermission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
}

export interface RbacRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // Permission IDs
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RbacUserAssignment {
  userId: string;
  roles: string[]; // Role IDs
  grantedBy?: string;
  grantedAt: string;
  expiresAt?: string;
}

/**
 * Compliance monitoring types
 */
export interface ComplianceCheckResult {
  id: string;
  timestamp: string;
  standard: 'hipaa' | 'gdpr' | 'ccpa' | 'soc2' | 'iso27001';
  control: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable';
  findings: ComplianceFinding[];
  remediation?: string;
  assignedTo?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceFinding {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string;
  recommendedAction?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

/**
 * Data privacy request types
 */
export interface DataPrivacyRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'deletion' | 'correction' | 'portability' | 'restriction';
  status: 'received' | 'in_progress' | 'completed' | 'denied' | 'withdrawn';
  receivedAt: string;
  completedAt?: string;
  requestDetails?: string;
  responseDetails?: string;
  dataScope: string[];
  verificationMethod?: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  assignedTo?: string;
}

/**
 * Security settings
 */
export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecial: boolean;
    expirationDays: number;
    preventReuse: number;
    maxAttempts: number;
  };
  
  sessionPolicy: {
    maxIdleMinutes: number;
    maxDurationHours: number;
    renewalWindowMinutes: number;
    enforceHttpsOnly: boolean;
    secureCookieAttributes: boolean;
    sameSitePolicy: 'strict' | 'lax' | 'none';
  };
  
  mfaPolicy: {
    required: boolean;
    requiredForRoles: string[];
    allowedMethods: ('sms' | 'email' | 'app' | 'hardware')[];
    graceLoginCount: number;
  };
  
  apiSecurity: {
    rateLimits: Record<string, number>;
    tokenExpiration: {
      access: number;
      refresh: number;
    };
    requiredHeaders: string[];
  };
}