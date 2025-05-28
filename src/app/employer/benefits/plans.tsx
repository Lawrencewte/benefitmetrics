import { DollarSign, Edit, Eye, Heart, Plus, Shield, Sparkles, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

interface BenefitsPlan {
  id: string;
  name: string;
  type: 'medical' | 'dental' | 'vision' | 'mental_health';
  provider: string;
  isActive: boolean;
  enrollment: {
    enrolled: number;
    eligible: number;
    enrollmentRate: number;
  };
  costs: {
    monthlyPremium: number;
    deductible: number;
    outOfPocketMax: number;
  };
  coverage: {
    preventativeCare: number;
    primaryCare: number;
    specialist: number;
    emergency: number;
  };
  features: string[];
  utilization: {
    claims: number;
    averageClaimAmount: number;
    topServices: Array<{
      service: string;
      usage: number;
    }>;
  };
  satisfaction: {
    rating: number;
    responses: number;
    feedback: string[];
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<BenefitsPlan[]>([
    {
      id: '1',
      name: 'Premium Health Plus',
      type: 'medical',
      provider: 'Blue Cross Blue Shield',
      isActive: true,
      enrollment: {
        enrolled: 387,
        eligible: 412,
        enrollmentRate: 94
      },
      costs: {
        monthlyPremium: 850,
        deductible: 1500,
        outOfPocketMax: 8000
      },
      coverage: {
        preventativeCare: 100,
        primaryCare: 90,
        specialist: 80,
        emergency: 90
      },
      features: [
        '100% Preventative Care',
        'Nationwide Network',
        'Telehealth Included',
        'Prescription Coverage',
        'Mental Health Benefits'
      ],
      utilization: {
        claims: 1847,
        averageClaimAmount: 1250,
        topServices: [
          { service: 'Annual Physical', usage: 324 },
          { service: 'Dental Cleaning', usage: 298 },
          { service: 'Eye Exams', usage: 156 }
        ]
      },
      satisfaction: {
        rating: 4.3,
        responses: 298,
        feedback: [
          'Great coverage for preventative care',
          'Easy to find in-network providers',
          'Quick claim processing'
        ]
      }
    },
    {
      id: '2',
      name: 'Essential Dental',
      type: 'dental',
      provider: 'MetLife',
      isActive: true,
      enrollment: {
        enrolled: 356,
        eligible: 412,
        enrollmentRate: 86
      },
      costs: {
        monthlyPremium: 45,
        deductible: 50,
        outOfPocketMax: 1500
      },
      coverage: {
        preventativeCare: 100,
        primaryCare: 80,
        specialist: 50,
        emergency: 80
      },
      features: [
        'Free Cleanings & Checkups',
        'Orthodontics Coverage',
        'Large Provider Network',
        'No Waiting Period'
      ],
      utilization: {
        claims: 687,
        averageClaimAmount: 185,
        topServices: [
          { service: 'Routine Cleaning', usage: 298 },
          { service: 'Fillings', usage: 89 },
          { service: 'X-rays', usage: 156 }
        ]
      },
      satisfaction: {
        rating: 4.1,
        responses: 234,
        feedback: [
          'Affordable premiums',
          'Good coverage for basic care',
          'Could use more specialist coverage'
        ]
      }
    }
  ]);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getTypeIcon = (type: string) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'medical':
        return <Heart {...iconProps} color="#EF4444" />;
      case 'dental':
        return <Sparkles {...iconProps} color="#3B82F6" />;
      case 'vision':
        return <Eye {...iconProps} color="#10B981" />;
      case 'mental_health':
        return <Shield {...iconProps} color="#8B5CF6" />;
      default:
        return <Shield {...iconProps} color="#6B7280" />;
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'medical':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA' };
      case 'dental':
        return { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' };
      case 'vision':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' };
      case 'mental_health':
        return { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' };
      default:
        return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' };
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'medical':
        return '#991B1B';
      case 'dental':
        return '#1E40AF';
      case 'vision':
        return '#065F46';
      case 'mental_health':
        return '#581C87';
      default:
        return '#374151';
    }
  };

  const filteredPlans = plans.filter(plan => 
    selectedType === 'all' || plan.type === selectedType
  );

  const togglePlanStatus = (planId: string) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, isActive: !plan.isActive }
        : plan
    ));
  };

  const totalEnrolled = plans.reduce((sum, plan) => sum + plan.enrollment.enrolled, 0);
  const averageEnrollmentRate = Math.round(
    plans.reduce((sum, plan) => sum + plan.enrollment.enrollmentRate, 0) / plans.length
  );

  const formatCamelCase = (str: string) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Benefits Plans</Text>
            <Text style={styles.subtitle}>
              Manage and optimize your company's benefit offerings
            </Text>
          </View>
          <Pressable
            onPress={() => setShowCreateModal(true)}
            style={styles.addButton}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Add Plan</Text>
          </Pressable>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Shield size={20} color="#3B82F6" />
              <Text style={styles.summaryLabel}>Total Plans</Text>
            </View>
            <Text style={styles.summaryValue}>{plans.length}</Text>
            <Text style={styles.summarySubtext}>
              {plans.filter(p => p.isActive).length} active
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Users size={20} color="#10B981" />
              <Text style={styles.summaryLabel}>Total Enrolled</Text>
            </View>
            <Text style={[styles.summaryValue, { color: '#059669' }]}>{totalEnrolled}</Text>
            <Text style={styles.summarySubtext}>employees enrolled</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <DollarSign size={20} color="#F59E0B" />
              <Text style={styles.summaryLabel}>Avg Enrollment</Text>
            </View>
            <Text style={[styles.summaryValue, { color: '#D97706' }]}>{averageEnrollmentRate}%</Text>
            <Text style={styles.summarySubtext}>enrollment rate</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
            {[
              { key: 'all', label: 'All Plans' },
              { key: 'medical', label: 'Medical' },
              { key: 'dental', label: 'Dental' },
              { key: 'vision', label: 'Vision' },
              { key: 'mental_health', label: 'Mental Health' }
            ].map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setSelectedType(tab.key)}
                style={[
                  styles.filterTab,
                  selectedType === tab.key && styles.filterTabActive
                ]}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedType === tab.key && styles.filterTabTextActive
                ]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Plans List */}
        <View style={styles.plansList}>
          {filteredPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              {/* Plan Header */}
              <View style={styles.planHeader}>
                <View style={styles.planTitleContainer}>
                  <View style={styles.planTitleRow}>
                    {getTypeIcon(plan.type)}
                    <Text style={styles.planTitle}>{plan.name}</Text>
                    <View style={[styles.typeBadge, getTypeBadgeStyle(plan.type)]}>
                      <Text style={[styles.typeBadgeText, { color: getTypeTextColor(plan.type) }]}>
                        {plan.type.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.planProvider}>{plan.provider}</Text>
                </View>
                
                <View style={styles.planControls}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Active</Text>
                    <Switch
                      value={plan.isActive}
                      onValueChange={() => togglePlanStatus(plan.id)}
                    />
                  </View>
                  <Pressable style={styles.editButton}>
                    <Edit size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>

              {/* Key Metrics */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Enrollment Rate</Text>
                  <Text style={[styles.metricValue, { color: '#2563EB' }]}>
                    {plan.enrollment.enrollmentRate}%
                  </Text>
                  <Text style={styles.metricSubtext}>
                    {plan.enrollment.enrolled}/{plan.enrollment.eligible}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Monthly Premium</Text>
                  <Text style={[styles.metricValue, { color: '#059669' }]}>
                    ${plan.costs.monthlyPremium}
                  </Text>
                  <Text style={styles.metricSubtext}>per employee</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Satisfaction</Text>
                  <Text style={[styles.metricValue, { color: '#D97706' }]}>
                    {plan.satisfaction.rating}/5
                  </Text>
                  <Text style={styles.metricSubtext}>
                    {plan.satisfaction.responses} reviews
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Claims</Text>
                  <Text style={[styles.metricValue, { color: '#7C3AED' }]}>
                    {plan.utilization.claims}
                  </Text>
                  <Text style={styles.metricSubtext}>this year</Text>
                </View>
              </View>

              {/* Coverage Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Coverage</Text>
                <View style={styles.coverageGrid}>
                  {Object.entries(plan.coverage).map(([type, percentage]) => (
                    <View key={type} style={styles.coverageItem}>
                      <View style={styles.coverageHeader}>
                        <Text style={styles.coverageLabel}>
                          {formatCamelCase(type)}
                        </Text>
                        <Text style={styles.coveragePercentage}>{percentage}%</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[styles.progressFill, { width: `${percentage}%` }]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Features */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Features</Text>
                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Top Services */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Most Used Services</Text>
                <View style={styles.servicesList}>
                  {plan.utilization.topServices.map((service, index) => (
                    <View key={index} style={styles.serviceItem}>
                      <Text style={styles.serviceName}>{service.service}</Text>
                      <Text style={styles.serviceUsage}>{service.usage} uses</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Employee Feedback */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Employee Feedback</Text>
                <View style={styles.feedbackList}>
                  {plan.satisfaction.feedback.slice(0, 2).map((feedback, index) => (
                    <View key={index} style={styles.feedbackItem}>
                      <Text style={styles.feedbackText}>"{feedback}"</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable style={[styles.actionButton, styles.primaryButton]}>
                  <Text style={styles.primaryButtonText}>View Details</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Manage Enrollment</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>View Analytics</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Plan Optimization Recommendations</Text>
          <View style={styles.recommendationsList}>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                Consider adding a high-deductible health plan option to provide more choice and potentially reduce costs
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                Mental health coverage utilization is below average - consider employee education campaigns
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                Vision plan enrollment is low at 67% - review coverage options and employee communication
              </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
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
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterContainer: {
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
  filterTabs: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  plansList: {
    gap: 24,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  planProvider: {
    fontSize: 16,
    color: '#6B7280',
  },
  planControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    padding: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  coverageGrid: {
    gap: 16,
  },
  coverageItem: {
    marginBottom: 12,
  },
  coverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  coverageLabel: {
    fontSize: 14,
    color: '#374151',
  },
  coveragePercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#1D4ED8',
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    color: '#374151',
  },
  serviceUsage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  feedbackList: {
    gap: 8,
  },
  feedbackItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  recommendationsContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 12,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginTop: 8,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});