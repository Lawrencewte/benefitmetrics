// src/app/employer/(tabs)/more.tsx
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Building,
  CheckCircle,
  Database,
  Download,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Phone,
  Puzzle,
  Shield,
  User,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';

const MoreHub = () => {
  const router = useRouter();
  const [complianceStatus, setComplianceStatus] = useState('compliant');

  const settingsCategories = [
    {
      id: 'company',
      title: 'Company Settings',
      description: 'Manage company profile and organizational structure',
      icon: Building,
      route: '/employer/settings/company',
      items: ['Company Profile', 'Departments', 'Locations', 'Branding'],
      color: '#3b82f6'
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage admin users and access permissions',
      icon: Users,
      route: '/employer/settings/users',
      items: ['Admin Users', 'Permissions', 'Role Management', 'Access Logs'],
      color: '#8b5cf6'
    },
    {
      id: 'integrations',
      title: 'System Integrations',
      description: 'Configure integrations with external systems',
      icon: Puzzle,
      route: '/employer/settings/integrations',
      items: ['HRIS Systems', 'Calendar', 'Email', 'Single Sign-On'],
      color: '#10b981'
    },
    {
      id: 'compliance',
      title: 'Compliance & Security',
      description: 'Monitor compliance status and security settings',
      icon: Shield,
      route: '/employer/settings/compliance',
      items: ['HIPAA Compliance', 'Data Protection', 'Audit Logs', 'Security Policies'],
      color: '#dc2626'
    },
    {
      id: 'data-retention',
      title: 'Data Management',
      description: 'Control data retention and privacy settings',
      icon: Database,
      route: '/employer/settings/data-retention',
      items: ['Data Retention', 'Privacy Controls', 'Export Data', 'Anonymization'],
      color: '#f59e0b'
    }
  ];

  const quickActions = [
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download reports and analytics',
      icon: Download,
      action: () => console.log('Export data'),
      color: '#3b82f6'
    },
    {
      id: 'compliance-check',
      title: 'Compliance Check',
      description: 'Run security compliance audit',
      icon: CheckCircle,
      action: () => console.log('Run compliance check'),
      color: '#10b981'
    },
    {
      id: 'support',
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: HelpCircle,
      action: () => console.log('Contact support'),
      color: '#8b5cf6'
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Access user guides and API docs',
      icon: FileText,
      action: () => console.log('View documentation'),
      color: '#f59e0b'
    }
  ];

  const systemStatus = {
    overall: 'operational',
    services: [
      { name: 'Analytics Engine', status: 'operational', uptime: '99.9%' },
      { name: 'Communication Service', status: 'operational', uptime: '99.8%' },
      { name: 'Data Processing', status: 'maintenance', uptime: '98.5%' },
      { name: 'User Authentication', status: 'operational', uptime: '99.9%' }
    ],
    lastUpdate: '2025-05-28 14:30:00'
  };

  const complianceOverview = {
    status: 'compliant',
    lastAudit: '2025-05-15',
    nextAudit: '2025-08-15',
    certificates: ['SOC 2 Type II', 'HIPAA Compliant', 'ISO 27001'],
    pendingItems: 0
  };

  const accountInfo = {
    companyName: 'Acme Corporation',
    planType: 'Enterprise',
    employees: 412,
    subscription: 'Active',
    renewalDate: '2025-12-31'
  };

  const navigateToSection = (route) => {
    router.push(route);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'maintenance': return AlertCircle;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="More" />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Settings & More</Text>
          <Text style={styles.pageSubtitle}>
            Manage system settings, compliance, and account preferences
          </Text>
        </View>

        {/* Account Overview */}
        <Card style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIcon}>
              <Building size={24} color="#3b82f6" />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{accountInfo.companyName}</Text>
              <Text style={styles.accountPlan}>{accountInfo.planType} Plan</Text>
              <Text style={styles.accountDetails}>
                {accountInfo.employees} employees • {accountInfo.subscription}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigateToSection('/employer/settings/company')}>
              <ArrowRight size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* System Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.sectionTitle}>System Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: systemStatus.overall === 'operational' ? '#dcfce7' : '#fef3c7' }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: systemStatus.overall === 'operational' ? '#10b981' : '#f59e0b' }
              ]}>
                {systemStatus.overall === 'operational' ? 'All Systems Operational' : 'Maintenance'}
              </Text>
            </View>
          </View>

          {systemStatus.services.map((service, index) => {
            const StatusIcon = getStatusIcon(service.status);
            return (
              <View key={index} style={styles.serviceItem}>
                <StatusIcon size={16} color={getStatusColor(service.status)} />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceUptime}>Uptime: {service.uptime}</Text>
                </View>
                <Text style={[styles.serviceStatus, { 
                  color: getStatusColor(service.status) 
                }]}>
                  {service.status}
                </Text>
              </View>
            );
          })}
          
          <Text style={styles.lastUpdate}>
            Last updated: {systemStatus.lastUpdate}
          </Text>
        </Card>

        {/* Compliance Overview */}
        <Card style={styles.complianceCard}>
          <View style={styles.complianceHeader}>
            <Shield size={24} color={complianceOverview.status === 'compliant' ? '#10b981' : '#dc2626'} />
            <View style={styles.complianceInfo}>
              <Text style={styles.complianceTitle}>Compliance Status</Text>
              <Text style={[
                styles.complianceStatus,
                { color: complianceOverview.status === 'compliant' ? '#10b981' : '#dc2626' }
              ]}>
                {complianceOverview.status === 'compliant' ? 'Fully Compliant' : 'Attention Required'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigateToSection('/employer/settings/compliance')}>
              <ArrowRight size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.complianceDetails}>
            <Text style={styles.complianceItem}>
              Last Audit: {complianceOverview.lastAudit}
            </Text>
            <Text style={styles.complianceItem}>
              Next Audit: {complianceOverview.nextAudit}
            </Text>
            <Text style={styles.complianceItem}>
              Certificates: {complianceOverview.certificates.join(', ')}
            </Text>
            {complianceOverview.pendingItems > 0 && (
              <Text style={styles.pendingItems}>
                {complianceOverview.pendingItems} pending compliance items
              </Text>
            )}
          </View>
        </Card>

        {/* Settings Categories */}
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => navigateToSection(category.route)}
              style={styles.categoryCard}
            >
              <Card>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                    <IconComponent size={24} color={category.color} />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                  </View>
                  <ArrowRight size={20} color="#666" />
                </View>
                
                <View style={styles.categoryItems}>
                  {category.items.map((item, index) => (
                    <Text key={index} style={styles.categoryItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              
              return (
                <TouchableOpacity 
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={action.action}
                >
                  <IconComponent size={24} color={action.color} />
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionDescription}>{action.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Support & Help */}
        <Card style={styles.supportCard}>
          <Text style={styles.sectionTitle}>Support & Resources</Text>
          
          <View style={styles.supportItems}>
            <TouchableOpacity style={styles.supportItem}>
              <HelpCircle size={20} color="#3b82f6" />
              <Text style={styles.supportText}>Help Center</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem}>
              <FileText size={20} color="#3b82f6" />
              <Text style={styles.supportText}>API Documentation</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem}>
              <Mail size={20} color="#3b82f6" />
              <Text style={styles.supportText}>Contact Support</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem}>
              <Phone size={20} color="#3b82f6" />
              <Text style={styles.supportText}>Schedule Call</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Account Actions */}
        <Card style={styles.accountActionsCard}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.accountActions}>
            <TouchableOpacity style={styles.accountAction}>
              <User size={20} color="#666" />
              <Text style={styles.accountActionText}>Profile Settings</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountAction}>
              <Bell size={20} color="#666" />
              <Text style={styles.accountActionText}>Notification Preferences</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountAction}>
              <Lock size={20} color="#666" />
              <Text style={styles.accountActionText}>Security Settings</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountAction}>
              <Download size={20} color="#666" />
              <Text style={styles.accountActionText}>Export Account Data</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleLogout}
            icon={<LogOut size={16} />}
            style={styles.logoutButton}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>HealthAhead v2.1.0</Text>
          <Text style={styles.appInfoText}>© 2025 HealthAhead Technologies</Text>
        </View>
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  accountCard: {
    marginBottom: 20,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  accountPlan: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginTop: 2,
  },
  accountDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusCard: {
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  serviceUptime: {
    fontSize: 12,
    color: '#666',
  },
  serviceStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  complianceCard: {
    marginBottom: 24,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  complianceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  complianceStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  complianceDetails: {
    marginTop: 8,
  },
  complianceItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pendingItems: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 8,
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryItems: {
    marginLeft: 60,
  },
  categoryItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  supportCard: {
    marginBottom: 20,
  },
  supportItems: {
    gap: 0,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  supportText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  accountActionsCard: {
    marginBottom: 20,
  },
  accountActions: {
    gap: 0,
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountActionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  logoutSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoutButton: {
    width: '50%',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
});

export default MoreHub;