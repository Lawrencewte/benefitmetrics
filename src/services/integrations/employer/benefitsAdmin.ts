import { api } from '../../api';
import { auditLogService } from '../../security/auditLogService';
import { encryptionService } from '../../security/encryptionService';

export interface BenefitsPlan {
  id: string;
  planName: string;
  planType: 'HEALTH' | 'DENTAL' | 'VISION' | 'WELLNESS' | 'HSA' | 'FSA' | 'LIFE' | 'DISABILITY';
  category: 'MEDICAL' | 'DENTAL' | 'VISION' | 'WELLNESS' | 'FINANCIAL' | 'INSURANCE';
  carrier: {
    name: string;
    carrierId: string;
    contactInfo: {
      phone: string;
      email: string;
      website: string;
    };
  };
  coverage: {
    coverageLevel: 'INDIVIDUAL' | 'EMPLOYEE_SPOUSE' | 'EMPLOYEE_CHILDREN' | 'FAMILY';
    networkType: 'HMO' | 'PPO' | 'EPO' | 'POS' | 'HDHP';
    deductible: {
      individual: number;
      family: number;
      networkTier?: 'IN_NETWORK' | 'OUT_OF_NETWORK';
    };
    outOfPocketMax: {
      individual: number;
      family: number;
    };
    copays: {
      primaryCare: number;
      specialistCare: number;
      urgentCare: number;
      emergencyRoom: number;
    };
    coinsurance: {
      inNetwork: number; // percentage
      outOfNetwork: number; // percentage
    };
    preventativeCare: {
      covered: boolean;
      copay: number;
      coinsurance: number;
      annualLimit?: number;
    };
  };
  premium: {
    employee: number; // monthly
    employer: number; // monthly
    total: number; // monthly
    payrollDeductionFrequency: 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';
  };
  eligibility: {
    waitingPeriod: number; // days
    minimumHours?: number; // per week
    employeeTypes: ('FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY')[];
    dependentAgeLimit: number;
    domesticPartnerCoverage: boolean;
  };
  enrollment: {
    openEnrollmentStart: Date;
    openEnrollmentEnd: Date;
    effectiveDate: Date;
    planYear: number;
    autoEnroll: boolean;
    requiredDocumentation: string[];
  };
  wellness: {
    incentiveEligible: boolean;
    biometricScreening: boolean;
    healthAssessment: boolean;
    smokingCessation: boolean;
    fitnessReimbursement: number; // annual
    preventativeCareCredit: number; // annual
  };
  compliance: {
    acaCompliant: boolean;
    cobraEligible: boolean;
    hipaaCompliant: boolean;
    erisa: boolean;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeBenefitElection {
  id: string;
  employeeId: string;
  planId: string;
  planYear: number;
  coverageLevel: BenefitsPlan['coverage']['coverageLevel'];
  enrollmentDate: Date;
  effectiveDate: Date;
  status: 'ACTIVE' | 'TERMINATED' | 'PENDING' | 'DECLINED';
  premium: {
    employeeContribution: number;
    employerContribution: number;
    total: number;
  };
  dependents: {
    dependentId: string;
    relationship: 'SPOUSE' | 'CHILD' | 'DOMESTIC_PARTNER';
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    ssn?: string; // encrypted
    gender?: 'M' | 'F';
    studentStatus?: boolean;
    disabled?: boolean;
  }[];
  beneficiaries: {
    beneficiaryId: string;
    relationship: string;
    firstName: string;
    lastName: string;
    percentage: number;
    contingent: boolean;
    address?: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
    };
  }[];
  qualifyingEvent?: {
    eventType: string;
    eventDate: Date;
    description: string;
    documentation: string[];
  };
  waiverInfo?: {
    reason: string;
    alternativeCoverage: string;
    signatureDate: Date;
  };
}

export interface BenefitsEnrollment {
  id: string;
  employeeId: string;
  planYear: number;
  enrollmentPeriod: {
    type: 'OPEN_ENROLLMENT' | 'NEW_HIRE' | 'QUALIFYING_EVENT';
    startDate: Date;
    endDate: Date;
  };
  status: 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED' | 'PENDING_APPROVAL' | 'DECLINED';
  elections: EmployeeBenefitElection[];
  totalPremium: {
    employee: number;
    employer: number;
    annual: number;
  };
  documents: {
    documentType: string;
    fileName: string;
    uploadDate: Date;
    required: boolean;
    verified: boolean;
  }[];
  confirmation: {
    confirmationNumber: string;
    submissionDate: Date;
    reviewDeadline: Date;
    approved: boolean;
    approvedBy?: string;
    approvedDate?: Date;
  };
  changeRequests: {
    changeId: string;
    changeType: 'ADD_DEPENDENT' | 'REMOVE_DEPENDENT' | 'CHANGE_COVERAGE' | 'CHANGE_PLAN';
    requestDate: Date;
    effectiveDate: Date;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
    reason: string;
  }[];
}

export interface BenefitsUtilization {
  employeeId: string;
  planYear: number;
  utilization: {
    planId: string;
    planType: string;
    claims: {
      totalClaims: number;
      totalAmount: number;
      employeePaid: number;
      planPaid: number;
    };
    preventativeCare: {
      servicesUsed: number;
      totalValue: number;
      remainingBenefits: string[];
    };
    deductible: {
      applied: number;
      remaining: number;
      metDate?: Date;
    };
    outOfPocket: {
      spent: number;
      remaining: number;
      maxMetDate?: Date;
    };
    hsaContributions?: {
      employee: number;
      employer: number;
      total: number;
      remainingContribution: number;
    };
    fsaContributions?: {
      election: number;
      used: number;
      remaining: number;
      forfeited: number;
    };
  }[];
  wellnessParticipation: {
    biometricScreening: boolean;
    healthAssessment: boolean;
    incentivesEarned: number;
    programsCompleted: string[];
  };
  costSavings: {
    preventativeCareValue: number;
    earlyDetectionSavings: number;
    wellnessIncentives: number;
    totalSavings: number;
  };
}

export interface BenefitsConfiguration {
  companyId: string;
  planYear: number;
  configuration: {
    openEnrollment: {
      startDate: Date;
      endDate: Date;
      newHireEnrollmentDays: number;
      qualifyingEventDays: number;
    };
    eligibility: {
      waitingPeriodDays: number;
      minimumHoursPerWeek: number;
      eligibleEmployeeTypes: string[];
      partTimeEligible: boolean;
    };
    coverage: {
      dependentAgeLimit: number;
      domesticPartnerCoverage: boolean;
      cobraAvailable: boolean;
      retireeHealth: boolean;
    };
    wellness: {
      programRequired: boolean;
      biometricScreeningRequired: boolean;
      healthAssessmentRequired: boolean;
      incentiveStructure: {
        maxIncentive: number;
        incentiveTypes: ('PREMIUM_DISCOUNT' | 'HSA_CONTRIBUTION' | 'CASH' | 'PTO' | 'GIFT_CARD')[];
        smokingPenalty: number;
        spouseRequirements: boolean;
      };
    };
    compliance: {
      acaReporting: boolean;
      cobraAdministration: boolean;
      hipaaCompliance: boolean;
      stateRequirements: string[];
    };
    communication: {
      enrollmentReminders: boolean;
      deadlineNotifications: boolean;
      benefitsEducation: boolean;
      multilanguageSupport: string[];
    };
  };
  adminContacts: {
    benefitsAdministrator: {
      name: string;
      email: string;
      phone: string;
    };
    broker: {
      company: string;
      contactName: string;
      email: string;
      phone: string;
    };
    carriers: {
      carrierId: string;
      contactName: string;
      email: string;
      phone: string;
    }[];
  };
}

export interface BenefitsAnalytics {
  companyId: string;
  planYear: number;
  period: { start: Date; end: Date };
  enrollment: {
    totalEligible: number;
    totalEnrolled: number;
    enrollmentRate: number;
    byPlan: {
      planId: string;
      planName: string;
      enrolled: number;
      declined: number;
      participation: number;
    }[];
    byDemographic: {
      ageGroup: string;
      enrollmentRate: number;
      averagePremium: number;
    }[];
  };
  utilization: {
    overallUtilization: number;
    preventativeCareRate: number;
    claimsFrequency: number;
    averageClaimAmount: number;
    highCostClaimers: number;
    chronicConditionManagement: number;
  };
  costs: {
    totalPremiums: number;
    employerContribution: number;
    employeeContribution: number;
    claimsCosts: number;
    administrativeCosts: number;
    stopLossPremiums: number;
  };
  wellness: {
    programParticipation: number;
    biometricParticipation: number;
    healthAssessmentCompletion: number;
    incentivesDistributed: number;
    riskReduction: number;
  };
  trends: {
    enrollmentTrend: { period: string; rate: number }[];
    costTrend: { period: string; cost: number }[];
    utilizationTrend: { period: string; rate: number }[];
  };
  benchmarks: {
    industryAverages: {
      enrollmentRate: number;
      utilizationRate: number;
      costPerEmployee: number;
    };
    companyRanking: {
      enrollmentPercentile: number;
      costPercentile: number;
      satisfactionPercentile: number;
    };
  };
}

class BenefitsAdminService {
  private readonly baseUrl = '/api/integrations/employer/benefits';

  async createBenefitsPlan(
    companyId: string,
    planData: Omit<BenefitsPlan, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ planId: string; success: boolean }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'CREATE_BENEFITS_PLAN',
        resourceType: 'BENEFITS_PLAN',
        resourceId: 'new_plan',
        metadata: { 
          companyId,
          planType: planData.planType,
          planName: planData.planName
        }
      });

      const response = await api.post(`${this.baseUrl}/plans`, {
        companyId,
        planData
      });

      return response.data;
    } catch (error) {
      console.error('Error creating benefits plan:', error);
      throw new Error('Failed to create benefits plan');
    }
  }

  async updateBenefitsPlan(
    planId: string,
    companyId: string,
    updates: Partial<BenefitsPlan>
  ): Promise<{ success: boolean; effectiveDate: Date }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'UPDATE_BENEFITS_PLAN',
        resourceType: 'BENEFITS_PLAN',
        resourceId: planId,
        metadata: { companyId, updates: Object.keys(updates) }
      });

      const response = await api.put(`${this.baseUrl}/plans/${planId}`, {
        companyId,
        updates
      });

      return response.data;
    } catch (error) {
      console.error('Error updating benefits plan:', error);
      throw new Error('Failed to update benefits plan');
    }
  }

  async getBenefitsPlans(
    companyId: string,
    filters?: {
      planYear?: number;
      planTypes?: BenefitsPlan['planType'][];
      active?: boolean;
      carrierId?: string;
    }
  ): Promise<BenefitsPlan[]> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_BENEFITS_PLANS',
        resourceType: 'BENEFITS_PLANS',
        resourceId: companyId,
        metadata: { filters }
      });

      const response = await api.get(`${this.baseUrl}/plans`, {
        params: { companyId, ...filters }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching benefits plans:', error);
      throw new Error('Failed to retrieve benefits plans');
    }
  }

  async enrollEmployee(
    employeeId: string,
    enrollmentData: {
      elections: Omit<EmployeeBenefitElection, 'id' | 'employeeId'>[];
      enrollmentType: 'NEW_HIRE' | 'OPEN_ENROLLMENT' | 'QUALIFYING_EVENT';
      qualifyingEvent?: EmployeeBenefitElection['qualifyingEvent'];
      dependents?: EmployeeBenefitElection['dependents'];
    }
  ): Promise<{
    enrollmentId: string;
    confirmationNumber: string;
    effectiveDate: Date;
    totalPremium: number;
  }> {
    try {
      // Encrypt sensitive dependent information
      const encryptedDependents = enrollmentData.dependents ? 
        await Promise.all(
          enrollmentData.dependents.map(async (dependent) => ({
            ...dependent,
            ssn: dependent.ssn ? await encryptionService.encrypt(dependent.ssn) : undefined
          }))
        ) : undefined;

      await auditLogService.logAccess({
        userId: employeeId,
        action: 'ENROLL_BENEFITS',
        resourceType: 'BENEFITS_ENROLLMENT',
        resourceId: employeeId,
        metadata: { 
          enrollmentType: enrollmentData.enrollmentType,
          electionsCount: enrollmentData.elections.length,
          dependentsCount: enrollmentData.dependents?.length || 0
        }
      });

      const response = await api.post(`${this.baseUrl}/enrollment`, {
        employeeId,
        ...enrollmentData,
        dependents: encryptedDependents
      });

      return response.data;
    } catch (error) {
      console.error('Error enrolling employee in benefits:', error);
      throw new Error('Failed to enroll employee in benefits');
    }
  }

  async getEmployeeEnrollment(
    employeeId: string,
    planYear?: number
  ): Promise<BenefitsEnrollment | null> {
    try {
      await auditLogService.logAccess({
        userId: employeeId,
        action: 'VIEW_BENEFITS_ENROLLMENT',
        resourceType: 'BENEFITS_ENROLLMENT',
        resourceId: employeeId,
        metadata: { planYear }
      });

      const response = await api.get(`${this.baseUrl}/enrollment/${employeeId}`, {
        params: { planYear }
      });

      // Decrypt sensitive dependent information
      if (response.data?.elections) {
        for (const election of response.data.elections) {
          if (election.dependents) {
            for (const dependent of election.dependents) {
              if (dependent.ssn) {
                dependent.ssn = await encryptionService.decrypt(dependent.ssn);
              }
            }
          }
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching employee enrollment:', error);
      throw new Error('Failed to retrieve employee benefits enrollment');
    }
  }

  async processQualifyingEvent(
    employeeId: string,
    qualifyingEvent: {
      eventType: 'MARRIAGE' | 'DIVORCE' | 'BIRTH' | 'ADOPTION' | 'DEATH' | 'LOSS_OF_COVERAGE' | 'JOB_CHANGE';
      eventDate: Date;
      description: string;
      requestedChanges: {
        action: 'ADD_DEPENDENT' | 'REMOVE_DEPENDENT' | 'CHANGE_COVERAGE' | 'CHANGE_PLAN' | 'TERMINATE';
        planId?: string;
        coverageLevel?: string;
        dependentInfo?: any;
        effectiveDate: Date;
      }[];
      documentation: {
        documentType: string;
        fileName: string;
        content: string; // base64 encoded
      }[];
    }
  ): Promise<{
    eventId: string;
    enrollmentDeadline: Date;
    eligibleChanges: string[];
    requiredDocumentation: string[];
    preApproved: boolean;
  }> {
    try {
      await auditLogService.logAccess({
        userId: employeeId,
        action: 'PROCESS_QUALIFYING_EVENT',
        resourceType: 'QUALIFYING_EVENT',
        resourceId: employeeId,
        metadata: { 
          eventType: qualifyingEvent.eventType,
          changesRequested: qualifyingEvent.requestedChanges.length
        }
      });

      const response = await api.post(`${this.baseUrl}/qualifying-event`, {
        employeeId,
        qualifyingEvent
      });

      return response.data;
    } catch (error) {
      console.error('Error processing qualifying event:', error);
      throw new Error('Failed to process qualifying event');
    }
  }

  async getBenefitsUtilization(
    employeeId: string,
    planYear?: number
  ): Promise<BenefitsUtilization> {
    try {
      await auditLogService.logAccess({
        userId: employeeId,
        action: 'VIEW_BENEFITS_UTILIZATION',
        resourceType: 'BENEFITS_UTILIZATION',
        resourceId: employeeId,
        metadata: { planYear }
      });

      const response = await api.get(`${this.baseUrl}/utilization/${employeeId}`, {
        params: { planYear }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching benefits utilization:', error);
      throw new Error('Failed to retrieve benefits utilization');
    }
  }

  async updateBenefitsConfiguration(
    companyId: string,
    configuration: Partial<BenefitsConfiguration['configuration']>
  ): Promise<{ success: boolean; effectiveDate: Date }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'UPDATE_BENEFITS_CONFIGURATION',
        resourceType: 'BENEFITS_CONFIGURATION',
        resourceId: companyId,
        metadata: { updates: Object.keys(configuration) }
      });

      const response = await api.put(`${this.baseUrl}/configuration/${companyId}`, {
        configuration
      });

      return response.data;
    } catch (error) {
      console.error('Error updating benefits configuration:', error);
      throw new Error('Failed to update benefits configuration');
    }
  }

  async getBenefitsConfiguration(
    companyId: string
  ): Promise<BenefitsConfiguration> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_BENEFITS_CONFIGURATION',
        resourceType: 'BENEFITS_CONFIGURATION',
        resourceId: companyId
      });

      const response = await api.get(`${this.baseUrl}/configuration/${companyId}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching benefits configuration:', error);
      throw new Error('Failed to retrieve benefits configuration');
    }
  }

  async generateBenefitsAnalytics(
    companyId: string,
    period: { start: Date; end: Date },
    planYear?: number
  ): Promise<BenefitsAnalytics> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'GENERATE_BENEFITS_ANALYTICS',
        resourceType: 'BENEFITS_ANALYTICS',
        resourceId: companyId,
        metadata: { period, planYear }
      });

      const response = await api.post(`${this.baseUrl}/analytics`, {
        companyId,
        period,
        planYear
      });

      return response.data;
    } catch (error) {
      console.error('Error generating benefits analytics:', error);
      throw new Error('Failed to generate benefits analytics');
    }
  }

  async validateEnrollmentEligibility(
    employeeId: string,
    planId: string,
    coverageLevel: string,
    dependents?: { relationship: string; dateOfBirth: Date }[]
  ): Promise<{
    eligible: boolean;
    eligibilityDate?: Date;
    restrictions: string[];
    warnings: string[];
    estimatedPremium: {
      employee: number;
      employer: number;
      total: number;
    };
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/validate-eligibility`, {
        employeeId,
        planId,
        coverageLevel,
        dependents
      });

      return response.data;
    } catch (error) {
      console.error('Error validating enrollment eligibility:', error);
      throw new Error('Failed to validate enrollment eligibility');
    }
  }

  async generateCOBRANotices(
    companyId: string,
    terminatedEmployees: {
      employeeId: string;
      terminationDate: Date;
      terminationReason: string;
      lastWorkDate: Date;
      benefitsEndDate: Date;
    }[]
  ): Promise<{
    noticesGenerated: number;
    notices: {
      employeeId: string;
      noticeType: string;
      generatedDate: Date;
      mailingDate: Date;
      deliveryMethod: 'MAIL' | 'EMAIL' | 'ELECTRONIC';
    }[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'GENERATE_COBRA_NOTICES',
        resourceType: 'COBRA_NOTICES',
        resourceId: companyId,
        metadata: { employeeCount: terminatedEmployees.length }
      });

      const response = await api.post(`${this.baseUrl}/cobra/notices`, {
        companyId,
        terminatedEmployees
      });

      return response.data;
    } catch (error) {
      console.error('Error generating COBRA notices:', error);
      throw new Error('Failed to generate COBRA notices');
    }
  }

  async processCOBRAElection(
    employeeId: string,
    electionData: {
      electionDate: Date;
      coverageElections: {
        planId: string;
        elected: boolean;
        coverageLevel: string;
        effectiveDate: Date;
      }[];
      paymentMethod: 'CHECK' | 'ACH' | 'CREDIT_CARD';
      firstPaymentAmount: number;
      monthlyPremium: number;
    }
  ): Promise<{
    electionId: string;
    confirmationNumber: string;
    paymentDueDate: Date;
    coverageEffectiveDate: Date;
  }> {
    try {
      await auditLogService.logAccess({
        userId: employeeId,
        action: 'PROCESS_COBRA_ELECTION',
        resourceType: 'COBRA_ELECTION',
        resourceId: employeeId,
        metadata: { 
          electionsCount: electionData.coverageElections.length,
          monthlyPremium: electionData.monthlyPremium
        }
      });

      const response = await api.post(`${this.baseUrl}/cobra/election`, {
        employeeId,
        electionData
      });

      return response.data;
    } catch (error) {
      console.error('Error processing COBRA election:', error);
      throw new Error('Failed to process COBRA election');
    }
  }

  async generateBenefitsStatements(
    companyId: string,
    planYear: number,
    employeeIds?: string[]
  ): Promise<{
    statementsGenerated: number;
    statements: {
      employeeId: string;
      statementUrl: string;
      expiresAt: Date;
    }[];
    deliveryStatus: 'PENDING' | 'DELIVERED' | 'FAILED';
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'GENERATE_BENEFITS_STATEMENTS',
        resourceType: 'BENEFITS_STATEMENTS',
        resourceId: companyId,
        metadata: { 
          planYear,
          employeeCount: employeeIds?.length || 'ALL'
        }
      });

      const response = await api.post(`${this.baseUrl}/statements`, {
        companyId,
        planYear,
        employeeIds
      });

      return response.data;
    } catch (error) {
      console.error('Error generating benefits statements:', error);
      throw new Error('Failed to generate benefits statements');
    }
  }

  async syncWithPayroll(
    companyId: string,
    payrollPeriod: { start: Date; end: Date },
    options?: {
      includeNewHires?: boolean;
      includeTerminations?: boolean;
      validateDeductions?: boolean;
    }
  ): Promise<{
    syncId: string;
    employeesProcessed: number;
    deductionsCalculated: number;
    discrepancies: {
      employeeId: string;
      issue: string;
      expectedAmount: number;
      actualAmount: number;
    }[];
    totalDeductions: number;
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'SYNC_BENEFITS_PAYROLL',
        resourceType: 'PAYROLL_SYNC',
        resourceId: companyId,
        metadata: { payrollPeriod, options }
      });

      const response = await api.post(`${this.baseUrl}/payroll-sync`, {
        companyId,
        payrollPeriod,
        options
      });

      return response.data;
    } catch (error) {
      console.error('Error syncing with payroll:', error);
      throw new Error('Failed to sync benefits with payroll');
    }
  }

  async getOpenEnrollmentStatus(
    companyId: string,
    planYear: number
  ): Promise<{
    enrollmentPeriod: {
      startDate: Date;
      endDate: Date;
      daysRemaining: number;
    };
    participation: {
      totalEligible: number;
      enrolled: number;
      pending: number;
      declined: number;
      notStarted: number;
      participationRate: number;
    };
    remindersSent: number;
    commonIssues: string[];
    enrollmentTrends: {
      date: Date;
      enrollments: number;
      cumulative: number;
    }[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_OPEN_ENROLLMENT_STATUS',
        resourceType: 'OPEN_ENROLLMENT',
        resourceId: companyId,
        metadata: { planYear }
      });

      const response = await api.get(`${this.baseUrl}/open-enrollment/${companyId}`, {
        params: { planYear }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching open enrollment status:', error);
      throw new Error('Failed to retrieve open enrollment status');
    }
  }
}

export const benefitsAdminService = new BenefitsAdminService();