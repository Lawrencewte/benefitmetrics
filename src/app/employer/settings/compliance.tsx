import EmployerFooter from '@/src/components/Common/layout/EmployerFooter';
import { AlertTriangle, Calendar, CheckCircle, Download, FileText, Lock, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';



interface ComplianceItem {
  id: string;
  category: 'hipaa' | 'gdpr' | 'ccpa' | 'aca' | 'erisa';
  title: string;
  description: string;
  status: 'compliant' | 'at_risk' | 'non_compliant';
  lastReviewed: string;
  nextReview: string;
  requirements: Array<{
    requirement: string;
    status: 'met' | 'partial' | 'not_met';
    evidence?: string;
  }>;
  actions: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    deadline: string;
    owner: string;
  }>;
}

export default function CompliancePage() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: '1',
      category: 'hipaa',
      title: 'HIPAA Privacy & Security',
      description: 'Health Insurance Portability and Accountability Act compliance for protected health information',
      status: 'compliant',
      lastReviewed: '2025-03-15',
      nextReview: '2025-09-15',
      requirements: [
        { requirement: 'Employee HIPAA training completed', status: 'met', evidence: 'Training records for 100% of staff' },
        { requirement: 'Business Associate Agreements in place', status: 'met', evidence: 'BAAs with all vendors' },
        { requirement: 'Data encryption at rest and in transit', status: 'met', evidence: 'AES-256 encryption implemented' },
        { requirement: 'Access audit logs maintained', status: 'met', evidence: 'Daily audit log reviews' },
        { requirement: 'Incident response plan tested', status: 'partial', evidence: 'Plan exists, annual test pending' }
      ],
      actions: [
        { action: 'Complete annual incident response drill', priority: 'medium', deadline: '2025-06-30', owner: 'IT Security Team' },
        { action: 'Review and update privacy policies', priority: 'low', deadline: '2025-08-15', owner: 'Legal Team' }
      ]
    },
    {
      id: '2',
      category: 'gdpr',
      title: 'GDPR Data Protection',
      description: 'General Data Protection Regulation compliance for EU employee data',
      status: 'compliant',
      lastReviewed: '2025-04-01',
      nextReview: '2025-10-01',
      requirements: [
        { requirement: 'Data Protection Impact Assessment completed', status: 'met', evidence: 'DPIA documentation filed' },
        { requirement: 'Consent management system implemented', status: 'met', evidence: 'Granular consent tracking' },
        { requirement: 'Data subject rights procedures established', status: 'met', evidence: 'Request fulfillment process' },
        { requirement: 'Data retention policies documented', status: 'met', evidence: 'Automated retention controls' },
        { requirement: 'Cross-border data transfer safeguards', status: 'met', evidence: 'Standard contractual clauses' }
      ],
      actions: [
        { action: 'Update cookie consent mechanism', priority: 'low', deadline: '2025-07-01', owner: 'Development Team' }
      ]
    },
    {
      id: '3',
      category: 'aca',
      title: 'Affordable Care Act (ACA)',
      description: 'ACA compliance including reporting and employer mandate requirements',
      status: 'at_risk',
      lastReviewed: '2025-05-01',
      nextReview: '2025-11-01',
      requirements: [
        { requirement: 'Forms 1094-C and 1095-C filed timely', status: 'met', evidence: '2024 forms submitted on time' },
        { requirement: 'Minimum essential coverage offered', status: 'met', evidence: 'Qualifying health plans available' },
        { requirement: 'Affordability safe harbor applied', status: 'met', evidence: 'Rate of pay safe harbor used' },
        { requirement: 'Employee eligibility tracking accurate', status: 'partial', evidence: 'Manual tracking process' },
        { requirement: 'Measurement period documentation', status: 'not_met', evidence: 'Documentation gaps identified' }
      ],
      actions: [
        { action: 'Implement automated eligibility tracking', priority: 'high', deadline: '2025-06-15', owner: 'HR Systems Team' },
        { action: 'Document measurement periods clearly', priority: 'high', deadline: '2025-05-31', owner: 'Benefits Team' },
        { action: 'Conduct mid-year compliance review', priority: 'medium', deadline: '2025-07-31', owner: 'Legal Team' }
      ]
    },
    {
      id: '4',
      category: 'erisa',
      title: 'ERISA Fiduciary Duties',
      description: 'Employee Retirement Income Security Act compliance for benefit plan administration',
      status: 'compliant',
      lastReviewed: '2025-04-15',
      nextReview: '2025-10-15',
      requirements: [
        { requirement: 'Summary Plan Descriptions current', status: 'met', evidence: 'Updated SPDs distributed' },
        { requirement: 'Fiduciary insurance in place', status: 'met', evidence: 'Current policy coverage' },
        { requirement: 'Claims procedures documented', status: 'met', evidence: 'Appeal process established' },
        { requirement: 'Fee disclosure provided', status: 'met', evidence: 'Annual fee statements sent' },
        { requirement: 'Plan document amendments filed', status: 'met', evidence: 'All amendments current' }
      ],
      actions: [
        { action: 'Annual fiduciary training for committee', priority: 'medium', deadline: '2025-09-01', owner: 'Benefits Committee' }
      ]
    }
  ]);

  const [dataRetentionSettings, setDataRetentionSettings] = useState({
    employeeDataRetention: 7, // years
    healthDataRetention: 6, // years
    auditLogRetention: 3, // years
    communicationRetention: 1, // years
    automaticDeletion: true,
    anonymizationEnabled: true
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'compliant':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', textColor: '#166534' };
      case 'at_risk':
        return { backgroundColor: '#FFFBEB', borderColor: '#FED7AA', textColor: '#92400E' };
      case 'non_compliant':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA', textColor: '#DC2626' };
      default:
        return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', textColor: '#374151' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} color="#10B981" />;
      case 'at_risk':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'non_compliant':
        return <AlertTriangle size={20} color="#EF4444" />;
      default:
        return <Shield size={20} color="#6B7280" />;
    }
  };

  const getRequirementStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return '#059669';
      case 'partial':
        return '#D97706';
      case 'not_met':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA', textColor: '#DC2626' };
      case 'medium':
        return { backgroundColor: '#FFFBEB', borderColor: '#FED7AA', textColor: '#92400E' };
      case 'low':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', textColor: '#166534' };
      default:
        return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', textColor: '#374151' };
    }
  };

  const getRequirementIcon = (status: string) => {
    const color = getRequirementStatusColor(status);
    return <CheckCircle size={16} color={color} />;
  };

  const overallComplianceScore = Math.round(
    (complianceItems.filter(item => item.status === 'compliant').length / complianceItems.length) * 100
  );

  const highPriorityActions = complianceItems.flatMap(item => 
    item.actions.filter(action => action.priority === 'high')
  );

  const nextReviewDate = complianceItems
    .map(item => new Date(item.nextReview))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <><ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Compliance Management</Text>
          <Text style={styles.subtitle}>
            Monitor and maintain regulatory compliance across all frameworks
          </Text>
        </View>

        {/* Compliance Overview */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <AlertTriangle size={20} color="#EF4444" />
              <Text style={styles.overviewLabel}>High Priority</Text>
            </View>
            <Text style={[styles.overviewValue, { color: '#DC2626' }]}>{highPriorityActions.length}</Text>
            <Text style={styles.overviewSubtext}>actions needed</Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.overviewLabel}>Next Review</Text>
            </View>
            <Text style={[styles.overviewValue, { color: '#2563EB' }]}>
              {nextReviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <Text style={styles.overviewSubtext}>
              {nextReviewDate.getFullYear()}
            </Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <FileText size={20} color="#8B5CF6" />
              <Text style={styles.overviewLabel}>Frameworks</Text>
            </View>
            <Text style={[styles.overviewValue, { color: '#7C3AED' }]}>{complianceItems.length}</Text>
            <Text style={styles.overviewSubtext}>monitored</Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Shield size={20} color="#10B981" />
              <Text style={styles.overviewLabel}>Compliance</Text>
            </View>
            <Text style={[styles.overviewValue, { color: '#059669' }]}>{overallComplianceScore}%</Text>
            <Text style={styles.overviewSubtext}>overall score</Text>
          </View>
        </View>

        {/* High Priority Actions */}
        {highPriorityActions.length > 0 && (
          <View style={styles.urgentActionsContainer}>
            <View style={styles.urgentActionsHeader}>
              <AlertTriangle size={20} color="#EF4444" />
              <Text style={styles.urgentActionsTitle}>Urgent Actions Required</Text>
            </View>
            <View style={styles.urgentActionsList}>
              {highPriorityActions.map((action, index) => (
                <View key={index} style={styles.urgentActionItem}>
                  <Text style={styles.urgentActionText}>{action.action}</Text>
                  <Text style={styles.urgentActionDeadline}>{action.deadline}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Compliance Frameworks */}
        <View style={styles.frameworksList}>
          {complianceItems.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <View key={item.id} style={styles.frameworkCard}>
                {/* Framework Header */}
                <View style={styles.frameworkHeader}>
                  <View style={styles.frameworkTitleContainer}>
                    <View style={styles.frameworkTitleRow}>
                      {getStatusIcon(item.status)}
                      <Text style={styles.frameworkTitle}>{item.title}</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor, borderColor: statusStyle.borderColor }
                      ]}>
                        <Text style={[styles.statusBadgeText, { color: statusStyle.textColor }]}>
                          {item.status.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.frameworkDescription}>{item.description}</Text>
                  </View>
                </View>

                {/* Review Dates */}
                <View style={styles.reviewDatesContainer}>
                  <View style={styles.reviewDateItem}>
                    <Text style={styles.reviewDateLabel}>Last Reviewed</Text>
                    <Text style={styles.reviewDateValue}>
                      {new Date(item.lastReviewed).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.reviewDateItem}>
                    <Text style={styles.reviewDateLabel}>Next Review</Text>
                    <Text style={styles.reviewDateValue}>
                      {new Date(item.nextReview).toLocaleDateString()}
                    </Text>
                  </View>
                  <Pressable style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>Schedule Review</Text>
                  </Pressable>
                </View>

                {/* Requirements */}
                <View style={styles.requirementsSection}>
                  <Text style={styles.sectionTitle}>Compliance Requirements</Text>
                  <View style={styles.requirementsList}>
                    {item.requirements.map((req, index) => (
                      <View key={index} style={styles.requirementItem}>
                        {getRequirementIcon(req.status)}
                        <View style={styles.requirementContent}>
                          <Text style={styles.requirementText}>{req.requirement}</Text>
                          {req.evidence && (
                            <Text style={styles.requirementEvidence}>{req.evidence}</Text>
                          )}
                        </View>
                        <Text style={[styles.requirementStatus, { color: getRequirementStatusColor(req.status) }]}>
                          {req.status.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action Items */}
                {item.actions.length > 0 && (
                  <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Required Actions</Text>
                    <View style={styles.actionsList}>
                      {item.actions.map((action, index) => {
                        const priorityStyle = getPriorityStyle(action.priority);
                        return (
                          <View key={index} style={styles.actionItem}>
                            <View style={styles.actionContent}>
                              <Text style={styles.actionText}>{action.action}</Text>
                              <Text style={styles.actionOwner}>Owner: {action.owner}</Text>
                            </View>
                            <View style={styles.actionMeta}>
                              <View style={[
                                styles.priorityBadge,
                                { backgroundColor: priorityStyle.backgroundColor, borderColor: priorityStyle.borderColor }
                              ]}>
                                <Text style={[styles.priorityText, { color: priorityStyle.textColor }]}>
                                  {action.priority}
                                </Text>
                              </View>
                              <Text style={styles.actionDeadline}>{action.deadline}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Data Retention Settings */}
        <View style={styles.retentionCard}>
          <View style={styles.retentionHeader}>
            <Lock size={20} color="#6B7280" />
            <Text style={styles.retentionTitle}>Data Retention Settings</Text>
          </View>

          <View style={styles.retentionSettings}>
            <View style={styles.retentionItem}>
              <View style={styles.retentionItemContent}>
                <Text style={styles.retentionItemTitle}>Employee Data Retention</Text>
                <Text style={styles.retentionItemDescription}>How long to retain employee profile data</Text>
              </View>
              <Text style={styles.retentionItemValue}>{dataRetentionSettings.employeeDataRetention} years</Text>
            </View>

            <View style={styles.retentionItem}>
              <View style={styles.retentionItemContent}>
                <Text style={styles.retentionItemTitle}>Health Data Retention</Text>
                <Text style={styles.retentionItemDescription}>Retention period for health-related information</Text>
              </View>
              <Text style={styles.retentionItemValue}>{dataRetentionSettings.healthDataRetention} years</Text>
            </View>

            <View style={styles.retentionItem}>
              <View style={styles.retentionItemContent}>
                <Text style={styles.retentionItemTitle}>Audit Log Retention</Text>
                <Text style={styles.retentionItemDescription}>Security and access audit logs</Text>
              </View>
              <Text style={styles.retentionItemValue}>{dataRetentionSettings.auditLogRetention} years</Text>
            </View>

            <View style={styles.retentionItem}>
              <View style={styles.retentionItemContent}>
                <Text style={styles.retentionItemTitle}>Automatic Data Deletion</Text>
                <Text style={styles.retentionItemDescription}>Automatically delete data after retention period</Text>
              </View>
              <Switch
                value={dataRetentionSettings.automaticDeletion}
                onValueChange={(value) => setDataRetentionSettings(prev => ({
                  ...prev,
                  automaticDeletion: value
                }))} />
            </View>

            <View style={styles.retentionItem}>
              <View style={styles.retentionItemContent}>
                <Text style={styles.retentionItemTitle}>Data Anonymization</Text>
                <Text style={styles.retentionItemDescription}>Anonymize employee data for analytics</Text>
              </View>
              <Switch
                value={dataRetentionSettings.anonymizationEnabled}
                onValueChange={(value) => setDataRetentionSettings(prev => ({
                  ...prev,
                  anonymizationEnabled: value
                }))} />
            </View>
          </View>
        </View>

        {/* Compliance Reports */}
        <View style={styles.reportsCard}>
          <Text style={styles.reportsTitle}>Compliance Reports</Text>

          <View style={styles.reportsList}>
            <Pressable style={styles.reportItem}>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>HIPAA Compliance Report</Text>
                <Text style={styles.reportDescription}>Comprehensive HIPAA assessment and findings</Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </Pressable>

            <Pressable style={styles.reportItem}>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>Data Privacy Assessment</Text>
                <Text style={styles.reportDescription}>GDPR and CCPA compliance review</Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </Pressable>

            <Pressable style={styles.reportItem}>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>ACA Reporting Summary</Text>
                <Text style={styles.reportDescription}>Annual ACA compliance and filings</Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </Pressable>

            <Pressable style={styles.reportItem}>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>Audit Trail Report</Text>
                <Text style={styles.reportDescription}>System access and data handling logs</Text>
              </View>
              <Download size={20} color="#3B82F6" />
            </Pressable>
          </View>
        </View>

        {/* Compliance Contacts */}
        <View style={styles.contactsCard}>
          <Text style={styles.contactsTitle}>Compliance Support</Text>
          <View style={styles.contactsList}>
            <Text style={styles.contactItem}>
              <Text style={styles.contactRole}>Legal Team:</Text> legal@company.com | (555) 123-4567
            </Text>
            <Text style={styles.contactItem}>
              <Text style={styles.contactRole}>Privacy Officer:</Text> privacy@company.com | (555) 123-4568
            </Text>
            <Text style={styles.contactItem}>
              <Text style={styles.contactRole}>IT Security:</Text> security@company.com | (555) 123-4569
            </Text>
          </View>
        </View>
      </View>
    </ScrollView><EmployerFooter /></>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  urgentActionsContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  urgentActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgentActionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#991B1B',
    marginLeft: 8,
  },
  urgentActionsList: {
    gap: 8,
  },
  urgentActionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  urgentActionText: {
    color: '#B91C1C',
    flex: 1,
    marginRight: 8,
  },
  urgentActionDeadline: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  frameworksList: {
    gap: 24,
    marginBottom: 24,
  },
  frameworkCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  frameworkHeader: {
    marginBottom: 16,
  },
  frameworkTitleContainer: {
    flex: 1,
  },
  frameworkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  frameworkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 2,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  frameworkDescription: {
    fontSize: 16,
    color: '#6B7280',
  },
  reviewDatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 24,
  },
  reviewDateItem: {
    alignItems: 'center',
  },
  reviewDateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  reviewDateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  scheduleButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  requirementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  requirementContent: {
    flex: 1,
    marginLeft: 12,
  },
  requirementText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  requirementEvidence: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  requirementStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  actionsSection: {
    marginBottom: 16,
  },
  actionsList: {
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  actionContent: {
    flex: 1,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  actionOwner: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionDeadline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  retentionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  retentionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  retentionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  retentionSettings: {
    gap: 16,
  },
  retentionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retentionItemContent: {
    flex: 1,
  },
  retentionItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  retentionItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  retentionItemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  reportsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  reportsList: {
    gap: 12,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  contactsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  contactsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 12,
  },
  contactsList: {
    gap: 8,
  },
  contactItem: {
    fontSize: 14,
    color: '#1D4ED8',
  },
    contactRole: {
      fontWeight: '500',
    },
  });