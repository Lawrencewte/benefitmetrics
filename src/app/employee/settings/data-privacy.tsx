import { Download, Eye, Lock, Shield, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import ConsentForm from '../../../components/Common/security/ConsentForm';
import DataAccessHistory from '../../../components/Common/security/DataAccessHistory';
import Button from '../../../components/Common/ui/Button';

interface PrivacySettings {
  shareWithEmployer: boolean;
  anonymousAnalytics: boolean;
  researchParticipation: boolean;
  thirdPartyIntegrations: boolean;
  marketingCommunications: boolean;
}

export default function DataPrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    shareWithEmployer: true,
    anonymousAnalytics: true,
    researchParticipation: false,
    thirdPartyIntegrations: true,
    marketingCommunications: false,
  });

  const [showConsentForm, setShowConsentForm] = useState(false);
  const [showAccessHistory, setShowAccessHistory] = useState(false);

  const handlePrivacyToggle = (setting: keyof PrivacySettings, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Delete Account Data',
      'This will permanently delete all your health data and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement data deletion
            Alert.alert('Confirmation', 'Your data deletion request has been submitted. You will receive a confirmation email within 24 hours.');
          },
        },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'We will prepare your data export and send it to your email address within 72 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Data export requested') },
      ]
    );
  };

  if (showConsentForm) {
    return (
      <ConsentForm
        onComplete={() => setShowConsentForm(false)}
        onCancel={() => setShowConsentForm(false)}
      />
    );
  }

  if (showAccessHistory) {
    return (
      <DataAccessHistory
        onClose={() => setShowAccessHistory(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Shield size={28} color="#4682B4" />
          <Text style={styles.headerTitle}>Data Privacy</Text>
        </View>

        {/* Privacy Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Controls</Text>
          
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Share with Employer</Text>
                <Text style={styles.settingDescription}>
                  Allow your employer to view anonymized health metrics for wellness programs
                </Text>
              </View>
              <Switch
                value={privacySettings.shareWithEmployer}
                onValueChange={(value) => handlePrivacyToggle('shareWithEmployer', value)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.shareWithEmployer ? '#4682B4' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Anonymous Analytics</Text>
                <Text style={styles.settingDescription}>
                  Help improve the app by sharing anonymous usage data
                </Text>
              </View>
              <Switch
                value={privacySettings.anonymousAnalytics}
                onValueChange={(value) => handlePrivacyToggle('anonymousAnalytics', value)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.anonymousAnalytics ? '#4682B4' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Research Participation</Text>
                <Text style={styles.settingDescription}>
                  Participate in health research studies (optional, always anonymous)
                </Text>
              </View>
              <Switch
                value={privacySettings.researchParticipation}
                onValueChange={(value) => handlePrivacyToggle('researchParticipation', value)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.researchParticipation ? '#4682B4' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Third-Party Integrations</Text>
                <Text style={styles.settingDescription}>
                  Allow data sharing with connected health apps and services
                </Text>
              </View>
              <Switch
                value={privacySettings.thirdPartyIntegrations}
                onValueChange={(value) => handlePrivacyToggle('thirdPartyIntegrations', value)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.thirdPartyIntegrations ? '#4682B4' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Marketing Communications</Text>
                <Text style={styles.settingDescription}>
                  Receive personalized health tips and product recommendations
                </Text>
              </View>
              <Switch
                value={privacySettings.marketingCommunications}
                onValueChange={(value) => handlePrivacyToggle('marketingCommunications', value)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.marketingCommunications ? '#4682B4' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => setShowAccessHistory(true)}
              label="View Data Access History"
              variant="outline"
              icon={<Eye size={20} color="#4682B4" />}
            />
            
            <Button
              onPress={handleDataExport}
              label="Export My Data"
              variant="outline"
              icon={<Download size={20} color="#4682B4" />}
            />
            
            <Button
              onPress={() => setShowConsentForm(true)}
              label="Review Consent Settings"
              variant="outline"
              icon={<Lock size={20} color="#4682B4" />}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleDataDeletion}
              label="Delete All My Data"
              variant="outline"
              style={styles.dangerButton}
              icon={<Trash2 size={20} color="#EF4444" />}
            />
          </View>
          
          <Text style={styles.dangerWarning}>
            This action cannot be undone. All your health data will be permanently deleted.
          </Text>
        </View>

        {/* Privacy Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            We are committed to protecting your health information. All data is encrypted and stored securely. 
            We never sell your personal information to third parties.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  dangerSection: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFFFF',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 16,
  },
  dangerButton: {
    borderColor: '#EF4444',
  },
  dangerWarning: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
    lineHeight: 16,
  },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1D4ED8',
    lineHeight: 20,
  },
});