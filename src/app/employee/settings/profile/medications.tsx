import { router } from 'expo-router';
import { AlertCircle, Pill, Plus, Save, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Footer from '../../../../components/Common/layout/Footer';
import Header from '../../../../components/Common/layout/Header';
import { useProfile } from '../../../../hooks/employee/useProfile';

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason?: string;
  startDate?: string;
  isPrescription: boolean;
};

export default function MedicationsScreen() {
  const { medications, updateMedications } = useProfile();
  
  const [medicationsList, setMedicationsList] = useState<Medication[]>(medications || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isPrescription, setIsPrescription] = useState(false);
  
  const frequencyOptions = [
    'Once daily', 'Twice daily', 'Three times daily', 
    'Four times daily', 'Once weekly', 'As needed', 'Before meals', 'After meals'
  ];
  
  const addMedication = () => {
    if (name && dosage && frequency) {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name,
        dosage,
        frequency,
        reason: reason || undefined,
        startDate: startDate || undefined,
        isPrescription
      };
      
      setMedicationsList([...medicationsList, newMedication]);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setName('');
    setDosage('');
    setFrequency('');
    setReason('');
    setStartDate('');
    setIsPrescription(false);
    setShowAddForm(false);
  };
  
  const removeMedication = (id: string) => {
    setMedicationsList(medicationsList.filter(med => med.id !== id));
  };
  
  const handleSave = () => {
    updateMedications(medicationsList);
    
    Alert.alert(
      'Medications Saved',
      'Your medications information has been updated successfully.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Medications" 
        showBackButton 
        rightComponent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#FFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <AlertCircle size={20} color="#F44336" style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Keeping your medication information up-to-date is important for your safety. This helps identify potential interactions with preventative care services.
          </Text>
        </View>
        
        <View style={styles.addContainer}>
          {!showAddForm ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddForm(true)}
            >
              <Plus size={16} color="#4682B4" />
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Add New Medication</Text>
              
              <Text style={styles.inputLabel}>Medication Name*</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Lisinopril"
              />
              
              <Text style={styles.inputLabel}>Dosage*</Text>
              <TextInput
                style={styles.input}
                value={dosage}
                onChangeText={setDosage}
                placeholder="e.g., 10mg"
              />
              
              <Text style={styles.inputLabel}>Frequency*</Text>
              <View style={styles.optionsGrid}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      frequency === option && styles.selectedOption
                    ]}
                    onPress={() => setFrequency(option)}
                  >
                    <Text style={[
                      styles.optionText,
                      frequency === option && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.input}
                value={frequency}
                onChangeText={setFrequency}
                placeholder="e.g., Once daily or select from above"
              />
              
              <Text style={styles.inputLabel}>Reason for Taking (Optional)</Text>
              <TextInput
                style={styles.input}
                value={reason}
                onChangeText={setReason}
                placeholder="e.g., High blood pressure"
              />
              
              <Text style={styles.inputLabel}>Start Date (Optional)</Text>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="e.g., January 2023"
              />
              
              <View style={styles.prescriptionContainer}>
                <Text style={styles.inputLabel}>Is this a prescription medication?</Text>
                <View style={styles.radioOptions}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setIsPrescription(true)}
                  >
                    <View style={styles.radioCircle}>
                      {isPrescription && <View style={styles.selectedRadioCenter} />}
                    </View>
                    <Text style={styles.radioLabel}>Yes</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setIsPrescription(false)}
                  >
                    <View style={styles.radioCircle}>
                      {!isPrescription && <View style={styles.selectedRadioCenter} />}
                    </View>
                    <Text style={styles.radioLabel}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={resetForm}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.submitButton,
                    (!name || !dosage || !frequency) && styles.disabledButton
                  ]}
                  onPress={addMedication}
                  disabled={!name || !dosage || !frequency}
                >
                  <Text style={styles.submitButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>Current Medications</Text>
        
        {medicationsList.length > 0 ? (
          medicationsList.map((medication) => (
            <View key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <View style={[
                  styles.medicationIconContainer,
                  medication.isPrescription ? styles.prescriptionIcon : styles.supplementIcon
                ]}>
                  <Pill size={18} color="#FFF" />
                </View>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDetails}>
                    {medication.dosage} • {medication.frequency}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeMedication(medication.id)}
                >
                  <X size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
              
              {(medication.reason || medication.startDate) && (
                <View style={styles.medicationDetails}>
                  {medication.reason && (
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Reason: </Text>
                      {medication.reason}
                    </Text>
                  )}
                  {medication.startDate && (
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Started: </Text>
                      {medication.startDate}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Pill size={40} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No medications added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Track your current prescriptions and supplements to help identify potential interactions with preventative care services.
            </Text>
          </View>
        )}
        
        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteText}>
            Your medication information is private and securely stored in accordance with HIPAA requirements. This information helps us provide safe preventative care recommendations.
          </Text>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="profile"
        employee={true}
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
  warningCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  warningIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#D32F2F',
    lineHeight: 20,
  },
  addContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C9DEF0',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginLeft: 8,
  },
  addForm: {
    marginTop: 4,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
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
    marginBottom: 12,
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  optionText: {
    fontSize: 12,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  prescriptionContainer: {
    marginBottom: 16,
  },
  radioOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4682B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4682B4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#C5D5E4',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  medicationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIconContainer: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  prescriptionIcon: {
    backgroundColor: '#4682B4',
  },
  supplementIcon: {
    backgroundColor: '#66BB6A',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  medicationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  removeButton: {
    padding: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#333',
  },
  emptyState: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
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