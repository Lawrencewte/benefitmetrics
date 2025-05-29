// src/app/employer/(tabs)/communications.tsx
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Clock,
  Eye,
  FileText,
  Megaphone,
  Plus,
  Send,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';



const CommunicationsHub = () => {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const communicationModules = [
    {
      id: 'announcements',
      title: 'Company Announcements',
      description: 'Create and manage company-wide health announcements',
      icon: Megaphone,
      route: '/employer/communications/announcements',
      stats: {
        active: 3,
        scheduled: 2,
        avgOpen: '84%',
        lastSent: '2 days ago'
      },
      color: '#3b82f6'
    },
    {
      id: 'campaigns',
      title: 'Health Campaigns',
      description: 'Launch targeted health and wellness campaigns',
      icon: Target,
      route: '/employer/communications/campaigns',
      stats: {
        active: 5,
        participants: 267,
        engagement: '76%',
        conversions: '23%'
      },
      color: '#10b981'
    },
    {
      id: 'templates',
      title: 'Message Templates',
      description: 'Manage reusable templates for common communications',
      icon: FileText,
      route: '/employer/communications/templates',
      stats: {
        templates: 24,
        categories: 6,
        mostUsed: 'Reminder',
        usage: '12 this week'
      },
      color: '#8b5cf6'
    }
  ];

  const recentCommunications = [
    {
      id: 1,
      type: 'announcement',
      title: 'Annual Physical Reminder',
      audience: 'All Employees',
      status: 'Sent',
      sentDate: '2025-05-26',
      openRate: '87%',
      engagement: 'High'
    },
    {
      id: 2,
      type: 'campaign',
      title: 'Skin Cancer Awareness Campaign',
      audience: 'Employees 40+',
      status: 'Active',
      startDate: '2025-05-20',
      participants: 156,
      engagement: 'Medium'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Benefits Deadline Reminder',
      audience: 'Non-participants',
      status: 'Scheduled',
      scheduledDate: '2025-05-30',
      estimatedReach: 84,
      engagement: 'Pending'
    }
  ];

  const communicationStats = {
    totalSent: 47,
    avgOpenRate: '82%',
    avgEngagement: '76%',
    activeSubscribers: 389,
    unsubscribes: 3,
    responseRate: '15%'
  };

  const upcomingCommunications = [
    {
      id: 1,
      title: 'Monthly Wellness Newsletter',
      type: 'Newsletter',
      scheduledDate: '2025-06-01',
      audience: 'All Employees',
      status: 'Ready'
    },
    {
      id: 2,
      title: 'Eye Exam Reminder Campaign',
      type: 'Campaign',
      scheduledDate: '2025-06-05',
      audience: 'Due for Eye Exams',
      status: 'Draft'
    }
  ];

  const channelPerformance = [
    { channel: 'Email', deliveryRate: '98%', openRate: '84%', color: '#3b82f6' },
    { channel: 'SMS', deliveryRate: '99%', openRate: '92%', color: '#10b981' },
    { channel: 'Push', deliveryRate: '95%', openRate: '76%', color: '#8b5cf6' },
    { channel: 'In-App', deliveryRate: '100%', openRate: '89%', color: '#f59e0b' }
  ];

  const navigateToSection = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Header title="Communications" />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Communications Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Manage announcements, campaigns, and employee communications
          </Text>
        </View>

        {/* Communication Stats Overview */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Communication Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Send size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{communicationStats.totalSent}</Text>
              <Text style={styles.statLabel}>Messages Sent</Text>
              <Text style={styles.statPeriod}>This month</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={24} color="#10b981" />
              <Text style={styles.statValue}>{communicationStats.avgOpenRate}</Text>
              <Text style={styles.statLabel}>Avg Open Rate</Text>
              <Text style={styles.statPeriod}>Last 30 days</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{communicationStats.avgEngagement}</Text>
              <Text style={styles.statLabel}>Engagement</Text>
              <Text style={styles.statPeriod}>This month</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{communicationStats.activeSubscribers}</Text>
              <Text style={styles.statLabel}>Active Subscribers</Text>
              <Text style={styles.statPeriod}>Total</Text>
            </View>
          </View>
        </Card>

        {/* Communication Modules */}
        <Text style={styles.sectionTitle}>Communication Tools</Text>
        
        {communicationModules.map((module) => {
          const IconComponent = module.icon;
          
          return (
            <TouchableOpacity
              key={module.id}
              onPress={() => navigateToSection(module.route)}
              style={styles.moduleCard}
            >
              <Card>
                <View style={styles.moduleHeader}>
                  <View style={[styles.moduleIcon, { backgroundColor: `${module.color}20` }]}>
                    <IconComponent size={24} color={module.color} />
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                  </View>
                  <ArrowRight size={20} color="#666" />
                </View>
                
                <View style={styles.moduleStats}>
                  {Object.entries(module.stats).map(([key, value], index) => (
                    <View key={key} style={styles.moduleStatItem}>
                      <Text style={[styles.moduleStatValue, { color: module.color }]}>
                        {value}
                      </Text>
                      <Text style={styles.moduleStatLabel}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Channel Performance */}
        <View style={styles.channelSection}>
          <Text style={styles.sectionTitle}>Channel Performance</Text>
          
          {channelPerformance.map((channel) => (
            <Card key={channel.channel} style={styles.channelCard}>
              <View style={styles.channelHeader}>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelName}>{channel.channel}</Text>
                  <View style={styles.channelMetrics}>
                    <Text style={styles.channelMetric}>
                      Delivery: <Text style={styles.channelValue}>{channel.deliveryRate}</Text>
                    </Text>
                    <Text style={styles.channelMetric}>
                      Open: <Text style={styles.channelValue}>{channel.openRate}</Text>
                    </Text>
                  </View>
                </View>
                <View style={[styles.channelIndicator, { backgroundColor: channel.color }]} />
              </View>
            </Card>
          ))}
        </View>

        {/* Recent Communications */}
        <View style={styles.recentSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Recent Communications</Text>
            <TouchableOpacity onPress={() => console.log('View all communications')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentCommunications.map((comm) => (
            <Card key={comm.id} style={styles.commCard}>
              <View style={styles.commHeader}>
                <View>
                  <Text style={styles.commTitle}>{comm.title}</Text>
                  <Text style={styles.commAudience}>To: {comm.audience}</Text>
                </View>
                <View style={[
                  styles.commStatusBadge,
                  comm.status === 'Sent' && styles.sentBadge,
                  comm.status === 'Active' && styles.activeBadge,
                  comm.status === 'Scheduled' && styles.scheduledBadge
                ]}>
                  <Text style={[
                    styles.commStatusText,
                    comm.status === 'Sent' && styles.sentText,
                    comm.status === 'Active' && styles.activeText,
                    comm.status === 'Scheduled' && styles.scheduledText
                  ]}>
                    {comm.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.commStats}>
                {comm.openRate && (
                  <Text style={styles.commStat}>Open Rate: {comm.openRate}</Text>
                )}
                {comm.participants && (
                  <Text style={styles.commStat}>Participants: {comm.participants}</Text>
                )}
                {comm.estimatedReach && (
                  <Text style={styles.commStat}>Est. Reach: {comm.estimatedReach}</Text>
                )}
                <Text style={styles.commDate}>
                  {comm.sentDate && `Sent: ${comm.sentDate}`}
                  {comm.startDate && `Started: ${comm.startDate}`}
                  {comm.scheduledDate && `Scheduled: ${comm.scheduledDate}`}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Upcoming Communications */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Communications</Text>
          
          {upcomingCommunications.map((comm) => (
            <Card key={comm.id} style={styles.upcomingCard}>
              <View style={styles.upcomingHeader}>
                <View>
                  <Text style={styles.upcomingTitle}>{comm.title}</Text>
                  <Text style={styles.upcomingDetails}>
                    {comm.type} • {comm.audience}
                  </Text>
                </View>
                <View style={styles.upcomingDate}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.upcomingDateText}>{comm.scheduledDate}</Text>
                </View>
              </View>
              
              <View style={styles.upcomingActions}>
                <Button
                  title="Edit"
                  variant="outline"
                  onPress={() => console.log(`Edit communication ${comm.id}`)}
                  style={styles.upcomingButton}
                />
                <Button
                  title="Send Now"
                  variant="primary"
                  onPress={() => console.log(`Send communication ${comm.id}`)}
                  style={styles.upcomingButton}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/communications/announcements')}
            >
              <Plus size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>New Announcement</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/communications/campaigns')}
            >
              <Target size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Start Campaign</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/communications/templates')}
            >
              <FileText size={24} color="#8b5cf6" />
              <Text style={styles.quickActionText}>Create Template</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => console.log('View analytics')}
            >
              <TrendingUp size={24} color="#f59e0b" />
              <Text style={styles.quickActionText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
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
  statsCard: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  statPeriod: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
  moduleCard: {
    marginBottom: 16,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  moduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moduleStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  moduleStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moduleStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  channelSection: {
    marginBottom: 24,
  },
  channelCard: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  channelMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  channelMetric: {
    fontSize: 12,
    color: '#666',
  },
  channelValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  channelIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  commCard: {
    marginBottom: 12,
  },
  commHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  commTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commAudience: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  commStatusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  sentBadge: { backgroundColor: '#dcfce7' },
  activeBadge: { backgroundColor: '#dbeafe' },
  scheduledBadge: { backgroundColor: '#fef3c7' },
  commStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sentText: { color: '#10b981' },
  activeText: { color: '#3b82f6' },
  scheduledText: { color: '#f59e0b' },
  commStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  commStat: {
    fontSize: 12,
    color: '#666',
  },
  commDate: {
    fontSize: 12,
    color: '#999',
  },
  upcomingSection: {
    marginBottom: 24,
  },
  upcomingCard: {
    marginBottom: 12,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  upcomingDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  upcomingDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingDateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  upcomingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  upcomingButton: {
    flex: 1,
  },
  quickActionsSection: {
    marginBottom: 32,
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
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CommunicationsHub;