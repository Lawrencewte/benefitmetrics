import Footer from '@/src/components/Common/layout/Footer';
import { Award, ChevronDown, ChevronUp, DollarSign, Info, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ROITrackerPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Mock data - completely safe arrays
  const roiData = {
    totalSavings: 2210,
    monthlyIncrease: 125,
    completedCare: 3,
    totalCareItems: 5,
    benefitsUtilization: 78,
    companyComparison: 15,
    percentile: 25
  };

  const savingsBreakdown = [
    {
      category: 'Preventative Care',
      description: 'Annual physical, screenings completed',
      amount: 1850
    },
    {
      category: 'Premium Discounts',
      description: 'Health insurance premium reduction',
      amount: 360
    },
    {
      category: 'Early Detection Value',
      description: 'Potential cost avoidance',
      amount: 0
    }
  ];

  const projectedSavings = {
    additionalSavings: 450,
    opportunities: [
      {
        action: 'Complete dental cleaning',
        timeline: 'Next 30 days',
        savings: 225
      },
      {
        action: 'Schedule eye exam',
        timeline: 'Next 60 days',
        savings: 175
      },
      {
        action: 'Join wellness challenge',
        timeline: 'Ongoing',
        savings: 50
      }
    ]
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>ROI Tracker</Text>
            <Text style={styles.subtitle}>
              See the financial impact of your preventative healthcare
            </Text>
          </View>

          {/* Total Savings Card */}
          <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <DollarSign size={24} color="white" />
              <Text style={styles.savingsLabel}>Total Savings</Text>
            </View>
            <Text style={styles.savingsAmount}>${roiData.totalSavings.toLocaleString()}</Text>
            <View style={styles.savingsTrend}>
              <TrendingUp size={16} color="white" />
              <Text style={styles.savingsTrendText}>
                +${roiData.monthlyIncrease} this month
              </Text>
            </View>
          </View>

          {/* Savings Breakdown */}
          <View style={styles.card}>
            <Pressable
              onPress={() => toggleSection('breakdown')}
              style={styles.cardHeader}
            >
              <Text style={styles.cardTitle}>Savings Breakdown</Text>
              {expandedSection === 'breakdown' ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </Pressable>
            
            {expandedSection === 'breakdown' && (
              <View style={styles.cardContent}>
                {savingsBreakdown.map((item, index) => {
                  const isLast = index === savingsBreakdown.length - 1;
                  return (
                    <View key={index} style={[styles.breakdownItem, isLast && styles.lastItem]}>
                      <View style={styles.breakdownInfo}>
                        <Text style={styles.breakdownCategory}>{item.category}</Text>
                        <Text style={styles.breakdownDescription}>{item.description}</Text>
                      </View>
                      <Text style={styles.breakdownAmount}>${item.amount.toLocaleString()}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* This Year's Progress */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>This Year's Progress</Text>
              
              <View style={styles.progressSection}>
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Preventative Care Completed</Text>
                    <Text style={styles.progressValue}>
                      {roiData.completedCare}/{roiData.totalCareItems}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        styles.progressBlue,
                        { width: `${(roiData.completedCare / roiData.totalCareItems) * 100}%` }
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Insurance Benefits Used</Text>
                    <Text style={styles.progressValue}>{roiData.benefitsUtilization}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        styles.progressGreen,
                        { width: `${roiData.benefitsUtilization}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Projected Savings */}
          <View style={styles.card}>
            <Pressable
              onPress={() => toggleSection('projected')}
              style={styles.cardHeader}
            >
              <Text style={styles.cardTitle}>Projected Future Savings</Text>
              {expandedSection === 'projected' ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </Pressable>
            
            {expandedSection === 'projected' && (
              <View style={styles.cardContent}>
                <View style={styles.projectedCard}>
                  <Text style={styles.projectedLabel}>
                    Complete remaining preventative care to unlock:
                  </Text>
                  <Text style={styles.projectedAmount}>
                    ${projectedSavings.additionalSavings.toLocaleString()}
                  </Text>
                </View>
                
                {projectedSavings.opportunities.map((opportunity, index) => {
                  const isLast = index === projectedSavings.opportunities.length - 1;
                  return (
                    <View key={index} style={[styles.opportunityItem, isLast && styles.lastItem]}>
                      <View style={styles.opportunityInfo}>
                        <Text style={styles.opportunityAction}>{opportunity.action}</Text>
                        <Text style={styles.opportunityTimeline}>{opportunity.timeline}</Text>
                      </View>
                      <Text style={styles.opportunitySavings}>+${opportunity.savings}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Company Comparison */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.comparisonHeader}>
                <Award size={20} color="#6B7280" />
                <Text style={styles.cardTitle}>Company Comparison</Text>
              </View>
              
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonSubtitle}>
                  Your savings vs. company average
                </Text>
                <Text style={styles.comparisonPercentage}>
                  +{roiData.companyComparison}% above average
                </Text>
                <Text style={styles.comparisonNote}>
                  You're in the top {roiData.percentile}% of employees
                </Text>
              </View>
            </View>
          </View>

          {/* Info Footer */}
          <View style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Info size={16} color="#3B82F6" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>
                  ROI calculations include direct cost savings, premium discounts, 
                  and estimated future healthcare cost avoidance through early detection 
                  and prevention.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  savingsCard: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
  savingsAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  savingsTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsTrendText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  breakdownDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressSection: {
    marginTop: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  progressValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressBlue: {
    backgroundColor: '#3B82F6',
  },
  progressGreen: {
    backgroundColor: '#10B981',
  },
  projectedCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  projectedLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  projectedAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  opportunityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  opportunityInfo: {
    flex: 1,
  },
  opportunityAction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  opportunityTimeline: {
    fontSize: 14,
    color: '#6B7280',
  },
  opportunitySavings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  comparisonCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  comparisonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  comparisonPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 8,
  },
  comparisonNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});