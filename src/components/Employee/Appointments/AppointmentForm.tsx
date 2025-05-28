import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from '../../Common/ui/Button';

interface AppointmentFormProps {
  onSubmit: (appointmentData: AppointmentData) => void;
  isLoading?: boolean;
}

interface AppointmentData {
  type: string;
  providerName: string;
  facilityName: string;
  preferredDate: string;
  preferredTime: string;
  reasonForVisit: string;
  notes?: string;
}

const appointmentTypes = [
  { label: 'Select appointment type', value: '' },
  { label: 'Annual Physical', value: 'annual_physical' },
  { label: 'Dental Cleaning', value: 'dental_cleaning' },
  { label: 'Eye Exam', value: 'eye_exam' },
  { label: 'Skin Check', value: 'skin_check' },
  { label: 'Specialist Visit', value: 'specialist' },
  { label: 'Follow-up', value: 'follow_up' },
  { label: 'Other', value: 'other' },
];

export function AppointmentForm({ onSubmit, isLoading = false }: AppointmentFormProps) {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    type: '',
    providerName: '',
    facilityName: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: '',
    notes: '',
  });

  const handleChange = (field: keyof AppointmentData, value: string) => {
    setAppointmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(appointmentData);
  };

  const isFormValid = () => {
    return (
      appointmentData.type !== '' &&
      appointmentData.providerName.trim() !== '' &&
      appointmentData.preferredDate.trim() !== '' &&
      appointmentData.reasonForVisit.trim() !== ''
    );
  };

  return (
    <ScrollView className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Appointment Type</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            selectedValue={appointmentData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            {appointmentTypes.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Provider Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={appointmentData.providerName}
          onChangeText={(value) => handleChange('providerName', value)}
          placeholder="Enter provider or doctor name"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Facility/Clinic Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={appointmentData.facilityName}
          onChangeText={(value) => handleChange('facilityName', value)}
          placeholder="Enter facility or clinic name"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Preferred Date</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={appointmentData.preferredDate}
          onChangeText={(value) => handleChange('preferredDate', value)}
          placeholder="MM/DD/YYYY"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Preferred Time</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={appointmentData.preferredTime}
          onChangeText={(value) => handleChange('preferredTime', value)}
          placeholder="HH:MM AM/PM"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Reason for Visit</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={appointmentData.reasonForVisit}
          onChangeText={(value) => handleChange('reasonForVisit', value)}
          placeholder="Brief description of visit reason"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          value={appointmentData.notes}
          onChangeText={(value) => handleChange('notes', value)}
          placeholder="Any additional information or special requests"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <Button
        onPress={handleSubmit}
        label={isLoading ? "Scheduling..." : "Schedule Appointment"}
        variant="primary"
        disabled={!isFormValid() || isLoading}
        loading={isLoading}
      />
    </ScrollView>
  );
}