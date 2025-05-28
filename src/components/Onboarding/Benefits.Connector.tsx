import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useBenefitsConnection } from '../../hooks/onboarding/useBenefitsConnection';
import { Button } from '../Common/ui/Button';

interface BenefitsConnectorProps {
  onConnected: (benefitsData: any) => void;
}

export function BenefitsConnector({ onConnected }: BenefitsConnectorProps) {
  const [employerId, setEmployerId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  
  const { 
    connectEmployerBenefits, 
    isLoading, 
    error, 
    isConnected, 
    benefitsData 
  } = useBenefitsConnection();
  
  const handleConnect = async () => {
    const success = await connectEmployerBenefits({
      employerId,
      memberId,
      groupNumber
    });
    
    if (success) {
      onConnected(benefitsData);
    }
  };
  
  return (
    <View className="space-y-6">
      <View>
        <Text className="text-lg font-semibold mb-4">Connect Your Benefits</Text>
        <Text className="text-gray-600 mb-4">
          Enter your employer's benefits information to connect your preventative care benefits.
        </Text>
      </View>
      
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Employer ID</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="Enter your employer ID"
            value={employerId}
            onChangeText={setEmployerId}
          />
        </View>
        
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Member ID</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="Enter your insurance member ID"
            value={memberId}
            onChangeText={setMemberId}
          />
        </View>
        
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Group Number (Optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="Enter your group number"
            value={groupNumber}
            onChangeText={setGroupNumber}
          />
        </View>
      </View>
      
      {error && (
        <View className="bg-red-50 p-3 rounded-md">
          <Text className="text-red-600">{error}</Text>
        </View>
      )}
      
      {isConnected ? (
        <View className="bg-green-50 p-3 rounded-md">
          <Text className="text-green-600 font-medium">
            Benefits successfully connected! We've imported your covered preventative services.
          </Text>
        </View>
      ) : (
        <Button
          onPress={handleConnect}
          label={isLoading ? "Connecting..." : "Connect Benefits"}
          variant="primary"
          disabled={isLoading || !employerId || !memberId}
          loading={isLoading}
        />
      )}
      
      <View className="border-t border-gray-200 pt-4">
        <Text className="text-sm text-gray-500 mb-2">
          Can't find your information?
        </Text>
        <Button
          onPress={() => {}}
          label="Skip for Now"
          variant="outline"
        />
      </View>
    </View>
  );
}