import { Calendar, Filter } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import Modal from '../../../components/Common/ui/Modal';

// Mock data to replace failing service calls
const mockTemplateData = [
  {
    id: 1,
    name: 'Preventative Care Completion',
    description: 'Overview of preventative care completion rates across the organization',
    metrics: ['Completion by Service', 'Completion by Department', 'Trends'],
    lastUpdated: '2025-05-18',
  },
  {
    id: 2,
    name: 'Mental Health Utilization',
    description: 'Analysis of mental health benefit utilization and effectiveness',
    metrics: ['Service Utilization', 'Department Analysis', 'Wellness Impact'],
    lastUpdated: '2025-05-15',
  },
  {
    id: 3,
    name: 'ROI Comprehensive Report',
    description: 'Full financial analysis of healthcare program ROI',
    metrics: ['Cost Savings', 'Productivity Impact', 'Absenteeism', 'Department Breakdown'],
    lastUpdated: '2025-05-10',
  },
  {
    id: 4,
    name: 'Quarterly Benefits Review',
    description: 'Quarterly summary of all benefits utilization and impact',
    metrics: ['Utilization Trends', 'Cost Analysis', 'Employee Satisfaction'],
    lastUpdated: '2025-05-01',
  },
];

const mockSavedReportData = [
  {
    id: 1,
    name: 'Q1 2025 Prevention Report',
    description: 'Preventative care analysis for Q1 2025',
    created: '2025-04-02',
    scheduled: true,
    frequency: 'Quarterly',
  },
  {
    id: 2,
    name: 'Engineering Department Analysis',
    description: 'Special health analysis for Engineering team',
    created: '2025-04-15',
    scheduled: false,
    frequency: 'One-time',
  },
  {
    id: 3,
    name: 'Year-End ROI Summary 2024',
    description: 'Complete ROI analysis for fiscal year 2024',
    created: '2025-01-10',
    scheduled: false,
    frequency: 'One-time',
  },
  {
    id: 4,
    name: 'Monthly Executive Dashboard',
    description: 'Executive summary of key health metrics',
    created: '2025-05-01',
    scheduled: true,
    frequency: 'Monthly',
  },
];

const CustomReports = () => {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [savedReports, setSavedReports] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState('One-time');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReportTemplates(mockTemplateData);
        setSavedReports(mockSavedReportData);
        setError(null);
      } catch (err) {
        setError('Failed to load report data');
        console.error('Error fetching report data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleCreateNewReport = () => {
    setShowCreateModal(true);
  };

  const handleSaveReport = () => {
    setShowCreateModal(false);
    console.log('Saving new report...');
  };

  const handleViewReport = (reportId) => {
    console.log(`Viewing report ${reportId}...`);
  };

  const handleExportReport = (reportId) => {
    console.log(`Exporting report ${reportId}...`);
  };

  // Define inline styles for React Native Web compatibility
  const containerStyle = {
    flex: 1,
    backgroundColor: '#f5f5f5',
  };

  const scrollContainerStyle = {
    flex: 1,
    padding: 16,
  };

  const loadingContainerStyle = {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const errorContainerStyle = {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  };

  const errorTextStyle = {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center' as const,
  };

  const headerContainerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 20,
  };

  const headerTextStyle = {
    flex: 1,
  };

  const pageTitleStyle = {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#333',
  };

  const pageSubtitleStyle = {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  };

  const newReportButtonStyle = {
    minWidth: 120,
  };

  const tabContainerStyle = {
    flexDirection: 'row' as const,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  };

  const tabButtonStyle = {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  };

  const activeTabButtonStyle = {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  };

  const tabTextStyle = {
    fontSize: 16,
    color: '#666',
  };

  const activeTabTextStyle = {
    fontWeight: 'bold' as const,
    color: '#3b82f6',
  };

  const searchContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    paddingHorizontal: 12,
  };

  const searchInputStyle = {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  };

  const filterContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 12,
    gap: 4,
  };

  const filterTextStyle = {
    fontSize: 14,
    color: '#666',
  };

  const templateCardStyle = {
    marginBottom: 16,
    padding: 16,
  };

  const templateHeaderStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  };

  const templateNameStyle = {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
    flex: 1,
  };

  const lastUpdatedContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  };

  const lastUpdatedTextStyle = {
    fontSize: 12,
    color: '#666',
  };

  const templateDescriptionStyle = {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  };

  const metricsContainerStyle = {
    marginBottom: 16,
  };

  const metricsLabelStyle = {
    fontSize: 14,
    fontWeight: 'bold' as const,
    marginBottom: 8,
    color: '#333',
  };

  const metricsListStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  };

  const metricBadgeStyle = {
    backgroundColor: '#e0f2fe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  };

  const metricTextStyle = {
    fontSize: 12,
    color: '#0284c7',
  };

  const templateActionsStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    gap: 8,
  };

  const actionButtonStyle = {
    minWidth: 100,
  };

  const reportCardStyle = {
    marginBottom: 16,
    padding: 16,
  };

  const reportHeaderStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  };

  const reportNameStyle = {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
    flex: 1,
  };

  const scheduleBadgeStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 4,
  };

  const scheduleTextStyle = {
    fontSize: 12,
    color: '#3b82f6',
  };

  const reportDescriptionStyle = {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  };

  const reportDateStyle = {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  };

  const reportActionsStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
    gap: 8,
  };

  const reportActionButtonStyle = {
    minWidth: 80,
  };

  const modalContentStyle = {
    padding: 16,
  };

  const formGroupStyle = {
    marginBottom: 16,
  };

  const formLabelStyle = {
    fontSize: 14,
    fontWeight: 'bold' as const,
    marginBottom: 8,
    color: '#333',
  };

  const formInputStyle = {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    backgroundColor: '#fff',
  };

  const textAreaStyle = {
    height: 100,
    textAlignVertical: 'top' as const,
  };

  const metricOptionsStyle = {
    gap: 8,
  };

  const metricOptionStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  };

  const checkboxStyle = {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 2,
    marginRight: 12,
  };

  const metricOptionTextStyle = {
    fontSize: 14,
    color: '#374151',
  };

  const scheduleOptionsStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  };

  const scheduleOptionStyle = {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  };

  const selectedScheduleOptionStyle = {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  };

  const scheduleOptionTextStyle = {
    fontSize: 14,
    color: '#374151',
  };

  const selectedScheduleOptionTextStyle = {
    color: 'white',
  };

  const modalActionsStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    marginTop: 20,
    gap: 8,
  };

  const modalButtonStyle = {
    minWidth: 120,
  };

  if (isLoading) {
    return (
      <SafeAreaView style={containerStyle}>
        <Header title="Custom Reports" />
        <View style={loadingContainerStyle}>
          <Text>Loading report data...</Text>
        </View>
        <EmployerFooter />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={containerStyle}>
        <Header title="Custom Reports" />
        <View style={errorContainerStyle}>
          <Text style={errorTextStyle}>{error}</Text>
          <Button title="Retry" onPress={() => setError(null)} />
        </View>
        <EmployerFooter />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <Header title="Custom Reports" />
      <ScrollView style={scrollContainerStyle}>
        <View style={headerContainerStyle}>
          <View style={headerTextStyle}>
            <Text style={pageTitleStyle}>Report Builder</Text>
            <Text style={pageSubtitleStyle}>
              Create and manage custom reports for your organization's health metrics
            </Text>
          </View>
          <Button 
            title="New Report" 
            onPress={handleCreateNewReport}
            variant="primary"
            style={newReportButtonStyle}
          />
        </View>

        <View style={tabContainerStyle}>
          <TouchableOpacity 
            style={[
              tabButtonStyle, 
              activeTab === 'templates' && activeTabButtonStyle
            ]}
            onPress={() => setActiveTab('templates')}
          >
            <Text 
              style={[
                tabTextStyle,
                activeTab === 'templates' && activeTabTextStyle
              ]}
            >
              Report Templates
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              tabButtonStyle, 
              activeTab === 'saved' && activeTabButtonStyle
            ]}
            onPress={() => setActiveTab('saved')}
          >
            <Text 
              style={[
                tabTextStyle,
                activeTab === 'saved' && activeTabTextStyle
              ]}
            >
              Saved Reports
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'templates' && (
          <View>
            <Card style={searchContainerStyle}>
              <TextInput
                style={searchInputStyle}
                placeholder="Search templates..."
              />
              <View style={filterContainerStyle}>
                <Filter size={16} color="#666" />
                <Text style={filterTextStyle}>Filter</Text>
              </View>
            </Card>

            {reportTemplates.map(template => (
              <Card key={template.id} style={templateCardStyle}>
                <View style={templateHeaderStyle}>
                  <Text style={templateNameStyle}>{template.name}</Text>
                  <View style={lastUpdatedContainerStyle}>
                    <Calendar size={14} color="#666" />
                    <Text style={lastUpdatedTextStyle}>
                      Updated: {template.lastUpdated}
                    </Text>
                  </View>
                </View>
                <Text style={templateDescriptionStyle}>
                  {template.description}
                </Text>
                <View style={metricsContainerStyle}>
                  <Text style={metricsLabelStyle}>Included metrics:</Text>
                  <View style={metricsListStyle}>
                    {template.metrics.map((metric, index) => (
                      <View key={index} style={metricBadgeStyle}>
                        <Text style={metricTextStyle}>{metric}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={templateActionsStyle}>
                  <Button
                    title="Use Template"
                    variant="primary"
                    onPress={() => console.log(`Using template ${template.id}`)}
                    style={actionButtonStyle}
                  />
                  <Button
                    title="Customize"
                    variant="outline"
                    onPress={() => console.log(`Customizing template ${template.id}`)}
                    style={actionButtonStyle}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'saved' && (
          <View>
            <Card style={searchContainerStyle}>
              <TextInput
                style={searchInputStyle}
                placeholder="Search saved reports..."
              />
              <View style={filterContainerStyle}>
                <Filter size={16} color="#666" />
                <Text style={filterTextStyle}>Filter</Text>
              </View>
            </Card>

            {savedReports.map(report => (
              <Card key={report.id} style={reportCardStyle}>
                <View style={reportHeaderStyle}>
                  <Text style={reportNameStyle}>{report.name}</Text>
                  {report.scheduled && (
                    <View style={scheduleBadgeStyle}>
                      <Calendar size={12} color="#3b82f6" />
                      <Text style={scheduleTextStyle}>
                        {report.frequency}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={reportDescriptionStyle}>
                  {report.description}
                </Text>
                <Text style={reportDateStyle}>
                  Created: {report.created}
                </Text>
                <View style={reportActionsStyle}>
                  <Button
                    title="View"
                    variant="primary"
                    onPress={() => handleViewReport(report.id)}
                    style={reportActionButtonStyle}
                  />
                  <Button
                    title="Edit"
                    variant="outline"
                    onPress={() => console.log(`Editing report ${report.id}`)}
                    style={reportActionButtonStyle}
                  />
                  <Button
                    title="Export"
                    variant="outline"
                    onPress={() => handleExportReport(report.id)}
                    style={reportActionButtonStyle}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        title="Create New Report"
        onClose={() => setShowCreateModal(false)}
      >
        <View style={modalContentStyle}>
          <View style={formGroupStyle}>
            <Text style={formLabelStyle}>Report Name</Text>
            <TextInput
              style={formInputStyle}
              placeholder="Enter report name"
            />
          </View>
          <View style={formGroupStyle}>
            <Text style={formLabelStyle}>Description</Text>
            <TextInput
              style={[formInputStyle, textAreaStyle]}
              placeholder="Enter report description"
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={formGroupStyle}>
            <Text style={formLabelStyle}>Select Metrics</Text>
            <View style={metricOptionsStyle}>
              {[
                'Preventative Care Completion',
                'Department Breakdown',
                'ROI Analysis',
                'Trend Comparison'
              ].map((metric, index) => (
                <TouchableOpacity key={index} style={metricOptionStyle}>
                  <View style={checkboxStyle} />
                  <Text style={metricOptionTextStyle}>{metric}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={formGroupStyle}>
            <Text style={formLabelStyle}>Schedule Report</Text>
            <View style={scheduleOptionsStyle}>
              {['One-time', 'Weekly', 'Monthly', 'Quarterly'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    scheduleOptionStyle,
                    selectedSchedule === option && selectedScheduleOptionStyle
                  ]}
                  onPress={() => setSelectedSchedule(option)}
                >
                  <Text style={[
                    scheduleOptionTextStyle,
                    selectedSchedule === option && selectedScheduleOptionTextStyle
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={modalActionsStyle}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowCreateModal(false)}
              style={modalButtonStyle}
            />
            <Button
              title="Create Report"
              variant="primary"
              onPress={handleSaveReport}
              style={modalButtonStyle}
            />
          </View>
        </View>
      </Modal>

      <EmployerFooter />
    </SafeAreaView>
  );
};

export default CustomReports;