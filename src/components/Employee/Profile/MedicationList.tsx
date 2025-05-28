import { AlertTriangle, Clock, Edit, Pill, Plus, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  indication: string;
  sideEffects?: string[];
  instructions?: string;
  refillsRemaining?: number;
  nextRefillDate?: string;
  isActive: boolean;
  reminderEnabled: boolean;
  reminderTimes: string[];
}

interface MedicationListProps {
  medications: Medication[];
  onAddMedication?: () => void;
  onEditMedication?: (medication: Medication) => void;
  onDeleteMedication?: (medicationId: string) => void;
  onToggleReminder?: (medicationId: string, enabled: boolean) => void;
  isReadOnly?: boolean;
  showReminders?: boolean;
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onAddMedication,
  onEditMedication,
  onDeleteMedication,
  onToggleReminder,
  isReadOnly = false,
  showReminders = true
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');

  const filteredMedications = medications.filter(med => {
    if (filter === 'active') return med.isActive;
    if (filter === 'inactive') return !med.isActive;
    return true;
  });

  const activeMedications = medications.filter(med => med.isActive);
  const inactiveMedications = medications.filter(med => !med.isActive);

  const getFrequencyDisplay = (frequency: string) => {
    const frequencies: Record<string, string> = {
      'once-daily': 'Once daily',
      'twice-daily': 'Twice daily',
      'three-times-daily': 'Three times daily',
      'four-times-daily': 'Four times daily',
      'every-other-day': 'Every other day',
      'weekly': 'Weekly',
      'as-needed': 'As needed',
      'with-meals': 'With meals',
      'before-meals': 'Before meals',
      'after-meals': 'After meals',
      'at-bedtime': 'At bedtime'
    };
    return frequencies[frequency] || frequency;
  };

  const isRefillNeeded = (medication: Medication) => {
    if (!medication.nextRefillDate) return false;
    const refillDate = new Date(medication.nextRefillDate);
    const today = new Date();
    const diffDays = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7; // Refill needed within 7 days
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteMedication = (medication: Medication) => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete ${medication.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteMedication?.(medication.id)
        }
      ]
    );
  };

  const renderMedicationCard = ({ item: medication }: { item: Medication }) => (
    <View style={[styles.medicationCard, !medication.isActive && styles.inactiveMedicationCard]}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationInfo}>
          <Text style={[styles.medicationName, !medication.isActive && styles.inactiveMedicationName]}>
            {medication.name}
          </Text>
          <Text style={styles.medicationDosage}>{medication.dosage}</Text>
        </View>
        
        <View style={styles.medicationActions}>
          {isRefillNeeded(medication) && (
            <View style={styles.refillAlert}>
              <AlertTriangle size={16} color="#F59E0B" />
            </View>
          )}
          
          {!isReadOnly && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEditMedication?.(medication)}
              >
                <Edit size={16} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteMedication(medication)}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.medicationDetails}>
        <View style={styles.detailRow}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            {getFrequencyDisplay(medication.frequency)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <User size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            Prescribed by {medication.prescribedBy}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Pill size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            For {medication.indication}
          </Text>
        </View>
      </View>

      {medication.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>{medication.instructions}</Text>
        </View>
      )}

      {medication.sideEffects && medication.sideEffects.length > 0 && (
        <View style={styles.sideEffectsContainer}>
          <Text style={styles.sideEffectsTitle}>Side Effects:</Text>
          <View style={styles.sideEffectsList}>
            {medication.sideEffects.map((effect, index) => (
              <View key={index} style={styles.sideEffectTag}>
                <Text style={styles.sideEffectText}>{effect}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.medicationFooter}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Started: {formatDate(medication.startDate)}
          </Text>
          {medication.endDate && (
            <Text style={styles.footerText}>
              Until: {formatDate(medication.endDate)}
            </Text>
          )}
          {medication.refillsRemaining !== undefined && (
            <Text style={[
              styles.footerText,
              medication.refillsRemaining === 0 && styles.refillWarning
            ]}>
              {medication.refillsRemaining} refills remaining
            </Text>
          )}
        </View>

        {showReminders && medication.isActive && (
          <TouchableOpacity
            style={[
              styles.reminderButton,
              medication.reminderEnabled && styles.reminderButtonActive
            ]}
            onPress={() => onToggleReminder?.(medication.id, !medication.reminderEnabled)}
          >
            <Text style={[
              styles.reminderButtonText,
              medication.reminderEnabled && styles.reminderButtonTextActive
            ]}>
              {medication.reminderEnabled ? 'Reminders On' : 'Reminders Off'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {medication.reminderEnabled && medication.reminderTimes.length > 0 && (
        <View style={styles.reminderTimesContainer}>
          <Text style={styles.reminderTimesTitle}>Reminder Times:</Text>
          <View style={styles.reminderTimesList}>
            {medication.reminderTimes.map((time, index) => (
              <View key={index} style={styles.reminderTimeTag}>
                <Text style={styles.reminderTimeText}>{time}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {isRefillNeeded(medication) && (
        <View style={styles.refillNotice}>
          <AlertTriangle size={16} color="#F59E0B" />
          <Text style={styles.refillNoticeText}>
            Refill needed by {medication.nextRefillDate && formatDate(medication.nextRefillDate)}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medications</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {activeMedications.length} active, {inactiveMedications.length} inactive
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'active', 'inactive'].map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterButton,
              filter === filterOption && styles.filterButtonActive
            ]}
            onPress={() => setFilter(filterOption as any)}
          >
            <Text style={[
              styles.filterButtonText,
              filter === filterOption && styles.filterButtonTextActive
            ]}>
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredMedications}
        renderItem={renderMedicationCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Pill size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No medications found</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'active' 
                ? 'No active medications to display'
                : filter === 'inactive'
                ? 'No inactive medications to display'
                : 'No medications have been added yet'
              }
            </Text>
          </View>
        }
      />

      {!isReadOnly && onAddMedication && (
        <TouchableOpacity style={styles.addButton} onPress={onAddMedication}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summary: {
    alignItems: 'flex-end',
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inactiveMedicationCard: {
    opacity: 0.7,
    borderColor: '#D1D5DB',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  inactiveMedicationName: {
    color: '#6B7280',
  },
  medicationDosage: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refillAlert: {
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  medicationDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  instructionsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  sideEffectsContainer: {
    marginBottom: 12,
  },
  sideEffectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sideEffectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sideEffectTag: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  sideEffectText: {
    fontSize: 12,
    color: '#991B1B',
  },
  medicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerInfo: {
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  refillWarning: {
    color: '#EF4444',
    fontWeight: '500',
  },
  reminderButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  reminderButtonActive: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  reminderButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  reminderButtonTextActive: {
    color: '#3B82F6',
  },
  reminderTimesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reminderTimesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  reminderTimesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reminderTimeTag: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  reminderTimeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  refillNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  refillNoticeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
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
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});