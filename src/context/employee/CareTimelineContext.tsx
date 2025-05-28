import React, { createContext, ReactNode, useContext, useReducer } from 'react';

// Types
export interface CareEvent {
  id: string;
  type: 'appointment' | 'reminder' | 'deadline' | 'milestone' | 'follow-up';
  category: 'preventative' | 'routine' | 'specialist' | 'dental' | 'vision' | 'mental-health' | 'wellness';
  title: string;
  description: string;
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled' | 'overdue' | 'suggested';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  dueDate?: string;
  completedDate?: string;
  duration?: number; // minutes
  location?: {
    type: 'in-person' | 'virtual' | 'onsite';
    address?: string;
    provider?: string;
    notes?: string;
  };
  provider?: {
    id: string;
    name: string;
    specialty: string;
    phone?: string;
    email?: string;
    rating?: number;
  };
  benefits?: {
    coverage: number; // percentage
    copay: number;
    deductible: number;
    remaining: number;
    expiresAt?: string;
  };
  healthScore?: {
    currentImpact: number;
    potentialImprovement: number;
    category: string;
  };
  preparation?: {
    instructions: string[];
    documents: string[];
    fasting?: boolean;
    medications?: string[];
  };
  workImpact?: {
    timeOffRequired: number; // hours
    schedulingSuggestions: string[];
    conflictRisk: 'low' | 'medium' | 'high';
  };
  reminders?: {
    id: string;
    type: 'email' | 'push' | 'sms';
    scheduledFor: string;
    sent: boolean;
    message: string;
  }[];
  relatedEvents?: string[]; // IDs of related care events
  createdAt: string;
  lastModified: string;
}

export interface TimelineOptimization {
  id: string;
  type: 'scheduling' | 'bundling' | 'deadline' | 'health-score' | 'cost-saving';
  title: string;
  description: string;
  impact: {
    healthScore: number;
    costSavings: number;
    timeEfficiency: number;
    convenienceScore: number;
  };
  suggestions: {
    action: string;
    reason: string;
    priority: number;
    estimatedBenefit: string;
  }[];
  affectedEvents: string[];
  implementable: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface CareGap {
  id: string;
  category: string;
  type: 'overdue' | 'approaching' | 'recommended' | 'seasonal';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  healthImpact: {
    riskLevel: 'low' | 'medium' | 'high';
    consequences: string[];
    preventionBenefits: string[];
  };
  schedulingInfo: {
    estimatedDuration: number;
    preferredTimeframe: string;
    providerTypes: string[];
    preparation: string[];
  };
  benefits: {
    covered: boolean;
    coverage: number;
    estimatedCost: number;
    deductibleImpact: number;
  };
  actionable: boolean;
  createdAt: string;
}

export interface WorkCalendarIntegration {
  connected: boolean;
  provider: 'google' | 'outlook' | 'apple' | 'other';
  lastSync: string;
  conflicts: {
    eventId: string;
    conflictType: 'time' | 'location' | 'preparation';
    severity: 'minor' | 'major' | 'blocking';
    resolution?: string;
  }[];
  availability: {
    preferredTimes: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[];
    blackoutDates: string[];
    timezone: string;
  };
}

export interface BenefitsIntegration {
  connected: boolean;
  provider: string;
  planDetails: {
    planName: string;
    deductible: {
      total: number;
      remaining: number;
    };
    outOfPocketMax: {
      total: number;
      remaining: number;
    };
    preventativeCare: {
      covered: boolean;
      copay: number;
      annual_limit?: number;
      remaining?: number;
    };
  };
  expirationDates: {
    benefitYear: string;
    flexSpending?: string;
    visionBenefits?: string;
    dentalBenefits?: string;
  };
  lastSync: string;
}

export interface CareTimelineState {
  events: CareEvent[];
  gaps: CareGap[];
  optimizations: TimelineOptimization[];
  workCalendar: WorkCalendarIntegration;
  benefits: BenefitsIntegration;
  isLoading: boolean;
  error: string | null;
  selectedEvent: string | null;
  viewMode: 'timeline' | 'calendar' | 'list' | 'gaps';
  timeRange: {
    start: string;
    end: string;
  };
  filters: {
    categories: string[];
    statuses: string[];
    priorities: string[];
    providers: string[];
  };
  preferences: {
    autoScheduling: boolean;
    reminderSettings: {
      email: boolean;
      push: boolean;
      sms: boolean;
      advanceNotice: number; // days
    };
    optimizationSettings: {
      bundleAppointments: boolean;
      considerWorkSchedule: boolean;
      prioritizeHealthScore: boolean;
      minimizeCosts: boolean;
    };
  };
}

// Action Types
type CareTimelineAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EVENTS'; payload: CareEvent[] }
  | { type: 'ADD_EVENT'; payload: CareEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updates: Partial<CareEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'COMPLETE_EVENT'; payload: { id: string; completedDate: string; notes?: string } }
  | { type: 'SET_GAPS'; payload: CareGap[] }
  | { type: 'ADD_GAP'; payload: CareGap }
  | { type: 'RESOLVE_GAP'; payload: string }
  | { type: 'SET_OPTIMIZATIONS'; payload: TimelineOptimization[] }
  | { type: 'ADD_OPTIMIZATION'; payload: TimelineOptimization }
  | { type: 'APPLY_OPTIMIZATION'; payload: string }
  | { type: 'DISMISS_OPTIMIZATION'; payload: string }
  | { type: 'SET_WORK_CALENDAR'; payload: WorkCalendarIntegration }
  | { type: 'SET_BENEFITS'; payload: BenefitsIntegration }
  | { type: 'SET_SELECTED_EVENT'; payload: string | null }
  | { type: 'SET_VIEW_MODE'; payload: CareTimelineState['viewMode'] }
  | { type: 'SET_TIME_RANGE'; payload: { start: string; end: string } }
  | { type: 'SET_FILTERS'; payload: Partial<CareTimelineState['filters']> }
  | { type: 'SET_PREFERENCES'; payload: Partial<CareTimelineState['preferences']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SYNC_CALENDAR' }
  | { type: 'SYNC_BENEFITS' }
  | { type: 'SCHEDULE_EVENT'; payload: { eventId: string; scheduledDate: string; providerId?: string } }
  | { type: 'RESCHEDULE_EVENT'; payload: { eventId: string; newDate: string; reason?: string } }
  | { type: 'ADD_REMINDER'; payload: { eventId: string; reminder: CareEvent['reminders'][0] } };

// Initial State
const initialState: CareTimelineState = {
  events: [],
  gaps: [],
  optimizations: [],
  workCalendar: {
    connected: false,
    provider: 'google',
    lastSync: '',
    conflicts: [],
    availability: {
      preferredTimes: [],
      blackoutDates: [],
      timezone: 'America/New_York'
    }
  },
  benefits: {
    connected: false,
    provider: '',
    planDetails: {
      planName: '',
      deductible: { total: 0, remaining: 0 },
      outOfPocketMax: { total: 0, remaining: 0 },
      preventativeCare: { covered: false, copay: 0 }
    },
    expirationDates: {
      benefitYear: ''
    },
    lastSync: ''
  },
  isLoading: false,
  error: null,
  selectedEvent: null,
  viewMode: 'timeline',
  timeRange: {
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  filters: {
    categories: [],
    statuses: [],
    priorities: [],
    providers: []
  },
  preferences: {
    autoScheduling: false,
    reminderSettings: {
      email: true,
      push: true,
      sms: false,
      advanceNotice: 1
    },
    optimizationSettings: {
      bundleAppointments: true,
      considerWorkSchedule: true,
      prioritizeHealthScore: true,
      minimizeCosts: true
    }
  }
};

// Reducer
function careTimelineReducer(state: CareTimelineState, action: CareTimelineAction): CareTimelineState {
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

    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
        isLoading: false,
        error: null
      };

    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload]
      };

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id
            ? { ...event, ...action.payload.updates, lastModified: new Date().toISOString() }
            : event
        )
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        selectedEvent: state.selectedEvent === action.payload ? null : state.selectedEvent
      };

    case 'COMPLETE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id
            ? {
                ...event,
                status: 'completed',
                completedDate: action.payload.completedDate,
                lastModified: new Date().toISOString()
              }
            : event
        )
      };

    case 'SET_GAPS':
      return {
        ...state,
        gaps: action.payload
      };

    case 'ADD_GAP':
      return {
        ...state,
        gaps: [...state.gaps, action.payload]
      };

    case 'RESOLVE_GAP':
      return {
        ...state,
        gaps: state.gaps.filter(gap => gap.id !== action.payload)
      };

    case 'SET_OPTIMIZATIONS':
      return {
        ...state,
        optimizations: action.payload
      };

    case 'ADD_OPTIMIZATION':
      return {
        ...state,
        optimizations: [...state.optimizations, action.payload]
      };

    case 'APPLY_OPTIMIZATION':
      return {
        ...state,
        optimizations: state.optimizations.filter(opt => opt.id !== action.payload)
      };

    case 'DISMISS_OPTIMIZATION':
      return {
        ...state,
        optimizations: state.optimizations.filter(opt => opt.id !== action.payload)
      };

    case 'SET_WORK_CALENDAR':
      return {
        ...state,
        workCalendar: action.payload
      };

    case 'SET_BENEFITS':
      return {
        ...state,
        benefits: action.payload
      };

    case 'SET_SELECTED_EVENT':
      return {
        ...state,
        selectedEvent: action.payload
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      };

    case 'SET_TIME_RANGE':
      return {
        ...state,
        timeRange: action.payload
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          categories: [],
          statuses: [],
          priorities: [],
          providers: []
        }
      };

    case 'SCHEDULE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? {
                ...event,
                status: 'scheduled',
                scheduledDate: action.payload.scheduledDate,
                provider: action.payload.providerId 
                  ? { ...event.provider, id: action.payload.providerId } as any
                  : event.provider,
                lastModified: new Date().toISOString()
              }
            : event
        )
      };

    case 'RESCHEDULE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? {
                ...event,
                scheduledDate: action.payload.newDate,
                lastModified: new Date().toISOString()
              }
            : event
        )
      };

    case 'ADD_REMINDER':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? {
                ...event,
                reminders: [...(event.reminders || []), action.payload.reminder],
                lastModified: new Date().toISOString()
              }
            : event
        )
      };

    case 'SYNC_CALENDAR':
      return {
        ...state,
        workCalendar: {
          ...state.workCalendar,
          lastSync: new Date().toISOString()
        }
      };

    case 'SYNC_BENEFITS':
      return {
        ...state,
        benefits: {
          ...state.benefits,
          lastSync: new Date().toISOString()
        }
      };

    default:
      return state;
  }
}

// Context
interface CareTimelineContextType {
  state: CareTimelineState;
  dispatch: React.Dispatch<CareTimelineAction>;
  
  // Action creators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEvents: (events: CareEvent[]) => void;
  addEvent: (event: CareEvent) => void;
  updateEvent: (id: string, updates: Partial<CareEvent>) => void;
  deleteEvent: (id: string) => void;
  completeEvent: (id: string, completedDate: string, notes?: string) => void;
  setGaps: (gaps: CareGap[]) => void;
  addGap: (gap: CareGap) => void;
  resolveGap: (id: string) => void;
  setOptimizations: (optimizations: TimelineOptimization[]) => void;
  addOptimization: (optimization: TimelineOptimization) => void;
  applyOptimization: (id: string) => void;
  dismissOptimization: (id: string) => void;
  setWorkCalendar: (calendar: WorkCalendarIntegration) => void;
  setBenefits: (benefits: BenefitsIntegration) => void;
  setSelectedEvent: (id: string | null) => void;
  setViewMode: (mode: CareTimelineState['viewMode']) => void;
  setTimeRange: (start: string, end: string) => void;
  setFilters: (filters: Partial<CareTimelineState['filters']>) => void;
  setPreferences: (preferences: Partial<CareTimelineState['preferences']>) => void;
  clearFilters: () => void;
  syncCalendar: () => void;
  syncBenefits: () => void;
  scheduleEvent: (eventId: string, scheduledDate: string, providerId?: string) => void;
  rescheduleEvent: (eventId: string, newDate: string, reason?: string) => void;
  addReminder: (eventId: string, reminder: CareEvent['reminders'][0]) => void;
  
  // Computed values
  getFilteredEvents: () => CareEvent[];
  getUpcomingEvents: (days?: number) => CareEvent[];
  getOverdueEvents: () => CareEvent[];
  getPriorityGaps: () => CareGap[];
  getOptimizationOpportunities: () => TimelineOptimization[];
  getEventById: (id: string) => CareEvent | undefined;
  getGapById: (id: string) => CareGap | undefined;
  getNextBestAction: () => CareEvent | CareGap | null;
  getHealthScoreImpact: () => number;
  getCostSavingsOpportunity: () => number;
  getBenefitDeadlines: () => { type: string; deadline: string; value: number }[];
  getCalendarConflicts: () => WorkCalendarIntegration['conflicts'];
  getOptimalSchedulingSuggestions: (eventId: string) => {
    date: string;
    time: string;
    reason: string;
    score: number;
  }[];
}

const CareTimelineContext = createContext<CareTimelineContextType | undefined>(undefined);

// Provider
interface CareTimelineProviderProps {
  children: ReactNode;
}

export function CareTimelineProvider({ children }: CareTimelineProviderProps) {
  const [state, dispatch] = useReducer(careTimelineReducer, initialState);

  // Action creators
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setEvents = (events: CareEvent[]) => {
    dispatch({ type: 'SET_EVENTS', payload: events });
  };

  const addEvent = (event: CareEvent) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  };

  const updateEvent = (id: string, updates: Partial<CareEvent>) => {
    dispatch({ type: 'UPDATE_EVENT', payload: { id, updates } });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  };

  const completeEvent = (id: string, completedDate: string, notes?: string) => {
    dispatch({ type: 'COMPLETE_EVENT', payload: { id, completedDate, notes } });
  };

  const setGaps = (gaps: CareGap[]) => {
    dispatch({ type: 'SET_GAPS', payload: gaps });
  };

  const addGap = (gap: CareGap) => {
    dispatch({ type: 'ADD_GAP', payload: gap });
  };

  const resolveGap = (id: string) => {
    dispatch({ type: 'RESOLVE_GAP', payload: id });
  };

  const setOptimizations = (optimizations: TimelineOptimization[]) => {
    dispatch({ type: 'SET_OPTIMIZATIONS', payload: optimizations });
  };

  const addOptimization = (optimization: TimelineOptimization) => {
    dispatch({ type: 'ADD_OPTIMIZATION', payload: optimization });
  };

  const applyOptimization = (id: string) => {
    dispatch({ type: 'APPLY_OPTIMIZATION', payload: id });
  };

  const dismissOptimization = (id: string) => {
    dispatch({ type: 'DISMISS_OPTIMIZATION', payload: id });
  };

  const setWorkCalendar = (calendar: WorkCalendarIntegration) => {
    dispatch({ type: 'SET_WORK_CALENDAR', payload: calendar });
  };

  const setBenefits = (benefits: BenefitsIntegration) => {
    dispatch({ type: 'SET_BENEFITS', payload: benefits });
  };

  const setSelectedEvent = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_EVENT', payload: id });
  };

  const setViewMode = (mode: CareTimelineState['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const setTimeRange = (start: string, end: string) => {
    dispatch({ type: 'SET_TIME_RANGE', payload: { start, end } });
  };

  const setFilters = (filters: Partial<CareTimelineState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPreferences = (preferences: Partial<CareTimelineState['preferences']>) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const syncCalendar = () => {
    dispatch({ type: 'SYNC_CALENDAR' });
  };

  const syncBenefits = () => {
    dispatch({ type: 'SYNC_BENEFITS' });
  };

  const scheduleEvent = (eventId: string, scheduledDate: string, providerId?: string) => {
    dispatch({ type: 'SCHEDULE_EVENT', payload: { eventId, scheduledDate, providerId } });
  };

  const rescheduleEvent = (eventId: string, newDate: string, reason?: string) => {
    dispatch({ type: 'RESCHEDULE_EVENT', payload: { eventId, newDate, reason } });
  };

  const addReminder = (eventId: string, reminder: CareEvent['reminders'][0]) => {
    dispatch({ type: 'ADD_REMINDER', payload: { eventId, reminder } });
  };

  // Computed values
  const getFilteredEvents = (): CareEvent[] => {
    let filtered = [...state.events];

    // Apply category filter
    if (state.filters.categories.length > 0) {
      filtered = filtered.filter(event => state.filters.categories.includes(event.category));
    }

    // Apply status filter
    if (state.filters.statuses.length > 0) {
      filtered = filtered.filter(event => state.filters.statuses.includes(event.status));
    }

    // Apply priority filter
    if (state.filters.priorities.length > 0) {
      filtered = filtered.filter(event => state.filters.priorities.includes(event.priority));
    }

    // Apply provider filter
    if (state.filters.providers.length > 0) {
      filtered = filtered.filter(event => 
        event.provider && state.filters.providers.includes(event.provider.id)
      );
    }

    // Apply time range filter
    filtered = filtered.filter(event => {
      const eventDate = event.scheduledDate || event.dueDate;
      if (!eventDate) return true;
      
      const date = new Date(eventDate);
      const start = new Date(state.timeRange.start);
      const end = new Date(state.timeRange.end);
      
      return date >= start && date <= end;
    });

    return filtered;
  };

  const getUpcomingEvents = (days: number = 30): CareEvent[] => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return state.events
      .filter(event => {
        const eventDate = event.scheduledDate || event.dueDate;
        if (!eventDate) return false;
        
        const date = new Date(eventDate);
        return date >= now && date <= futureDate && event.status !== 'completed';
      })
      .sort((a, b) => {
        const aDate = new Date(a.scheduledDate || a.dueDate || '');
        const bDate = new Date(b.scheduledDate || b.dueDate || '');
        return aDate.getTime() - bDate.getTime();
      });
  };

  const getOverdueEvents = (): CareEvent[] => {
    const now = new Date();
    
    return state.events
      .filter(event => {
        const dueDate = event.dueDate;
        if (!dueDate || event.status === 'completed') return false;
        
        return new Date(dueDate) < now;
      })
      .sort((a, b) => {
        const aDate = new Date(a.dueDate || '');
        const bDate = new Date(b.dueDate || '');
        return aDate.getTime() - bDate.getTime();
      });
  };

  const getPriorityGaps = (): CareGap[] => {
    return state.gaps
      .filter(gap => gap.urgency === 'high' || gap.urgency === 'critical')
      .sort((a, b) => {
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      });
  };

  const getOptimizationOpportunities = (): TimelineOptimization[] => {
    return state.optimizations
      .filter(opt => opt.implementable)
      .sort((a, b) => {
        const aScore = a.impact.healthScore + a.impact.costSavings + a.impact.timeEfficiency;
        const bScore = b.impact.healthScore + b.impact.costSavings + b.impact.timeEfficiency;
        return bScore - aScore;
      });
  };

  const getEventById = (id: string): CareEvent | undefined => {
    return state.events.find(event => event.id === id);
  };

  const getGapById = (id: string): CareGap | undefined => {
    return state.gaps.find(gap => gap.id === id);
  };

  const getNextBestAction = (): CareEvent | CareGap | null => {
    // Check for overdue events first
    const overdueEvents = getOverdueEvents();
    if (overdueEvents.length > 0) {
      return overdueEvents[0];
    }

    // Check for high priority gaps
    const priorityGaps = getPriorityGaps();
    if (priorityGaps.length > 0) {
      return priorityGaps[0];
    }

    // Check for upcoming events in next 7 days
    const upcomingEvents = getUpcomingEvents(7);
    if (upcomingEvents.length > 0) {
      return upcomingEvents[0];
    }

    // Check for events that need scheduling
    const unscheduledEvents = state.events.filter(event => 
      event.status === 'suggested' || event.status === 'pending'
    );
    if (unscheduledEvents.length > 0) {
      return unscheduledEvents[0];
    }

    return null;
  };

  const getHealthScoreImpact = (): number => {
    return state.events
      .filter(event => event.healthScore && event.status !== 'completed')
      .reduce((total, event) => total + (event.healthScore?.potentialImprovement || 0), 0);
  };

  const getCostSavingsOpportunity = (): number => {
    return state.optimizations
      .filter(opt => opt.implementable)
      .reduce((total, opt) => total + opt.impact.costSavings, 0);
  };

  const getBenefitDeadlines = (): { type: string; deadline: string; value: number }[] => {
    const deadlines = [];
    
    if (state.benefits.expirationDates.benefitYear) {
      deadlines.push({
        type: 'Benefit Year',
        deadline: state.benefits.expirationDates.benefitYear,
        value: state.benefits.planDetails.deductible.remaining
      });
    }

    if (state.benefits.expirationDates.flexSpending) {
      deadlines.push({
        type: 'FSA Funds',
        deadline: state.benefits.expirationDates.flexSpending,
        value: 0 // Would need to be calculated based on available FSA balance
      });
    }

    return deadlines.sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  };

  const getCalendarConflicts = (): WorkCalendarIntegration['conflicts'] => {
    return state.workCalendar.conflicts;
  };

  const getOptimalSchedulingSuggestions = (eventId: string) => {
    const event = getEventById(eventId);
    if (!event) return [];

    // This would normally involve complex logic considering:
    // - Work calendar availability
    // - Provider availability  
    // - User preferences
    // - Health score optimization
    // - Cost considerations
    
    // For now, return mock suggestions
    const suggestions = [
      {
        date: '2025-06-15',
        time: '10:00',
        reason: 'Optimal work schedule alignment',
        score: 95
      },
      {
        date: '2025-06-16',
        time: '14:00',
        reason: 'Provider preference match',
        score: 88
      },
      {
        date: '2025-06-18',
        time: '09:00',
        reason: 'Early morning availability',
        score: 82
      }
    ];

    return suggestions.sort((a, b) => b.score - a.score);
  };

  const contextValue: CareTimelineContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    completeEvent,
    setGaps,
    addGap,
    resolveGap,
    setOptimizations,
    addOptimization,
    applyOptimization,
    dismissOptimization,
    setWorkCalendar,
    setBenefits,
    setSelectedEvent,
    setViewMode,
    setTimeRange,
    setFilters,
    setPreferences,
    clearFilters,
    syncCalendar,
    syncBenefits,
    scheduleEvent,
    rescheduleEvent,
    addReminder,
    getFilteredEvents,
    getUpcomingEvents,
    getOverdueEvents,
    getPriorityGaps,
    getOptimizationOpportunities,
    getEventById,
    getGapById,
    getNextBestAction,
    getHealthScoreImpact,
    getCostSavingsOpportunity,
    getBenefitDeadlines,
    getCalendarConflicts,
    getOptimalSchedulingSuggestions
  };

  return (
    <CareTimelineContext.Provider value={contextValue}>
      {children}
    </CareTimelineContext.Provider>
  );
}

// Hook
export function useCareTimeline() {
  const context = useContext(CareTimelineContext);
  if (context === undefined) {
    throw new Error('useCareTimeline must be used within a CareTimelineProvider');
  }
  return context;
}

export default CareTimelineContext;