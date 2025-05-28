// src/app/employer/(tabs)/programs.tsx
import { useRouter } from 'expo-router';
import {
  Activity,
  ArrowRight,
  Award,
  Play,
  Plus,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import Card from '../../../components/Common/ui/Card';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

const ProgramsHub = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const programSections = [
    {
      id: 'challenges',
      title: 'Challenges Management',
      description: 'Create and manage company-wide health challenges',
      icon: Target,
      route: '/employer/program/challenges',
      stats: {
        active: 4,
        upcoming: 2,
        participants: 328,
        completion: '68%'
      },
      color: '#3b82f6'
    },
    {
      id: 'incentives',
      title: 'Rewards & Incentives',
      description: 'Manage reward programs and point-based incentives',
      icon: Award,
      route: '/employer/program/incentives',
      stats: {
        active: 8,
        claimed: 245,
        totalValue: '$55,400',
        avgRedemption: '76%'
      },
      color: '#8b5cf6'
    },
    {
      id: 'wellness',
      title: 'Wellness Programs',
      description: 'Oversee comprehensive wellness initiatives and campaigns',
      icon: Activity,
      route: '/employer/program/wellness',
      stats: {
        programs: 6,
        engagement: '82%',
        sessions: 124,
        satisfaction: '4.7/5'
      },
      color: '#10b981'
    }
  ];

  const activeChallenges = [
    {
      id: 1,
      name: 'Annual Physical Challenge',
      participants: 256,
      totalEmployees: 412,
      endDate: '2025-05-31',
      status: 'In Progress',
      progress: 0.62
    },
    {
      id: 2,
      name: 'Preventative Screening Challenge',
      participants: 198,
      totalEmployees: 412,
      endDate: '2025-06-15',
      status: 'In Progress',
      progress: 0.48
    }
  ];

  const quickStats = {
    totalParticipants: 328,
    totalEmployees: 412,
    activeChallenges: 4,
    rewardsClaimedThisMonth: 245,
    engagementRate: 82
  };

  const navigateToSection = (route) => {
    router.push(route);
  };

  const participationRate = (quickStats.totalParticipants / quickStats.totalEmployees) * 100;

  return (
    <View style={styles.container}>
      <Header title="Programs" />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Program Management</Text>
          <Text style={styles.pageSubtitle}>
            Manage wellness challenges, incentives, and health programs
          </Text>
        </View>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Program Overview</Text>
          
          <View style={styles.participationSection}>
            <View style={styles.participationHeader}>
              <Users size={24} color="#3b82f6" />
              <View style={styles.participationInfo}>
                <Text style={styles.participationValue}>
                  {quickStats.totalParticipants}/{quickStats.totalEmployees}
                </Text>
                <Text style={styles.participationLabel}>Active Participants</Text>
              </View>
              <Text style={styles.participationPercent}>{Math.round(participationRate)}%</Text>
            </View>
            <ProgressBar progress={participationRate / 100} color="#3b82f6" />
          </View>

          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{quickStats.activeChallenges}</Text>
              <Text style={styles.quickStatLabel}>Active Challenges</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{quickStats.rewardsClaimedThisMonth}</Text>
              <Text style={styles.quickStatLabel}>Rewards Claimed</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{quickStats.engagementRate}%</Text>
              <Text style={styles.quickStatLabel}>Engagement Rate</Text>
            </View>
          </View>
        </Card>

        {/* Program Sections */}
        <Text style={styles.sectionTitle}>Program Modules</Text>
        
        {programSections.map((section) => {
          const IconComponent = section.icon;
          
          return (
            <TouchableOpacity
              key={section.id}
              onPress={() => navigateToSection(section.route)}
              style={styles.sectionCard}
            >
              <Card>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                    <IconComponent size={24} color={section.color} />
                  </View>
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionDescription}>{section.description}</Text>
                  </View>
                  <ArrowRight size={20} color="#666" />
                </View>
                
                <View style={styles.sectionStats}>
                  {Object.entries(section.stats).map(([key, value], index) => (
                    <View key={key} style={styles.sectionStatItem}>
                      <Text style={[styles.sectionStatValue, { color: section.color }]}>
                        {value}
                      </Text>
                      <Text style={styles.sectionStatLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Active Challenges Preview */}
        <View style={styles.activeChallengesSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity onPress={() => navigateToSection('/employer/program/challenges')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {activeChallenges.map((challenge) => (
            <Card key={challenge.id} style={styles.challengePreviewCard}>
              <View style={styles.challengePreviewHeader}>
                <View>
                  <Text style={styles.challengePreviewName}>{challenge.name}</Text>
                  <Text style={styles.challengePreviewDates}>Ends {challenge.endDate}</Text>
                </View>
                <View style={styles.challengePreviewStatus}>
                  <Play size={16} color="#10b981" />
                  <Text style={styles.statusText}>{challenge.status}</Text>
                </View>
              </View>
              
              <View style={styles.challengePreviewStats}>
                <Text style={styles.challengePreviewParticipants}>
                  {challenge.participants}/{challenge.totalEmployees} participants
                </Text>
                <ProgressBar progress={challenge.progress} color="#3b82f6" />
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
              onPress={() => navigateToSection('/employer/program/challenges')}
            >
              <Plus size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>New Challenge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/program/incentives')}
            >
              <Award size={24} color="#8b5cf6" />
              <Text style={styles.quickActionText}>Add Reward</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/program/wellness')}
            >
              <Activity size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Start Program</Text>
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
  participationSection: {
    marginBottom: 20,
  },
  participationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  participationValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  participationLabel: {
    fontSize: 14,
    color: '#666',
  },
  participationPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  sectionStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  activeChallengesSection: {
    marginTop: 24,
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
  challengePreviewCard: {
    marginBottom: 12,
  },
  challengePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengePreviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  challengePreviewDates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  challengePreviewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  challengePreviewStats: {
    marginBottom: 8,
  },
  challengePreviewParticipants: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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

export default ProgramsHub;