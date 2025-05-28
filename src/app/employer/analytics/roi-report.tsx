import { Calendar, Clock, DollarSign, Download, Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import { getROIReport } from '../../../services/employer/analytics';

const ROIReport = () => {
  const [reportData, setReportData] = useState(null);
  const [timeframe, setTimeframe] = useState('yearly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock ROI report data
  const mockReportData = {
    yearly: {
      totalSavings: 406720,
      roiRatio: 14.5,
      programInvestment: 28050,
      savingsBreakdown: {
        healthcareCosts: 245800,
        absenteeism: 98500,
        productivity: 62420
      },
      participation: {
        enrolled: 328,
        total: 412,
        averageSavingsPerEmployee: 1240,
        absenteeismReduction: 27,
        costReduction: 16
      },
      departmentBreakdown: [
        { name: 'Engineering', savings: 156300, participation: 82 },
        { name: 'Sales', savings: 98520, participation: 58 },
        { name: 'Marketing', savings: 75640, participation: 74 },
        { name: 'Customer Support', savings: 67290, participation: 71 },
        { name: 'Human Resources', savings: 8970, participation: 85 }
      ]
    },
    quarterly: {
      totalSavings: 101680,
      roiRatio: 13.8,
      programInvestment: 7365,
      savingsBreakdown: {
        healthcareCosts: 61450,
        absenteeism: 24625,
        productivity: 15605
      },
      participation: {
        enrolled: 328,
        total: 412,
        averageSavingsPerEmployee: 310,
        absenteeismReduction: 22,
        costReduction: 14
      },
      departmentBreakdown: [
        { name: 'Engineering', savings: 39075, participation: 82 },
        { name: 'Sales', savings: 24630, participation: 58 },
        { name: 'Marketing', savings: 18910, participation: 74 },
        { name: 'Customer Support', savings: 16823, participation: 71 },
        { name: 'Human Resources', savings: 2242, participation: 85 }
      ]
    }
  };

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const data = await getROIReport(timeframe);
        setReportData(data || mockReportData[timeframe]);
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data as fallback
        setReportData(mockReportData[timeframe]);
      }
    } catch (err) {
      console.error('Error in fetchReportData:', err);
      // Even if there's an error, show mock data
      setReportData(mockReportData[timeframe]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeframe]);

  const handleExportReport = () => {
    console.log('Exporting report...');
    // Implementation for exporting report functionality
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleRetry = () => {
    fetchReportData();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="ROI Analysis Report" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading report data...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  const data = reportData || mockReportData[timeframe];
  const participationRate = Math.round((data.participation.enrolled / data.participation.total) * 100);

  return (
    <View style={styles.container}>
      <Header title="ROI Analysis Report" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderText}>
            <Text style={styles.reportTitle}>Healthcare ROI Report</Text>
            <Text style={styles.reportSubtitle}>
              Financial impact analysis of your company's preventative healthcare program
            </Text>
          </View>
          <Button 
            icon={<Download size={18} />}
            title="Export" 
            onPress={handleExportReport}
            variant="outline"
          />
        </View>

        <View style={styles.timeframeSelector}>
          <Text style={styles.sectionTitle}>Timeframe:</Text>
          <View style={styles.timeframeOptions}>
            <Button 
              title="Quarterly" 
              variant={timeframe === 'quarterly' ? "primary" : "outline"} 
              onPress={() => handleTimeframeChange('quarterly')}
              style={styles.timeframeButton}
            />
            <Button 
              title="Yearly" 
              variant={timeframe === 'yearly' ? "primary" : "outline"} 
              onPress={() => handleTimeframeChange('yearly')}
              style={styles.timeframeButton}
            />
            <Button 
              title="All Time" 
              variant={timeframe === 'allTime' ? "primary" : "outline"} 
              onPress={() => handleTimeframeChange('allTime')}
              style={styles.timeframeButton}
            />
          </View>
        </View>

        <Card style={styles.topCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Healthcare Savings</Text>
              <View style={styles.statValueContainer}>
                <DollarSign size={24} color="#16a34a" />
                <Text style={[styles.statValue, styles.savingsValue]}>
                  ${data.totalSavings.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>ROI Ratio</Text>
              <Text style={styles.statValue}>{data.roiRatio}:1</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Program Investment</Text>
              <Text style={styles.statValue}>${data.programInvestment.toLocaleString()}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Savings Breakdown</Text>
        <Card style={styles.card}>
          <View style={styles.savingsBreakdown}>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsLabel}>Reduced Healthcare Costs</Text>
              <Text style={styles.savingsValue}>${data.savingsBreakdown.healthcareCosts.toLocaleString()}</Text>
            </View>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsLabel}>Reduced Absenteeism</Text>
              <Text style={styles.savingsValue}>${data.savingsBreakdown.absenteeism.toLocaleString()}</Text>
            </View>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsLabel}>Productivity Improvements</Text>
              <Text style={styles.savingsValue}>${data.savingsBreakdown.productivity.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              📊 Savings Distribution Chart
            </Text>
            <Text style={styles.chartPlaceholderSubtext}>
              Healthcare: {Math.round((data.savingsBreakdown.healthcareCosts / data.totalSavings) * 100)}% | 
              Absenteeism: {Math.round((data.savingsBreakdown.absenteeism / data.totalSavings) * 100)}% | 
              Productivity: {Math.round((data.savingsBreakdown.productivity / data.totalSavings) * 100)}%
            </Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Participation Metrics</Text>
        <Card style={styles.card}>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Program Participation</Text>
              <Text style={styles.metricValue}>
                {data.participation.enrolled}/{data.participation.total} employees
              </Text>
              <Text style={styles.metricSubtext}>{participationRate}% participation rate</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Average Savings Per Employee</Text>
              <Text style={styles.metricValue}>${data.participation.averageSavingsPerEmployee.toLocaleString()}</Text>
              <Text style={styles.metricSubtext}>Per participating employee</Text>
            </View>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Reduced Absenteeism</Text>
              <Text style={styles.metricValue}>{data.participation.absenteeismReduction}%</Text>
              <Text style={styles.metricSubtext}>Compared to baseline</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Healthcare Cost Reduction</Text>
              <Text style={styles.metricValue}>{data.participation.costReduction}%</Text>
              <Text style={styles.metricSubtext}>Per participant</Text>
            </View>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              📈 Participation Trends Chart
            </Text>
            <Text style={styles.chartPlaceholderSubtext}>
              Showing growth in participation and ROI over time
            </Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Trends Over Time</Text>
        <Card style={styles.card}>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              📉 ROI Trends Line Chart
            </Text>
            <Text style={styles.chartPlaceholderSubtext}>
              Monthly ROI progression showing consistent improvement
            </Text>
          </View>
          <View style={styles.trendsFooter}>
            <Text style={styles.trendsNote}>
              Note: Projections shown for Q3-Q4 2025 based on current participation trends.
            </Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Department Breakdown</Text>
        <Card style={styles.card}>
          <View style={styles.filterRow}>
            <Filter size={16} color="#666" />
            <Text style={styles.filterLabel}>Department performance comparison</Text>
          </View>
          
          {data.departmentBreakdown.map((dept, index) => (
            <View key={index} style={styles.departmentRow}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{dept.name}</Text>
                <Text style={styles.departmentParticipation}>
                  {dept.participation}% participation
                </Text>
              </View>
              <Text style={styles.departmentValue}>
                ${dept.savings.toLocaleString()}
              </Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Key Insights & Recommendations</Text>
        <Card style={styles.card}>
          <Text style={styles.insightTitle}>Top Insights:</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              Sales department has lowest preventative care completion (58%) but highest potential ROI impact
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              Early detection screenings generated 3.2x higher ROI than general wellness activities
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              Employees who completed all recommended screenings averaged 46% lower healthcare costs
            </Text>
          </View>

          <Text style={styles.insightTitle}>Recommendations:</Text>
          <View style={styles.recommendationItem}>
            <Text style={styles.insightText}>
              Focus on increasing Sales team preventative care completion through targeted campaigns
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.insightText}>
              Implement additional early detection incentives to maximize ROI
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.insightText}>
              Schedule quarterly ROI reviews with department heads to increase accountability
            </Text>
          </View>
        </Card>

        <View style={styles.scheduleRow}>
          <Button 
            icon={<Calendar size={18} />}
            title="Schedule Regular Report" 
            onPress={() => console.log('Schedule report')}
            variant="outline"
            style={styles.scheduleButton}
          />
          <Button 
            icon={<Clock size={18} />}
            title="Custom Date Range" 
            onPress={() => console.log('Custom date range')}
            variant="outline"
            style={styles.scheduleButton}
          />
        </View>

        {/* Bottom padding to prevent content being hidden behind footer */}
        <View style={styles.bottomPadding} />
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
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  reportHeaderText: {
    flex: 1,
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  reportSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  timeframeSelector: {
    marginBottom: 20,
  },
  timeframeOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  timeframeButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  topCard: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  savingsValue: {
    color: '#16a34a',
  },
  card: {
    marginBottom: 20,
  },
  savingsBreakdown: {
    marginBottom: 16,
  },
  savingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  savingsLabel: {
    fontSize: 16,
    color: '#333',
  },
  chartPlaceholder: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    padding: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#888',
  },
  trendsFooter: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  trendsNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  departmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  departmentParticipation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  departmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  insightItem: {
    backgroundColor: '#e0f2fe',
    borderLeftWidth: 4,
    borderLeftColor: '#0369a1',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  recommendationItem: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  scheduleRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },
  scheduleButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ROIReport;