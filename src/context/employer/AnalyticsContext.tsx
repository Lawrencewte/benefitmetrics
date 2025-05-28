import React, { createContext, ReactNode, useContext, useReducer } from 'react';

// Types
export interface AnalyticsMetrics {
  totalEmployees: number;
  healthScoreAverage: number;
  benefitsUtilization: number;
  preventativeCareCompletion: number;
  costSavings: number;
  riskReduction: number;
}

export interface DepartmentMetrics {
  id: string;
  name: string;
  employeeCount: number;
  healthScore: number;
  utilizationRate: number;
  completionRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TrendData {
  period: string;
  healthScore: number;
  utilization: number;
  completion: number;
  savings: number;
}

export interface BenefitsOptimization {
  totalPotentialSavings: number;
  utilizationGaps: {
    category: string;
    currentRate: number;
    targetRate: number;
    potentialSavings: number;
  }[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'easy' | 'moderate' | 'complex';
    savings: number;
  }[];
}

export interface HealthMetrics {
  preventativeCare: {
    physicals: number;
    dental: number;
    vision: number;
    screenings: number;
  };
  riskFactors: {
    smoking: number;
    obesity: number;
    hypertension: number;
    diabetes: number;
  };
  outcomes: {
    earlyDetection: number;
    chronicDiseaseManagement: number;
    emergencyReduction: number;
  };
}

export interface ROIData {
  totalInvestment: number;
  totalSavings: number;
  netROI: number;
  roiPercentage: number;
  breakdown: {
    preventativeCare: number;
    reducedAbsenteeism: number;
    loweredPremiums: number;
    productivityGains: number;
  };
  projections: {
    year1: number;
    year2: number;
    year3: number;
  };
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  filters: {
    departments: string[];
    dateRange: {
      start: string;
      end: string;
    };
    metrics: string[];
    employeeGroups: string[];
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    nextRun: string;
  };
  lastGenerated?: string;
}

export interface AnalyticsState {
  metrics: AnalyticsMetrics;
  departments: DepartmentMetrics[];
  trends: TrendData[];
  benefitsOptimization: BenefitsOptimization;
  healthMetrics: HealthMetrics;
  roiData: ROIData;
  customReports: CustomReport[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  selectedDepartments: string[];
  compareMode: boolean;
  comparisonPeriod?: string;
}

// Action Types
type AnalyticsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_METRICS'; payload: AnalyticsMetrics }
  | { type: 'SET_DEPARTMENTS'; payload: DepartmentMetrics[] }
  | { type: 'SET_TRENDS'; payload: TrendData[] }
  | { type: 'SET_BENEFITS_OPTIMIZATION'; payload: BenefitsOptimization }
  | { type: 'SET_HEALTH_METRICS'; payload: HealthMetrics }
  | { type: 'SET_ROI_DATA'; payload: ROIData }
  | { type: 'SET_CUSTOM_REPORTS'; payload: CustomReport[] }
  | { type: 'ADD_CUSTOM_REPORT'; payload: CustomReport }
  | { type: 'UPDATE_CUSTOM_REPORT'; payload: { id: string; report: Partial<CustomReport> } }
  | { type: 'DELETE_CUSTOM_REPORT'; payload: string }
  | { type: 'SET_TIME_RANGE'; payload: '7d' | '30d' | '90d' | '1y' }
  | { type: 'SET_SELECTED_DEPARTMENTS'; payload: string[] }
  | { type: 'TOGGLE_COMPARE_MODE'; payload?: string }
  | { type: 'SET_LAST_UPDATED'; payload: string }
  | { type: 'REFRESH_DATA' };

// Initial State
const initialState: AnalyticsState = {
  metrics: {
    totalEmployees: 0,
    healthScoreAverage: 0,
    benefitsUtilization: 0,
    preventativeCareCompletion: 0,
    costSavings: 0,
    riskReduction: 0
  },
  departments: [],
  trends: [],
  benefitsOptimization: {
    totalPotentialSavings: 0,
    utilizationGaps: [],
    recommendations: []
  },
  healthMetrics: {
    preventativeCare: {
      physicals: 0,
      dental: 0,
      vision: 0,
      screenings: 0
    },
    riskFactors: {
      smoking: 0,
      obesity: 0,
      hypertension: 0,
      diabetes: 0
    },
    outcomes: {
      earlyDetection: 0,
      chronicDiseaseManagement: 0,
      emergencyReduction: 0
    }
  },
  roiData: {
    totalInvestment: 0,
    totalSavings: 0,
    netROI: 0,
    roiPercentage: 0,
    breakdown: {
      preventativeCare: 0,
      reducedAbsenteeism: 0,
      loweredPremiums: 0,
      productivityGains: 0
    },
    projections: {
      year1: 0,
      year2: 0,
      year3: 0
    }
  },
  customReports: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedTimeRange: '30d',
  selectedDepartments: [],
  compareMode: false
};

// Reducer
function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'SET_METRICS':
      return {
        ...state,
        metrics: action.payload,
        isLoading: false,
        error: null
      };

    case 'SET_DEPARTMENTS':
      return {
        ...state,
        departments: action.payload
      };

    case 'SET_TRENDS':
      return {
        ...state,
        trends: action.payload
      };

    case 'SET_BENEFITS_OPTIMIZATION':
      return {
        ...state,
        benefitsOptimization: action.payload
      };

    case 'SET_HEALTH_METRICS':
      return {
        ...state,
        healthMetrics: action.payload
      };

    case 'SET_ROI_DATA':
      return {
        ...state,
        roiData: action.payload
      };

    case 'SET_CUSTOM_REPORTS':
      return {
        ...state,
        customReports: action.payload
      };

    case 'ADD_CUSTOM_REPORT':
      return {
        ...state,
        customReports: [...state.customReports, action.payload]
      };

    case 'UPDATE_CUSTOM_REPORT':
      return {
        ...state,
        customReports: state.customReports.map(report =>
          report.id === action.payload.id
            ? { ...report, ...action.payload.report }
            : report
        )
      };

    case 'DELETE_CUSTOM_REPORT':
      return {
        ...state,
        customReports: state.customReports.filter(report => report.id !== action.payload)
      };

    case 'SET_TIME_RANGE':
      return {
        ...state,
        selectedTimeRange: action.payload
      };

    case 'SET_SELECTED_DEPARTMENTS':
      return {
        ...state,
        selectedDepartments: action.payload
      };

    case 'TOGGLE_COMPARE_MODE':
      return {
        ...state,
        compareMode: !state.compareMode,
        comparisonPeriod: action.payload
      };

    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: action.payload
      };

    case 'REFRESH_DATA':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    default:
      return state;
  }
}

// Context
interface AnalyticsContextType {
  state: AnalyticsState;
  dispatch: React.Dispatch<AnalyticsAction>;
  
  // Action creators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMetrics: (metrics: AnalyticsMetrics) => void;
  setDepartments: (departments: DepartmentMetrics[]) => void;
  setTrends: (trends: TrendData[]) => void;
  setBenefitsOptimization: (optimization: BenefitsOptimization) => void;
  setHealthMetrics: (metrics: HealthMetrics) => void;
  setROIData: (data: ROIData) => void;
  setCustomReports: (reports: CustomReport[]) => void;
  addCustomReport: (report: CustomReport) => void;
  updateCustomReport: (id: string, updates: Partial<CustomReport>) => void;
  deleteCustomReport: (id: string) => void;
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  setSelectedDepartments: (departments: string[]) => void;
  toggleCompareMode: (period?: string) => void;
  refreshData: () => void;
  
  // Computed values
  getFilteredMetrics: () => AnalyticsMetrics;
  getDepartmentComparison: () => DepartmentMetrics[];
  getTrendAnalysis: () => {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  getTopPerformingDepartments: (metric: keyof DepartmentMetrics, limit?: number) => DepartmentMetrics[];
  getUtilizationGaps: () => Array<{
    category: string;
    gap: number;
    opportunity: number;
  }>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Provider
interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  // Action creators
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setMetrics = (metrics: AnalyticsMetrics) => {
    dispatch({ type: 'SET_METRICS', payload: metrics });
  };

  const setDepartments = (departments: DepartmentMetrics[]) => {
    dispatch({ type: 'SET_DEPARTMENTS', payload: departments });
  };

  const setTrends = (trends: TrendData[]) => {
    dispatch({ type: 'SET_TRENDS', payload: trends });
  };

  const setBenefitsOptimization = (optimization: BenefitsOptimization) => {
    dispatch({ type: 'SET_BENEFITS_OPTIMIZATION', payload: optimization });
  };

  const setHealthMetrics = (metrics: HealthMetrics) => {
    dispatch({ type: 'SET_HEALTH_METRICS', payload: metrics });
  };

  const setROIData = (data: ROIData) => {
    dispatch({ type: 'SET_ROI_DATA', payload: data });
  };

  const setCustomReports = (reports: CustomReport[]) => {
    dispatch({ type: 'SET_CUSTOM_REPORTS', payload: reports });
  };

  const addCustomReport = (report: CustomReport) => {
    dispatch({ type: 'ADD_CUSTOM_REPORT', payload: report });
  };

  const updateCustomReport = (id: string, updates: Partial<CustomReport>) => {
    dispatch({ type: 'UPDATE_CUSTOM_REPORT', payload: { id, report: updates } });
  };

  const deleteCustomReport = (id: string) => {
    dispatch({ type: 'DELETE_CUSTOM_REPORT', payload: id });
  };

  const setTimeRange = (range: '7d' | '30d' | '90d' | '1y') => {
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
  };

  const setSelectedDepartments = (departments: string[]) => {
    dispatch({ type: 'SET_SELECTED_DEPARTMENTS', payload: departments });
  };

  const toggleCompareMode = (period?: string) => {
    dispatch({ type: 'TOGGLE_COMPARE_MODE', payload: period });
  };

  const refreshData = () => {
    dispatch({ type: 'REFRESH_DATA' });
  };

  // Computed values
  const getFilteredMetrics = (): AnalyticsMetrics => {
    if (state.selectedDepartments.length === 0) {
      return state.metrics;
    }

    const filteredDepartments = state.departments.filter(dept =>
      state.selectedDepartments.includes(dept.id)
    );

    const totalEmployees = filteredDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0);
    const avgHealthScore = filteredDepartments.reduce((sum, dept) => 
      sum + (dept.healthScore * dept.employeeCount), 0) / totalEmployees;
    const avgUtilization = filteredDepartments.reduce((sum, dept) => 
      sum + (dept.utilizationRate * dept.employeeCount), 0) / totalEmployees;
    const avgCompletion = filteredDepartments.reduce((sum, dept) => 
      sum + (dept.completionRate * dept.employeeCount), 0) / totalEmployees;

    return {
      ...state.metrics,
      totalEmployees,
      healthScoreAverage: avgHealthScore,
      benefitsUtilization: avgUtilization,
      preventativeCareCompletion: avgCompletion
    };
  };

  const getDepartmentComparison = (): DepartmentMetrics[] => {
    return state.departments.sort((a, b) => b.healthScore - a.healthScore);
  };

  const getTrendAnalysis = () => {
    if (state.trends.length < 2) {
      return {
        current: 0,
        previous: 0,
        change: 0,
        trend: 'stable' as const
      };
    }

    const current = state.trends[state.trends.length - 1];
    const previous = state.trends[state.trends.length - 2];
    
    const change = ((current.healthScore - previous.healthScore) / previous.healthScore) * 100;
    const trend = change > 2 ? 'up' : change < -2 ? 'down' : 'stable';

    return {
      current: current.healthScore,
      previous: previous.healthScore,
      change,
      trend
    };
  };

  const getTopPerformingDepartments = (
    metric: keyof DepartmentMetrics, 
    limit: number = 5
  ): DepartmentMetrics[] => {
    return [...state.departments]
      .sort((a, b) => {
        const aValue = a[metric];
        const bValue = b[metric];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return bValue - aValue;
        }
        return 0;
      })
      .slice(0, limit);
  };

  const getUtilizationGaps = () => {
    return state.benefitsOptimization.utilizationGaps.map(gap => ({
      category: gap.category,
      gap: gap.targetRate - gap.currentRate,
      opportunity: gap.potentialSavings
    }));
  };

  const contextValue: AnalyticsContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setMetrics,
    setDepartments,
    setTrends,
    setBenefitsOptimization,
    setHealthMetrics,
    setROIData,
    setCustomReports,
    addCustomReport,
    updateCustomReport,
    deleteCustomReport,
    setTimeRange,
    setSelectedDepartments,
    toggleCompareMode,
    refreshData,
    getFilteredMetrics,
    getDepartmentComparison,
    getTrendAnalysis,
    getTopPerformingDepartments,
    getUtilizationGaps
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Additional utility functions
export const analyticsUtils = {
  // Calculate health score based on various metrics
  calculateHealthScore: (metrics: {
    preventativeCareCompletion: number;
    riskFactorReduction: number;
    engagementScore: number;
    outcomeImprovement: number;
  }): number => {
    const weights = {
      preventativeCare: 0.4,
      riskReduction: 0.3,
      engagement: 0.2,
      outcomes: 0.1
    };

    return Math.round(
      metrics.preventativeCareCompletion * weights.preventativeCare +
      metrics.riskFactorReduction * weights.riskReduction +
      metrics.engagementScore * weights.engagement +
      metrics.outcomeImprovement * weights.outcomes
    );
  },

  // Calculate ROI percentage
  calculateROI: (investment: number, savings: number): number => {
    if (investment === 0) return 0;
    return Math.round(((savings - investment) / investment) * 100);
  },

  // Format currency values
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format percentage values
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Get risk level color
  getRiskLevelColor: (level: 'low' | 'medium' | 'high'): string => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  },

  // Calculate trend direction
  getTrendDirection: (current: number, previous: number, threshold: number = 2): 'up' | 'down' | 'stable' => {
    const change = ((current - previous) / previous) * 100;
    if (change > threshold) return 'up';
    if (change < -threshold) return 'down';
    return 'stable';
  },

  // Generate date ranges for analytics
  getDateRange: (range: '7d' | '30d' | '90d' | '1y'): { start: Date; end: Date } => {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    return { start, end };
  },

  // Validate analytics data
  validateMetrics: (metrics: Partial<AnalyticsMetrics>): boolean => {
    const requiredFields: (keyof AnalyticsMetrics)[] = [
      'totalEmployees',
      'healthScoreAverage',
      'benefitsUtilization',
      'preventativeCareCompletion'
    ];

    return requiredFields.every(field => 
      metrics[field] !== undefined && 
      typeof metrics[field] === 'number' && 
      metrics[field] >= 0
    );
  },

  // Generate analytics insights
  generateInsights: (
    metrics: AnalyticsMetrics,
    departments: DepartmentMetrics[],
    trends: TrendData[]
  ): string[] => {
    const insights: string[] = [];

    // Health score insights
    if (metrics.healthScoreAverage > 85) {
      insights.push('Excellent overall health scores across the organization');
    } else if (metrics.healthScoreAverage < 70) {
      insights.push('Health scores below target - consider additional wellness initiatives');
    }

    // Utilization insights
    if (metrics.benefitsUtilization < 60) {
      insights.push('Benefits utilization is below optimal levels');
    }

    // Department performance insights
    const topDept = departments.reduce((prev, current) => 
      prev.healthScore > current.healthScore ? prev : current
    );
    const bottomDept = departments.reduce((prev, current) => 
      prev.healthScore < current.healthScore ? prev : current
    );

    if (topDept.healthScore - bottomDept.healthScore > 20) {
      insights.push(`Significant performance gap between ${topDept.name} and ${bottomDept.name}`);
    }

    // Trend insights
    if (trends.length >= 2) {
      const latest = trends[trends.length - 1];
      const previous = trends[trends.length - 2];
      const change = latest.healthScore - previous.healthScore;

      if (change > 5) {
        insights.push('Health scores showing positive upward trend');
      } else if (change < -5) {
        insights.push('Health scores declining - intervention recommended');
      }
    }

    return insights;
  }
};