import { Link } from 'expo-router';
import { Activity, BarChart, ChevronRight, DollarSign, Heart, PieChart, Star, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';

type AnalyticsDashboard = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: any }>;
  metrics: AnalyticsMetric[];
  link: string;
  isNew?: boolean;
};

type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
};

export default function AnalyticsIndexScreen() {
  // Sample data - in a real app, this would come from an API or context
  const dashboards: AnalyticsDashboard[] = [
    {
      id: 'benefits-optimization',
      title: 'Benefits Optimization',
      description: 'Identify unrealized benefit value and opportunities to increase utilization.',
      icon: DollarSign,
      metrics: [
        {
          id: 'utilization',
          label: 'Utilization Rate',
          value: '63%',
          change: {
            value: '5%',
            isPositive: true
          }
        },
        {
          id: 'unrealized',
          label: 'Unrealized Value',
          value: '$182,500',
          change: {
            value: '$12,300',
            isPositive: false
          }
        }
      ],
      link: '/employer/analytics/benefits-optimization',
      isNew: true
    },
    {
      id: 'health-metrics',
      title: 'Health Metrics',
      description: 'Company-wide analytics on employee health scores and preventative care engagement.',
      icon: Activity,
      metrics: [
        {
          id: 'avg-score',
          label: 'Avg. Health Score',
          value: '78%',
          change: {
            value: '3%',
            isPositive: true
          }
        },
        {
          id: 'at-risk',
          label: 'At-Risk Employees',
          value: '52',
          change: {
            value: '8',
            isPositive: false
          }
        }
      ],
      link: '/employer/analytics/health-metrics',
      isNew: true
    },
    {
      id: 'roi-report',
      title: 'ROI Analysis',
      description: 'Financial impact analysis of your company\'s preventative healthcare program.',
      icon: PieChart,
      metrics: [
        {
          id: 'savings',
          label: 'Total Savings',
          value: '$406,720',
          change: {
            value: '$45,820',
            isPositive: true
          }
        },
        {
          id: 'per-employee',
          label: 'Per Employee',
          value: '$1,240',
          change: {
            value: '$180',
            isPositive: true
          }
        }
      ],
      link: '/employer/analytics/roi-report',
      isNew: true
    },
    {
      id: 'utilization',
      title: 'Utilization Analytics',
      description: 'Detailed analysis of benefits utilization across departments and demographics.',
      icon: BarChart,
      metrics: [
        {
          id: 'preventative',
          label: 'Preventative Care',
          value: '56%',
          change: {
            value: '7%',
            isPositive: true
          }
        },
        {
          id: 'dental',
          label: 'Dental Services',
          value: '62%',
          change: {
            value: '4%',
            isPositive: true
          }
        }
      ],
      link: '/employer/analytics/utilization'
    },
    {
      id: 'engagement',
      title: 'Employee Engagement',
      description: 'Track employee participation in wellness programs and challenges.',
      icon: Users,
      metrics: [
        {
          id: 'active',
          label: 'Active Participants',
          value: '328',
          change: {
            value: '24',
            isPositive: true
          }
        },
        {
          id: 'completion',
          label: 'Challenge Completion',
          value: '72%',
          change: {
            value: '3%',
            isPositive: true
          }
        }
      ],
      link: '/employer/analytics/engagement'
    }
  ];

  // Recent reports data
  const recentReports = [
    {
      id: '1',
      title: 'Q1 2025 Health Benefits ROI',
      date: 'April 10, 2025',
      type: 'Financial',
      link: '/reports/q1-2025-roi'
    },
    {
      id: '2',
      title: 'Department Utilization Comparison',
      date: 'March 28, 2025',
      type: 'Utilization',
      link: '/reports/dept-utilization-march'
    },
    {
      id: '3',
      title: 'Preventative Care Impact Analysis',
      date: 'March 15, 2025',
      type: 'Health Outcomes',
      link: '/reports/preventative-impact-march'
    }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Analytics" 
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Access comprehensive analytics dashboards to track benefits utilization, health metrics, and program ROI across your organization.
        </Text>
        
        <Text style={styles.sectionTitle}>Dashboards</Text>
        
        {dashboards.map(dashboard => (
          <Link key={dashboard.id} href={dashboard.link} asChild>
            <TouchableOpacity style={styles.dashboardCard}>
              {dashboard.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
              
              <View style={styles.dashboardHeader}>
                <View style={styles.iconContainer}>
                  <dashboard.icon size={24} color={
                    dashboard.id === 'benefits-optimization' ? "#6A5ACD" :
                    dashboard.id === 'health-metrics' ? "#4682B4" :
                    dashboard.id === 'roi-report' ? "#4CAF50" :
                    dashboard.id === 'utilization' ? "#FF9800" :
                    dashboard.id === 'engagement' ? "#2196F3" : "#6A5ACD"
                  } />
                </View>
                <View style={styles.dashboardInfo}>
                  <Text style={styles.dashboardTitle}>{dashboard.title}</Text>
                  <Text style={styles.dashboardDescription}>{dashboard.description}</Text>
                </View>
              </View>
              
              <View style={styles.metricsContainer}>
                {dashboard.metrics.map(metric => (
                  <View key={metric.id} style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <View style={styles.metricValues}>
                      <Text style={styles.metricValue}>{metric.value}</Text>
                      {metric.change && (
                        <View style={[
                          styles.changeBadge,
                          metric.change.isPositive ? styles.positiveChange : styles.negativeChange
                        ]}>
                          <Text style={[
                            styles.changeText,
                            metric.change.isPositive ? styles.positiveText : styles.negativeText
                          ]}>
                            {metric.change.isPositive ? '↑' : '↓'} {metric.change.value}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.dashboardEmployerFooter}>
                <Text style={styles.viewText}>View Dashboard</Text>
                <ChevronRight size={16} color="#6A5ACD" />
              </View>
            </TouchableOpacity>
          </Link>
        ))}
        
        <View style={styles.customReportCard}>
          <Star size={24} color="#6A5ACD" style={styles.customReportIcon} />
          <View style={styles.customReportContent}>
            <Text style={styles.customReportTitle}>Create Custom Report</Text>
            <Text style={styles.customReportDescription}>
              Build tailored reports that combine data from multiple sources and metrics to meet your specific needs.
            </Text>
            <Link href="/employer/analytics/custom-reports" asChild>
              <TouchableOpacity style={styles.customReportButton}>
                <Text style={styles.customReportButtonText}>Create Report</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        
        {recentReports.map(report => (
          <Link key={report.id} href={report.link} asChild>
            <TouchableOpacity style={styles.reportCard}>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <View style={styles.reportMeta}>
                  <Text style={styles.reportDate}>{report.date}</Text>
                  <View style={styles.reportTypeBadge}>
                    <Text style={styles.reportTypeText}>{report.type}</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={16} color="#666" />
            </TouchableOpacity>
          </Link>
        ))}
        
        <View style={styles.additionalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Download Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Schedule Export</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dataNote}>
          <Heart size={16} color="#6A5ACD" style={styles.noteIcon} />
          <Text style={styles.noteText}>
            All employee health data is aggregated and anonymized to protect individual privacy while providing meaningful insights.
          </Text>
        </View>
      </ScrollView>
      
      <EmployerFooter 
        activePath="analytics"
        employee={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  dashboardCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  newBadge: {
    backgroundColor: '#E6E0F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newBadgeText: {
    fontSize: 10,
    color: '#6A5ACD',
    fontWeight: '600',
  },
  dashboardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  dashboardInfo: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dashboardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metricItem: {
    width: '50%',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  changeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  positiveChange: {
    backgroundColor: '#E8F5E9',
  },
  negativeChange: {
    backgroundColor: '#FFEBEE',
  },
  changeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  positiveText: {
    color: '#4CAF50',
  },
  negativeText: {
    color: '#F44336',
  },
  dashboardEmployerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  viewText: {
    fontSize: 12,
    color: '#6A5ACD',
    fontWeight: '500',
    marginRight: 4,
  },
  customReportCard: {
    backgroundColor: '#F0EDFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D8CFFF',
    flexDirection: 'row',
  },
  customReportIcon: {
    marginRight: 16,
  },
  customReportContent: {
    flex: 1,
  },
  customReportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A5ACD',
    marginBottom: 4,
  },
  customReportDescription: {
    fontSize: 12,
    color: '#6A5ACD',
    lineHeight: 18,
    marginBottom: 12,
  },
  customReportButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  customReportButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  reportTypeBadge: {
    backgroundColor: '#E6E0F8',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  reportTypeText: {
    fontSize: 10,
    color: '#6A5ACD',
  },
  additionalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '48%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  dataNote: {
    backgroundColor: '#F0EDFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D8CFFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#6A5ACD',
    lineHeight: 18,
  },
});