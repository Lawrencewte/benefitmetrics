import { ArrowRight, Award, BarChart2, Calendar, PlusCircle, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import ProgressBar from '../../../components/Common/ui/ProgressBar';
import { getProgramOverview } from '../../../services/employer/programManagement';

// Mock data that matches the expected API structure
const mockProgramData = {
  stats: {
    activeParticipants: 328,
    totalEmployees: 412,
    activeChallengesCount: 4,
    rewardsClaimed: 245,
    engagementRate: 82,
    incentiveUtilization: 76,
    challengeCompletion: 68,
    newParticipants: 42
  },
  activeChallenges: [
    {
      id: 1,
      name: 'Step Challenge',
      participants: 256,
      totalEmployees: 412,
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      status: 'In Progress',
    },
    {
      id: 2,
      name: 'Preventative Screening Challenge',
      participants: 198,
      totalEmployees: 412,
      startDate: '2025-04-15',
      endDate: '2025-06-15',
      status: 'In Progress',
    },
  ],
  upcomingChallenges: [
    {
      id: 3,
      name: 'Hydration Challenge',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      status: 'Scheduled',
    },
    {
      id: 4,
      name: 'Mental Wellness Week',
      startDate: '2025-07-10',
      endDate: '2025-07-17',
      status: 'Scheduled',
    },
  ],
  recentlyAwarded: [
    {
      id: 1,
      name: 'Wellness Day Off',
      recipients: 42,
      date: '2025-05-15',
      pointsRequired: 300,
    },
    {
      id: 2,
      name: 'Fitness Membership Discount',
      recipients: 78,
      date: '2025-05-10',
      pointsRequired: 400,
    },
    {
      id: 3,
      name: 'Health Insurance Premium Discount',
      recipients: 125,
      date: '2025-05-01',
      pointsRequired: 500,
    },
  ]
};

const ProgramOverview = () => {
  const [programData, setProgramData] = useState(mockProgramData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const fetchProgramData = async () => {
    try {
      setIsLoading(true);
      const data = await getProgramOverview();
      setProgramData(data);
      setIsUsingMockData(false);
    } catch (err) {
      console.warn('API failed, using mock data:', err);
      setProgramData(mockProgramData);
      setIsUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Program Overview" />
        <View style={styles.loadingContainer}>
          <Text>Loading program data...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  const { stats, activeChallenges, upcomingChallenges, recentlyAwarded } = programData;

  return (
    <View style={styles.container}>
      <Header title="Program Overview" />
      <ScrollView style={styles.scrollContainer}>
        {/* Show warning banner if using mock data */}
        {isUsingMockData && (
          <Card style={styles.warningBanner}>
            <View style={styles.warningContent}>
              <Text style={styles.warningText}>
                Using sample data - API connection unavailable
              </Text>
              <Button 
                title="Retry" 
                variant="outline" 
                onPress={fetchProgramData}
                style={styles.retryButton}
              />
            </View>
          </Card>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Wellness Program Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Manage your organization's wellness and preventative care initiatives
          </Text>
        </View>

        <View style={styles.quickLinks}>
          <View style={styles.quickLinkCard}>
            <View style={styles.quickLinkIcon}>
              <Calendar size={24} color="#3b82f6" />
            </View>
            <Text style={styles.quickLinkText}>Challenges</Text>
          </View>
          <View style={styles.quickLinkCard}>
            <View style={styles.quickLinkIcon}>
              <Award size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.quickLinkText}>Incentives</Text>
          </View>
          <View style={styles.quickLinkCard}>
            <View style={styles.quickLinkIcon}>
              <BarChart2 size={24} color="#10b981" />
            </View>
            <Text style={styles.quickLinkText}>Wellness</Text>
          </View>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Users size={24} color="#3b82f6" />
              <Text style={styles.summaryValue}>{stats.activeParticipants}/{stats.totalEmployees}</Text>
              <Text style={styles.summaryLabel}>Active Participants</Text>
              <Text style={styles.summaryPercent}>{Math.round((stats.activeParticipants / stats.totalEmployees) * 100)}%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Calendar size={24} color="#3b82f6" />
              <Text style={styles.summaryValue}>{stats.activeChallengesCount}</Text>
              <Text style={styles.summaryLabel}>Active Challenges</Text>
              <Text style={styles.summaryPercent}>2 in progress</Text>
            </View>
            <View style={styles.summaryItem}>
              <Award size={24} color="#3b82f6" />
              <Text style={styles.summaryValue}>{stats.rewardsClaimed}</Text>
              <Text style={styles.summaryLabel}>Rewards Claimed</Text>
              <Text style={styles.summaryPercent}>Last 30 days</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          <Button 
            icon={<PlusCircle size={16} />}
            title="Create Challenge" 
            variant="outline" 
            onPress={() => console.log('Create challenge')}
          />
        </View>

        {activeChallenges.map(challenge => (
          <Card key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <View>
                <Text style={styles.challengeName}>{challenge.name}</Text>
                <Text style={styles.challengeDates}>
                  {challenge.startDate} to {challenge.endDate}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{challenge.status}</Text>
              </View>
            </View>
            
            <Text style={styles.participationLabel}>
              Participation: {challenge.participants}/{challenge.totalEmployees} employees
            </Text>
            <ProgressBar 
              progress={challenge.participants / challenge.totalEmployees} 
              color="#3b82f6" 
            />
            
            <View style={styles.challengeActions}>
              <Button 
                title="View Details" 
                variant="primary" 
                onPress={() => console.log(`View challenge ${challenge.id}`)}
              />
              <Button 
                title="Send Reminder" 
                variant="outline" 
                onPress={() => console.log(`Send reminder for challenge ${challenge.id}`)}
              />
            </View>
          </Card>
        ))}

        <View style={styles.sectionWithLink}>
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
          <View style={styles.sectionLink} onTouchEnd={() => console.log('View all challenges')}>
            <Text style={styles.linkText}>View All</Text>
            <ArrowRight size={16} color="#3b82f6" />
          </View>
        </View>

        {upcomingChallenges.map(challenge => (
          <Card key={challenge.id} style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <View>
                <Text style={styles.upcomingName}>{challenge.name}</Text>
                <Text style={styles.upcomingDates}>
                  {challenge.startDate} to {challenge.endDate}
                </Text>
              </View>
              <View style={[styles.statusBadge, styles.scheduledBadge]}>
                <Text style={[styles.statusText, styles.scheduledText]}>
                  {challenge.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.upcomingActions}>
              <Button 
                title="Edit" 
                variant="outline" 
                onPress={() => console.log(`Edit challenge ${challenge.id}`)}
                style={styles.upcomingButton}
              />
              <Button 
                title="Cancel" 
                variant="outline" 
                onPress={() => console.log(`Cancel challenge ${challenge.id}`)}
                style={styles.upcomingButton}
              />
            </View>
          </Card>
        ))}

        <View style={styles.sectionWithLink}>
          <Text style={styles.sectionTitle}>Recently Awarded Incentives</Text>
          <View style={styles.sectionLink} onTouchEnd={() => console.log('View all incentives')}>
            <Text style={styles.linkText}>View All</Text>
            <ArrowRight size={16} color="#3b82f6" />
          </View>
        </View>

        {recentlyAwarded.map(award => (
          <Card key={award.id} style={styles.awardCard}>
            <View style={styles.awardHeader}>
              <Text style={styles.awardName}>{award.name}</Text>
              <Text style={styles.awardPoints}>{award.pointsRequired} pts</Text>
            </View>
            
            <View style={styles.awardDetails}>
              <Text style={styles.awardRecipients}>
                {award.recipients} recipients
              </Text>
              <Text style={styles.awardDate}>
                Awarded on {award.date}
              </Text>
            </View>
          </Card>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Program Performance</Text>
        </View>

        <Card style={styles.performanceCard}>
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceIconContainer}>
                <TrendingUp size={20} color="#10b981" />
              </View>
              <View>
                <Text style={styles.performanceLabel}>
                  Engagement Rate
                </Text>
                <Text style={styles.performanceValue}>
                  {stats.engagementRate}% <Text style={styles.performanceTrend}>(+5%)</Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.performanceItem}>
              <View style={styles.performanceIconContainer}>
                <Award size={20} color="#10b981" />
              </View>
              <View>
                <Text style={styles.performanceLabel}>
                  Incentive Utilization
                </Text>
                <Text style={styles.performanceValue}>
                  {stats.incentiveUtilization}% <Text style={styles.performanceTrend}>(+8%)</Text>
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceIconContainer}>
                <Calendar size={20} color="#10b981" />
              </View>
              <View>
                <Text style={styles.performanceLabel}>
                  Challenge Completion
                </Text>
                <Text style={styles.performanceValue}>
                  {stats.challengeCompletion}% <Text style={styles.performanceTrend}>(+12%)</Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.performanceItem}>
              <View style={styles.performanceIconContainer}>
                <Users size={20} color="#10b981" />
              </View>
              <View>
                <Text style={styles.performanceLabel}>
                  New Participants
                </Text>
                <Text style={styles.performanceValue}>
                  {stats.newParticipants} <Text style={styles.performanceTrend}>(Last 30 days)</Text>
                </Text>
              </View>
            </View>
          </View>
          
          <Button 
            title="View Detailed Analytics" 
            variant="outline" 
            onPress={() => console.log('View detailed analytics')}
          />
        </Card>
      </ScrollView>
      <EmployerFooter />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBanner: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    marginBottom: 16,
  },
  warningContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningText: {
    color: '#92400e',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    marginLeft: 12,
  },
  headerContainer: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickLinkCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  summaryPercent: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionWithLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  challengeCard: {
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeDates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold',
  },
  participationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  challengeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 16,
    gap: 8,
  },
  upcomingCard: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  upcomingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  upcomingDates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scheduledBadge: {
    backgroundColor: '#dbeafe',
  },
  scheduledText: {
    color: '#3b82f6',
  },
  upcomingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  upcomingButton: {
    flex: 1,
  },
  awardCard: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  awardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  awardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  awardPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  awardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  awardRecipients: {
    fontSize: 14,
    color: '#666',
  },
  awardDate: {
    fontSize: 14,
    color: '#666',
  },
  performanceCard: {
    marginBottom: 24,
    padding: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  performanceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performanceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  performanceTrend: {
    fontSize: 12,
    color: '#10b981',
  },
});

export default ProgramOverview;