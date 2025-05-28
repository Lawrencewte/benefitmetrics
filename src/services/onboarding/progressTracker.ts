import { api } from '../api';

interface OnboardingProgress {
  userId: string;
  userRole: 'employee' | 'employer';
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  isComplete: boolean;
  startedAt: string;
  completedAt?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  estimatedDuration: number; // in minutes
}

export const progressTracker = {
  async getProgress(userId: string): Promise<OnboardingProgress> {
    try {
      const response = await api.get(`/onboarding/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      throw error;
    }
  },

  async updateProgress(
    userId: string, 
    stepId: string, 
    stepData?: Record<string, any>
  ): Promise<OnboardingProgress> {
    try {
      const response = await api.post(`/onboarding/progress/${userId}/step`, {
        stepId,
        stepData,
        completedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      throw error;
    }
  },

  async completeOnboarding(userId: string): Promise<void> {
    try {
      await api.post(`/onboarding/progress/${userId}/complete`, {
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  async getStepsForRole(role: 'employee' | 'employer'): Promise<OnboardingStep[]> {
    try {
      const response = await api.get(`/onboarding/steps/${role}`);
      return response.data;
    } catch (error) {
      console.error('Error getting onboarding steps:', error);
      throw error;
    }
  },

  async resetProgress(userId: string): Promise<void> {
    try {
      await api.delete(`/onboarding/progress/${userId}`);
    } catch (error) {
      console.error('Error resetting onboarding progress:', error);
      throw error;
    }
  },

  async getRecommendedNextSteps(userId: string): Promise<string[]> {
    try {
      const response = await api.get(`/onboarding/progress/${userId}/next-steps`);
      return response.data.nextSteps;
    } catch (error) {
      console.error('Error getting next steps:', error);
      throw error;
    }
  },
};