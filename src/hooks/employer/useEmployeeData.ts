import { useCallback, useEffect, useState } from 'react';

interface AggregatedEmployeeData {
  id: string;
  totalEmployees: number;
  activeUsers: number;
  healthScoreAverage: number;
  preventativeCareCompletion: number;
  benefitsUtilization: number;
  engagementScore: number;
  lastUpdated: string;
}

interface DepartmentData {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  avgHealthScore: number;
  preventativeCareRate: number;
  absenteeismRate: number;
  benefitsUtilization: number;
  topHealthRisks: HealthRisk[];
  engagementMetrics: EngagementMetric[];
}

interface HealthRisk {
  riskType: string;
  severity: 'low' | 'medium' | 'high';
  affectedCount: number;
  percentage: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
}

interface EngagementMetric {
  metricName: string;
  score: number;
  benchmarkScore?: number;
  trend: 'up' | 'down' | 'stable';
}

interface HealthTrend {
  metric: string;
  timeframe: string;
  dataPoints: {
    date: string;
    value: number;
    department?: string;
  }[];
  overallTrend: 'improving' | 'declining' | 'stable';
}

interface ComplianceStatus {
  category: 'privacy' | 'hipaa' | 'gdpr' | 'state_regulation';
  status: 'compliant' | 'warning' | 'non_compliant';
  lastAudit: string;
  nextAudit: string;
  issues: ComplianceIssue[];
}

interface ComplianceIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendedAction: string;
  dueDate?: string;
  responsible: string;
}

interface EmployeeBenefitsUsage {
  benefitType: string;
  totalEligible: number;
  totalUsed: number;
  utilizationRate: number;
  costPerEmployee: number;
  totalCost: number;
  roi: number;
  topUsers: {
    department: string;
    utilizationRate: number;
  }[];
}

interface EmployeeDataFilters {
  departments?: string[];
  roles?: string[];
  ageGroups?: string[];
  healthRiskLevels?: string[];
  engagementLevels?: string[];
  timeframe?: {
    start: string;
    end: string;
  };
  anonymizationLevel: 'full' | 'partial' | 'minimal';
}

interface BenchmarkData {
  category: string;
  metric: string;
  companyValue: number;
  industryAverage: number;
  topQuartile: number;
  percentile: number;
  recommendation: string;
}

interface EmployeeDataHook {
  // Aggregated data
  aggregatedData: AggregatedEmployeeData | null;
  departmentData: DepartmentData[];
  healthTrends: HealthTrend[];
  complianceStatus: ComplianceStatus[];
  benefitsUsage: EmployeeBenefitsUsage[];
  benchmarkData: BenchmarkData[];
  
  // Data fetching functions
  fetchAggregatedData: (filters?: EmployeeDataFilters) => Promise<void>;
  fetchDepartmentData: (filters?: EmployeeDataFilters) => Promise<void>;
  fetchHealthTrends: (metrics: string[], timeframe?: string) => Promise<void>;
  fetchComplianceStatus: () => Promise<void>;
  fetchBenefitsUsage: (filters?: EmployeeDataFilters) => Promise<void>;
  fetchBenchmarkData: (categories?: string[]) => Promise<void>;
  
  // Specific analytics
  getHealthScoreDistribution: (filters?: EmployeeDataFilters) => Promise<{ range: string; count: number; percentage: number }[]>;
  getPreventativeCareGaps: (filters?: EmployeeDataFilters) => Promise<{ service: string; gapPercentage: number; affectedCount: number }[]>;
  getRiskFactorAnalysis: (filters?: EmployeeDataFilters) => Promise<HealthRisk[]>;
  getEngagementInsights: (filters?: EmployeeDataFilters) => Promise<any>;
  
  // Predictive analytics
  predictHealthRisks: (timeframe: string) => Promise<{ riskType: string; predictedCount: number; confidence: number }[]>;
  forecastBenefitsCosts: (timeframe: string) => Promise<{ month: string; predictedCost: number; category: string }[]>;
  getEngagementPredictions: (timeframe: string) => Promise<{ metric: string; predictedValue: number; currentValue: number }[]>;
  
  // Anonymization and privacy
  setAnonymizationLevel: (level: EmployeeDataFilters['anonymizationLevel']) => void;
  exportAnonymizedData: (format: 'csv' | 'excel' | 'json', filters?: EmployeeDataFilters) => Promise<Blob>;
  
  // Real-time monitoring
  subscribeToDataUpdates: (categories: string[]) => void;
  unsubscribeFromDataUpdates: () => void;
  
  // State management
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  currentFilters: EmployeeDataFilters;
  setFilters: (filters: EmployeeDataFilters) => void;
  refreshAllData: () => Promise<void>;
}

export function useEmployeeData(): EmployeeDataHook {
  const [aggregatedData, setAggregatedData] = useState<AggregatedEmployeeData | null>(null);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [benefitsUsage, setBenefitsUsage] = useState<EmployeeBenefitsUsage[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<EmployeeDataFilters>({
    anonymizationLevel: 'full'
  });

  // API helper with privacy enforcement
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api/employee-data/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-Anonymization-Level': currentFilters.anonymizationLevel,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }, [currentFilters.anonymizationLevel]);

  // Build query parameters with privacy controls
  const buildQueryParams = useCallback((filters: EmployeeDataFilters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Always include anonymization level
    queryParams.append('anonymizationLevel', filters.anonymizationLevel || currentFilters.anonymizationLevel);
    
    // Add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'anonymizationLevel') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else if (typeof value === 'object' && value.start && value.end) {
          queryParams.append(`${key}_start`, value.start);
          queryParams.append(`${key}_end`, value.end);
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return queryParams;
  }, [currentFilters.anonymizationLevel]);

  // Fetch aggregated employee data
  const fetchAggregatedData = useCallback(async (filters: EmployeeDataFilters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`aggregated?${queryParams}`);
      
      setAggregatedData(data.aggregated);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch aggregated data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, buildQueryParams]);

  // Fetch department-level data
  const fetchDepartmentData = useCallback(async (filters: EmployeeDataFilters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`departments?${queryParams}`);
      
      setDepartmentData(data.departments || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch department data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, buildQueryParams]);

  // Fetch health trends
  const fetchHealthTrends = useCallback(async (metrics: string[], timeframe = '12months') => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(currentFilters);
      queryParams.append('metrics', metrics.join(','));
      queryParams.append('timeframe', timeframe);
      
      const data = await apiCall(`health-trends?${queryParams}`);
      setHealthTrends(data.trends || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch health trends: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, buildQueryParams, currentFilters]);

  // Fetch compliance status
  const fetchComplianceStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiCall('compliance-status');
      setComplianceStatus(data.compliance || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch compliance status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Fetch benefits usage data
  const fetchBenefitsUsage = useCallback(async (filters: EmployeeDataFilters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`benefits-usage?${queryParams}`);
      
      setBenefitsUsage(data.benefitsUsage || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch benefits usage: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, buildQueryParams]);

  // Fetch benchmark data
  const fetchBenchmarkData = useCallback(async (categories: string[] = []) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (categories.length > 0) {
        queryParams.append('categories', categories.join(','));
      }
      
      const data = await apiCall(`benchmarks?${queryParams}`);
      setBenchmarkData(data.benchmarks || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch benchmark data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Get health score distribution
  const getHealthScoreDistribution = useCallback(async (filters: EmployeeDataFilters = {}) => {
    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`health-score-distribution?${queryParams}`);
      return data.distribution || [];
    } catch (err) {
      setError(`Failed to fetch health score distribution: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall, buildQueryParams]);

  // Get preventative care gaps
  const getPreventativeCareGaps = useCallback(async (filters: EmployeeDataFilters = {}) => {
    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`preventative-care-gaps?${queryParams}`);
      return data.gaps || [];
    } catch (err) {
      setError(`Failed to fetch care gaps: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall, buildQueryParams]);

  // Get risk factor analysis
  const getRiskFactorAnalysis = useCallback(async (filters: EmployeeDataFilters = {}) => {
    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`risk-factors?${queryParams}`);
      return data.riskFactors || [];
    } catch (err) {
      setError(`Failed to fetch risk factor analysis: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall, buildQueryParams]);

  // Get engagement insights
  const getEngagementInsights = useCallback(async (filters: EmployeeDataFilters = {}) => {
    try {
      const queryParams = buildQueryParams(filters);
      const data = await apiCall(`engagement-insights?${queryParams}`);
      return data.insights || {};
    } catch (err) {
      setError(`Failed to fetch engagement insights: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return {};
    }
  }, [apiCall, buildQueryParams]);

  // Predictive analytics - Health risks
  const predictHealthRisks = useCallback(async (timeframe: string) => {
    try {
      const queryParams = buildQueryParams(currentFilters);
      queryParams.append('timeframe', timeframe);
      
      const data = await apiCall(`predictions/health-risks?${queryParams}`);
      return data.predictions || [];
    } catch (err) {
      setError(`Failed to predict health risks: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall, buildQueryParams, currentFilters]);

  // Forecast benefits costs
  const forecastBenefitsCosts = useCallback(async (timeframe: string) => {
    try {
      const queryParams = buildQueryParams(currentFilters);
      queryParams.append('timeframe', timeframe);
      
      const data = await apiCall(`predictions/benefits-costs?${queryParams}`);
      return data.forecast || [];
    } catch (err) {
      setError(`Failed to forecast benefits costs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall, buildQueryParams, currentFilters]);

  // Get engagement predictions
  const getEngagementPredictions = useCallback(async (timeframe: string) => {
    try {
      const queryParams = buildQueryParams(currentFilters);
      queryParams.append('timeframe', timeframe);
      
      const data = await apiCall(`predictions/engagement?${queryParams}`);
      return data.predictions || [];
    } catch (err) {
      setError(`Failed to get engagement predictions: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall, buildQueryParams, currentFilters]);

  // Set anonymization level
  const setAnonymizationLevel = useCallback((level: EmployeeDataFilters['anonymizationLevel']) => {
    setCurrentFilters(prev => ({ ...prev, anonymizationLevel: level }));
  }, []);

  // Set filters
  const setFilters = useCallback((filters: EmployeeDataFilters) => {
    setCurrentFilters(filters);
  }, []);

  // Export anonymized data
  const exportAnonymizedData = useCallback(async (
    format: 'csv' | 'excel' | 'json', 
    filters: EmployeeDataFilters = {}
  ): Promise<Blob> => {
    try {
      const queryParams = buildQueryParams({ ...currentFilters, ...filters });
      queryParams.append('format', format);
      
      const response = await fetch(`/api/employee-data/export?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Anonymization-Level': filters.anonymizationLevel || currentFilters.anonymizationLevel
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (err) {
      setError(`Failed to export data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [buildQueryParams, currentFilters]);

  // Real-time subscription
  const subscribeToDataUpdates = useCallback((categories: string[]) => {
    // Set up WebSocket or SSE connection for real-time updates
    const eventSource = new EventSource(
      `/api/employee-data/stream?categories=${categories.join(',')}&anonymization=${currentFilters.anonymizationLevel}`
    );
    
    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        
        // Update the appropriate state based on the category
        switch (update.category) {
          case 'aggregated':
            setAggregatedData(prev => prev ? { ...prev, ...update.data } : null);
            break;
          case 'departments':
            setDepartmentData(prev => 
              prev.map(dept => 
                dept.departmentId === update.departmentId 
                  ? { ...dept, ...update.data }
                  : dept
              )
            );
            break;
          case 'health_trends':
            setHealthTrends(prev => {
              const existing = prev.find(trend => trend.metric === update.metric);
              if (existing) {
                return prev.map(trend => 
                  trend.metric === update.metric 
                    ? { ...trend, ...update.data }
                    : trend
                );
              } else {
                return [...prev, update.data];
              }
            });
            break;
          case 'compliance':
            setComplianceStatus(prev => 
              prev.map(status => 
                status.category === update.complianceCategory 
                  ? { ...status, ...update.data }
                  : status
              )
            );
            break;
        }
        
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error('Failed to parse real-time update:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('Real-time employee data stream error:', err);
      setError('Real-time updates disconnected');
    };

    // Store the event source for cleanup
    (window as any).employeeDataEventSource = eventSource;
  }, [currentFilters.anonymizationLevel]);

  const unsubscribeFromDataUpdates = useCallback(() => {
    if ((window as any).employeeDataEventSource) {
      (window as any).employeeDataEventSource.close();
      delete (window as any).employeeDataEventSource;
    }
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchAggregatedData(currentFilters),
      fetchDepartmentData(currentFilters),
      fetchHealthTrends(['health_score', 'preventative_care', 'engagement']),
      fetchComplianceStatus(),
      fetchBenefitsUsage(currentFilters),
      fetchBenchmarkData()
    ]);
  }, [
    fetchAggregatedData,
    fetchDepartmentData,
    fetchHealthTrends,
    fetchComplianceStatus,
    fetchBenefitsUsage,
    fetchBenchmarkData,
    currentFilters
  ]);

  // Initial data load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromDataUpdates();
    };
  }, [unsubscribeFromDataUpdates]);

  // Privacy compliance monitoring
  useEffect(() => {
    // Log data access for compliance
    if (aggregatedData || departmentData.length > 0) {
      // This would log to audit system
      console.log('Employee data accessed with anonymization level:', currentFilters.anonymizationLevel);
    }
  }, [aggregatedData, departmentData, currentFilters.anonymizationLevel]);

  return {
    // Aggregated data
    aggregatedData,
    departmentData,
    healthTrends,
    complianceStatus,
    benefitsUsage,
    benchmarkData,
    
    // Data fetching functions
    fetchAggregatedData,
    fetchDepartmentData,
    fetchHealthTrends,
    fetchComplianceStatus,
    fetchBenefitsUsage,
    fetchBenchmarkData,
    
    // Specific analytics
    getHealthScoreDistribution,
    getPreventativeCareGaps,
    getRiskFactorAnalysis,
    getEngagementInsights,
    
    // Predictive analytics
    predictHealthRisks,
    forecastBenefitsCosts,
    getEngagementPredictions,
    
    // Anonymization and privacy
    setAnonymizationLevel,
    exportAnonymizedData,
    
    // Real-time monitoring
    subscribeToDataUpdates,
    unsubscribeFromDataUpdates,
    
    // State management
    isLoading,
    error,
    lastUpdated,
    currentFilters,
    setFilters,
    refreshAllData
  };
}

// Specialized hook for compliance monitoring
export function useComplianceMonitoring() {
  const { complianceStatus, fetchComplianceStatus } = useEmployeeData();
  const [violations, setViolations] = useState<ComplianceIssue[]>([]);
  const [auditSchedule, setAuditSchedule] = useState<any[]>([]);

  const getCriticalViolations = useCallback(() => {
    return complianceStatus.reduce((acc, status) => {
      const critical = status.issues.filter(issue => issue.severity === 'critical');
      return [...acc, ...critical];
    }, [] as ComplianceIssue[]);
  }, [complianceStatus]);

  const getComplianceScore = useCallback(() => {
    if (complianceStatus.length === 0) return 0;
    
    const compliantCount = complianceStatus.filter(status => status.status === 'compliant').length;
    return (compliantCount / complianceStatus.length) * 100;
  }, [complianceStatus]);

  useEffect(() => {
    setViolations(getCriticalViolations());
  }, [getCriticalViolations]);

  return {
    complianceStatus,
    violations,
    auditSchedule,
    complianceScore: getComplianceScore(),
    refreshCompliance: fetchComplianceStatus
  };
}

// Specialized hook for health analytics with privacy controls
export function useHealthAnalyticsSecure() {
  const { 
    getHealthScoreDistribution, 
    getRiskFactorAnalysis, 
    predictHealthRisks,
    currentFilters,
    setAnonymizationLevel 
  } = useEmployeeData();

  const [healthInsights, setHealthInsights] = useState<any>(null);
  const [riskPredictions, setRiskPredictions] = useState<any[]>([]);

  const generateHealthInsights = useCallback(async () => {
    const [distribution, risks, predictions] = await Promise.all([
      getHealthScoreDistribution(),
      getRiskFactorAnalysis(),
      predictHealthRisks('6months')
    ]);

    setHealthInsights({
      scoreDistribution: distribution,
      currentRisks: risks,
      trendAnalysis: {
        overallHealth: 'improving', // This would be calculated
        riskTrends: risks.map(risk => ({
          type: risk.riskType,
          trend: risk.trendDirection
        }))
      }
    });
    
    setRiskPredictions(predictions);
  }, [getHealthScoreDistribution, getRiskFactorAnalysis, predictHealthRisks]);

  // Ensure maximum privacy for health data
  useEffect(() => {
    if (currentFilters.anonymizationLevel !== 'full') {
      setAnonymizationLevel('full');
    }
  }, [currentFilters.anonymizationLevel, setAnonymizationLevel]);

  return {
    healthInsights,
    riskPredictions,
    generateHealthInsights,
    privacyLevel: currentFilters.anonymizationLevel
  };
}

export default useEmployeeData;