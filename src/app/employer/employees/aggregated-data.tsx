import { BarChart3, Download, PieChart, RefreshCw, TrendingUp, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AggregatedData {
  totalEmployees: number;
  averageHealthScore: number;
  healthScoreChange: number;
  participationRate: number;
  benefitsUtilization: number;
  preventativeCareCompletion: number;
  averageAppointments: number;
  challengeParticipation: number;
  healthScoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  departmentMetrics: Array<{
    department: string;
    employeeCount: number;
    averageHealthScore: number;
    participationRate: number;
    benefitsUtilization: number;
  }>;
}

// Mock data to replace the failing hook
const mockAggregatedData: AggregatedData = {
  totalEmployees: 412,
  averageHealthScore: 84,
  healthScoreChange: 8,
  participationRate: 78,
  benefitsUtilization: 65,
  preventativeCareCompletion: 82,
  averageAppointments: 3.2,
  challengeParticipation: 64,
  healthScoreDistribution: [
    { range: '90-100', count: 89, percentage: 22 },
    { range: '80-89', count: 156, percentage: 38 },
    { range: '70-79', count: 98, percentage: 24 },
    { range: '60-69', count: 45, percentage: 11 },
    { range: '0-59', count: 24, percentage: 5 },
  ],
  departmentMetrics: [
    {
      department: 'Engineering',
      employeeCount: 142,
      averageHealthScore: 88,
      participationRate: 85,
      benefitsUtilization: 72,
    },
    {
      department: 'Sales',
      employeeCount: 78,
      averageHealthScore: 76,
      participationRate: 68,
      benefitsUtilization: 58,
    },
    {
      department: 'Marketing',
      employeeCount: 56,
      averageHealthScore: 82,
      participationRate: 74,
      benefitsUtilization: 66,
    },
    {
      department: 'HR',
      employeeCount: 18,
      averageHealthScore: 90,
      participationRate: 94,
      benefitsUtilization: 78,
    },
    {
      department: 'Operations',
      employeeCount: 118,
      averageHealthScore: 84,
      participationRate: 79,
      benefitsUtilization: 63,
    },
  ]
};

export default function AggregatedDataPage() {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAggregatedData(mockAggregatedData);
      setIsLoading(false);
    };

    loadData();
  }, [selectedTimeframe, selectedDepartment]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAggregatedData(mockAggregatedData);
    setIsRefreshing(false);
  };

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading employee data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Employee Health Analytics</Text>
            <Text style={styles.headerSubtitle}>
              Aggregated and anonymized employee health data
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={isRefreshing}
            style={styles.refreshButton}
          >
            <RefreshCw 
              size={24} 
              color="#6B7280"
              style={isRefreshing ? styles.spinning : undefined}
            />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersCard}>
          <Text style={styles.sectionTitle}>Filters</Text>
          
          <View style={styles.filtersContent}>
            {/* Timeframe Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Timeframe</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'month', label: 'Last Month' },
                  { key: 'quarter', label: 'Last Quarter' },
                  { key: 'year', label: 'Last Year' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setSelectedTimeframe(option.key as any)}
                    style={[
                      styles.filterOption,
                      selectedTimeframe === option.key && styles.selectedFilterOption
                    ]}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedTimeframe === option.key && styles.selectedFilterOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Department Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Department</Text>
              <View style={styles.departmentOptions}>
                {['all', 'engineering', 'sales', 'marketing', 'hr', 'operations'].map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    onPress={() => setSelectedDepartment(dept)}
                    style={[
                      styles.departmentOption,
                      selectedDepartment === dept && styles.selectedDepartmentOption
                    ]}
                  >
                    <Text style={[
                      styles.departmentOptionText,
                      selectedDepartment === dept && styles.selectedDepartmentOptionText
                    ]}>
                      {dept === 'all' ? 'All Departments' : dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Users size={20} color="#3B82F6" />
              <Text style={styles.metricLabel}>Total Employees</Text>
            </View>
            <Text style={styles.metricValue}>
              {aggregatedData?.totalEmployees || 0}
            </Text>
            <Text style={styles.metricSubtext}>
              Active participants
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.metricLabel}>Avg Health Score</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#059669' }]}>
              {aggregatedData?.averageHealthScore || 0}
            </Text>
            <Text style={styles.metricSubtext}>
              +{aggregatedData?.healthScoreChange || 0} from last period
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <BarChart3 size={20} color="#8B5CF6" />
              <Text style={styles.metricLabel}>Program Participation</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#7c3aed' }]}>
              {aggregatedData?.participationRate || 0}%
            </Text>
            <Text style={styles.metricSubtext}>
              Wellness program engagement
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <PieChart size={20} color="#F59E0B" />
              <Text style={styles.metricLabel}>Benefits Utilization</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#d97706' }]}>
              {aggregatedData?.benefitsUtilization || 0}%
            </Text>
            <Text style={styles.metricSubtext}>
              Of available benefits used
            </Text>
          </View>
        </View>

        {/* Health Score Distribution */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Health Score Distribution</Text>
          
          <View style={styles.distributionList}>
            {aggregatedData?.healthScoreDistribution?.map((range, index) => (
              <View key={index} style={styles.distributionItem}>
                <Text style={styles.rangeLabel}>
                  {range.range}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${range.percentage}%` }
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.countText}>
                  {range.count}
                </Text>
                <Text style={styles.percentageText}>
                  ({range.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Department Comparison */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Department Health Metrics</Text>
          
          <View style={styles.departmentList}>
            {aggregatedData?.departmentMetrics?.map((dept, index) => (
              <View key={index} style={styles.departmentItem}>
                <View style={styles.departmentHeader}>
                  <Text style={styles.departmentName}>
                    {dept.department}
                  </Text>
                  <Text style={styles.employeeCount}>
                    {dept.employeeCount} employees
                  </Text>
                </View>
                
                <View style={styles.departmentMetrics}>
                  <View style={styles.departmentMetric}>
                    <Text style={styles.departmentMetricLabel}>Avg Health Score</Text>
                    <Text style={[styles.departmentMetricValue, { color: '#2563eb' }]}>
                      {dept.averageHealthScore}
                    </Text>
                  </View>
                  <View style={styles.departmentMetric}>
                    <Text style={styles.departmentMetricLabel}>Participation</Text>
                    <Text style={[styles.departmentMetricValue, { color: '#059669' }]}>
                      {dept.participationRate}%
                    </Text>
                  </View>
                  <View style={styles.departmentMetric}>
                    <Text style={styles.departmentMetricLabel}>Benefits Usage</Text>
                    <Text style={[styles.departmentMetricValue, { color: '#7c3aed' }]}>
                      {dept.benefitsUtilization}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trends */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Health Trends</Text>
          
          <View style={styles.trendsList}>
            <View style={[styles.trendItem, { backgroundColor: '#f0fdf4' }]}>
              <View style={styles.trendContent}>
                <Text style={[styles.trendTitle, { color: '#166534' }]}>
                  Preventative Care Completion
                </Text>
                <Text style={[styles.trendSubtext, { color: '#16a34a' }]}>
                  +12% increase this quarter
                </Text>
              </View>
              <Text style={[styles.trendValue, { color: '#16a34a' }]}>
                {aggregatedData?.preventativeCareCompletion || 0}%
              </Text>
            </View>

            <View style={[styles.trendItem, { backgroundColor: '#eff6ff' }]}>
              <View style={styles.trendContent}>
                <Text style={[styles.trendTitle, { color: '#1e40af' }]}>
                  Average Appointments per Employee
                </Text>
                <Text style={[styles.trendSubtext, { color: '#2563eb' }]}>
                  Above industry average
                </Text>
              </View>
              <Text style={[styles.trendValue, { color: '#2563eb' }]}>
                {aggregatedData?.averageAppointments || 0}
              </Text>
            </View>

            <View style={[styles.trendItem, { backgroundColor: '#fffbeb' }]}>
              <View style={styles.trendContent}>
                <Text style={[styles.trendTitle, { color: '#92400e' }]}>
                  Challenge Participation
                </Text>
                <Text style={[styles.trendSubtext, { color: '#d97706' }]}>
                  Steady growth trend
                </Text>
              </View>
              <Text style={[styles.trendValue, { color: '#d97706' }]}>
                {aggregatedData?.challengeParticipation || 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Export Actions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          
          <View style={styles.exportList}>
            <TouchableOpacity 
              style={styles.exportItem}
              onPress={() => handleExport('health-metrics')}
            >
              <View style={styles.exportContent}>
                <Text style={styles.exportTitle}>
                  Health Metrics Report
                </Text>
                <Text style={styles.exportDescription}>
                  Comprehensive health analytics and trends
                </Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.exportItem}
              onPress={() => handleExport('department-comparison')}
            >
              <View style={styles.exportContent}>
                <Text style={styles.exportTitle}>
                  Department Comparison
                </Text>
                <Text style={styles.exportDescription}>
                  Anonymized department-level insights
                </Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.exportItem}
              onPress={() => handleExport('utilization-trends')}
            >
              <View style={styles.exportContent}>
                <Text style={styles.exportTitle}>
                  Utilization Trends
                </Text>
                <Text style={styles.exportDescription}>
                  Benefits and program utilization over time
                </Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>
            Privacy & Compliance
          </Text>
          <Text style={styles.privacyText}>
            All data shown is aggregated and anonymized in compliance with HIPAA regulations. 
            Individual employee health information is never accessible through this dashboard.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollContainer: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
  },
  spinning: {
    // Add animation if needed
  },
  filtersCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  filtersContent: {
    gap: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  selectedFilterOption: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  departmentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentOption: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  selectedDepartmentOption: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  departmentOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  selectedDepartmentOptionText: {
    color: 'white',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    width: '48%',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 24,
  },
  distributionList: {
    gap: 12,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontSize: 14,
    color: '#374151',
    width: 60,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    width: 40,
    textAlign: 'right',
  },
  percentageText: {
    fontSize: 14,
    color: '#6b7280',
    width: 50,
    textAlign: 'right',
  },
  departmentList: {
    gap: 16,
  },
  departmentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 16,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  employeeCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  departmentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  departmentMetric: {
    alignItems: 'center',
  },
  departmentMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  departmentMetricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendsList: {
    gap: 16,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  trendContent: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  trendSubtext: {
    fontSize: 14,
  },
  trendValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exportList: {
    gap: 12,
  },
  exportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  exportContent: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  exportDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  privacyNotice: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#1d4ed8',
  },
});