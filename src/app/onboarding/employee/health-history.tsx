import {
    AlertTriangle,
    ChevronRight,
    Plus,
    ShieldCheck,
    Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Hooks
import { useOnboarding } from '../../../context/OnboardingContext';

// Components
import { Button } from '../../../components/Common/ui/Button';

// Common health conditions
const COMMON_CONDITIONS = [
  'Asthma',
  'Diabetes',
  'High blood pressure',
  'Heart disease',
  'Cancer',
  'Arthritis',
  'Allergies',
  'Depression',
  'Anxiety',
  'Thyroid disorder',
  'COPD',
  'Kidney disease',
  'Liver disease',
  'Migraine',
  'Fibromyalgia',
  'Sleep apnea',
  'Stroke',
  'Osteoporosis'
];

// Common allergies
const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree nuts',
  'Shellfish',
  'Fish',
  'Eggs',
  'Milk',
  'Wheat',
  'Soy',
  'Penicillin',
  'Sulfa drugs',
  'Latex',
  'Bee stings',
  'Pollen',
  'Dust mites',
  'Mold',
  'Pet dander'
];

const HealthHistoryScreen = () => {
  const { onboardingData, updateOnboardingData, moveToNextStep } = useOnboarding();
  
  // Initialize form state from any existing data
  const [formData, setFormData] = useState({
    conditions: onboardingData.healthProfile?.conditions || [],
    allergies: onboardingData.healthProfile?.allergies || [],
    medications: onboardingData.healthProfile?.medications || [],
    familyHistory: onboardingData.healthProfile?.familyHistory || []
  });
  
  // New item inputs
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: ''
  });
  const [newFamilyHistory, setNewFamilyHistory] = useState('');
  
  // Visibility states for common item selectors
  const [showCommonConditions, setShowCommonConditions] = useState(false);
  const [showCommonAllergies, setShowCommonAllergies] = useState(false);
  
  // Skip option
  const [acknowledgedSkip, setAcknowledgedSkip] = useState(false);
  
  // Handle adding a condition
  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };
  
  // Handle adding a common condition
  const handleAddCommonCondition = (condition: string) => {
    if (!formData.conditions.includes(condition)) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, condition]
      }));
    }
  };
  
  // Handle removing a condition
  const handleRemoveCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };
  
  // Handle adding an allergy
  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };
  
  // Handle adding a common allergy
  const handleAddCommonAllergy = (allergy: string) => {
    if (!formData.allergies.includes(allergy)) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy]
      }));
    }
  };
  
  // Handle removing an allergy
  const handleRemoveAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };
  
  // Handle updating a medication field
  const handleMedicationChange = (field: keyof typeof newMedication, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle adding a medication
  const handleAddMedication = () => {
    if (newMedication.name.trim() && newMedication.dosage.trim() && newMedication.frequency.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, { ...newMedication }]
      }));
      setNewMedication({
        name: '',
        dosage: '',
        frequency: ''
      });
    }
  };
  
  // Handle removing a medication
  const handleRemoveMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };
  
  // Handle adding a family history item
  const handleAddFamilyHistory = () => {
    if (newFamilyHistory.trim()) {
      setFormData(prev => ({
        ...prev,
        familyHistory: [...prev.familyHistory, newFamilyHistory.trim()]
      }));
      setNewFamilyHistory('');
    }
  };
  
  // Handle removing a family history item
  const handleRemoveFamilyHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: prev.familyHistory.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Update onboarding data
    updateOnboardingData({
      healthProfile: {
        conditions: formData.conditions,
        allergies: formData.allergies,
        medications: formData.medications,
        familyHistory: formData.familyHistory
      }
    });
    
    // Move to next step
    await moveToNextStep();
  };
  
  // Handle skip with acknowledgment
  const handleSkip = async () => {
    if (acknowledgedSkip) {
      // Move to next step without saving health data
      await moveToNextStep();
    } else {
      // Show confirmation dialog
      Alert.alert(
        'Skip Health History',
        'Your health information helps us personalize preventative care recommendations. You can always add this information later.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Skip Anyway',
            onPress: () => setAcknowledgedSkip(true)
          }
        ]
      );
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Health History</Text>
        <Text style={styles.sectionDescription}>
          This information helps us personalize preventative care recommendations.
          All information is optional but will improve your experience.
        </Text>
        
        <View style={styles.privacyNote}>
          <ShieldCheck size={16} color="#10B981" style={styles.noteIcon} />
          <Text style={styles.noteText}>
            Your health information is encrypted and protected under HIPAA regulations. We only use this information to provide personalized recommendations.
          </Text>
        </View>
        
        {/* Medical Conditions */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Medical Conditions</Text>
          
          {/* List of existing conditions */}
          {formData.conditions.length > 0 && (
            <View style={styles.itemList}>
              {formData.conditions.map((condition, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemText}>{condition}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCondition(index)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Add new condition */}
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newCondition}
              onChangeText={setNewCondition}
              placeholder="Add a medical condition"
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              onSubmitEditing={handleAddCondition}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCondition}
              disabled={!newCondition.trim()}
            >
              <Plus size={20} color={newCondition.trim() ? '#3B82F6' : '#D1D5DB'} />
            </TouchableOpacity>
          </View>
          
          {/* Common conditions */}
          <TouchableOpacity
            style={styles.commonItemsButton}
            onPress={() => setShowCommonConditions(!showCommonConditions)}
          >
            <Text style={styles.commonItemsButtonText}>
              {showCommonConditions ? 'Hide' : 'Show'} common conditions
            </Text>
            <ChevronRight
              size={16}
              color="#6B7280"
              style={{ transform: [{ rotate: showCommonConditions ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          
          {showCommonConditions && (
            <View style={styles.commonItemsContainer}>
              {COMMON_CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.commonItem,
                    formData.conditions.includes(condition) && styles.selectedCommonItem
                  ]}
                  onPress={() => handleAddCommonCondition(condition)}
                  disabled={formData.conditions.includes(condition)}
                >
                  <Text
                    style={[
                      styles.commonItemText,
                      formData.conditions.includes(condition) && styles.selectedCommonItemText
                    ]}
                  >
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* Allergies */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Allergies</Text>
          
          {/* List of existing allergies */}
          {formData.allergies.length > 0 && (
            <View style={styles.itemList}>
              {formData.allergies.map((allergy, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemText}>{allergy}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveAllergy(index)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Add new allergy */}
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newAllergy}
              onChangeText={setNewAllergy}
              placeholder="Add an allergy"
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              onSubmitEditing={handleAddAllergy}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAllergy}
              disabled={!newAllergy.trim()}
            >
              <Plus size={20} color={newAllergy.trim() ? '#3B82F6' : '#D1D5DB'} />
            </TouchableOpacity>
          </View>
          
          {/* Common allergies */}
          <TouchableOpacity
            style={styles.commonItemsButton}
            onPress={() => setShowCommonAllergies(!showCommonAllergies)}
          >
            <Text style={styles.commonItemsButtonText}>
              {showCommonAllergies ? 'Hide' : 'Show'} common allergies
            </Text>
            <ChevronRight
              size={16}
              color="#6B7280"
              style={{ transform: [{ rotate: showCommonAllergies ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          
          {showCommonAllergies && (
            <View style={styles.commonItemsContainer}>
              {COMMON_ALLERGIES.map((allergy) => (
                <TouchableOpacity
                  key={allergy}
                  style={[
                    styles.commonItem,
                    formData.allergies.includes(allergy) && styles.selectedCommonItem
                  ]}
                  onPress={() => handleAddCommonAllergy(allergy)}
                  disabled={formData.allergies.includes(allergy)}
                >
                  <Text
                    style={[
                      styles.commonItemText,
                      formData.allergies.includes(allergy) && styles.selectedCommonItemText
                    ]}
                  >
                    {allergy}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* Medications */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Current Medications</Text>
          
          {/* List of existing medications */}
          {formData.medications.length > 0 && (
            <View style={styles.itemList}>
              {formData.medications.map((medication, index) => (
                <View key={index} style={styles.medicationItem}>
                  <View style={styles.medicationContent}>
                    <Text style={styles.medicationName}>{medication.name}</Text>
                    <Text style={styles.medicationDetails}>
                      {medication.dosage} • {medication.frequency}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveMedication(index)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Add new medication */}
          <View style={styles.addMedicationContainer}>
            <View style={styles.medicationField}>
              <Text style={styles.medicationLabel}>Medication Name</Text>
              <TextInput
                style={styles.medicationInput}
                value={newMedication.name}
                onChangeText={(value) => handleMedicationChange('name', value)}
                placeholder="Medication name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.medicationField}>
              <Text style={styles.medicationLabel}>Dosage</Text>
              <TextInput
                style={styles.medicationInput}
                value={newMedication.dosage}
                onChangeText={(value) => handleMedicationChange('dosage', value)}
                placeholder="e.g., 10mg"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.medicationField}>
              <Text style={styles.medicationLabel}>Frequency</Text>
              <TextInput
                style={styles.medicationInput}
                value={newMedication.frequency}
                onChangeText={(value) => handleMedicationChange('frequency', value)}
                placeholder="e.g., Twice daily"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <TouchableOpacity
              style={[
                styles.addMedicationButton,
                (!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()) && 
                styles.disabledButton
              ]}
              onPress={handleAddMedication}
              disabled={!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addMedicationButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Family Health History */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Family Health History</Text>
          <Text style={styles.formSectionSubtitle}>
            List any significant health conditions that run in your family
          </Text>
          
          {/* List of existing family history items */}
          {formData.familyHistory.length > 0 && (
            <View style={styles.itemList}>
              {formData.familyHistory.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveFamilyHistory(index)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Add new family history item */}
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newFamilyHistory}
              onChangeText={setNewFamilyHistory}
              placeholder="e.g., Heart disease (father)"
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              onSubmitEditing={handleAddFamilyHistory}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddFamilyHistory}
              disabled={!newFamilyHistory.trim()}
            >
              <Plus size={20} color={newFamilyHistory.trim() ? '#3B82F6' : '#D1D5DB'} />
            </TouchableOpacity>
          </View>
        </View>
        
        {acknowledgedSkip && (
          <View style={styles.skipWarning}>
            <AlertTriangle size={16} color="#F59E0B" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              You've chosen to skip entering health information. This will limit our ability to provide personalized preventative care recommendations.
            </Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            style={styles.submitButton}
            testID="continue-button"
          >
            Continue
          </Button>
          
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            testID="skip-button"
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formSectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  itemList: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  removeButton: {
    padding: 6,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addItemInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
    color: '#1F2937',
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  commonItemsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  commonItemsButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  commonItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  commonItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedCommonItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
  },
  commonItemText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectedCommonItemText: {
    color: '#3B82F6',
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  medicationDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  addMedicationContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  medicationField: {
    marginBottom: 12,
  },
  medicationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  medicationInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#1F2937',
  },
  addMedicationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  addMedicationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  skipWarning: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#D97706',
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  submitButton: {
    height: 50,
    marginBottom: 12,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default HealthHistoryScreen;