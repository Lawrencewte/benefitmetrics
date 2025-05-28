import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from '../Common/ui/Button';

interface ProfileFormProps {
  onSubmit: (profileData: ProfileData) => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

export function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
  });
  
  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = () => {
    onSubmit(profileData);
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={profileData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          placeholder="Enter your first name"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={profileData.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          placeholder="Enter your last name"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Date of Birth</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={profileData.dateOfBirth}
          onChangeText={(value) => handleChange('dateOfBirth', value)}
          placeholder="MM/DD/YYYY"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Gender</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={profileData.gender}
          onChangeText={(value) => handleChange('gender', value)}
          placeholder="Select your gender"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={profileData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          placeholder="Enter your email"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Phone Number</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={profileData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
        />
      </View>
      
      <Button onPress={handleSubmit} label="Save Profile" variant="primary" />
    </View>
  );
}