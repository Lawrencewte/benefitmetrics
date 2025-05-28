import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Award, Calendar, Check, Heart, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const tourSteps = [
  {
    id: 1,
    title: 'Welcome to BenefitMetrics',
    description: 'Your personal health companion that helps you maximize your benefits and stay on top of preventative care.',
    icon: <Heart size={64} color="#3B82F6" />,
    features: [
      'Track your health journey',
      'Optimize your benefits',
      'Get personalized recommendations'
    ]
  },
  {
    id: 2,
    title: 'Health Score System',
    description: 'See your overall health progress with our proprietary scoring system that tracks preventative care across different categories.',
    icon: <Award size={64} color="#10B981" />,
    features: [
      'Real-time health scoring',
      'Category breakdowns',
      'Achievement levels'
    ]
  },
  {
    id: 3,
    title: 'Smart Scheduling',
    description: 'AI-powered appointment coordination that considers your work calendar, benefit deadlines, and provider availability.',
    icon: <Calendar size={64} color="#8B5CF6" />,
    features: [
      'Intelligent scheduling',
      'Calendar integration',
      'Deadline tracking'
    ]
  },
  {
    id: 4,
    title: 'ROI Tracking',
    description: 'Visualize the financial benefits of your preventative healthcare and see how much you\'re saving.',
    icon: <TrendingUp size={64} color="#F59E0B" />,
    features: [
      'Savings calculator',
      'Cost breakdown',
      'Future projections'
    ]
  }
];

export default function AppTour() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/onboarding/employee/initial-actions');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    router.push('/onboarding/employee/initial-actions');
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold">App Tour</Text>
          <Pressable onPress={skipTour}>
            <Text className="text-blue-600 font-medium">Skip</Text>
          </Pressable>
        </View>
        
        {/* Progress Indicator */}
        <View className="flex-row justify-between mt-4">
          {tourSteps.map((_, index) => (
            <View
              key={index}
              className={`flex-1 h-1 rounded-full mx-1 ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
      </View>

      {/* Tour Content */}
      <View className="flex-1 p-6">
        <View className="flex-1 items-center justify-center">
          {/* Icon */}
          <View className="mb-8">
            {currentStepData.icon}
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
            {currentStepData.title}
          </Text>

          {/* Description */}
          <Text className="text-gray-600 text-center text-lg leading-relaxed mb-8 px-4">
            {currentStepData.description}
          </Text>

          {/* Features List */}
          <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-sm">
            <Text className="font-semibold text-gray-900 mb-4 text-center">
              Key Features:
            </Text>
            {currentStepData.features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-3 last:mb-0">
                <Check size={16} color="#10B981" />
                <Text className="text-gray-700 ml-3 flex-1">{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between items-center mt-8">
          <Pressable
            onPress={prevStep}
            disabled={currentStep === 0}
            className={`flex-row items-center px-4 py-2 ${
              currentStep === 0 ? 'opacity-30' : ''
            }`}
          >
            <ArrowLeft size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Previous</Text>
          </Pressable>

          <View className="flex-row">
            {tourSteps.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </View>

          <Pressable
            onPress={nextStep}
            className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg"
          >
            <Text className="text-white font-medium mr-2">
              {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            {currentStep === tourSteps.length - 1 ? (
              <Check size={20} color="white" />
            ) : (
              <ArrowRight size={20} color="white" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}