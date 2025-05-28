import { AlertTriangle, Check, DollarSign, Lightbulb, Target, TrendingUp, Users } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OptimizationOpportunity {
  id: string;
  category: 'cost-reduction' | 'utilization' | 'satisfaction' | 'compliance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  potentialSavings: number;
  implementationEffort: 'easy' | 'moderate' | 'complex';
  timeframe: string;
  status: 'identified' | 'in-progress' | 'completed' | 'dismissed';
}

interface PlanComparison {
  planName: string;
  currentCost: number;
  utilizationRate: number;
  memberSatisfaction: number;
  recommendedChanges: string[];
  projectedSavings: number;
}

export default function BenefitsOptimization() {
  const [selectedView, setSelectedView] = useState<'opportunities' | 'comparison' | 'recommendations'>('opportunities');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const opportunities: OptimizationOpportunity[] = [
    {
      id: '1',
      category: 'cost-reduction',
      title: 'High-Deductible Health Plan Option',
      description: 'Introduce HDHP with HSA to reduce premium costs for healthy employees',
      impact: 'high',
      potentialSavings: 45000,
      implementationEffort: 'moderate',
      timeframe: '3-6 months',
      status: 'identified'
    },
    {
      id: '2',
      category: 'utilization',
      title: 'Preventative Care Incentives',
      description: 'Increase preventative care completion through targeted incentives',
      impact: 'high',
      potentialSavings: 32000,
      implementationEffort: 'easy',
      timeframe: '1-3 months',
      status: 'in-progress'
    },
    {
      id: '3',
      category: 'satisfaction',
      title: 'Vision Plan Enhancement',
      description: 'Upgrade vision benefits to improve employee satisfaction',
      impact: 'medium',
      potentialSavings: -8000,
      implementationEffort: 'easy',
      timeframe: '1 month',
      status: 'identified'
    },
    {
      id: '4',
      category: 'compliance',
      title: 'Mental Health Parity Review',
      description: 'Ensure mental health benefits meet parity requirements',
      impact: 'high',
      potentialSavings: 0,
      implementationEffort: 'moderate',
      timeframe: '2-4 months',
      status: 'identified'
    },
    {
      id: '5',
      category: 'cost-reduction',
      title: 'Wellness Program ROI Analysis',
      description: 'Optimize wellness program to maximize health outcomes and cost savings',
      impact: 'medium',
      potentialSavings: 28000,
      implementationEffort: 'complex',
      timeframe: '6-12 months',
      status: 'identified'
    }
  ];

  const planComparisons: PlanComparison[] = [
    {
      planName: 'Premium Health Plus',
      currentCost: 89400,
      utilizationRate: 78,
      memberSatisfaction: 4.2,
      recommendedChanges: ['Add telehealth benefits', 'Increase preventative care coverage'],
      projectedSavings: 12000
    },
    {
      planName: 'Dental Care Pro',
      currentCost: 23100,
      utilizationRate: 65,
      memberSatisfaction: 3.8,
      recommendedChanges: ['Expand orthodontic coverage', 'Add cleaning frequency bonus'],
      projectedSavings: 3200
    },
    {
      planName: 'Vision Essentials',
      currentCost: 9360,
      utilizationRate: 42,
      memberSatisfaction: 3.5,
      recommendedChanges: ['Increase frame allowance', 'Add blue light protection'],
      projectedSavings: -2400
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'complex': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'identified': return '#f59e0b';
      case 'dismissed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost-reduction': return DollarSign;
      case 'utilization': return TrendingUp;
      case 'satisfaction': return Users;
      case 'compliance': return AlertTriangle;
      default: return Target;
    }
  };

  const filteredOpportunities = filterCategory === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === filterCategory);

  const renderOpportunities = () => (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterChip, filterCategory === 'all' && styles.activeFilter]}
            onPress={() => setFilterCategory('all')}
          >
            <Text style={[styles.filterText, filterCategory === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, filterCategory === 'cost-reduction' && styles.activeFilter]}
            onPress={() => setFilterCategory('cost-reduction')}
          >
            <Text style={[styles.filterText, filterCategory === 'cost-reduction' && styles.activeFilterText]}>
              Cost Reduction
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, filterCategory === 'utilization' && styles.activeFilter]}
            onPress={() => setFilterCategory('utilization')}
          >
            <Text style={[styles.filterText, filterCategory === 'utilization' && styles.activeFilterText]}>
              Utilization
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, filterCategory === 'satisfaction' && styles.activeFilter]}
            onPress={() => setFilterCategory('satisfaction')}
          >
            <Text style={[styles.filterText, filterCategory === 'satisfaction' && styles.activeFilterText]}>
              Satisfaction
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, filterCategory === 'compliance' && styles.activeFilter]}
            onPress={() => setFilterCategory('compliance')}
          >
            <Text style={[styles.filterText, filterCategory === 'compliance' && styles.activeFilterText]}>
              Compliance
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.opportunitiesList}>
        {filteredOpportunities.map((opportunity) => {
          const IconComponent = getCategoryIcon(opportunity.category);
          return (
            <View key={opportunity.id} style={styles.opportunityCard}>
              <View style={styles.opportunityHeader}>
                <IconComponent size={20} color="#8b5cf6" />
                <View style={styles.opportunityInfo}>
                  <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
                  <Text style={styles.opportunityDescription}>{opportunity.description}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(opportunity.status) }]}>
                  <Text style={styles.statusText}>{opportunity.status}</Text>
                </View>
              </View>

              <View style={styles.opportunityMetrics}>
                <View style={styles.metricRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Impact</Text>
                    <View style={[styles.impactBadge, { backgroundColor: getImpactColor(opportunity.impact) }]}>
                      <Text style={styles.impactText}>{opportunity.impact}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Effort</Text>
                    <View style={[styles.effortBadge, { backgroundColor: getEffortColor(opportunity.implementationEffort) }]}>
                      <Text style={styles.effortText}>{opportunity.implementationEffort}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Timeframe</Text>
                    <Text style={styles.metricValue}>{opportunity.timeframe}</Text>
                  </View>
                </View>

                <View style={styles.savingsRow}>
                  <Text style={styles.savingsLabel}>Potential Annual Impact:</Text>
                  <Text style={[
                    styles.savingsValue, 
                    { color: opportunity.potentialSavings >= 0 ? '#10b981' : '#ef4444' }
                  ]}>
                    {opportunity.potentialSavings >= 0 ? '+' : ''}${Math.abs(opportunity.potentialSavings).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>
                    {opportunity.status === 'identified' ? 'Start Implementation' : 'Update Status'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderComparison = () => (
    <View style={styles.container}>
      <View style={styles.comparisonList}>
        {planComparisons.map((plan, index) => (
          <View key={index} style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.planName}>{plan.planName}</Text>
              <View style={styles.savingsIndicator}>
                <Text style={[
                  styles.savingsAmount,
                  { color: plan.projectedSavings >= 0 ? '#10b981' : '#ef4444' }
                ]}>
                  {plan.projectedSavings >= 0 ? '+' : ''}${Math.abs(plan.projectedSavings).toLocaleString()} annually
                </Text>
              </View>
            </View>

            <View style={styles.comparisonMetrics}>
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonLabel}>Current Cost</Text>
                <Text style={styles.comparisonValue}>${plan.currentCost.toLocaleString()}</Text>
              </View>
              
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonLabel}>Utilization</Text>
                <Text style={styles.comparisonValue}>{plan.utilizationRate}%</Text>
              </View>
              
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonLabel}>Satisfaction</Text>
                <Text style={styles.comparisonValue}>{plan.memberSatisfaction}/5.0</Text>
              </View>
            </View>

            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsTitle}>Recommended Changes:</Text>
              {plan.recommendedChanges.map((change, changeIndex) => (
                <View key={changeIndex} style={styles.recommendationItem}>
                  <Lightbulb size={16} color="#f59e0b" />
                  <Text style={styles.recommendationText}>{change}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.implementButton}>
              <Text style={styles.implementButtonText}>Implement Changes</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.container}>
      <View style={styles.recommendationsContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Optimization Summary</Text>
          <Text style={styles.summarySubtitle}>Based on current benefits analysis</Text>
          
          <View style={styles.summaryMetrics}>
            <View style={styles.summaryMetric}>
              <DollarSign size={24} color="#10b981" />
              <Text style={styles.summaryValue}>$97,800</Text>
              <Text style={styles.summaryLabel}>Total Potential Savings</Text>
            </View>
            
            <View style={styles.summaryMetric}>
              <TrendingUp size={24} color="#3b82f6" />
              <Text style={styles.summaryValue}>15%</Text>
              <Text style={styles.summaryLabel}>Utilization Improvement</Text>
            </View>
            
            <View style={styles.summaryMetric}>
              <Users size={24} color="#8b5cf6" />
              <Text style={styles.summaryValue}>4.3/5</Text>
              <Text style={styles.summaryLabel}>Projected Satisfaction</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionPlan}>
          <Text style={styles.actionPlanTitle}>Recommended Action Plan</Text>
          
          <View style={styles.phasesList}>
            <View style={styles.phaseCard}>
              <View style={styles.phaseHeader}>
                <View style={styles.phaseNumber}>
                  <Text style={styles.phaseNumberText}>1</Text>
                </View>
                <Text style={styles.phaseTitle}>Immediate Actions (0-3 months)</Text>
              </View>
              
              <View style={styles.phaseActions}>
                <View style={styles.actionItem}>
                  <Check size={16} color="#10b981" />
                  <Text style={styles.actionText}>Implement preventative care incentives</Text>
                </View>
                <View style={styles.actionItem}>
                  <Check size={16} color="#10b981" />
                  <Text style={styles.actionText}>Upgrade vision plan benefits</Text>
                </View>
                <View style={styles.actionItem}>
                  <Check size={16} color="#10b981" />
                  <Text style={styles.actionText}>Launch wellness program optimization</Text>
                </View>
              </View>
              
              <Text style={styles.phaseImpact}>Expected Impact: $35,000 annual savings</Text>
            </View>

            <View style={styles.phaseCard}>
              <View style={styles.phaseHeader}>
                <View style={styles.phaseNumber}>
                  <Text style={styles.phaseNumberText}>2</Text>
                </View>
                <Text style={styles.phaseTitle}>Medium-term Goals (3-6 months)</Text>
              </View>
              
              <View style={styles.phaseActions}>
                <View style={styles.actionItem}>
                  <Target size={16} color="#f59e0b" />
                  <Text style={styles.actionText}>Introduce HDHP option with HSA</Text>
                </View>
                <View style={styles.actionItem}>
                  <Target size={16} color="#f59e0b" />
                  <Text style={styles.actionText}>Complete mental health parity review</Text>
                </View>
                <View style={styles.actionItem}>
                  <Target size={16} color="#f59e0b" />
                  <Text style={styles.actionText}>Enhance telehealth benefits</Text>
                </View>
              </View>
              
              <Text style={styles.phaseImpact}>Expected Impact: $45,000 annual savings</Text>
            </View>

            <View style={styles.phaseCard}>
              <View style={styles.phaseHeader}>
                <View style={styles.phaseNumber}>
                  <Text style={styles.phaseNumberText}>3</Text>
                </View>
                <Text style={styles.phaseTitle}>Long-term Strategy (6-12 months)</Text>
              </View>
              
              <View style={styles.phaseActions}>
                <View style={styles.actionItem}>
                  <AlertTriangle size={16} color="#8b5cf6" />
                  <Text style={styles.actionText}>Comprehensive wellness program redesign</Text>
                </View>
                <View style={styles.actionItem}>
                  <AlertTriangle size={16} color="#8b5cf6" />
                  <Text style={styles.actionText}>Advanced health analytics implementation</Text>
                </View>
                <View style={styles.actionItem}>
                  <AlertTriangle size={16} color="#8b5cf6" />
                  <Text style={styles.actionText}>Provider network optimization</Text>
                </View>
              </View>
              
              <Text style={styles.phaseImpact}>Expected Impact: $17,800 annual savings</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Benefits Optimization</Text>
        <Text style={styles.subtitle}>Maximize value and reduce costs</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, selectedView === 'opportunities' && styles.activeTab]}
          onPress={() => setSelectedView('opportunities')}
        >
          <Text style={[styles.tabText, selectedView === 'opportunities' && styles.activeTabText]}>
            Opportunities
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedView === 'comparison' && styles.activeTab]}
          onPress={() => setSelectedView('comparison')}
        >
          <Text style={[styles.tabText, selectedView === 'comparison' && styles.activeTabText]}>
            Plan Analysis
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedView === 'recommendations' && styles.activeTab]}
          onPress={() => setSelectedView('recommendations')}
        >
          <Text style={[styles.tabText, selectedView === 'recommendations' && styles.activeTabText]}>
            Action Plan
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedView === 'opportunities' && renderOpportunities()}
        {selectedView === 'comparison' && renderComparison()}
        {selectedView === 'recommendations' && renderRecommendations()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  filterBar: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#8b5cf6',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#fff',
  },
  opportunitiesList: {
    gap: 16,
  },
  opportunityCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  opportunityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  opportunityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  opportunityDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  opportunityMetrics: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  impactText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  effortBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  effortText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#374151',
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  comparisonList: {
    gap: 16,
  },
  comparisonCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  savingsIndicator: {
    alignItems: 'flex-end',
  },
  savingsAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  comparisonMetric: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  implementButton: {
    paddingVertical: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
  },
  implementButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  recommendationsContainer: {
    gap: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryMetric: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  actionPlan: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  phasesList: {
    gap: 16,
  },
  phaseCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phaseNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  phaseActions: {
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  phaseImpact: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
});