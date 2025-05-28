// ============================================================================
// COMMON TYPES FOR BenefitMetrics HEALTHCARE APPLICATION
// ============================================================================

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// User and authentication types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  phoneNumber?: string;
  timezone: string;
  locale: string;
  preferences: UserPreferences;
  metadata?: Record<string, any>;
}

export type UserRole = 'employee' | 'hr_admin' | 'hr_manager' | 'system_admin' | 'super_admin';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  display: DisplayPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
  categories: {
    appointments: boolean;
    reminders: boolean;
    healthAlerts: boolean;
    systemUpdates: boolean;
    promotional: boolean;
  };
}

export interface PrivacyPreferences {
  shareHealthData: boolean;
  shareWithEmployer: boolean;
  anonymizeData: boolean;
  dataRetentionPeriod: number; // years
  allowAnalytics: boolean;
  allowPersonalization: boolean;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reduceMotion: boolean;
  keyboardNavigation: boolean;
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  measurementSystem: 'metric' | 'imperial';
}

// Health-related types
export interface HealthProfile extends BaseEntity {
  userId: string;
  dateOfBirth: string;
  gender: Gender;
  height?: number; // cm
  weight?: number; // kg
  bloodType?: BloodType;
  allergies: Allergy[];
  medications: Medication[];
  medicalConditions: MedicalCondition[];
  familyHistory: FamilyMedicalHistory[];
  emergencyContacts: EmergencyContact[];
  healthScore: number;
  riskFactors: HealthRiskFactor[];
  lastUpdated: string;
}

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  diagnosedDate?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  purpose?: string;
}

export interface MedicalCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'managed';
  notes?: string;
}

export interface FamilyMedicalHistory {
  id: string;
  relationship: FamilyRelationship;
  condition: string;
  ageOfOnset?: number;
  notes?: string;
}

export type FamilyRelationship = 
  | 'parent' | 'sibling' | 'grandparent' | 'aunt_uncle' 
  | 'cousin' | 'child' | 'other';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
}

export interface HealthRiskFactor {
  type: RiskFactorType;
  level: RiskLevel;
  description: string;
  recommendations: string[];
  lastAssessed: string;
}

export type RiskFactorType = 
  | 'cardiovascular' | 'diabetes' | 'cancer' | 'mental_health' 
  | 'musculoskeletal' | 'respiratory' | 'other';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

// Appointment and care types
export interface Appointment extends BaseEntity {
  userId: string;
  providerId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: string;
  duration: number; // minutes
  location: AppointmentLocation;
  notes?: string;
  preparationInstructions?: string[];
  followUpRequired: boolean;
  remindersSent: string[];
  metadata?: Record<string, any>;
}

export type AppointmentType = 
  | 'annual_physical' | 'dental_cleaning' | 'vision_exam' 
  | 'mammogram' | 'colonoscopy' | 'blood_work' 
  | 'vaccination' | 'specialty_consultation' | 'telehealth' | 'other';

export type AppointmentStatus = 
  | 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' 
  | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export interface AppointmentLocation {
  type: 'in_person' | 'telehealth' | 'home_visit';
  address?: Address;
  virtualMeetingInfo?: VirtualMeetingInfo;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface VirtualMeetingInfo {
  platform: 'zoom' | 'teams' | 'google_meet' | 'webex' | 'other';
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  dialInNumber?: string;
}

export interface Provider extends BaseEntity {
  name: string;
  specialty: MedicalSpecialty;
  credentials: string[];
  organization: string;
  contactInfo: ProviderContact;
  location: Address;
  acceptedInsurance: string[];
  availability: ProviderAvailability;
  rating?: number;
  isInNetwork: boolean;
}

export type MedicalSpecialty = 
  | 'primary_care' | 'internal_medicine' | 'family_medicine'
  | 'cardiology' | 'dermatology' | 'endocrinology' | 'gastroenterology'
  | 'gynecology' | 'neurology' | 'oncology' | 'orthopedics'
  | 'psychiatry' | 'pulmonology' | 'urology' | 'ophthalmology'
  | 'dentistry' | 'optometry' | 'other';

export interface ProviderContact {
  phone: string;
  email?: string;
  website?: string;
  fax?: string;
}

export interface ProviderAvailability {
  schedule: {
    [day: string]: {
      start: string;
      end: string;
      breaks?: { start: string; end: string }[];
    };
  };
  timeZone: string;
  appointmentDuration: number; // default in minutes
  advanceBookingDays: number;
  bufferTime: number; // minutes between appointments
}

// Benefits and insurance types
export interface BenefitsPlan extends BaseEntity {
  planName: string;
  planType: BenefitsPlanType;
  carrier: string;
  effectiveDate: string;
  endDate?: string;
  coverage: BenefitsCoverage;
  costs: BenefitsCosts;
  networks: ProviderNetwork[];
  isActive: boolean;
}

export type BenefitsPlanType = 'medical' | 'dental' | 'vision' | 'mental_health' | 'wellness';

export interface BenefitsCoverage {
  preventativeCare: CoverageDetails;
  primaryCare: CoverageDetails;
  specialistCare: CoverageDetails;
  emergencyCare: CoverageDetails;
  hospitalCare: CoverageDetails;
  prescriptionDrugs: CoverageDetails;
  mentalHealth: CoverageDetails;
  additionalBenefits?: Record<string, CoverageDetails>;
}

export interface CoverageDetails {
  covered: boolean;
  copay?: number;
  coinsurance?: number;
  deductible?: number;
  outOfPocketMax?: number;
  limitations?: string[];
  exclusions?: string[];
}

export interface BenefitsCosts {
  monthlyPremium: number;
  annualDeductible: number;
  outOfPocketMaximum: number;
  hsa?: {
    eligible: boolean;
    employerContribution?: number;
    maxContribution: number;
  };
  fsa?: {
    eligible: boolean;
    maxContribution: number;
  };
}

export interface ProviderNetwork {
  id: string;
  name: string;
  type: 'preferred' | 'standard' | 'out_of_network';
  coverageLevel: number; // percentage
  providerCount: number;
  searchUrl?: string;
}

// Company and employer types
export interface Company extends BaseEntity {
  name: string;
  industry: string;
  size: CompanySize;
  location: Address;
  contactInfo: CompanyContact;
  benefits: CompanyBenefits;
  wellnessPrograms: WellnessProgram[];
  policies: CompanyPolicies;
  settings: CompanySettings;
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface CompanyContact {
  hrEmail: string;
  hrPhone: string;
  benefitsEmail?: string;
  wellnessEmail?: string;
  website?: string;
}

export interface CompanyBenefits {
  healthInsurance: BenefitsPlan[];
  wellnessAllowance?: number; // annual amount
  ptoPolicy: PTOPolicy;
  wellnessIncentives: WellnessIncentive[];
  additionalBenefits: Record<string, any>;
}

export interface PTOPolicy {
  sickDays: number; // annual allowance
  vacationDays: number;
  personalDays: number;
  wellnessDays?: number;
  carryOverPolicy: string;
  accrualRate?: number;
}

export interface WellnessIncentive {
  id: string;
  name: string;
  description: string;
  type: IncentiveType;
  value: number;
  requirements: string[];
  expirationDate?: string;
  isActive: boolean;
}

export type IncentiveType = 
  | 'cash_reward' | 'gift_card' | 'pto_hours' | 'premium_discount' 
  | 'hsa_contribution' | 'merchandise' | 'recognition';

export interface WellnessProgram extends BaseEntity {
  name: string;
  description: string;
  type: ProgramType;
  status: ProgramStatus;
  startDate: string;
  endDate?: string;
  eligibilityRules: EligibilityRule[];
  goals: ProgramGoal[];
  activities: ProgramActivity[];
  rewards: WellnessIncentive[];
  metrics: ProgramMetrics;
}

export type ProgramType = 
  | 'fitness_challenge' | 'nutrition_program' | 'stress_management'
  | 'smoking_cessation' | 'weight_management' | 'biometric_screening'
  | 'educational_series' | 'preventative_care_campaign';

export type ProgramStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface EligibilityRule {
  type: 'all_employees' | 'department' | 'role' | 'location' | 'custom';
  criteria: string[];
  exclusions?: string[];
}

export interface ProgramGoal {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
}

export interface ProgramActivity {
  id: string;
  name: string;
  description: string;
  type: ActivityType;
  points: number;
  frequency: ActivityFrequency;
  verificationMethod: VerificationMethod;
}

export type ActivityType = 
  | 'exercise' | 'health_screening' | 'education' | 'nutrition'
  | 'mindfulness' | 'social' | 'preventative_care' | 'other';

export type ActivityFrequency = 'daily' | 'weekly' | 'monthly' | 'one_time';

export type VerificationMethod = 
  | 'self_report' | 'device_sync' | 'photo_upload' | 'third_party'
  | 'biometric_data' | 'attendance' | 'completion_certificate';

export interface ProgramMetrics {
  enrollmentCount: number;
  participationRate: number;
  completionRate: number;
  averageEngagement: number;
  totalPointsAwarded: number;
  costPerParticipant: number;
  estimatedROI: number;
}

export interface CompanyPolicies {
  privacyPolicy: PolicyDocument;
  dataRetention: DataRetentionPolicy;
  hipaaCompliance: HIPAACompliancePolicy;
  accessControl: AccessControlPolicy;
}

export interface PolicyDocument {
  version: string;
  effectiveDate: string;
  content: string;
  lastReviewed: string;
  nextReviewDate: string;
}

export interface DataRetentionPolicy {
  healthData: number; // years
  appointmentData: number;
  communicationData: number;
  auditLogs: number;
  anonymizationRules: string[];
}

export interface HIPAACompliancePolicy {
  businessAssociateAgreements: string[];
  dataEncryptionStandards: string[];
  accessLogRetention: number; // years
  breachNotificationProcedure: string;
  employeeTrainingRequirements: string[];
}

export interface AccessControlPolicy {
  passwordRequirements: PasswordPolicy;
  sessionTimeout: number; // minutes
  mfaRequired: boolean;
  ipWhitelist?: string[];
  roleBasedAccess: Record<UserRole, string[]>;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays?: number;
  historyCount: number; // prevent reuse
}

export interface CompanySettings {
  timezone: string;
  businessHours: {
    start: string;
    end: string;
    workDays: number[];
  };
  fiscalYearStart: string; // MM-DD format
  features: FeatureFlags;
  integrations: IntegrationSettings;
  branding: BrandingSettings;
}

export interface FeatureFlags {
  healthScoring: boolean;
  roiTracking: boolean;
  careTimeline: boolean;
  familyAccounts: boolean;
  telemedicine: boolean;
  wearableIntegration: boolean;
  aiRecommendations: boolean;
  advancedAnalytics: boolean;
}

export interface IntegrationSettings {
  calendar: CalendarIntegration;
  hris: HRISIntegration;
  ehr: EHRIntegration;
  insurance: InsuranceIntegration;
  communications: CommunicationIntegration;
}

export interface CalendarIntegration {
  enabled: boolean;
  provider: 'google' | 'outlook' | 'apple' | 'custom';
  syncDirection: 'one_way' | 'two_way';
  autoCreateMeetings: boolean;
  defaultReminders: number[]; // minutes before
}

export interface HRISIntegration {
  enabled: boolean;
  provider: 'workday' | 'bamboohr' | 'adp' | 'custom';
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  dataMapping: Record<string, string>;
}

export interface EHRIntegration {
  enabled: boolean;
  provider: 'epic' | 'cerner' | 'allscripts' | 'custom';
  fhirCompliant: boolean;
  dataTypes: string[];
  consentRequired: boolean;
}

export interface InsuranceIntegration {
  enabled: boolean;
  carriers: string[];
  realTimeVerification: boolean;
  claimsTracking: boolean;
}

export interface CommunicationIntegration {
  email: EmailProvider;
  sms: SMSProvider;
  push: PushProvider;
}

export interface EmailProvider {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'custom';
  fromAddress: string;
  fromName: string;
  replyToAddress?: string;
}

export interface SMSProvider {
  provider: 'twilio' | 'aws_sns' | 'custom';
  fromNumber: string;
}

export interface PushProvider {
  provider: 'firebase' | 'apns' | 'custom';
  credentials: Record<string, string>;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logo: string; // URL or base64
  favicon: string;
  customCSS?: string;
  emailTemplates: Record<string, string>;
}

// Analytics and reporting types
export interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;
  category: MetricCategory;
  value: number | string;
  unit: string;
  trend: TrendDirection;
  benchmarkValue?: number;
  lastUpdated: string;
  formula?: string;
}

export type MetricCategory = 
  | 'health_outcomes' | 'engagement' | 'financial' | 'operational'
  | 'compliance' | 'satisfaction' | 'utilization';

export type TrendDirection = 'up' | 'down' | 'stable' | 'unknown';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  dataSource: string;
  configuration: Record<string, any>;
  position: WidgetPosition;
  permissions: string[];
  refreshInterval?: number; // seconds
}

export type WidgetType = 
  | 'metric_card' | 'chart' | 'table' | 'progress_bar'
  | 'leaderboard' | 'calendar' | 'map' | 'custom';

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  schedule?: ReportSchedule;
  recipients: string[];
  parameters: Record<string, any>;
  template: ReportTemplate;
  lastGenerated?: string;
  nextScheduled?: string;
}

export type ReportType = 
  | 'executive_summary' | 'compliance' | 'financial' | 'health_outcomes'
  | 'engagement' | 'utilization' | 'custom';

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm format
  timezone: string;
}

export interface ReportTemplate {
  sections: ReportSection[];
  formatting: ReportFormatting;
  exportFormats: ('pdf' | 'excel' | 'csv')[];
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'table' | 'metric' | 'image';
  content: any;
  order: number;
}

export interface ReportFormatting {
  pageSize: 'A4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  header?: string;
  footer?: string;
  watermark?: string;
}

// Communication and notification types
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  content: string;
  data?: Record<string, any>;
  status: NotificationStatus;
  priority: NotificationPriority;
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'appointment_reminder' | 'health_alert' | 'benefit_expiration'
  | 'wellness_milestone' | 'system_update' | 'promotional'
  | 'emergency' | 'educational' | 'social';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app' | 'voice';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'expired';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Message extends BaseEntity {
  fromUserId?: string;
  toUserIds: string[];
  subject: string;
  content: string;
  type: MessageType;
  priority: NotificationPriority;
  attachments?: Attachment[];
  thread?: string;
  isRead: Record<string, boolean>; // userId -> read status
  metadata?: Record<string, any>;
}

export type MessageType = 'direct' | 'broadcast' | 'announcement' | 'system' | 'automated';

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Security and compliance types
export interface AuditLog extends BaseEntity {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  outcome: AuditOutcome;
  riskLevel: RiskLevel;
  metadata?: Record<string, any>;
}

export type AuditOutcome = 'success' | 'failure' | 'partial' | 'blocked';

export interface SecurityEvent extends BaseEntity {
  type: SecurityEventType;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  details: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type SecurityEventType = 
  | 'login_attempt' | 'password_change' | 'data_access' | 'permission_change'
  | 'suspicious_activity' | 'data_breach' | 'system_intrusion' | 'policy_violation';

export interface ConsentRecord extends BaseEntity {
  userId: string;
  consentType: ConsentType;
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string;
  version: string;
  ipAddress: string;
  evidence: ConsentEvidence;
  expiresAt?: string;
}

export type ConsentType = 
  | 'data_processing' | 'health_data_sharing' | 'marketing_communications'
  | 'analytics_tracking' | 'third_party_sharing' | 'research_participation';

export interface ConsentEvidence {
  method: 'web_form' | 'email_confirmation' | 'verbal' | 'written' | 'implied';
  timestamp: string;
  checksum?: string;
  witnessId?: string;
  documentId?: string;
}

// API and integration types
export interface APIKey extends BaseEntity {
  name: string;
  keyHash: string; // Never store plain text
  permissions: string[];
  rateLimit: number; // requests per minute
  lastUsed?: string;
  expiresAt?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface Webhook extends BaseEntity {
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastTriggered?: string;
  failureCount: number;
  maxRetries: number;
  retryDelays: number[]; // seconds
  headers?: Record<string, string>;
}

export interface Integration extends BaseEntity {
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  configuration: Record<string, any>;
  credentials: Record<string, string>; // Encrypted
  lastSync?: string;
  syncFrequency?: string;
  errorCount: number;
  metadata?: Record<string, any>;
}

export type IntegrationType = 
  | 'calendar' | 'hris' | 'ehr' | 'insurance' | 'communication'
  | 'analytics' | 'payment' | 'identity' | 'storage' | 'custom';

export type IntegrationStatus = 
  | 'connected' | 'disconnected' | 'error' | 'pending' | 'expired';

// File and document types
export interface Document extends BaseEntity {
  name: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  content?: string; // For text documents
  fileUrl?: string; // For binary files
  fileSize?: number;
  mimeType?: string;
  version: string;
  isPublic: boolean;
  tags: string[];
  permissions: DocumentPermission[];
  expiresAt?: string;
}

export type DocumentType = 
  | 'policy' | 'form' | 'guide' | 'certificate' | 'report'
  | 'template' | 'image' | 'video' | 'other';

export type DocumentCategory = 
  | 'legal' | 'hr' | 'benefits' | 'wellness' | 'training'
  | 'compliance' | 'medical' | 'administrative';

export interface DocumentPermission {
  userId?: string;
  role?: UserRole;
  permission: 'read' | 'write' | 'delete' | 'share';
}

// Utility types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterParams {
  [key: string]: any;
}

export interface SearchParams {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  highlight?: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  metadata?: Record<string, any>;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: Address;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  userId?: string;
  requestId?: string;
  stack?: string;
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
}

// Response wrapper types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
    rateLimit?: {
      limit: number;
      remaining: number;
      reset: string;
    };
  };
}

export interface ApiRequest<T = any> {
  data?: T;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  context?: {
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
  };
}

// Feature flag types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  userSegments?: string[];
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, any>;
}

// Configuration types
export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  features: Record<string, FeatureFlag>;
  services: ServiceConfig[];
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  performance: PerformanceConfig;
}

export interface ServiceConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  circuitBreaker?: {
    threshold: number;
    timeout: number;
    monitor: boolean;
  };
}

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keySize: number;
  };
  authentication: {
    tokenExpiry: number;
    refreshTokenExpiry: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

export interface MonitoringConfig {
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    destinations: string[];
  };
  metrics: {
    enabled: boolean;
    interval: number;
    retention: number;
  };
  alerts: {
    enabled: boolean;
    thresholds: Record<string, number>;
    channels: string[];
  };
}

export interface PerformanceConfig {
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  compression: {
    enabled: boolean;
    threshold: number;
  };
  cdn: {
    enabled: boolean;
    baseUrl?: string;
  };
}

// Event types for real-time updates
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

// Internationalization types
export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  currencyFormat: string;
  translations: Record<string, string>;
}

// Health scoring types (specific to the app)
export interface HealthScore {
  overall: number;
  categories: {
    preventativeCare: number;
    lifestyle: number;
    riskFactors: number;
    engagement: number;
  };
  trends: {
    period: string;
    change: number;
    direction: TrendDirection;
  };
  lastCalculated: string;
  factors: HealthScoreFactor[];
}

export interface HealthScoreFactor {
  category: string;
  factor: string;
  impact: number;
  weight: number;
  recommendations?: string[];
}

// ROI tracking types
export interface ROICalculation {
  period: string;
  investment: number;
  savings: ROISavings;
  netReturn: number;
  roiPercentage: number;
  breakdownByCategory: Record<string, number>;
  projections: ROIProjection[];
  calculatedAt: string;
}

export interface ROISavings {
  preventativeCare: number;
  reducedAbsenteeism: number;
  lowerInsurancePremiums: number;
  increasedProductivity: number;
  earlyDetection: number;
  total: number;
}

export interface ROIProjection {
  period: string;
  projectedSavings: number;
  confidence: number;
  assumptions: string[];
}

// Export all types as a namespace for easier importing
export namespace BenefitMetricsTypes {
  export type {
    User, UserRole, UserStatus, UserPreferences,
    HealthProfile, Appointment, Provider, BenefitsPlan,
    Company, WellnessProgram, Notification, Message,
    AuditLog, SecurityEvent, ConsentRecord,
    ApiResponse, ApiRequest, AppError, ValidationError
  };
}