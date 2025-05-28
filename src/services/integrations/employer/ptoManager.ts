import { api } from '../../api';
import { auditLogService } from '../../security/auditLogService';

export interface PTOPolicy {
  id: string;
  companyId: string;
  policyName: string;
  policyType: 'UNLIMITED' | 'ACCRUAL' | 'BANK' | 'HYBRID';
  timeOffTypes: PTOTimeOffType[];
  eligibility: {
    waitingPeriodDays: number;
    employeeTypes: ('FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY')[];
    minimumHoursPerWeek?: number;
    probationaryPeriod?: number; // days
  };
  accrualRules?: {
    accrualRate: number; // hours per pay period
    accrualFrequency: 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    maxAccrual: number; // hours
    carryoverLimit: number; // hours
    carryoverExpiration?: Date;
    prorateFirstYear: boolean;
  };
  approval: {
    requiresApproval: boolean;
    approvalLevels: number;
    autoApprovalTypes?: string[];
    managerApproval: boolean;
    hrApproval: boolean;
    advanceNoticeRequired: number; // days
    blackoutPeriods: {
      name: string;
      startDate: Date;
      endDate: Date;
      restrictions: string[];
    }[];
  };
  wellness: {
    wellnessTimeEnabled: boolean;
    preventativeCareTimeOff: {
      enabled: boolean;
      hoursPerYear: number;
      requiresDocumentation: boolean;
      autoApproved: boolean;
    };
    mentalHealthDays: {
      enabled: boolean;
      hoursPerYear: number;
      noQuestionsAsked: boolean;
    };
    fitnessTime: {
      enabled: boolean;
      hoursPerWeek: number;
      requiresPreApproval: boolean;
    };
  };
  compliance: {
    fmlaIntegration: boolean;
    stateLeawsCompliance: string[];
    sickLeaveTracking: boolean;
    covidLeaveTracking: boolean;
  };
  active: boolean;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PTOTimeOffType {
  id: string;
  name: string;
  code: string;
  category: 'VACATION' | 'SICK' | 'PERSONAL' | 'WELLNESS' | 'MEDICAL' | 'BEREAVEMENT' | 'JURY_DUTY' | 'MILITARY' | 'PARENTAL' | 'OTHER';
  paidTimeOff: boolean;
  maxConsecutiveDays?: number;
  minIncrementHours: number; // minimum increment (e.g., 0.5 hours)
  requiresDocumentation: boolean;
  documentationTypes?: string[];
  advanceNoticeRequired: number; // days
  approvalRequired: boolean;
  carryoverAllowed: boolean;
  cashOutAllowed: boolean;
  wellnessRelated: boolean;
  preventativeCareEligible: boolean;
}

export interface PTOBalance {
  employeeId: string;
  policyId: string;
  balances: {
    timeOffTypeId: string;
    timeOffTypeName: string;
    category: string;
    available: number; // hours
    accrued: number; // hours
    used: number; // hours
    pending: number; // hours (pending requests)
    carryover: number; // hours from previous year
    scheduled: number; // hours (approved future requests)
    forfeited: number; // hours lost due to expiration
  }[];
  lastUpdated: Date;
  nextAccrualDate?: Date;
  nextAccrualAmount?: number;
  projectedYearEnd: {
    timeOffTypeId: string;
    projectedBalance: number;
    projectedForfeiture: number;
  }[];
}

export interface PTORequest {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: 'TIME_OFF' | 'WELLNESS_APPOINTMENT' | 'PREVENTATIVE_CARE' | 'MENTAL_HEALTH' | 'FITNESS';
  timeOffTypeId: string;
  timeOffTypeName: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  partialDays?: {
    date: Date;
    startTime: string;
    endTime: string;
    hours: number;
  }[];
  reason?: string;
  medicalAppointment?: {
    appointmentType: 'PREVENTATIVE' | 'DIAGNOSTIC' | 'TREATMENT' | 'FOLLOW_UP' | 'WELLNESS';
    providerName?: string;
    specialty?: string;
    estimatedDuration: number; // hours
    confirmationNumber?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  submittedAt: Date;
  requestedBy: string;
  approvalWorkflow: {
    currentStep: number;
    totalSteps: number;
    approvals: {
      stepNumber: number;
      approverId: string;
      approverName: string;
      status: 'PENDING' | 'APPROVED' | 'DENIED';
      reviewedAt?: Date;
      comments?: string;
      delegatedTo?: string;
    }[];
  };
  documentation?: {
    documentType: string;
    fileName: string;
    uploadDate: Date;
    required: boolean;
    verified: boolean;
  }[];
  managerComments?: string;
  hrComments?: string;
  employeeComments?: string;
  autoApproved: boolean;
  conflicts?: {
    conflictType: 'BLACKOUT_PERIOD' | 'TEAM_COVERAGE' | 'MANAGER_UNAVAILABLE' | 'POLICY_VIOLATION';
    description: string;
    severity: 'INFO' | 'WARNING' | 'ERROR';
  }[];
}

export interface WellnessTimeOffTracker {
  employeeId: string;
  policyYear: number;
  preventativeCare: {
    hoursUsed: number;
    hoursRemaining: number;
    appointments: {
      appointmentDate: Date;
      appointmentType: string;
      hoursUsed: number;
      provider: string;
      preventativeValue: number; // estimated cost savings
    }[];
  };
  mentalHealthDays: {
    hoursUsed: number;
    hoursRemaining: number;
    sessionsLogged: number;
  };
  fitnessTime: {
    hoursUsed: number;
    hoursRemaining: number;
    activitiesLogged: {
      date: Date;
      activityType: string;
      duration: number;
      location?: string;
    }[];
  };
  wellnessGoals: {
    goalType: string;
    target: number;
    progress: number;
    status: 'ON_TRACK' | 'BEHIND' | 'EXCEEDED';
  }[];
  totalWellnessValue: number; // estimated ROI from wellness time off
}

export interface PTOTeamCalendar {
  departmentId: string;
  departmentName: string;
  calendarPeriod: { start: Date; end: Date };
  teamMembers: {
    employeeId: string;
    employeeName: string;
    role: string;
    timeOff: {
      date: Date;
      hours: number;
      timeOffType: string;
      status: PTORequest['status'];
      reason?: string;
    }[];
  }[];
  coverageAnalysis: {
    date: Date;
    totalTeamSize: number;
    membersOut: number;
    coveragePercentage: number;
    criticalSkillsAffected: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  blackoutPeriods: {
    name: string;
    startDate: Date;
    endDate: Date;
    affectedEmployees: number;
  }[];
  recommendations: {
    type: 'COVERAGE_GAP' | 'SCHEDULING_CONFLICT' | 'POLICY_REMINDER';
    message: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    actionRequired: boolean;
  }[];
}

export interface PTOAnalytics {
  companyId: string;
  period: { start: Date; end: Date };
  utilization: {
    overallUtilization: number; // percentage
    byTimeOffType: {
      timeOffType: string;
      hoursUsed: number;
      utilizationRate: number;
      averageRequestSize: number;
    }[];
    byDepartment: {
      departmentId: string;
      departmentName: string;
      utilizationRate: number;
      averageBalance: number;
      forfeitureRate: number;
    }[];
    wellnessTimeUsage: {
      preventativeCareHours: number;
      mentalHealthHours: number;
      fitnessHours: number;
      totalWellnessROI: number;
    };
  };
  trends: {
    monthlyUtilization: { month: string; hours: number; requests: number }[];
    seasonalPatterns: { quarter: string; peakDays: string[]; utilization: number }[];
    requestPatterns: { dayOfWeek: string; averageRequests: number }[];
  };
  approvalMetrics: {
    averageApprovalTime: number; // hours
    approvalRate: number; // percentage
    autoApprovalRate