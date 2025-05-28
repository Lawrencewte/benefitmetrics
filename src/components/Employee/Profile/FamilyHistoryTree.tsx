import { Edit, Plus, Users, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FamilyMember {
  id: string;
  name: string;
  relationship: 'parent' | 'grandparent' | 'sibling' | 'child' | 'other';
  gender: 'male' | 'female' | 'other';
  conditions: string[];
  ageAtDeath?: number;
  causeOfDeath?: string;
  isDeceased: boolean;
  notes?: string;
}

interface FamilyHistoryTreeProps {
  familyMembers: FamilyMember[];
  onUpdateMember: (member: FamilyMember) => void;
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  onRemoveMember: (id: string) => void;
  isReadOnly?: boolean;
}

export const FamilyHistoryTree: React.FC<FamilyHistoryTreeProps> = ({
  familyMembers,
  onUpdateMember,
  onAddMember,
  onRemoveMember,
  isReadOnly = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    relationship: 'parent',
    gender: 'male',
    conditions: [],
    isDeceased: false
  });

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'parent':
        return '👨‍👩‍👦';
      case 'grandparent':
        return '👴👵';
      case 'sibling':
        return '👫';
      case 'child':
        return '👶';
      default:
        return '👤';
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'parent':
        return '#3B82F6';
      case 'grandparent':
        return '#8B5CF6';
      case 'sibling':
        return '#10B981';
      case 'child':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getRiskLevel = (conditions: string[]) => {
    const highRiskConditions = ['heart disease', 'diabetes', 'cancer', 'stroke', 'hypertension'];
    const hasHighRisk = conditions.some(condition =>
      highRiskConditions.some(risk => condition.toLowerCase().includes(risk.toLowerCase()))
    );
    
    if (hasHighRisk) return 'high';
    if (conditions.length > 0) return 'moderate';
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#EF4444';
      case 'moderate':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const groupMembersByRelationship = (members: FamilyMember[]) => {
    return members.reduce((groups, member) => {
      const key = member.relationship;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(member);
      return groups;
    }, {} as Record<string, FamilyMember[]>);
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship) {
      return;
    }

    const member: Omit<FamilyMember, 'id'> = {
      name: newMember.name,
      relationship: newMember.relationship as any,
      gender: newMember.gender as any,
      conditions: newMember.conditions || [],
      isDeceased: newMember.isDeceased || false,
      ageAtDeath: newMember.ageAtDeath,
      causeOfDeath: newMember.causeOfDeath,
      notes: newMember.notes
    };

    onAddMember(member);
    setNewMember({
      relationship: 'parent',
      gender: 'male',
      conditions: [],
      isDeceased: false
    });
    setModalVisible(false);
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      onUpdateMember(editingMember);
      setEditingMember(null);
      setModalVisible(false);
    }
  };

  const addCondition = (condition: string, isEditing: boolean = false) => {
    if (isEditing && editingMember) {
      setEditingMember({
        ...editingMember,
        conditions: [...editingMember.conditions, condition]
      });
    } else {
      setNewMember(prev => ({
        ...prev,
        conditions: [...(prev.conditions || []), condition]
      }));
    }
  };

  const removeCondition = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingMember) {
      const updatedConditions = editingMember.conditions.filter((_, i) => i !== index);
      setEditingMember({
        ...editingMember,
        conditions: updatedConditions
      });
    } else {
      const updatedConditions = (newMember.conditions || []).filter((_, i) => i !== index);
      setNewMember(prev => ({
        ...prev,
        conditions: updatedConditions
      }));
    }
  };

  const groupedMembers = groupMembersByRelationship(familyMembers);
  const relationshipOrder = ['grandparent', 'parent', 'sibling', 'child', 'other'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Health History</Text>
        <Text style={styles.subtitle}>
          Track hereditary health conditions and risk factors
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {relationshipOrder.map(relationship => {
          const members = groupedMembers[relationship] || [];
          if (members.length === 0) return null;

          return (
            <View key={relationship} style={styles.relationshipGroup}>
              <View style={styles.relationshipHeader}>
                <Text style={styles.relationshipTitle}>
                  {getRelationshipIcon(relationship)} {relationship.charAt(0).toUpperCase() + relationship.slice(1)}s
                </Text>
                <Text style={styles.memberCount}>({members.length})</Text>
              </View>

              {members.map(member => {
                const riskLevel = getRiskLevel(member.conditions);
                return (
                  <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberGender}>
                          {member.gender} • {member.isDeceased ? 'Deceased' : 'Living'}
                        </Text>
                      </View>
                      
                      <View style={styles.memberActions}>
                        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(riskLevel) }]}>
                          <Text style={styles.riskText}>{riskLevel} risk</Text>
                        </View>
                        
                        {!isReadOnly && (
                          <TouchableOpacity
                            onPress={() => {
                              setEditingMember(member);
                              setModalVisible(true);
                            }}
                          >
                            <Edit size={16} color="#6B7280" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    {member.conditions.length > 0 && (
                      <View style={styles.conditionsContainer}>
                        <Text style={styles.conditionsTitle}>Health Conditions:</Text>
                        {member.conditions.map((condition, index) => (
                          <View key={index} style={styles.conditionTag}>
                            <Text style={styles.conditionText}>{condition}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {member.isDeceased && (
                      <View style={styles.deceasedInfo}>
                        <Text style={styles.deceasedText}>
                          {member.ageAtDeath && `Age at death: ${member.ageAtDeath}`}
                          {member.causeOfDeath && ` • Cause: ${member.causeOfDeath}`}
                        </Text>
                      </View>
                    )}

                    {member.notes && (
                      <Text style={styles.memberNotes}>{member.notes}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {!isReadOnly && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Family Member</Text>
          </TouchableOpacity>
        )}

        {familyMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Users size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No family history recorded</Text>
            <Text style={styles.emptyStateText}>
              Add family members to track hereditary health conditions
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Member Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setModalVisible(false);
          setEditingMember(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMember ? 'Edit Family Member' : 'Add Family Member'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setEditingMember(null);
              }}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={editingMember ? editingMember.name : newMember.name || ''}
                onChangeText={(text) => {
                  if (editingMember) {
                    setEditingMember({ ...editingMember, name: text });
                  } else {
                    setNewMember(prev => ({ ...prev, name: text }));
                  }
                }}
                placeholder="Enter name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Relationship</Text>
              <View style={styles.optionGrid}>
                {['parent', 'grandparent', 'sibling', 'child', 'other'].map(relationship => (
                  <TouchableOpacity
                    key={relationship}
                    style={[
                      styles.optionButton,
                      (editingMember ? editingMember.relationship : newMember.relationship) === relationship && styles.optionButtonSelected
                    ]}
                    onPress={() => {
                      if (editingMember) {
                        setEditingMember({ ...editingMember, relationship: relationship as any });
                      } else {
                        setNewMember(prev => ({ ...prev, relationship: relationship as any }));
                      }
                    }}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      (editingMember ? editingMember.relationship : newMember.relationship) === relationship && styles.optionButtonTextSelected
                    ]}>
                      {relationship.charAt(0).toUpperCase() + relationship.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender</Text>
              <View style={styles.optionGrid}>
                {['male', 'female', 'other'].map(gender => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.optionButton,
                      (editingMember ? editingMember.gender : newMember.gender) === gender && styles.optionButtonSelected
                    ]}
                    onPress={() => {
                      if (editingMember) {
                        setEditingMember({ ...editingMember, gender: gender as any });
                      } else {
                        setNewMember(prev => ({ ...prev, gender: gender as any }));
                      }
                    }}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      (editingMember ? editingMember.gender : newMember.gender) === gender && styles.optionButtonTextSelected
                    ]}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Health Conditions</Text>
              <View style={styles.conditionsList}>
                {(editingMember ? editingMember.conditions : newMember.conditions || []).map((condition, index) => (
                  <View key={index} style={styles.conditionItem}>
                    <Text style={styles.conditionItemText}>{condition}</Text>
                    <TouchableOpacity onPress={() => removeCondition(index, !!editingMember)}>
                      <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.addConditionContainer}>
                <TextInput
                  style={styles.conditionInput}
                  placeholder="Add health condition"
                  onSubmitEditing={(event) => {
                    const condition = event.nativeEvent.text.trim();
                    if (condition) {
                      addCondition(condition, !!editingMember);
                      event.target.clear();
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    (editingMember ? editingMember.isDeceased : newMember.isDeceased) && styles.checkboxChecked
                  ]}
                  onPress={() => {
                    if (editingMember) {
                      setEditingMember({ ...editingMember, isDeceased: !editingMember.isDeceased });
                    } else {
                      setNewMember(prev => ({ ...prev, isDeceased: !prev.isDeceased }));
                    }
                  }}
                >
                  {(editingMember ? editingMember.isDeceased : newMember.isDeceased) && (
                    <Text style={styles.checkboxCheck}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Deceased</Text>
              </View>
            </View>

            {(editingMember ? editingMember.isDeceased : newMember.isDeceased) && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Age at Death</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editingMember ? editingMember.ageAtDeath?.toString() : newMember.ageAtDeath?.toString() || ''}
                    onChangeText={(text) => {
                      const age = parseInt(text) || undefined;
                      if (editingMember) {
                        setEditingMember({ ...editingMember, ageAtDeath: age });
                      } else {
                        setNewMember(prev => ({ ...prev, ageAtDeath: age }));
                      }
                    }}
                    placeholder="Age"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Cause of Death</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editingMember ? editingMember.causeOfDeath : newMember.causeOfDeath || ''}
                    onChangeText={(text) => {
                      if (editingMember) {
                        setEditingMember({ ...editingMember, causeOfDeath: text });
                      } else {
                        setNewMember(prev => ({ ...prev, causeOfDeath: text }));
                      }
                    }}
                    placeholder="Cause of death"
                  />
                </View>
              </>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={editingMember ? editingMember.notes : newMember.notes || ''}
                onChangeText={(text) => {
                  if (editingMember) {
                    setEditingMember({ ...editingMember, notes: text });
                  } else {
                    setNewMember(prev => ({ ...prev, notes: text }));
                  }
                }}
                placeholder="Additional notes"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            {editingMember && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  onRemoveMember(editingMember.id);
                  setModalVisible(false);
                  setEditingMember(null);
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingMember ? handleUpdateMember : handleAddMember}
            >
              <Text style={styles.saveButtonText}>
                {editingMember ? 'Update' : 'Add'} Member
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.riskLegend}>
        <Text style={styles.legendTitle}>Risk Level Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Low Risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Moderate Risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>High Risk</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  relationshipGroup: {
    marginBottom: 24,
  },
  relationshipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  relationshipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  memberCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  memberGender: {
    fontSize: 14,
    color: '#6B7280',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  conditionsContainer: {
    marginBottom: 12,
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  conditionTag: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  conditionText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '500',
  },
  deceasedInfo: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  deceasedText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  memberNotes: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  conditionsList: {
    marginBottom: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  conditionItemText: {
    fontSize: 14,
    color: '#991B1B',
    flex: 1,
  },
  addConditionContainer: {
    marginTop: 8,
  },
  conditionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  riskLegend: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
});