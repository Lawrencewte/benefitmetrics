/**
 * Integration-related type definitions
 */

/**
 * Calendar integration types
 */
export interface CalendarIntegration {
  id: string;
  userId: string;
  provider: 'google' | 'outlook' | 'apple' | 'exchange';
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  calendarId?: string;
  calendarName?: string;
  syncSettings: CalendarSyncSettings;
  lastSyncDate?: string;
  lastSyncStatus?: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSyncSettings {
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  syncDirection: 'one_way' | 'two_way';
  appointmentTypes: string[];
  reminderSettings: {
    enabled: boolean;
    defaultReminders: number[]; // minutes before appointment
  };
  privacySettings: {
    showDetailedInfo: boolean;
    showProviderInfo: boolean;
    showLocationInfo: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  reminders?: number[];
  isAllDay: boolean;
  recurrence?: CalendarRecurrence;
  status: 'confirmed' | 'tentative' | 'cancelled';
  visibility: 'public' | 'private' | 'confidential';
  source: 'BenefitMetrics' | 'external';
  relatedAppointmentId?: string;
}

export interface CalendarRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  count?: number;
  byDay?: string[];
  byMonth?: number[];
}

/**
 * EHR integration types
 */
export interface EhrIntegration {
  id: string;
  userId: string;
  provider: 'epic' | 'cerner' | 'allscripts' | 'athenahealth' | 'nextgen' | 'eclinicalworks' | 'other';
  facilityName: string;
  isConnected: boolean;
  connectionType: 'fhir' | 'hl7' | 'api' | 'file_transfer';
  apiEndpoint?: string;
  clientId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  permissions: EhrPermission[];
  syncSettings: EhrSyncSettings;
  lastSyncDate?: string;
  lastSyncStatus?: 'success' | 'error' | 'partial';
  errorMessage?: string;
  dataMapping?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface EhrPermission {
  resource: 'patient' | 'observation' | 'condition' | 'medication' | 'appointment' | 'immunization' | 'procedure';
  scope: 'read' | 'write' | 'read_write';
  granted: boolean;
  grantedAt?: string;
}

export interface EhrSyncSettings {
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  dataTypes: string[];
  dateRange?: {
    startDate: string;
    endDate?: string;
  };
  filterCriteria?: Record<string, any>;
  encryptionRequired: boolean;
  auditLogging: boolean;
}

export interface FhirResource {
  resourceType: string;
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
    security?: any[];
    tag?: any[];
  };
  text?: {
    status: 'generated' | 'extensions' | 'additional' | 'empty';
    div: string;
  };
  extension?: any[];
  identifier?: any[];
  [key: string]: any;
}

/**
 * Insurance integration types
 */
export interface InsuranceIntegration {
  id: string;
  userId: string;
  provider: string;
  planName: string;
  memberId: string;
  groupNumber?: string;
  isConnected: boolean;
  apiEndpoint?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  coverageDetails: InsuranceCoverageDetails;
  syncSettings: InsuranceSyncSettings;
  lastSyncDate?: string;
  lastSyncStatus?: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceCoverageDetails {
  type: 'medical' | 'dental' | 'vision' | 'pharmacy';
  network: string;
  effectiveDate: string;
  terminationDate?: string;
  deductible?: {
    individual: number;
    family: number;
    remaining: number;
  };
  outOfPocketMax?: {
    individual: number;
    family: number;
    remaining: number;
  };
  copayments?: Record<string, number>;
  coinsurance?: number;
  preventativeCare?: {
    covered: boolean;
    copay: number;
    limitations?: string[];
  };
}

export interface InsuranceSyncSettings {
  syncFrequency: 'daily' | 'weekly' | 'monthly';
  dataTypes: ('coverage' | 'claims' | 'eligibility' | 'benefits' | 'providers')[];
  includeFamily: boolean;
  encryptionRequired: boolean;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  memberId: string;
  serviceDate: string;
  provider: {
    name: string;
    npi?: string;
    address?: Address;
  };
  diagnosis: {
    code: string;
    description: string;
  }[];
  procedures: {
    code: string;
    description: string;
    amount: number;
  }[];
  status: 'submitted' | 'processing' | 'approved' | 'denied' | 'paid';
  amounts: {
    billed: number;
    allowed: number;
    paid: number;
    patientResponsibility: number;
  };
  paymentDate?: string;
  denialReason?: string;
  explanationOfBenefits?: string;
}

/**
 * Employer system integration types
 */
export interface HrisIntegration {
  id: string;
  employerId: string;
  system: 'workday' | 'successfactors' | 'bamboohr' | 'adp' | 'paychex' | 'other';
  systemName: string;
  isConnected: boolean;
  connectionType: 'api' | 'sftp' | 'webhook' | 'file_upload';
  apiEndpoint?: string;
  credentials?: Record<string, string>;
  syncSettings: HrisSyncSettings;
  dataMapping: HrisDataMapping;
  lastSyncDate?: string;
  lastSyncStatus?: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrisSyncSettings {
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  syncDirection: 'inbound' | 'outbound' | 'bidirectional';
  deltaSync: boolean;
  batchSize?: number;
  retryAttempts: number;
  notificationSettings: {
    onSuccess: boolean;
    onError: boolean;
    recipients: string[];
  };
}

export interface HrisDataMapping {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  terminationDate?: string;
  status: string;
  manager?: string;
  location?: string;
  salary?: string;
  customFields?: Record<string, string>;
}

export interface BenefitsAdminIntegration {
  id: string;
  employerId: string;
  system: 'workday' | 'adp' | 'paychex' | 'benefitfocus' | 'other';
  systemName: string;
  isConnected: boolean;
  connectionType: 'api' | 'sftp' | 'webhook' | 'file_upload';
  apiEndpoint?: string;
  credentials?: Record<string, string>;
  syncSettings: BenefitsAdminSyncSettings;
  dataMapping: BenefitsAdminDataMapping;
  lastSyncDate?: string;
  lastSyncStatus?: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitsAdminSyncSettings {
  syncFrequency: 'daily' | 'weekly' | 'monthly';
  syncDirection: 'inbound' | 'outbound' | 'bidirectional';
  enrollmentPeriods: {
    open: { start: string; end: string };
    special: { events: string[]; durationDays: number };
  };
  eligibilityRules: Record<string, any>;
  notificationSettings: {
    onEnrollment: boolean;
    onChanges: boolean;
    recipients: string[];
  };
}

export interface BenefitsAdminDataMapping {
  employeeId: string;
  planId: string;
  planName: string;
  coverageLevel: string;
  effectiveDate: string;
  terminationDate?: string;
  premium: string;
  deductible?: string;
  customFields?: Record<string, string>;
}

export interface PtoIntegration {
  id: string;
  employerId: string;
  system: 'workday' | 'adp' | 'bamboohr' | 'namely' | 'other';
  systemName: string;
  isConnected: boolean;
  connectionType: 'api' | 'webhook' | 'file_upload';
  apiEndpoint?: string;
  credentials?: Record<string, string>;
  syncSettings: PtoSyncSettings;
  policySettings: PtoPolicySettings;
  lastSyncDate?: string;
  lastSyncStatus?: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PtoSyncSettings {
  syncFrequency: 'realtime' | 'daily' | 'weekly';
  syncDirection: 'inbound' | 'outbound' | 'bidirectional';
  requestTypes: string[];
  approvalWorkflow: boolean;
  notificationSettings: {
    onRequest: boolean;
    onApproval: boolean;
    recipients: string[];
  };
}

export interface PtoPolicySettings {
  wellnessTimeOff: {
    enabled: boolean;
    maxDaysPerYear?: number;
    requiresJustification: boolean;
    approvalRequired: boolean;
    eligibleActivities: string[];
  };
  preventativeCareTime: {
    enabled: boolean;
    maxHoursPerYear?: number;
    requiresAppointmentProof: boolean;
    coveredServices: string[];
  };
}

/**
 * Integration status and monitoring
 */
export interface IntegrationStatus {
  id: string;
  userId?: string;
  employerId?: string;
  integrations: {
    calendar: CalendarIntegration[];
    ehr: EhrIntegration[];
    insurance: InsuranceIntegration[];
    hris?: HrisIntegration[];
    benefitsAdmin?: BenefitsAdminIntegration[];
    pto?: PtoIntegration[];
  };
  overallStatus: 'healthy' | 'warning' | 'error';
  lastChecked: string;
  issues: IntegrationIssue[];
}

export interface IntegrationIssue {
  id: string;
  integrationType: string;
  integrationId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  resolution?: string;
  affectedFeatures: string[];
  recommendedActions: string[];
}

export interface IntegrationEvent {
  id: string;
  integrationId: string;
  integrationType: string;
  eventType: 'sync_started' | 'sync_completed' | 'sync_failed' | 'connection_lost' | 'connection_restored' | 'data_updated';
  timestamp: string;
  details?: Record<string, any>;
  recordsAffected?: number;
  duration?: number;
  errorMessage?: string;
}