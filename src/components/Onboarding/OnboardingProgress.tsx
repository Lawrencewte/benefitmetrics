import React from 'react';
import { Text, View } from 'react-native';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  stepLabels 
}: OnboardingProgressProps) {
  return (
    <View className="px-4 py-6">
      <View className="flex-row justify-between items-center mb-2">
        {[...Array(totalSteps)].map((_, index) => (
          <View 
            key={index} 
            className={`h-2 flex-1 mx-1 rounded-full ${
              index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </View>
      
      {stepLabels && (
        <Text className="text-center text-sm text-gray-600">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
        </Text>
      )}
    </View>
  );
}