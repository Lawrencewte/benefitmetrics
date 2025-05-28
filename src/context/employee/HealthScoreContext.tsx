import React, { createContext, useContext, useEffect, useState } from 'react';
import * as HealthScoreService from '../../services/employee/healthScore';
import { useAuth } from '../AuthContext';
import { useNotifications } from '../Common/NotificationsContext';

export interface HealthCategory {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  iconName: string;
  metrics: HealthMetric[];
}

export interface HealthMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  targetValue: number;
  unit: string;
  importance: number; // 1-10 scale for weight in score calculation
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  lastUpdated: Date;
}

export interface ImprovementSuggestion {
  id: string;
  title: string;
  description: string;
  impact: number; // Potential points improvement
  difficulty: 'easy' | 'moderate' | 'hard';
  categoryId: string;
  actionType: 'appointment' | 'habit' | 'challenge' | 'education';
  actionDetails?: any;
}

export interface HealthScoreHistory {
  date: Date;
  score: number;
  categories: {
    id: string;
    name: string;
    score: number;
  }[];
}

interface HealthScoreState {
  overallScore: number;
  previousScore: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTier: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  pointsToNextTier: number;
  categories: HealthCategory[];
  suggestions: ImprovementSuggestion[];
  history: HealthScoreHistory[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface HealthScoreContextType extends HealthScoreState {
  fetchHealthScore: () => Promise<void>;
  fetchHealthScoreHistory: () => Promise<void>;
  fetchImprovementSuggestions: () => Promise<void>;
  updateMetric: (metricId: string, value: number) => Promise<void>;
  trackAction: (actionType: string, actionDetails: any) => Promise<void>;
  simulateScoreChange: (metricId: string, newValue: number) => number;
}

const HealthScoreContext = createContext<HealthScoreContextType | undefined>(undefined);

// Define tier thresholds
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 60,
  gold: 80,
  platinum: 90,
};

export const HealthScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const { schedulePushNotification } = useNotifications();
  
  const [state, setState] = useState<HealthScoreState>({
    overallScore: 0,
    previousScore: 0,
    tier: 'bronze',
    nextTier: 'silver',
    pointsToNextTier: 60,
    categories: [],
    suggestions: [],
    history: [],
    lastUpdated: null,
    isLoading: false,
    error: null,
  });

  // Load health score when user changes
  useEffect(() => {
    if (user && token) {
      fetchHealthScore();
      fetchHealthScoreHistory();
      fetchImprovementSuggestions();
    } else {
      // Reset state when user logs out
      setState({
        overallScore: 0,
        previousScore: 0,
        tier: 'bronze',
        nextTier: 'silver',
        pointsToNextTier: 60,
        categories: [],
        suggestions: [],
        history: [],
        lastUpdated: null,
        isLoading: false,
        error: null,
      });
    }
  }, [user, token]);

  // Calculate tier info when score changes
  useEffect(() => {
    const calculateTierInfo = () => {
      let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
      let nextTier: 'bronze' | 'silver' | 'gold' | 'platinum' | null = 'silver';
      let pointsToNextTier = 0;
      
      // Determine current tier
      if (state.overallScore >= TIER_THRESHOLDS.platinum) {
        tier = 'platinum';
        nextTier = null;
        pointsToNextTier = 0;
      } else if (state.overallScore >= TIER_THRESHOLDS.gold) {
        tier = 'gold';
        nextTier = 'platinum';
        pointsToNextTier = TIER_THRESHOLDS.platinum - state.overallScore;
      } else if (state.overallScore >= TIER_THRESHOLDS.silver) {
        tier = 'silver';
        nextTier = 'gold';
        pointsToNextTier = TIER_THRESHOLDS.gold - state.overallScore;
      } else {
        tier = 'bronze';
        nextTier = 'silver';
        pointsToNextTier = TIER_THRESHOLDS.silver - state.overallScore;
      }
      
      if (tier !== state.tier) {
        // Tier changed, send notification
        if (user && tier !== 'bronze') {
          schedulePushNotification(
            `Congratulations! You've reached ${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`,
            `Your Health Score is now ${state.overallScore}. Keep up the good work!`,
            {
              type: 'achievement',
              category: 'achievement',
            }
          );
        }
      }
      
      setState(prevState => ({
        ...prevState,
        tier,
        nextTier,
        pointsToNextTier,
      }));
    };

    calculateTierInfo();
  }, [state.overallScore]);

  const fetchHealthScore = async () => {
    if (!user || !token) return;
    
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      const response = await HealthScoreService.getHealthScore(token);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          overallScore: response.score || 0,
          previousScore: response.previousScore || 0,
          categories: response.categories || [],
          lastUpdated: response.lastUpdated ? new Date(response.lastUpdated) : null,
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch health score');
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to fetch health score',
        isLoading: false,
      }));
      console.error('Failed to fetch health score:', error);
    }
  };

  const fetchHealthScoreHistory = async () => {
    if (!user || !token) return;
    
    try {
      const response = await HealthScoreService.getHealthScoreHistory(token);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          history: response.history || [],
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch health score history');
      }
    } catch (error) {
      console.error('Failed to fetch health score history:', error);
    }
  };

  const fetchImprovementSuggestions = async () => {
    if (!user || !token) return;
    
    try {
      const response = await HealthScoreService.getImprovementSuggestions(token);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          suggestions: response.suggestions || [],
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch improvement suggestions');
      }
    } catch (error) {
      console.error('Failed to fetch improvement suggestions:', error);
    }
  };

  const updateMetric = async (metricId: string, value: number) => {
    if (!user || !token) return;
    
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      const response = await HealthScoreService.updateHealthMetric(token, metricId, value);
      
      if (response.success) {
        // Update the metric in state
        const updatedCategories = state.categories.map(category => {
          const updatedMetrics = category.metrics.map(metric => {
            if (metric.id === metricId) {
              return {
                ...metric,
                value,
                status: response.newStatus || metric.status,
                lastUpdated: new Date(),
              };
            }
            return metric;
          });
          
          if (updatedMetrics.some(m => m.id === metricId)) {
            return {
              ...category,
              score: response.newCategoryScore || category.score,
              metrics: updatedMetrics,
            };
          }
          
          return category;
        });
        
        setState(prevState => ({
          ...prevState,
          overallScore: response.newScore || prevState.overallScore,
          previousScore: prevState.overallScore,
          categories: updatedCategories,
          lastUpdated: new Date(),
          isLoading: false,
        }));
        
        // Refresh suggestions after metric update
        fetchImprovementSuggestions();
      } else {
        throw new Error(response.message || 'Failed to update health metric');
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to update health metric',
        isLoading: false,
      }));
      console.error('Failed to update health metric:', error);
    }
  };

  const trackAction = async (actionType: string, actionDetails: any) => {
    if (!user || !token) return;
    
    try {
      const response = await HealthScoreService.trackHealthAction(token, actionType, actionDetails);
      
      if (response.success) {
        // If health score changed, update it
        if (response.newScore) {
          setState(prevState => ({
            ...prevState,
            overallScore: response.newScore!,
            previousScore: prevState.overallScore,
          }));
          
          // Refresh data after action is tracked
          fetchHealthScore();
          fetchImprovementSuggestions();
        }
      } else {
        throw new Error(response.message || 'Failed to track health action');
      }
    } catch (error) {
      console.error('Failed to track health action:', error);
    }
  };

  // Simulate how a metric change would affect score (without saving)
  const simulateScoreChange = (metricId: string, newValue: number): number => {
    // Find the metric and its category
    let metric: HealthMetric | null = null;
    let category: HealthCategory | null = null;
    
    for (const cat of state.categories) {
      const foundMetric = cat.metrics.find(m => m.id === metricId);
      if (foundMetric) {
        metric = foundMetric;
        category = cat;
        break;
      }
    }
    
    if (!metric || !category) return state.overallScore;
    
    // This is a simplified simulation - real score calculation would be more complex
    // and would happen on the server
    
    // Calculate how much this metric contributes to the category score
    const metricWeight = metric.importance / category.metrics.reduce((sum, m) => sum + m.importance, 0);
    
    // Calculate the current metric contribution
    const currentContribution = (metric.value / metric.targetValue) * metricWeight * category.maxScore;
    
    // Calculate the new contribution
    const newContribution = (newValue / metric.targetValue) * metricWeight * category.maxScore;
    
    // Calculate change in category score
    const categoryScoreChange = newContribution - currentContribution;
    
    // Calculate weight of this category in the overall score
    const categoryWeight = category.maxScore / state.categories.reduce((sum, c) => sum + c.maxScore, 0);
    
    // Calculate change in overall score
    const overallScoreChange = categoryScoreChange * categoryWeight;
    
    // Return simulated new score (capped at 100)
    return Math.min(100, Math.max(0, state.overallScore + overallScoreChange));
  };

  return (
    <HealthScoreContext.Provider
      value={{
        ...state,
        fetchHealthScore,
        fetchHealthScoreHistory,
        fetchImprovementSuggestions,
        updateMetric,
        trackAction,
        simulateScoreChange,
      }}
    >
      {children}
    </HealthScoreContext.Provider>
  );
};

export const useHealthScore = () => {
  const context = useContext(HealthScoreContext);
  
  if (context === undefined) {
    throw new Error('useHealthScore must be used within a HealthScoreProvider');
  }
  
  return context;
};

export default HealthScoreContext;