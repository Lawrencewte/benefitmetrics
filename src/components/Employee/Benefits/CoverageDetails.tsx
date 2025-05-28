import { Calendar, DollarSign, Shield } from 'lucide-react';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface CoverageDetailsProps {
  coverage: {
    planName: string;
    planType: string;
    coverageLevel: string;
    network: string;
    effectiveDate: string;
    terminationDate?: string;
    deductible?: {
      individual: number;
      family: number;
      remaining: number;
    };
    outOfPocketMax?: {
      individual: number;
      family: number;
      remaining: number;
    };
    preventativeCare: {
      covered: boolean;
      copay: number;
      limitations?: string[];
    };
  };
}

export function CoverageDetails({ coverage }: CoverageDetailsProps) {
  return (
    <ScrollView className="space-y-4">
      {/* Plan Overview */}
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="font-semibold text-lg mb-3">Plan Overview</Text>
        
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Plan Name</Text>
            <Text className="font-medium">{coverage.planName}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Plan Type</Text>
            <Text className="font-medium">{coverage.planType}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Coverage Level</Text>
            <Text className="font-medium">{coverage.coverageLevel}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Network</Text>
            <Text className="font-medium">{coverage.network}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Effective Date</Text>
            <Text className="font-medium">{new Date(coverage.effectiveDate).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Deductible Information */}
      {coverage.deductible && (
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Shield size={20} className="text-blue-600 mr-2" />
            <Text className="font-semibold text-lg">Deductible</Text>
          </View>
          
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Individual</Text>
              <Text className="font-medium">${coverage.deductible.individual}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Family</Text>
              <Text className="font-medium">${coverage.deductible.family}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Remaining</Text>
              <Text className="font-medium text-green-600">${coverage.deductible.remaining}</Text>
            </View>
          </View>
          
          <View className="mt-3 bg-blue-50 p-2 rounded-md">
            <Text className="text-blue-800 text-sm">
              Amount you pay before insurance starts covering costs
            </Text>
          </View>
        </View>
      )}

      {/* Out-of-Pocket Maximum */}
      {coverage.outOfPocketMax && (
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <DollarSign size={20} className="text-green-600 mr-2" />
            <Text className="font-semibold text-lg">Out-of-Pocket Maximum</Text>
          </View>
          
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Individual</Text>
              <Text className="font-medium">${coverage.outOfPocketMax.individual}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Family</Text>
              <Text className="font-medium">${coverage.outOfPocketMax.family}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Remaining</Text>
              <Text className="font-medium text-green-600">${coverage.outOfPocketMax.remaining}</Text>
            </View>
          </View>
          
          <View className="mt-3 bg-green-50 p-2 rounded-md">
            <Text className="text-green-800 text-sm">
              Maximum amount you'll pay in a year for covered services
            </Text>
          </View>
        </View>
      )}

      {/* Preventative Care */}
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <View className="flex-row items-center mb-3">
          <Calendar size={20} className="text-purple-600 mr-2" />
          <Text className="font-semibold text-lg">Preventative Care</Text>
        </View>
        
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Coverage</Text>
            <Text className={`font-medium ${coverage.preventativeCare.covered ? 'text-green-600' : 'text-red-600'}`}>
              {coverage.preventativeCare.covered ? 'Covered' : 'Not Covered'}
            </Text>
          </View>
          
          {coverage.preventativeCare.covered && (
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Copay</Text>
              <Text className="font-medium">
                {coverage.preventativeCare.copay === 0 ? 'No copay' : `${coverage.preventativeCare.copay}`}
              </Text>
            </View>
          )}
          
          {coverage.preventativeCare.limitations && coverage.preventativeCare.limitations.length > 0 && (
            <View>
              <Text className="text-gray-600 mb-2">Limitations:</Text>
              {coverage.preventativeCare.limitations.map((limitation, index) => (
                <Text key={index} className="text-sm text-gray-500 ml-2">
                  • {limitation}
                </Text>
              ))}
            </View>
          )}
        </View>
        
        {coverage.preventativeCare.covered && (
          <View className="mt-3 bg-purple-50 p-3 rounded-md">
            <Text className="text-purple-800 font-medium mb-1">Covered Services Include:</Text>
            <Text className="text-purple-700 text-sm">
              Annual physicals, immunizations, cancer screenings, dental cleanings, 
              vision exams, and other preventative services as recommended by your doctor.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}