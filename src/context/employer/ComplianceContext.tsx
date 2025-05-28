import React, { createContext, ReactNode, useContext, useReducer } from 'react';

// Types
export interface ComplianceFramework {
  id: string;
  name: string;
  category: 'privacy' | 'security' | 'healthcare' | 'financial' | 'industry';
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending' | 'not-applicable';
  requirements: ComplianceRequirement[];
  lastAssessment: string;
  nextAssessment: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  certificationRequired: boolean;
  certificationStatus?: 'valid' | 'expired' | 'pending' | 'not-required';
  certificationExpiry?: string;
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'partial' | 'non-compliant' | 'pending';
  evidence: Evidence[];
  controls: Control[];
  lastReview: string;
  nextReview: string;
  assignedTo: string;
  dueDate: string;
}

export interface Evidence {
  id: string;
  requirementId: string;
  type: 'document' | 'process' | 'technical' | 'audit';
  title: string;
  description: string;
  url?: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'pending' | 'rejected';
  reviewer: string;
}

export interface Control {
  id: string;
  requirementId: string;
  name: string;
  type: 'administrative' | 'technical' | 'physical';
  description: string;
  implementation: 'implemented' | 'partial' | 'planned' | 'not-implemented';
  effectiveness: 'effective' | 'needs-improvement' | 'ineffective' | 'not-tested';
  testingFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastTested: string;
  nextTest: string;
  owner: string;
}

export interface AuditEvent {
  id: string;
  type: 'internal' | 'external' | 'self-assessment' | 'certification';
  title: string;
  scope: string[];
  auditor: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  findings: AuditFinding[];
  recommendations: string[];
  finalScore?: number;
  reportUrl?: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  requirement: string;
  evidence: string;
  recommendation: string;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted-risk';
  assignedTo: string;
  dueDate: string;
  resolution?: string;
  resolvedDate?: string;
}

export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  category: 'data-privacy' | 'security' | 'operational' | 'compliance' | 'reputation';
  likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  impact: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  riskScore: number;
  currentControls: string[];
  proposedControls: string[];
  owner: string;
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'transferred';
  lastReview: string;
  nextReview: string;
}

export interface ComplianceMetric {
  id: string;
  name: string;
  category: string;
  value: number;
  target: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
  period: string;
  benchmark?: number;
  thresholds: {
    green: number;
    yellow: number;
    red: number;
  };
}

export interface ComplianceState {
  frameworks: ComplianceFramework[];
  requirements: ComplianceRequirement[];
  evidence: Evidence[];
  controls: Control[];
  audits: AuditEvent[];
  findings: AuditFinding[];
  risks: RiskAssessment[];
  metrics: ComplianceMetric[];
  isLoading: boolean;
  error: string | null;
  selectedFramework: string | null;
  filters: {
    status: string[];
    priority: string[];
    category: string[];
    assignee: string[];
    dateRange: {
      start: string;
      end: string;
    };
  };
  viewMode: 'dashboard' | 'requirements' | 'audits' | 'risks' | 'reports';
  notifications: ComplianceNotification[];
}

export interface ComplianceNotification {
  id: string;
  type: 'due-date' | 'overdue' | 'certification-expiry' | 'audit-required' | 'finding-escalation';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  relatedId: string;
  relatedType: 'requirement' | 'audit' | 'finding' | 'certification';
  dueDate?: string;
  dismissed: boolean;
  createdAt: string;
}

// Action Types
type ComplianceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FRAMEWORKS'; payload: ComplianceFramework[] }
  | { type: 'UPDATE_FRAMEWORK'; payload: { id: string; updates: Partial<ComplianceFramework> } }
  | { type: 'SET_REQUIREMENTS'; payload: ComplianceRequirement[] }
  | { type: 'UPDATE_REQUIREMENT'; payload: { id: string; updates: Partial<ComplianceRequirement> } }
  | { type: 'SET_EVIDENCE'; payload: Evidence[] }
  | { type: 'ADD_EVIDENCE'; payload: Evidence }
  | { type: 'UPDATE_EVIDENCE'; payload: { id: string; updates: Partial<Evidence> } }
  | { type: 'SET_CONTROLS'; payload: Control[] }
  | { type: 'UPDATE_CONTROL'; payload: { id: string; updates: Partial<Control> } }
  | { type: 'SET_AUDITS'; payload: AuditEvent[] }
  | { type: 'ADD_AUDIT'; payload: AuditEvent }
  | { type: 'UPDATE_AUDIT'; payload: { id: string; updates: Partial<AuditEvent> } }
  | { type: 'SET_FINDINGS'; payload: AuditFinding[] }
  | { type: 'UPDATE_FINDING'; payload: { id: string; updates: Partial<AuditFinding> } }
  | { type: 'SET_RISKS'; payload: RiskAssessment[] }
  | { type: 'ADD_RISK'; payload: RiskAssessment }
  | { type: 'UPDATE_RISK'; payload: { id: string; updates: Partial<RiskAssessment> } }
  | { type: 'SET_METRICS'; payload: ComplianceMetric[] }
  | { type: 'SET_SELECTED_FRAMEWORK'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<ComplianceState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_VIEW_MODE'; payload: ComplianceState['viewMode'] }
  | { type: 'SET_NOTIFICATIONS'; payload: ComplianceNotification[] }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'REFRESH_DATA' };

// Initial State
const initialState: ComplianceState = {
  frameworks: [],
  requirements: [],
  evidence: [],
  controls: [],
  audits: [],
  findings: [],
  risks: [],
  metrics: [],
  isLoading: false,
  error: null,
  selectedFramework: null,
  filters: {
    status: [],
    priority: [],
    category: [],
    assignee: [],
    dateRange: {
      start: '',
      end: ''
    }
  },
  viewMode: 'dashboard',
  notifications: []
};

// Reducer
function complianceReducer(state: ComplianceState, action: ComplianceAction): ComplianceState {
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

    case 'SET_FRAMEWORKS':
      return {
        ...state,
        frameworks: action.payload,
        isLoading: false,
        error: null
      };

    case 'UPDATE_FRAMEWORK':
      return {
        ...state,
        frameworks: state.frameworks.map(framework =>
          framework.id === action.payload.id
            ? { ...framework, ...action.payload.updates }
            : framework
        )
      };

    case 'SET_REQUIREMENTS':
      return {
        ...state,
        requirements: action.payload
      };

    case 'UPDATE_REQUIREMENT':
      return {
        ...state,
        requirements: state.requirements.map(requirement =>
          requirement.id === action.payload.id
            ? { ...requirement, ...action.payload.updates }
            : requirement
        )
      };

    case 'SET_EVIDENCE':
      return {
        ...state,
        evidence: action.payload
      };

    case 'ADD_EVIDENCE':
      return {
        ...state,
        evidence: [...state.evidence, action.payload]
      };

    case 'UPDATE_EVIDENCE':
      return {
        ...state,
        evidence: state.evidence.map(evidence =>
          evidence.id === action.payload.id
            ? { ...evidence, ...action.payload.updates }
            : evidence
        )
      };

    case 'SET_CONTROLS':
      return {
        ...state,
        controls: action.payload
      };

    case 'UPDATE_CONTROL':
      return {
        ...state,
        controls: state.controls.map(control =>
          control.id === action.payload.id
            ? { ...control, ...action.payload.updates }
            : control
        )
      };

    case 'SET_AUDITS':
      return {
        ...state,
        audits: action.payload
      };

    case 'ADD_AUDIT':
      return {
        ...state,
        audits: [...state.audits, action.payload]
      };

    case 'UPDATE_AUDIT':
      return {
        ...state,
        audits: state.audits.map(audit =>
          audit.id === action.payload.id
            ? { ...audit, ...action.payload.updates }
            : audit
        )
      };

    case 'SET_FINDINGS':
      return {
        ...state,
        findings: action.payload
      };

    case 'UPDATE_FINDING':
      return {
        ...state,
        findings: state.findings.map(finding =>
          finding.id === action.payload.id
            ? { ...finding, ...action.payload.updates }
            : finding
        )
      };

    case 'SET_RISKS':
      return {
        ...state,
        risks: action.payload
      };

    case 'ADD_RISK':
      return {
        ...state,
        risks: [...state.risks, action.payload]
      };

    case 'UPDATE_RISK':
      return {
        ...state,
        risks: state.risks.map(risk =>
          risk.id === action.payload.id
            ? { ...risk, ...action.payload.updates }
            : risk
        )
      };

    case 'SET_METRICS':
      return {
        ...state,
        metrics: action.payload
      };

    case 'SET_SELECTED_FRAMEWORK':
      return {
        ...state,
        selectedFramework: action.payload
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
          status: [],
          priority: [],
          category: [],
          assignee: [],
          dateRange: {
            start: '',
            end: ''
          }
        }
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      };

    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      };

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, dismissed: true }
            : notification
        )
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
interface ComplianceContextType {
  state: ComplianceState;
  dispatch: React.Dispatch<ComplianceAction>;
  
  // Action creators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFrameworks: (frameworks: ComplianceFramework[]) => void;
  updateFramework: (id: string, updates: Partial<ComplianceFramework>) => void;
  setRequirements: (requirements: ComplianceRequirement[]) => void;
  updateRequirement: (id: string, updates: Partial<ComplianceRequirement>) => void;
  setEvidence: (evidence: Evidence[]) => void;
  addEvidence: (evidence: Evidence) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  setControls: (controls: Control[]) => void;
  updateControl: (id: string, updates: Partial<Control>) => void;
  setAudits: (audits: AuditEvent[]) => void;
  addAudit: (audit: AuditEvent) => void;
  updateAudit: (id: string, updates: Partial<AuditEvent>) => void;
  setFindings: (findings: AuditFinding[]) => void;
  updateFinding: (id: string, updates: Partial<AuditFinding>) => void;
  setRisks: (risks: RiskAssessment[]) => void;
  addRisk: (risk: RiskAssessment) => void;
  updateRisk: (id: string, updates: Partial<RiskAssessment>) => void;
  setMetrics: (metrics: ComplianceMetric[]) => void;
  setSelectedFramework: (id: string | null) => void;
  setFilters: (filters: Partial<ComplianceState['filters']>) => void;
  clearFilters: () => void;
  setViewMode: (mode: ComplianceState['viewMode']) => void;
  setNotifications: (notifications: ComplianceNotification[]) => void;
  dismissNotification: (id: string) => void;
  refreshData: () => void;
  
  // Computed values
  getOverallComplianceScore: () => number;
  getFrameworkByCategory: (category: string) => ComplianceFramework[];
  getRequirementsByFramework: (frameworkId: string) => ComplianceRequirement[];
  getOverdueRequirements: () => ComplianceRequirement[];
  getCriticalFindings: () => AuditFinding[];
  getHighRiskAssessments: () => RiskAssessment[];
  getComplianceGaps: () => Array<{
    framework: string;
    requirement: string;
    gap: string;
    priority: string;
  }>;
  getUpcomingDeadlines: () => Array<{
    type: 'requirement' | 'audit' | 'certification';
    title: string;
    date: string;
    priority: string;
  }>;
  getComplianceTrends: () => Array<{
    period: string;
    score: number;
    frameworks: number;
    requirements: number;
  }>;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

// Provider
interface ComplianceProviderProps {
  children: ReactNode;
}

export function ComplianceProvider({ children }: ComplianceProviderProps) {
  const [state, dispatch] = useReducer(complianceReducer, initialState);

  // Action creators
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setFrameworks = (frameworks: ComplianceFramework[]) => {
    dispatch({ type: 'SET_FRAMEWORKS', payload: frameworks });
  };

  const updateFramework = (id: string, updates: Partial<ComplianceFramework>) => {
    dispatch({ type: 'UPDATE_FRAMEWORK', payload: { id, updates } });
  };

  const setRequirements = (requirements: ComplianceRequirement[]) => {
    dispatch({ type: 'SET_REQUIREMENTS', payload: requirements });
  };

  const updateRequirement = (id: string, updates: Partial<ComplianceRequirement>) => {
    dispatch({ type: 'UPDATE_REQUIREMENT', payload: { id, updates } });
  };

  const setEvidence = (evidence: Evidence[]) => {
    dispatch({ type: 'SET_EVIDENCE', payload: evidence });
  };

  const addEvidence = (evidence: Evidence) => {
    dispatch({ type: 'ADD_EVIDENCE', payload: evidence });
  };

  const updateEvidence = (id: string, updates: Partial<Evidence>) => {
    dispatch({ type: 'UPDATE_EVIDENCE', payload: { id, updates } });
  };

  const setControls = (controls: Control[]) => {
    dispatch({ type: 'SET_CONTROLS', payload: controls });
  };

  const updateControl = (id: string, updates: Partial<Control>) => {
    dispatch({ type: 'UPDATE_CONTROL', payload: { id, updates } });
  };

  const setAudits = (audits: AuditEvent[]) => {
    dispatch({ type: 'SET_AUDITS', payload: audits });
  };

  const addAudit = (audit: AuditEvent) => {
    dispatch({ type: 'ADD_AUDIT', payload: audit });
  };

  const updateAudit = (id: string, updates: Partial<AuditEvent>) => {
    dispatch({ type: 'UPDATE_AUDIT', payload: { id, updates } });
  };

  const setFindings = (findings: AuditFinding[]) => {
    dispatch({ type: 'SET_FINDINGS', payload: findings });
  };

  const updateFinding = (id: string, updates: Partial<AuditFinding>) => {
    dispatch({ type: 'UPDATE_FINDING', payload: { id, updates } });
  };

  const setRisks = (risks: RiskAssessment[]) => {
    dispatch({ type: 'SET_RISKS', payload: risks });
  };

  const addRisk = (risk: RiskAssessment) => {
    dispatch({ type: 'ADD_RISK', payload: risk });
  };

  const updateRisk = (id: string, updates: Partial<RiskAssessment>) => {
    dispatch({ type: 'UPDATE_RISK', payload: { id, updates } });
  };

  const setMetrics = (metrics: ComplianceMetric[]) => {
    dispatch({ type: 'SET_METRICS', payload: metrics });
  };

  const setSelectedFramework = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_FRAMEWORK', payload: id });
  };

  const setFilters = (filters: Partial<ComplianceState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const setViewMode = (mode: ComplianceState['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const setNotifications = (notifications: ComplianceNotification[]) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  };

  const dismissNotification = (id: string) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
  };

  const refreshData = () => {
    dispatch({ type: 'REFRESH_DATA' });
  };

  // Computed values
  const getOverallComplianceScore = (): number => {
    if (state.frameworks.length === 0) return 0;
    
    const totalScore = state.frameworks.reduce((sum, framework) => {
      const frameworkRequirements = state.requirements.filter(req => req.frameworkId === framework.id);
      if (frameworkRequirements.length === 0) return sum;
      
      const compliantRequirements = frameworkRequirements.filter(req => req.status === 'compliant').length;
      const frameworkScore = (compliantRequirements / frameworkRequirements.length) * 100;
      return sum + frameworkScore;
    }, 0);
    
    return Math.round(totalScore / state.frameworks.length);
  };

  const getFrameworkByCategory = (category: string): ComplianceFramework[] => {
    return state.frameworks.filter(framework => framework.category === category);
  };

  const getRequirementsByFramework = (frameworkId: string): ComplianceRequirement[] => {
    return state.requirements.filter(requirement => requirement.frameworkId === frameworkId);
  };

  const getOverdueRequirements = (): ComplianceRequirement[] => {
    const today = new Date();
    return state.requirements.filter(requirement => {
      const dueDate = new Date(requirement.dueDate);
      return dueDate < today && requirement.status !== 'compliant';
    });
  };

  const getCriticalFindings = (): AuditFinding[] => {
    return state.findings.filter(finding => 
      finding.severity === 'critical' && finding.status === 'open'
    );
  };

  const getHighRiskAssessments = (): RiskAssessment[] => {
    return state.risks.filter(risk => 
      risk.riskScore >= 15 && risk.status !== 'mitigated'
    );
  };

  const getComplianceGaps = () => {
    return state.requirements
      .filter(req => req.status !== 'compliant')
      .map(req => {
        const framework = state.frameworks.find(f => f.id === req.frameworkId);
        return {
          framework: framework?.name || 'Unknown',
          requirement: req.title,
          gap: req.status === 'non-compliant' ? 'Non-compliant' : 'Partially compliant',
          priority: req.priority
        };
      });
  };

  const getUpcomingDeadlines = () => {
    const deadlines: Array<{
      type: 'requirement' | 'audit' | 'certification';
      title: string;
      date: string;
      priority: string;
    }> = [];

    // Requirements
    state.requirements.forEach(req => {
      if (req.status !== 'compliant') {
        deadlines.push({
          type: 'requirement',
          title: req.title,
          date: req.dueDate,
          priority: req.priority
        });
      }
    });

    // Audits
    state.audits.forEach(audit => {
      if (audit.status === 'planned') {
        deadlines.push({
          type: 'audit',
          title: audit.title,
          date: audit.startDate,
          priority: 'medium'
        });
      }
    });

    // Certifications
    state.frameworks.forEach(framework => {
      if (framework.certificationRequired && framework.certificationExpiry) {
        const expiryDate = new Date(framework.certificationExpiry);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 90) {
          deadlines.push({
            type: 'certification',
            title: `${framework.name} Certification`,
            date: framework.certificationExpiry,
            priority: daysUntilExpiry <= 30 ? 'high' : 'medium'
          });
        }
      }
    });

    return deadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getComplianceTrends = () => {
    // This would typically come from historical data
    // For now, return mock trend data
    return [
      { period: '2024-01', score: 82, frameworks: 5, requirements: 45 },
      { period: '2024-02', score: 85, frameworks: 5, requirements: 47 },
      { period: '2024-03', score: 87, frameworks: 5, requirements: 48 },
      { period: '2024-04', score: getOverallComplianceScore(), frameworks: state.frameworks.length, requirements: state.requirements.length }
    ];
  };

  const contextValue: ComplianceContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setFrameworks,
    updateFramework,
    setRequirements,
    updateRequirement,
    setEvidence,
    addEvidence,
    updateEvidence,
    setControls,
    updateControl,
    setAudits,
    addAudit,
    updateAudit,
    setFindings,
    updateFinding,
    setRisks,
    addRisk,
    updateRisk,
    setMetrics,
    setSelectedFramework,
    setFilters,
    clearFilters,
    setViewMode,
    setNotifications,
    dismissNotification,
    refreshData,
    getOverallComplianceScore,
    getFrameworkByCategory,
    getRequirementsByFramework,
    getOverdueRequirements,
    getCriticalFindings,
    getHighRiskAssessments,
    getComplianceGaps,
    getUpcomingDeadlines,
    getComplianceTrends
  };

  return (
    <ComplianceContext.Provider value={contextValue}>
      {children}
    </ComplianceContext.Provider>
  );
}

// Hook
export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
}

// Utility functions
export const complianceUtils = {
  // Calculate risk score
  calculateRiskScore: (likelihood: string, impact: string): number => {
    const likelihoodValues = {
      'very-low': 1,
      'low': 2,
      'medium': 3,
      'high': 4,
      'very-high': 5
    };
    
    const impactValues = {
      'very-low': 1,
      'low': 2,
      'medium': 3,
      'high': 4,
      'very-high': 5
    };
    
    return likelihoodValues[likelihood as keyof typeof likelihoodValues] * 
           impactValues[impact as keyof typeof impactValues];
  },

  // Get compliance status color
  getComplianceStatusColor: (status: string): string => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'partial': return '#f59e0b';
      case 'non-compliant': return '#ef4444';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  },

  // Get risk level color
  getRiskLevelColor: (level: string): string => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  },

  // Calculate days until deadline
  getDaysUntilDeadline: (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Generate compliance report
  generateComplianceReport: (
    frameworks: ComplianceFramework[],
    requirements: ComplianceRequirement[],
    findings: AuditFinding[]
  ) => {
    const totalRequirements = requirements.length;
    const compliantRequirements = requirements.filter(req => req.status === 'compliant').length;
    const overallScore = totalRequirements > 0 ? (compliantRequirements / totalRequirements) * 100 : 0;
    
    const criticalFindings = findings.filter(finding => finding.severity === 'critical');
    const openFindings = findings.filter(finding => finding.status === 'open');
    
    return {
      overallScore: Math.round(overallScore),
      totalFrameworks: frameworks.length,
      compliantFrameworks: frameworks.filter(f => f.status === 'compliant').length,
      totalRequirements,
      compliantRequirements,
      criticalFindings: criticalFindings.length,
      openFindings: openFindings.length,
      riskLevel: criticalFindings.length > 0 ? 'high' : openFindings.length > 5 ? 'medium' : 'low'
    };
  },

  // Validate evidence expiry
  validateEvidenceExpiry: (evidence: Evidence[], warningDays: number = 30): Evidence[] => {
    const today = new Date();
    const warningDate = new Date(today.getTime() + (warningDays * 24 * 60 * 60 * 1000));
    
    return evidence.filter(ev => {
      if (!ev.expiryDate) return false;
      const expiryDate = new Date(ev.expiryDate);
      return expiryDate <= warningDate;
    });
  },

  // Generate audit schedule
  generateAuditSchedule: (frameworks: ComplianceFramework[]): Array<{
    frameworkId: string;
    name: string;
    nextAuditDate: string;
    priority: string;
  }> => {
    return frameworks.map(framework => {
      const nextAuditDate = new Date(framework.nextAssessment);
      const today = new Date();
      const daysUntilAudit = Math.ceil((nextAuditDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let priority = 'medium';
      if (daysUntilAudit < 0) priority = 'critical';
      else if (daysUntilAudit <= 30) priority = 'high';
      else if (daysUntilAudit <= 90) priority = 'medium';
      else priority = 'low';
      
      return {
        frameworkId: framework.id,
        name: framework.name,
        nextAuditDate: framework.nextAssessment,
        priority
      };
    }).sort((a, b) => new Date(a.nextAuditDate).getTime() - new Date(b.nextAuditDate).getTime());
  },

  // Export compliance data
  exportComplianceData: (data: {
    frameworks: ComplianceFramework[];
    requirements: ComplianceRequirement[];
    findings: AuditFinding[];
  }, format: 'json' | 'csv' = 'json'): string => {
    if (format === 'csv') {
      const csvData = data.requirements.map(req => {
        const framework = data.frameworks.find(f => f.id === req.frameworkId);
        const relatedFindings = data.findings.filter(f => f.requirement === req.id);
        
        return {
          framework: framework?.name || 'Unknown',
          requirement: req.title,
          status: req.status,
          priority: req.priority,
          dueDate: req.dueDate,
          assignedTo: req.assignedTo,
          openFindings: relatedFindings.filter(f => f.status === 'open').length
        };
      });
      
      const headers = Object.keys(csvData[0] || {}).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      return [headers, ...rows].join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }
};