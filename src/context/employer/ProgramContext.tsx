import React, { createContext, ReactNode, useContext, useReducer } from 'react';

// Types
export interface WellnessProgram {
  id: string;
  name: string;
  description: string;
  type: 'challenge' | 'education' | 'screening' | 'incentive' | 'campaign';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  targetAudience: {
    departments: string[];
    roles: string[];
    locations: string[];
    employeeGroups: string[];
  };
  goals: {
    participation: number;
    completion: number;
    healthOutcomes: string[];
  };
  metrics: {
    enrolled: number;
    active: number;
    completed: number;
    dropoutRate: number;
  };
  rewards?: {
    points: number;
    benefits: string[];
    recognitions: string[];
  };
  budget?: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'preventative' | 'mental-health';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // days
  points: number;
  requirements: string[];
  tracking: {
    type: 'manual' | 'automatic' | 'verification';
    frequency: 'daily' | 'weekly' | 'milestone';
    metrics: string[];
  };
  participants: {
    enrolled: number;
    active: number;
    completed: number;
  };
  leaderboard?: {
    userId: string;
    name: string;
    score: number;
    rank: number;
  }[];
  status: 'draft' | 'active' | 'completed';
  isTeamChallenge: boolean;
  maxParticipants?: number;
  createdAt: string;
}

export interface Incentive {
  id: string;
  name: string;
  description: string;
  type: 'points' | 'discount' | 'benefit' | 'recognition' | 'time-off' | 'gift';
  value: number;
  cost: number;
  requirements: {
    type: 'completion' | 'participation' | 'achievement' | 'milestone';
    criteria: string[];
    threshold?: number;
  };
  availability: {
    total: number;
    claimed: number;
    remaining: number;
  };
  eligibility: {
    departments: string[];
    roles: string[];
    tenureMinimum?: number;
  };
  validFrom: string;
  validUntil?: string;
  status: 'active' | 'paused' | 'expired';
  category: string;
  provider?: string;
  redemptionInstructions: string;
  createdAt: string;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  activities: {
    week: number;
    activities: string[];
    goals: string[];
  }[];
  estimatedBudget: number;
  expectedOutcomes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetSize: {
    min: number;
    max: number;
  };
  tags: string[];
  isCustom: boolean;
  createdBy?: string;
  usage: number;
}

export interface ProgramAnalytics {
  participation: {
    total: number;
    byDepartment: { [key: string]: number };
    byProgram: { [key: string]: number };
    trend: { period: string; count: number }[];
  };
  engagement: {
    activeUsers: number;
    averageSessionTime: number;
    completionRate: number;
    retentionRate: number;
  };
  outcomes: {
    healthScoreImprovement: number;
    behaviorChange: number;
    satisfactionScore: number;
    costSavings: number;
  };
  challenges: {
    mostPopular: string[];
    highestCompletion: string[];
    trending: string[];
  };
  roi: {
    totalInvestment: number;
    measuredBenefits: number;
    projectedSavings: number;
    paybackPeriod: number;
  };
}

export interface ProgramState {
  programs: WellnessProgram[];
  challenges: Challenge[];
  incentives: Incentive[];
  templates: ProgramTemplate[];
  analytics: ProgramAnalytics;
  isLoading: boolean;
  error: string | null;
  selectedProgram: string | null;
  filters: {
    status: string[];
    type: string[];
    department: string[];
    dateRange: {
      start: string;
      end: string;
    };
  };
  sortBy: 'name' | 'created' | 'participants' | 'completion';
  sortOrder: 'asc' | 'desc';
}

// Action Types
type ProgramAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROGRAMS'; payload: WellnessProgram[] }
  | { type: 'ADD_PROGRAM'; payload: WellnessProgram }
  | { type: 'UPDATE_PROGRAM'; payload: { id: string; updates: Partial<WellnessProgram> } }
  | { type: 'DELETE_PROGRAM'; payload: string }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'UPDATE_CHALLENGE'; payload: { id: string; updates: Partial<Challenge> } }
  | { type: 'DELETE_CHALLENGE'; payload: string }
  | { type: 'SET_INCENTIVES'; payload: Incentive[] }
  | { type: 'ADD_INCENTIVE'; payload: Incentive }
  | { type: 'UPDATE_INCENTIVE'; payload: { id: string; updates: Partial<Incentive> } }
  | { type: 'DELETE_INCENTIVE'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: ProgramTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: ProgramTemplate }
  | { type: 'SET_ANALYTICS'; payload: ProgramAnalytics }
  | { type: 'SET_SELECTED_PROGRAM'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<ProgramState['filters']> }
  | { type: 'SET_SORTING'; payload: { sortBy: ProgramState['sortBy']; sortOrder: ProgramState['sortOrder'] } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'DUPLICATE_PROGRAM'; payload: string }
  | { type: 'ARCHIVE_PROGRAM'; payload: string };

// Initial State
const initialState: ProgramState = {
  programs: [],
  challenges: [],
  incentives: [],
  templates: [],
  analytics: {
    participation: {
      total: 0,
      byDepartment: {},
      byProgram: {},
      trend: []
    },
    engagement: {
      activeUsers: 0,
      averageSessionTime: 0,
      completionRate: 0,
      retentionRate: 0
    },
    outcomes: {
      healthScoreImprovement: 0,
      behaviorChange: 0,
      satisfactionScore: 0,
      costSavings: 0
    },
    challenges: {
      mostPopular: [],
      highestCompletion: [],
      trending: []
    },
    roi: {
      totalInvestment: 0,
      measuredBenefits: 0,
      projectedSavings: 0,
      paybackPeriod: 0
    }
  },
  isLoading: false,
  error: null,
  selectedProgram: null,
  filters: {
    status: [],
    type: [],
    department: [],
    dateRange: {
      start: '',
      end: ''
    }
  },
  sortBy: 'created',
  sortOrder: 'desc'
};

// Reducer
function programReducer(state: ProgramState, action: ProgramAction): ProgramState {
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

    case 'SET_PROGRAMS':
      return {
        ...state,
        programs: action.payload,
        isLoading: false,
        error: null
      };

    case 'ADD_PROGRAM':
      return {
        ...state,
        programs: [...state.programs, action.payload]
      };

    case 'UPDATE_PROGRAM':
      return {
        ...state,
        programs: state.programs.map(program =>
          program.id === action.payload.id
            ? { ...program, ...action.payload.updates, lastModified: new Date().toISOString() }
            : program
        )
      };

    case 'DELETE_PROGRAM':
      return {
        ...state,
        programs: state.programs.filter(program => program.id !== action.payload),
        selectedProgram: state.selectedProgram === action.payload ? null : state.selectedProgram
      };

    case 'SET_CHALLENGES':
      return {
        ...state,
        challenges: action.payload
      };

    case 'ADD_CHALLENGE':
      return {
        ...state,
        challenges: [...state.challenges, action.payload]
      };

    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.id
            ? { ...challenge, ...action.payload.updates }
            : challenge
        )
      };

    case 'DELETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.filter(challenge => challenge.id !== action.payload)
      };

    case 'SET_INCENTIVES':
      return {
        ...state,
        incentives: action.payload
      };

    case 'ADD_INCENTIVE':
      return {
        ...state,
        incentives: [...state.incentives, action.payload]
      };

    case 'UPDATE_INCENTIVE':
      return {
        ...state,
        incentives: state.incentives.map(incentive =>
          incentive.id === action.payload.id
            ? { ...incentive, ...action.payload.updates }
            : incentive
        )
      };

    case 'DELETE_INCENTIVE':
      return {
        ...state,
        incentives: state.incentives.filter(incentive => incentive.id !== action.payload)
      };

    case 'SET_TEMPLATES':
      return {
        ...state,
        templates: action.payload
      };

    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, action.payload]
      };

    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload
      };

    case 'SET_SELECTED_PROGRAM':
      return {
        ...state,
        selectedProgram: action.payload
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case 'SET_SORTING':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          status: [],
          type: [],
          department: [],
          dateRange: {
            start: '',
            end: ''
          }
        }
      };

    case 'DUPLICATE_PROGRAM':
      const programToDuplicate = state.programs.find(p => p.id === action.payload);
      if (programToDuplicate) {
        const duplicatedProgram: WellnessProgram = {
          ...programToDuplicate,
          id: `${programToDuplicate.id}_copy_${Date.now()}`,
          name: `${programToDuplicate.name} (Copy)`,
          status: 'draft',
          metrics: {
            enrolled: 0,
            active: 0,
            completed: 0,
            dropoutRate: 0
          },
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        return {
          ...state,
          programs: [...state.programs, duplicatedProgram]
        };
      }
      return state;

    case 'ARCHIVE_PROGRAM':
      return {
        ...state,
        programs: state.programs.map(program =>
          program.id === action.payload
            ? { ...program, status: 'archived', lastModified: new Date().toISOString() }
            : program
        )
      };

    default:
      return state;
  }
}

// Context
interface ProgramContextType {
  state: ProgramState;
  dispatch: React.Dispatch<ProgramAction>;
  
  // Action creators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPrograms: (programs: WellnessProgram[]) => void;
  addProgram: (program: WellnessProgram) => void;
  updateProgram: (id: string, updates: Partial<WellnessProgram>) => void;
  deleteProgram: (id: string) => void;
  setChallenges: (challenges: Challenge[]) => void;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  setIncentives: (incentives: Incentive[]) => void;
  addIncentive: (incentive: Incentive) => void;
  updateIncentive: (id: string, updates: Partial<Incentive>) => void;
  deleteIncentive: (id: string) => void;
  setTemplates: (templates: ProgramTemplate[]) => void;
  addTemplate: (template: ProgramTemplate) => void;
  setAnalytics: (analytics: ProgramAnalytics) => void;
  setSelectedProgram: (id: string | null) => void;
  setFilters: (filters: Partial<ProgramState['filters']>) => void;
  setSorting: (sortBy: ProgramState['sortBy'], sortOrder: ProgramState['sortOrder']) => void;
  clearFilters: () => void;
  duplicateProgram: (id: string) => void;
  archiveProgram: (id: string) => void;
  
  // Computed values
  getFilteredPrograms: () => WellnessProgram[];
  getActiveChallenges: () => Challenge[];
  getAvailableIncentives: () => Incentive[];
  getProgramById: (id: string) => WellnessProgram | undefined;
  getChallengeById: (id: string) => Challenge | undefined;
  getIncentiveById: (id: string) => Incentive | undefined;
  getProgramMetrics: (id: string) => {
    participation: number;
    completion: number;
    engagement: number;
    roi: number;
  } | null;
  getTopPerformingPrograms: (limit?: number) => WellnessProgram[];
  getRecommendedTemplates: (criteria?: {
    department?: string;
    size?: number;
    budget?: number;
  }) => ProgramTemplate[];
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

// Provider
interface ProgramProviderProps {
  children: ReactNode;
}

export function ProgramProvider({ children }: ProgramProviderProps) {
  const [state, dispatch] = useReducer(programReducer, initialState);

  // Action creators
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setPrograms = (programs: WellnessProgram[]) => {
    dispatch({ type: 'SET_PROGRAMS', payload: programs });
  };

  const addProgram = (program: WellnessProgram) => {
    dispatch({ type: 'ADD_PROGRAM', payload: program });
  };

  const updateProgram = (id: string, updates: Partial<WellnessProgram>) => {
    dispatch({ type: 'UPDATE_PROGRAM', payload: { id, updates } });
  };

  const deleteProgram = (id: string) => {
    dispatch({ type: 'DELETE_PROGRAM', payload: id });
  };

  const setChallenges = (challenges: Challenge[]) => {
    dispatch({ type: 'SET_CHALLENGES', payload: challenges });
  };

  const addChallenge = (challenge: Challenge) => {
    dispatch({ type: 'ADD_CHALLENGE', payload: challenge });
  };

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    dispatch({ type: 'UPDATE_CHALLENGE', payload: { id, updates } });
  };

  const deleteChallenge = (id: string) => {
    dispatch({ type: 'DELETE_CHALLENGE', payload: id });
  };

  const setIncentives = (incentives: Incentive[]) => {
    dispatch({ type: 'SET_INCENTIVES', payload: incentives });
  };

  const addIncentive = (incentive: Incentive) => {
    dispatch({ type: 'ADD_INCENTIVE', payload: incentive });
  };

  const updateIncentive = (id: string, updates: Partial<Incentive>) => {
    dispatch({ type: 'UPDATE_INCENTIVE', payload: { id, updates } });
  };

  const deleteIncentive = (id: string) => {
    dispatch({ type: 'DELETE_INCENTIVE', payload: id });
  };

  const setTemplates = (templates: ProgramTemplate[]) => {
    dispatch({ type: 'SET_TEMPLATES', payload: templates });
  };

  const addTemplate = (template: ProgramTemplate) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const setAnalytics = (analytics: ProgramAnalytics) => {
    dispatch({ type: 'SET_ANALYTICS', payload: analytics });
  };

  const setSelectedProgram = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_PROGRAM', payload: id });
  };

  const setFilters = (filters: Partial<ProgramState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSorting = (sortBy: ProgramState['sortBy'], sortOrder: ProgramState['sortOrder']) => {
    dispatch({ type: 'SET_SORTING', payload: { sortBy, sortOrder } });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const duplicateProgram = (id: string) => {
    dispatch({ type: 'DUPLICATE_PROGRAM', payload: id });
  };

  const archiveProgram = (id: string) => {
    dispatch({ type: 'ARCHIVE_PROGRAM', payload: id });
  };

  // Computed values
  const getFilteredPrograms = (): WellnessProgram[] => {
    let filtered = [...state.programs];

    // Apply status filter
    if (state.filters.status.length > 0) {
      filtered = filtered.filter(program => state.filters.status.includes(program.status));
    }

    // Apply type filter
    if (state.filters.type.length > 0) {
      filtered = filtered.filter(program => state.filters.type.includes(program.type));
    }

    // Apply department filter
    if (state.filters.department.length > 0) {
      filtered = filtered.filter(program => 
        program.targetAudience.departments.some(dept => 
          state.filters.department.includes(dept)
        )
      );
    }

    // Apply date range filter
    if (state.filters.dateRange.start && state.filters.dateRange.end) {
      const startDate = new Date(state.filters.dateRange.start);
      const endDate = new Date(state.filters.dateRange.end);
      filtered = filtered.filter(program => {
        const programStart = new Date(program.startDate);
        return programStart >= startDate && programStart <= endDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'participants':
          comparison = a.metrics.enrolled - b.metrics.enrolled;
          break;
        case 'completion':
          const aCompletion = a.metrics.enrolled > 0 ? a.metrics.completed / a.metrics.enrolled : 0;
          const bCompletion = b.metrics.enrolled > 0 ? b.metrics.completed / b.metrics.enrolled : 0;
          comparison = aCompletion - bCompletion;
          break;
      }

      return state.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const getActiveChallenges = (): Challenge[] => {
    return state.challenges.filter(challenge => challenge.status === 'active');
  };

  const getAvailableIncentives = (): Incentive[] => {
    const now = new Date();
    return state.incentives.filter(incentive => {
      if (incentive.status !== 'active') return false;
      if (incentive.availability.remaining <= 0) return false;
      if (incentive.validUntil && new Date(incentive.validUntil) < now) return false;
      return true;
    });
  };

  const getProgramById = (id: string): WellnessProgram | undefined => {
    return state.programs.find(program => program.id === id);
  };

  const getChallengeById = (id: string): Challenge | undefined => {
    return state.challenges.find(challenge => challenge.id === id);
  };

  const getIncentiveById = (id: string): Incentive | undefined => {
    return state.incentives.find(incentive => incentive.id === id);
  };

  const getProgramMetrics = (id: string) => {
    const program = getProgramById(id);
    if (!program) return null;

    const participation = program.metrics.enrolled;
    const completion = program.metrics.enrolled > 0 
      ? (program.metrics.completed / program.metrics.enrolled) * 100 
      : 0;
    const engagement = program.metrics.enrolled > 0 
      ? (program.metrics.active / program.metrics.enrolled) * 100 
      : 0;
    
    // Calculate ROI based on budget and estimated benefits
    const roi = program.budget?.allocated 
      ? ((program.budget.allocated - program.budget.spent) / program.budget.allocated) * 100
      : 0;

    return {
      participation,
      completion,
      engagement,
      roi
    };
  };

  const getTopPerformingPrograms = (limit: number = 5): WellnessProgram[] => {
    return [...state.programs]
      .filter(program => program.status === 'active' || program.status === 'completed')
      .sort((a, b) => {
        const aCompletion = a.metrics.enrolled > 0 ? a.metrics.completed / a.metrics.enrolled : 0;
        const bCompletion = b.metrics.enrolled > 0 ? b.metrics.completed / b.metrics.enrolled : 0;
        return bCompletion - aCompletion;
      })
      .slice(0, limit);
  };

  const getRecommendedTemplates = (criteria?: {
    department?: string;
    size?: number;
    budget?: number;
  }): ProgramTemplate[] => {
    let recommended = [...state.templates];

    if (criteria?.size) {
      recommended = recommended.filter(template => 
        criteria.size! >= template.targetSize.min && 
        criteria.size! <= template.targetSize.max
      );
    }

    if (criteria?.budget) {
      recommended = recommended.filter(template => 
        template.estimatedBudget <= criteria.budget!
      );
    }

    // Sort by usage (popularity) and expected outcomes
    recommended.sort((a, b) => {
      const aScore = a.usage + a.expectedOutcomes.length;
      const bScore = b.usage + b.expectedOutcomes.length;
      return bScore - aScore;
    });

    return recommended.slice(0, 10); // Return top 10 recommendations
  };

  const contextValue: ProgramContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
    setChallenges,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    setIncentives,
    addIncentive,
    updateIncentive,
    deleteIncentive,
    setTemplates,
    addTemplate,
    setAnalytics,
    setSelectedProgram,
    setFilters,
    setSorting,
    clearFilters,
    duplicateProgram,
    archiveProgram,
    getFilteredPrograms,
    getActiveChallenges,
    getAvailableIncentives,
    getProgramById,
    getChallengeById,
    getIncentiveById,
    getProgramMetrics,
    getTopPerformingPrograms,
    getRecommendedTemplates
  };

  return (
    <ProgramContext.Provider value={contextValue}>
      {children}
    </ProgramContext.Provider>
  );
}

// Hook
export function useProgram() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
}

export default ProgramContext;