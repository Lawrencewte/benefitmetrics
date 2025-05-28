import { Calendar, Filter } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Custom Reports" />
        <View style={styles.loadingContainer}>
          <Text>Loading report data...</Text>
        </View>
        <EmployerFooter />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Custom Reports" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={() => setError(null)} />
        </View>
        <EmployerFooter />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Custom Reports" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>Report Builder</Text>
            <Text style={styles.pageSubtitle}>
              Create and manage custom reports for your organization's health metrics
            </Text>
          </View>
          <Button 
            title="New Report" 
            onPress={handleCreateNewReport}
            variant="primary"
            style={styles.newReportButton}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'templates' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('templates')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'templates' && styles.activeTabText
              ]}
            >
              Report Templates
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'saved' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('saved')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'saved' && styles.activeTabText
              ]}
            >
              Saved Reports
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'templates' && (
          <View>
            <Card style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search templates..."
              />
              <View style={styles.filterContainer}>
                <Filter size={16} color="#666" />
                <Text style={styles.filterText}>Filter</Text>
              </View>
            </Card>

            {reportTemplates.map(template => (
              <Card key={template.id} style={styles.templateCard}>
                <View style={styles.templateHeader}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <View style={styles.lastUpdatedContainer}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.lastUpdatedText}>
                      Updated: {template.lastUpdated}
                    </Text>
                  </View>
                </View>
                <Text style={styles.templateDescription}>
                  {template.description}
                </Text>
                <View style={styles.metricsContainer}>
                  <Text style={styles.metricsLabel}>Included metrics:</Text>
                  <View style={styles.metricsList}>
                    {template.metrics.map((metric, index) => (
                      <View key={index} style={styles.metricBadge}>
                        <Text style={styles.metricText}>{metric}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.templateActions}>
                  <Button
                    title="Use Template"
                    variant="primary"
                    onPress={() => console.log(`Using template ${template.id}`)}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Customize"
                    variant="outline"
                    onPress={() => console.log(`Customizing template ${template.id}`)}
                    style={styles.actionButton}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'saved' && (
          <View>
            <Card style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search saved reports..."
              />
              <View style={styles.filterContainer}>
                <Filter size={16} color="#666" />
                <Text style={styles.filterText}>Filter</Text>
              </View>
            </Card>

            {savedReports.map(report => (
              <Card key={report.id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportName}>{report.name}</Text>
                  {report.scheduled && (
                    <View style={styles.scheduleBadge}>
                      <Calendar size={12} color="#3b82f6" />
                      <Text style={styles.scheduleText}>
                        {report.frequency}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.reportDescription}>
                  {report.description}
                </Text>
                <Text style={styles.reportDate}>
                  Created: {report.created}
                </Text>
                <View style={styles.reportActions}>
                  <Button
                    title="View"
                    variant="primary"
                    onPress={() => handleViewReport(report.id)}
                    style={styles.reportActionButton}
                  />
                  <Button
                    title="Edit"
                    variant="outline"
                    onPress={() => console.log(`Editing report ${report.id}`)}
                    style={styles.reportActionButton}
                  />
                  <Button
                    title="Export"
                    variant="outline"
                    onPress={() => handleExportReport(report.id)}
                    style={styles.reportActionButton}
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
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Report Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter report name"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Enter report description"
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Select Metrics</Text>
            <View style={styles.metricOptions}>
              {[
                'Preventative Care Completion',
                'Department Breakdown',
                'ROI Analysis',
                'Trend Comparison'
              ].map((metric, index) => (
                <TouchableOpacity key={index} style={styles.metricOption}>
                  <View style={styles.checkbox} />
                  <Text style={styles.metricOptionText}>{metric}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Schedule Report</Text>
            <View style={styles.scheduleOptions}>
              {['One-time', 'Weekly', 'Monthly', 'Quarterly'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.scheduleOption,
                    selectedSchedule === option && styles.selectedScheduleOption
                  ]}
                  onPress={() => setSelectedSchedule(option)}
                >
                  <Text style={[
                    styles.scheduleOptionText,
                    selectedSchedule === option && styles.selectedScheduleOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowCreateModal(false)}
              style={styles.modalButton}
            />
            <Button
              title="Create Report"
              variant="primary"
              onPress={handleSaveReport}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      <EmployerFooter />
    </SafeAreaView>
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
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
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
  newReportButton: {
    minWidth: 120,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  templateCard: {
    marginBottom: 16,
    padding: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#666',
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  metricsContainer: {
    marginBottom: 16,
  },
  metricsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  metricsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricBadge: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  metricText: {
    fontSize: 12,
    color: '#0284c7',
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    minWidth: 100,
  },
  reportCard: {
    marginBottom: 16,
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  scheduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  reportActionButton: {
    minWidth: 80,
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  formInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  metricOptions: {
    gap: 8,
  },
  metricOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 2,
    marginRight: 12,
  },
  metricOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  scheduleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scheduleOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  selectedScheduleOption: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  scheduleOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedScheduleOptionText: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
  modalButton: {
    minWidth: 120,
  },
});