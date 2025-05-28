import React, { createContext, ReactNode, useContext, useReducer } from 'react';

// Types
export interface AnonymizedEmployee {
  id: string; // Anonymized identifier
  demographics: {
    ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '65+';
    gender?: 'M' | 'F' | 'O' | 'P'; // P = Prefer not to say
    location: string;
    department: string;
    role: string;
    tenure: '0-1' | '1-2' | '2-5' | '5-10' | '10+'; // years
  };
  healthMetrics: {
    healthScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    engagementLevel: 'low' | 'medium' | 'high';
    lastActivity: string;
  };
  utilization: {
    preventativeCare: {
      physicals: boolean;
      dental: boolean;
      vision: boolean;
      screenings: number;
    };
    programs: {
      enrolled: string[];
      completed: string[];
      active: string[];
    };
    benefits: {
      healthInsurance: boolean;
      dental: boolean;
      vision: boolean;
      wellness: boolean;
    };
  };
  outcomes: {
    completedScreenings: number;
    riskReduction: number;
    costSavings: number;
    productivityGains: number;
  };
  trends: {
    healthScoreChange: number;
    engagementTrend: 'improving' | 'declining' | 'stable';
    utilizationTrend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface AggregatedData {
  total: {
    employees: number;
    departments: number;
    locations: number;
    activeUsers: number;
  };
  demographics: {
    ageDistribution: { [key: string]: number };
    genderDistribution: { [key: string]: number };
    tenureDistribution: { [key: string]: number };
    departmentDistribution: { [key: string]: number };
  };
  health: {
    averageHealthScore: number;
    riskDistribution: { [key: string]: number };
    engagementDistribution: { [key: string]: number };
    topHealthConcerns: string[];
  };
  utilization: {
    preventativeCareRates: {
      physicals: number;
      dental: number;
      vision: number;
      screenings: number;
    };
    programParticipation: {
      [programId: string]: {
        enrolled: number;
        completed: number;
        completionRate: number;
      };
    };
    benefitsUtilization: {
      healthInsurance: number;
      dental: number;
      vision: number;
      wellness: number;
    };
  };
  outcomes: {
    totalCostSavings: number;
    averageRiskReduction: number;
    productivityImprovements: number;
    earlyDetections: number;
  };
  trends: {
    healthScoreTrend: { period: string; score: number }[];
    utilizationTrend: { period: string; rate: number }[];
    engagementTrend: { period: string; level: number }[];
  };
  benchmarks: {
    industryAverage: {
      healthScore: number;
      utilizationRate: number;
      engagementLevel: number;
    };
    companyRanking: {
      healthScore: number; // percentile
      utilization: number; // percentile
      engagement: number; // percentile
    };
  };
}

export interface PrivacySettings {
  dataRetention: {
    anonymizationPeriod: number; // days
    deletionPeriod: number; // days
    aggregationLevel: 'individual' | 'department' | 'company';
  };
  sharing: {
    allowBenchmarking: boolean;
    allowResearch: boolean;
    shareWithInsurer: boolean;
    shareWithProviders: boolean;
  };
  compliance: {
    hipaaCompliant: boolean;
    gdprCompliant: boolean;
    lastAudit: string;
    consentStatus: 'all' | 'partial' | 'none';
  };
}

export interface DataInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metrics: {
    current: number;
    target?: number;
    trend?: number;
  };
  recommendations: string[];
  affectedGroups: {
    departments: string[];
    demographics: string[];
    count: number;
  };
  potentialImpact: {
    healthImprovement: number;
    costSavings: number;
    participation: number;
  };
  confidence: number; // 0-100
  generatedAt: string;
}

export interface EmployeeDataState {
  employees: AnonymizedEmployee[];
  aggregatedData: AggregatedData;
  insights: DataInsight[];
  privacySettings: PrivacySettings;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  filters: {
    departments: string[];
    ageRanges: string[];
    tenureRanges: string[];
    riskLevels: string[];
    engagementLevels: string[];
    locations: string[];
  };
  selectedMetric: 'healthScore' | 'utilization' | 'engagement' | 'outcomes';
  timeRange: '30d' | '90d' | '1y' | 'all';
  viewMode: 'overview' | 'detailed' | 'insights' | 'trends';
}

// Action Types
type EmployeeDataAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EMPLOYEES'; payload: AnonymizedEmployee[] }
  | { type: 'SET_AGGREGATED_DATA'; payload: AggregatedData }
  | { type: 'SET_INSIGHTS'; payload: DataInsight[] }
  | { type: 'ADD_INSIGHT'; payload: DataInsight }
  | { type: 'DISMISS_INSIGHT'; payload: string }
  | { type: 'SET_PRIVACY_SETTINGS'; payload: PrivacySettings }
  | { type: 'SET_FILTERS'; payload: Partial<EmployeeDataState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SELECTED_METRIC'; payload: EmployeeDataState['selectedMetric'] }
  | { type: 'SET_TIME_RANGE'; payload: EmployeeDataState['timeRange'] }
  | { type: 'SET_VIEW_MODE'; payload: EmployeeDataState['viewMode'] }
  | { type: 'UPDATE_LAST_UPDATED'; payload: string }
  | { type: 'REFRESH_DATA' };

// Initial State
const initialState: EmployeeDataState = {
  employees: [],
  aggregatedData: {
    total: {
      employees: 0,
      departments: 0,
      locations: 0,
      activeUsers: 0
    },
    demographics: {
      ageDistribution: {},
      genderDistribution: {},
      tenureDistribution: {},
      departmentDistribution: {}
    },
    health: {
      averageHealthScore: 0,
      riskDistribution: {},
      engagementDistribution: {},
      topHealthConcerns: []
    },
    utilization: {
      preventativeCareRates: {
        physicals: 0,
        dental: 0,
        vision: 0,
        screenings: 0
      },
      programParticipation: {},
      benefitsUtilization: {
        healthInsurance: 0,
        dental: 0,
        vision: 0,
        wellness: 0
      }
    },
    outcomes: {
      totalCostSavings: 0,
      averageRiskReduction: 0,
      productivityImprovements: 0,
      earlyDetections: 0
    },
    trends: {
      healthScoreTrend: [],
      utilizationTrend: [],
      engagementTrend: []
    },
    benchmarks: {
      industryAverage: {
        healthScore: 0,
        utilizationRate: 0,
        engagementLevel: 0
      },
      companyRanking: {
        healthScore: 0,
        utilization: 0,
        engagement: 0
      }
    }
  },
  insights: [],
  privacySettings: {
    dataRetention: {
      anonymizationPeriod: 30,
      deletionPeriod: 365,
      aggregationLevel: 'department'
    },
    sharing: {
      allowBenchmarking: false,
      allowResearch: false,
      shareWithInsurer: false,
      shareWithProviders: false
    },
    compliance: {
      hipaaCompliant: true,
      gdprCompliant: true,
      lastAudit: '',
      consentStatus: 'all'
    }
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
  filters: {
    departments: [],
    ageRanges: [],
    tenureRanges: [],
    riskLevels: [],
    engagementLevels: [],
    locations: []
  },
  selectedMetric: 'healthScore',
  timeRange: '90d',
  viewMode: 'overview'
};

// Reducer
function employeeDataReducer(state: EmployeeDataState, action: EmployeeDataAction): EmployeeDataState {
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

    case 'SET_EMPLOYEES':
      return {
        ...state,
        employees: action.payload,
        isLoading: false,
        error: null
      };

    case 'SET_AGGREGATED_DATA':
      return {
        ...state,
        aggregatedData: action.payload
      };

    case 'SET_INSIGHTS':
      return {
        ...state,
        insights: action.payload
      };

    case 'ADD_INSIGHT':
      return {
        ...state,
        insights: [...state.insights, action.payload]
      };

    case 'DISMISS_INSIGHT':
      return {
        ...state,
        insights: state.insights.filter(insight => insight.id !== action.payload)
      };

    case 'SET_PRIVACY_SETTINGS':
      return {
        ...state,
        privacySettings: action.payload
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          departments: [],
          ageRanges: [],
          tenureRanges: [],
          riskLevels: [],
          engagementLevels: [],
          locations: []
        }
      };

    case 'SET_SELECTED_METRIC':
      return {
        ...state,
        selectedMetric: action.payload
      };

    case 'SET_TIME_RANGE':
      return {
        ...state,
        timeRange: action.payload
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      };

    case 'UPDATE_LAST_UPDATED':
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
interface EmployeeDataContextType {
  state: EmployeeDataState;
  dispatch: React.Dispatch<EmployeeDataAction>;
  
  // Action creators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmployees: (employees: AnonymizedEmployee[]) => void;
  setAggregatedData: (data: AggregatedData) => void;
  setInsights: (insights: DataInsight[]) => void;
  addInsight: (insight: DataInsight) => void;
  dismissInsight: (id: string) => void;
  setPrivacySettings: (settings: PrivacySettings) => void;
  setFilters: (filters: Partial<EmployeeDataState['filters']>) => void;
  clearFilters: () => void;
  setSelectedMetric: (metric: EmployeeDataState['selectedMetric']) => void;
  setTimeRange: (range: EmployeeDataState['timeRange']) => void;
  setViewMode: (mode: EmployeeDataState['viewMode']) => void;
  refreshData: () => void;
  
  // Computed values
  getFilteredEmployees: () => AnonymizedEmployee[];
  getFilteredAggregatedData: () => AggregatedData;
  getDepartmentComparison: () => Array<{
    department: string;
    employees: number;
    healthScore: number;
    utilization: number;
    engagement: number;
  }>;
  getRiskAnalysis: () => {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    recommendations: string[];
  };
  getEngagementAnalysis: () => {
    active: number;
    declining: number;
    opportunities: string[];
  };
  getUtilizationGaps: () => Array<{
    service: string;
    currentRate: number;
    targetRate: number;
    gap: number;
    affectedEmployees: number;
  }>;
  generateInsights: () => DataInsight[];
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(undefined);

// Provider
interface EmployeeDataProviderProps {
  children: ReactNode;
}

export function EmployeeDataProvider({ children }: EmployeeDataProviderProps) {
  const [state, dispatch] = useReducer(employeeDataReducer, initialState);

  // Action creators
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const setSelectedMetric = (metric: EmployeeDataState['selectedMetric']) => {
    dispatch({ type: 'SET_SELECTED_METRIC', payload: metric });
  };

  const setTimeRange = (range: EmployeeDataState['timeRange']) => {
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
  };

  const setViewMode = (mode: EmployeeDataState['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const refreshData = () => {
    dispatch({ type: 'REFRESH_DATA' });
  };

  // Computed values
  const getFilteredEmployees = (): AnonymizedEmployee[] => {
    let filtered = [...state.employees];

    // Apply department filter
    if (state.filters.departments.length > 0) {
      filtered = filtered.filter(emp => 
        state.filters.departments.includes(emp.demographics.department)
      );
    }

    // Apply age range filter
    if (state.filters.ageRanges.length > 0) {
      filtered = filtered.filter(emp => 
        state.filters.ageRanges.includes(emp.demographics.ageRange)
      );
    }

    // Apply tenure filter
    if (state.filters.tenureRanges.length > 0) {
      filtered = filtered.filter(emp => 
        state.filters.tenureRanges.includes(emp.demographics.tenure)
      );
    }

    // Apply risk level filter
    if (state.filters.riskLevels.length > 0) {
      filtered = filtered.filter(emp => 
        state.filters.riskLevels.includes(emp.healthMetrics.riskLevel)
      );
    }

    // Apply engagement level filter
    if (state.filters.engagementLevels.length > 0) {
      filtered = filtered.filter(emp => 
        state.filters.engagementLevels.includes(emp.healthMetrics.engagementLevel)
      );
    }

    // Apply location filter
    if (state.filters.locations.length > 0) {
      filtered = filtered.filter(emp => 
        state.filters.locations.includes(emp.demographics.location)
      );
    }

    return filtered;
  };

  const getFilteredAggregatedData = (): AggregatedData => {
    const filteredEmployees = getFilteredEmployees();
    
    if (filteredEmployees.length === 0) {
      return state.aggregatedData;
    }

    // Recalculate aggregated data based on filtered employees
    const totalEmployees = filteredEmployees.length;
    const avgHealthScore = filteredEmployees.reduce((sum, emp) => 
      sum + emp.healthMetrics.healthScore, 0) / totalEmployees;

    const departments = new Set(filteredEmployees.map(emp => emp.demographics.department));
    const locations = new Set(filteredEmployees.map(emp => emp.demographics.location));

    return {
      ...state.aggregatedData,
      total: {
        ...state.aggregatedData.total,
        employees: totalEmployees,
        departments: departments.size,
        locations: locations.size
      },
      health: {
        ...state.aggregatedData.health,
        averageHealthScore: avgHealthScore
      }
    };
  };

  const getDepartmentComparison = () => {
    const filteredEmployees = getFilteredEmployees();
    const departmentStats: { [key: string]: any } = {};

    filteredEmployees.forEach(emp => {
      const dept = emp.demographics.department;
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          department: dept,
          employees: 0,
          healthScoreSum: 0,
          utilizationSum: 0,
          engagementSum: 0
        };
      }

      departmentStats[dept].employees++;
      departmentStats[dept].healthScoreSum += emp.healthMetrics.healthScore;
      
      // Calculate utilization rate
      const utilization = (
        (emp.utilization.preventativeCare.physicals ? 1 : 0) +
        (emp.utilization.preventativeCare.dental ? 1 : 0) +
        (emp.utilization.preventativeCare.vision ? 1 : 0)
      ) / 3 * 100;
      departmentStats[dept].utilizationSum += utilization;

      // Convert engagement level to numeric
      const engagement = emp.healthMetrics.engagementLevel === 'high' ? 100 : 
                        emp.healthMetrics.engagementLevel === 'medium' ? 60 : 30;
      departmentStats[dept].engagementSum += engagement;
    });

    return Object.values(departmentStats).map((dept: any) => ({
      department: dept.department,
      employees: dept.employees,
      healthScore: Math.round(dept.healthScoreSum / dept.employees),
      utilization: Math.round(dept.utilizationSum / dept.employees),
      engagement: Math.round(dept.engagementSum / dept.employees)
    }));
  };

  const getRiskAnalysis = () => {
    const filteredEmployees = getFilteredEmployees();
    const riskCounts = {
      high: filteredEmployees.filter(emp => emp.healthMetrics.riskLevel === 'high').length,
      medium: filteredEmployees.filter(emp => emp.healthMetrics.riskLevel === 'medium').length,
      low: filteredEmployees.filter(emp => emp.healthMetrics.riskLevel === 'low').length
    };

    const recommendations: string[] = [];
    
    if (riskCounts.high > filteredEmployees.length * 0.15) {
      recommendations.push('High number of high-risk employees - consider targeted interventions');
    }
    
    if (riskCounts.medium > filteredEmployees.length * 0.4) {
      recommendations.push('Large medium-risk population - opportunity for prevention programs');
    }

    return {
      highRisk: riskCounts.high,
      mediumRisk: riskCounts.medium,
      lowRisk: riskCounts.low,
      recommendations
    };
  };

  const getEngagementAnalysis = () => {
    const filteredEmployees = getFilteredEmployees();
    const engagementCounts = {
      high: filteredEmployees.filter(emp => emp.healthMetrics.engagementLevel === 'high').length,
      medium: filteredEmployees.filter(emp => emp.healthMetrics.engagementLevel === 'medium').length,
      low: filteredEmployees.filter(emp => emp.healthMetrics.engagementLevel === 'low').length
    };

    const declining = filteredEmployees.filter(emp => 
      emp.trends.engagementTrend === 'declining'
    ).length;

    const opportunities: string[] = [];
    
    if (engagementCounts.low > filteredEmployees.length * 0.2) {
      opportunities.push('Significant low-engagement population needs attention');
    }
    
    if (declining > filteredEmployees.length * 0.15) {
      opportunities.push('Growing number of employees showing declining engagement');
    }

    return {
      active: engagementCounts.high,
      declining,
      opportunities
    };
  };

  const getUtilizationGaps = () => {
    const filteredEmployees = getFilteredEmployees();
    const services = [
      { 
        name: 'physicals', 
        current: filteredEmployees.filter(emp => emp.utilization.preventativeCare.physicals).length,
        target: 0.9 
      },
      { 
        name: 'dental', 
        current: filteredEmployees.filter(emp => emp.utilization.preventativeCare.dental).length,
        target: 0.8 
      },
      { 
        name: 'vision', 
        current: filteredEmployees.filter(emp => emp.utilization.preventativeCare.vision).length,
        target: 0.7 
      }
    ];

    return services.map(service => {
      const currentRate = (service.current / filteredEmployees.length) * 100;
      const targetRate = service.target * 100;
      const gap = Math.max(0, targetRate - currentRate);
      const affectedEmployees = Math.round((gap / 100) * filteredEmployees.length);

      return {
        service: service.name,
        currentRate,
        targetRate,
        gap,
        affectedEmployees
      };
    });
  };

  const generateInsights = (): DataInsight[] => {
    const filteredEmployees = getFilteredEmployees();
    const insights: DataInsight[] = [];

    // Health Score Insight
    const avgHealthScore = filteredEmployees.reduce((sum, emp) => 
      sum + emp.healthMetrics.healthScore, 0) / filteredEmployees.length;
    
    if (avgHealthScore < 70) {
      insights.push({
        id: `health_score_${Date.now()}`,
        type: 'risk',
        priority: 'high',
        title: 'Below Average Health Scores',
        description: `Company health score average of ${avgHealthScore.toFixed(1)} is below the recommended threshold of 70`,
        metrics: {
          current: avgHealthScore,
          target: 70,
          trend: -5
        },
        recommendations: [
          'Launch targeted wellness programs',
          'Increase preventative care awareness',
          'Consider health coaching services'
        ],
        affectedGroups: {
          departments: [...new Set(filteredEmployees.map(emp => emp.demographics.department))],
          demographics: ['All age groups'],
          count: filteredEmployees.length
        },
        potentialImpact: {
          healthImprovement: 15,
          costSavings: 50000,
          participation: 25
        },
        confidence: 85,
        generatedAt: new Date().toISOString()
      });
    }

    // Utilization Gap Insight
    const utilizationGaps = getUtilizationGaps();
    const biggestGap = utilizationGaps.reduce((max, gap) => 
      gap.gap > max.gap ? gap : max, utilizationGaps[0]);

    if (biggestGap && biggestGap.gap > 20) {
      insights.push({
        id: `utilization_gap_${Date.now()}`,
        type: 'opportunity',
        priority: 'medium',
        title: `Low ${biggestGap.service} Utilization`,
        description: `Only ${biggestGap.currentRate.toFixed(1)}% of employees are utilizing ${biggestGap.service} services`,
        metrics: {
          current: biggestGap.currentRate,
          target: biggestGap.targetRate,
          trend: 0
        },
        recommendations: [
          'Send targeted reminders',
          'Simplify scheduling process',
          'Provide education on benefits'
        ],
        affectedGroups: {
          departments: [...new Set(filteredEmployees.map(emp => emp.demographics.department))],
          demographics: ['All employees'],
          count: biggestGap.affectedEmployees
        },
        potentialImpact: {
          healthImprovement: 10,
          costSavings: 25000,
          participation: biggestGap.gap
        },
        confidence: 75,
        generatedAt: new Date().toISOString()
      });
    }

    return insights;
  };

  const contextValue: EmployeeDataContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setEmployees,
    setAggregatedData,
    setInsights,
    addInsight,
    dismissInsight,
    setPrivacySettings,
    setFilters,
    clearFilters,
    setSelectedMetric,
    setTimeRange,
    setViewMode,
    refreshData,
    getFilteredEmployees,
    getFilteredAggregatedData,
    getDepartmentComparison,
    getRiskAnalysis,
    getEngagementAnalysis,
    getUtilizationGaps,
    generateInsights
  };

  return (
    <EmployeeDataContext.Provider value={contextValue}>
      {children}
    </EmployeeDataContext.Provider>
  );
}

// Hook
export function useEmployeeData() {
  const context = useContext(EmployeeDataContext);
  if (context === undefined) {
    throw new Error('useEmployeeData must be used within an EmployeeDataProvider');
  }
  return context;
}

// Utility functions
export const employeeDataUtils = {
  // Anonymize employee ID
  anonymizeId: (originalId: string): string => {
    return `anon_${btoa(originalId).substring(0, 8)}`;
  },

  // Convert age to age range
  ageToRange: (age: number): AnonymizedEmployee['demographics']['ageRange'] => {
    if (age < 26) return '18-25';
    if (age < 36) return '26-35';
    if (age < 46) return '36-45';
    if (age < 56) return '46-55';
    if (age < 66) return '56-65';
    return '65+';
  },

  // Convert tenure to range
  tenureToRange: (years: number): AnonymizedEmployee['demographics']['tenure'] => {
    if (years < 1) return '0-1';
    if (years < 2) return '1-2';
    if (years < 5) return '2-5';
    if (years < 10) return '5-10';
    return '10+';
  },

  // Calculate risk level
  calculateRiskLevel: (healthScore: number, age: number, conditions: string[]): 'low' | 'medium' | 'high' => {
    let riskScore = 0;
    
    if (healthScore < 60) riskScore += 3;
    else if (healthScore < 80) riskScore += 1;
    
    if (age > 55) riskScore += 2;
    else if (age > 45) riskScore += 1;
    
    riskScore += conditions.length;
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  },

  // Format percentage
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Get trend direction
  getTrendDirection: (current: number, previous: number): 'improving' | 'declining' | 'stable' => {
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  },

  // Validate privacy compliance
  validatePrivacyCompliance: (settings: PrivacySettings): string[] => {
    const issues: string[] = [];
    
    if (!settings.compliance.hipaaCompliant) {
      issues.push('HIPAA compliance not verified');
    }
    
    if (!settings.compliance.gdprCompliant) {
      issues.push('GDPR compliance not verified');
    }
    
    if (settings.compliance.consentStatus !== 'all') {
      issues.push('Not all employees have provided consent');
    }
    
    const lastAudit = new Date(settings.compliance.lastAudit);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (lastAudit < oneYearAgo) {
      issues.push('Compliance audit is overdue');
    }
    
    return issues;
  },

  // Export anonymized data
  exportAnonymizedData: (employees: AnonymizedEmployee[], format: 'csv' | 'json' = 'json'): string => {
    const exportData = employees.map(emp => ({
      id: emp.id,
      ageRange: emp.demographics.ageRange,
      department: emp.demographics.department,
      tenure: emp.demographics.tenure,
      healthScore: emp.healthMetrics.healthScore,
      riskLevel: emp.healthMetrics.riskLevel,
      engagementLevel: emp.healthMetrics.engagementLevel,
      preventativeCareUtilization: [
        emp.utilization.preventativeCare.physicals,
        emp.utilization.preventativeCare.dental,
        emp.utilization.preventativeCare.vision
      ].filter(Boolean).length,
      totalCostSavings: emp.outcomes.costSavings
    }));

    if (format === 'csv') {
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(row => Object.values(row).join(','));
      return [headers, ...rows].join('\n');
    }

  return JSON.stringify(exportData, null, 2);
  }
};

const setLoading = (loading: boolean) => {
  dispatch({ type: 'SET_LOADING', payload: loading });
};

const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setEmployees = (employees: AnonymizedEmployee[]) => {
    dispatch({ type: 'SET_EMPLOYEES', payload: employees });
  };

  const setAggregatedData = (data: AggregatedData) => {
    dispatch({ type: 'SET_AGGREGATED_DATA', payload: data });
  };

  const setInsights = (insights: DataInsight[]) => {
    dispatch({ type: 'SET_INSIGHTS', payload: insights });
  };

  const addInsight = (insight: DataInsight) => {
    dispatch({ type: 'ADD_INSIGHT', payload: insight });
  };

  const dismissInsight = (id: string) => {
    dispatch({ type: 'DISMISS_INSIGHT', payload: id });
  };

  const setPrivacySettings = (settings: PrivacySettings) => {
    dispatch({ type: 'SET_PRIVACY_SETTINGS', payload: settings });
  };

  const setFilters = (filters: Partial<EmployeeDataState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

const clearFilters = () => {
  dispatch({ type: 'CLEAR_FILTERS' });
};