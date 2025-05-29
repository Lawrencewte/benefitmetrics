import Footer from '@/src/components/Common/layout/Footer';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import { useProfile } from '../../../hooks/employee/useProfile';

export default function AccountSettings() {
  const { profile, updateProfile, isLoading } = useProfile();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
        },
        emergencyContact: profile.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
          email: '',
        },
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      Alert.alert('Success', 'Your account information has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update account information.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Account Settings" showBackButton />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange('dateOfBirth', value)}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address.street}
              onChangeText={(value) => handleNestedChange('address', 'street', value)}
              placeholder="Enter your street address"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={formData.address.city}
                onChangeText={(value) => handleNestedChange('address', 'city', value)}
                placeholder="City"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.rowItem}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={formData.address.state}
                onChangeText={(value) => handleNestedChange('address', 'state', value)}
                placeholder="State"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.rowItem}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={formData.address.zipCode}
                onChangeText={(value) => handleNestedChange('address', 'zipCode', value)}
                placeholder="ZIP"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContact.name}
              onChangeText={(value) => handleNestedChange('emergencyContact', 'name', value)}
              placeholder="Emergency contact name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContact.relationship}
              onChangeText={(value) => handleNestedChange('emergencyContact', 'relationship', value)}
              placeholder="e.g., Spouse, Parent, Sibling"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContact.phone}
              onChangeText={(value) => handleNestedChange('emergencyContact', 'phone', value)}
              placeholder="Emergency contact phone"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContact.email}
              onChangeText={(value) => handleNestedChange('emergencyContact', 'email', value)}
              placeholder="Emergency contact email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSave}
            label={isLoading ? "Saving..." : "Save Changes"}
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
      <Footer />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra space at bottom for tab navigation
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowItem: {
    flex: 1,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 32,
    marginTop: 8,
  },
});