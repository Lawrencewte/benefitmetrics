import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Edit,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Integration {
  id: string;
  name: string;
  type: 'calendar' | 'hris' | 'benefits' | 'ehr' | 'insurance';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  description: string;
  configuredBy: string;
}

export default function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Google Workspace',
      type: 'calendar',
      status: 'connected',
      lastSync: '2025-05-22T10:30:00Z',
      description: 'Company calendar integration for appointment scheduling',
      configuredBy: 'admin@company.com'
    },
    {
      id: '2',
      name: 'Workday HRIS',
      type: 'hris',
      status: 'connected',
      lastSync: '2025-05-22T08:15:00Z',
      description: 'Employee data and benefits integration',
      configuredBy: 'hr@company.com'
    },
    {
      id: '3',
      name: 'Epic MyChart',
      type: 'ehr',
      status: 'pending',
      lastSync: '',
      description: 'Electronic health records integration (pending approval)',
      configuredBy: 'admin@company.com'
    },
    {
      id: '4',
      name: 'Aetna Benefits',
      type: 'insurance',
      status: 'error',
      lastSync: '2025-05-21T14:20:00Z',
      description: 'Insurance benefits and coverage verification',
      configuredBy: 'benefits@company.com'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return { text: '#059669', bg: '#dcfce7' };
      case 'error':
        return { text: '#dc2626', bg: '#fef2f2' };
      case 'pending':
        return { text: '#d97706', bg: '#fef3c7' };
      case 'disconnected':
        return { text: '#6b7280', bg: '#f3f4f6' };
      default:
        return { text: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    const colors = getStatusColor(status);
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} color={colors.text} />;
      case 'error':
        return <AlertCircle size={16} color={colors.text} />;
      case 'pending':
        return <RefreshCw size={16} color={colors.text} />;
      case 'disconnected':
        return <AlertCircle size={16} color={colors.text} />;
      default:
        return <AlertCircle size={16} color={colors.text} />;
    }
  };

  const getTypeIcon = (type: Integration['type']) => {
    switch (type) {
      case 'calendar':
        return <Calendar size={20} color="#2563eb" />;
      case 'hris':
        return <Building size={20} color="#9333ea" />;
      case 'benefits':
        return <Shield size={20} color="#059669" />;
      case 'ehr':
        return <Settings size={20} color="#ea580c" />;
      case 'insurance':
        return <Shield size={20} color="#4f46e5" />;
      default:
        return <Settings size={20} color="#6b7280" />;
    }
  };

  const formatLastSync = (lastSync: string) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    return date.toLocaleString();
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'pending' as const }
          : integration
      )
    );

    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                status: 'connected' as const,
                lastSync: new Date().toISOString()
              }
            : integration
        )
      );
    }, 2000);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'disconnected' as const }
          : integration
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Integrations</Text>
        <TouchableOpacity 
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>Active Integrations</Text>
          <Text style={styles.sectionSubtitle}>
            Manage your system integrations for seamless data flow and automated processes.
          </Text>
        </View>

        {/* Integration Cards */}
        <View style={styles.integrationsContainer}>
          {integrations.map(integration => {
            const statusColors = getStatusColor(integration.status);
            return (
              <View key={integration.id} style={styles.integrationCard}>
                <View style={styles.integrationHeader}>
                  <View style={styles.integrationInfo}>
                    {getTypeIcon(integration.type)}
                    <View style={styles.integrationDetails}>
                      <Text style={styles.integrationName}>{integration.name}</Text>
                      <Text style={styles.integrationType}>{integration.type} Integration</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    {getStatusIcon(integration.status)}
                    <Text style={[styles.statusText, { color: statusColors.text }]}>
                      {integration.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.integrationDescription}>
                  {integration.description}
                </Text>

                <View style={styles.integrationMeta}>
                  <Text style={styles.metaText}>Last sync: {formatLastSync(integration.lastSync)}</Text>
                  <Text style={styles.metaText}>By: {integration.configuredBy}</Text>
                </View>

                <View style={styles.integrationActions}>
                  <TouchableOpacity
                    onPress={() => handleSync(integration.id)}
                    disabled={integration.status === 'pending'}
                    style={[
                      styles.actionButton,
                      styles.syncButton,
                      integration.status === 'pending' && styles.disabledButton
                    ]}
                  >
                    <RefreshCw size={14} color="white" />
                    <Text style={styles.actionButtonText}>
                      {integration.status === 'pending' ? 'Syncing...' : 'Sync Now'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setSelectedIntegration(integration)}
                    style={[styles.actionButton, styles.configureButton]}
                  >
                    <Edit size={14} color="#374151" />
                    <Text style={styles.configureButtonText}>Configure</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDisconnect(integration.id)}
                    style={[styles.actionButton, styles.disconnectButton]}
                  >
                    <Trash2 size={14} color="#dc2626" />
                    <Text style={styles.disconnectButtonText}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Available Integrations */}
        <View style={styles.availableSection}>
          <Text style={styles.sectionTitle}>Available Integrations</Text>
          <View style={styles.availableGrid}>
            {[
              { name: 'Microsoft 365', type: 'calendar', description: 'Calendar and email integration' },
              { name: 'BambooHR', type: 'hris', description: 'HR information system' },
              { name: 'Cerner', type: 'ehr', description: 'Electronic health records' },
              { name: 'UnitedHealth', type: 'insurance', description: 'Insurance provider' }
            ].map((available, index) => (
              <View key={index} style={styles.availableCard}>
                {getTypeIcon(available.type as Integration['type'])}
                <Text style={styles.availableName}>{available.name}</Text>
                <Text style={styles.availableDescription}>{available.description}</Text>
                <TouchableOpacity style={styles.connectButton}>
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Integration Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>Integration Guidelines</Text>
          <View style={styles.guidelinesList}>
            <Text style={styles.guidelineItem}>• All integrations require proper authentication and authorization</Text>
            <Text style={styles.guidelineItem}>• Data is encrypted in transit and at rest</Text>
            <Text style={styles.guidelineItem}>• Regular sync intervals can be configured per integration</Text>
            <Text style={styles.guidelineItem}>• Failed syncs are automatically retried with exponential backoff</Text>
            <Text style={styles.guidelineItem}>• Integration logs are available for troubleshooting</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Integration Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Integration</Text>
            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Integration Type</Text>
                <View style={styles.picker}>
                  <Text style={styles.pickerText}>Calendar System</Text>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Provider</Text>
                <View style={styles.picker}>
                  <Text style={styles.pickerText}>Select Provider...</Text>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Configuration Name</Text>
                <TextInput 
                  style={styles.textInput}
                  placeholder="e.g., Company Google Calendar"
                />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={[styles.modalButton, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>Add Integration</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Configure Integration Modal */}
      <Modal visible={!!selectedIntegration} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configure {selectedIntegration?.name}</Text>
            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sync Frequency</Text>
                <View style={styles.picker}>
                  <Text style={styles.pickerText}>Every hour</Text>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Data Scope</Text>
                <View style={styles.checkboxGroup}>
                  <View style={styles.checkboxItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checkboxLabel}>Employee roster</Text>
                  </View>
                  <View style={styles.checkboxItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checkboxLabel}>Benefits information</Text>
                  </View>
                  <View style={styles.checkboxItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checkboxLabel}>Calendar availability</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setSelectedIntegration(null)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedIntegration(null)}
                style={[styles.modalButton, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#9333ea',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#7c3aed',
    padding: 8,
    borderRadius: 6,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  introSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  integrationsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  integrationCard: {
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
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  integrationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  integrationType: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  integrationDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  integrationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  integrationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  syncButton: {
    backgroundColor: '#2563eb',
  },
  configureButton: {
    backgroundColor: '#f3f4f6',
  },
  disconnectButton: {
    backgroundColor: '#fef2f2',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  actionButtonText: {
    fontSize: 14,
    color: 'white',
  },
  configureButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  disconnectButtonText: {
    fontSize: 14,
    color: '#dc2626',
  },
  availableSection: {
    marginBottom: 32,
  },
  availableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  availableCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  availableName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  availableDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  connectButtonText: {
    fontSize: 12,
    color: 'white',
  },
  guidelinesSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 8,
  },
  guidelinesList: {
    gap: 4,
  },
  guidelineItem: {
    fontSize: 14,
    color: '#1d4ed8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 16,
  },
  modalForm: {
    gap: 16,
    marginBottom: 24,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  checkboxGroup: {
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  primaryButton: {
    backgroundColor: '#9333ea',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  primaryButtonText: {
    fontSize: 14,
    color: 'white',
  },
});