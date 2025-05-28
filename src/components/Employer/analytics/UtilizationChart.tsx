import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, CartesianGrid, Legend, LineChart, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface UtilizationData {
  category: string;
  utilized: number;
  available: number;
  utilizationRate: number;
  trend: 'up' | 'down' | 'stable';
  previousPeriod: number;
}

interface TrendData {
  month: string;
  utilization: number;
  target: number;
}

interface DepartmentData {
  department: string;
  utilizationRate: number;
  employeeCount: number;
  topServices: string[];
}

interface UtilizationChartProps {
  utilizationData: UtilizationData[];
  trendData: TrendData[];
  departmentData: DepartmentData[];
  chartType?: 'bar' | 'pie' | 'line' | 'combined';
  showLegend?: boolean;
  showTargets?: boolean;
  compactView?: boolean;
}

export const UtilizationChart: React.FC<UtilizationChartProps> = ({
  utilizationData,
  trendData,
  departmentData,
  chartType = 'combined',
  showLegend = true,
  showTargets = true,
  compactView = false
}) => {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return '#10B981'; // Green
    if (rate >= 60) return '#F59E0B'; // Yellow
    if (rate >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const averageUtilization = utilizationData.reduce((sum, item) => sum + item.utilizationRate, 0) / utilizationData.length;

  const pieChartData = utilizationData.map(item => ({
    name: item.category,
    value: item.utilizationRate,
    fill: getUtilizationColor(item.utilizationRate)
  }));

  const barChartData = utilizationData.map(item => ({
    category: item.category,
    utilized: item.utilized,
    available: item.available,
    utilizationRate: item.utilizationRate
  }));

  if (compactView) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle}>Benefits Utilization</Text>
          <Text style={styles.compactAverage}>{Math.round(averageUtilization)}%</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.compactBars}>
            {utilizationData.map((item, index) => (
              <View key={index} style={styles.compactBar}>
                <View style={styles.compactBarContainer}>
                  <View
                    style={[
                      styles.compactBarFill,
                      {
                        height: `${item.utilizationRate}%`,
                        backgroundColor: getUtilizationColor(item.utilizationRate)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.compactBarLabel}>{item.category}</Text>
                <Text style={styles.compactBarValue}>{item.utilizationRate}%</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Benefits Utilization Analysis</Text>
        <Text style={styles.subtitle}>
          Average utilization: {Math.round(averageUtilization)}%
        </Text>
      </View>

      {(chartType === 'bar' || chartType === 'combined') && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Utilization by Category</Text>
          <View style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                {showLegend && <Legend />}
                <Bar dataKey="utilized" fill="#3B82F6" name="Utilized" />
                <Bar dataKey="available" fill="#E5E7EB" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </View>
        </View>
      )}

      {(chartType === 'pie' || chartType === 'combined') && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Utilization Distribution</Text>
          <View style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </View>
        </View>
      )}

      {(chartType === 'line' || chartType === 'combined') && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Utilization Trends</Text>
          <View style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {showLegend && <Legend />}
                <Line type="monotone" dataKey="utilization" stroke="#3B82F6" strokeWidth={2} name="Actual" />
                {showTargets && (
                  <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" name="Target" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </View>
        </View>
      )}

      <View style={styles.statisticsSection}>
        <Text style={styles.sectionTitle}>Utilization Statistics</Text>
        <View style={styles.statsGrid}>
          {utilizationData.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statCategory}>{item.category}</Text>
                <Text style={styles.statTrend}>
                  {getTrendIcon(item.trend)} {Math.abs(item.utilizationRate - item.previousPeriod).toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.statValue}>
                <Text style={[styles.statPercentage, { color: getUtilizationColor(item.utilizationRate) }]}>
                  {item.utilizationRate}%
                </Text>
                <Text style={styles.statSubtext}>
                  {item.utilized} of {item.available} used
                </Text>
              </View>

              <View style={styles.progressBar}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.utilizationRate}%`,
                        backgroundColor: getUtilizationColor(item.utilizationRate)
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.departmentSection}>
        <Text style={styles.sectionTitle}>Department Breakdown</Text>
        <View style={styles.departmentList}>
          {departmentData.map((dept, index) => (
            <View key={index} style={styles.departmentCard}>
              <View style={styles.departmentHeader}>
                <Text style={styles.departmentName}>{dept.department}</Text>
                <Text style={styles.departmentEmployees}>
                  {dept.employeeCount} employees
                </Text>
              </View>
              
              <View style={styles.departmentStats}>
                <View style={styles.departmentUtilization}>
                  <Text style={[
                    styles.departmentRate,
                    { color: getUtilizationColor(dept.utilizationRate) }
                  ]}>
                    {dept.utilizationRate}%
                  </Text>
                  <Text style={styles.departmentLabel}>Utilization</Text>
                </View>
                
                <View style={styles.departmentServices}>
                  <Text style={styles.servicesLabel}>Top Services:</Text>
                  {dept.topServices.map((service, serviceIndex) => (
                    <View key={serviceIndex} style={styles.serviceTag}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.departmentProgressBar}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${dept.utilizationRate}%`,
                        backgroundColor: getUtilizationColor(dept.utilizationRate)
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.insights}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        <View style={styles.insightsList}>
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>📈</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Highest Utilization</Text>
              <Text style={styles.insightText}>
                {utilizationData.reduce((max, item) => 
                  item.utilizationRate > max.utilizationRate ? item : max
                ).category} leads with {Math.max(...utilizationData.map(item => item.utilizationRate))}%
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>⚠️</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Improvement Opportunity</Text>
              <Text style={styles.insightText}>
                {utilizationData.reduce((min, item) => 
                  item.utilizationRate < min.utilizationRate ? item : min
                ).category} has the lowest utilization at {Math.min(...utilizationData.map(item => item.utilizationRate))}%
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>🎯</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Target Performance</Text>
              <Text style={styles.insightText}>
                {utilizationData.filter(item => item.utilizationRate >= 80).length} of {utilizationData.length} categories meet the 80% target
              </Text>
            </View>
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
  compactContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  compactAverage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  compactBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
  },
  compactBar: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  compactBarContainer: {
    width: 20,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  compactBarFill: {
    width: '100%',
    borderRadius: 2,
  },
  compactBarLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  compactBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  chartSection: {
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chartContainer: {
    height: 300,
    width: '100%',
  },
  statisticsSection: {
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  statTrend: {
    fontSize: 12,
    color: '#6B7280',
  },
  statValue: {
    marginBottom: 8,
  },
  statPercentage: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBar: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  departmentSection: {
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
  },
  departmentList: {
    gap: 12,
  },
  departmentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  departmentEmployees: {
    fontSize: 12,
    color: '#6B7280',
  },
  departmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  departmentUtilization: {
    alignItems: 'center',
  },
  departmentRate: {
    fontSize: 18,
    fontWeight: '700',
  },
  departmentLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  departmentServices: {
    flex: 1,
    marginLeft: 16,
  },
  servicesLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  serviceTag: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  serviceText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '500',
  },
  departmentProgressBar: {
    marginTop: 8,
  },
  insights: {
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
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightEmoji: {
    fontSize: 18,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});