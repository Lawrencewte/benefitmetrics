import { api } from '../../api';
import { auditLogService } from '../../security/auditLogService';
import { encryptionService } from '../../security/encryptionService';

export interface Claim {
  id: string;
  claimNumber: string;
  memberId: string;
  providerId: string;
  serviceDate: Date;
  submissionDate: Date;
  status: ClaimStatus;
  claimType: ClaimType;
  serviceDescription: string;
  diagnosis: DiagnosisInfo;
  charges: ClaimCharges;
  coverage: CoverageInfo;
  adjustments: ClaimAdjustment[];
  payments: ClaimPayment[];
  lastUpdated: Date;
}

export interface ClaimStatus {
  code: 'SUBMITTED' | 'PROCESSING' | 'APPROVED' | 'DENIED' | 'PENDING_INFO' | 'PAID' | 'APPEALED';
  description: string;
  statusDate: Date;
  reasonCodes?: string[];
  nextAction?: string;
}

export interface ClaimType {
  category: 'PREVENTATIVE' | 'DIAGNOSTIC' | 'TREATMENT' | 'EMERGENCY' | 'WELLNESS';
  serviceType: string;
  preventativeIndicator: boolean;
  eligibleForWellness: boolean;
}

export interface DiagnosisInfo {
  primaryDiagnosis: {
    code: string; // ICD-10
    description: string;
  };
  secondaryDiagnoses?: {
    code: string;
    description: string;
  }[];
  procedureCodes: {
    code: string; // CPT
    description: string;
    preventativeFlag: boolean;
  }[];
}

export interface ClaimCharges {
  totalCharges: number;
  allowedAmount: number;
  deductibleAmount: number;
  coinsuranceAmount: number;
  copayAmount: number;
  memberResponsibility: number;
  planPayment: number;
}

export interface CoverageInfo {
  planName: string;
  coverageLevel: 'INDIVIDUAL' | 'FAMILY';
  benefitCategory: string;
  preventativeCoverage: boolean;
  networkStatus: 'IN_NETWORK' | 'OUT_OF_NETWORK';
  priorAuthRequired: boolean;
  priorAuthStatus?: 'APPROVED' | 'DENIED' | 'PENDING';
}

export interface ClaimAdjustment {
  adjustmentCode: string;
  description: string;
  amount: number;
  reason: string;
  adjustmentDate: Date;
}

export interface ClaimPayment {
  paymentId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  checkNumber?: string;
  eraNumber?: string;
}

export interface ClaimSubmissionRequest {
  memberId: string;
  providerId: string;
  serviceDate: Date;
  diagnosis: DiagnosisInfo;
  charges: {
    totalCharges: number;
    serviceDetails: {
      cptCode: string;
      description: string;
      units: number;
      unitPrice: number;
    }[];
  };
  attachments?: {
    type: string;
    fileName: string;
    content: string; // base64 encoded
  }[];
  priorAuthNumber?: string;
  referralNumber?: string;
}

export interface ClaimSearchCriteria {
  memberId?: string;
  providerId?: string;
  claimNumber?: string;
  serviceDate?: { start: Date; end: Date };
  submissionDate?: { start: Date; end: Date };
  status?: ClaimStatus['code'][];
  claimType?: ClaimType['category'][];
  preventativeOnly?: boolean;
  amountRange?: { min: number; max: number };
}

export interface ClaimAnalytics {
  totalClaims: number;
  totalCharges: number;
  totalPaid: number;
  averageProcessingTime: number; // days
  approvalRate: number;
  denialReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  preventativeClaimsStats: {
    count: number;
    totalValue: number;
    utilizationRate: number;
  };
  costSavings: {
    preventativeCare: number;
    earlyDetection: number;
    avoidedComplications: number;
  };
}

export interface PreventativeClaimTracking {
  memberId: string;
  completedServices: {
    serviceType: string;
    completionDate: Date;
    provider: string;
    claimAmount: number;
    preventativeValue: number;
  }[];
  upcomingServices: {
    serviceType: string;
    dueDate: Date;
    estimatedCost: number;
    coveragePercentage: number;
  }[];
  annualProgress: {
    servicesCompleted: number;
    totalRecommended: number;
    utilizationRate: number;
    costSavings: number;
  };
}

class ClaimsProcessorService {
  private readonly baseUrl = '/api/integrations/insurance/claims';

  async submitClaim(
    claimData: ClaimSubmissionRequest,
    insuranceProviderId: string
  ): Promise<{
    claimId: string;
    claimNumber: string;
    confirmationNumber: string;
    estimatedProcessingTime: number;
  }> {
    try {
      // Encrypt sensitive health information
      const encryptedClaimData = await encryptionService.encryptPHI(claimData);

      await auditLogService.logAccess({
        userId: claimData.memberId,
        action: 'SUBMIT_INSURANCE_CLAIM',
        resourceType: 'INSURANCE_CLAIM',
        resourceId: 'new_claim',
        metadata: {
          insuranceProviderId,
          serviceDate: claimData.serviceDate,
          totalCharges: claimData.charges.totalCharges
        }
      });

      const response = await api.post(`${this.baseUrl}/submit`, {
        insuranceProviderId,
        claimData: encryptedClaimData
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw new Error('Failed to submit insurance claim');
    }
  }

  async getClaimStatus(
    claimId: string,
    memberId: string
  ): Promise<Claim> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VIEW_CLAIM_STATUS',
        resourceType: 'INSURANCE_CLAIM',
        resourceId: claimId
      });

      const response = await api.get(`${this.baseUrl}/${claimId}/status`, {
        params: { memberId }
      });

      // Decrypt sensitive information
      return await encryptionService.decryptPHI(response.data);
    } catch (error) {
      console.error('Error fetching claim status:', error);
      throw new Error('Failed to retrieve claim status');
    }
  }

  async searchClaims(
    criteria: ClaimSearchCriteria,
    memberId: string,
    pagination?: { page: number; limit: number }
  ): Promise<{
    claims: Claim[];
    totalCount: number;
    pageInfo: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'SEARCH_CLAIMS',
        resourceType: 'INSURANCE_CLAIMS',
        resourceId: 'search',
        metadata: { criteria, pagination }
      });

      const response = await api.post(`${this.baseUrl}/search`, {
        criteria,
        memberId,
        pagination
      });

      // Decrypt sensitive information in claims
      const decryptedClaims = await Promise.all(
        response.data.claims.map((claim: any) => 
          encryptionService.decryptPHI(claim)
        )
      );

      return {
        ...response.data,
        claims: decryptedClaims
      };
    } catch (error) {
      console.error('Error searching claims:', error);
      throw new Error('Failed to search claims');
    }
  }

  async getPreventativeClaimTracking(
    memberId: string,
    year?: number
  ): Promise<PreventativeClaimTracking> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VIEW_PREVENTATIVE_CLAIM_TRACKING',
        resourceType: 'PREVENTATIVE_CLAIMS',
        resourceId: memberId,
        metadata: { year }
      });

      const response = await api.get(`${this.baseUrl}/preventative-tracking`, {
        params: { memberId, year }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching preventative claim tracking:', error);
      throw new Error('Failed to retrieve preventative claim tracking');
    }
  }

  async getClaimAnalytics(
    criteria: {
      memberId?: string;
      dateRange: { start: Date; end: Date };
      includePreventative?: boolean;
    }
  ): Promise<ClaimAnalytics> {
    try {
      await auditLogService.logAccess({
        userId: criteria.memberId || 'system',
        action: 'VIEW_CLAIM_ANALYTICS',
        resourceType: 'CLAIM_ANALYTICS',
        resourceId: criteria.memberId || 'aggregate',
        metadata: { dateRange: criteria.dateRange }
      });

      const response = await api.post(`${this.baseUrl}/analytics`, criteria);

      return response.data;
    } catch (error) {
      console.error('Error fetching claim analytics:', error);
      throw new Error('Failed to retrieve claim analytics');
    }
  }

  async validateClaim(
    claimData: ClaimSubmissionRequest
  ): Promise<{
    isValid: boolean;
    errors: {
      field: string;
      message: string;
      severity: 'error' | 'warning';
    }[];
    estimatedPayment: {
      allowedAmount: number;
      memberResponsibility: number;
      planPayment: number;
      deductibleRemaining: number;
    };
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/validate`, claimData);

      return response.data;
    } catch (error) {
      console.error('Error validating claim:', error);
      throw new Error('Failed to validate claim');
    }
  }

  async checkEligibility(
    memberId: string,
    serviceDate: Date,
    procedureCodes: string[]
  ): Promise<{
    eligible: boolean;
    coverageDetails: {
      procedureCode: string;
      covered: boolean;
      coveragePercentage: number;
      deductibleApplies: boolean;
      priorAuthRequired: boolean;
      copayAmount?: number;
      coinsurancePercentage?: number;
    }[];
    memberBenefits: {
      deductibleRemaining: number;
      outOfPocketRemaining: number;
      preventativeBenefitsUsed: number;
      preventativeBenefitsRemaining: number;
    };
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'CHECK_ELIGIBILITY',
        resourceType: 'MEMBER_ELIGIBILITY',
        resourceId: memberId,
        metadata: { serviceDate, procedureCodes }
      });

      const response = await api.post(`${this.baseUrl}/eligibility`, {
        memberId,
        serviceDate,
        procedureCodes
      });

      return response.data;
    } catch (error) {
      console.error('Error checking eligibility:', error);
      throw new Error('Failed to check eligibility');
    }
  }

  async getPriorAuthorizationStatus(
    authorizationNumber: string,
    memberId: string
  ): Promise<{
    status: 'APPROVED' | 'DENIED' | 'PENDING' | 'EXPIRED';
    approvedServices: string[];
    expirationDate?: Date;
    limitations?: string[];
    denialReason?: string;
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'CHECK_PRIOR_AUTHORIZATION',
        resourceType: 'PRIOR_AUTHORIZATION',
        resourceId: authorizationNumber,
        metadata: { memberId }
      });

      const response = await api.get(`${this.baseUrl}/prior-auth/${authorizationNumber}`, {
        params: { memberId }
      });

      return response.data;
    } catch (error) {
      console.error('Error checking prior authorization:', error);
      throw new Error('Failed to check prior authorization status');
    }
  }

  async requestPriorAuthorization(
    request: {
      memberId: string;
      providerId: string;
      procedureCodes: string[];
      diagnosis: string;
      serviceDate: Date;
      urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
      clinicalJustification: string;
    }
  ): Promise<{
    authorizationNumber: string;
    status: 'SUBMITTED' | 'AUTO_APPROVED' | 'REQUIRES_REVIEW';
    estimatedDecisionDate: Date;
    reviewReferenceNumber?: string;
  }> {
    try {
      // Encrypt sensitive medical information
      const encryptedRequest = await encryptionService.encryptPHI(request);

      await auditLogService.logAccess({
        userId: request.memberId,
        action: 'REQUEST_PRIOR_AUTHORIZATION',
        resourceType: 'PRIOR_AUTHORIZATION',
        resourceId: 'new_request',
        metadata: {
          providerId: request.providerId,
          procedureCodes: request.procedureCodes,
          urgency: request.urgency
        }
      });

      const response = await api.post(`${this.baseUrl}/prior-auth/request`, {
        encryptedRequest
      });

      return response.data;
    } catch (error) {
      console.error('Error requesting prior authorization:', error);
      throw new Error('Failed to request prior authorization');
    }
  }

  async getClaimRemittance(
    claimId: string,
    memberId: string
  ): Promise<{
    eraNumber: string;
    checkNumber?: string;
    paymentDate: Date;
    totalPayment: number;
    adjustments: ClaimAdjustment[];
    remittanceAdvice: string; // PDF URL or content
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VIEW_CLAIM_REMITTANCE',
        resourceType: 'CLAIM_REMITTANCE',
        resourceId: claimId,
        metadata: { memberId }
      });

      const response = await api.get(`${this.baseUrl}/${claimId}/remittance`, {
        params: { memberId }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching claim remittance:', error);
      throw new Error('Failed to retrieve claim remittance');
    }
  }

  async appealClaim(
    claimId: string,
    appealData: {
      memberId: string;
      appealReason: string;
      additionalDocumentation?: {
        type: string;
        fileName: string;
        content: string; // base64 encoded
      }[];
      urgentAppeal: boolean;
      contactInformation: {
        phone: string;
        email: string;
        preferredContact: 'phone' | 'email' | 'mail';
      };
    }
  ): Promise<{
    appealId: string;
    appealNumber: string;
    submissionDate: Date;
    estimatedDecisionDate: Date;
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED';
  }> {
    try {
      // Encrypt sensitive appeal information
      const encryptedAppealData = await encryptionService.encryptPHI(appealData);

      await auditLogService.logAccess({
        userId: appealData.memberId,
        action: 'SUBMIT_CLAIM_APPEAL',
        resourceType: 'CLAIM_APPEAL',
        resourceId: claimId,
        metadata: {
          urgentAppeal: appealData.urgentAppeal,
          hasDocumentation: !!appealData.additionalDocumentation?.length
        }
      });

      const response = await api.post(`${this.baseUrl}/${claimId}/appeal`, {
        encryptedAppealData
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting claim appeal:', error);
      throw new Error('Failed to submit claim appeal');
    }
  }

  async getPreventativeServicesBenefits(
    memberId: string,
    planYear?: number
  ): Promise<{
    planYear: number;
    preventativeServices: {
      serviceType: string;
      description: string;
      frequency: string;
      ageRange: string;
      genderSpecific?: 'M' | 'F';
      covered: boolean;
      costSharing: number; // percentage
      annualLimit?: number;
      utilizationStatus: {
        completed: boolean;
        completionDate?: Date;
        remainingBenefits: number;
      };
    }[];
    totalPreventativeBenefit: number;
    utilizedAmount: number;
    remainingBenefit: number;
    recommendedServices: string[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VIEW_PREVENTATIVE_BENEFITS',
        resourceType: 'PREVENTATIVE_BENEFITS',
        resourceId: memberId,
        metadata: { planYear }
      });

      const response = await api.get(`${this.baseUrl}/preventative-benefits`, {
        params: { memberId, planYear }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching preventative services benefits:', error);
      throw new Error('Failed to retrieve preventative services benefits');
    }
  }

  async estimateClaimCost(
    memberId: string,
    procedureCodes: string[],
    providerId: string,
    serviceDate: Date
  ): Promise<{
    estimatedCharges: number;
    estimatedAllowedAmount: number;
    estimatedMemberCost: {
      deductible: number;
      copay: number;
      coinsurance: number;
      total: number;
    };
    estimatedPlanPayment: number;
    costVariance: {
      min: number;
      max: number;
      factors: string[];
    };
    alternativeProviders?: {
      providerId: string;
      providerName: string;
      estimatedCost: number;
      distance: number;
    }[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'ESTIMATE_CLAIM_COST',
        resourceType: 'COST_ESTIMATE',
        resourceId: memberId,
        metadata: { procedureCodes, providerId, serviceDate }
      });

      const response = await api.post(`${this.baseUrl}/estimate-cost`, {
        memberId,
        procedureCodes,
        providerId,
        serviceDate
      });

      return response.data;
    } catch (error) {
      console.error('Error estimating claim cost:', error);
      throw new Error('Failed to estimate claim cost');
    }
  }

  async getClaimHistory(
    memberId: string,
    timeframe: { start: Date; end: Date },
    includeFamily: boolean = false
  ): Promise<{
    totalClaims: number;
    totalCharges: number;
    totalPaid: number;
    memberPaid: number;
    claimsByCategory: {
      category: string;
      count: number;
      totalCost: number;
      preventativePercentage: number;
    }[];
    monthlyTrends: {
      month: string;
      claimsCount: number;
      totalCost: number;
      preventativeCost: number;
    }[];
    topProviders: {
      providerId: string;
      providerName: string;
      visitCount: number;
      totalCost: number;
    }[];
    healthMetrics: {
      preventativeCareUtilization: number;
      earlyDetectionValue: number;
      chronicCareManagement: number;
    };
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VIEW_CLAIM_HISTORY',
        resourceType: 'CLAIM_HISTORY',
        resourceId: memberId,
        metadata: { timeframe, includeFamily }
      });

      const response = await api.get(`${this.baseUrl}/history`, {
        params: {
          memberId,
          startDate: timeframe.start.toISOString(),
          endDate: timeframe.end.toISOString(),
          includeFamily
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching claim history:', error);
      throw new Error('Failed to retrieve claim history');
    }
  }

  async synchronizeWithEmployerBenefits(
    memberId: string,
    employerId: string
  ): Promise<{
    syncStatus: 'SUCCESS' | 'PARTIAL' | 'FAILED';
    lastSyncDate: Date;
    updatedBenefits: string[];
    discrepancies: {
      field: string;
      insuranceValue: any;
      employerValue: any;
      resolved: boolean;
    }[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'SYNC_EMPLOYER_BENEFITS',
        resourceType: 'BENEFITS_SYNC',
        resourceId: memberId,
        metadata: { employerId }
      });

      const response = await api.post(`${this.baseUrl}/sync-benefits`, {
        memberId,
        employerId
      });

      return response.data;
    } catch (error) {
      console.error('Error synchronizing employer benefits:', error);
      throw new Error('Failed to synchronize employer benefits');
    }
  }
}

export const claimsProcessorService = new ClaimsProcessorService();