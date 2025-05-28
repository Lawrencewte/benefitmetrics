import { Picker } from '@react-native-picker/picker';
import { Megaphone, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';


interface AnnouncementForm {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  audience: 'all' | 'department' | 'location';
  selectedDepartments: string[];
  selectedLocations: string[];
  scheduleDate?: string;
  expiresAt?: string;
  requireAcknowledgment: boolean;
}

export default function CreateAnnouncement() {
  const [formData, setFormData] = useState<AnnouncementForm>({
    title: '',
    content: '',
    priority: 'medium',
    audience: 'all',
    selectedDepartments: [],
    selectedLocations: [],
    requireAcknowledgment: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    'Engineering',
    'Marketing', 
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
  ];

  const locations = [
    'New York Office',
    'San Francisco Office', 
    'Austin Office',
    'Remote Workers',
  ];

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Announcement has been published successfully!',
        [{ text: 'OK', onPress: handleGoBack }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to publish announcement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    console.log('Going back to previous screen');
    // navigation.goBack() would be used here
  };

  const toggleDepartment = (dept: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(dept)
        ? prev.selectedDepartments.filter(d => d !== dept)
        : [...prev.selectedDepartments, dept]
    }));
  };

  const toggleLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(location)
        ? prev.selectedLocations.filter(l => l !== location)
        : [...prev.selectedLocations, location]
    }));
  };

  const estimatedReach = () => {
    switch (formData.audience) {
      case 'all':
        return 412;
      case 'department':
        return formData.selectedDepartments.length * 68; // avg dept size
      case 'location':
        return formData.selectedLocations.length * 103; // avg location size
      default:
        return 0;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      <Header 
          title="Announcements" 
          showBackButton/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <Megaphone size={28} color="#2563eb" />
            <Text style={styles.headerTitle}>Create Announcement</Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter announcement title"
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Content *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Write your announcement content..."
                value={formData.content}
                onChangeText={(text) => setFormData({...formData, content: text})}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.priority}
                  onValueChange={(value) => setFormData({...formData, priority: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Low Priority" value="low" color={getPriorityColor('low')} />
                  <Picker.Item label="Medium Priority" value="medium" color={getPriorityColor('medium')} />
                  <Picker.Item label="High Priority" value="high" color={getPriorityColor('high')} />
                  <Picker.Item label="Urgent" value="urgent" color={getPriorityColor('urgent')} />
                </Picker>
              </View>
            </View>
          </View>

          {/* Audience Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audience</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Send to</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.audience}
                  onValueChange={(value) => setFormData({...formData, audience: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="All Employees" value="all" />
                  <Picker.Item label="Specific Departments" value="department" />
                  <Picker.Item label="Specific Locations" value="location" />
                </Picker>
              </View>
            </View>

            {formData.audience === 'department' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Departments</Text>
                <View style={styles.checkboxContainer}>
                  {departments.map(dept => (
                    <TouchableOpacity 
                      key={dept} 
                      style={styles.checkboxRow}
                      onPress={() => toggleDepartment(dept)}
                    >
                      <View style={[
                        styles.checkbox,
                        formData.selectedDepartments.includes(dept) && styles.checkboxChecked
                      ]}>
                        {formData.selectedDepartments.includes(dept) && (
                          <Text style={styles.checkboxCheck}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{dept}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {formData.audience === 'location' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Locations</Text>
                <View style={styles.checkboxContainer}>
                  {locations.map(location => (
                    <TouchableOpacity 
                      key={location} 
                      style={styles.checkboxRow}
                      onPress={() => toggleLocation(location)}
                    >
                      <View style={[
                        styles.checkbox,
                        formData.selectedLocations.includes(location) && styles.checkboxChecked
                      ]}>
                        {formData.selectedLocations.includes(location) && (
                          <Text style={styles.checkboxCheck}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{location}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.reachContainer}>
              <Users size={20} color="#2563eb" />
              <Text style={styles.reachText}>
                Estimated reach: {estimatedReach()} employees
              </Text>
            </View>
          </View>

          {/* Advanced Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Options</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Schedule for later (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Select date and time"
                value={formData.scheduleDate}
                onChangeText={(text) => setFormData({...formData, scheduleDate: text})}
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Expires on (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Select expiration date"
                value={formData.expiresAt}
                onChangeText={(text) => setFormData({...formData, expiresAt: text})}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.inputLabel}>Require acknowledgment</Text>
              <Switch
                value={formData.requireAcknowledgment}
                onValueChange={(value) => setFormData({...formData, requireAcknowledgment: value})}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={formData.requireAcknowledgment ? '#2563eb' : '#f3f4f6'}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSubmit}
              title={isLoading ? "Publishing..." : "Publish Announcement"}
              variant="primary"
              disabled={isLoading}
              style={styles.primaryButton}
            />
            
            <Button
              onPress={handleGoBack}
              title="Cancel"
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <EmployerFooter />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxCheck: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  reachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 6,
    gap: 8,
    marginTop: 8,
  },
  reachText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});