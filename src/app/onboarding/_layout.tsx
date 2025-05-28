import { Stack, usePathname, useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Components
import { Stepper } from '../../components/Common/ui/Stepper';

// Context
import {
  OnboardingProvider,
  OnboardingStep,
  useOnboarding,
  UserRole
} from '../../context/OnboardingContext';

// Define step titles for the stepper
const getStepTitle = (step: OnboardingStep): string => {
  switch (step) {
    case OnboardingStep.ROLE_SELECTION:
      return 'Select Role';
    case OnboardingStep.EMPLOYEE_PROFILE_SETUP:
      return 'Profile Setup';
    case OnboardingStep.EMPLOYEE_HEALTH_HISTORY:
      return 'Health History';
    case OnboardingStep.EMPLOYEE_BENEFITS_CONNECT:
      return 'Benefits';
    case OnboardingStep.EMPLOYEE_APP_TOUR:
      return 'App Tour';
    case OnboardingStep.EMPLOYEE_INITIAL_ACTIONS:
      return 'Next Steps';
    case OnboardingStep.EMPLOYER_COMPANY_PROFILE:
      return 'Company Profile';
    case OnboardingStep.EMPLOYER_TEAM_SETUP:
      return 'Team Setup';
    case OnboardingStep.EMPLOYER_BENEFITS_UPLOAD:
      return 'Benefits Setup';
    case OnboardingStep.EMPLOYER_ADMIN_TOUR:
      return 'Admin Tour';
    case OnboardingStep.COMPLETED:
      return 'Complete';
    default:
      return 'Onboarding';
  }
};

// Helper to get steps array based on role
const getStepsForRole = (role?: UserRole): OnboardingStep[] => {
  if (role === UserRole.EMPLOYEE) {
    return [
      OnboardingStep.ROLE_SELECTION,
      OnboardingStep.EMPLOYEE_PROFILE_SETUP,
      OnboardingStep.EMPLOYEE_HEALTH_HISTORY,
      OnboardingStep.EMPLOYEE_BENEFITS_CONNECT,
      OnboardingStep.EMPLOYEE_APP_TOUR,
      OnboardingStep.EMPLOYEE_INITIAL_ACTIONS
    ];
  } else if (role === UserRole.EMPLOYER) {
    return [
      OnboardingStep.ROLE_SELECTION,
      OnboardingStep.EMPLOYER_COMPANY_PROFILE,
      OnboardingStep.EMPLOYER_TEAM_SETUP,
      OnboardingStep.EMPLOYER_BENEFITS_UPLOAD,
      OnboardingStep.EMPLOYER_ADMIN_TOUR
    ];
  } else {
    return [OnboardingStep.ROLE_SELECTION];
  }
};

// Layout wrapper component
const OnboardingLayout = () => {
  return (
    <OnboardingProvider>
      <OnboardingLayoutContent />
    </OnboardingProvider>
  );
};

// Main layout content
const OnboardingLayoutContent = () => {
  const { 
    currentStep, 
    onboardingData, 
    isOnboardingComplete,
    moveToPreviousStep,
    resetOnboarding
  } = useOnboarding();
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Handle navigation when onboarding is complete
  useEffect(() => {
    if (isOnboardingComplete) {
      // Redirect to the appropriate dashboard
      const redirectPath = onboardingData.role === UserRole.EMPLOYEE
        ? '/employee/'
        : '/employer/';
      
      router.replace(redirectPath);
    }
  }, [isOnboardingComplete]);
  
  // Determine if back button should be shown
  const shouldShowBackButton = (): boolean => {
    return currentStep !== OnboardingStep.ROLE_SELECTION;
  };
  
  // Handle back button press
  const handleBackPress = async () => {
    await moveToPreviousStep();
  };
  
  // Handle exit button press
  const handleExitPress = async () => {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to exit onboarding? Your progress will be saved.');
    
    if (confirmed) {
      // Save current progress and return to auth screen
      router.replace('/auth/login');
    }
  };
  
  // Get progress percentage
  const getProgressPercentage = (): number => {
    const steps = getStepsForRole(onboardingData.role);
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex === -1) return 0;
    
    return (currentIndex / (steps.length - 1)) * 100;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: getStepTitle(currentStep),
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        {shouldShowBackButton() ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            testID="onboarding-back-button"
          >
            <ArrowLeft size={24} color="#3B82F6" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <Text style={styles.title}>{getStepTitle(currentStep)}</Text>
        
        <TouchableOpacity 
          style={styles.exitButton} 
          onPress={handleExitPress}
          testID="onboarding-exit-button"
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Stepper 
          steps={getStepsForRole(onboardingData.role).map(step => getStepTitle(step))}
          currentStep={getStepsForRole(onboardingData.role).indexOf(currentStep)}
          progressPercent={getProgressPercentage()}
        />
      </View>
      
      {/* Main content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Stack />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  backButton: {
    padding: 8,
  },
  exitButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});

export default OnboardingLayout;