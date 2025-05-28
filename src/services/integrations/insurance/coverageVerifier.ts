import { apiClient, ApiResponse } from '../../api';

interface Coverage {
  memberId: string;
  groupNumber: string;
  planName: string;
  planType: 'HMO' | 'PPO' | 'EPO' | 'POS' | 'HDHP';
  effectiveDate: string;
  terminationDate?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscriber: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    relationship: 'self' | 'spouse' | 'child' | 'other';
  };
  benefits: BenefitDetail[];
  copays: CopayDetail[];
  deductibles: DeductibleDetail[];
  outOfPocketMax: number;
}

interface BenefitDetail {
  category: 'preventative' | 'primary_care' | 'specialist' | 'emergency' | 'hospital' | 'prescription' | 'mental_health';
  covered: boolean;
  coveragePercentage: number;
  limitationType?: 'annual' | 'lifetime' | 'per_incident';
  limitationAmount?: number;
  priorAuthRequired: boolean;
  networkRestriction: 'in_network_only' | 'out_of_network_reduced' | 'no_restriction';
}

interface CopayDetail {
  serviceType: string;
  inNetwork: number;
  outOfNetwork: number;
  currency: string;
}

interface DeductibleDetail {
  type: 'individual' | 'family';
  amount: number;
  met: number;
  remaining: number;
  appliesTo: string[];
}

interface EligibilityRequest {
  memberId: string;
  serviceType: string;
  providerId?: string;
  serviceDate: string;
  diagnosisCodes?: string[];
  procedureCodes?: string[];
}

interface EligibilityResponse {
  eligible: boolean;
  coverage: Coverage;
  benefits: BenefitDetail[];
  estimatedCost: {
    memberResponsibility: number;
    planPayment: number;
    copay: number;
    deductible: number;
    coinsurance: number;
  };
  priorAuthRequired: boolean;
  limitations: string[];
  warnings: string[];
}

class CoverageVerifier {
  private baseEndpoint = '/integrations/insurance/coverage';

  // Real-time eligibility verification
  async verifyEligibility(request: EligibilityRequest): Promise<ApiResponse<EligibilityResponse>> {
    return apiClient.post(`${this.baseEndpoint}/verify`, request);
  }

  async batchVerifyEligibility(requests: EligibilityRequest[]): Promise<ApiResponse<{
    results: (EligibilityResponse & { requestId: string })[];
    failed: { requestId: string; error: string }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/batch-verify`, { requests });
  }

  // Coverage lookup
  async getCoverage(memberId: string, carrierCode?: string): Promise<ApiResponse<Coverage>> {
    const params = new URLSearchParams({ memberId });
    if (carrierCode) params.append('carrier', carrierCode);
    return apiClient.get(`${this.baseEndpoint}/lookup?${params}`);
  }

  async getCoverageHistory(memberId: string, months = 12): Promise<ApiResponse<Coverage[]>> {
    return apiClient.get(`${this.baseEndpoint}/history/${memberId}?months=${months}`);
  }

  // Prior authorization
  async checkPriorAuth(memberId: string, procedureCode: string, providerId?: string): Promise<ApiResponse<{
    required: boolean;
    status?: 'approved' | 'pending' | 'denied' | 'not_submitted';
    authNumber?: string;
    expirationDate?: string;
    requirements: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/prior-auth/check`, {
      memberId,
      procedureCode,
      providerId
    });
  }

  async submitPriorAuthRequest(request: {
    memberId: string;
    procedureCode: string;
    providerId: string;
    serviceDate: string;
    medicalNecessity: string;
    supportingDocuments?: string[];
  }): Promise<ApiResponse<{
    authRequestId: string;
    status: 'submitted' | 'pending_review';
    estimatedDecisionDate: string;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/prior-auth/submit`, request);
  }

  async getPriorAuthStatus(authRequestId: string): Promise<ApiResponse<{
    status: 'pending' | 'approved' | 'denied' | 'more_info_needed';
    authNumber?: string;
    approvedServices: string[];
    denialReason?: string;
    appealDeadline?: string;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/prior-auth/${authRequestId}/status`);
  }

  // Cost estimation
  async estimateCost(request: {
    memberId: string;
    serviceType: string;
    procedureCodes: string[];
    providerId?: string;
    facilityId?: string;
    serviceDate: string;
  }): Promise<ApiResponse<{
    totalEstimate: number;
    memberResponsibility: number;
    breakdown: {
      service: string;
      billAmount: number;
      allowedAmount: number;
      memberPays: number;
      planPays: number;
      deductibleApplied: number;
      copayApplied: number;
    }[];
    confidence: 'high' | 'medium' | 'low';
    factors: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/cost-estimate`, request);
  }

  // Provider network verification
  async verifyProviderNetwork(providerId: string, memberId: string): Promise<ApiResponse<{
    inNetwork: boolean;
    networkTier: 'tier1' | 'tier2' | 'tier3' | 'out_of_network';
    effectiveDate: string;
    terminationDate?: string;
    specialties: string[];
    acceptingNewPatients: boolean;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/provider-network/${providerId}?memberId=${memberId}`);
  }

  async findNetworkProviders(request: {
    memberId: string;
    specialty?: string;
    location?: { lat: number; lng: number; radius: number };
    acceptingPatients?: boolean;
    limit?: number;
  }): Promise<ApiResponse<{
    providers: {
      id: string;
      name: string;
      specialty: string;
      location: { address: string; lat: number; lng: number };
      networkTier: string;
      distance?: number;
      acceptingPatients: boolean;
      phoneNumber: string;
    }[];
    total: number;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/provider-search`, request);
  }

  // Prescription coverage
  async verifyRxCoverage(memberId: string, ndc: string): Promise<ApiResponse<{
    covered: boolean;
    formularyTier: number;
    copay: number;
    priorAuthRequired: boolean;
    quantityLimits: { limit: number; period: string };
    alternatives: { ndc: string; name: string; tier: number; copay: number }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/prescription/${ndc}?memberId=${memberId}`);
  }

  // Claims and utilization
  async getUtilizationSummary(memberId: string, year: number): Promise<ApiResponse<{
    deductibleStatus: { individual: number; family: number; remaining: number };
    outOfPocketStatus: { spent: number; remaining: number };
    recentClaims: {
      serviceDate: string;
      provider: string;
      serviceType: string;
      billedAmount: number;
      paidAmount: number;
      memberPaid: number;
      status: string;
    }[];
    preventativeCareUsed: {
      service: string;
      used: boolean;
      date?: string;
      remaining: number;
    }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/utilization/${memberId}?year=${year}`);
  }

  // Plan comparison
  async comparePlans(memberInfo: { age: number; zipCode: string; familySize: number }): Promise<ApiResponse<{
    plans: {
      planId: string;
      name: string;
      type: string;
      monthlyPremium: number;
      deductible: number;
      outOfPocketMax: number;
      primaryCareCopay: number;
      specialistCopay: number;
      networkSize: number;
      rating: number;
      benefits: string[];
    }[];
    recommendations: {
      bestOverall: string;
      lowestCost: string;
      bestCoverage: string;
      reasoning: string;
    };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/plan-comparison`, memberInfo);
  }

  // Integration management
  async addInsuranceCarrier(config: {
    carrierName: string;
    carrierCode: string;
    apiEndpoint: string;
    credentials: Record<string, string>;
    supportedServices: string[];
  }): Promise<ApiResponse<{ carrierId: string; status: string }>> {
    return apiClient.post(`${this.baseEndpoint}/carriers`, config);
  }

  async testCarrierConnection(carrierId: string): Promise<ApiResponse<{
    connected: boolean;
    responseTime: number;
    supportedOperations: string[];
    errors?: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/carriers/${carrierId}/test`);
  }

  async getCarrierStatus(): Promise<ApiResponse<{
    carriers: {
      id: string;
      name: string;
      status: 'active' | 'inactive' | 'error';
      lastSync: string;
      errorCount: number;
    }[];
    overall: { connected: number; total: number; healthScore: number };
  }>> {
    return apiClient.get(`${this.baseEndpoint}/carriers/status`);
  }

  // Caching and performance
  async cacheCoverage(memberId: string, ttl = 3600): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/cache`, { memberId, ttl });
  }

  async invalidateCache(memberId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/cache/${memberId}`);
  }

  // Error handling and retries
  async retryFailedVerifications(): Promise<ApiResponse<{
    retried: number;
    successful: number;
    stillFailing: { memberId: string; error: string }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/retry-failed`);
  }
}

// Helper utilities
export const CoverageHelpers = {
  formatMemberId: (id: string): string => id.replace(/\D/g, ''),
  
  validateMemberId: (id: string): boolean => /^\d{8,12}$/.test(id.replace(/\D/g, '')),
  
  calculateMemberCost: (
    billedAmount: number,
    allowedAmount: number,
    deductibleMet: number,
    deductibleAmount: number,
    coinsuranceRate: number,
    copay: number
  ): { memberPays: number; planPays: number; breakdown: any } => {
    const actualAmount = Math.min(billedAmount, allowedAmount);
    const deductibleRemaining = Math.max(0, deductibleAmount - deductibleMet);
    const deductibleApplied = Math.min(actualAmount, deductibleRemaining);
    const afterDeductible = actualAmount - deductibleApplied;
    const coinsuranceAmount = afterDeductible * coinsuranceRate;
    const memberPays = deductibleApplied + coinsuranceAmount + copay;
    const planPays = actualAmount - memberPays;
    
    return {
      memberPays: Math.max(0, memberPays),
      planPays: Math.max(0, planPays),
      breakdown: {
        deductible: deductibleApplied,
        coinsurance: coinsuranceAmount,
        copay: copay
      }
    };
  },
  
  determineCoverageLevel: (benefits: BenefitDetail[], serviceType: string): {
    covered: boolean;
    percentage: number;
    priorAuth: boolean;
  } => {
    const benefit = benefits.find(b => b.category === serviceType);
    return {
      covered: benefit?.covered || false,
      percentage: benefit?.coveragePercentage || 0,
      priorAuth: benefit?.priorAuthRequired || false
    };
  },
  
  isPreventativeCare: (procedureCode: string): boolean => {
    // Common preventative care procedure codes
    const preventativeCodes = [
      '99381', '99382', '99383', '99384', '99385', '99386', '99387', // Annual exams
      '99391', '99392', '99393', '99394', '99395', '99396', '99397', // Periodic exams
      '76092', '77067', // Mammograms
      '45378', '45380', '45385', // Colonoscopies
      '99401', '99402', '99403', '99404' // Counseling services
    ];
    return preventativeCodes.includes(procedureCode);
  },
  
  formatCurrency: (amount: number): string => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
};

export const coverageVerifier = new CoverageVerifier();
export default coverageVerifier;