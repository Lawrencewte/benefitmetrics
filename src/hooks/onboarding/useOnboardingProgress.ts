import { useEffect, useState } from 'react';
import { progressTracker } from '../../services/onboarding/progressTracker';

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

export function useOnboardingProgress(userId?: string) {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProgress(userId);
    }
  }, [userId]);

  const loadProgress = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const progressData = await progressTracker.getProgress(id);
      setProgress(progressData);
    } catch (err) {
      setError('Failed to load onboarding progress');
      console.error('Error loading progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const completeStep = async (stepId: string, stepData?: Record<string, any>) => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

    try {
      setError(null);
      const updatedProgress = await progressTracker.updateProgress(userId, stepId, stepData);
      setProgress(updatedProgress);
      return true;
    } catch (err) {
      setError('Failed to complete step');
      console.error('Error completing step:', err);
      return false;
    }
  };

  const completeOnboarding = async () => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

    try {
      setError(null);
      await progressTracker.completeOnboarding(userId);
      setProgress(prev => prev ? { ...prev, isComplete: true, completedAt: new Date().toISOString() } : null);
      return true;
    } catch (err) {
      setError('Failed to complete onboarding');
      console.error('Error completing onboarding:', err);
      return false;
    }
  };

  const resetProgress = async () => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

    try {
      setError(null);
      await progressTracker.resetProgress(userId);
      setProgress(null);
      return true;
    } catch (err) {
      setError('Failed to reset progress');
      console.error('Error resetting progress:', err);
      return false;
    }
  };

  const getNextStep = (currentStepId: string): string => {
    if (!progress) return '';
    
    // This would typically be based on the step order from the backend
    const stepOrder = progress.userRole === 'employee' 
      ? ['profile-setup', 'health-history', 'benefits-connect', 'app-tour', 'initial-actions']
      : ['company-profile', 'team-setup', 'benefits-upload', 'admin-tour'];
    
    const currentIndex = stepOrder.indexOf(currentStepId);
    return currentIndex >= 0 && currentIndex < stepOrder.length - 1 
      ? stepOrder[currentIndex + 1] 
      : '';
  };

  const getCurrentStepNumber = (): number => {
    if (!progress) return 0;
    return progress.completedSteps.length + 1;
  };

  const getCompletionPercentage = (): number => {
    if (!progress) return 0;
    return Math.round((progress.completedSteps.length / progress.totalSteps) * 100);
  };

  return {
    progress,
    isLoading,
    error,
    currentStep: progress?.currentStep || '',
    completedSteps: progress?.completedSteps || [],
    totalSteps: progress?.totalSteps || 0,
    isComplete: progress?.isComplete || false,
    completeStep,
    completeOnboarding,
    resetProgress,
    getNextStep,
    getCurrentStepNumber,
    getCompletionPercentage,
  };
}