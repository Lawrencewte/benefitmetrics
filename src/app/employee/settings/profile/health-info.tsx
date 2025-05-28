import { router } from 'expo-router';
import { Plus, Save, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Footer, { EMPLOYEE_TABS } from '../../../../components/Common/layout/Footer';
import Header from '../../../../components/Common/layout/Header';

export default function HealthInfoScreen() {
  const healthInfo = {
    height: '',
    weight: '',
    bloodType: '',
    conditions: [],
    allergies: [],
    surgeries: [],
    smoker: false,
    alcohol: 'none',
    physicalActivity: 'moderate'
  };
  const updateHealthInfo = (data: any) => {
    console.log('Updating health info:', data);
  };
  
  const [userHeight, setUserHeight] = useState(healthInfo?.height || '');
  const [weight, setWeight] = useState(healthInfo?.weight || '');
  const [bloodType, setBloodType] = useState(healthInfo?.bloodType || '');
  const [conditions, setConditions] = useState(healthInfo?.conditions || []);
  const [allergies, setAllergies] = useState(healthInfo?.allergies || []);
  const [surgeries, setSurgeries] = useState(healthInfo?.surgeries || []);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [smoker, setSmoker] = useState(healthInfo?.smoker || false);
  const [alcohol, setAlcohol] = useState(healthInfo?.alcohol || 'none');
  const [physicalActivity, setPhysicalActivity] = useState(healthInfo?.physicalActivity || 'moderate');
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
    { value: 'light', label: 'Light (1-3 days per week)' },
    { value: 'moderate', label: 'Moderate (3-5 days per week)' },
    { value: 'active', label: 'Active (6-7 days per week)' },
    { value: 'very_active', label: 'Very Active (intense exercise daily)' }
  ];
  
  const alcoholConsumption = [
    { value: 'none', label: 'None' },
    { value: 'occasional', label: 'Occasional (1-2 drinks per month)' },
    { value: 'moderate', label: 'Moderate (1-2 drinks per week)' },
    { value: 'regular', label: 'Regular (3-7 drinks per week)' },
    { value: 'heavy', label: 'Heavy (8+ drinks per week)' }
  ];
  
  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };
  
  const removeCondition = (index: number) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);
  };
  
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };
  
  const removeAllergy = (index: number) => {
    const updatedAllergies = [...allergies];
    updatedAllergies.splice(index, 1);
    setAllergies(updatedAllergies);
  };
  
  const addSurgery = () => {
    if (newSurgery.trim()) {
      setSurgeries([...surgeries, newSurgery.trim()]);
      setNewSurgery('');
    }
  };
  
  const removeSurgery = (index: number) => {
    const updatedSurgeries = [...surgeries];
    updatedSurgeries.splice(index, 1);
    setSurgeries(updatedSurgeries);
  };
  
  const handleSave = () => {
    updateHealthInfo({
      height: userHeight,
      weight,
      bloodType,
      conditions,
      allergies,
      surgeries,
      smoker,
      alcohol,
      physicalActivity,
    });
    
    Alert.alert(
      'Health Information Saved',
      'Your health information has been updated successfully.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  // Handle footer tab navigation
  const handleTabPress = (tabId: string) => {
    switch (tabId) {
      case 'Home':
        router.push('/employee');
        break;
      case 'Appointments':
        router.push('/employee/appointments');
        break;
      case 'Challenges':
        router.push('/employee/challenges');
        break;
      case 'Settings':
        router.push('/employee/settings');
        break;
      case 'More':
        router.push('/employee/more');
        break;
      default:
        break;
    }
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Health Information" 
        showBackButton 
        rightComponent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#FFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                style={styles.input}
                value={userHeight}
                onChangeText={setUserHeight}
                placeholder={'e.g., 5\'10"'}
                keyboardType="default"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g., 160 lbs"
                keyboardType="default"
              />
            </View>
          </View>
          
          <Text style={styles.inputLabel}>Blood Type</Text>
          <View style={styles.optionsGrid}>
            {bloodTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  bloodType === type && styles.selectedOption
                ]}
                onPress={() => setBloodType(type)}
              >
                <Text 
                  style={[
                    styles.optionText,
                    bloodType === type && styles.selectedOptionText
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          
          <View style={styles.listContainer}>
            {conditions.length > 0 ? (
              conditions.map((condition, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{condition}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCondition(index)}
                  >
                    <X size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No medical conditions added</Text>
            )}
          </View>
          
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newCondition}
              onChangeText={setNewCondition}
              placeholder="Add a medical condition"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCondition}
              disabled={!newCondition.trim()}
            >
              <Plus size={20} color="#4682B4" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          
          <View style={styles.listContainer}>
            {allergies.length > 0 ? (
              allergies.map((allergy, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{allergy}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeAllergy(index)}
                  >
                    <X size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No allergies added</Text>
            )}
          </View>
          
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newAllergy}
              onChangeText={setNewAllergy}
              placeholder="Add an allergy"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addAllergy}
              disabled={!newAllergy.trim()}
            >
              <Plus size={20} color="#4682B4" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Surgical History</Text>
          
          <View style={styles.listContainer}>
            {surgeries.length > 0 ? (
              surgeries.map((surgery, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{surgery}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeSurgery(index)}
                  >
                    <X size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No surgeries added</Text>
            )}
          </View>
          
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newSurgery}
              onChangeText={setNewSurgery}
              placeholder="Add a surgery"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addSurgery}
              disabled={!newSurgery.trim()}
            >
              <Plus size={20} color="#4682B4" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Do you smoke?</Text>
            <Switch
              value={smoker}
              onValueChange={setSmoker}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
          
          <Text style={styles.inputLabel}>Alcohol Consumption</Text>
          <View style={styles.optionsContainer}>
            {alcoholConsumption.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioOption,
                  alcohol === option.value && styles.selectedRadio
                ]}
                onPress={() => setAlcohol(option.value)}
              >
                <View style={styles.radioCircle}>
                  {alcohol === option.value && <View style={styles.selectedRadioCenter} />}
                </View>
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.inputLabel}>Physical Activity Level</Text>
          <View style={styles.optionsContainer}>
            {activityLevels.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioOption,
                  physicalActivity === option.value && styles.selectedRadio
                ]}
                onPress={() => setPhysicalActivity(option.value)}
              >
                <View style={styles.radioCircle}>
                  {physicalActivity === option.value && <View style={styles.selectedRadioCenter} />}
                </View>
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteText}>
            Your health information is private and securely stored in accordance with HIPAA requirements. This information helps us provide personalized preventative care recommendations.
          </Text>
        </View>
      </ScrollView>
      
      {/* Fixed Footer with proper props */}
      <Footer 
        tabs={EMPLOYEE_TABS}
        activeTab="profile"
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#4682B4',
    padding: 8,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    fontSize: 14,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listItemText: {
    fontSize: 14,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedRadio: {
    opacity: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4682B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4682B4',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  privacyNote: {
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  privacyNoteText: {
    fontSize: 12,
    color: '#4682B4',
    lineHeight: 18,
  },
});