import { CheckCircle, Clock, Database, Eye } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  currentRetentionPeriod: number;
  minimumRetentionPeriod: number;
  maximumRetentionPeriod: number;
  legalRequirement: string;
  dataTypes: string[];
  automatedDeletion: boolean;
  anonymizationEnabled: boolean;
  totalRecords: number;
  storageSize: string;
  lastPurge: string;
}

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  categories: string[];
  triggerConditions: string[];
  retentionPeriod: number;
  isActive: boolean;
  lastExecuted: string;
  recordsProcessed: number;
}

export default function DataRetentionPage() {
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    {
      id: '1',
      name: 'Employee Profile Data',
      description: 'Personal information, contact details, employment history',
      currentRetentionPeriod: 7,
      minimumRetentionPeriod: 3,
      maximumRetentionPeriod: 10,
      legalRequirement: 'Equal Pay Act requires 3 years minimum',
      dataTypes: ['Personal Info', 'Contact Details', 'Employment History', 'Performance Records'],
      automatedDeletion: true,
      anonymizationEnabled: false,
      totalRecords: 1247,
      storageSize: '3.2 GB',
      lastPurge: '2025-01-15'
    },
    {
      id: '2',
      name: 'Health Information (PHI)',
      description: 'Protected health information including medical records, appointments',
      currentRetentionPeriod: 6,
      minimumRetentionPeriod: 6,
      maximumRetentionPeriod: 50,
      legalRequirement: 'HIPAA requires 6 years minimum',
      dataTypes: ['Medical Records', 'Appointment History', 'Health Assessments', 'Claims Data'],
      automatedDeletion: false,
      anonymizationEnabled: true,
      totalRecords: 8934,
      storageSize: '12.7 GB',
      lastPurge: '2024-12-01'
    },
    {
      id: '3',
      name: 'Benefits Enrollment Data',
      description: 'Insurance elections, beneficiary information, plan participation',
      currentRetentionPeriod: 6,
      minimumRetentionPeriod: 6,
      maximumRetentionPeriod: 20,
      legalRequirement: 'ERISA requires 6 years minimum',
      dataTypes: ['Plan Elections', 'Beneficiary Info', 'Premium Payments', 'Claims History'],
      automatedDeletion: true,
      anonymizationEnabled: true,
      totalRecords: 4532,
      storageSize: '5.8 GB',
      lastPurge: '2025-02-01'
    },
    {
      id: '4',
      name: 'System Audit Logs',
      description: 'Access logs, security events, data modifications',
      currentRetentionPeriod: 3,
      minimumRetentionPeriod: 1,
      maximumRetentionPeriod: 7,
      legalRequirement: 'SOX requires 7 years for public companies',
      dataTypes: ['Access Logs', 'Security Events', 'Data Changes', 'Login Records'],
      automatedDeletion: true,
      anonymizationEnabled: false,
      totalRecords: 45623,
      storageSize: '23.1 GB',
      lastPurge: '2025-05-01'
    },
    {
      id: '5',
      name: 'Communication Records',
      description: 'Email communications, notifications, campaign data',
      currentRetentionPeriod: 1,
      minimumRetentionPeriod: 0,
      maximumRetentionPeriod: 3,
      legalRequirement: 'No specific legal requirement',
      dataTypes: ['Email Records', 'Notifications', 'Campaign Analytics', 'Message Templates'],
      automatedDeletion: true,
      anonymizationEnabled: true,
      totalRecords: 12456,
      storageSize: '2.3 GB',
      lastPurge: '2025-04-15'
    }
  ]);

  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([
    {
      id: '1',
      name: 'Terminated Employee Data Cleanup',
      description: 'Remove non-essential data for employees terminated over 3 years ago',
      categories: ['Employee Profile Data'],
      triggerConditions: ['Employee status: Terminated', 'Termination date > 3 years ago'],
      retentionPeriod: 3,
      isActive: true,
      lastExecuted: '2025-05-01',
      recordsProcessed: 45
    },
    {
      id: '2',
      name: 'Health Data Anonymization',
      description: 'Anonymize health data older than 2 years for analytics',
      categories: ['Health Information (PHI)'],
      triggerConditions: ['Data age > 2 years', 'No active treatment'],
      retentionPeriod: 2,
      isActive: true,
      lastExecuted: '2025-04-15',
      recordsProcessed: 234
    },
    {
      id: '3',
      name: 'Communication Data Purge',
      description: 'Delete marketing and notification data older than 1 year',
      categories: ['Communication Records'],
      triggerConditions: ['Communication age > 1 year', 'Campaign completed'],
      retentionPeriod: 1,
      isActive: true,
      lastExecuted: '2025-05-10',
      recordsProcessed: 1567
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    enableAutomatedRetention: true,
    requireApprovalForDeletion: false,
    notifyBeforeDeletion: true,
    notificationDays: 30,
    enableDataExportBeforeDeletion: true,
    auditAllDeletions: true
  });

  const updateCategoryRetention = (categoryId: string, period: number) => {
    setDataCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, currentRetentionPeriod: period }
        : cat
    ));
  };

  const toggleAutomatedDeletion = (categoryId: string) => {
    setDataCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, automatedDeletion: !cat.automatedDeletion }
        : cat
    ));
  };

  const toggleAnonymization = (categoryId: string) => {
    setDataCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, anonymizationEnabled: !cat.anonymizationEnabled }
        : cat
    ));
  };

  const togglePolicy = (policyId: string) => {
    setRetentionPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, isActive: !policy.isActive }
        : policy
    ));
  };

  const totalStorageUsed = dataCategories.reduce((total, cat) => {
    const sizeInGB = parseFloat(cat.storageSize.replace(' GB', ''));
    return total + sizeInGB;
  }, 0);

  const totalRecords = dataCategories.reduce((total, cat) => total + cat.totalRecords, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Data Retention Management</Text>
          <Text style={styles.headerSubtitle}>
            Configure data retention policies and manage storage lifecycle
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Database size={20} color="#3B82F6" />
              <Text style={styles.statLabel}>Total Storage</Text>
            </View>
            <Text style={styles.statValue}>{totalStorageUsed.toFixed(1)} GB</Text>
            <Text style={styles.statSubtext}>across all categories</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Eye size={20} color="#10B981" />
              <Text style={styles.statLabel}>Total Records</Text>
            </View>
            <Text style={styles.statValue}>{totalRecords.toLocaleString()}</Text>
            <Text style={styles.statSubtext}>records managed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.statLabel}>Active Policies</Text>
            </View>
            <Text style={styles.statValue}>
              {retentionPolicies.filter(p => p.isActive).length}
            </Text>
            <Text style={styles.statSubtext}>retention policies</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <CheckCircle size={20} color="#8B5CF6" />
              <Text style={styles.statLabel}>Compliance</Text>
            </View>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statSubtext}>compliant</Text>
          </View>
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Retention Settings</Text>
          
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable Automated Retention</Text>
                <Text style={styles.settingSubtitle}>Automatically process retention policies</Text>
              </View>
              <Switch
                value={globalSettings.enableAutomatedRetention}
                onValueChange={(value) => setGlobalSettings(prev => ({
                  ...prev,
                  enableAutomatedRetention: value
                }))}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Require Approval for Deletion</Text>
                <Text style={styles.settingSubtitle}>Manual approval required before data deletion</Text>
              </View>
              <Switch
                value={globalSettings.requireApprovalForDeletion}
                onValueChange={(value) => setGlobalSettings(prev => ({
                  ...prev,
                  requireApprovalForDeletion: value
                }))}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notify Before Deletion</Text>
                <Text style={styles.settingSubtitle}>Send notifications before automatic deletion</Text>
              </View>
              <Switch
                value={globalSettings.notifyBeforeDeletion}
                onValueChange={(value) => setGlobalSettings(prev => ({
                  ...prev,
                  notifyBeforeDeletion: value
                }))}
              />
            </View>

            {globalSettings.notifyBeforeDeletion && (
              <View style={[styles.settingRow, styles.subSetting]}>
                <Text style={styles.settingTitle}>Notification Period (Days)</Text>
                <TextInput
                  value={globalSettings.notificationDays.toString()}
                  onChangeText={(value) => setGlobalSettings(prev => ({
                    ...prev,
                    notificationDays: parseInt(value) || 30
                  }))}
                  style={styles.numberInput}
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Export Before Deletion</Text>
                <Text style={styles.settingSubtitle}>Create backup before permanent deletion</Text>
              </View>
              <Switch
                value={globalSettings.enableDataExportBeforeDeletion}
                onValueChange={(value) => setGlobalSettings(prev => ({
                  ...prev,
                  enableDataExportBeforeDeletion: value
                }))}
              />
            </View>
          </View>
        </View>

        {/* Data Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Categories</Text>
          
          {dataCategories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                <View style={styles.legalRequirement}>
                  <Text style={styles.legalRequirementText}>{category.legalRequirement}</Text>
                </View>
              </View>

              {/* Storage Info */}
              <View style={styles.storageInfo}>
                <View style={styles.storageItem}>
                  <Text style={styles.storageLabel}>Records</Text>
                  <Text style={styles.storageValue}>{category.totalRecords.toLocaleString()}</Text>
                </View>
                <View style={styles.storageItem}>
                  <Text style={styles.storageLabel}>Storage Size</Text>
                  <Text style={styles.storageValue}>{category.storageSize}</Text>
                </View>
                <View style={styles.storageItem}>
                  <Text style={styles.storageLabel}>Last Purge</Text>
                  <Text style={styles.storageValue}>
                    {new Date(category.lastPurge).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Retention Period */}
              <View style={styles.retentionSection}>
                <Text style={styles.retentionTitle}>Retention Period</Text>
                <View style={styles.retentionControls}>
                  <Text style={styles.retentionRange}>
                    {category.minimumRetentionPeriod} - {category.maximumRetentionPeriod} years
                  </Text>
                  <TextInput
                    value={category.currentRetentionPeriod.toString()}
                    onChangeText={(value) => {
                      const period = parseInt(value) || category.minimumRetentionPeriod;
                      if (period >= category.minimumRetentionPeriod && period <= category.maximumRetentionPeriod) {
                        updateCategoryRetention(category.id, period);
                      }
                    }}
                    style={styles.retentionInput}
                    keyboardType="numeric"
                  />
                  <Text style={styles.retentionUnit}>years</Text>
                </View>
              </View>

              {/* Toggle Controls */}
              <View style={styles.toggleControls}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Automated Deletion</Text>
                  <Switch
                    value={category.automatedDeletion}
                    onValueChange={() => toggleAutomatedDeletion(category.id)}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Anonymization Enabled</Text>
                  <Switch
                    value={category.anonymizationEnabled}
                    onValueChange={() => toggleAnonymization(category.id)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Retention Policies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Retention Policies</Text>
          {retentionPolicies.map((policy) => (
            <View key={policy.id} style={styles.policyCard}>
              <View style={styles.policyHeader}>
                <View style={styles.policyInfo}>
                  <Text style={styles.policyTitle}>{policy.name}</Text>
                  <Text style={styles.policyDescription}>{policy.description}</Text>
                  <View style={styles.policyCategories}>
                    <Text style={styles.policyCategoriesText}>
                      Applies to: {policy.categories.join(', ')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={policy.isActive}
                  onValueChange={() => togglePolicy(policy.id)}
                />
              </View>
              <View style={styles.policyDetails}>
                <Text style={styles.policyDetail}>
                  Trigger: {policy.triggerConditions.join('; ')}
                </Text>
                <Text style={styles.policyDetail}>
                  Retention Period: {policy.retentionPeriod} years
                </Text>
                <Text style={styles.policyDetail}>
                  Last Executed: {new Date(policy.lastExecuted).toLocaleDateString()}
                </Text>
                <Text style={styles.policyDetail}>
                  Records Processed: {policy.recordsProcessed.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '48%',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  settingsContainer: {
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  subSetting: {
    paddingLeft: 16,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 80,
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
  },
  categoryHeader: {
    padding: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  legalRequirement: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  legalRequirementText: {
    fontSize: 14,
    color: '#1d4ed8',
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    marginHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  storageItem: {
    alignItems: 'center',
  },
  storageLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  storageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  retentionSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  retentionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  retentionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  retentionRange: {
    fontSize: 14,
    color: '#6b7280',
  },
  retentionInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    textAlign: 'center',
  },
  retentionUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggleControls: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  policyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    padding: 24,
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  policyInfo: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  policyCategories: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  policyCategoriesText: {
    fontSize: 14,
    color: '#1d4ed8',
  },
  policyDetails: {
    gap: 4,
  },
  policyDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
});