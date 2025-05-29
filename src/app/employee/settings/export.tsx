import Footer from '@/src/components/Common/layout/Footer';
import { Calendar, CheckSquare, Download, FileText, Heart, User } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Added TouchableOpacity and StyleSheet
import Button from '../../../components/Common/ui/Button';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  dataTypes: string[];
  isSelected: boolean;
}

export default function DataExport() {
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Personal details, contact information, emergency contacts',
      icon: <User size={24} color="#2563EB" />, // Changed className to color prop
      dataTypes: ['Personal Information', 'Contact Details', 'Emergency Contacts'],
      isSelected: true,
    },
    {
      id: 'health',
      title: 'Health Data',
      description: 'Medical history, medications, allergies, family history',
      icon: <Heart size={24} color="#DC2626" />, // Changed className to color prop
      dataTypes: ['Medical History', 'Current Medications', 'Allergies', 'Family History'],
      isSelected: true,
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Past and upcoming appointments, provider information',
      icon: <Calendar size={24} color="#16A34A" />, // Changed className to color prop
      dataTypes: ['Appointment History', 'Provider Information', 'Visit Notes'],
      isSelected: true,
    },
    {
      id: 'benefits',
      title: 'Benefits Information',
      description: 'Insurance coverage, benefits usage, claims data',
      icon: <CheckSquare size={24} color="#9333EA" />, // Changed className to color prop
      dataTypes: ['Insurance Coverage', 'Benefits Usage', 'Claims History'],
      isSelected: false,
    },
    {
      id: 'tracking',
      title: 'Health Tracking',
      description: 'Health scores, ROI tracking, challenge participation',
      icon: <FileText size={24} color="#EA580C" />, // Changed className to color prop
      dataTypes: ['Health Scores', 'ROI Data', 'Challenge History', 'Wellness Activities'],
      isSelected: false,
    },
  ]);

  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleOptionToggle = (optionId: string) => {
    setExportOptions(prev =>
      prev.map(option =>
        option.id === optionId
          ? { ...option, isSelected: !option.isSelected }
          : option
      )
    );
  };

  const handleExport = async () => {
    const selectedOptions = exportOptions.filter(option => option.isSelected);
    
    if (selectedOptions.length === 0) {
      Alert.alert('No Data Selected', 'Please select at least one type of data to export.');
      return;
    }

    Alert.alert(
      'Export Data',
      `This will export your selected data as ${exportFormat.toUpperCase()} files. You will receive an email with download links within 24 hours.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            setIsExporting(true);
            try {
              // Simulate export process
              await new Promise(resolve => setTimeout(resolve, 2000));
              Alert.alert(
                'Export Requested',
                'Your data export has been requested. You will receive an email with download links within 24 hours.'
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to export data. Please try again.');
            } finally {
              setIsExporting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Download size={28} color="#2563EB" />
          <Text style={styles.title}>Export Data</Text>
        </View>

        <Text style={styles.description}>
          Download a copy of your health data. Select the information you'd like to include in your export.
        </Text>

        {/* Export Options */}
        <View style={styles.optionsContainer}>
          {exportOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionToggle(option.id)}
              style={[
                styles.optionCard,
                option.isSelected ? styles.optionCardSelected : styles.optionCardDefault
              ]}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionTitleContainer}>
                  {option.icon}
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  option.isSelected ? styles.checkboxSelected : styles.checkboxDefault
                ]}>
                  {option.isSelected && (
                    <CheckSquare size={14} color="white" />
                  )}
                </View>
              </View>
              
              <Text style={styles.optionDescription}>{option.description}</Text>
              
              <View style={styles.dataTypesContainer}>
                {option.dataTypes.map((type, index) => (
                  <View key={index} style={styles.dataTypeTag}>
                    <Text style={styles.dataTypeText}>{type}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Export Format */}
        <View style={styles.formatCard}>
          <Text style={styles.formatTitle}>Export Format</Text>
          
          <View style={styles.formatOptions}>
            {[
              { value: 'pdf', label: 'PDF', description: 'Human-readable document format' },
              { value: 'csv', label: 'CSV', description: 'Spreadsheet format for data analysis' },
              { value: 'json', label: 'JSON', description: 'Machine-readable format for developers' },
            ].map(format => (
              <TouchableOpacity
                key={format.value}
                onPress={() => setExportFormat(format.value as any)}
                style={[
                  styles.formatOption,
                  exportFormat === format.value ? styles.formatOptionSelected : styles.formatOptionDefault
                ]}
              >
                <View style={[
                  styles.radioButton,
                  exportFormat === format.value ? styles.radioButtonSelected : styles.radioButtonDefault
                ]}>
                  {exportFormat === format.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                
                <View style={styles.formatInfo}>
                  <Text style={styles.formatLabel}>{format.label}</Text>
                  <Text style={styles.formatDescription}>{format.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Export Button */}
        <Button
          onPress={handleExport}
          label={isExporting ? "Preparing Export..." : "Request Data Export"}
          variant="primary"
          loading={isExporting}
          disabled={isExporting}
          icon={<Download size={20} />}
        />

        {/* Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Data exports are processed within 24 hours</Text>
            <Text style={styles.infoItem}>• Download links expire after 7 days</Text>
            <Text style={styles.infoItem}>• All exports are encrypted and password protected</Text>
            <Text style={styles.infoItem}>• You can request up to 3 exports per month</Text>
          </View>
        </View>

        {/* Export History */}
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Recent Exports</Text>
          
          <View style={styles.historyList}>
            <View style={styles.historyItem}>
              <View>
                <Text style={styles.historyItemTitle}>Full Health Data Export</Text>
                <Text style={styles.historyItemDate}>March 15, 2025 • PDF Format</Text>
              </View>
              <Text style={styles.historyStatusCompleted}>Completed</Text>
            </View>
            
            <View style={styles.historyItem}>
              <View>
                <Text style={styles.historyItemTitle}>Appointment History</Text>
                <Text style={styles.historyItemDate}>February 28, 2025 • CSV Format</Text>
              </View>
              <Text style={styles.historyStatusExpired}>Expired</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  description: {
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  optionCardDefault: {
    borderColor: '#E5E7EB',
  },
  optionCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDefault: {
    borderColor: '#D1D5DB',
  },
  checkboxSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  optionDescription: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 12,
  },
  dataTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataTypeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  dataTypeText: {
    color: '#374151',
    fontSize: 12,
  },
  formatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  formatTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formatOptions: {
    gap: 12,
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  formatOptionDefault: {
    borderColor: '#E5E7EB',
  },
  formatOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonDefault: {
    borderColor: '#D1D5DB',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  formatInfo: {
    flex: 1,
  },
  formatLabel: {
    fontWeight: '500',
  },
  formatDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 24,
  },
  infoTitle: {
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoList: {
    gap: 4,
  },
  infoItem: {
    color: '#1D4ED8',
    fontSize: 14,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  historyItemTitle: {
    fontWeight: '500',
  },
  historyItemDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  historyStatusCompleted: {
    color: '#16A34A',
    fontSize: 14,
  },
  historyStatusExpired: {
    color: '#6B7280',
    fontSize: 14,
  },
});