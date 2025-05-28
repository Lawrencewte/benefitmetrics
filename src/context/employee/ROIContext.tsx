import React, { createContext, useContext, useEffect, useState } from 'react';
import * as ROIService from '../../services/employee/roiTracker';
import { useAuth } from '../AuthContext';
import { useAppointments } from './AppointmentContext';

export interface SavingsCategory {
  id: string;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  iconName: string;
}

export interface SavingsItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  amount: number;
  categoryId: string;
  sourceType: 'appointment' | 'benefit' | 'prevention' | 'wellness' | 'other';
  sourceId?: string;
}

export interface YearlySavings {
  year: number;
  totalAmount: number;
  categories: {
    id: string;
    name: string;
    amount: number;
  }[];
}

export interface ProjectedSavings {
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  lifetime: number;
}

export interface CompanyComparison {
  userSavings: number;
  companyAverage: number;
  topQuartile: number;
  employeeCount: number;
  departmentAverage?: number;
  departmentName?: string;
}

interface ROIState {
  totalSavings: number;
  yearlySavings: YearlySavings[];
  categories: SavingsCategory[];
  recentItems: SavingsItem[];
  projectedSavings: ProjectedSavings;
  companyComparison: CompanyComparison | null;
  isLoading: boolean;
  error: string | null;
}

interface ROIContextType extends ROIState {
  fetchROIData: () => Promise<void>;
  fetchSavingItems: (limit?: number) => Promise<void>;
  fetchYearlySavings: () => Promise<void>;
  fetchCompanyComparison: () => Promise<void>;
  getSavingsByCategoryId: (categoryId: string) => SavingsItem[];
  calculatePotentialSavings: (actionType: string, details: any) => Promise<number>;
}

const ROIContext = createContext<ROIContextType | undefined>(undefined);

export const ROIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const { appointments } = useAppointments();
  
  const [state, setState] = useState<ROIState>({
    totalSavings: 0,
    yearlySavings: [],
    categories: [],
    recentItems: [],
    projectedSavings: {
      oneYear: 0,
      threeYear: 0,
      fiveYear: 0,
      lifetime: 0,
    },
    companyComparison: null,
    isLoading: false,
    error: null,
  });

  // Load ROI data when user changes
  useEffect(() => {
    if (user && token) {
      fetchROIData();
      fetchSavingItems();
      fetchYearlySavings();
      fetchCompanyComparison();
    } else {
      // Reset state when user logs out
      setState({
        totalSavings: 0,
        yearlySavings: [],
        categories: [],
        recentItems: [],
        projectedSavings: {
          oneYear: 0,
          threeYear: 0,
          fiveYear: 0,
          lifetime: 0,
        },
        companyComparison: null,
        isLoading: false,
        error: null,
      });
    }
  }, [user, token]);

  // Update ROI data when appointments change
  useEffect(() => {
    if (user && token && appointments.length > 0) {
      // Check if there are completed appointments that might have generated savings
      const completedAppointments = appointments.filter(
        appointment => appointment.status === 'completed'
      );
      
      if (completedAppointments.length > 0) {
        fetchROIData();
        fetchSavingItems();
      }
    }
  }, [appointments]);

  const fetchROIData = async () => {
    if (!user || !token) return;
    
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      const response = await ROIService.getROIOverview(token);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          totalSavings: response.totalSavings || 0,
          categories: response.categories || [],
          projectedSavings: response.projectedSavings || {
            oneYear: 0,
            threeYear: 0,
            fiveYear: 0,
            lifetime: 0,
          },
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch ROI data');
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to fetch ROI data',
        isLoading: false,
      }));
      console.error('Failed to fetch ROI data:', error);
    }
  };

  const fetchSavingItems = async (limit = 10) => {
    if (!user || !token) return;
    
    try {
      const response = await ROIService.getSavingsItems(token, limit);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          recentItems: response.items || [],
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch savings items');
      }
    } catch (error) {
      console.error('Failed to fetch savings items:', error);
    }
  };

  const fetchYearlySavings = async () => {
    if (!user || !token) return;
    
    try {
      const response = await ROIService.getYearlySavings(token);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          yearlySavings: response.yearlySavings || [],
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch yearly savings');
      }
    } catch (error) {
      console.error('Failed to fetch yearly savings:', error);
    }
  };

  const fetchCompanyComparison = async () => {
    if (!user || !token) return;
    
    try {
      const response = await ROIService.getCompanyComparison(token);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          companyComparison: response.comparison || null,
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch company comparison');
      }
    } catch (error) {
      console.error('Failed to fetch company comparison:', error);
    }
  };

  const getSavingsByCategoryId = (categoryId: string): SavingsItem[] => {
    return state.recentItems.filter(item => item.categoryId === categoryId);
  };

  const calculatePotentialSavings = async (actionType: string, details: any): Promise<number> => {
    if (!user || !token) {
      return 0;
    }
    
    try {
      const response = await ROIService.calculatePotentialSavings(token, actionType, details);
      
      if (response.success) {
        return response.potentialSavings || 0;
      } else {
        throw new Error(response.message || 'Failed to calculate potential savings');
      }
    } catch (error) {
      console.error('Failed to calculate potential savings:', error);
      return 0;
    }
  };

  return (
    <ROIContext.Provider
      value={{
        ...state,
        fetchROIData,
        fetchSavingItems,
        fetchYearlySavings,
        fetchCompanyComparison,
        getSavingsByCategoryId,
        calculatePotentialSavings,
      }}
    >
      {children}
    </ROIContext.Provider>
  );
};

export const useROI = () => {
  const context = useContext(ROIContext);
  
  if (context === undefined) {
    throw new Error('useROI must be used within a ROIProvider');
  }
  
  return context;
};

export default ROIContext;