import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../../../components/Common/ui/Button';
import { Stepper } from '../../../components/Common/ui/Stepper';
import { useOnboardingProgress } from '../../../hooks/onboarding/useOnboardingProgress';

interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

export default function TeamSetup() {
  const navigation = useNavigation();
  const { completeStep, getNextStep } = useOnboardingProgress();
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Engineering', employeeCount: 0 },
    { id: '2', name: 'Marketing', employeeCount: 0 },
    { id: '3', name: 'Sales', employeeCount: 0 },
    { id: '4', name: 'Human Resources', employeeCount: 0 },
    { id: '5', name: 'Finance', employeeCount: 0 },
  ]);
  
  const handleNext = () => {
    completeStep('team-setup');
    navigation.navigate(getNextStep('team-setup'));
  };

  return (
    <View className="flex-1 bg-white">
      <Stepper currentStep={2} totalSteps={4} />
      
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4">Team Structure</Text>
        <Text className="text-gray-600 mb-6">
          Define your organization's departments to help us customize analytics and health programs.
        </Text>
        
        {/* Department configuration would go here */}
        <View className="space-y-4 mb-6">
          {departments.map(dept => (
            <View key={dept.id} className="border border-gray-200 rounded-lg p-4">
              <Text className="font-medium">{dept.name}</Text>
              {/* Employee count input would go here */}
            </View>
          ))}
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