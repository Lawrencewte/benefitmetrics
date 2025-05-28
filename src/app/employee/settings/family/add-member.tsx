import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../../../../components/Common/ui/Button';
import { useFamilyMembers } from '../../../../hooks/employee/useFamilyMembers';

interface FamilyMemberData {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  healthPlan?: string;
}

export default function AddFamilyMember() {
  const navigation = useNavigation();
  const { addFamilyMember, isLoading } = useFamilyMembers();
  
  const [formData, setFormData] = useState<FamilyMemberData>({
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    gender: '',
    healthPlan: '',
  });

  const relationships = [
    { label: 'Select relationship', value: '' },
    { label: 'Spouse/Partner', value: 'spouse' },
    { label: 'Child', value: 'child' },
    { label: 'Parent', value: 'parent' },
    { label: 'Sibling', value: 'sibling' },
    { label: 'Other', value: 'other' },
  ];

  const genders = [
    { label: 'Select gender', value: '' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'not_specified' },
  ];

  const handleInputChange = (field: keyof FamilyMemberData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!formData.relationship) {
      Alert.alert('Error', 'Please select a relationship');
      return false;
    }
    if (!formData.dateOfBirth.trim()) {
      Alert.alert('Error', 'Date of birth is required');
      return false;
    }
    if (!formData.gender) {
      Alert.alert('Error', 'Please select a gender');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const success = await addFamilyMember(formData);
      if (success) {
        Alert.alert('Success', 'Family member added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add family member. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Add Family Member</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Adding family members helps you manage their preventative health needs 
            and maximize your family benefits.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="Enter first name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="Enter last name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Relationship</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.relationship}
                onValueChange={(value) => handleInputChange('relationship', value)}
                style={styles.picker}
              >
                {relationships.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                style={styles.picker}
              >
                {genders.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Health Plan (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.healthPlan}
              onChangeText={(value) => handleInputChange('healthPlan', value)}
              placeholder="Enter health plan information"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              label={isLoading ? "Adding..." : "Add Family Member"}
              variant="primary"
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.buttonWrapper}>
            <Button 
              label="Cancel" 
              variant="outline"
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#1D4ED8',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    color: '#1F2937',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 32,
  },
  buttonWrapper: {
    width: '100%',
  },
});