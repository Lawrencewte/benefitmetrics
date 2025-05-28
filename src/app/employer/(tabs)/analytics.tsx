// src/app/employer/(tabs)/analytics.tsx
import { useRouter } from 'expo-router';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  DollarSign,
  FileText,
  PieChart,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';

const AnalyticsHub = () => {
  const router = useRouter();
  const [highlightedSection, setHighlightedSection] = useState(null);

  const analyticsModules = [
    {
      id: 'benefits-optimization',
      title: 'Benefits Optimization',
      description: 'Identify unrealized benefit value and optimization opportunities',
      icon: DollarSign,
      route: '/employer/analytics/benefits-optimization',
      stats: {
        primaryValue: '$182,500',
        primaryLabel: 'Unrealized benefits value',
        secondaryValue: '63%',
        secondaryLabel: 'Benefits utilization rate'
      },
      alerts: 2,
      color: '#dc2626'
    },
    {
      id: 'health-metrics',
      title: 'Health Score Analytics',
      description: 'Company-wide health scores and preventative care engagement',
      icon: Activity,
      route: '/employer/analytics/health-metrics',
      stats: {
        primaryValue: '78%',
        primaryLabel: 'Average health score',
        secondaryValue: '↑8%',
        secondaryLabel: 'vs last quarter'
      },
      alerts: 0,
      color: '#3b82f6'
    },
    {
      id: 'roi-report',
      title: 'ROI Reporting',
      description: 'Financial impact analysis of preventative healthcare programs',
      icon: TrendingUp,
      route: '/employer/analytics/roi-report',
      stats: {
        primaryValue: '$406,720',
        primaryLabel: 'Total healthcare savings',
        secondaryValue: '4.2x',
        secondaryLabel: 'Return on investment'
      },
      alerts: 0,
      color: '#10b981'
    },
    {
      id: 'utilization',
      title: 'Utilization Analytics',
      description: 'Track usage patterns and engagement across programs',
      icon: BarChart3,
      route: '/employer/analytics/utilization',
      stats: {
        primaryValue: '84%',
        primaryLabel: 'Program participation',
        secondaryValue: '328',
        secondaryLabel: 'Active users'
      },
      alerts: 1,
      color: '#8b5cf6'
    },
    {
      id: 'custom-reports',
      title: 'Custom Reports',
      description: 'Build and schedule customized analytics reports',
      icon: FileText,
      route: '/employer/analytics/custom-reports',
      stats: {
        primaryValue: '12',
        primaryLabel: 'Active reports',
        secondaryValue: '5',
        secondaryLabel: 'Scheduled weekly'
      },
      alerts: 0,
      color: '#f59e0b'
    }
  ];

  const quickStats = {
    totalSavings: '$406,720',
    healthScoreImprovement: '+8%',
    participationRate: '84%',
    alertsRequiringAttention: 3
  };

  const toggleHighlight = (sectionId) => {
    setHighlightedSection(highlightedSection === sectionId ? null : sectionId);
  };

  const navigateToSection = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Header title="Analytics" />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Analytics Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Comprehensive insights into your wellness program performance
          </Text>
        </View>

        {/* Quick Stats Overview */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Key Metrics Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <DollarSign size={24} color="#10b981" />
              <Text style={styles.statValue}>{quickStats.totalSavings}</Text>
              <Text style={styles.statLabel}>Total Savings</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{quickStats.healthScoreImprovement}</Text>
              <Text style={styles.statLabel}>Health Score ↑</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{quickStats.participationRate}</Text>
              <Text style={styles.statLabel}>Participation</Text>
            </View>
            <View style={styles.statItem}>
              <AlertTriangle size={24} color="#dc2626" />
              <Text style={styles.statValue}>{quickStats.alertsRequiringAttention}</Text>
              <Text style={styles.statLabel}>Active Alerts</Text>
            </View>
          </View>
        </Card>

        {/* Analytics Modules */}
        <Text style={styles.sectionTitle}>Analytics Modules</Text>
        
        {analyticsModules.map((module) => {
          const IconComponent = module.icon;
          const isHighlighted = highlightedSection === module.id;
          
          return (
            <TouchableOpacity
              key={module.id}
              onPress={() => toggleHighlight(module.id)}
              style={[
                styles.moduleCard,
                isHighlighted && styles.moduleCardHighlighted
              ]}
            >
              <Card>
                <View style={styles.moduleHeader}>
                  <View style={styles.moduleIconContainer}>
                    <IconComponent size={24} color={module.color} />
                  </View>
                  <View style={styles.moduleInfo}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={styles.moduleTitle}>{module.title}</Text>
                      {module.alerts > 0 && (
                        <View style={styles.alertBadge}>
                          <Text style={styles.alertBadgeText}>{module.alerts}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                  </View>
                  <ArrowRight size={20} color="#666" />
                </View>
                
                <View style={styles.moduleStats}>
                  <View style={styles.moduleStatItem}>
                    <Text style={[styles.moduleStatValue, { color: module.color }]}>
                      {module.stats.primaryValue}
                    </Text>
                    <Text style={styles.moduleStatLabel}>
                      {module.stats.primaryLabel}
                    </Text>
                  </View>
                  <View style={styles.moduleStatItem}>
                    <Text style={styles.moduleStatSecondary}>
                      {module.stats.secondaryValue}
                    </Text>
                    <Text style={styles.moduleStatLabel}>
                      {module.stats.secondaryLabel}
                    </Text>
                  </View>
                </View>

                {isHighlighted && (
                  <View style={styles.moduleActions}>
                    <Button
                      title="Open Dashboard"
                      variant="primary"
                      onPress={() => navigateToSection(module.route)}
                      style={styles.moduleButton}
                    />
                    <Button
                      title="Quick View"
                      variant="outline"
                      onPress={() => console.log(`Quick view: ${module.id}`)}
                      style={styles.moduleButton}
                    />
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/analytics/custom-reports')}
            >
              <FileText size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>Create Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigateToSection('/employer/analytics/benefits-optimization')}
            >
              <Target size={24} color="#dc2626" />
              <Text style={styles.quickActionText}>View Alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => console.log('Export data')}
            >
              <PieChart size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Export Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => console.log('Schedule report')}
            >
              <BarChart3 size={24} color="#8b5cf6" />
              <Text style={styles.quickActionText}>Schedule</Text>
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
  moduleCard: {
    marginBottom: 16,
  },
  moduleCardHighlighted: {
    transform: [{ scale: 1.02 }],
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  alertBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
  },
  moduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moduleStatItem: {
    flex: 1,
  },
  moduleStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moduleStatSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  moduleStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moduleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  moduleButton: {
    flex: 1,
  },
  quickActionsSection: {
    marginTop: 24,
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

export default AnalyticsHub;