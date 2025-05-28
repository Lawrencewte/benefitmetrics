import {
    CompanyComparison,
    ProjectedSavings,
    SavingsCategory,
    SavingsItem,
    YearlySavings,
} from '../../context/employee/ROIContext';
import api from '../api';

interface ROIOverviewResponse {
  success: boolean;
  totalSavings?: number;
  categories?: SavingsCategory[];
  projectedSavings?: ProjectedSavings;
  message?: string;
}

interface SavingsItemsResponse {
  success: boolean;
  items?: SavingsItem[];
  message?: string;
}

interface YearlySavingsResponse {
  success: boolean;
  yearlySavings?: YearlySavings[];
  message?: string;
}

interface CompanyComparisonResponse {
  success: boolean;
  comparison?: CompanyComparison;
  message?: string;
}

interface PotentialSavingsResponse {
  success: boolean;
  potentialSavings?: number;
  details?: any;
  message?: string;
}

/**
 * Get ROI overview data
 * 
 * @param token Auth token
 * @returns Response with ROI overview
 */
export const getROIOverview = async (token: string): Promise<ROIOverviewResponse> => {
  try {
    const response = await api.get<ROIOverviewResponse>(
      '/employee/roi/overview',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get ROI overview:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve ROI overview',
    };
  }
};

/**
 * Get savings items
 * 
 * @param token Auth token
 * @param limit Maximum number of items to return
 * @returns Response with savings items
 */
export const getSavingsItems = async (token: string, limit = 10): Promise<SavingsItemsResponse> => {
  try {
    const response = await api.get<SavingsItemsResponse>(
      `/employee/roi/items?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get savings items:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve savings items',
    };
  }
};

/**
 * Get yearly savings breakdown
 * 
 * @param token Auth token
 * @returns Response with yearly savings
 */
export const getYearlySavings = async (token: string): Promise<YearlySavingsResponse> => {
  try {
    const response = await api.get<YearlySavingsResponse>(
      '/employee/roi/yearly',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get yearly savings:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve yearly savings',
    };
  }
};

/**
 * Get company comparison data
 * 
 * @param token Auth token
 * @returns Response with company comparison
 */
export const getCompanyComparison = async (token: string): Promise<CompanyComparisonResponse> => {
  try {
    const response = await api.get<CompanyComparisonResponse>(
      '/employee/roi/company-comparison',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get company comparison:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve company comparison',
    };
  }
};

/**
 * Calculate potential savings for a health action
 * 
 * @param token Auth token
 * @param actionType Type of action
 * @param details Action details
 * @returns Response with potential savings amount
 */
export const calculatePotentialSavings = async (
  token: string,
  actionType: string,
  details: any
): Promise<PotentialSavingsResponse> => {
  try {
    const response = await api.post<PotentialSavingsResponse>(
      '/employee/roi/potential-savings',
      { actionType, details },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to calculate potential savings:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to calculate potential savings',
    };
  }
};