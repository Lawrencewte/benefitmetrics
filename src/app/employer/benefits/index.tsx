import { AlertCircle, DollarSign, Settings, Shield, TrendingUp, Users } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BenefitsPlan {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | 'wellness';
  participants: number;
  totalCost: number;
  utilizationRate: number;
  status: 'active' | 'pending' | 'inactive';
}

interface BenefitsMetrics {
  totalEnrollment: number;
  averageUtilization: number;
  monthlyCost: number;
  topPlan: string;
}

export default function BenefitsOverview() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'plans' | 'analytics'>('overview');
  
  const metrics: BenefitsMetrics = {
    totalEnrollment: 412,
    averageUtilization: 73,
    monthlyCost: 125000,
    topPlan: 'Premium Health Plus'
  };

  const plans: BenefitsPlan[] = [
    {
      id: '1',
      name: 'Premium Health Plus',
      type: 'health',
      participants: 298,
      totalCost: 89400,
      utilizationRate: 78,
      status: 'active'
    },
    {
      id: '2',
      name: 'Dental Care Pro',
      type: 'dental',
      participants: 385,
      totalCost: 23100,
      utilizationRate: 65,
      status: 'active'
    },
    {
      id: '3',
      name: 'Vision Essentials',
      type: 'vision',
      participants: 312,
      totalCost: 9360,
      utilizationRate: 42,
      status: 'active'
    },
    {
      id: '4',
      name: 'Wellness Program',
      type: 'wellness',
      participants: 267,
      totalCost: 8010,
      utilizationRate: 58,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return Shield;
      case 'dental': return Users;
      case 'vision': return AlertCircle;
      case 'wellness': return TrendingUp;
      default: return Shield;
    }
  };

  const renderOverview = () => (
    <View style={styles.container}>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Users size={24} color="#8b5cf6" />
          <Text style={styles.metricValue}>{metrics.totalEnrollment}</Text>
          <Text style={styles.metricLabel}>Total Enrolled</Text>
        </View>
        
        <View style={styles.metricCard}>
          <TrendingUp size={24} color="#10b981" />
          <Text style={styles.metricValue}>{metrics.averageUtilization}%</Text>
          <Text style={styles.metricLabel}>Avg Utilization</Text>
        </View>
        
        <View style={styles.metricCard}>
          <DollarSign size={24} color="#f59e0b" />
          <Text style={styles.metricValue}>${(metrics.monthlyCost / 1000).toFixed(0)}K</Text>
          <Text style={styles.metricLabel}>Monthly Cost</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Shield size={24} color="#3b82f6" />
          <Text style={styles.metricValue}>4</Text>
          <Text style={styles.metricLabel}>Active Plans</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plan Performance</Text>
        <View style={styles.performanceList}>
          {plans.map((plan) => {
            const IconComponent = getTypeIcon(plan.type);
            return (
              <View key={plan.id} style={styles.performanceItem}>
                <View style={styles.performanceHeader}>
                  <IconComponent size={20} color="#6b7280" />
                  <Text style={styles.performanceName}>{plan.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plan.status) }]}>
                    <Text style={styles.statusText}>{plan.status}</Text>
                  </View>
                </View>
                
                <View style={styles.performanceStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{plan.participants}</Text>
                    <Text style={styles.statLabel}>Participants</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{plan.utilizationRate}%</Text>
                    <Text style={styles.statLabel}>Utilization</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>${(plan.totalCost / 1000).toFixed(0)}K</Text>
                    <Text style={styles.statLabel}>Monthly Cost</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderPlans = () => (
    <View style={styles.container}>
      <View style={styles.plansList}>
        {plans.map((plan) => {
          const IconComponent = getTypeIcon(plan.type);
          return (
            <TouchableOpacity key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <IconComponent size={24} color="#8b5cf6" />
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planType}>{plan.type.charAt(0).toUpperCase() + plan.type.slice(1)} Plan</Text>
                </View>
                <Settings size={20} color="#6b7280" />
              </View>
              
              <View style={styles.planMetrics}>
                <View style={styles.planMetricItem}>
                  <Text style={styles.planMetricLabel}>Participants</Text>
                  <Text style={styles.planMetricValue}>{plan.participants}</Text>
                </View>
                <View style={styles.planMetricItem}>
                  <Text style={styles.planMetricLabel}>Utilization Rate</Text>
                  <Text style={styles.planMetricValue}>{plan.utilizationRate}%</Text>
                </View>
                <View style={styles.planMetricItem}>
                  <Text style={styles.planMetricLabel}>Monthly Cost</Text>
                  <Text style={styles.planMetricValue}>${(plan.totalCost / 1000).toFixed(0)}K</Text>
                </View>
              </View>
              
              <View style={styles.utilizationBar}>
                <View 
                  style={[
                    styles.utilizationFill, 
                    { width: `${plan.utilizationRate}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.container}>
      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Benefits Utilization Trends</Text>
        <Text style={styles.cardSubtitle}>Last 6 months performance</Text>
        
        <View style={styles.trendsList}>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Health Insurance</Text>
            <View style={styles.trendIndicator}>
              <TrendingUp size={16} color="#10b981" />
              <Text style={styles.trendValue}>+12%</Text>
            </View>
          </View>
          
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Dental Coverage</Text>
            <View style={styles.trendIndicator}>
              <TrendingUp size={16} color="#10b981" />
              <Text style={styles.trendValue}>+8%</Text>
            </View>
          </View>
          
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Vision Care</Text>
            <View style={styles.trendIndicator}>
              <TrendingUp size={16} color="#f59e0b" />
              <Text style={styles.trendValue}>-3%</Text>
            </View>
          </View>
          
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Wellness Programs</Text>
            <View style={styles.trendIndicator}>
              <TrendingUp size={16} color="#10b981" />
              <Text style={styles.trendValue}>+15%</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Cost Analysis</Text>
        <Text style={styles.cardSubtitle}>Per employee monthly breakdown</Text>
        
        <View style={styles.costBreakdown}>
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Health Insurance</Text>
            <Text style={styles.costValue}>$217/month</Text>
          </View>
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Dental Coverage</Text>
            <Text style={styles.costValue}>$56/month</Text>
          </View>
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Vision Care</Text>
            <Text style={styles.costValue}>$23/month</Text>
          </View>
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Wellness Programs</Text>
            <Text style={styles.costValue}>$19/month</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Benefits Management</Text>
        <Text style={styles.subtitle}>Acme Corporation</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'plans' && styles.activeTab]}
          onPress={() => setSelectedTab('plans')}
        >
          <Text style={[styles.tabText, selectedTab === 'plans' && styles.activeTabText]}>
            Plans
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedTab('analytics')}
        >
          <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'plans' && renderPlans()}
        {selectedTab === 'analytics' && renderAnalytics()}
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  performanceList: {
    gap: 12,
  },
  performanceItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  plansList: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
    marginLeft: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  planType: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  planMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planMetricItem: {
    alignItems: 'center',
  },
  planMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  planMetricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  utilizationBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  utilizationFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  trendsList: {
    gap: 12,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 14,
    color: '#374151',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 4,
  },
  costBreakdown: {
    gap: 12,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    color: '#374151',
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});