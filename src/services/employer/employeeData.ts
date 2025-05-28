import { anonymizationUtils } from '../../utils/anonymization';
import { api } from '../api';
import { auditLogService } from '../security/auditLogService';
import { dataMinimizationService } from '../security/dataMinimization';

export interface EmployeeHealthMetrics {
  id: string;
  departmentId: string;
  healthScore: number;
  preventativeCareCompletion: number;
  lastUpdated: Date;
  riskFactors: string[];
  engagementLevel: 'low' | 'medium' | 'high';
}

export interface DepartmentAnalytics {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  averageHealthScore: number;
  preventativeCareRate: number;
  absenteeismRate: number;
  engagementRate: number;
  costSavings: number;
  trends: {
    healthScoreChange: number;
    preventativeCareChange: number;
    period: string;
  };
}

export interface CompanyHealthMetrics {
  totalEmployees: number;
  overallHealthScore: number;
  preventativeCareCompletion: number;
  totalCostSavings: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  topHealthChallenges: string[];
  departmentComparison: DepartmentAnalytics[];
}

export interface EmployeeEngagementMetrics {
  appUsage: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionTime: number;
  };
  featureAdoption: {
    healthScoreViews: number;
    appointmentScheduling: number;
    challengeParticipation: number;
    educationalContentViews: number;
  };
  communicationEffectiveness: {
    notificationOpenRate: number;
    reminderResponseRate: number;
    campaignEngagement: number;
  };
}

export interface UtilizationAnalytics {
  benefitsUsage: {
    preventativeCareUtilization: number;
    coverageMaximization: number;
    unusedBenefitsValue: number;
  };
  programParticipation: {
    wellnessChallenges: number;
    healthScreenings: number;
    educationalPrograms: number;
  };
  costAnalysis: {
    totalProgramCost: number;
    costPerEmployee: number;
    roiPercentage: number;
    projectedSavings: number;
  };
}

export interface EmployeeDataFilters {
  departmentIds?: string[];
  healthScoreRange?: { min: number; max: number };
  engagementLevel?: ('low' | 'medium' | 'high')[];
  riskLevel?: ('low' | 'medium' | 'high')[];
  dateRange?: { start: Date; end: Date };
  includeInactive?: boolean;
}

export interface BenchmarkData {
  industryAverages: {
    healthScore: number;
    preventativeCareRate: number;
    absenteeismRate: number;
    costPerEmployee: number;
  };
  companyRanking: {
    healthScore: number; // percentile
    preventativeCareRate: number; // percentile
    engagement: number; // percentile
  };
  improvement: {
    topOpportunities: string[];
    recommendedActions: string[];
    potentialSavings: number;
  };
}

class EmployeeDataService {
  private readonly baseUrl = '/api/employer/employee-data';

  async getAggregatedHealthMetrics(
    companyId: string,
    filters?: EmployeeDataFilters
  ): Promise<CompanyHealthMetrics> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_AGGREGATED_HEALTH_METRICS',
        resourceType: 'COMPANY_HEALTH_DATA',
        resourceId: companyId,
        metadata: { filters }
      });

      const response = await api.post(`${this.baseUrl}/health-metrics`, {
        companyId,
        filters: dataMinimizationService.minimizeFilters(filters)
      });

      // Ensure all data is properly anonymized
      return anonymizationUtils.anonymizeCompanyMetrics(response.data);
    } catch (error) {
      console.error('Error fetching aggregated health metrics:', error);
      throw new Error('Failed to retrieve company health metrics');
    }
  }

  async getDepartmentAnalytics(
    companyId: string,
    departmentId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<DepartmentAnalytics[]> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_DEPARTMENT_ANALYTICS',
        resourceType: 'DEPARTMENT_DATA',
        resourceId: departmentId || 'ALL_DEPARTMENTS',
        metadata: { companyId, dateRange }
      });

      const response = await api.get(`${this.baseUrl}/departments`, {
        params: {
          companyId,
          departmentId,
          startDate: dateRange?.start?.toISOString(),
          endDate: dateRange?.end?.toISOString()
        }
      });

      return response.data.map((dept: any) => 
        anonymizationUtils.anonymizeDepartmentData(dept)
      );
    } catch (error) {
      console.error('Error fetching department analytics:', error);
      throw new Error('Failed to retrieve department analytics');
    }
  }

  async getEmployeeEngagementMetrics(
    companyId: string,
    timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<EmployeeEngagementMetrics> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_ENGAGEMENT_METRICS',
        resourceType: 'ENGAGEMENT_DATA',
        resourceId: companyId,
        metadata: { timeframe }
      });

      const response = await api.get(`${this.baseUrl}/engagement`, {
        params: { companyId, timeframe }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      throw new Error('Failed to retrieve engagement metrics');
    }
  }

  async getUtilizationAnalytics(
    companyId: string,
    period: { start: Date; end: Date }
  ): Promise<UtilizationAnalytics> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_UTILIZATION_ANALYTICS',
        resourceType: 'UTILIZATION_DATA',
        resourceId: companyId,
        metadata: { period }
      });

      const response = await api.get(`${this.baseUrl}/utilization`, {
        params: {
          companyId,
          startDate: period.start.toISOString(),
          endDate: period.end.toISOString()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching utilization analytics:', error);
      throw new Error('Failed to retrieve utilization analytics');
    }
  }

  async getIndustryBenchmarks(
    companyId: string,
    industry: string,
    companySize: 'small' | 'medium' | 'large'
  ): Promise<BenchmarkData> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_INDUSTRY_BENCHMARKS',
        resourceType: 'BENCHMARK_DATA',
        resourceId: companyId,
        metadata: { industry, companySize }
      });

      const response = await api.get(`${this.baseUrl}/benchmarks`, {
        params: { companyId, industry, companySize }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching industry benchmarks:', error);
      throw new Error('Failed to retrieve industry benchmarks');
    }
  }

  async generateHealthTrendsReport(
    companyId: string,
    timeframe: { start: Date; end: Date },
    reportType: 'executive' | 'detailed' | 'departmental'
  ): Promise<{
    reportId: string;
    downloadUrl: string;
    expiresAt: Date;
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'GENERATE_HEALTH_TRENDS_REPORT',
        resourceType: 'HEALTH_REPORT',
        resourceId: companyId,
        metadata: { timeframe, reportType }
      });

      const response = await api.post(`${this.baseUrl}/reports/health-trends`, {
        companyId,
        timeframe,
        reportType,
        includeAnonymizedData: true
      });

      return response.data;
    } catch (error) {
      console.error('Error generating health trends report:', error);
      throw new Error('Failed to generate health trends report');
    }
  }

  async getROIAnalysis(
    companyId: string,
    period: { start: Date; end: Date }
  ): Promise<{
    totalInvestment: number;
    totalSavings: number;
    roiPercentage: number;
    savingsBreakdown: {
      preventativeCare: number;
      reducedAbsenteeism: number;
      improvedProductivity: number;
      reducedTurnover: number;
    };
    projectedAnnualSavings: number;
    paybackPeriod: number; // months
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_ROI_ANALYSIS',
        resourceType: 'ROI_DATA',
        resourceId: companyId,
        metadata: { period }
      });

      const response = await api.get(`${this.baseUrl}/roi-analysis`, {
        params: {
          companyId,
          startDate: period.start.toISOString(),
          endDate: period.end.toISOString()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching ROI analysis:', error);
      throw new Error('Failed to retrieve ROI analysis');
    }
  }

  async getComplianceMetrics(
    companyId: string
  ): Promise<{
    overallComplianceRate: number;
    complianceByCategory: {
      preventativeCare: number;
      healthScreenings: number;
      wellness: number;
      safety: number;
    };
    riskAreas: string[];
    improvementOpportunities: {
      category: string;
      currentRate: number;
      targetRate: number;
      potentialImpact: string;
    }[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_COMPLIANCE_METRICS',
        resourceType: 'COMPLIANCE_DATA',
        resourceId: companyId
      });

      const response = await api.get(`${this.baseUrl}/compliance`, {
        params: { companyId }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching compliance metrics:', error);
      throw new Error('Failed to retrieve compliance metrics');
    }
  }

  async getHealthRiskAnalysis(
    companyId: string,
    filters?: EmployeeDataFilters
  ): Promise<{
    riskDistribution: {
      lowRisk: number;
      moderateRisk: number;
      highRisk: number;
    };
    topRiskFactors: {
      factor: string;
      prevalence: number;
      estimatedCost: number;
    }[];
    interventionOpportunities: {
      riskFactor: string;
      affectedCount: number;
      recommendedIntervention: string;
      potentialSavings: number;
    }[];
    predictiveInsights: {
      trend: 'improving' | 'stable' | 'declining';
      projectedCosts: number;
      preventableConditions: string[];
    };
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_HEALTH_RISK_ANALYSIS',
        resourceType: 'RISK_ANALYSIS_DATA',
        resourceId: companyId,
        metadata: { filters }
      });

      const response = await api.post(`${this.baseUrl}/risk-analysis`, {
        companyId,
        filters: dataMinimizationService.minimizeFilters(filters)
      });

      return anonymizationUtils.anonymizeRiskAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching health risk analysis:', error);
      throw new Error('Failed to retrieve health risk analysis');
    }
  }

  async exportEmployeeData(
    companyId: string,
    format: 'csv' | 'excel' | 'pdf',
    dataType: 'summary' | 'detailed' | 'trends',
    filters?: EmployeeDataFilters
  ): Promise<{
    downloadUrl: string;
    expiresAt: Date;
    fileName: string;
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'EXPORT_EMPLOYEE_DATA',
        resourceType: 'DATA_EXPORT',
        resourceId: companyId,
        metadata: { format, dataType, filters }
      });

      const response = await api.post(`${this.baseUrl}/export`, {
        companyId,
        format,
        dataType,
        filters: dataMinimizationService.minimizeFilters(filters),
        anonymized: true
      });

      return response.data;
    } catch (error) {
      console.error('Error exporting employee data:', error);
      throw new Error('Failed to export employee data');
    }
  }

  async scheduleAutomatedReport(
    companyId: string,
    reportConfig: {
      type: 'health-metrics' | 'engagement' | 'utilization' | 'roi';
      frequency: 'weekly' | 'monthly' | 'quarterly';
      recipients: string[];
      format: 'email' | 'dashboard' | 'download';
      includeComparisons: boolean;
    }
  ): Promise<{ reportId: string; nextRunDate: Date }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'SCHEDULE_AUTOMATED_REPORT',
        resourceType: 'REPORT_SCHEDULE',
        resourceId: companyId,
        metadata: { reportConfig }
      });

      const response = await api.post(`${this.baseUrl}/reports/schedule`, {
        companyId,
        ...reportConfig
      });

      return response.data;
    } catch (error) {
      console.error('Error scheduling automated report:', error);
      throw new Error('Failed to schedule automated report');
    }
  }
}

export const employeeDataService = new EmployeeDataService();