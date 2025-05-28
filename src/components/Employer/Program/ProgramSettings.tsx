import { Bell, Calendar, RefreshCw, Save, Settings, Shield, Target, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProgramSettings {
  general: {
    programName: string;
    description: string;
    isActive: boolean;
    autoEnrollment: boolean;
    participationRequired: boolean;
  };
  notifications: {
    emailReminders: boolean;
    pushNotifications: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
    escalationEnabled: boolean;
    managerNotifications: boolean;
  };
  participation: {
    eligibleDepartments: string[];
    eligibleRoles: string[];
    minimumTenure: number; // months
    excludeTerminated: boolean;
    allowOptOut: boolean;
  };
  rewards: {
    pointsEnabled: boolean;
    pointsPerAction: number;
    bonusMultipliers: boolean;
    teamRewards: boolean;
    recognitionBadges: boolean;
  };
  privacy: {
    anonymousReporting: boolean;
    dataRetentionPeriod: number; // months
    shareWithManagers: boolean;
    thirdPartySharing: boolean;
  };
  automation: {
    autoApproveRewards: boolean;
    autoScheduleReminders: boolean;
    autoGenerateReports: boolean;
    integrationEnabled: boolean;
  };
}

interface ProgramSettingsProps {
  settings: ProgramSettings;
  onSave: (settings: ProgramSettings) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export const ProgramSettings: React.FC<ProgramSettingsProps> = ({
  settings,
  onSave,
  onReset,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProgramSettings>(settings);
  const [activeSection, setActiveSection] = useState<string>('general');

  const updateSettings = (section: keyof ProgramSettings, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleReset = () => {
    setFormData(settings);
    onReset?.();
  };

  const renderGeneralSettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Program Name</Text>
        <TextInput
          style={styles.input}
          value={formData.general.programName}
          onChangeText={(text) => updateSettings('general', 'programName', text)}
          placeholder="Enter program name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={formData.general.description}
          onChangeText={(text) => updateSettings('general', 'description', text)}
          placeholder="Describe your wellness program"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Program Active</Text>
          <Text style={styles.switchDescription}>Enable the wellness program for employees</Text>
        </View>
        <Switch
          value={formData.general.isActive}
          onValueChange={(value) => updateSettings('general', 'isActive', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Auto-Enrollment</Text>
          <Text style={styles.switchDescription}>Automatically enroll eligible employees</Text>
        </View>
        <Switch
          value={formData.general.autoEnrollment}
          onValueChange={(value) => updateSettings('general', 'autoEnrollment', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Participation Required</Text>
          <Text style={styles.switchDescription}>Make participation mandatory for employees</Text>
        </View>
        <Switch
          value={formData.general.participationRequired}
          onValueChange={(value) => updateSettings('general', 'participationRequired', value)}
        />
      </View>
    </View>
  );

  const renderNotificationSettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Email Reminders</Text>
          <Text style={styles.switchDescription}>Send email notifications to employees</Text>
        </View>
        <Switch
          value={formData.notifications.emailReminders}
          onValueChange={(value) => updateSettings('notifications', 'emailReminders', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Push Notifications</Text>
          <Text style={styles.switchDescription}>Send mobile app notifications</Text>
        </View>
        <Switch
          value={formData.notifications.pushNotifications}
          onValueChange={(value) => updateSettings('notifications', 'pushNotifications', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reminder Frequency</Text>
        <View style={styles.optionsRow}>
          {['daily', 'weekly', 'monthly'].map((frequency) => (
            <TouchableOpacity
              key={frequency}
              style={[
                styles.optionButton,
                formData.notifications.reminderFrequency === frequency && styles.optionButtonSelected
              ]}
              onPress={() => updateSettings('notifications', 'reminderFrequency', frequency)}
            >
              <Text style={[
                styles.optionButtonText,
                formData.notifications.reminderFrequency === frequency && styles.optionButtonTextSelected
              ]}>
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Escalation Enabled</Text>
          <Text style={styles.switchDescription}>Send escalated reminders for overdue items</Text>
        </View>
        <Switch
          value={formData.notifications.escalationEnabled}
          onValueChange={(value) => updateSettings('notifications', 'escalationEnabled', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Manager Notifications</Text>
          <Text style={styles.switchDescription}>Notify managers of team progress</Text>
        </View>
        <Switch
          value={formData.notifications.managerNotifications}
          onValueChange={(value) => updateSettings('notifications', 'managerNotifications', value)}
        />
      </View>
    </View>
  );

  const renderParticipationSettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Minimum Tenure (months)</Text>
        <TextInput
          style={styles.input}
          value={formData.participation.minimumTenure.toString()}
          onChangeText={(text) => updateSettings('participation', 'minimumTenure', parseInt(text) || 0)}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Exclude Terminated</Text>
          <Text style={styles.switchDescription}>Automatically exclude terminated employees</Text>
        </View>
        <Switch
          value={formData.participation.excludeTerminated}
          onValueChange={(value) => updateSettings('participation', 'excludeTerminated', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Allow Opt-Out</Text>
          <Text style={styles.switchDescription}>Allow employees to opt out of the program</Text>
        </View>
        <Switch
          value={formData.participation.allowOptOut}
          onValueChange={(value) => updateSettings('participation', 'allowOptOut', value)}
        />
      </View>
    </View>
  );

  const renderRewardsSettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Points System</Text>
          <Text style={styles.switchDescription}>Enable points for completed actions</Text>
        </View>
        <Switch
          value={formData.rewards.pointsEnabled}
          onValueChange={(value) => updateSettings('rewards', 'pointsEnabled', value)}
        />
      </View>

      {formData.rewards.pointsEnabled && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Points Per Action</Text>
          <TextInput
            style={styles.input}
            value={formData.rewards.pointsPerAction.toString()}
            onChangeText={(text) => updateSettings('rewards', 'pointsPerAction', parseInt(text) || 0)}
            placeholder="10"
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Bonus Multipliers</Text>
          <Text style={styles.switchDescription}>Enable bonus point multipliers for streaks</Text>
        </View>
        <Switch
          value={formData.rewards.bonusMultipliers}
          onValueChange={(value) => updateSettings('rewards', 'bonusMultipliers', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Team Rewards</Text>
          <Text style={styles.switchDescription}>Enable team-based rewards and challenges</Text>
        </View>
        <Switch
          value={formData.rewards.teamRewards}
          onValueChange={(value) => updateSettings('rewards', 'teamRewards', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Recognition Badges</Text>
          <Text style={styles.switchDescription}>Award badges for achievements</Text>
        </View>
        <Switch
          value={formData.rewards.recognitionBadges}
          onValueChange={(value) => updateSettings('rewards', 'recognitionBadges', value)}
        />
      </View>
    </View>
  );

  const renderPrivacySettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Anonymous Reporting</Text>
          <Text style={styles.switchDescription}>Use anonymized data in reports</Text>
        </View>
        <Switch
          value={formData.privacy.anonymousReporting}
          onValueChange={(value) => updateSettings('privacy', 'anonymousReporting', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data Retention (months)</Text>
        <TextInput
          style={styles.input}
          value={formData.privacy.dataRetentionPeriod.toString()}
          onChangeText={(text) => updateSettings('privacy', 'dataRetentionPeriod', parseInt(text) || 12)}
          placeholder="12"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Share with Managers</Text>
          <Text style={styles.switchDescription}>Allow managers to view team member data</Text>
        </View>
        <Switch
          value={formData.privacy.shareWithManagers}
          onValueChange={(value) => updateSettings('privacy', 'shareWithManagers', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Third-Party Sharing</Text>
          <Text style={styles.switchDescription}>Share anonymized data with partners</Text>
        </View>
        <Switch
          value={formData.privacy.thirdPartySharing}
          onValueChange={(value) => updateSettings('privacy', 'thirdPartySharing', value)}
        />
      </View>
    </View>
  );

  const renderAutomationSettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Auto-Approve Rewards</Text>
          <Text style={styles.switchDescription}>Automatically approve reward redemptions</Text>
        </View>
        <Switch
          value={formData.automation.autoApproveRewards}
          onValueChange={(value) => updateSettings('automation', 'autoApproveRewards', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Auto-Schedule Reminders</Text>
          <Text style={styles.switchDescription}>Automatically schedule health reminders</Text>
        </View>
        <Switch
          value={formData.automation.autoScheduleReminders}
          onValueChange={(value) => updateSettings('automation', 'autoScheduleReminders', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Auto-Generate Reports</Text>
          <Text style={styles.switchDescription}>Automatically generate monthly reports</Text>
        </View>
        <Switch
          value={formData.automation.autoGenerateReports}
          onValueChange={(value) => updateSettings('automation', 'autoGenerateReports', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Integration Enabled</Text>
          <Text style={styles.switchDescription}>Enable third-party integrations</Text>
        </View>
        <Switch
          value={formData.automation.integrationEnabled}
          onValueChange={(value) => updateSettings('automation', 'integrationEnabled', value)}
        />
      </View>
    </View>
  );

  const sections = [
    { key: 'general', label: 'General', icon: Settings, render: renderGeneralSettings },
    { key: 'notifications', label: 'Notifications', icon: Bell, render: renderNotificationSettings },
    { key: 'participation', label: 'Participation', icon: Users, render: renderParticipationSettings },
    { key: 'rewards', label: 'Rewards', icon: Target, render: renderRewardsSettings },
    { key: 'privacy', label: 'Privacy', icon: Shield, render: renderPrivacySettings },
    { key: 'automation', label: 'Automation', icon: Calendar, render: renderAutomationSettings },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Program Settings</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <RefreshCw size={16} color="#6B7280" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Save size={16} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Section Navigation */}
        <View style={styles.sectionNav}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sectionTabs}>
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <TouchableOpacity
                    key={section.key}
                    style={[
                      styles.sectionTab,
                      activeSection === section.key && styles.sectionTabActive
                    ]}
                    onPress={() => setActiveSection(section.key)}
                  >
                    <IconComponent 
                      size={16} 
                      color={activeSection === section.key ? '#3B82F6' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.sectionTabText,
                      activeSection === section.key && styles.sectionTabTextActive
                    ]}>
                      {section.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Section Content */}
        <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
          {sections.find(s => s.key === activeSection)?.render()}
        </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    gap: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sectionNav: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  sectionTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  sectionTabActive: {
    backgroundColor: '#EBF4FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  sectionTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionTabTextActive: {
    color: '#3B82F6',
  },
  sectionContent: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  switchDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#3B82F6',
  },
});