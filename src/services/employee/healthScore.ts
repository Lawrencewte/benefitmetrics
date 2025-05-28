import {
  HealthCategory,
  HealthScoreHistory,
  ImprovementSuggestion,
} from '../../context/employee/HealthScoreContext';
import api from '../api';

interface HealthScoreResponse {
  success: boolean;
  score?: number;
  previousScore?: number;
  categories?: HealthCategory[];
  lastUpdated?: string;
  message?: string;
}

interface HealthScoreHistoryResponse {
  success: boolean;
  history?: HealthScoreHistory[];
  message?: string;
}

interface ImprovementSuggestionsResponse {
  success: boolean;
  suggestions?: ImprovementSuggestion[];
  message?: string;
}

interface UpdateMetricResponse {
  success: boolean;
  newScore?: number;
  newCategoryScore?: number;
  newStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  message?: string;
}

interface TrackActionResponse {
  success: boolean;
  newScore?: number;
  impact?: number;
  message?: string;
}

/**
 * Get current health score data
 * 
 * @param token Auth token
 * @returns Response with health score data
 */
export const getHealthScore = async (token: string): Promise<HealthScoreResponse> => {
  try {
    const response = await api.get<HealthScoreResponse>(
      '/employee/features/health-score',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get health score:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve health score',
    };
  }
};

/**
 * Get health score history
 * 
 * @param token Auth token
 * @returns Response with health score history
 */
export const getHealthScoreHistory = async (token: string): Promise<HealthScoreHistoryResponse> => {
  try {
    const response = await api.get<HealthScoreHistoryResponse>(
      '/employee/features/health-score/history',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get health score history:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve health score history',
    };
  }
};

/**
 * Get improvement suggestions
 * 
 * @param token Auth token
 * @returns Response with improvement suggestions
 */
export const getImprovementSuggestions = async (token: string): Promise<ImprovementSuggestionsResponse> => {
  try {
    const response = await api.get<ImprovementSuggestionsResponse>(
      '/employee/features/health-score/suggestions',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get improvement suggestions:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve improvement suggestions',
    };
  }
};

/**
 * Update a health metric value
 * 
 * @param token Auth token
 * @param metricId Metric ID
 * @param value New metric value
 * @returns Response with updated score info
 */
export const updateHealthMetric = async (
  token: string,
  metricId: string,
  value: number
): Promise<UpdateMetricResponse> => {
  try {
    const response = await api.post<UpdateMetricResponse>(
      `/employee/features/health-score/metrics/${metricId}`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to update health metric:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to update health metric',
    };
  }
};

/**
 * Track a health-related action
 * 
 * @param token Auth token
 * @param actionType Type of action
 * @param actionDetails Action details
 * @returns Response with impact on score
 */
export const trackHealthAction = async (
  token: string,
  actionType: string,
  actionDetails: any
): Promise<TrackActionResponse> => {
  try {
    const response = await api.post<TrackActionResponse>(
      '/employee/features/health-score/track-action',
      { actionType, actionDetails },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to track health action:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to track health action',
    };
  }
};