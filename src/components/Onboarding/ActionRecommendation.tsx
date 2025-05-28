import { AlertTriangle, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionRecommendationProps {
  title: string;
  description: string;
  impact: string;
  urgency: 'high' | 'medium' | 'low';
  onAction?: () => void;
}

export function ActionRecommendation({
  title,
  description,
  impact,
  urgency,
  onAction,
}: ActionRecommendationProps) {
  const getUrgencyColor = () => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getUrgencyIcon = () => {
    switch (urgency) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'medium':
        return <Clock size={16} className="text-orange-600" />;
      case 'low':
        return <Calendar size={16} className="text-blue-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
    }
  };

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-medium">{title}</Text>
        <View className={`px-2 py-1 rounded-full flex-row items-center ${getUrgencyColor()}`}>
          {getUrgencyIcon()}
          <Text className={`ml-1 text-xs font-medium ${getUrgencyColor()}`}>
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority
          </Text>
        </View>
      </View>
      
      <Text className="text-gray-600 mb-3">{description}</Text>
      
      <View className="mb-4 bg-blue-50 p-2 rounded">
        <Text className="text-blue-700 text-sm">{impact}</Text>
      </View>
      
      <TouchableOpacity
        onPress={onAction}
        className="bg-blue-600 py-2 px-3 rounded-md flex-row items-center justify-center"
      >
        <Calendar size={18} color="white" />
        <Text className="text-white font-medium ml-2">Schedule Now</Text>
        <ArrowUpRight size={18} color="white" className="ml-1" />
      </TouchableOpacity>
    </View>
  );
}