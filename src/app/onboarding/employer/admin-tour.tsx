import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../../../components/Common/ui/Button';
import { Stepper } from '../../../components/Common/ui/Stepper';
import { useOnboardingProgress } from '../../../hooks/onboarding/useOnboardingProgress';

export default function AdminTour() {
  const navigation = useNavigation();
  const { completeOnboarding } = useOnboardingProgress();
  
  const handleComplete = () => {
    completeOnboarding();
    navigation.navigate('employer');
  };

  return (
    <View className="flex-1 bg-white">
      <Stepper currentStep={4} totalSteps={4} />
      
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4">Admin Dashboard Tour</Text>
        <Text className="text-gray-600 mb-6">
          Let's explore the key features of your admin dashboard to help monitor and improve your organization's health.
        </Text>
        
        <View className="space-y-6 mb-6">
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Analytics Dashboard</Text>
            <Text className="text-gray-600">
              Monitor benefit utilization rates, health metrics, and ROI across your organization.
            </Text>
          </View>
          
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Program Management</Text>
            <Text className="text-gray-600">
              Create and manage wellness challenges, incentives, and health initiatives.
            </Text>
          </View>
          
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Communication Tools</Text>
            <Text className="text-gray-600">
              Send targeted reminders and announcements about preventative health benefits.
            </Text>
          </View>
          
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="font-medium mb-2">Compliance Center</Text>
            <Text className="text-gray-600">
              Monitor and maintain HIPAA compliance and data privacy standards.
            </Text>
          </View>
        </View>
        
        <Button 
          onPress={handleComplete} 
          label="Get Started" 
          variant="primary"
        />
      </ScrollView>
    </View>
  );
}