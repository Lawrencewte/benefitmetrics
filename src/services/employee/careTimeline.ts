import {
  CareCategory,
  NextAction,
  TimelineItem,
  TimelineOptimization,
} from '../../context/employee/CareTimelineContext';
import api from '../api';

interface TimelineResponse {
  success: boolean;
  items?: TimelineItem[];
  categories?: CareCategory[];
  message?: string;
}

interface NextActionResponse {
  success: boolean;
  nextAction?: NextAction;
  message?: string;
}

interface OptimizationsResponse {
  success: boolean;
  optimizations?: TimelineOptimization[];
  message?: string;
}

interface TimelineItemResponse {
  success: boolean;
  item?: TimelineItem;
  message?: string;
}

interface TimelineActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Get care timeline data
 * 
 * @param token Auth token
 * @returns Response with timeline data
 */
export const getTimeline = async (token: string): Promise<TimelineResponse> => {
  try {
    const response = await api.get<TimelineResponse>(
      '/employee/features/care-timeline',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get care timeline:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve care timeline',
    };
  }
};

/**
 * Get next best action recommendation
 * 
 * @param token Auth token
 * @returns Response with next action
 */
export const getNextBestAction = async (token: string): Promise<NextActionResponse> => {
  try {
    const response = await api.get<NextActionResponse>(
      '/employee/features/care-timeline/next-action',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get next best action:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve next best action',
    };
  }
};

/**
 * Get timeline optimization recommendations
 * 
 * @param token Auth token
 * @returns Response with optimizations
 */
export const getTimelineOptimizations = async (token: string): Promise<OptimizationsResponse> => {
  try {
    const response = await api.get<OptimizationsResponse>(
      '/employee/features/care-timeline/optimizations',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get timeline optimizations:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve timeline optimizations',
    };
  }
};

/**
 * Mark a timeline item as complete
 * 
 * @param token Auth token
 * @param itemId Timeline item ID
 * @param details Optional completion details
 * @returns Response with success status
 */
export const completeTimelineItem = async (
  token: string,
  itemId: string,
  details?: any
): Promise<TimelineActionResponse> => {
  try {
    const response = await api.post<TimelineActionResponse>(
      `/employee/features/care-timeline/${itemId}/complete`,
      { details },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to complete timeline item:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to complete timeline item',
    };
  }
};

/**
 * Schedule a timeline item
 * 
 * @param token Auth token
 * @param itemId Timeline item ID
 * @param date Scheduled date
 * @param details Optional scheduling details
 * @returns Response with success status
 */
export const scheduleTimelineItem = async (
  token: string,
  itemId: string,
  date: Date,
  details?: any
): Promise<TimelineActionResponse> => {
  try {
    const response = await api.post<TimelineActionResponse>(
      `/employee/features/care-timeline/${itemId}/schedule`,
      { date, details },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to schedule timeline item:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to schedule timeline item',
    };
  }
};

/**
 * Apply a timeline optimization
 * 
 * @param token Auth token
 * @param optimizationId Optimization ID
 * @returns Response with success status
 */
export const applyOptimization = async (
  token: string,
  optimizationId: string
): Promise<TimelineActionResponse> => {
  try {
    const response = await api.post<TimelineActionResponse>(
      `/employee/features/care-timeline/optimizations/${optimizationId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to apply optimization:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to apply optimization',
    };
  }
};