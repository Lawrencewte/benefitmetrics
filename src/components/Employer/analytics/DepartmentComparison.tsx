import { BarChart, Download, Filter, Minus, TrendingDown, TrendingUp, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DepartmentMetrics {
  department: string;
  employeeCount: number;
  participationRate: number;
  averageHealthScore: number;
  benefitsUtilization: number;
  preventiveCareCompletion: number;
  wellnessProgramEngagement: number;
  absenteeismRate: number;
  healthcareCostPerEmployee: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  topRiskFactors: string[];
  achievements: string[];
  improvementAreas: string[];
}

interface CompanyBenchmarks {
  participationRate: number;
  averageHealthScore: number;
  benefitsUtilization: number;
  preventiveCareCompletion: number;
  wellnessProgramEngagement: number;
  absenteeismRate: number;
  healthcareCostPerEmployee: number;
}

interface DepartmentComparisonProps {
  departments: DepartmentMetrics[];
  companyBenchmarks: CompanyBenchmarks;
  selectedMetric: 'participation' | 'health-score' | 'benefits-utilization' | 'preventive-care' | 'wellness-engagement' | 'absenteeism' | 'cost-per-employee';
  onMetricChange: (metric: string) => void;
  onExport?: () => void;
  onDepartmentSelect?: (department: string) => void;
}

export const DepartmentComparison: React.FC<DepartmentComparisonProps> = ({
  departments,
  companyBenchmarks,
  selectedMetric,
  onMetricChange,
  onExport,
  onDepartmentSelect
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'performance'>('performance');

  const metricConfig = {
    'participation': {
      label: 'Participation Rate',
      getValue: (dept: DepartmentMetrics) => dept.participationRate,
      getBenchmark: () => companyBenchmarks.participationRate,
      format: (value: number) => `${value.toFixed(1)}%`,
      isHigherBetter: true,
      icon: Users,
      color: '#3B82F6'
    },
    'health-score': {
      label: 'Average Health Score',
      getValue: (dept: DepartmentMetrics) => dept.averageHealthScore,
      getBenchmark: () => companyBenchmarks.averageHealthScore,
      format: (value: number) => value.toFixed(1),
      isHigherBetter: true,
      icon: TrendingUp,
      color: '#10B981'
    },
    'benefits-utilization': {
      label: 'Benefits Utilization',
      getValue: (dept: DepartmentMetrics) => dept.benefitsUtilization,
      getBenchmark: () => companyBenchmarks.benefitsUtilization,
      format: (value: number) => `${value.toFixed(1)}%`,
      isHigherBetter: true,
      icon: BarChart,
      color: '#8B5CF6'
    },
    'preventive-care': {
      label: 'Preventive Care Completion',
      getValue: (dept: DepartmentMetrics) => dept.preventiveCareCompletion,
      getBenchmark: () => companyBenchmarks.preventiveCareCompletion,
      format: (value: number) => `${value.toFixed(1)}%`,
      isHigherBetter: true,
      icon: TrendingUp,
      color: '#059669'
    },
    'wellness-engagement': {
      label: 'Wellness Program Engagement',
      getValue: (dept: DepartmentMetrics) => dept.wellnessProgramEngagement,
      getBenchmark: () => companyBenchmarks.wellnessProgramEngagement,
      format: (value: number) => `${value.toFixed(1)}%`,
      isHigherBetter: true,
      icon: TrendingUp,
      color: '#DC2626'
    },
    'absenteeism': {
      label: 'Absenteeism Rate',
      getValue: (dept: DepartmentMetrics) => dept.absenteeismRate,
      getBenchmark: () => companyBenchmarks.absenteeismRate,
      format: (value: number) => `${value.toFixed(1)}%`,
      isHigherBetter: false,
      icon: TrendingDown,
      color: '#F59E0B'
    },
    'cost-per-employee': {
      label: 'Healthcare Cost Per Employee',
      getValue: (dept: DepartmentMetrics) => dept.healthcareCostPerEmployee,
      getBenchmark: () => companyBenchmarks.healthcareCostPerEmployee,
      format: (value: number) => `$${value.toLocaleString()}`,
      isHigherBetter: false,
      icon: TrendingDown,
      color: '#EF4444'
    }
  };

  const currentConfig = metricConfig[selectedMetric];
  const benchmark = currentConfig.getBenchmark();

  const getSortedDepartments = () => {
    const sorted = [...departments];
    if (sortBy === 'performance') {
      sorted.sort((a, b) => {
        const aValue = currentConfig.getValue(a);
        const bValue = currentConfig.getValue(b);
        return currentConfig.isHigherBetter ? bValue - aValue : aValue - bValue;
      });
    } else {
      sorted.sort((a, b) => a.department.localeCompare(b.department));
    }
    return sorted;
  };

  const getPerformanceIndicator = (value: number, benchmark: number, isHigherBetter: boolean) => {
    const diff = value - benchmark;
    const percentage = Math.abs((diff / benchmark) * 100);
    
    if (Math.abs(diff) < benchmark * 0.05) {
      return { status: 'neutral', icon: Minus, color: '#6B7280', text: 'At Benchmark' };
    }
    
    if ((isHigherBetter && diff > 0) || (!isHigherBetter && diff < 0)) {
      return { 
        status: 'positive', 
        icon: TrendingUp, 
        color: '#10B981', 
        text: `${percentage.toFixed(1)}% above benchmark`
      };
    } else {
      return { 
        status: 'negative', 
        icon: TrendingDown, 
        color: '#EF4444', 
        text: `${percentage.toFixed(1)}% below benchmark`
      };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return { icon: TrendingUp, color: '#10B981' };
      case 'down':
        return { icon: TrendingDown, color: '#EF4444' };
      default:
        return { icon: Minus, color: '#6B7280' };
    }
  };

  const renderDepartmentCard = (dept: DepartmentMetrics) => {
    const value = currentConfig.getValue(dept);
    const performance = getPerformanceIndicator(value, benchmark, currentConfig.isHigherBetter);
    const trend = getTrendIcon(dept.trend);
    const TrendIcon = trend.icon;
    const PerformanceIcon = performance.icon;

    return (
      <TouchableOpacity
        key={dept.department}
        style={styles.departmentCard}
        onPress={() => onDepartmentSelect?.(dept.department)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.departmentName}>{dept.department}</Text>
          <View style={styles.employeeCount}>
            <Users size={14} color="#6B7280" />
            <Text style={styles.employeeCountText}>{dept.employeeCount}</Text>
          </View>
        </View>

        <View style={styles.cardMetrics}>
          <View style={styles.primaryMetric}>
            <Text style={[styles.metricValue, { color: currentConfig.color }]}>
              {currentConfig.format(value)}
            </Text>
            <Text style={styles.metricLabel}>{currentConfig.label}</Text>
          </View>

          <View style={styles.performanceIndicators}>
            <View style={styles.performanceItem}>
              <PerformanceIcon size={14} color={performance.color} />
              <Text style={[styles.performanceText, { color: performance.color }]}>
                vs Benchmark
              </Text>
            </View>
            
            <View style={styles.trendItem}>
              <TrendIcon size={14} color={trend.color} />
              <Text style={[styles.trendText, { color: trend.color }]}>
                {dept.trendPercentage > 0 ? '+' : ''}{dept.trendPercentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={styles.benchmarkLine} />
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((value / (benchmark * 1.5)) * 100, 100)}%`,
                  backgroundColor: currentConfig.color
                }
              ]}
            />
          </View>
          <Text style={styles.benchmarkLabel}>
            Benchmark: {currentConfig.format(benchmark)}
          </Text>
        </View>

        {dept.topRiskFactors.length > 0 && (
          <View style={styles.riskFactors}>
            <Text style={styles.riskFactorsTitle}>Top Risk Factors:</Text>
            <View style={styles.riskFactorsList}>
              {dept.topRiskFactors.slice(0, 2).map((factor, index) => (
                <View key={index} style={styles.riskFactorTag}>
                  <Text style={styles.riskFactorText}>{factor}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {dept.achievements.length > 0 && (
          <View style={styles.achievements}>
            <Text style={styles.achievementsTitle}>Recent Achievements:</Text>
            {dept.achievements.slice(0, 1).map((achievement, index) => (
              <Text key={index} style={styles.achievementText}>• {achievement}</Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Department Comparison</Text>
          <Text style={styles.subtitle}>Compare performance across departments</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onExport}>
            <Download size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Metric Selector */}
      <View style={styles.metricSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.metricButtons}>
            {Object.entries(metricConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.metricButton,
                    selectedMetric === key && styles.metricButtonActive
                  ]}
                  onPress={() => onMetricChange(key)}
                >
                  <IconComponent 
                    size={16} 
                    color={selectedMetric === key ? '#FFFFFF' : config.color} 
                  />
                  <Text style={[
                    styles.metricButtonText,
                    selectedMetric === key && styles.metricButtonTextActive
                  ]}>
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.viewModeSelector}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Text style={[
              styles.viewModeButtonText,
              viewMode === 'grid' && styles.viewModeButtonTextActive
            ]}>
              Grid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'chart' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('chart')}
          >
            <Text style={[
              styles.viewModeButtonText,
              viewMode === 'chart' && styles.viewModeButtonTextActive
            ]}>
              Chart
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortBy(sortBy === 'name' ? 'performance' : 'name')}
        >
          <Filter size={16} color="#6B7280" />
          <Text style={styles.sortButtonText}>
            Sort by {sortBy === 'name' ? 'Performance' : 'Name'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Company Benchmark Summary */}
      <View style={styles.benchmarkSummary}>
        <Text style={styles.benchmarkTitle}>Company Benchmark</Text>
        <View style={styles.benchmarkMetrics}>
          <View style={styles.benchmarkMetric}>
            <Text style={[styles.benchmarkValue, { color: currentConfig.color }]}>
              {currentConfig.format(benchmark)}
            </Text>
            <Text style={styles.benchmarkLabel}>{currentConfig.label}</Text>
          </View>
          <View style={styles.benchmarkStats}>
            <Text style={styles.benchmarkStat}>
              {departments.filter(d => {
                const value = currentConfig.getValue(d);
                return currentConfig.isHigherBetter ? value >= benchmark : value <= benchmark;
              }).length} / {departments.length} departments meeting benchmark
            </Text>
          </View>
        </View>
      </View>

      {/* Department Cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.departmentsGrid}>
          {getSortedDepartments().map(renderDepartmentCard)}
        </View>

        {/* Performance Insights */}
        <View style={styles.insights}>
          <Text style={styles.insightsTitle}>Performance Insights</Text>
          
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#10B981' }]}>
                <TrendingUp size={16} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Performer</Text>
                <Text style={styles.insightText}>
                  {getSortedDepartments()[0]?.department} leads in {currentConfig.label.toLowerCase()}
                </Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#F59E0B' }]}>
                <TrendingDown size={16} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Improvement Opportunity</Text>
                <Text style={styles.insightText}>
                  {getSortedDepartments()[getSortedDepartments().length - 1]?.department} has the most room for improvement
                </Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#3B82F6' }]}>
                <BarChart size={16} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Overall Performance</Text>
                <Text style={styles.insightText}>
                  {Math.round((departments.filter(d => {
                    const value = currentConfig.getValue(d);
                    return currentConfig.isHigherBetter ? value >= benchmark : value <= benchmark;
                  }).length / departments.length) * 100)}% of departments meet or exceed benchmark
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  metricSelector: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  metricButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  metricButtonActive: {
    backgroundColor: '#3B82F6',
  },
  metricButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  metricButtonTextActive: {
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewModeButtonActive: {
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
  viewModeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  viewModeButtonTextActive: {
    color: '#374151',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  benchmarkSummary: {
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
  benchmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  benchmarkMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benchmarkMetric: {
    alignItems: 'flex-start',
  },
  benchmarkValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  benchmarkLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  benchmarkStats: {
    alignItems: 'flex-end',
  },
  benchmarkStat: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  departmentsGrid: {
    padding: 16,
    gap: 16,
  },
  departmentCard: {
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
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  employeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  employeeCountText: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryMetric: {
    flex: 1,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  performanceIndicators: {
    alignItems: 'flex-end',
    gap: 8,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  benchmarkLine: {
    position: 'absolute',
    left: '66.67%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#374151',
  },
  riskFactors: {
    marginBottom: 12,
  },
  riskFactorsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  riskFactorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  riskFactorTag: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  riskFactorText: {
    fontSize: 10,
    color: '#991B1B',
    fontWeight: '500',
  },
  achievements: {
    marginBottom: 8,
  },
  achievementsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 11,
    color: '#059669',
    lineHeight: 16,
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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