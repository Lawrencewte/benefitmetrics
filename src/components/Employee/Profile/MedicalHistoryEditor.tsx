import { AlertCircle, Edit, Plus, Save, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'managed';
  notes?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  notes?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  notes?: string;
}

interface MedicalHistory {
  conditions: MedicalCondition[];
  medications: Medication[];
  allergies: Allergy[];
}

interface MedicalHistoryEditorProps {
  history: MedicalHistory;
  onSave: (history: MedicalHistory) => void;
  isReadOnly?: boolean;
}

export const MedicalHistoryEditor: React.FC<MedicalHistoryEditorProps> = ({
  history,
  onSave,
  isReadOnly = false
}) => {
  const [editedHistory, setEditedHistory] = useState<MedicalHistory>(history);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newCondition, setNewCondition] = useState<Partial<MedicalCondition>>({});
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({});

  const handleSave = () => {
    onSave(editedHistory);
    setEditingSection(null);
  };

  const addCondition = () => {
    if (!newCondition.name) {
      Alert.alert('Error', 'Please enter a condition name');
      return;
    }

    const condition: MedicalCondition = {
      id: Date.now().toString(),
      name: newCondition.name,
      diagnosedDate: newCondition.diagnosedDate || new Date().toISOString().split('T')[0],
      status: newCondition.status || 'active',
      notes: newCondition.notes
    };

    setEditedHistory(prev => ({
      ...prev,
      conditions: [...prev.conditions, condition]
    }));

    setNewCondition({});
  };

  const removeCondition = (id: string) => {
    setEditedHistory(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id)
    }));
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      Alert.alert('Error', 'Please enter medication name and dosage');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency || 'As needed',
      startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
      prescribedBy: newMedication.prescribedBy || 'Unknown',
      endDate: newMedication.endDate,
      notes: newMedication.notes
    };

    setEditedHistory(prev => ({
      ...prev,
      medications: [...prev.medications, medication]
    }));

    setNewMedication({});
  };

  const removeMedication = (id: string) => {
    setEditedHistory(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
  };

  const addAllergy = () => {
    if (!newAllergy.allergen || !newAllergy.reaction) {
      Alert.alert('Error', 'Please enter allergen and reaction');
      return;
    }

    const allergy: Allergy = {
      id: Date.now().toString(),
      allergen: newAllergy.allergen,
      severity: newAllergy.severity || 'mild',
      reaction: newAllergy.reaction,
      notes: newAllergy.notes
    };

    setEditedHistory(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergy]
    }));

    setNewAllergy({});
  };

  const removeAllergy = (id: string) => {
    setEditedHistory(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a.id !== id)
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return '#10B981';
      case 'moderate':
        return '#F59E0B';
      case 'severe':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#EF4444';
      case 'managed':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Medical Conditions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          {!isReadOnly && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingSection(editingSection === 'conditions' ? null : 'conditions')}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>

        {editedHistory.conditions.map((condition) => (
          <View key={condition.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{condition.name}</Text>
              <View style={styles.itemActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(condition.status) }]}>
                  <Text style={styles.statusText}>{condition.status}</Text>
                </View>
                {!isReadOnly && editingSection === 'conditions' && (
                  <TouchableOpacity onPress={() => removeCondition(condition.id)}>
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemDate}>Diagnosed: {condition.diagnosedDate}</Text>
              {condition.notes && <Text style={styles.itemNotes}>{condition.notes}</Text>}
            </View>
          </View>
        ))}

        {!isReadOnly && editingSection === 'conditions' && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Condition</Text>
            <TextInput
              style={styles.input}
              placeholder="Condition name"
              value={newCondition.name || ''}
              onChangeText={(text) => setNewCondition(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Diagnosed date (YYYY-MM-DD)"
              value={newCondition.diagnosedDate || ''}
              onChangeText={(text) => setNewCondition(prev => ({ ...prev, diagnosedDate: text }))}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Status:</Text>
              {['active', 'managed', 'resolved'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerOption,
                    newCondition.status === status && styles.pickerOptionSelected
                  ]}
                  onPress={() => setNewCondition(prev => ({ ...prev, status: status as any }))}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    newCondition.status === status && styles.pickerOptionTextSelected
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (optional)"
              value={newCondition.notes || ''}
              onChangeText={(text) => setNewCondition(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCondition}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Condition</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Medications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          {!isReadOnly && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingSection(editingSection === 'medications' ? null : 'medications')}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>

        {editedHistory.medications.map((medication) => (
          <View key={medication.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.medicationInfo}>
                <Text style={styles.itemName}>{medication.name}</Text>
                <Text style={styles.medicationDosage}>{medication.dosage}</Text>
              </View>
              {!isReadOnly && editingSection === 'medications' && (
                <TouchableOpacity onPress={() => removeMedication(medication.id)}>
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemDate}>Frequency: {medication.frequency}</Text>
              <Text style={styles.itemDate}>Started: {medication.startDate}</Text>
              <Text style={styles.itemDate}>Prescribed by: {medication.prescribedBy}</Text>
              {medication.notes && <Text style={styles.itemNotes}>{medication.notes}</Text>}
            </View>
          </View>
        ))}

        {!isReadOnly && editingSection === 'medications' && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Medication</Text>
            <TextInput
              style={styles.input}
              placeholder="Medication name"
              value={newMedication.name || ''}
              onChangeText={(text) => setNewMedication(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 10mg)"
              value={newMedication.dosage || ''}
              onChangeText={(text) => setNewMedication(prev => ({ ...prev, dosage: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Frequency (e.g., Once daily)"
              value={newMedication.frequency || ''}
              onChangeText={(text) => setNewMedication(prev => ({ ...prev, frequency: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Prescribed by"
              value={newMedication.prescribedBy || ''}
              onChangeText={(text) => setNewMedication(prev => ({ ...prev, prescribedBy: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Start date (YYYY-MM-DD)"
              value={newMedication.startDate || ''}
              onChangeText={(text) => setNewMedication(prev => ({ ...prev, startDate: text }))}
            />
            <TouchableOpacity style={styles.addButton} onPress={addMedication}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Allergies Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          {!isReadOnly && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingSection(editingSection === 'allergies' ? null : 'allergies')}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>

        {editedHistory.allergies.map((allergy) => (
          <View key={allergy.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{allergy.allergen}</Text>
              <View style={styles.itemActions}>
                <View style={[styles.statusBadge, { backgroundColor: getSeverityColor(allergy.severity) }]}>
                  <Text style={styles.statusText}>{allergy.severity}</Text>
                </View>
                {!isReadOnly && editingSection === 'allergies' && (
                  <TouchableOpacity onPress={() => removeAllergy(allergy.id)}>
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemDate}>Reaction: {allergy.reaction}</Text>
              {allergy.notes && <Text style={styles.itemNotes}>{allergy.notes}</Text>}
            </View>
          </View>
        ))}

        {!isReadOnly && editingSection === 'allergies' && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Allergy</Text>
            <TextInput
              style={styles.input}
              placeholder="Allergen (e.g., Peanuts, Penicillin)"
              value={newAllergy.allergen || ''}
              onChangeText={(text) => setNewAllergy(prev => ({ ...prev, allergen: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Reaction (e.g., Hives, Difficulty breathing)"
              value={newAllergy.reaction || ''}
              onChangeText={(text) => setNewAllergy(prev => ({ ...prev, reaction: text }))}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Severity:</Text>
              {['mild', 'moderate', 'severe'].map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={[
                    styles.pickerOption,
                    newAllergy.severity === severity && styles.pickerOptionSelected
                  ]}
                  onPress={() => setNewAllergy(prev => ({ ...prev, severity: severity as any }))}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    newAllergy.severity === severity && styles.pickerOptionTextSelected
                  ]}>
                    {severity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Allergy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!isReadOnly && editingSection && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={16} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <View style={styles.disclaimer}>
        <AlertCircle size={16} color="#F59E0B" />
        <Text style={styles.disclaimerText}>
          This information is for your records only. Always consult with healthcare professionals for medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
  },
  itemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetails: {
    marginTop: 4,
  },
  itemDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 4,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationDosage: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  addForm: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  pickerOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
});