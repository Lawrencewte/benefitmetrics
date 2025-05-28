import { AlertTriangle, Calendar, DollarSign, Download, RefreshCw, Target, TrendingUp, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BenefitsOptimizationData {
  totalBenefitsValue: number;
  utilizedValue: number;
  unutilizedValue: number;
  utilizationRate: number;
  potentialSavings: number;
  yearOverYearChange: number;
  expiringSoon: {
    benefitType: string;
    value: number;
    expirationDate: string;
    affectedEmployees: number;
  }[];
  underutilizedServices: {
    service: string;
    utilizationRate: number;
    potentialValue: number;
    recommendedActions: string[];
    priority: 'high' | 'medium' | 'low';
  }[];
  departmentBreakdown: {
    department: string;
    utilizationRate: number;
    opportunity: number;
    topUnusedBenefit: string;
  }[];
  monthlyTrends: {
    month: string;
    utilization: number;
    savings: number;
    newInitiatives: number;
  }[];
}

interface BenefitsOptimizationDashboardProps {
  data: BenefitsOptimizationData;
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'xlsx') => void;
  onViewDetails?: (type: string, id: string) => void;
}

export const BenefitsOptimizationDashboard: React.FC<BenefitsOptimizationDashboardProps> = ({
  data,
  onRefresh,
  onExport,
  onViewDetails
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Benefits Optimization</Text>
          <Text style={styles.subtitle}>Maximize your benefits investment ROI</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
            <RefreshCw size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onExport?.('xlsx')}>
            <Download size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <DollarSign size={24} color="#10B981" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{formatCurrency(data.potentialSavings)}</Text>
            <Text style={styles.metricLabel}>Potential Savings</Text>
            <Text style={[styles.metricChange, { color: '#10B981' }]}>
              ↑ {formatCurrency(data.yearOverYearChange)}
            </Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Target size={24} color="#3B82F6" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{formatPercentage(data.utilizationRate)}</Text>
            <Text style={styles.metricLabel}>Utilization Rate</Text>
            <Text style={styles.metricSubtext}>
              {formatCurrency(data.utilizedValue)} of {formatCurrency(data.totalBenefitsValue)}
            </Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <AlertTriangle size={24} color="#F59E0B" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{formatCurrency(data.unutilizedValue)}</Text>
            <Text style={styles.metricLabel}>Unutilized Value</Text>
            <Text style={styles.metricSubtext}>Opportunity for improvement</Text>
          </View>
        </View>
      </View>

      {/* Benefits Expiring Soon */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Benefits Expiring Soon</Text>
          <TouchableOpacity onPress={() => onViewDetails?.('expiring', 'all')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {data.expiringSoon.map((benefit, index) => (
          <View key={index} style={styles.expiringBenefitCard}>
            <View style={styles.expiringBenefitHeader}>
              <Text style={styles.expiringBenefitType}>{benefit.benefitType}</Text>
              <View style={styles.urgencyBadge}>
                <Calendar size={12} color="#EF4444" />
                <Text style={styles.urgencyText}>{benefit.expirationDate}</Text>
              </View>
            </View>
            
            <View style={styles.expiringBenefitDetails}>
              <Text style={styles.expiringBenefitValue}>
                {formatCurrency(benefit.value)} at risk
              </Text>
              <Text style={styles.expiringBenefitEmployees}>
                {benefit.affectedEmployees} employees affected
              </Text>
            </View>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Send Reminder</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Underutilized Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Underutilized Services</Text>
        
        {data.underutilizedServices.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceName}>{service.service}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(service.priority) }]}>
                <Text style={styles.priorityText}>{service.priority.toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={styles.serviceMetrics}>
              <View style={styles.serviceMetric}>
                <Text style={styles.serviceMetricValue}>{formatPercentage(service.utilizationRate)}</Text>
                <Text style={styles.serviceMetricLabel}>Current Usage</Text>
              </View>
              <View style={styles.serviceMetric}>
                <Text style={styles.serviceMetricValue}>{formatCurrency(service.potentialValue)}</Text>
                <Text style={styles.serviceMetricLabel}>Potential Value</Text>
              </View>
            </View>
            
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommended Actions:</Text>
              {service.recommendedActions.map((action, actionIndex) => (
                <View key={actionIndex} style={styles.recommendationItem}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Department Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Department Analysis</Text>
        
        <View style={styles.departmentGrid}>
          {data.departmentBreakdown.map((dept, index) => (
            <View key={index} style={styles.departmentCard}>
              <Text style={styles.departmentName}>{dept.department}</Text>
              
              <View style={styles.departmentMetrics}>
                <View style={styles.departmentMetric}>
                  <Text style={styles.departmentMetricValue}>
                    {formatPercentage(dept.utilizationRate)}
                  </Text>
                  <Text style={styles.departmentMetricLabel}>Utilization</Text>
                </View>
                
                <View style={styles.departmentMetric}>
                  <Text style={[
                    styles.departmentMetricValue,
                    { color: dept.opportunity > 10000 ? '#EF4444' : '#10B981' }
                  ]}>
                    {formatCurrency(dept.opportunity)}
                  </Text>
                  <Text style={styles.departmentMetricLabel}>Opportunity</Text>
                </View>
              </View>
              
              <Text style={styles.departmentInsight}>
                Top unused: {dept.topUnusedBenefit}
              </Text>
              
              <TouchableOpacity 
                style={styles.departmentAction}
                onPress={() => onViewDetails?.('department', dept.department)}
              >
                <Text style={styles.departmentActionText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Utilization Trends */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Utilization Trends</Text>
          <View style={styles.timeframeSelector}>
            {(['1m', '3m', '6m', '1y'] as const).map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.timeframeButtonText,
                  selectedTimeframe === timeframe && styles.timeframeButtonTextActive
                ]}>
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.trendsContainer}>
          {data.monthlyTrends.map((trend, index) => (
            <View key={index} style={styles.trendItem}>
              <Text style={styles.trendMonth}>{trend.month}</Text>
              <View style={styles.trendMetrics}>
                <Text style={styles.trendMetric}>
                  {formatPercentage(trend.utilization)}
                </Text>
                <Text style={styles.trendMetric}>
                  {formatCurrency(trend.savings)}
                </Text>
                <Text style={styles.trendMetric}>
                  {trend.newInitiatives} initiatives
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Actions</Text>
        
        <View style={styles.actionsList}>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Users size={20} color="#3B82F6" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Launch Awareness Campaign</Text>
              <Text style={styles.actionDescription}>
                Target departments with low utilization rates
              </Text>
              <Text style={styles.actionImpact}>Potential impact: +15% utilization</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Calendar size={20} color="#F59E0B" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Schedule Benefit Reminders</Text>
              <Text style={styles.actionDescription}>
                Automated reminders for expiring benefits
              </Text>
              <Text style={styles.actionImpact}>Prevent ${formatCurrency(data.expiringSoon.reduce((sum, b) => sum + b.value, 0))} loss</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Setup</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Optimize Benefits Mix</Text>
              <Text style={styles.actionDescription}>
                Review and adjust benefits offerings
              </Text>
              <Text style={styles.actionImpact}>Est. ROI: 25%</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricIcon: {
    marginBottom: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  expiringBenefitCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  expiringBenefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expiringBenefitType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  urgencyText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 4,
  },
  expiringBenefitDetails: {
    marginBottom: 12,
  },
  expiringBenefitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 2,
  },
  expiringBenefitEmployees: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  serviceMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  serviceMetric: {
    flex: 1,
  },
  serviceMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  serviceMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  recommendationBullet: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    lineHeight: 16,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  departmentCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  departmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  departmentMetrics: {
    marginBottom: 12,
  },
  departmentMetric: {
    marginBottom: 8,
  },
  departmentMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  departmentMetricLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  departmentInsight: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  departmentAction: {
    backgroundColor: '#EBF4FF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  departmentActionText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeframeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeframeButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeframeButtonTextActive: {
    color: '#374151',
  },
  trendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendItem: {
    flex: 1,
    alignItems: 'center',
  },
  trendMonth: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  trendMetrics: {
    alignItems: 'center',
  },
  trendMetric: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 2,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIcon: {
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  actionImpact: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
});