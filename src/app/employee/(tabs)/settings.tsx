import { Link } from 'expo-router';
import {
    Bell,
    ChevronRight,
    Database,
    Download,
    Heart,
    Link as LinkIcon,
    Lock,
    Pill,
    Shield,
    User,
    UserCheck,
    Users
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingsItem[];
};

type SettingsItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  href: string;
  showChevron?: boolean;
};

export default function SettingsTab() {
  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <User size={20} color="#4682B4" />,
      items: [
        {
          id: 'account',
          title: 'Account Settings',
          subtitle: 'Manage your account information',
          icon: <UserCheck size={20} color="#666" />,
          href: '/employee/settings/account',
          showChevron: true
        },
        {
          id: 'profile-overview',
          title: 'Profile Overview',
          subtitle: 'View and edit your complete profile',
          icon: <User size={20} color="#666" />,
          href: '/employee/settings/profile',
          showChevron: true
        }
      ]
    },
    {
      id: 'health',
      title: 'Health Information',
      icon: <Heart size={20} color="#4682B4" />,
      items: [
        {
          id: 'health-info',
          title: 'Health Information',
          subtitle: 'Basic health details and conditions',
          icon: <Heart size={20} color="#666" />,
          href: '/employee/settings/profile/health-info',
          showChevron: true
        },
        {
          id: 'family-history',
          title: 'Family Medical History',
          subtitle: 'Family health history and genetic information',
          icon: <Users size={20} color="#666" />,
          href: '/employee/settings/profile/family-history',
          showChevron: true
        },
        {
          id: 'medications',
          title: 'Medications & Supplements',
          subtitle: 'Current medications and supplements',
          icon: <Pill size={20} color="#666" />,
          href: '/employee/settings/profile/medications',
          showChevron: true
        },
        {
          id: 'privacy-health',
          title: 'Health Privacy Settings',
          subtitle: 'Control health data sharing preferences',
          icon: <Lock size={20} color="#666" />,
          href: '/employee/settings/profile/privacy',
          showChevron: true
        }
      ]
    },
    {
      id: 'family',
      title: 'Family Members',
      icon: <Users size={20} color="#4682B4" />,
      items: [
        {
          id: 'family-overview',
          title: 'Family Overview',
          subtitle: 'Manage all family member profiles',
          icon: <Users size={20} color="#666" />,
          href: '/employee/settings/family',
          showChevron: true
        },
        {
          id: 'add-member',
          title: 'Add Family Member',
          subtitle: 'Add a new family member to your account',
          icon: <UserCheck size={20} color="#666" />,
          href: '/employee/settings/family/add-member',
          showChevron: true
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield size={20} color="#4682B4" />,
      items: [
        {
          id: 'data-privacy',
          title: 'Data Privacy Controls',
          subtitle: 'Manage data sharing and privacy settings',
          icon: <Database size={20} color="#666" />,
          href: '/employee/settings/data-privacy',
          showChevron: true
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications & Communication',
      icon: <Bell size={20} color="#4682B4" />,
      items: [
        {
          id: 'notifications',
          title: 'Notification Preferences',
          subtitle: 'Manage your notification settings',
          icon: <Bell size={20} color="#666" />,
          href: '/employee/settings/notifications',
          showChevron: true
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Apps & Integrations',
      icon: <LinkIcon size={20} color="#4682B4" />,
      items: [
        {
          id: 'integrations',
          title: 'Connected Apps',
          subtitle: 'Manage calendar and app integrations',
          icon: <LinkIcon size={20} color="#666" />,
          href: '/employee/settings/integrations',
          showChevron: true
        }
      ]
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: <Database size={20} color="#4682B4" />,
      items: [
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Download your health data',
          icon: <Download size={20} color="#666" />,
          href: '/employee/settings/export',
          showChevron: true
        }
      ]
    }
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <Link key={item.id} href={item.href} asChild>
      <TouchableOpacity style={styles.settingsItem}>
        <View style={styles.itemContent}>
          <View style={styles.itemIcon}>
            {item.icon}
          </View>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        {item.showChevron && (
          <ChevronRight size={16} color="#CCC" />
        )}
      </TouchableOpacity>
    </Link>
  );

  const renderSection = (section: SettingsSection) => (
    <View key={section.id} style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          {section.icon}
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingsItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Summary */}
        <View style={styles.profileSummary}>
          <View style={styles.avatarContainer}>
            <User size={32} color="#4682B4" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Taylor Johnson</Text>
            <Text style={styles.profileEmail}>taylor.johnson@company.com</Text>
          </View>
          <Link href="/employee/settings/account" asChild>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Settings Sections */}
        {settingsSections.map(renderSection)}

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>BenefitMetrics</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>© 2025 BenefitMetrics Inc.</Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Bottom spacing for scroll */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  scrollView: {
    flex: 1,
  },
  profileSummary: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F0F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editProfileButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionIconContainer: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  appInfoCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  signOutButton: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 32,
  },
});