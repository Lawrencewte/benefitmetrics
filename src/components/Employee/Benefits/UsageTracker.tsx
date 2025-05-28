import { CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface BenefitUsage {
  id: string;
  serviceName: string;
  serviceDate: string;
  providerName: string;
  coveredAmount: number;
  patientResponsibility: number;
  status: 'pending' | 'processed' | 'paid' | 'denied';
  serviceCategory: string;
  preventativeCare: boolean;
}

interface UsageTrackerProps {
  usage: BenefitUsage[];
  yearToDateSpending: {
    total: number;
    deductibleMet: number;
    outOfPocketMet: number;
  };
}

export function UsageTracker({ usage, yearToDateSpending }: UsageTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'processed':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'denied':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const preventativeCareUsage = usage.filter(item => item.preventativeCare);
  const totalSavings = usage.reduce((sum, item) => sum + item.coveredAmount, 0);

  return (
    <ScrollView className="space-y-4">
      {/* Year-to-Date Summary */}
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="font-semibold text-lg mb-4">Year-to-Date Summary</Text>
        
        <View className="grid grid-cols-3 gap-3">
          <View className="items-center">
            <DollarSign size={20} className="text-blue-600 mb-1" />
            <Text className="text-2xl font-bold">${yearToDateSpending.total}</Text>
            <Text className="text-xs text-gray-600">Total Spending</Text>
          </View>
          
          <View className="items-center">
            <TrendingUp size={20} className="text-green-600 mb-1" />
            <Text className="text-2xl font-bold">${totalSavings}</Text>
            <Text className="text-xs text-gray-600">Insurance Covered</Text>
          </View>
          
          <View className="items-center">
            <CheckCircle size={20} className="text-purple-600 mb-1" />
            <Text className="text-2xl font-bold">{preventativeCareUsage.length}</Text>
            <Text className="text-xs text-gray-600">Preventative Visits</Text>
          </View>
        </View>
      </View>

      {/* Deductible Progress */}
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="font-semibold text-lg mb-3">Deductible Progress</Text>
        
        <View className="mb-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Deductible Met</Text>
            <Text className="font-medium">${yearToDateSpending.deductibleMet} / $2,000</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${(yearToDateSpending.deductibleMet / 2000) * 100}%` }}
            />
          </View>
        </View>
        
        <View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Out-of-Pocket Met</Text>
            <Text className="font-medium">${yearToDateSpending.outOfPocketMet} / $8,000</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${(yearToDateSpending.outOfPocketMet / 8000) * 100}%` }}
            />
          </View>
        </View>
      </View>

      {/* Recent Usage */}
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="font-semibold text-lg mb-4">Recent Claims</Text>
        
        {usage.length > 0 ? (
          <View className="space-y-3">
            {usage.slice(0, 10).map(item => (
              <View key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="font-medium">{item.serviceName}</Text>
                  <Text className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
                
                <View className="flex-row justify-between text-sm text-gray-600 mb-1">
                  <Text>{item.providerName}</Text>
                  <Text>{new Date(item.serviceDate).toLocaleDateString()}</Text>
                </View>
                
                <View className="flex-row justify-between text-sm">
                  <Text>Insurance Covered: <Text className="text-green-600 font-medium">${item.coveredAmount}</Text></Text>
                  <Text>Your Cost: <Text className="font-medium">${item.patientResponsibility}</Text></Text>
                </View>
                
                {item.preventativeCare && (
                  <View className="mt-1">
                    <Text className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                      Preventative Care
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500 text-center py-4">
            No claims found for this year.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}