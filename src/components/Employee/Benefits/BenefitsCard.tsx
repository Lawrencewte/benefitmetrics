import { Calendar, ChevronRight, DollarSign, Shield } from 'lucide-react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BenefitsCardProps {
  planName: string;
  planType: string;
  coverageLevel: string;
  premium?: {
    employee: number;
    employer: number;
  };
  deductible?: number;
  preventativeCare: {
    covered: boolean;
    copay: number;
  };
  onPress: () => void;
}

export function BenefitsCard({
  planName,
  planType,
  coverageLevel,
  premium,
  deductible,
  preventativeCare,
  onPress,
}: BenefitsCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 border border-gray-200 mb-4"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-lg">{planName}</Text>
          <Text className="text-gray-600">{planType} • {coverageLevel}</Text>
        </View>
        <ChevronRight size={20} className="text-gray-400" />
      </View>
      
      <View className="space-y-3">
        {premium && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <DollarSign size={16} className="text-green-600 mr-2" />
              <Text className="text-gray-700">Monthly Premium</Text>
            </View>
            <Text className="font-medium">${premium.employee}/month</Text>
          </View>
        )}
        
        {deductible && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Shield size={16} className="text-blue-600 mr-2" />
              <Text className="text-gray-700">Annual Deductible</Text>
            </View>
            <Text className="font-medium">${deductible}</Text>
          </View>
        )}
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Calendar size={16} className="text-purple-600 mr-2" />
            <Text className="text-gray-700">Preventative Care</Text>
          </View>
          <Text className="font-medium">
            {preventativeCare.covered 
              ? preventativeCare.copay === 0 
                ? '100% Covered' 
                : `${preventativeCare.copay} copay`
              : 'Not Covered'
            }
          </Text>
        </View>
      </View>
      
      {preventativeCare.covered && (
        <View className="mt-3 bg-green-50 p-2 rounded-md">
          <Text className="text-green-800 text-sm">
            ✓ Annual physicals, dental cleanings, and screenings are fully covered
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}