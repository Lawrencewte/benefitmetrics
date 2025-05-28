import { useRouter } from 'expo-router';
import { Activity, FileText, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';

export default function MorePage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(false);
  
  const navigateTo = (route) => {
    router.push(route);
  };

  const handleSignOut = () => {
    // In a real app, this would handle authentication logout
    console.log('Sign out');
  };

  const quickLinks = [
    { id: 1, icon: Activity, title: 'Health Profile', route: '/profile' },
    { id: 2, icon: FileText, title: 'Health Records', route: '/records' },
    { id: 3, icon: FileText, title: 'Wellness Tips', route: '/tips' },
    { id: 4, icon: Settings, title: 'Settings', route: '/settings' },
  ];

  return (
    <View style={styles.container}>
      <Header title="More Options" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.quickLinksGrid}>
          {quickLinks.map((link) => (
            <Pressable
              key={link.id}
              style={styles.quickLinkCard}
              onPress={() => navigateTo(link.route)}
            >
              <link.icon size={24} color="#3B82F6" style={styles.icon} />
              <Text style={styles.quickLinkText}>{link.title}</Text>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={notificationsEnabled ? '#3B82F6' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Email Reminders</Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={emailRemindersEnabled ? '#3B82F6' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setEmailRemindersEnabled}
              value={emailRemindersEnabled}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Data Sharing with Employer</Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={dataSharingEnabled ? '#3B82F6' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setDataSharingEnabled}
              value={dataSharingEnabled}
            />
          </View>
        </View>
        
        <Pressable
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickLinkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 14,
  },
  signOutButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  signOutText: {
    color: '#6B7280',
    fontSize: 14,
  },
});