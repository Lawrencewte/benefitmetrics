import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as OnboardingService from '../services/onboarding/progressTracker';
import { useAuth } from './AuthContext';
import { useRole } from './RoleContext';

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle?: string;
  isCompleted: boolean;
  isRequired: boolean;
  route: string;
}

interface EmployeeOnboardingState {
  steps: OnboardingStep[];
  currentStepId: string;
  progress: number; // 0 to 1
  isComplete: boolean;
}

interface EmployerOnboardingState {
  steps: OnboardingStep[];
  currentStepId: string;
  progress: number; // 0 to 1
  isComplete: boolean;
}

interface OnboardingContextType {
  employeeOnboarding: EmployeeOnboardingState;
  employerOnboarding: EmployerOnboardingState;
  currentStepId: string;
  currentStep: OnboardingStep | null;
  progress: number;
  isComplete: boolean;
  completeStep: (stepId: string) => Promise<void>;
  skipStep: (stepId: string) => Promise<void>;
  goToStep: (stepId: string) => void;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Storage keys
const STORAGE_EMPLOYEE_ONBOARDING_KEY = '@BenefitMetrics:employee_onboarding';
const STORAGE_EMPLOYER_ONBOARDING_KEY = '@BenefitMetrics:employer_onboarding';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, updateOnboardingStatus } = useAuth();
  const { role } = useRole();

  // Default employee onboarding steps
  const defaultEmployeeSteps: OnboardingStep[] = [
    {
      id: 'profile-setup',
      title: 'Profile Setup',
      subtitle: 'Tell us about yourself',
      isCompleted: false,
      isRequired: true,
      route: '/onboarding/employee/profile-setup',
    },
    {
      id: 'health-history',
      title: 'Health History',
      subtitle: 'Your medical background',
      isCompleted: false,
      isRequired: true,
      route: '/onboarding/employee/health-history',
    },
    {
      id: 'benefits-connect',
      title: 'Benefits Connection',
      subtitle: 'Connect to your employer benefits',
      isCompleted: false,
      isRequired: true,
      route: '/onboarding/employee/benefits-connect',
    },
    {
      id: 'app-tour',
      title: 'App Tour',
      subtitle: 'Learn about key features',
      isCompleted: false,
      isRequired: false,
      route: '/onboarding/employee/app-tour',
    },
    {
      id: 'initial-actions',
      title: 'First Steps',
      subtitle: 'Schedule your first checkups',
      isCompleted: false,
      isRequired: false,
      route: '/onboarding/employee/initial-actions',
    },
  ];

  // Default employer onboarding steps
  const defaultEmployerSteps: OnboardingStep[] = [
    {
      id: 'company-profile',
      title: 'Company Profile',
      subtitle: 'Company information',
      isCompleted: false,
      isRequired: true,
      route: '/onboarding/employer/company-profile',
    },
    {
      id: 'team-setup',
      title: 'Team Setup',
      subtitle: 'Define your organization structure',
      isCompleted: false,
      isRequired: true,
      route: '/onboarding/employer/team-setup',
    },
    {
      id: 'benefits-upload',
      title: 'Benefits Setup',
      subtitle: 'Configure your health benefits',
      isCompleted: false,
      isRequired: true,
      route: '/onboarding/employer/benefits-upload',
    },
    {
      id: 'admin-tour',
      title: 'Admin Tour',
      subtitle: 'Learn about admin features',
      isCompleted: false,
      isRequired: false,
      route: '/onboarding/employer/admin-tour',
    },
  ];

  // Initialize state
  const [employeeOnboarding, setEmployeeOnboarding] = useState<EmployeeOnboardingState>({
    steps: defaultEmployeeSteps,
    currentStepId: defaultEmployeeSteps[0].id,
    progress: 0,
    isComplete: false,
  });

  const [employerOnboarding, setEmployerOnboarding] = useState<EmployerOnboardingState>({
    steps: defaultEmployerSteps,
    currentStepId: defaultEmployerSteps[0].id,
    progress: 0,
    isComplete: false,
  });

  // Calculate derived state based on role
  const isEmployee = role === 'employee';
  const currentStepId = isEmployee ? employeeOnboarding.currentStepId : employerOnboarding.currentStepId;
  const progress = isEmployee ? employeeOnboarding.progress : employerOnboarding.progress;
  const isComplete = isEmployee ? employeeOnboarding.isComplete : employerOnboarding.isComplete;
  
  const steps = isEmployee ? employeeOnboarding.steps : employerOnboarding.steps;
  const currentStep = steps.find((step) => step.id === currentStepId) || null;

  // Load onboarding state from storage or API on init
  useEffect(() => {
    const loadOnboardingState = async () => {
      if (!user || !token) return;

      try {
        // Try to get state from API first
        const response = await OnboardingService.getOnboardingProgress(token);
        
        if (response.success) {
          // API provided state, use it
          if (isEmployee) {
            setEmployeeOnboarding({
              steps: response.employeeSteps || defaultEmployeeSteps,
              currentStepId: response.currentEmployeeStepId || defaultEmployeeSteps[0].id,
              progress: response.employeeProgress || 0,
              isComplete: response.isEmployeeComplete || false,
            });
          } else {
            setEmployerOnboarding({
              steps: response.employerSteps || defaultEmployerSteps,
              currentStepId: response.currentEmployerStepId || defaultEmployerSteps[0].id,
              progress: response.employerProgress || 0,
              isComplete: response.isEmployerComplete || false,
            });
          }
        } else {
          // API failed, try local storage
          const storageKey = isEmployee ? STORAGE_EMPLOYEE_ONBOARDING_KEY : STORAGE_EMPLOYER_ONBOARDING_KEY;
          const storedData = await AsyncStorage.getItem(storageKey);
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            if (isEmployee) {
              setEmployeeOnboarding(parsedData);
            } else {
              setEmployerOnboarding(parsedData);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
      }
    };

    loadOnboardingState();
  }, [user, token, role]);

  // Update progress calculation when steps change
  useEffect(() => {
    const updateProgress = async () => {
      if (!user) return;

      const currentState = isEmployee ? employeeOnboarding : employerOnboarding;
      const completedSteps = currentState.steps.filter((step) => step.isCompleted);
      const requiredSteps = currentState.steps.filter((step) => step.isRequired);
      
      const completedRequired = completedSteps.filter((step) => step.isRequired);
      
      // Calculate progress as percentage of completed required steps
      const newProgress = requiredSteps.length > 0 
        ? completedRequired.length / requiredSteps.length 
        : 0;
        
      // Determine if onboarding is complete (all required steps are done)
      const newIsComplete = requiredSteps.length > 0 
        ? completedRequired.length === requiredSteps.length 
        : false;
      
      // Find first incomplete step (or first step if all complete)
      const firstIncompleteStep = currentState.steps.find((step) => !step.isCompleted) 
        || currentState.steps[0];
        
      const newCurrentStepId = currentState.isComplete 
        ? currentState.currentStepId  // Keep current if already complete
        : firstIncompleteStep.id;
      
      // Update state with new calculations
      if (isEmployee) {
        if (
          newProgress !== employeeOnboarding.progress ||
          newIsComplete !== employeeOnboarding.isComplete ||
          newCurrentStepId !== employeeOnboarding.currentStepId
        ) {
          const newState = {
            ...employeeOnboarding,
            progress: newProgress,
            isComplete: newIsComplete,
            currentStepId: newCurrentStepId,
          };
          
          setEmployeeOnboarding(newState);
          
          // Save to storage
          await AsyncStorage.setItem(
            STORAGE_EMPLOYEE_ONBOARDING_KEY, 
            JSON.stringify(newState)
          );
          
          // If completed, update user onboarding status
          if (newIsComplete && !employeeOnboarding.isComplete) {
            await updateOnboardingStatus(true);
          }
          
          // Sync with server
          if (token) {
            await OnboardingService.updateOnboardingProgress(
              token,
              {
                role: 'employee',
                progress: newProgress,
                isComplete: newIsComplete,
                currentStepId: newCurrentStepId,
                steps: newState.steps,
              }
            );
          }
        }
      } else {
        if (
          newProgress !== employerOnboarding.progress ||
          newIsComplete !== employerOnboarding.isComplete ||
          newCurrentStepId !== employerOnboarding.currentStepId
        ) {
          const newState = {
            ...employerOnboarding,
            progress: newProgress,
            isComplete: newIsComplete,
            currentStepId: newCurrentStepId,
          };
          
          setEmployerOnboarding(newState);
          
          // Save to storage
          await AsyncStorage.setItem(
            STORAGE_EMPLOYER_ONBOARDING_KEY, 
            JSON.stringify(newState)
          );
          
          // If completed, update user onboarding status
          if (newIsComplete && !employerOnboarding.isComplete) {
            await updateOnboardingStatus(true);
          }
          
          // Sync with server
          if (token) {
            await OnboardingService.updateOnboardingProgress(
              token,
              {
                role: 'employer',
                progress: newProgress,
                isComplete: newIsComplete,
                currentStepId: newCurrentStepId,
                steps: newState.steps,
              }
            );
          }
        }
      }
    };

    updateProgress();
  }, [isEmployee, employeeOnboarding.steps, employerOnboarding.steps]);

  const completeStep = async (stepId: string) => {
    if (!user) return;

    try {
      if (isEmployee) {
        const newSteps = employeeOnboarding.steps.map((step) =>
          step.id === stepId ? { ...step, isCompleted: true } : step
        );

        setEmployeeOnboarding({
          ...employeeOnboarding,
          steps: newSteps,
        });
      } else {
        const newSteps = employerOnboarding.steps.map((step) =>
          step.id === stepId ? { ...step, isCompleted: true } : step
        );

        setEmployerOnboarding({
          ...employerOnboarding,
          steps: newSteps,
        });
      }

      // Server-side update
      if (token) {
        await OnboardingService.completeOnboardingStep(token, stepId, isEmployee ? 'employee' : 'employer');
      }
    } catch (error) {
      console.error('Failed to complete onboarding step:', error);
    }
  };

  const skipStep = async (stepId: string) => {
    if (!user) return;

    try {
      // Only non-required steps can be skipped
      const currentSteps = isEmployee ? employeeOnboarding.steps : employerOnboarding.steps;
      const stepToSkip = currentSteps.find((step) => step.id === stepId);

      if (!stepToSkip || stepToSkip.isRequired) {
        throw new Error('Cannot skip a required step');
      }

      if (isEmployee) {
        const newSteps = employeeOnboarding.steps.map((step) =>
          step.id === stepId ? { ...step, isCompleted: true } : step
        );

        setEmployeeOnboarding({
          ...employeeOnboarding,
          steps: newSteps,
        });
      } else {
        const newSteps = employerOnboarding.steps.map((step) =>
          step.id === stepId ? { ...step, isCompleted: true } : step
        );

        setEmployerOnboarding({
          ...employerOnboarding,
          steps: newSteps,
        });
      }

      // Server-side update
      if (token) {
        await OnboardingService.skipOnboardingStep(token, stepId, isEmployee ? 'employee' : 'employer');
      }
    } catch (error) {
      console.error('Failed to skip onboarding step:', error);
    }
  };

  const goToStep = (stepId: string) => {
    if (!user) return;

    if (isEmployee) {
      setEmployeeOnboarding({
        ...employeeOnboarding,
        currentStepId: stepId,
      });
    } else {
      setEmployerOnboarding({
        ...employerOnboarding,
        currentStepId: stepId,
      });
    }
  };

  const resetOnboarding = async () => {
    if (!user || !token) return;

    try {
      if (isEmployee) {
        setEmployeeOnboarding({
          steps: defaultEmployeeSteps,
          currentStepId: defaultEmployeeSteps[0].id,
          progress: 0,
          isComplete: false,
        });

        await AsyncStorage.setItem(
          STORAGE_EMPLOYEE_ONBOARDING_KEY,
          JSON.stringify({
            steps: defaultEmployeeSteps,
            currentStepId: defaultEmployeeSteps[0].id,
            progress: 0,
            isComplete: false,
          })
        );
      } else {
        setEmployerOnboarding({
          steps: defaultEmployerSteps,
          currentStepId: defaultEmployerSteps[0].id,
          progress: 0,
          isComplete: false,
        });

        await AsyncStorage.setItem(
          STORAGE_EMPLOYER_ONBOARDING_KEY,
          JSON.stringify({
            steps: defaultEmployerSteps,
            currentStepId: defaultEmployerSteps[0].id,
            progress: 0,
            isComplete: false,
          })
        );
      }

      // Reset onboarding status on the server
      await updateOnboardingStatus(false);
      
      // Reset on server
      await OnboardingService.resetOnboarding(token, isEmployee ? 'employee' : 'employer');
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        employeeOnboarding,
        employerOnboarding,
        currentStepId,
        currentStep,
        progress,
        isComplete,
        completeStep,
        skipStep,
        goToStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
};

export default OnboardingContext;