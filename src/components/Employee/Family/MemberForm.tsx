import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../../Common/ui/Button';

interface MemberFormProps {
  onSubmit: (memberData: FamilyMemberData) => void;
  isLoading?: boolean;
  initialData?: Partial<FamilyMemberData>;
}

interface FamilyMemberData {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  healthPlan: string;
}

const relationships = [
  { label: 'Select relationship', value: '' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Child', value: 'child' },
  { label: 'Parent', value: 'parent' },
  { label: 'Sibling', value: 'sibling' },
  { label: 'Other', value: 'other' },
];

const genders = [
  { label: 'Select gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'not-specified' },
];

export function MemberForm({ 
  onSubmit, 
  isLoading = false,
  initialData = {} 
}: MemberFormProps) {
  const [memberData, setMemberData] = useState<FamilyMemberData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    relationship: initialData.relationship || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || '',
    healthPlan: initialData.healthPlan || '',
  });
  
  const handleChange = (field: keyof FamilyMemberData, value: string) => {
    setMemberData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = () => {
    onSubmit(memberData);
  };
  
  const isFormValid = () => {
    return (
      memberData.firstName.trim() !== '' &&
      memberData.lastName.trim() !== '' &&
      memberData.relationship !== '' &&
      memberData.dateOfBirth.trim() !== '' &&
      memberData.gender !== ''
    );
  };

  return (
    <ScrollView className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={memberData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          placeholder="Enter first name"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={memberData.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          placeholder="Enter last name"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Relationship</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            selectedValue={memberData.relationship}
            onValueChange={(value) => handleChange('relationship', value)}
          >
            {relationships.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Date of Birth</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={memberData.dateOfBirth}
          onChangeText={(value) => handleChange('dateOfBirth', value)}
          placeholder="MM/DD/YYYY"
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Gender</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            selectedValue={memberData.gender}
            onValueChange={(value) => handleChange('gender', value)}
          >
            {genders.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Health Plan (Optional)</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={memberData.healthPlan}
          onChangeText={(value) => handleChange('healthPlan', value)}
          placeholder="Enter health plan information"
        />
      </View>
      
      <Button
        onPress={handleSubmit}
        label={isLoading ? "Saving..." : "Save Family Member"}
        variant="primary"
        disabled={!isFormValid() || isLoading}
        loading={isLoading}
      />
    </ScrollView>
  );
}