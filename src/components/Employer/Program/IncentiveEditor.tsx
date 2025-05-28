import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Gift, DollarSign, Calendar, Users, Target, Plus, X, Save } from 'lucide-react-native';

interface Incentive {
  id?: string;
  name: string;
  description: string;
  type: 'completion-bonus' | 'milestone-reward' | 'participation-incentive' | 'performance-bonus';
  rewardType: 'cash' | 'pto' | 'gift-card' | 'insurance-discount' | 'merchandise' | 'points';
  rewardValue: number;
  eligibilityCriteria: {
    requiredActions: string[];
    timeframe: string;
    minimumParticipation: number;
    targetAudience: 'all' | 'departments' | 'roles';
    specificGroups: string[];
  };
  budget: {
    totalAllocated: number;
    maxRedemptions?: number;
  };
  schedule: {
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  };
  isActive: boolean;
  autoApproval: boolean;
  redemptionInstructions: string;
}

interface IncentiveEditorProps {
  incentive?: Incentive;
  onSave: (incentive: Incentive) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const IncentiveEditor: React.FC<IncentiveEditorProps> = ({
  incentive,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Incentive>({
    name: incentive?.name || '',
    description: incentive?.description || '',
    type: incentive?.type || 'completion-bonus',
    rewardType: incentive?.rewardType || 'points',
    rewardValue: incentive?.rewardValue || 0,
    eligibilityCriteria: {
      requiredActions: incentive?.eligibilityCriteria?.requiredActions || [],
      timeframe: incentive?.eligibilityCriteria?.timeframe || '30 days',
      minimumParticipation: incentive?.eligibilityCriteria?.minimumParticipation || 1,
      targetAudience: incentive?.eligibilityCriteria?.targetAudience || 'all',
      specificGroups: incentive?.eligibilityCriteria?.specificGroups || [],
    },
    budget: {
      totalAllocated: incentive?.budget?.totalAllocated || 0,
      maxRedemptions: incentive?.budget?.maxRedemptions,
    },
    schedule: {
      startDate: incentive?.schedule?.startDate || new Date().toISOString().split('T')[0],
      endDate: incentive?.schedule?.endDate || '',
      isRecurring: incentive?.schedule?.isRecurring || false,
      recurringFrequency: incentive?.schedule?.recurringFrequency,
    },
    isActive: incentive?.isActive ?? true,
    autoApproval: incentive?.autoApproval ?? false,
    redemptionInstructions: incentive?.redemptionInstructions || '',
    ...incentive,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAction, setNewAction] = useState('');
  const [newGroup, setNewGroup] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Incentive name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.rewardValue <= 0) newErrors.rewardValue = 'Reward value must be greater than 0';
    if (formData.budget.totalAllocated <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (!formData.schedule.endDate) newErrors.endDate = 'End date is required';
    if (formData.eligibilityCriteria.requiredActions.length === 0) {
      newErrors.requiredActions = 'At least one required action is needed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    } else {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
    }
  };

  const addRequiredAction = () => {
    if (newAction.trim()) {
      setFormData(prev => ({
        ...prev,
        eligibilityCriteria: {
          ...prev.eligibilityCriteria,
          requiredActions: [...prev.eligibilityCriteria.requiredActions, newAction.trim()]
        }
      }));
      setNewAction('');
    }
  };

  const removeRequiredAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        requiredActions: prev.eligibilityCriteria.requiredActions.filter((_, i) => i !== index)
      }
    }));
  };

  const addSpecificGroup = () => {
    if (newGroup.trim()) {
      setFormData(prev => ({
        ...prev,
        eligibilityCriteria: {
          ...prev.eligibilityCriteria,
          specificGroups: [...prev.eligibilityCriteria.specificGroups, newGroup.trim()]
        }
      }));
      setNewGroup('');
    }
  };

  const removeSpecificGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        specificGroups: prev.eligibilityCriteria.specificGroups.filter((_, i) => i !== index)
      }
    }));
  };

  const getRewardLabel = (type: string) => {
    switch (type) {
      case 'cash': return 'Cash Amount ($)';
      case 'pto': return 'PTO Hours';
      case 'gift-card': return 'Gift Card Value ($)';
      case 'insurance-discount': return 'Discount Percentage (%)';
      case 'merchandise': return 'Merchandise Value ($)';
      case 'points': return 'Points';
      default: return 'Value';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {incentive ? 'Edit Incentive' : 'Create New Incentive'}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Save size={16} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incentive Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter incentive name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe what employees need to do to earn this incentive"
              multiline
              numberOfLines={3}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incentive Type</Text>
            <View style={styles.optionsGrid}>
              {[
                { value: 'completion-bonus', label: 'Completion Bonus' },
                { value: 'milestone-reward', label: 'Milestone Reward' },
                { value: 'participation-incentive', label: 'Participation Incentive' },
                { value: 'performance-bonus', label: 'Performance Bonus' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.type === option.value && styles.optionButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, type: option.value as any }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.type === option.value && styles.optionButtonTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Reward Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reward Type</Text>
            <View style={styles.optionsGrid}>
              {[
                { value: 'cash', label: 'Cash', icon: '💵' },
                { value: 'pto', label: 'PTO', icon: '🏖️' },
                { value: 'gift-card', label: 'Gift Card', icon: '🎁' },
                { value: 'insurance-discount', label: 'Insurance Discount', icon: '🛡️' },
                { value: 'merchandise', label: 'Merchandise', icon: '🎯' },
                { value: 'points', label: 'Points', icon: '⭐' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.rewardOption,
                    formData.rewardType === option.value && styles.rewardOptionSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, rewardType: option.value as any }))}
                >
                  <Text style={styles.rewardIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.rewardOptionText,
                    formData.rewardType === option.value && styles.rewardOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{getRewardLabel(formData.rewardType)} *</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#6B7280" />
              <TextInput
                style={[styles.input, errors.rewardValue && styles.inputError]}
                value={formData.rewardValue.toString()}
                onChangeText={(text) => setFormData(prev => ({ ...prev, rewardValue: parseFloat(text) || 0 }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            {errors.rewardValue && <Text style={styles.errorText}>{errors.rewardValue}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Redemption Instructions</Text>
            <TextInput
              style={styles.textArea}
              value={formData.redemptionInstructions}
              onChangeText={(text) => setFormData(prev => ({ ...prev, redemptionInstructions: text }))}
              placeholder="Explain how employees can redeem this reward"
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Eligibility Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Actions *</Text>
            <View style={styles.actionsList}>
              {formData.eligibilityCriteria.requiredActions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <Text style={styles.actionText}>{action}</Text>
                  <TouchableOpacity onPress={() => removeRequiredAction(index)}>
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addActionContainer}>
              <TextInput
                style={styles.addActionInput}
                value={newAction}
                onChangeText={setNewAction}
                placeholder="Add required action"
                onSubmitEditing={addRequiredAction}
              />
              <TouchableOpacity style={styles.addActionButton} onPress={addRequiredAction}>
                <Plus size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {errors.requiredActions && <Text style={styles.errorText}>{errors.requiredActions}</Text>}
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Timeframe</Text>
              <TextInput
                style={styles.input}
                value={formData.eligibilityCriteria.timeframe}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  eligibilityCriteria: { ...prev.eligibilityCriteria, timeframe: text }
                }))}
                placeholder="e.g., 30 days"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Min. Participation</Text>
              <TextInput
                style={styles.input}
                value={formData.eligibilityCriteria.minimumParticipation.toString()}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  eligibilityCriteria: { ...prev.eligibilityCriteria, minimumParticipation: parseInt(text) || 1 }
                }))}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Audience</Text>
            <View style={styles.optionsRow}>
              {[
                { value: 'all', label: 'All Employees' },
                { value: 'departments', label: 'Specific Departments' },
                { value: 'roles', label: 'Specific Roles' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.audienceOption,
                    formData.eligibilityCriteria.targetAudience === option.value && styles.audienceOptionSelected
                  ]}
                  onPress={() => setFormData(prev => ({
                    ...prev,
                    eligibilityCriteria: { ...prev.eligibilityCriteria, targetAudience: option.value as any }
                  }))}
                >
                  <Text style={[
                    styles.audienceOptionText,
                    formData.eligibilityCriteria.targetAudience === option.value && styles.audienceOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {formData.eligibilityCriteria.targetAudience !== 'all' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Specific {formData.eligibilityCriteria.targetAudience === 'departments' ? 'Departments' : 'Roles'}
              </Text>
              <View style={styles.groupsList}>
                {formData.eligibilityCriteria.specificGroups.map((group, index) => (
                  <View key={index} style={styles.groupItem}>
                    <Text style={styles.groupText}>{group}</Text>
                    <TouchableOpacity onPress={() => removeSpecificGroup(index)}>
                      <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.addGroupContainer}>
                <TextInput
                  style={styles.addGroupInput}
                  value={newGroup}
                  onChangeText={setNewGroup}
                  placeholder={`Add ${formData.eligibilityCriteria.targetAudience === 'departments' ? 'department' : 'role'}`}
                  onSubmitEditing={addSpecificGroup}
                />
                <TouchableOpacity style={styles.addGroupButton} onPress={addSpecificGroup}>
                  <Plus size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Budget & Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget & Schedule</Text>
          
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Budget *</Text>
              <View style={styles.inputWithIcon}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.budget && styles.inputError]}
                  value={formData.budget.totalAllocated.toString()}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, totalAllocated: parseFloat(text) || 0 }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Max Redemptions</Text>
              <TextInput
                style={styles.input}
                value={formData.budget.maxRedemptions?.toString() || ''}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  budget: { ...prev.budget, maxRedemptions: parseInt(text) || undefined }
                }))}
                placeholder="Unlimited"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.schedule.startDate}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, startDate: text }
                  }))}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>End Date *</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.endDate && styles.inputError]}
                  value={formData.schedule.endDate}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, endDate: text }
                  }))}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Recurring Incentive</Text>
            <Switch
              value={formData.schedule.isRecurring}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                schedule: { ...prev.schedule, isRecurring: value }
              }))}
            />
          </View>

          {formData.schedule.isRecurring && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recurring Frequency</Text>
              <View style={styles.optionsRow}>
                {[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'annually', label: 'Annually' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyOption,
                      formData.schedule.recurringFrequency === option.value && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, recurringFrequency: option.value as any }
                    }))}
                  >
                    <Text style={[
                      styles.frequencyOptionText,
                      formData.schedule.recurringFrequency === option.value && styles.frequencyOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>