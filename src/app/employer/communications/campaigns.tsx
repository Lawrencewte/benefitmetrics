import { BarChart3, Calendar, Edit, Eye, Plus, Send, Target, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';

interface Campaign {
  id: string;
  name: string;
  type: 'wellness' | 'preventative_care' | 'benefits_reminder' | 'challenge';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  targetAudience: {
    departments: string[];
    healthScoreRange?: { min: number; max: number };
    demographics?: string[];
  };
  schedule: {
    startDate: string;
    endDate?: string;
    frequency: 'once' | 'weekly' | 'monthly';
  };
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q4 Flu Shot Reminder',
      type: 'preventative_care',
      status: 'active',
      targetAudience: {
        departments: ['all'],
        demographics: ['all_ages']
      },
      schedule: {
        startDate: '2025-05-15',
        endDate: '2025-06-15',
        frequency: 'weekly'
      },
      metrics: {
        sent: 412,
        opened: 324,
        clicked: 89,
        converted: 42
      },
      createdAt: '2025-05-10'
    },
    {
      id: '2',
      name: 'Engineering Team Wellness Challenge',
      type: 'challenge',
      status: 'scheduled',
      targetAudience: {
        departments: ['engineering'],
        healthScoreRange: { min: 0, max: 80 }
      },
      schedule: {
        startDate: '2025-06-01',
        endDate: '2025-06-30',
        frequency: 'once'
      },
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      createdAt: '2025-05-20'
    },
    {
      id: '3',
      name: 'Mental Health Awareness Week',
      type: 'wellness',
      status: 'completed',
      targetAudience: {
        departments: ['all'],
        demographics: ['all_ages']
      },
      schedule: {
        startDate: '2025-05-01',
        endDate: '2025-05-07',
        frequency: 'once'
      },
      metrics: {
        sent: 412,
        opened: 356,
        clicked: 145,
        converted: 78
      },
      createdAt: '2025-04-25'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#dcfce7', text: '#166534' };
      case 'scheduled':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'draft':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'completed':
        return { bg: '#f3f4f6', text: '#374151' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wellness':
        return <Target size={16} color="#10B981" />;
      case 'preventative_care':
        return <Calendar size={16} color="#3B82F6" />;
      case 'benefits_reminder':
        return <Users size={16} color="#8B5CF6" />;
      case 'challenge':
        return <BarChart3 size={16} color="#F59E0B" />;
      default:
        return <Send size={16} color="#6B7280" />;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedTab === 'all') return true;
    return campaign.status === selectedTab;
  });

  const calculateEngagementRate = (campaign: Campaign) => {
    if (campaign.metrics.sent === 0) return 0;
    return Math.round((campaign.metrics.opened / campaign.metrics.sent) * 100);
  };

  const calculateConversionRate = (campaign: Campaign) => {
    if (campaign.metrics.opened === 0) return 0;
    return Math.round((campaign.metrics.converted / campaign.metrics.opened) * 100);
  };

  const averageOpenRate = campaigns.length > 0 
    ? Math.round(campaigns.reduce((acc, c) => acc + calculateEngagementRate(c), 0) / campaigns.length)
    : 0;

  return (
    
    <SafeAreaView style={styles.container}>
      <Header 
        title="Health Campaigns" 
        showBackButton
      />
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Health Campaigns</Text>
            <Text style={styles.headerSubtitle}>
              Create and manage targeted health communications
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            style={styles.createButton}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create Campaign</Text>
          </TouchableOpacity>
        </View>

        {/* Campaign Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Campaigns</Text>
            <Text style={styles.statValue}>{campaigns.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>
              {campaigns.filter(c => c.status === 'active').length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Open Rate</Text>
            <Text style={[styles.statValue, { color: '#2563eb' }]}>
              {averageOpenRate}%
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Reach</Text>
            <Text style={[styles.statValue, { color: '#7c3aed' }]}>
              {campaigns.reduce((acc, c) => acc + c.metrics.sent, 0)}
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {[
              { key: 'all', label: 'All Campaigns' },
              { key: 'active', label: 'Active' },
              { key: 'draft', label: 'Drafts' },
              { key: 'completed', label: 'Completed' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setSelectedTab(tab.key as any)}
                style={[
                  styles.tab,
                  selectedTab === tab.key && styles.activeTab
                ]}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab.key && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campaigns List */}
        <View style={styles.campaignsContainer}>
          {filteredCampaigns.map((campaign) => {
            const statusColors = getStatusColors(campaign.status);
            return (
              <View key={campaign.id} style={styles.campaignCard}>
                <View style={styles.campaignContent}>
                  <View style={styles.campaignHeader}>
                    <View style={styles.campaignTitleArea}>
                      <View style={styles.campaignTitleRow}>
                        {getTypeIcon(campaign.type)}
                        <Text style={styles.campaignTitle}>
                          {campaign.name}
                        </Text>
                      </View>
                      <View style={styles.campaignMeta}>
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                          <Text style={[styles.statusText, { color: statusColors.text }]}>
                            {campaign.status}
                          </Text>
                        </View>
                        <Text style={styles.typeText}>
                          {campaign.type.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.campaignActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Eye size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <BarChart3 size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Target Audience */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Target Audience</Text>
                    <View style={styles.infoRow}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.infoText}>
                        {campaign.targetAudience.departments.includes('all') 
                          ? 'All Departments' 
                          : campaign.targetAudience.departments.join(', ')}
                      </Text>
                      {campaign.targetAudience.healthScoreRange && (
                        <Text style={styles.infoTextSecondary}>
                          • Health Score: {campaign.targetAudience.healthScoreRange.min}-{campaign.targetAudience.healthScoreRange.max}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Schedule */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Schedule</Text>
                    <View style={styles.infoRow}>
                      <Calendar size={14} color="#6B7280" />
                      <Text style={styles.infoText}>
                        {campaign.schedule.startDate}
                        {campaign.schedule.endDate && ` - ${campaign.schedule.endDate}`}
                        {' • '}
                        <Text style={styles.frequencyText}>{campaign.schedule.frequency}</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Metrics */}
                  {campaign.metrics.sent > 0 && (
                    <View style={styles.metricsSection}>
                      <View style={styles.metricsGrid}>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Sent</Text>
                          <Text style={styles.metricValue}>
                            {campaign.metrics.sent.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Opened</Text>
                          <Text style={[styles.metricValue, { color: '#2563eb' }]}>
                            {campaign.metrics.opened.toLocaleString()}
                          </Text>
                          <Text style={styles.metricPercentage}>
                            {calculateEngagementRate(campaign)}%
                          </Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Clicked</Text>
                          <Text style={[styles.metricValue, { color: '#059669' }]}>
                            {campaign.metrics.clicked.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Converted</Text>
                          <Text style={[styles.metricValue, { color: '#7c3aed' }]}>
                            {campaign.metrics.converted.toLocaleString()}
                          </Text>
                          <Text style={styles.metricPercentage}>
                            {calculateConversionRate(campaign)}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <View style={styles.emptyState}>
            <Send size={48} color="#D1D5DB" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>
              No campaigns found
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === 'all' 
                ? 'Create your first health campaign to engage employees'
                : `No ${selectedTab} campaigns at the moment`}
            </Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              style={styles.emptyActionButton}
            >
              <Text style={styles.emptyActionText}>Create Campaign</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsList}>
            <TouchableOpacity style={styles.quickActionItem}>
              <Calendar size={16} color="#3B82F6" />
              <Text style={styles.quickActionText}>Schedule Annual Physical Reminders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Target size={16} color="#3B82F6" />
              <Text style={styles.quickActionText}>Create Wellness Challenge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Users size={16} color="#3B82F6" />
              <Text style={styles.quickActionText}>Benefits Enrollment Reminder</Text>
            </TouchableOpacity>
          
          </View>
        </View>
        
      </ScrollView>
      <EmployerFooter />
    </SafeAreaView>
    
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  tabsWrapper: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  campaignsContainer: {
    gap: 16,
  },
  campaignCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  campaignContent: {
    padding: 16,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignTitleArea: {
    flex: 1,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  campaignMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  typeText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  campaignActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  infoSection: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoTextSecondary: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  frequencyText: {
    textTransform: 'capitalize',
  },
  metricsSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  metricPercentage: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyActionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    color: 'white',
    fontWeight: '500',
  },
  quickActions: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 12,
  },
  quickActionsList: {
    gap: 8,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#1d4ed8',
  },
});