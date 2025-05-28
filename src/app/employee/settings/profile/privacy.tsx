import { router } from 'expo-router';
import { AlertTriangle, ChevronRight, Eye, FileText, Lock, Save, Shield } from 'lucide-react'; // Fixed: Changed from lucide-react-native
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../../components/Common/layout/Footer';
import Header from '../../../../components/Common/layout/Header';
// Commented out these imports until the components are created
// import DataAccessHistory from '../../../components/Common/security/DataAccessHistory';
// import PrivacyControls from '../../../components/Common/security/PrivacyControls';
// import SecurityBadge from '../../../components/Common/security/SecurityBadge';
// import { useAuth } from '../../../hooks/Common/useAuth';

export default function PrivacyScreen() {
  // Commented out until useAuth hook is available
  // const { user } = useAuth();
  
  const [showDataAccess, setShowDataAccess] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    shareWithEmployer: true,
    shareAnonymizedData: true,
    shareWithProviders: true,
    marketingEmails: false,
    allowPushNotifications: true,
    showHealthScore: true
  });

  // Define footer tabs
  const footerTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <Shield size={20} />,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Eye size={20} />,
    },
    {
      id: 'benefits',
      label: 'Benefits',
      icon: <FileText size={20} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <Lock size={20} />,
      activeIcon: <Lock size={20} />,
    },
    {
      id: 'more',
      label: 'More',
      icon: <AlertTriangle size={20} />,
    },
  ];

  const handleTabPress = (tabId: string) => {
    console.log('Tab pressed:', tabId);
    // Add navigation logic here
  };
  
  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key]
    });
  };
  
  const handleSave = () => {
    // In a real app, this would save to the backend
    Alert.alert(
      'Privacy Settings Saved',
      'Your privacy preferences have been updated successfully.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Privacy Settings" 
        showBackButton 
        rightComponent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#FFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.securityStatus}>
          {/* Temporarily replaced SecurityBadge with simple text */}
          <View style={styles.securityBadge}>
            <Shield size={24} color="#4CAF50" />
            <Text style={styles.securityText}>High Security</Text>
          </View>
        </View>
        
        {/* Temporarily replaced PrivacyControls with inline controls */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Privacy Controls</Text>
          <Text style={styles.sectionDescription}>
            Manage how your data is used and shared
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Share with Employer</Text>
              <Text style={styles.settingDescription}>
                Allow aggregated health metrics to be shared with your employer (no personal details)
              </Text>
            </View>
            <Switch
              value={privacySettings.shareWithEmployer}
              onValueChange={() => toggleSetting('shareWithEmployer')}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Anonymized Data for Research</Text>
              <Text style={styles.settingDescription}>
                Allow anonymized data to be used for improving preventative healthcare recommendations
              </Text>
            </View>
            <Switch
              value={privacySettings.shareAnonymizedData}
              onValueChange={() => toggleSetting('shareAnonymizedData')}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Share with Healthcare Providers</Text>
              <Text style={styles.settingDescription}>
                Allow your health information to be shared with your healthcare providers
              </Text>
            </View>
            <Switch
              value={privacySettings.shareWithProviders}
              onValueChange={() => toggleSetting('shareWithProviders')}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Communication Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Marketing Emails</Text>
              <Text style={styles.settingDescription}>
                Receive promotional emails about new features and services
              </Text>
            </View>
            <Switch
              value={privacySettings.marketingEmails}
              onValueChange={() => toggleSetting('marketingEmails')}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive push notifications for appointments and health recommendations
              </Text>
            </View>
            <Switch
              value={privacySettings.allowPushNotifications}
              onValueChange={() => toggleSetting('allowPushNotifications')}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Health Score Visibility</Text>
              <Text style={styles.settingDescription}>
                Show your health score on your profile
              </Text>
            </View>
            <Switch
              value={privacySettings.showHealthScore}
              onValueChange={() => toggleSetting('showHealthScore')}
              trackColor={{ false: '#E0E0E0', true: '#4682B4' }}
              thumbColor="#FFF"
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Access & Security</Text>
          
          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => setShowDataAccess(true)}
          >
            <View style={styles.actionIconContainer}>
              <Eye size={18} color="#4682B4" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>View Data Access History</Text>
              <Text style={styles.actionDescription}>
                See who has accessed your health information
              </Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionIconContainer}>
              <Lock size={18} color="#4682B4" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Export Your Data</Text>
              <Text style={styles.actionDescription}>
                Download all your health information in a secure format
              </Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FFEBEE' }]}>
              <AlertTriangle size={18} color="#F44336" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: '#F44336' }]}>Delete Account</Text>
              <Text style={styles.actionDescription}>
                Permanently delete your account and all data
              </Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.complianceCard}>
          <View style={styles.complianceIconContainer}>
            <Shield size={20} color="#4682B4" />
          </View>
          <View style={styles.complianceInfo}>
            <Text style={styles.complianceTitle}>HIPAA Compliant</Text>
            <Text style={styles.complianceDescription}>
              Your health information is protected under HIPAA regulations. We maintain strict security measures to protect your privacy.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.policyLink}>
          <FileText size={16} color="#4682B4" style={styles.policyIcon} />
          <Text style={styles.policyText}>View Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.policyLink}>
          <FileText size={16} color="#4682B4" style={styles.policyIcon} />
          <Text style={styles.policyText}>View Terms of Service</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Temporarily commented out until DataAccessHistory component is created */}
      {showDataAccess && (
        <View style={styles.modalPlaceholder}>
          <Text>Data Access History Modal (Component not yet created)</Text>
        </View>
      )}
      
      {/* Fixed Footer usage */}
      <Footer 
        tabs={footerTabs}
        activeTab="profile"
        onTabPress={handleTabPress}
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
  securityStatus: {
    alignItems: 'center',
    marginBottom: 16,
  },
  // Added styles for temporary SecurityBadge replacement
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  securityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
  },
  complianceCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  complianceIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  complianceInfo: {
    flex: 1,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 4,
  },
  complianceDescription: {
    fontSize: 12,
    color: '#4682B4',
    lineHeight: 18,
  },
  policyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  policyIcon: {
    marginRight: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
  },
  // Added style for modal placeholder
  modalPlaceholder: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});