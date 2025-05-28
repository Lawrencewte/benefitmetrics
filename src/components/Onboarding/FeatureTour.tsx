import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Button } from '../Common/ui/Button';

interface TourStep {
  id: string;
  title: string;
  description: string;
  imagePath: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'health-score',
    title: 'Health Score',
    description: 'Track your preventative health metrics with our proprietary Health Score system that rewards staying on top of your health.',
    imagePath: '/assets/feature-tour/health-score.png',
  },
  {
    id: 'roi-tracker',
    title: 'ROI Tracker',
    description: 'See the financial impact of your preventative healthcare activities, including insurance savings and avoided costs.',
    imagePath: '/assets/feature-tour/roi-tracker.png',
  },
  {
    id: 'care-timeline',
    title: 'Care Timeline',
    description: 'Our AI-powered timeline helps coordinate your appointments based on your work schedule and benefits deadlines.',
    imagePath: '/assets/feature-tour/care-timeline.png',
  },
  {
    id: 'challenges',
    title: 'Health Challenges',
    description: 'Participate in company wellness challenges to earn rewards and improve your health score.',
    imagePath: '/assets/feature-tour/challenges.png',
  },
];

export function FeatureTour() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  
  const goToNextStep = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const currentStep = tourSteps[currentStepIndex];
  
  return (
    <View className="bg-white rounded-lg border border-gray-200">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-medium text-center">{currentStep.title}</Text>
      </View>
      
      <View className="p-4">
        <View className="items-center justify-center mb-4">
          {/* Placeholder for image */}
          <View 
            className="bg-gray-100 rounded-lg"
            style={{ width: windowWidth - 80, height: 200 }}
          />
        </View>
        
        <Text className="text-gray-600 text-center mb-6">
          {currentStep.description}
        </Text>
        
        <View className="flex-row justify-between items-center">
          <Button
            onPress={goToPreviousStep}
            variant="outline"
            disabled={currentStepIndex === 0}
            icon={<ChevronLeft size={18} />}
            label="Previous"
          />
          
          <View className="flex-row">
            {tourSteps.map((_, index) => (
              <View 
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </View>
          
          <Button
            onPress={goToNextStep}
            variant="outline"
            disabled={currentStepIndex === tourSteps.length - 1}
            icon={<ChevronRight size={18} />}
            label="Next"
            iconPosition="right"
          />
        </View>
      </View>
    </View>
  );
}