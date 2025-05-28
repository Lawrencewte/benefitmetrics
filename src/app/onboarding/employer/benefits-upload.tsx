import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../../../components/Common/ui/Button';
import { Stepper } from '../../../components/Common/ui/Stepper';
import { useOnboardingProgress } from '../../../hooks/onboarding/useOnboardingProgress';

export default function BenefitsUpload() {
  const navigation = useNavigation();
  const { completeStep, getNextStep } = useOnboardingProgress();
  
  const handleNext = () => {
    completeStep('benefits-upload');
    navigation.navigate(getNextStep('benefits-upload'));
  };

  return (
    <View className="flex-1 bg-white">
      <Stepper currentStep={3} totalSteps={4} />
      
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4">Benefits Information</Text>
        <Text className="text-gray-600 mb-6">
          Upload or configure your company's health benefits to help employees maximize their coverage.
        </Text>
        
        <View className="space-y-6 mb-6">
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Health Insurance Plans</Text>
            <Text className="text-gray-600 mb-4">Add the health insurance plans available to your employees.</Text>
            <Button 
              label="Upload Plan Details" 
              variant="outline"
              onPress={() => {}}
            />
          </View>
          
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Preventative Care Benefits</Text>
            <Text className="text-gray-600 mb-4">Specify covered preventative services and any special programs.</Text>
            <Button 
              label="Configure Benefits" 
              variant="outline"
              onPress={() => {}}
            />
          </View>
          
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Wellness Incentives</Text>
            <Text className="text-gray-600 mb-4">Set up rewards for preventative care completion.</Text>
            <Button 
              label="Add Incentives" 
              variant="outline"
              onPress={() => {}}
            />
          </View>
        </View>
        
        <Button 
          onPress={handleNext} 
          label="Continue" 
          variant="primary"
        />
      </ScrollView>
    </View>
  );
}