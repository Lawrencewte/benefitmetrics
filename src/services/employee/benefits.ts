import { api } from '../api';

export interface BenefitsPlan {
  id: string;
  name: string;
  type: 'medical' | 'dental' | 'vision' | 'wellness';
  provider: string;
  planYear: string;
  coverage: {
    preventiveCare: number; // percentage covered
    annualPhysical: number;
    dentalCleaning: number;
    visionExam: number;
    specialistVisit: number;
  };
  deductible: {
    individual: number;
    family: number;
    remaining: number;
  };
  outOfPocketMax: {
    individual: number;
    family: number;
    remaining: number;
  };
  hsaContribution?: {
    employerAnnual: number;
    employeeMaxAnnual: number;
    currentBalance: number;
  };
  wellnessBenefits: {
    annualAllowance: number;
    usedAmount: number;
    availableAmount: number;
    eligibleServices: string[];
  };
}

export interface BenefitsUsage {
  id: string;
  planId: string;
  serviceType: string;
  serviceDate: string;
  provider: string;
  claimAmount: number;
  coveredAmount: number;
  deductibleApplied: number;
  copayAmount: number;
  status: 'processed' | 'pending' | 'denied';
  preventiveCare: boolean;
}

export interface BenefitsOptimization {
  unusedBenefits: {
    service: string;
    value: number;
    expirationDate: string;
    recommendation: string;
  }[];
  potentialSavings: {
    category: string;
    amount: number;
    action: string;
  }[];
  yearEndReminders: {
    service: string;
    deadline: string;
    estimatedValue: number;
  }[];
}

export interface PartnerDiscount {
  id: string;
  partnerName: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'healthcare' | 'mental-health';
  discountType: 'percentage' | 'fixed-amount' | 'free-service';
  discountValue: number;
  description: string;
  redemptionCode?: string;
  websiteUrl?: string;
  expirationDate: string;
  termsAndConditions: string;
  usageLimit?: number;
  timesUsed: number;
}

class BenefitsService {
  async getBenefitsPlans(userId: string): Promise<BenefitsPlan[]> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits plans:', error);
      throw error;
    }
  }

  async getBenefitsPlan(userId: string, planId: string): Promise<BenefitsPlan> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits plan:', error);
      throw error;
    }
  }

  async getBenefitsUsage(userId: string, year?: number): Promise<BenefitsUsage[]> {
    try {
      const params = year ? { year } : {};
      const response = await api.get(`/employee/${userId}/benefits/usage`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits usage:', error);
      throw error;
    }
  }

  async getPreventiveCareUsage(userId: string): Promise<BenefitsUsage[]> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/usage/preventive`);
      return response.data;
    } catch (error) {
      console.error('Error fetching preventive care usage:', error);
      throw error;
    }
  }

  async getBenefitsOptimization(userId: string): Promise<BenefitsOptimization> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/optimization`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits optimization:', error);
      throw error;
    }
  }

  async getPartnerDiscounts(userId: string): Promise<PartnerDiscount[]> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/discounts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partner discounts:', error);
      throw error;
    }
  }

  async usePartnerDiscount(userId: string, discountId: string): Promise<{ success: boolean; redemptionCode?: string }> {
    try {
      const response = await api.post(`/employee/${userId}/benefits/discounts/${discountId}/use`);
      return response.data;
    } catch (error) {
      console.error('Error using partner discount:', error);
      throw error;
    }
  }

  async calculatePotentialSavings(userId: string, serviceTypes: string[]): Promise<{
    totalSavings: number;
    breakdown: { service: string; savings: number }[];
  }> {
    try {
      const response = await api.post(`/employee/${userId}/benefits/calculate-savings`, {
        serviceTypes
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating potential savings:', error);
      throw error;
    }
  }

  async verifyBenefitsCoverage(userId: string, serviceType: string, providerId?: string): Promise<{
    covered: boolean;
    coveragePercentage: number;
    estimatedCost: number;
    deductibleApplies: boolean;
    copayAmount: number;
    preAuthRequired: boolean;
  }> {
    try {
      const response = await api.post(`/employee/${userId}/benefits/verify-coverage`, {
        serviceType,
        providerId
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying benefits coverage:', error);
      throw error;
    }
  }

  async getBenefitsCard(userId: string): Promise<{
    memberNumber: string;
    groupNumber: string;
    planName: string;
    providerPhone: string;
    emergencyPhone: string;
  }> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/card`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits card info:', error);
      throw error;
    }
  }

  async requestReimbursement(userId: string, reimbursementData: {
    serviceType: string;
    serviceDate: string;
    provider: string;
    amount: number;
    receipt: File;
    description: string;
  }): Promise<{ submissionId: string; estimatedProcessingTime: string }> {
    try {
      const formData = new FormData();
      formData.append('serviceType', reimbursementData.serviceType);
      formData.append('serviceDate', reimbursementData.serviceDate);
      formData.append('provider', reimbursementData.provider);
      formData.append('amount', reimbursementData.amount.toString());
      formData.append('receipt', reimbursementData.receipt);
      formData.append('description', reimbursementData.description);

      const response = await api.post(`/employee/${userId}/benefits/reimbursement`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting reimbursement request:', error);
      throw error;
    }
  }

  async getReimbursementStatus(userId: string, submissionId: string): Promise<{
    status: 'pending' | 'approved' | 'denied' | 'paid';
    submittedDate: string;
    processedDate?: string;
    amount: number;
    denialReason?: string;
    paymentMethod?: string;
  }> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/reimbursement/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reimbursement status:', error);
      throw error;
    }
  }

  async getHSATransactions(userId: string, limit: number = 50): Promise<{
    currentBalance: number;
    transactions: {
      id: string;
      date: string;
      type: 'contribution' | 'withdrawal' | 'payment';
      amount: number;
      description: string;
      remainingBalance: number;
    }[];
  }> {
    try {
      const response = await api.get(`/employee/${userId}/benefits/hsa/transactions`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching HSA transactions:', error);
      throw error;
    }
  }

  async updateBenefitsPreferences(userId: string, preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminderFrequency: 'weekly' | 'monthly' | 'quarterly';
    autoOptimization: boolean;
  }): Promise<{ success: boolean }> {
    try {
      const response = await api.put(`/employee/${userId}/benefits/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating benefits preferences:', error);
      throw error;
    }
  }

  async getBenefitsEducationContent(category?: string): Promise<{
    articles: {
      id: string;
      title: string;
      summary: string;
      category: string;
      readTime: number;
      lastUpdated: string;
    }[];
    videos: {
      id: string;
      title: string;
      duration: number;
      category: string;
      thumbnailUrl: string;
    }[];
    guides: {
      id: string;
      title: string;
      description: string;
      category: string;
      downloadUrl: string;
    }[];
  }> {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/benefits/education', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits education content:', error);
      throw error;
    }
  }
}

export const benefitsService = new BenefitsService();