// app/onboarding/employer/company-profile.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../../../components/Common/ui/Button';
import { Stepper } from '../../../components/Common/ui/Stepper';
import { useOnboardingProgress } from '../../../hooks/onboarding/useOnboardingProgress';

export default function CompanyProfile() {
  const navigation = useNavigation();
  const { completeStep, getNextStep } = useOnboardingProgress();
  
  const handleComplete = () => {
    completeStep('company-profile');
    navigation.navigate(getNextStep('company-profile'));
  };

  return (
    <View className="flex-1 bg-white">
      <Stepper currentStep={1} totalSteps={4} />
      
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Company Information</Text>
        <Text className="text-gray-600 mb-8">
          Tell us about your organization so we can customize the BenefitMetrics experience.
        </Text>
        
        {/* Company information form fields would go here */}
        
        <View className="mt-8">
          <Button onPress={handleComplete} label="Continue" variant="primary" />
        </View>
      </View>
    </View>
  );
}