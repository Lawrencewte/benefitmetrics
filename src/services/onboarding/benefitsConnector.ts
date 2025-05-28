import { api } from '../api';

interface BenefitsPlan {
  id: string;
  name: string;
  type: 'medical' | 'dental' | 'vision' | 'mental_health';
  provider: string;
  coverage: {
    preventativeCare: number; // percentage covered
    deductible: number;
    copay: number;
    outOfPocketMax: number;
  };
  networkProviders: string[];
  specialFeatures: string[];
}

interface EmployerBenefits {
  companyId: string;
  companyName: string;
  plans: BenefitsPlan[];
  wellnessFund: {
    annualAllowance: number;
    currentBalance: number;
    expirationDate: string;
  };
  incentivePrograms: Array<{
    id: string;
    name: string;
    description: string;
    maxReward: number;
    requirements: string[];
  }>;
  partnerDiscounts: Array<{
    partner: string;
    category: string;
    discount: string;
    description: string;
  }>;
}

interface BenefitsConnection {
  userId: string;
  employerBenefits: EmployerBenefits;
  enrolledPlans: string[];
  dependents: Array<{
    id: string;
    name: string;
    relationship: string;
    dateOfBirth: string;
    enrolledPlans: string[];
  }>;
  connectionStatus: 'connected' | 'pending' | 'error';
  lastSyncAt: string;
}

class BenefitsConnector {
  private readonly baseUrl = '/onboarding/benefits';

  // Connect to employer benefits
  async connectToEmployer(
    userId: string,
    employerInfo: {
      companyId?: string;
      companyName?: string;
      employeeId?: string;
      verificationMethod: 'email' | 'sso' | 'manual';
    }
  ): Promise<BenefitsConnection> {
    try {
      const response = await api.post(`${this.baseUrl}/connect`, {
        userId,
        ...employerInfo,
        connectionAttemptedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to connect to employer benefits:', error);
      throw error;
    }
  }

  // Verify employer connection
  async verifyEmployerConnection(
    userId: string,
    verificationCode: string
  ): Promise<BenefitsConnection> {
    try {
      const response = await api.post(`${this.baseUrl}/verify`, {
        userId,
        verificationCode,
        verifiedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to verify employer connection:', error);
      throw error;
    }
  }

  // Get available benefits for user
  async getAvailableBenefits(userId: string): Promise<EmployerBenefits | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/available`);
      return response.data;
    } catch (error) {
      console.error('Failed to get available benefits:', error);
      throw error;
    }
  }

  // Get user's current benefits connection
  async getBenefitsConnection(userId: string): Promise<BenefitsConnection | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/connection`);
      return response.data;
    } catch (error) {
      console.error('Failed to get benefits connection:', error);
      return null;
    }
  }

  // Update plan enrollment
  async updatePlanEnrollment(
    userId: string,
    enrollmentData: {
      planIds: string[];
      dependents?: Array<{
        id: string;
        planIds: string[];
      }>;
      effectiveDate: string;
    }
  ): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/${userId}/enrollment`, {
        ...enrollmentData,
        enrollmentUpdatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update plan enrollment:', error);
      throw error;
    }
  }

  // Sync benefits data
  async syncBenefitsData(userId: string): Promise<BenefitsConnection> {
    try {
      const response = await api.post(`${this.baseUrl}/${userId}/sync`, {
        syncRequestedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to sync benefits data:', error);
      throw error;
    }
  }

  // Search for employers
  async searchEmployers(searchTerm: string): Promise<Array<{
    id: string;
    name: string;
    industry: string;
    location: string;
    hasHealthBenefits: boolean;
    employeeCount: string;
  }>> {
    try {
      const response = await api.get(`${this.baseUrl}/employers/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search employers:', error);
      throw error;
    }
  }

  // Get plan details
  async getPlanDetails(planId: string): Promise<{
    plan: BenefitsPlan;
    coverageDetails: {
      services: Array<{
        service: string;
        coverage: string;
        notes?: string;
      }>;
      providerNetwork: {
        size: string;
        searchUrl?: string;
      };
      estimatedCosts: {
        preventativeCare: string;
        urgentCare: string;
        emergency: string;
        specialist: string;
      };
    };
    enrollmentDeadlines: {
      openEnrollment: string;
      lifeEvents: string[];
    };
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get plan details:', error);
      throw error;
    }
  }

  // Compare plans
  async comparePlans(planIds: string[]): Promise<{
    comparison: Array<{
      planId: string;
      planName: string;
      monthlyPremium: number;
      deductible: number;
      outOfPocketMax: number;
      preventativeCoverage: number;
      networkSize: string;
      rating: number;
      pros: string[];
      cons: string[];
    }>;
    recommendation: {
      bestOverall: string;
      bestValue: string;
      bestCoverage: string;
      reasoning: string;
    };
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/plans/compare`, {
        planIds
      });
      return response.data;
    } catch (error) {
      console.error('Failed to compare plans:', error);
      throw error;
    }
  }

  // Get benefits usage history
  async getBenefitsUsage(
    userId: string,
    timeframe?: 'year' | 'quarter' | 'month'
  ): Promise<{
    totalClaimed: number;
    totalSaved: number;
    claimsByCategory: Record<string, number>;
    utilizationRate: number;
    remainingBenefits: {
      wellnessFund: number;
      preventativeCare: number;
      otherAllowances: Record<string, number>;
    };
    upcomingExpirations: Array<{
      benefit: string;
      amount: number;
      expirationDate: string;
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/usage`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get benefits usage:', error);
      throw error;
    }
  }

  // Add dependent
  async addDependent(
    userId: string,
    dependent: {
      name: string;
      relationship: string;
      dateOfBirth: string;
      ssn?: string; // encrypted
    }
  ): Promise<string> {
    try {
      const response = await api.post(`${this.baseUrl}/${userId}/dependents`, {
        ...dependent,
        addedAt: new Date().toISOString()
      });
      return response.data.dependentId;
    } catch (error) {
      console.error('Failed to add dependent:', error);
      throw error;
    }
  }

  // Remove dependent
  async removeDependent(userId: string, dependentId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}/dependents/${dependentId}`);
    } catch (error) {
      console.error('Failed to remove dependent:', error);
      throw error;
    }
  }

  // Get benefits calendar (important dates)
  async getBenefitsCalendar(userId: string): Promise<Array<{
    date: string;
    event: string;
    type: 'deadline' | 'open_enrollment' | 'benefit_expiration' | 'reminder';
    description: string;
    actionRequired: boolean;
  }>> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/calendar`);
      return response.data;
    } catch (error) {
      console.error('Failed to get benefits calendar:', error);
      throw error;
    }
  }

  // Get personalized benefits recommendations
  async getBenefitsRecommendations(
    userId: string,
    preferences?: {
      budgetRange?: { min: number; max: number };
      priorityServices?: string[];
      riskTolerance?: 'low' | 'medium' | 'high';
      familySize?: number;
    }
  ): Promise<{
    recommendedPlans: Array<{
      planId: string;
      planName: string;
      confidence: number;
      reasoning: string;
      estimatedAnnualCost: number;
      keyBenefits: string[];
    }>;
    additionalRecommendations: Array<{
      type: 'hsa' | 'fsa' | 'supplemental' | 'wellness';
      recommendation: string;
      potentialSavings: number;
    }>;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/${userId}/recommendations`, {
        preferences
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get benefits recommendations:', error);
      throw error;
    }
  }

  // Disconnect from employer
  async disconnectFromEmployer(
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${userId}/disconnect`, {
        reason,
        disconnectedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to disconnect from employer:', error);
      throw error;
    }
  }

  // Submit benefits question/issue
  async submitBenefitsIssue(
    userId: string,
    issue: {
      category: 'enrollment' | 'claims' | 'coverage' | 'billing' | 'other';
      subject: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      attachments?: string[];
    }
  ): Promise<string> {
    try {
      const response = await api.post(`${this.baseUrl}/${userId}/issues`, {
        ...issue,
        submittedAt: new Date().toISOString()
      });
      return response.data.ticketId;
    } catch (error) {
      console.error('Failed to submit benefits issue:', error);
      throw error;
    }
  }
}

export const benefitsConnector = new BenefitsConnector();