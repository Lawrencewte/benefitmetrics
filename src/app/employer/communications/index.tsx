import {
  FileText,
  Megaphone,
  Plus,
  Send,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CommunicationMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
}

interface RecentCampaign {
  id: string;
  title: string;
  type: 'announcement' | 'reminder' | 'promotion';
  sentDate: string;
  recipients: number;
  openRate: number;
  status: 'draft' | 'sent' | 'scheduled';
}

export default function CommunicationsDashboard() {
  const [metrics] = useState<CommunicationMetric[]>([
    {
      label: 'Messages Sent',
      value: '2,340',
      change: '+12%',
      icon: <Send size={20} color="#2563eb" />,
    },
    {
      label: 'Open Rate',
      value: '68%',
      change: '+5%',
      icon: <TrendingUp size={20} color="#16a34a" />,
    },
    {
      label: 'Active Recipients',
      value: '412',
      icon: <Users size={20} color="#9333ea" />,
    },
  ]);

  const [recentCampaigns] = useState<RecentCampaign[]>([
    {
      id: '1',
      title: 'Annual Physical Reminder',
      type: 'reminder',
      sentDate: '2025-05-20',
      recipients: 150,
      openRate: 72,
      status: 'sent',
    },
    {
      id: '2',
      title: 'Wellness Week Announcement',
      type: 'announcement',
      sentDate: '2025-05-18',
      recipients: 412,
      openRate: 85,
      status: 'sent',
    },
    {
      id: '3',
      title: 'Flu Shot Campaign',
      type: 'promotion',
      sentDate: '2025-05-15',
      recipients: 380,
      openRate: 61,
      status: 'sent',
    },
  ]);

  const quickActions = [
    {
      id: 'announcement',
      title: 'Create Announcement',
      description: 'Company-wide health announcements',
      icon: <Megaphone size={24} color="#2563eb" />,
    },
    {
      id: 'campaign',
      title: 'Start Campaign',
      description: 'Targeted health campaigns',
      icon: <Target size={24} color="#16a34a" />,
    },
    {
      id: 'template',
      title: 'Manage Templates',
      description: 'Message templates library',
      icon: <FileText size={24} color="#9333ea" />,
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'sent':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
        };
      case 'scheduled':
        return {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
        };
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        };
    }
  };

  const handleQuickAction = (actionId: string) => {
    console.log(`Quick action selected: ${actionId}`);
    // Handle navigation or action here
  };

  const handleCreateNew = () => {
    console.log('Create new communication');
    // Handle create new communication
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Communications</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateNew}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Metrics Overview */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                {metric.icon}
                {metric.change && (
                  <Text style={styles.changeText}>{metric.change}</Text>
                )}
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionCard}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={styles.actionIcon}>{action.icon}</View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Campaigns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Campaigns</Text>
          <View style={styles.campaignsList}>
            {recentCampaigns.map((campaign) => {
              const statusStyle = getStatusStyle(campaign.status);
              return (
                <View key={campaign.id} style={styles.campaignCard}>
                  <View style={styles.campaignHeader}>
                    <Text style={styles.campaignTitle}>{campaign.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusStyle.color },
                        ]}
                      >
                        {campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.campaignStats}>
                    <Text style={styles.statText}>
                      Sent: {new Date(campaign.sentDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.statText}>
                      {campaign.recipients} recipients
                    </Text>
                    <Text style={styles.statText}>
                      {campaign.openRate}% open rate
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Communication Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Communication Insights</Text>

          <View style={styles.insightsList}>
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Best send time</Text>
              <Text style={styles.insightValue}>Tuesday 10:00 AM</Text>
            </View>

            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Most engaged department</Text>
              <Text style={styles.insightValue}>
                Engineering (78% open rate)
              </Text>
            </View>

            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Top performing content</Text>
              <Text style={styles.insightValue}>Health reminders</Text>
            </View>
          </View>
        </View>

        {/* Performance Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Month's Performance</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Campaigns</Text>
              <Text style={styles.summaryValue}>8</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Engagement</Text>
              <Text style={styles.summaryValue}>72%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Actions Taken</Text>
              <Text style={styles.summaryValue}>156</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#111827',
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  campaignsList: {
    gap: 12,
  },
  campaignCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
  },
  insightsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  insightsList: {
    gap: 12,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
});