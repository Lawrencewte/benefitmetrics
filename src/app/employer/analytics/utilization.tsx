import { AlertTriangle, Check, Filter } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

// Mock data - replace with actual service call later
const mockUtilizationData = {
  overview: {
    overallRate: 0.63,
    categories: [
      { name: 'Preventative Care', value: 0.78, color: '#10b981' },
      { name: 'Dental Services', value: 0.72, color: '#10b981' },
      { name: 'Vision Services', value: 0.64, color: '#f59e0b' },
      { name: 'Mental Health', value: 0.45, color: '#ef4444' },
      { name: 'Wellness Programs', value: 0.38, color: '#ef4444' },
      { name: 'Specialty Care', value: 0.28, color: '#ef4444' },
    ],
    opportunities: [
      {
        title: 'Low Skin Cancer Screening Rate',
        description: 'Only 28% of eligible employees have completed recommended skin cancer screenings',
        impact: 'Potential Savings: $45,800',
        severity: 'high'
      },
      {
        title: 'Mental Health Benefit Underutilization',
        description: '45% utilization despite full coverage. High stress indicators in employee surveys.',
        impact: 'Potential Productivity Impact: 12% increase',
        severity: 'high'
      },
      {
        title: 'Sales Team Preventative Care',
        description: 'Sales department has lowest preventative care completion rate at 58%',
        impact: 'Potential Savings: $28,600',
        severity: 'medium'
      }
    ]
  },
  byService: [
    { name: 'Annual Physicals', value: 0.78, status: 'good' },
    { name: 'Dental Checkups', value: 0.65, status: 'good' },
    { name: 'Eye Exams', value: 0.42, status: 'warning' },
    { name: 'Skin Checks', value: 0.28, status: 'poor' },
    { name: 'Mental Health Checkups', value: 0.23, status: 'poor' },
    { name: 'Vaccinations', value: 0.81, status: 'good' },
  ],
  byDepartment: [
    { rank: 1, name: 'Engineering', value: 0.82 },
    { rank: 2, name: 'Product', value: 0.79 },
    { rank: 3, name: 'Marketing', value: 0.74 },
    { rank: 4, name: 'Finance', value: 0.71 },
    { rank: 5, name: 'HR', value: 0.68 },
    { rank: 6, name: 'Sales', value: 0.58 },
  ],
  trends: {
    growing: [
      { name: 'Annual Physicals', change: 15 },
      { name: 'Vaccinations', change: 12 },
      { name: 'Dental Services', change: 8 },
    ],
    declining: [
      { name: 'Mental Health Services', change: -3 },
      { name: 'Specialty Care Referrals', change: -2 },
    ]
  }
};

const UtilizationAnalytics = () => {
  const [utilizationData, setUtilizationData] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [timeRange, setTimeRange] = useState('year');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUtilizationData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUtilizationData(mockUtilizationData);
        setError(null);
      } catch (err) {
        setError('Failed to load utilization data');
        console.error('Error fetching utilization data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilizationData();
  }, [selectedView, timeRange]);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleExportData = () => {
    console.log('Exporting utilization data...');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <Check size={16} color="#10b981" />;
      case 'warning':
        return <Check size={16} color="#f59e0b" />;
      case 'poor':
        return <AlertTriangle size={16} color="#ef4444" />;
      default:
        return <Check size={16} color="#10b981" />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Utilization Analytics" />
        <View style={styles.loadingContainer}>
          <Text>Loading utilization data...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Utilization Analytics" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={() => setSelectedView(selectedView)} />
        </View>
        <EmployerFooter />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Utilization Analytics" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Benefits Utilization Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Monitor and optimize employee benefits usage across your organization
          </Text>
        </View>

        <View style={styles.viewSelector}>
          <Button 
            title="Overview" 
            variant={selectedView === 'overview' ? "primary" : "outline"} 
            onPress={() => handleViewChange('overview')}
            style={styles.viewButton}
          />
          <Button 
            title="By Service" 
            variant={selectedView === 'byService' ? "primary" : "outline"} 
            onPress={() => handleViewChange('byService')}
            style={styles.viewButton}
          />
          <Button 
            title="By Department" 
            variant={selectedView === 'byDepartment' ? "primary" : "outline"} 
            onPress={() => handleViewChange('byDepartment')}
            style={styles.viewButton}
          />
          <Button 
            title="Trends" 
            variant={selectedView === 'trends' ? "primary" : "outline"} 
            onPress={() => handleViewChange('trends')}
            style={styles.viewButton}
          />
        </View>

        <View style={styles.timeSelector}>
          <Text style={styles.sectionTitle}>Time Range:</Text>
          <View style={styles.timeOptions}>
            <Button 
              title="Quarter" 
              variant={timeRange === 'quarter' ? "primary" : "outline"} 
              onPress={() => handleTimeRangeChange('quarter')}
              style={styles.timeButton}
            />
            <Button 
              title="Year" 
              variant={timeRange === 'year' ? "primary" : "outline"} 
              onPress={() => handleTimeRangeChange('year')}
              style={styles.timeButton}
            />
            <Button 
              title="All Time" 
              variant={timeRange === 'allTime' ? "primary" : "outline"} 
              onPress={() => handleTimeRangeChange('allTime')}
              style={styles.timeButton}
            />
          </View>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Overall Utilization Rate</Text>
            <Text style={styles.summaryValue}>63%</Text>
          </View>
          <ProgressBar progress={utilizationData?.overview?.overallRate || 0.63} color="#3b82f6" />
          <Text style={styles.summaryText}>
            Your organization's benefits utilization is <Text style={styles.highlight}>8% below</Text> the industry average
          </Text>
          <View style={styles.potentialSavings}>
            <AlertTriangle size={20} color="#f59e0b" />
            <Text style={styles.savingsText}>
              $182,500 in unrealized benefits value
            </Text>
          </View>
        </Card>

        {selectedView === 'overview' && utilizationData?.overview && (
          <>
            <Text style={styles.sectionTitle}>Benefits Category Usage</Text>
            <Card style={styles.card}>
              {utilizationData.overview.categories.map((category, index) => (
                <View key={index}>
                  <View style={styles.categoryRow}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryValue}>{Math.round(category.value * 100)}%</Text>
                  </View>
                  <ProgressBar progress={category.value} color={category.color} />
                </View>
              ))}
            </Card>

            <Text style={styles.sectionTitle}>Optimization Opportunities</Text>
            <Card style={styles.card}>
              {utilizationData.overview.opportunities.map((opportunity, index) => (
                <View key={index} style={styles.opportunityItem}>
                  <View style={styles.opportunityHeader}>
                    <AlertTriangle size={18} color={opportunity.severity === 'high' ? "#ef4444" : "#f59e0b"} />
                    <Text style={styles.opportunityTitle}>
                      {opportunity.title}
                    </Text>
                  </View>
                  <Text style={styles.opportunityText}>
                    {opportunity.description}
                  </Text>
                  <Text style={styles.opportunityImpact}>
                    {opportunity.impact}
                  </Text>
                  <Button 
                    title="Create Targeted Campaign" 
                    variant="primary"
                    onPress={() => console.log('Create targeted campaign')}
                    style={styles.opportunityButton}
                  />
                </View>
              ))}
            </Card>
          </>
        )}

        {selectedView === 'byService' && utilizationData?.byService && (
          <>
            <Text style={styles.sectionTitle}>Preventative Services Completion</Text>
            <Card style={styles.card}>
              <View style={styles.filterRow}>
                <Filter size={16} color="#666" />
                <Text style={styles.filterLabel}>Filter by service type</Text>
              </View>
              
              {utilizationData.byService.map((service, index) => (
                <View key={index} style={styles.serviceRow}>
                  <View style={styles.serviceNameContainer}>
                    {getStatusIcon(service.status)}
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </View>
                  <Text style={styles.serviceValue}>{Math.round(service.value * 100)}%</Text>
                </View>
              ))}
            </Card>

            <Text style={styles.sectionTitle}>Service Utilization Over Time</Text>
            <Card style={styles.card}>
              <View style={styles.chartPlaceholder}>
                <Text>Service Utilization Trend Chart</Text>
                <Text style={styles.chartNote}>Chart component would be integrated here</Text>
              </View>
            </Card>
          </>
        )}

        {selectedView === 'byDepartment' && utilizationData?.byDepartment && (
          <>
            <Text style={styles.sectionTitle}>Department Utilization Rankings</Text>
            <Card style={styles.card}>
              {utilizationData.byDepartment.map((dept, index) => (
                <View key={index} style={styles.departmentRow}>
                  <Text style={styles.departmentRank}>{dept.rank}</Text>
                  <Text style={styles.departmentName}>{dept.name}</Text>
                  <Text style={[
                    styles.departmentValue, 
                    dept.value < 0.6 ? styles.lowValue : null
                  ]}>
                    {Math.round(dept.value * 100)}%
                  </Text>
                </View>
              ))}
            </Card>

            <Text style={styles.sectionTitle}>Department Breakdown</Text>
            <Card style={styles.card}>
              <View style={styles.departmentSelector}>
                <Text>View department: </Text>
                <Button 
                  title="Sales" 
                  variant="outline"
                  onPress={() => console.log('View Sales department')}
                />
              </View>
              
              <Text style={styles.departmentSubtitle}>
                Sales Department Utilization (58%)
              </Text>
              
              <View style={styles.departmentBreakdown}>
                {[
                  { label: 'Annual Physicals', value: 0.65, color: '#f59e0b' },
                  { label: 'Dental Checkups', value: 0.52, color: '#ef4444' },
                  { label: 'Eye Exams', value: 0.35, color: '#ef4444' },
                  { label: 'Mental Health', value: 0.18, color: '#ef4444' },
                ].map((item, index) => (
                  <View key={index} style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>{item.label}</Text>
                    <Text style={styles.breakdownValue}>{Math.round(item.value * 100)}%</Text>
                    <ProgressBar progress={item.value} color={item.color} />
                  </View>
                ))}
              </View>
              
              <Button 
                title="Create Department Action Plan" 
                variant="primary"
                onPress={() => console.log('Create department action plan')}
              />
            </Card>
          </>
        )}

        {selectedView === 'trends' && utilizationData?.trends && (
          <>
            <Text style={styles.sectionTitle}>Utilization Trends</Text>
            <Card style={styles.card}>
              <View style={styles.chartPlaceholder}>
                <Text>Utilization Trends Chart</Text>
                <Text style={styles.chartNote}>Chart component would be integrated here</Text>
              </View>
              
              <Text style={styles.trendAnalysis}>
                <Text style={styles.highlight}>Analysis:</Text> Overall utilization has improved 8% over the past year, with the most significant gains in preventative care utilization (+15%). Mental health services continue to show the lowest adoption despite awareness campaigns.
              </Text>
            </Card>

            <Text style={styles.sectionTitle}>Top Growing & Declining Services</Text>
            <Card style={styles.card}>
              <Text style={styles.trendsSubtitle}>Top Growing Services</Text>
              {utilizationData.trends.growing.map((trend, index) => (
                <View key={index} style={styles.trendRow}>
                  <Text style={styles.trendName}>{trend.name}</Text>
                  <View style={styles.trendValueContainer}>
                    <Text style={[styles.trendValue, styles.growthValue]}>+{trend.change}%</Text>
                  </View>
                </View>
              ))}
              
              <Text style={styles.trendsSubtitle}>Declining Services</Text>
              {utilizationData.trends.declining.map((trend, index) => (
                <View key={index} style={styles.trendRow}>
                  <Text style={styles.trendName}>{trend.name}</Text>
                  <View style={styles.trendValueContainer}>
                    <Text style={[styles.trendValue, styles.declineValue]}>{trend.change}%</Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

        <View style={styles.actionRow}>
          <Button 
            title="Export Data" 
            onPress={handleExportData}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button 
            title="Schedule Report" 
            onPress={() => console.log('Schedule report')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
      <EmployerFooter />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  viewSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  viewButton: {
    minWidth: 80,
  },
  timeSelector: {
    marginBottom: 16,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  timeButton: {
    minWidth: 70,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  potentialSavings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderRadius: 4,
    gap: 8,
  },
  savingsText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  opportunityItem: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
    marginBottom: 12,
  },
  opportunityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  opportunityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  opportunityImpact: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 12,
  },
  opportunityButton: {
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
  },
  serviceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    marginBottom: 12,
  },
  chartNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  departmentRank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  departmentName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  departmentValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  lowValue: {
    color: '#ef4444',
  },
  departmentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  departmentSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  departmentBreakdown: {
    marginBottom: 16,
    gap: 12,
  },
  breakdownItem: {
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  trendAnalysis: {
    fontSize: 14,
    color: '#666',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    marginTop: 12,
  },
  trendsSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trendName: {
    fontSize: 14,
    color: '#333',
  },
  trendValueContainer: {
    borderRadius: 4,
    padding: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  growthValue: {
    color: '#10b981',
  },
  declineValue: {
    color: '#ef4444',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
});

export default UtilizationAnalytics;