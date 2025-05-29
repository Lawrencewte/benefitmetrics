import Footer from '@/src/components/Common/layout/Footer';
import Header from '@/src/components/Common/layout/Header';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from '../../../components/Common/ui/Button';
import { useNotifications } from '../../../hooks/Common/useNotifications';

interface NotificationSettings {
  email: {
    enabled: boolean;
    appointments: boolean;
    reminders: boolean;
    healthUpdates: boolean;
    challenges: boolean;
    newsletters: boolean;
  };
  push: {
    enabled: boolean;
    appointments: boolean;
    reminders: boolean;
    healthUpdates: boolean;
    challenges: boolean;
    urgentAlerts: boolean;
  };
  sms: {
    enabled: boolean;
    appointments: boolean;
    reminders: boolean;
    urgentAlerts: boolean;
  };
}

export default function NotificationSettings() {
  const { updateNotificationSettings, isLoading } = useNotifications();
  
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      appointments: true,
      reminders: true,
      healthUpdates: true,
      challenges: false,
      newsletters: false,
    },
    push: {
      enabled: true,
      appointments: true,
      reminders: true,
      healthUpdates: false,
      challenges: true,
      urgentAlerts: true,
    },
    sms: {
      enabled: false,
      appointments: false,
      reminders: false,
      urgentAlerts: true,
    },
  });

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  const handleToggle = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category] as any,
        [setting]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateNotificationSettings(settings);
      Alert.alert('Success', 'Notification settings updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const renderSwitchRow = (label: string, value: boolean, onToggle: (value: boolean) => void) => (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
        thumbColor={value ? '#4682B4' : '#F3F4F6'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Notification Settings" showBackButton />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Notification Settings</Text>

        {/* Email Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Email Notifications</Text>
            <Switch
              value={settings.email.enabled}
              onValueChange={(value) => handleToggle('email', 'enabled', value)}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.email.enabled ? '#4682B4' : '#F3F4F6'}
            />
          </View>
          
          {settings.email.enabled && (
            <View style={styles.subSection}>
              {renderSwitchRow(
                'Appointment confirmations',
                settings.email.appointments,
                (value) => handleToggle('email', 'appointments', value)
              )}
              
              {renderSwitchRow(
                'Health reminders',
                settings.email.reminders,
                (value) => handleToggle('email', 'reminders', value)
              )}
              
              {renderSwitchRow(
                'Health score updates',
                settings.email.healthUpdates,
                (value) => handleToggle('email', 'healthUpdates', value)
              )}
              
              {renderSwitchRow(
                'Challenge invitations',
                settings.email.challenges,
                (value) => handleToggle('email', 'challenges', value)
              )}
              
              {renderSwitchRow(
                'Health newsletters',
                settings.email.newsletters,
                (value) => handleToggle('email', 'newsletters', value)
              )}
            </View>
          )}
        </View>

        {/* Push Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <Switch
              value={settings.push.enabled}
              onValueChange={(value) => handleToggle('push', 'enabled', value)}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.push.enabled ? '#4682B4' : '#F3F4F6'}
            />
          </View>
          
          {settings.push.enabled && (
            <View style={styles.subSection}>
              {renderSwitchRow(
                'Appointment reminders',
                settings.push.appointments,
                (value) => handleToggle('push', 'appointments', value)
              )}
              
              {renderSwitchRow(
                'Health reminders',
                settings.push.reminders,
                (value) => handleToggle('push', 'reminders', value)
              )}
              
              {renderSwitchRow(
                'Health updates',
                settings.push.healthUpdates,
                (value) => handleToggle('push', 'healthUpdates', value)
              )}
              
              {renderSwitchRow(
                'Challenge notifications',
                settings.push.challenges,
                (value) => handleToggle('push', 'challenges', value)
              )}
              
              {renderSwitchRow(
                'Urgent alerts',
                settings.push.urgentAlerts,
                (value) => handleToggle('push', 'urgentAlerts', value)
              )}
            </View>
          )}
        </View>

        {/* SMS Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SMS Notifications</Text>
            <Switch
              value={settings.sms.enabled}
              onValueChange={(value) => handleToggle('sms', 'enabled', value)}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.sms.enabled ? '#4682B4' : '#F3F4F6'}
            />
          </View>
          
          {settings.sms.enabled && (
            <View style={styles.subSection}>
              {renderSwitchRow(
                'Appointment confirmations',
                settings.sms.appointments,
                (value) => handleToggle('sms', 'appointments', value)
              )}
              
              {renderSwitchRow(
                'Important reminders',
                settings.sms.reminders,
                (value) => handleToggle('sms', 'reminders', value)
              )}
              
              {renderSwitchRow(
                'Urgent alerts only',
                settings.sms.urgentAlerts,
                (value) => handleToggle('sms', 'urgentAlerts', value)
              )}
            </View>
          )}
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <Text style={styles.sectionDescription}>
            Set hours when you don't want to receive non-urgent notifications.
          </Text>
          
          {renderSwitchRow(
            'Enable quiet hours',
            quietHoursEnabled,
            setQuietHoursEnabled
          )}
          
          {quietHoursEnabled && (
            <View style={styles.subSection}>
              <Text style={styles.comingSoonText}>
                Time picker functionality coming soon
              </Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSave}
            label={isLoading ? "Saving..." : "Save Settings"}
            variant="primary"
            disabled={isLoading}
          />
        </View>
      </ScrollView>
      <Footer />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  subSection: {
    paddingLeft: 16,
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    marginRight: 16,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 32,
    marginTop: 8,
  },
});