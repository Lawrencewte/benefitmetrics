import { useRouter } from 'expo-router';
import { ArrowRight, Award, Calendar, CheckCircle, Clock, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  healthScoreImpact: number;
  estimatedCost: string;
  timeRequired: string;
  deadline?: string;
  selected: boolean;
}

export default function InitialActions() {
  const router = useRouter();
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommendedActions: RecommendedAction[] = [
    {
      id: 'annual-physical',
      title: 'Schedule Annual Physical',
      description: 'Comprehensive health checkup with your primary care physician',
      urgency: 'high',
      healthScoreImpact: 25,
      estimatedCost: 'Free (100% covered)',
      timeRequired: '60-90 minutes',
      deadline: 'December 31, 2025',
      selected: false
    },
    {
      id: 'dental-cleaning',
      title: 'Dental Cleaning & Exam',
      description: 'Routine dental cleaning and oral health assessment',
      urgency: 'medium',
      healthScoreImpact: 15,
      estimatedCost: 'Free (100% covered)',
      timeRequired: '60 minutes',
      deadline: 'Next 6 months',
      selected: false
    },
    {
      id: 'eye-exam',
      title: 'Comprehensive Eye Exam',
      description: 'Complete vision and eye health examination',
      urgency: 'medium',
      healthScoreImpact: 12,
      estimatedCost: 'Free (100% covered)',
      timeRequired: '45-60 minutes',
      deadline: 'December 31, 2025',
      selected: false
    },
    {
      id: 'skin-screening',
      title: 'Skin Cancer Screening',
      description: 'Full-body skin examination by a dermatologist',
      urgency: 'high',
      healthScoreImpact: 20,
      estimatedCost: 'Free (100% covered)',
      timeRequired: '30-45 minutes',
      deadline: 'Recommended annually',
      selected: false
    },
    {
      id: 'flu-shot',
      title: 'Annual Flu Vaccination',
      description: 'Seasonal influenza vaccination',
      urgency: 'high',
      healthScoreImpact: 8,
      estimatedCost: 'Free (100% covered)',
      timeRequired: '15 minutes',
      deadline: 'Before flu season',
      selected: false
    }
  ];

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Simulate API call to save selected actions
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to employee dashboard
    router.replace('/employee');
  };

  const totalHealthScoreImpact = selectedActions.reduce((total, actionId) => {
    const action = recommendedActions.find(a => a.id === actionId);
    return total + (action?.healthScoreImpact || 0);
  }, 0);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Recommended Actions
        </Text>
        <Text className="text-gray-600">
          Select the preventative care appointments you'd like to schedule first
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Impact Summary */}
          {selectedActions.length > 0 && (
            <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <Sparkles size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Your Impact</Text>
              </View>
              <Text className="text-white text-sm mb-2">
                Scheduling {selectedActions.length} appointment{selectedActions.length > 1 ? 's' : ''} will:
              </Text>
              <View className="flex-row items-center">
                <Award size={16} color="white" />
                <Text className="text-white font-bold ml-1">
                  +{totalHealthScoreImpact} Health Score Points
                </Text>
              </View>
            </View>
          )}

          {/* Recommended Actions List */}
          <View className="space-y-4">
            {recommendedActions.map((action) => {
              const isSelected = selectedActions.includes(action.id);
              
              return (
                <Pressable
                  key={action.id}
                  onPress={() => toggleAction(action.id)}
                  className={`bg-white rounded-lg border-2 p-4 ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <Text className="font-semibold text-gray-900 text-lg flex-1">
                          {action.title}
                        </Text>
                        <View className={`px-2 py-1 rounded-full ${getUrgencyColor(action.urgency)}`}>
                          <Text className="text-xs font-medium capitalize">
                            {action.urgency} Priority
                          </Text>
                        </View>
                      </View>
                      
                      <Text className="text-gray-600 mb-3">
                        {action.description}
                      </Text>
                      
                      <View className="space-y-2">
                        <View className="flex-row items-center">
                          <Clock size={14} color="#6B7280" />
                          <Text className="text-sm text-gray-600 ml-2">
                            {action.timeRequired}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <Calendar size={14} color="#6B7280" />
                          <Text className="text-sm text-gray-600 ml-2">
                            Due: {action.deadline}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <Award size={14} color="#10B981" />
                          <Text className="text-sm text-green-600 ml-2 font-medium">
                            +{action.healthScoreImpact} Health Score Points
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className={`w-6 h-6 rounded-full border-2 ml-4 mt-1 flex items-center justify-center ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle size={16} color="white" />}
                    </View>
                  </View>

                  <View className="bg-gray-50 rounded-lg p-3">
                    <Text className="text-sm font-medium text-gray-700">
                      Cost: {action.estimatedCost}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Information Box */}
          <View className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-100">
            <Text className="text-blue-800 font-medium mb-2">
              Good to Know:
            </Text>
            <Text className="text-blue-700 text-sm">
              • All preventative care is 100% covered by your health plan
              • You can schedule more appointments later from your dashboard
              • We'll help coordinate timing to optimize your schedule
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="space-y-3">
          <Pressable
            onPress={handleComplete}
            disabled={isSubmitting}
            className={`bg-blue-600 py-4 rounded-lg flex-row items-center justify-center ${
              isSubmitting ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold mr-2">
              {isSubmitting ? 'Setting up your account...' : 
               selectedActions.length > 0 ? `Schedule ${selectedActions.length} Appointment${selectedActions.length > 1 ? 's' : ''}` :
               'Continue to Dashboard'}
            </Text>
            {!isSubmitting && <ArrowRight size={20} color="white" />}
          </Pressable>

          <Pressable
            onPress={() => router.replace('/employee')}
            disabled={isSubmitting}
            className="border border-gray-300 py-4 rounded-lg"
          >
            <Text className="text-gray-700 font-medium text-center">
              Skip for Now
            </Text>
          </Pressable>
        </View>

        <Text className="text-xs text-gray-500 text-center mt-3">
          You can always schedule appointments later from your dashboard
        </Text>
      </View>
    </View>
  );
}