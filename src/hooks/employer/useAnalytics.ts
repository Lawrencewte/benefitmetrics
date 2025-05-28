import { useCallback, useEffect, useState } from 'react';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit: string;
  category: 'health' | 'financial' | 'engagement' | 'compliance';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface DepartmentMetrics {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  healthScore: number;
  preventativeCareCompletion: number;
  benefitsUtilization: number;
  costSavings: number;
  absenteeismRate: number;
  engagementScore: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

interface BenefitsOptimization {
  category: string;
  currentUtilization: number;
  potentialSavings: number;
  recommendedActions: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number;
}

interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  departments?: string[];
  employeeTypes?: string[];
  ageGroups?: string[];
  healthRiskLevels?: string[];
}

interface AnalyticsHook {
  // Core metrics
  overviewMetrics: AnalyticsMetric[];
  departmentMetrics: DepartmentMetrics[];
  timeSeriesData: Record<string, TimeSeriesData[]>;
  benefitsOptimization: BenefitsOptimization[];
  
  // Data fetching
  fetchOverviewMetrics: (filters?: AnalyticsFilters) => Promise<void>;
  fetchDepartmentMetrics: (filters?: AnalyticsFilters) => Promise<void>;
  fetchTimeSeriesData: (metric: string, filters?: AnalyticsFilters) => Promise<void>;
  fetchBenefitsOptimization: () => Promise<void>;
  
  // Specific analytics
  getHealthScoreDistribution: () => Promise<{ score: number; count: number }[]>;
  getPreventativeCareGaps: () => Promise<{ service: string; gap: number; priority: string }[]>;
  getCostSavingsBreakdown: () => Promise<{ category: string; amount: number; percentage: number }[]>;
  getEngagementTrends: (period: string) => Promise<TimeSeriesData[]>;
  
  // ROI calculations
  calculateROI: (investment: number, period: string) => Promise<{ roi: number; breakdown: Record<string, number> }>;
  getProjectedSavings: (scenario: string) => Promise<{ year: string; savings: number }[]>;
  
  // Custom reports
  generateCustomReport: (config: ReportConfig) => Promise<CustomReport>;
  exportAnalytics: (format: 'excel' | 'pdf' | 'csv', data: any) => Promise<Blob>;
  
  // Real-time updates
  subscribeToMetrics: (metrics: string[]) => void;
  unsubscribeFromMetrics: () => void;
  
  // State management
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refreshData: () => Promise<void>;
}

interface ReportConfig {
  title: string;
  metrics: string[];
  filters: AnalyticsFilters;
  timeRange: string;
  groupBy?: string;
  includeCharts: boolean;
  includeTrends: boolean;
}

interface CustomReport {
  id: string;
  title: string;
  generatedAt: string;
  data: Record<string, any>;
  charts?: Chart[];
  summary: string;
}

interface Chart {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  title: string;
  data: any[];
  config: Record<string, any>;
}

export function useAnalytics(): AnalyticsHook {
  const [overviewMetrics, setOverviewMetrics] = useState<AnalyticsMetric[]>([]);
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetrics[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<Record<string, TimeSeriesData[]>>({});
  const [benefitsOptimization, setBenefitsOptimization] = useState<BenefitsOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [subscribedMetrics, setSubscribedMetrics] = useState<string[]>([]);

  // API call helper
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api/analytics/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }, []);

  // Fetch overview metrics
  const fetchOverviewMetrics = useCallback(async (filters: AnalyticsFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const data = await apiCall(`overview-metrics?${queryParams}`);
      setOverviewMetrics(data.metrics || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch overview metrics: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Fetch department metrics
  const fetchDepartmentMetrics = useCallback(async (filters: AnalyticsFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const data = await apiCall(`department-metrics?${queryParams}`);
      setDepartmentMetrics(data.departments || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch department metrics: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Fetch time series data
  const fetchTimeSeriesData = useCallback(async (metric: string, filters: AnalyticsFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({ metric });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const data = await apiCall(`time-series?${queryParams}`);
      setTimeSeriesData(prev => ({
        ...prev,
        [metric]: data.timeSeries || []
      }));
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch time series data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Fetch benefits optimization
  const fetchBenefitsOptimization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiCall('benefits-optimization');
      setBenefitsOptimization(data.optimization || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch benefits optimization: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Get health score distribution
  const getHealthScoreDistribution = useCallback(async () => {
    try {
      const data = await apiCall('health-score-distribution');
      return data.distribution || [];
    } catch (err) {
      setError(`Failed to fetch health score distribution: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall]);

  // Get preventative care gaps
  const getPreventativeCareGaps = useCallback(async () => {
    try {
      const data = await apiCall('preventative-care-gaps');
      return data.gaps || [];
    } catch (err) {
      setError(`Failed to fetch care gaps: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall]);

  // Get cost savings breakdown
  const getCostSavingsBreakdown = useCallback(async () => {
    try {
      const data = await apiCall('cost-savings-breakdown');
      return data.breakdown || [];
    } catch (err) {
      setError(`Failed to fetch cost savings breakdown: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall]);

  // Get engagement trends
  const getEngagementTrends = useCallback(async (period: string) => {
    try {
      const data = await apiCall(`engagement-trends?period=${period}`);
      return data.trends || [];
    } catch (err) {
      setError(`Failed to fetch engagement trends: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall]);

  // Calculate ROI
  const calculateROI = useCallback(async (investment: number, period: string) => {
    try {
      const data = await apiCall('calculate-roi', {
        method: 'POST',
        body: JSON.stringify({ investment, period })
      });
      return data.roi || { roi: 0, breakdown: {} };
    } catch (err) {
      setError(`Failed to calculate ROI: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return { roi: 0, breakdown: {} };
    }
  }, [apiCall]);

  // Get projected savings
  const getProjectedSavings = useCallback(async (scenario: string) => {
    try {
      const data = await apiCall(`projected-savings?scenario=${scenario}`);
      return data.projections || [];
    } catch (err) {
      setError(`Failed to fetch projected savings: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    }
  }, [apiCall]);

  // Generate custom report
  const generateCustomReport = useCallback(async (config: ReportConfig): Promise<CustomReport> => {
    try {
      const data = await apiCall('custom-report', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      return data.report || {
        id: '',
        title: config.title,
        generatedAt: new Date().toISOString(),
        data: {},
        summary: 'Report generation failed'
      };
    } catch (err) {
      setError(`Failed to generate custom report: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [apiCall]);

  // Export analytics
  const exportAnalytics = useCallback(async (format: 'excel' | 'pdf' | 'csv', data: any): Promise<Blob> => {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ format, data })
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (err) {
      setError(`Failed to export analytics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, []);

  // Real-time subscription
  const subscribeToMetrics = useCallback((metrics: string[]) => {
    setSubscribedMetrics(metrics);
    
    // Set up WebSocket or SSE connection for real-time updates
    const eventSource = new EventSource(`/api/analytics/stream?metrics=${metrics.join(',')}`);
    
    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        
        // Update the appropriate state based on the metric type
        if (update.type === 'overview') {
          setOverviewMetrics(prev => 
            prev.map(metric => 
              metric.id === update.metricId 
                ? { ...metric, ...update.data, lastUpdated: new Date().toISOString() }
                : metric
            )
          );
        } else if (update.type === 'department') {
          setDepartmentMetrics(prev => 
            prev.map(dept => 
              dept.departmentId === update.departmentId 
                ? { ...dept, ...update.data }
                : dept
            )
          );
        }
        
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error('Failed to parse real-time update:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('Real-time analytics stream error:', err);
      setError('Real-time updates disconnected');
    };

    // Store the event source for cleanup
    (window as any).analyticsEventSource = eventSource;
  }, []);

  const unsubscribeFromMetrics = useCallback(() => {
    if ((window as any).analyticsEventSource) {
      (window as any).analyticsEventSource.close();
      delete (window as any).analyticsEventSource;
    }
    setSubscribedMetrics([]);
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchOverviewMetrics(),
      fetchDepartmentMetrics(),
      fetchBenefitsOptimization()
    ]);
  }, [fetchOverviewMetrics, fetchDepartmentMetrics, fetchBenefitsOptimization]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromMetrics();
    };
  }, [unsubscribeFromMetrics]);

  return {
    // Core metrics
    overviewMetrics,
    departmentMetrics,
    timeSeriesData,
    benefitsOptimization,
    
    // Data fetching
    fetchOverviewMetrics,
    fetchDepartmentMetrics,
    fetchTimeSeriesData,
    fetchBenefitsOptimization,
    
    // Specific analytics
    getHealthScoreDistribution,
    getPreventativeCareGaps,
    getCostSavingsBreakdown,
    getEngagementTrends,
    
    // ROI calculations
    calculateROI,
    getProjectedSavings,
    
    // Custom reports
    generateCustomReport,
    exportAnalytics,
    
    // Real-time updates
    subscribeToMetrics,
    unsubscribeFromMetrics,
    
    // State management
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
}

// Specialized hook for health analytics
export function useHealthAnalytics() {
  const { 
    getHealthScoreDistribution, 
    getPreventativeCareGaps, 
    fetchTimeSeriesData, 
    timeSeriesData 
  } = useAnalytics();

  const [healthTrends, setHealthTrends] = useState<TimeSeriesData[]>([]);
  const [careGaps, setCareGaps] = useState<{ service: string; gap: number; priority: string }[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<{ score: number; count: number }[]>([]);

  const loadHealthAnalytics = useCallback(async () => {
    try {
      const [trends, gaps, distribution] = await Promise.all([
        fetchTimeSeriesData('health_score'),
        getPreventativeCareGaps(),
        getHealthScoreDistribution()
      ]);
      
      setHealthTrends(timeSeriesData.health_score || []);
      setCareGaps(gaps);
      setScoreDistribution(distribution);
    } catch (err) {
      console.error('Failed to load health analytics:', err);
    }
  }, [fetchTimeSeriesData, getPreventativeCareGaps, getHealthScoreDistribution, timeSeriesData]);

  useEffect(() => {
    loadHealthAnalytics();
  }, [loadHealthAnalytics]);

  return {
    healthTrends,
    careGaps,
    scoreDistribution,
    refreshHealthAnalytics: loadHealthAnalytics
  };
}

// Specialized hook for financial analytics
export function useFinancialAnalytics() {
  const { 
    getCostSavingsBreakdown, 
    calculateROI, 
    getProjectedSavings,
    fetchTimeSeriesData,
    timeSeriesData
  } = useAnalytics();

  const [costBreakdown, setCostBreakdown] = useState<{ category: string; amount: number; percentage: number }[]>([]);
  const [roiData, setRoiData] = useState<{ roi: number; breakdown: Record<string, number> } | null>(null);
  const [projectedSavings, setProjectedSavings] = useState<{ year: string; savings: number }[]>([]);

  const loadFinancialAnalytics = useCallback(async (investment?: number) => {
    try {
      const [breakdown, projections] = await Promise.all([
        getCostSavingsBreakdown(),
        getProjectedSavings('current'),
        fetchTimeSeriesData('cost_savings')
      ]);
      
      setCostBreakdown(breakdown);
      setProjectedSavings(projections);
      
      if (investment) {
        const roi = await calculateROI(investment, '12months');
        setRoiData(roi);
      }
    } catch (err) {
      console.error('Failed to load financial analytics:', err);
    }
  }, [getCostSavingsBreakdown, getProjectedSavings, fetchTimeSeriesData, calculateROI]);

  return {
    costBreakdown,
    roiData,
    projectedSavings,
    costSavingsTrends: timeSeriesData.cost_savings || [],
    loadFinancialAnalytics
  };
}

export default useAnalytics;