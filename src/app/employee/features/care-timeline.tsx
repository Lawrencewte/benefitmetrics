import { AlertCircle, ArrowRight, Calendar, CheckCircle, Clock, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'upcoming' | 'overdue';
  dueDate: string;
  provider?: string;
  benefits?: string;
}

interface NextBestAction {
  title: string;
  description: string;
  healthScoreImpact: number;
}

interface OptimizationSuggestions {
  message: string;
}

export default function CareTimelinePage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

  // Mock data to prevent undefined errors
  const timelineData: TimelineItem[] = [
    {
      id: '1',
      title: 'Annual Physical Exam',
      description: 'Comprehensive health checkup including blood work',
      status: 'upcoming',
      dueDate: 'June 15, 2025',
      provider: 'Dr. Martinez',
      benefits: 'Covered 100% by your health plan'
    },
    {
      id: '2',
      title: 'Dental Cleaning',
      description: 'Routine dental cleaning and oral health check',
      status: 'completed',
      dueDate: 'May 1, 2025',
      provider: 'Dr. Wong',
      benefits: 'Covered 100% by your dental plan'
    },
    {
      id: '3',
      title: 'Eye Exam',
      description: 'Annual vision screening and eye health assessment',
      status: 'overdue',
      dueDate: 'April 30, 2025',
      provider: 'Vision Center',
      benefits: 'Covered 80% by your vision plan'
    }
  ];

  const nextBestAction: NextBestAction = {
    title: 'Schedule your overdue eye exam',
    description: 'Your annual eye exam is past due. Scheduling now will help maintain your vision health and boost your health score.',
    healthScoreImpact: 12
  };

  const optimizationSuggestions: OptimizationSuggestions = {
    message: 'Your care schedule has been optimized to fit your work calendar and maximize your benefits before year-end.'
  };

  const isLoading = false;

  const filterItems = () => {
    if (!timelineData) return [];
    
    switch (selectedFilter) {
      case 'upcoming':
        return timelineData.filter(item => item.status === 'upcoming');
      case 'overdue':
        return timelineData.filter(item => item.status === 'overdue');
      default:
        return timelineData;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return [styles.statusBadge, styles.completedBadge];
      case 'upcoming':
        return [styles.statusBadge, styles.upcomingBadge];
      case 'overdue':
        return [styles.statusBadge, styles.overdueBadge];
      default:
        return [styles.statusBadge, styles.defaultBadge];
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.completedText;
      case 'upcoming':
        return styles.upcomingText;
      case 'overdue':
        return styles.overdueText;
      default:
        return styles.defaultText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#16A34A" />;
      case 'overdue':
        return <AlertCircle size={16} color="#DC2626" />;
      default:
        return <Clock size={16} color="#3B82F6" />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your care timeline...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Care Timeline</Text>
          <Text style={styles.subtitle}>
            Your optimized preventative care schedule
          </Text>
        </View>

        {/* AI Optimization Banner */}
        {optimizationSuggestions && (
          <View style={styles.optimizationBanner}>
            <View style={styles.optimizationHeader}>
              <Sparkles size={20} color="white" />
              <Text style={styles.optimizationTitle}>AI-Optimized Schedule</Text>
            </View>
            <Text style={styles.optimizationMessage}>
              {optimizationSuggestions.message}
            </Text>
            <Pressable style={styles.optimizationButton}>
              <Text style={styles.optimizationButtonText}>
                View Optimization Details
              </Text>
            </Pressable>
          </View>
        )}

        {/* Next Best Action */}
        {nextBestAction && (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.nextActionHeader}>
                <ArrowRight size={20} color="#3B82F6" />
                <Text style={styles.nextActionTitle}>Next Best Action</Text>
              </View>
              
              <View style={styles.nextActionCard}>
                <Text style={styles.nextActionCardTitle}>
                  {nextBestAction.title}
                </Text>
                <Text style={styles.nextActionDescription}>
                  {nextBestAction.description}
                </Text>
                <View style={styles.nextActionFooter}>
                  <Text style={styles.impactText}>
                    Impact: +{nextBestAction.healthScoreImpact} health score points
                  </Text>
                  <Pressable style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>Schedule Now</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'All Items' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'overdue', label: 'Overdue' }
          ].map((filter) => (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.activeFilterTab
              ]}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Timeline Items */}
        <View style={styles.timelineList}>
          {filterItems().map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineItemContent}>
                <View style={styles.timelineItemHeader}>
                  <View style={styles.timelineItemInfo}>
                    <Text style={styles.timelineItemTitle}>
                      {item.title}
                    </Text>
                    <Text style={styles.timelineItemDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={getStatusStyle(item.status)}>
                    {getStatusIcon(item.status)}
                    <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItemDetails}>
                  <View style={styles.dateContainer}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.dateText}>
                      {item.dueDate}
                    </Text>
                  </View>
                  
                  {item.provider && (
                    <Text style={styles.providerText}>
                      {item.provider}
                    </Text>
                  )}
                </View>

                {item.benefits && (
                  <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitsText}>
                      <Text style={styles.benefitsLabel}>Benefits:</Text> {item.benefits}
                    </Text>
                  </View>
                )}

                {item.status !== 'completed' && (
                  <View style={styles.actionButtons}>
                    <Pressable style={styles.primaryActionButton}>
                      <Text style={styles.primaryActionButtonText}>
                        Schedule
                      </Text>
                    </Pressable>
                    <Pressable style={styles.secondaryActionButton}>
                      <Text style={styles.secondaryActionButtonText}>
                        Learn More
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Benefits Summary */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.benefitsSummaryTitle}>Your Benefits Coverage</Text>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitLabel}>Preventative Care Coverage</Text>
                <Text style={styles.benefitValueGreen}>100%</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitLabel}>Annual Wellness Fund</Text>
                <Text style={styles.benefitValue}>$500 remaining</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitLabel}>Benefits Year Ends</Text>
                <Text style={styles.benefitValueOrange}>Dec 31, 2025</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  optimizationBanner: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  optimizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optimizationTitle: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  optimizationMessage: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  optimizationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
  },
  optimizationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    padding: 16,
  },
  nextActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextActionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
  },
  nextActionCardTitle: {
    fontWeight: '500',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  nextActionDescription: {
    color: '#1D4ED8',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  nextActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: '#2563EB',
  },
  filterTabText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: 'white',
  },
  timelineList: {
    gap: 16,
  },
  timelineItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timelineItemContent: {
    padding: 16,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timelineItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  timelineItemTitle: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 18,
    marginBottom: 4,
  },
  timelineItemDescription: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
  },
  upcomingBadge: {
    backgroundColor: '#DBEAFE',
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
  },
  defaultBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  completedText: {
    color: '#059669',
  },
  upcomingText: {
    color: '#2563EB',
  },
  overdueText: {
    color: '#DC2626',
  },
  defaultText: {
    color: '#6B7280',
  },
  timelineItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14,
    marginLeft: 4,
  },
  providerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  benefitsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: '#374151',
  },
  benefitsLabel: {
    fontWeight: '500',
  },
  actionButtons: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryActionButtonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  secondaryActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  secondaryActionButtonText: {
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  benefitsSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  benefitLabel: {
    color: '#6B7280',
  },
  benefitValue: {
    fontWeight: '500',
  },
  benefitValueGreen: {
    fontWeight: '500',
    color: '#059669',
  },
  benefitValueOrange: {
    fontWeight: '500',
    color: '#EA580C',
  },
});