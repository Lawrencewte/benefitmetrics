import { Check } from 'lucide-react';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../Common/ui/Button';

interface CompletionCelebrationProps {
  onFinish: () => void;
}

export function CompletionCelebration({ onFinish }: CompletionCelebrationProps) {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <View className="items-center">
        <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
          <Check size={48} className="text-green-600" />
        </View>
        
        <Text className="text-2xl font-bold mb-2 text-center">You're All Set!</Text>
        <Text className="text-gray-600 text-center mb-8">
          Your onboarding is complete and your preventative care journey has begun.
        </Text>
        
        <View className="bg-blue-50 rounded-lg p-4 w-full mb-8">
          <Text className="text-blue-800 font-medium mb-2">What's Next:</Text>
          <View className="space-y-2">
            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-blue-200 items-center justify-center mr-2">
                <Text className="text-blue-800 font-medium">1</Text>
              </View>
              <Text className="text-blue-800 flex-1">Schedule your recommended preventative care appointments</Text>
            </View>
            
            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-blue-200 items-center justify-center mr-2">
                <Text className="text-blue-800 font-medium">2</Text>
              </View>
              <Text className="text-blue-800 flex-1">Track your Health Score as you complete appointments</Text>
            </View>
            
            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-blue-200 items-center justify-center mr-2">
                <Text className="text-blue-800 font-medium">3</Text>
              </View>
              <Text className="text-blue-800 flex-1">Watch your ROI grow with each completed preventative service</Text>
            </View>
          </View>
        </View>
        
        <Button
          onPress={onFinish}
          label="Go to Dashboard"
          variant="primary"
          className="w-full"
        />
      </View>
    </View>
  );
}