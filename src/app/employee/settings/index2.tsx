import { useNavigation } from '@react-navigation/native';
import {
  Bell,
  ChevronRight,
  Download,
  Link,
  Settings as SettingsIcon,
  Shield,
  User
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

export default function SettingsOverview() {
  const navigation = useNavigation();

  const settingsItems: SettingsItem[] = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your personal information and preferences',
      icon: <User size={24} color="#4682B4" />,
      route: 'employee/settings/account',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Control how and when you receive notifications',
      icon: <Bell size={24} color="#4682B4" />,
      route: 'employee/settings/notifications',
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect your calendar and other apps',
      icon: <Link size={24} color="#4682B4" />,
      route: 'employee/settings/integrations',
    },
    {
      id: 'privacy',
      title: 'Data Privacy',
      description: 'Manage your privacy settings and data usage',
      icon: <Shield size={24} color="#4682B4" />,
      route: 'employee/settings/data-privacy',
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Download your health data and records',
      icon: <Download size={24} color="#4682B4" />,
      route: 'employee/settings/export',
    },
  ];

  const handleItemPress = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <SettingsIcon size={28} color="#1F2937" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.itemsContainer}>
          {settingsItems.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item.route)}
              style={styles.settingsItem}
            >
              <View style={styles.iconContainer}>
                {item.icon}
              </View>
              
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>May 21, 2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2025.05.001</Text>
          </View>
        </View>

        {/* Support Links */}
        <View style={styles.supportCard}>
          <Text style={styles.cardTitle}>Support</Text>
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLink}>Help & FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLink}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  itemsContainer: {
    gap: 16,
  },
  settingsItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supportItem: {
    marginBottom: 12,
  },
  supportLink: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
    textAlign: 'center',
  },
});