import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Button } from '../Common/ui/Button';

interface MedicalHistoryFormProps {
  onSubmit: (historyData: MedicalHistoryData) => void;
  isLoading?: boolean;
}

interface Condition {
  name: string;
  hasCondition: boolean;
  diagnosisYear?: string;
  details?: string;
}

interface MedicalHistoryData {
  conditions: Condition[];
  medications: string[];
  allergies: string[];
  previousSurgeries: string[];
  familyHistory: string;
}

const commonConditions = [
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Heart Disease',
  'Cancer',
  'Stroke',
  'Arthritis',
  'Depression/Anxiety',
  'Thyroid Disorder',
];

export function MedicalHistoryForm({ onSubmit, isLoading = false }: MedicalHistoryFormProps) {
  const [historyData, setHistoryData] = useState<MedicalHistoryData>({
    conditions: commonConditions.map(name => ({ name, hasCondition: false })),
    medications: [],
    allergies: [],
    previousSurgeries: [],
    familyHistory: '',
  });
  
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  
  const toggleCondition = (index: number, value: boolean) => {
    const updatedConditions = [...historyData.conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      hasCondition: value,
    };
    setHistoryData({
      ...historyData,
      conditions: updatedConditions,
    });
  };
  
  const updateConditionDetails = (index: number, details: string) => {
    const updatedConditions = [...historyData.conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      details,
    };
    setHistoryData({
      ...historyData,
      conditions: updatedConditions,
    });
  };
  
  const addMedication = () => {
    if (newMedication.trim()) {
      setHistoryData({
        ...historyData,
        medications: [...historyData.medications, newMedication.trim()],
      });
      setNewMedication('');
    }
  };
  
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setHistoryData({
        ...historyData,
        allergies: [...historyData.allergies, newAllergy.trim()],
      });
      setNewAllergy('');
    }
  };
  
  const addSurgery = () => {
    if (newSurgery.trim()) {
      setHistoryData({
        ...historyData,
        previousSurgeries: [...historyData.previousSurgeries, newSurgery.trim()],
      });
      setNewSurgery('');
    }
  };
  
  const handleSubmit = () => {
    onSubmit(historyData);
  };
  
  return (
    <ScrollView className="space-y-6">
      <View>
        <Text className="text-lg font-semibold mb-4">Medical Conditions</Text>
        <View className="space-y-3">
          {historyData.conditions.map((condition, index) => (
            <View key={index} className="border border-gray-200 rounded-md p-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium">{condition.name}</Text>
                <Switch
                  value={condition.hasCondition}
                  onValueChange={(value) => toggleCondition(index, value)}
                />
              </View>
              {condition.hasCondition && (
                <TextInput
                  className="border border-gray-300 rounded-md mt-2 p-2"
                  placeholder="Add details (year diagnosed, severity, etc.)"
                  value={condition.details}
                  onChangeText={(text) => updateConditionDetails(index, text)}
                />
              )}
            </View>
          ))}
        </View>
      </View>
      
      <View>
        <Text className="text-lg font-semibold mb-4">Current Medications</Text>
        <View className="flex-row mb-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-l-md p-2"
            placeholder="Add medication"
            value={newMedication}
            onChangeText={setNewMedication}
          />
          <Button
            onPress={addMedication}
            label="Add"
            variant="secondary"
            className="rounded-l-none"
          />
        </View>
        {historyData.medications.length > 0 ? (
          <View className="space-y-2">
            {historyData.medications.map((med, index) => (
              <View key={index} className="bg-gray-100 p-2 rounded-md">
                <Text>{med}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">No medications added</Text>
        )}
      </View>
      
      <View>
        <Text className="text-lg font-semibold mb-4">Allergies</Text>
        <View className="flex-row mb-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-l-md p-2"
            placeholder="Add allergy"
            value={newAllergy}
            onChangeText={setNewAllergy}
          />
          <Button
            onPress={addAllergy}
            label="Add"
            variant="secondary"
            className="rounded-l-none"
          />
        </View>
        {historyData.allergies.length > 0 ? (
          <View className="space-y-2">
            {historyData.allergies.map((allergy, index) => (
              <View key={index} className="bg-gray-100 p-2 rounded-md">
                <Text>{allergy}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">No allergies added</Text>
        )}
      </View>
      
      <View>
        <Text className="text-lg font-semibold mb-4">Previous Surgeries</Text>
        <View className="flex-row mb-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-l-md p-2"
            placeholder="Add surgery"
            value={newSurgery}
            onChangeText={setNewSurgery}
          />
          <Button
            onPress={addSurgery}
            label="Add"
            variant="secondary"
            className="rounded-l-none"
          />
        </View>
        {historyData.previousSurgeries.length > 0 ? (
          <View className="space-y-2">
            {historyData.previousSurgeries.map((surgery, index) => (
              <View key={index} className="bg-gray-100 p-2 rounded-md">
                <Text>{surgery}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">No surgeries added</Text>
        )}
      </View>
      
      <View>
        <Text className="text-lg font-semibold mb-4">Family Health History</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2"
          placeholder="Describe any significant health conditions in your immediate family"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={historyData.familyHistory}
          onChangeText={(text) => setHistoryData({...historyData, familyHistory: text})}
        />
      </View>
      
      <Button
        onPress={handleSubmit}
        label="Save Medical History"
        variant="primary"
        loading={isLoading}
      />
    </ScrollView>
  );
}