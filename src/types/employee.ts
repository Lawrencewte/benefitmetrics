/**
 * Employee-specific type definitions
 */

/**
 * User profile types
 */
export interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  employerId: string;
  employeeId?: string;
  department?: string;
  jobTitle?: string;
  startDate?: string;
  profileImage?: string;
  timezone?: string;
  communicationPreferences?: CommunicationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  emailTypes: string[];
  smsTypes: string[];
  pushTypes: string[];
}

/**
 * Medical health profile
 */
export interface HealthProfile {
  id: string;
  userId: string;
  height?: number; // in cm
  weight?: number; // in kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: Allergy[];
  medications: Medication[];
  conditions: MedicalCondition[];
  surgeries: Surgery[];
  familyHistory: FamilyHistoryItem[];
  immunizations: Immunization[];
  lastPhysical?: string;
  lastDental?: string;
  lastVision?: string;
  smokingStatus: 'never' | 'former' | 'current' | 'unknown';
  alcoholUse: 'none' | 'occasional' | 'moderate' | 'heavy' | 'unknown';
  exerciseFrequency: 'none' | 'light' | 'moderate' | 'active' | 'unknown';
  notes?: string;
  updatedAt: string;
}

export interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  diagnosedDate?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  reason?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate?: string;
  status: 'active' | 'resolved' | 'managed';
  treatedBy?: string;
  treatment?: string;
  notes?: string;
}

export interface Surgery {
  id: string;
  name: string;
  date: string;
  hospital?: string;
  surgeon?: string;
  reason?: string;
  notes?: string;
}

export interface FamilyHistoryItem {
  id: string;
  condition: string;
  relationship: string;
  ageAtDiagnosis?: number;
  notes?: string;
}

export interface Immunization {
  id: string;
  name: string;
  date: string;
  expirationDate?: string;
  providerName?: string;
  batchNumber?: string;
}

/**
 * Appointment types
 */
export interface Appointment {
  id: string;
  userId: string;
  familyMemberId?: string;
  type: AppointmentType;
  providerName: string;
  providerSpecialty?: string;
  facilityName?: string;
  facilityAddress?: Address;
  date: string;
  time: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: string;
  reasonForVisit?: string;
  insuranceInfo?: string;
  reminders: AppointmentReminder[];
  documents?: AppointmentDocument[];
  createdAt: string;
  updatedAt: string;
  canceledAt?: string;
  cancelReason?: string;
}

export type AppointmentType = 
  | 'annual_physical'
  | 'dental_cleaning'
  | 'eye_exam'
  | 'skin_check'
  | 'mammogram'
  | 'colonoscopy'
  | 'gynecological'
  | 'vaccination'
  | 'specialist'
  | 'follow_up'
  | 'lab_work'
  | 'imaging'
  | 'therapy'
  | 'other';

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'canceled'
  | 'no_show'
  | 'rescheduled';

export interface AppointmentReminder {
  id: string;
  type: 'email' | 'sms' | 'push';
  scheduledFor: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface AppointmentDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
}

/**
 * Family member types
 */
export interface FamilyMember {
  id: string;
  userId: string; // The primary user who added this family member
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  healthPlan?: string;
  healthProfile?: HealthProfile;
  upcomingAppointments?: number;
  healthStatus?: 'good' | 'needsAttention' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

/**
 * Benefits types
 */
export interface BenefitsCoverage {
  id: string;
  userId: string;
  employerId: string;
  planName: string;
  planType: 'medical' | 'dental' | 'vision' | 'wellness' | 'flex_spending';
  memberId: string;
  groupNumber?: string;
  coverageLevel: 'individual' | 'individual_plus_one' | 'family';
  primaryInsured: string;
  dependents?: string[];
  network: string;
  startDate: string;
  endDate?: string;
  coverageDetails: Record<string, any>;
  documents?: BenefitDocument[];
  preventativeCareInfo?: PreventativeCareInfo[];
  contactInfo?: {
    phone: string;
    website: string;
    email?: string;
  };
}

export interface BenefitDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface PreventativeCareInfo {
  id: string;
  serviceName: string;
  frequency: string;
  coverage: string;
  limitations?: string;
  notes?: string;
}

export interface BenefitUsage {
  id: string;
  userId: string;
  benefitId: string;
  planYear: string;
  serviceName: string;
  serviceDate: string;
  providerName: string;
  coveredAmount: number;
  patientResponsibility: number;
  status: 'pending' | 'processed' | 'paid' | 'denied';
  claimId?: string;
  serviceCategory: string;
  applicationToDeductible?: number;
  preventativeCare: boolean;
}

/**
 * Health score and tracking types
 */
export interface HealthScore {
  id: string;
  userId: string;
  score: number;
  previousScore?: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsToNextLevel: number;
  lastUpdated: string;
  categories: HealthScoreCategory[];
  recommendations: HealthRecommendation[];
  history: HealthScoreHistory[];
}

export interface HealthScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  items: HealthScoreItem[];
}

export interface HealthScoreItem {
  id: string;
  name: string;
  points: number;
  maxPoints: number;
  status: 'completed' | 'incomplete' | 'overdue' | 'upcoming';
  completedDate?: string;
  dueDate?: string;
}

export interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  potentialPoints: number;
  priority: 'high' | 'medium' | 'low';
  actionType: 'appointment' | 'challenge' | 'education' | 'lifestyle';
  actionUrl?: string;
}

export interface HealthScoreHistory {
  date: string;
  score: number;
  change: number;
  event?: string;
}

export interface ROITracker {
  id: string;
  userId: string;
  totalSavings: number;
  lastUpdated: string;
  categories: ROICategory[];
  projected: ROIProjection;
  history: ROIHistory[];
}

export interface ROICategory {
  name: string;
  amount: number;
  items: ROIItem[];
}

export interface ROIItem {
  id: string;
  name: string;
  amount: number;
  date: string;
  description?: string;
  calculationMethod: string;
}

export interface ROIProjection {
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  assumptions: string[];
}

export interface ROIHistory {
  date: string;
  amount: number;
  change: number;
  event?: string;
}

export interface CareTimeline {
  id: string;
  userId: string;
  lastUpdated: string;
  upcomingActions: CareAction[];
  completedActions: CareAction[];
  recommendedActions: CareAction[];
}

export interface CareAction {
  id: string;
  title: string;
  description: string;
  actionType: 'appointment' | 'screening' | 'vaccination' | 'followup' | 'medication' | 'lifestyle';
  status: 'completed' | 'scheduled' | 'recommended' | 'overdue';
  date?: string;
  dueDate?: string;
  completedDate?: string;
  priority: 'high' | 'medium' | 'low';
  healthScoreImpact: number;
  roiImpact: number;
  relatedBenefits?: string[];
  notes?: string;
}

/**
 * Challenge and incentive types
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'canceled';
  category: 'physical' | 'nutrition' | 'mental' | 'preventative' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  participants: number;
  employerId?: string;
  isCompanyWide: boolean;
  rules: string;
  milestones?: ChallengeMilestone[];
  rewards?: ChallengeReward[];
  userProgress?: ChallengeProgress;
}

export interface ChallengeMilestone {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  points: number;
}

export interface ChallengeReward {
  id: string;
  name: string;
  description: string;
  value: number;
  type: 'points' | 'gift_card' | 'merchandise' | 'pto' | 'cash';
  threshold: number;
}

export interface ChallengeProgress {
  userId: string;
  challengeId: string;
  enrolled: boolean;
  enrollmentDate?: string;
  currentProgress: number;
  milestoneProgress: {
    milestoneId: string;
    progress: number;
    completed: boolean;
    completedDate?: string;
  }[];
  pointsEarned: number;
  rewardsEarned: string[];
  lastUpdated: string;
}

export interface Incentive {
  id: string;
  title: string;
  description: string;
  pointCost: number;
  category: 'discount' | 'merchandise' | 'gift_card' | 'experience' | 'donation' | 'pto';
  status: 'available' | 'limited' | 'discontinued';
  employerId?: string;
  quantity?: number;
  remaining?: number;
  expirationDate?: string;
  image?: string;
  redemptionInstructions?: string;
}

export interface IncentiveRedemption {
  id: string;
  userId: string;
  incentiveId: string;
  redeemedAt: string;
  pointsUsed: number;
  status: 'processing' | 'fulfilled' | 'canceled' | 'expired';
  fulfillmentDate?: string;
  redemptionCode?: string;
  shippingInfo?: Address;
  notes?: string;
}