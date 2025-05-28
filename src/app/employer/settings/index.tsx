import {
    AlertTriangle,
    Bell,
    Building,
    Check,
    ChevronRight,
    Database,
    Globe,
    HelpCircle,
    Key,
    Shield,
    Users
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  status?: 'complete' | 'warning' | 'error';
  badge?: string;
}

interface SystemStatus {
  overall: 'healthy' | 'warning' | 'error';
  services: {
    name: string;
    status: 'online' | 'degraded' | 'offline';
    lastChecked: string;
  }[];
}

export default function SettingsOverview() {
  const [systemStatus] = useState<SystemStatus>({
    overall: 'healthy',
    services: [
      { name: 'Authentication Service', status: 'online', lastChecked: '2 minutes ago' },
      { name: 'Data Analytics', status: 'online', lastChecked: '5 minutes ago' },
      { name: 'Notification System', status: 'degraded', lastChecked: '1 minute ago' },
      { name: 'Integration APIs', status: 'online', lastChecked: '3 minutes ago' },
      { name: 'Backup Systems', status: 'online', lastChecked: '10 minutes ago' }
    ]
  });

  const settingsCategories = {
    organization: [
      {
        id: 'company',
        title: 'Company Settings',
        description: 'Update company information, departments, and structure',
        icon: Building,
        route: '/employer/settings/company',
        status: 'complete' as const
      },
      {
        id: 'users',
        title: 'User Management',
        description: 'Manage admin users, roles, and permissions',
        icon: Users,
        route: '/employer/settings/users',
        badge: '3 pending'
      }
    ],
    system: [
      {
        id: 'integrations',
        title: 'System Integrations',
        description: 'Configure HRIS, benefits, and third-party connections',
        icon: Globe,
        route: '/employer/settings/integrations',
        status: 'warning' as const
      },
      {
        id: 'compliance',
        title: 'Compliance Settings',
        description: 'HIPAA compliance, audit logs, and regulatory settings',
        icon: Shield,
        route: '/employer/settings/compliance',
        status: 'complete' as const
      },
      {
        id: 'data-retention',
        title: 'Data Management',
        description: 'Data retention policies, export options, and privacy controls',
        icon: Database,
        route: '/employer/settings/data-retention',
        status: 'complete' as const
      }
    ],
    notifications: [
      {
        id: 'notifications',
        title: 'Notification Settings',
        description: 'Configure system alerts, reports, and communication preferences',
        icon: Bell,
        route: '/employer/settings/notifications'
      }
    ]
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'complete': return <Check size={16} color="#10b981" />;
      case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'error': return <AlertTriangle size={16} color="#ef4444" />;
      default: return null;
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleSystemCheck = () => {
    Alert.alert(
      'System Check',
      'Running comprehensive system diagnostics...',
      [{ text: 'OK' }]
    );
  };

  const renderSettingsCategory = (title: string, items: SettingsItem[]) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <View style={styles.categoryItems}>
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity key={item.id} style={styles.settingsItem}>
              <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color="#8b5cf6" />
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {getStatusIcon(item.status)}
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your organization and system configuration</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* System Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>System Status</Text>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: systemStatus.overall === 'healthy' ? '#10b981' : '#f59e0b' }
                ]} />
                <Text style={styles.statusText}>
                  {systemStatus.overall === 'healthy' ? 'All Systems Operational' : 'Some Issues Detected'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.checkButton} onPress={handleSystemCheck}>
              <Text style={styles.checkButtonText}>Run Check</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.servicesList}>
            {systemStatus.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceTime}>Last checked: {service.lastChecked}</Text>
                </View>
                <View style={styles.serviceStatus}>
                  <View style={[
                    styles.serviceStatusDot,
                    { backgroundColor: getServiceStatusColor(service.status) }
                  ]} />
                  <Text style={[
                    styles.serviceStatusText,
                    { color: getServiceStatusColor(service.status) }
                  ]}>
                    {service.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Key size={24} color="#8b5cf6" />
              <Text style={styles.actionTitle}>Reset API Keys</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Database size={24} color="#10b981" />
              <Text style={styles.actionTitle}>Export Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Shield size={24} color="#f59e0b" />
              <Text style={styles.actionTitle}>Security Audit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <HelpCircle size={24} color="#6b7280" />
              <Text style={styles.actionTitle}>Get Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Categories */}
        {renderSettingsCategory('Organization', settingsCategories.organization)}
        {renderSettingsCategory('System & Security', settingsCategories.system)}
        {renderSettingsCategory('Communications', settingsCategories.notifications)}

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support & Resources</Text>
          
          <TouchableOpacity style={styles.supportItem}>
            <HelpCircle size={20} color="#8b5cf6" />
            <View style={styles.supportInfo}>
              <Text style={styles.supportTitle}>Documentation</Text>
              <Text style={styles.supportDescription}>Access admin guides and API documentation</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Users size={20} color="#8b5cf6" />
            <View style={styles.supportInfo}>
              <Text style={styles.supportTitle}>Contact Support</Text>
              <Text style={styles.supportDescription}>Get help from our technical support team</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>2.1.4</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Environment</Text>
              <Text style={styles.infoValue}>Production</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>March 15, 2024</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data Center</Text>
              <Text style={styles.infoValue}>US-East-1</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
  },
  checkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  checkButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  serviceTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  serviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  serviceStatusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryItems: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  supportSection: {
    marginBottom: 24,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  supportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  appInfo: {
    marginBottom: 24,
  },
  infoGrid: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});