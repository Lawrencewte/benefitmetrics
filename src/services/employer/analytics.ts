import { api } from '../api';

export interface EmployeeHealthMetrics {
  totalEmployees: number;
  activeParticipants: number;
  participationRate: number;
  averageHealthScore: number;
  preventiveCareCompletion: {
    annualPhysical: number;
    dentalCleaning: number;
    eyeExam: number;
    skinCheck: number;
    mammogram?: number;
    colonoscopy?: number;
  };
  departmentBreakdown: {
    department: string;
    employeeCount: number;
    participationRate: number;
    averageHealthScore: number;
    topRiskFactors: string[];
  }[];
  riskCategories: {
    lowRisk: number;
    moderateRisk: number;
    highRisk: number;
  };
  trendsOverTime: {
    month: string;
    participationRate: number;
    averageHealthScore: number;
    preventiveCareCompletion: number;
  }[];
}

export interface BenefitsUtilization {
  totalBenefitsValue: number;
  utilizedValue: number;
  utilizationRate: number;
  potentialSavings: number;
  expiringSoon: {
    benefitType: string;
    value: number;
    expirationDate: string;
    affectedEmployees: number;
  }[];
  underutilizedServices: {
    service: string;
    utilizationRate: number;
    potentialValue: number;
    recommendedActions: string[];
  }[];
  departmentUtilization: {
    department: string;
    utilizationRate: number;
    totalValue: number;
    utilizedValue: number;
  }[];
}

export interface ROIAnalysis {
  totalProgramCost: number;
  healthcareCostSavings: number;
  productivityGains: number;
  absenteeismReduction: number;
  totalROI: number;
  roiPercentage: number;
  breakdown: {
    category: string;
    cost: number;
    savings: number;
    netBenefit: number;
  }[];
  projectedAnnualSavings: number;
  paybackPeriod: number; // months
  comparison: {
    industryAverage: number;
    companyPerformance: number;
  };
}

export interface ComplianceMetrics {
  hipaaComplianceScore: number;
  dataSecurityIncidents: number;
  auditFindings: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    finding: string;
    status: 'open' | 'in-progress' | 'resolved';
    dateFound: string;
    dueDate: string;
  }[];
  employeeConsentStatus: {
    totalEmployees: number;
    consentGiven: number;
    consentPending: number;
    consentDenied: number;
  };
  dataAccessLogs: {
    totalAccesses: number;
    unauthorizedAttempts: number;
    suspiciousActivity: number;
  };
}

export interface CustomReportRequest {
  name: string;
  description: string;
  filters: {
    departments?: string[];
    dateRange: {
      start: string;
      end: string;
    };
    metrics: string[];
    aggregationType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
  deliverySchedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

export interface BenchmarkData {
  industryType: string;
  companySize: string;
  metrics: {
    participationRate: {
      industry: number;
      company: number;
      percentile: number;
    };
    healthcareCostReduction: {
      industry: number;
      company: number;
      percentile: number;
    };
    preventiveCareCompletion: {
      industry: number;
      company: number;
      percentile: number;
    };
    employeeSatisfaction: {
      industry: number;
      company: number;
      percentile: number;
    };
    roi: {
      industry: number;
      company: number;
      percentile: number;
    };
  };
}

class AnalyticsService {
  async getEmployeeHealthMetrics(companyId: string, filters?: {
    departments?: string[];
    dateRange?: { start: string; end: string };
  }): Promise<EmployeeHealthMetrics> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/health-metrics`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee health metrics:', error);
      throw error;
    }
  }

  async getBenefitsUtilization(companyId: string, year?: number): Promise<BenefitsUtilization> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/benefits-utilization`, {
        params: { year }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits utilization:', error);
      throw error;
    }
  }

  async getROIAnalysis(companyId: string, timeframe: 'ytd' | '12months' | 'custom', customRange?: {
    start: string;
    end: string;
  }): Promise<ROIAnalysis> {
    try {
      const params = timeframe === 'custom' ? { timeframe, ...customRange } : { timeframe };
      const response = await api.get(`/employer/${companyId}/analytics/roi`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching ROI analysis:', error);
      throw error;
    }
  }

  async getComplianceMetrics(companyId: string): Promise<ComplianceMetrics> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/compliance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance metrics:', error);
      throw error;
    }
  }

  async getDepartmentComparison(companyId: string, metric: 'participation' | 'health-score' | 'benefits-utilization'): Promise<{
    departments: {
      name: string;
      value: number;
      trend: 'up' | 'down' | 'stable';
      comparison: 'above-average' | 'average' | 'below-average';
    }[];
    companyAverage: number;
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/departments`, {
        params: { metric }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching department comparison:', error);
      throw error;
    }
  }

  async getParticipationTrends(companyId: string, period: 'last-30-days' | 'last-90-days' | 'last-year'): Promise<{
    timeline: {
      date: string;
      newSignups: number;
      activeUsers: number;
      completedActions: number;
      engagementScore: number;
    }[];
    summary: {
      totalGrowth: number;
      averageEngagement: number;
      peakParticipationDate: string;
    };
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/participation-trends`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching participation trends:', error);
      throw error;
    }
  }

  async getCostSavingsBreakdown(companyId: string): Promise<{
    categories: {
      category: string;
      currentYearSavings: number;
      previousYearSavings: number;
      projectedSavings: number;
      breakdown: {
        item: string;
        savings: number;
        employeesImpacted: number;
      }[];
    }[];
    totalSavings: number;
    savingsPerEmployee: number;
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/cost-savings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cost savings breakdown:', error);
      throw error;
    }
  }

  async getBenchmarkData(companyId: string): Promise<BenchmarkData> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/benchmarks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benchmark data:', error);
      throw error;
    }
  }

  async generateCustomReport(companyId: string, reportRequest: CustomReportRequest): Promise<{
    reportId: string;
    status: 'generating' | 'ready' | 'failed';
    estimatedCompletionTime: string;
    downloadUrl?: string;
  }> {
    try {
      const response = await api.post(`/employer/${companyId}/analytics/custom-report`, reportRequest);
      return response.data;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  }

  async getCustomReportStatus(companyId: string, reportId: string): Promise<{
    status: 'generating' | 'ready' | 'failed';
    progress: number;
    downloadUrl?: string;
    error?: string;
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/custom-report/${reportId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching custom report status:', error);
      throw error;
    }
  }

  async getHealthRiskAssessment(companyId: string): Promise<{
    overallRiskScore: number;
    riskCategories: {
      category: string;
      riskLevel: 'low' | 'medium' | 'high';
      affectedEmployees: number;
      recommendedActions: string[];
    }[];
    riskTrends: {
      month: string;
      riskScore: number;
      newRisks: number;
      mitigatedRisks: number;
    }[];
    interventionOpportunities: {
      intervention: string;
      potentialImpact: number;
      estimatedCost: number;
      roi: number;
    }[];
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/health-risk-assessment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health risk assessment:', error);
      throw error;
    }
  }

  async getWellnessProgramEffectiveness(companyId: string, programId?: string): Promise<{
    programs: {
      id: string;
      name: string;
      participationRate: number;
      completionRate: number;
      satisfactionScore: number;
      healthImpact: number;
      costPerParticipant: number;
      roi: number;
    }[];
    recommendations: {
      program: string;
      recommendation: string;
      expectedImpact: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  }> {
    try {
      const params = programId ? { programId } : {};
      const response = await api.get(`/employer/${companyId}/analytics/wellness-effectiveness`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching wellness program effectiveness:', error);
      throw error;
    }
  }

  async exportData(companyId: string, dataType: 'health-metrics' | 'benefits-utilization' | 'roi-analysis', format: 'csv' | 'xlsx' | 'pdf'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    try {
      const response = await api.post(`/employer/${companyId}/analytics/export`, {
        dataType,
        format
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async scheduleReport(companyId: string, reportConfig: {
    reportType: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    format: 'pdf' | 'excel';
    includeCharts: boolean;
  }): Promise<{
    scheduleId: string;
    nextDelivery: string;
  }> {
    try {
      const response = await api.post(`/employer/${companyId}/analytics/schedule-report`, reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  }

  async getRealtimeMetrics(companyId: string): Promise<{
    activeUsers: number;
    appointmentsToday: number;
    newSignupsToday: number;
    completedActionsToday: number;
    systemHealth: 'healthy' | 'warning' | 'error';
    lastUpdated: string;
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/analytics/realtime`);
      return response.data;
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();