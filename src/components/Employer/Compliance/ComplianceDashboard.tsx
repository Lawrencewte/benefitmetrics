import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    Download,
    Eye,
    FileText,
    Lock,
    RefreshCw,
    Settings,
    Shield
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ComplianceStatus {
  id: string;
  name: string;
  category: 'hipaa' | 'gdpr' | 'ccpa' | 'sox' | 'internal';
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending';
  lastAudit: string;
  nextAudit: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: number;
  description: string;
}

interface ComplianceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

interface AuditItem {
  id: string;
  title: string;
  type: 'scheduled' | 'completed' | 'overdue';
  date: string;
  auditor: string;
  scope: string[];
  findings: number;
  status: string;
}

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audits' | 'policies' | 'training'>('overview');
  
  const [complianceStatus] = useState<ComplianceStatus[]>([
    {
      id: '1',
      name: 'HIPAA Compliance',
      category: 'hipaa',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      riskLevel: 'low',
      issues: 0,
      description: 'Health Insurance Portability and Accountability Act compliance for PHI protection'
    },
    {
      id: '2',
      name: 'GDPR Compliance',
      category: 'gdpr',
      status: 'warning',
      lastAudit: '2023-12-10',
      nextAudit: '2024-06-10',
      riskLevel: 'medium',
      issues: 3,
      description: 'General Data Protection Regulation compliance for EU user data'
    },
    {
      id: '3',
      name: 'CCPA Compliance',
      category: 'ccpa',
      status: 'compliant',
      lastAudit: '2024-02-01',
      nextAudit: '2024-08-01',
      riskLevel: 'low',
      issues: 1,
      description: 'California Consumer Privacy Act compliance for CA residents'
    },
    {
      id: '4',
      name: 'SOX Compliance',
      category: 'sox',
      status: 'pending',
      lastAudit: '2023-11-20',
      nextAudit: '2024-05-20',
      riskLevel: 'high',
      issues: 5,
      description: 'Sarbanes-Oxley Act compliance for financial reporting'
    },
    {
      id: '5',
      name: 'Internal Security Policies',
      category: 'internal',
      status: 'compliant',
      lastAudit: '2024-03-01',
      nextAudit: '2024-09-01',
      riskLevel: 'low',
      issues: 0,
      description: 'Internal security and data handling policies'
    }
  ]);

  const [metrics] = useState<ComplianceMetric[]>([
    {
      id: '1',
      name: 'Data Encryption Rate',
      value: 99.8,
      target: 100,
      unit: '%',
      trend: 'up',
      category: 'Security'
    },
    {
      id: '2',
      name: 'Access Controls Implemented',
      value: 847,
      target: 850,
      unit: 'controls',
      trend: 'up',
      category: 'Access Management'
    },
    {
      id: '3',
      name: 'Policy Acknowledgments',
      value: 94.2,
      target: 95,
      unit: '%',
      trend: 'stable',
      category: 'Training'
    },
    {
      id: '4',
      name: 'Incident Response Time',
      value: 12,
      target: 15,
      unit: 'minutes',
      trend: 'down',
      category: 'Security'
    },
    {
      id: '5',
      name: 'Audit Findings Resolved',
      value: 87,
      target: 90,
      unit: '%',
      trend: 'up',
      category: 'Compliance'
    },
    {
      id: '6',
      name: 'Data Retention Compliance',
      value: 98.5,
      target: 99,
      unit: '%',
      trend: 'stable',
      category: 'Data Management'
    }
  ]);

  const [audits] = useState<AuditItem[]>([
    {
      id: '1',
      title: 'Q1 HIPAA Compliance Audit',
      type: 'completed',
      date: '2024-03-15',
      auditor: 'Internal Audit Team',
      scope: ['Data Encryption', 'Access Controls', 'Audit Logs'],
      findings: 2,
      status: 'Minor findings addressed'
    },
    {
      id: '2',
      title: 'GDPR Data Processing Review',
      type: 'scheduled',
      date: '2024-04-10',
      auditor: 'External Auditor',
      scope: ['Data Processing', 'Consent Management', 'Right to Erasure'],
      findings: 0,
      status: 'Scheduled'
    },
    {
      id: '3',
      title: 'Security Controls Assessment',
      type: 'overdue',
      date: '2024-03-01',
      auditor: 'Security Team',
      scope: ['Network Security', 'Endpoint Protection', 'Incident Response'],
      findings: 0,
      status: 'Overdue - Needs scheduling'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'non-compliant': return '#ef4444';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'non-compliant': return AlertTriangle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleComplianceAction = (id: string, action: 'audit' | 'review' | 'remediate') => {
    const item = complianceStatus.find(c => c.id === id);
    if (!item) return;

    switch (action) {
      case 'audit':
        Alert.alert('Schedule Audit', `Scheduling audit for ${item.name}...`);
        break;
      case 'review':
        Alert.alert('Review Compliance', `Opening detailed review for ${item.name}...`);
        break;
      case 'remediate':
        Alert.alert('Remediation Plan', `Creating remediation plan for ${item.name}...`);
        break;
    }
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Compliance Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <Shield size={24} color="#8b5cf6" />
          <Text style={styles.scoreTitle}>Overall Compliance Score</Text>
        </View>
        <View style={styles.scoreValue}>
          <Text style={styles.scoreNumber}>87</Text>
          <Text style={styles.scoreUnit}>/ 100</Text>
        </View>
        <View style={styles.scoreDetails}>
          <View style={styles.scoreItem}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.scoreItemText}>3 Compliant</Text>
          </View>
          <View style={styles.scoreItem}>
            <AlertTriangle size={16} color="#f59e0b" />
            <Text style={styles.scoreItemText}>1 Warning</Text>
          </View>
          <View style={styles.scoreItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.scoreItemText}>1 Pending</Text>
          </View>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        {metrics.slice(0, 4).map((metric) => (
          <View key={metric.id} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricName}>{metric.name}</Text>
              <Text style={[styles.metricTrend, { color: getTrendColor(metric.trend) }]}>
                {getTrendIcon(metric.trend)}
              </Text>
            </View>
            <View style={styles.metricValue}>
              <Text style={styles.metricNumber}>{metric.value}</Text>
              <Text style={styles.metricUnit}>{metric.unit}</Text>
            </View>
            <View style={styles.metricProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                      backgroundColor: metric.value >= metric.target ? '#10b981' : '#f59e0b'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>Target: {metric.target}{metric.unit}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Compliance Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Compliance Status</Text>
        <View style={styles.statusList}>
          {complianceStatus.map((item) => {
            const StatusIcon = getStatusIcon(item.status);
            return (
              <View key={item.id} style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <View style={styles.statusInfo}>
                    <View style={styles.statusTitleRow}>
                      <StatusIcon 
                        size={20} 
                        color={getStatusColor(item.status)} 
                      />
                      <Text style={styles.statusName}>{item.name}</Text>
                      <View style={[
                        styles.riskBadge,
                        { backgroundColor: getRiskColor(item.riskLevel) }
                      ]}>
                        <Text style={styles.riskText}>{item.riskLevel}</Text>
                      </View>
                    </View>
                    <Text style={styles.statusDescription}>{item.description}</Text>
                  </View>
                </View>

                <View style={styles.statusDetails}>
                  <View style={styles.statusMetrics}>
                    <View style={styles.statusMetric}>
                      <Text style={styles.statusMetricLabel}>Last Audit</Text>
                      <Text style={styles.statusMetricValue}>{item.lastAudit}</Text>
                    </View>
                    <View style={styles.statusMetric}>
                      <Text style={styles.statusMetricLabel}>Next Audit</Text>
                      <Text style={styles.statusMetricValue}>{item.nextAudit}</Text>
                    </View>
                    <View style={styles.statusMetric}>
                      <Text style={styles.statusMetricLabel}>Issues</Text>
                      <Text style={[
                        styles.statusMetricValue,
                        { color: item.issues > 0 ? '#ef4444' : '#10b981' }
                      ]}>
                        {item.issues}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statusActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleComplianceAction(item.id, 'review')}
                  >
                    <Eye size={16} color="#8b5cf6" />
                    <Text style={styles.actionButtonText}>Review</Text>
                  </TouchableOpacity>
                  
                  {item.issues > 0 && (
                    <TouchableOpacity 
                      style={styles.remediateButton}
                      onPress={() => handleComplianceAction(item.id, 'remediate')}
                    >
                      <Settings size={16} color="#fff" />
                      <Text style={styles.remediateButtonText}>Remediate</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.auditButton}
                    onPress={() => handleComplianceAction(item.id, 'audit')}
                  >
                    <FileText size={16} color="#374151" />
                    <Text style={styles.auditButtonText}>Audit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderAudits = () => (
    <View style={styles.auditsContainer}>
      <View style={styles.auditsHeader}>
        <Text style={styles.sectionTitle}>Audit Schedule</Text>
        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>Schedule Audit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.auditsList}>
        {audits.map((audit) => (
          <View key={audit.id} style={styles.auditCard}>
            <View style={styles.auditHeader}>
              <View style={styles.auditInfo}>
                <Text style={styles.auditTitle}>{audit.title}</Text>
                <Text style={styles.auditDate}>{audit.date} • {audit.auditor}</Text>
              </View>
              <View style={[
                styles.auditTypeBadge,
                { 
                  backgroundColor: audit.type === 'completed' ? '#10b981' : 
                                 audit.type === 'overdue' ? '#ef4444' : '#f59e0b'
                }
              ]}>
                <Text style={styles.auditTypeText}>{audit.type}</Text>
              </View>
            </View>

            <View style={styles.auditScope}>
              <Text style={styles.auditScopeLabel}>Scope:</Text>
              <Text style={styles.auditScopeText}>{audit.scope.join(', ')}</Text>
            </View>

            <View style={styles.auditFooter}>
              <View style={styles.auditMetrics}>
                <Text style={styles.auditFindings}>
                  {audit.findings} findings
                </Text>
                <Text style={styles.auditStatus}>{audit.status}</Text>
              </View>
              
              <View style={styles.auditActions}>
                <TouchableOpacity style={styles.auditActionButton}>
                  <Eye size={16} color="#8b5cf6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.auditActionButton}>
                  <Download size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPolicies = () => (
    <View style={styles.policiesContainer}>
      <Text style={styles.sectionTitle}>Policy Management</Text>
      
      <View style={styles.policiesGrid}>
        <View style={styles.policyCard}>
          <FileText size={24} color="#8b5cf6" />
          <Text style={styles.policyTitle}>Data Protection Policy</Text>
          <Text style={styles.policyStatus}>Last updated: March 2024</Text>
          <Text style={styles.policyAck}>98% acknowledged</Text>
        </View>
        
        <View style={styles.policyCard}>
          <Lock size={24} color="#10b981" />
          <Text style={styles.policyTitle}>Access Control Policy</Text>
          <Text style={styles.policyStatus}>Last updated: February 2024</Text>
          <Text style={styles.policyAck}>94% acknowledged</Text>
        </View>
        
        <View style={styles.policyCard}>
          <Database size={24} color="#f59e0b" />
          <Text style={styles.policyTitle}>Data Retention Policy</Text>
          <Text style={styles.policyStatus}>Last updated: January 2024</Text>
          <Text style={styles.policyAck}>91% acknowledged</Text>
        </View>
        
        <View style={styles.policyCard}>
          <Activity size={24} color="#6366f1" />
          <Text style={styles.policyTitle}>Incident Response Policy</Text>
          <Text style={styles.policyStatus}>Last updated: March 2024</Text>
          <Text style={styles.policyAck}>96% acknowledged</Text>
        </View>
      </View>
    </View>
  );

  const renderTraining = () => (
    <View style={styles.trainingContainer}>
      <Text style={styles.sectionTitle}>Compliance Training</Text>
      
      <View style={styles.trainingStats}>
        <View style={styles.trainingStatCard}>
          <Text style={styles.trainingStatValue}>87%</Text>
          <Text style={styles.trainingStatLabel}>Completion Rate</Text>
        </View>
        <View style={styles.trainingStatCard}>
          <Text style={styles.trainingStatValue}>412</Text>
          <Text style={styles.trainingStatLabel}>Employees Trained</Text>
        </View>
        <View style={styles.trainingStatCard}>
          <Text style={styles.trainingStatValue}>12</Text>
          <Text style={styles.trainingStatLabel}>Training Modules</Text>
        </View>
      </View>
      
      <View style={styles.trainingModules}>
        <Text style={styles.trainingModulesTitle}>Training Modules</Text>
        
        <View style={styles.modulesList}>
          <View style={styles.moduleCard}>
            <Text style={styles.moduleName}>HIPAA Fundamentals</Text>
            <Text style={styles.moduleCompletion}>94% completed</Text>
          </View>
          
          <View style={styles.moduleCard}>
            <Text style={styles.moduleName}>Data Security Awareness</Text>
            <Text style={styles.moduleCompletion}>89% completed</Text>
          </View>
          
          <View style={styles.moduleCard}>
            <Text style={styles.moduleName}>Privacy Rights & GDPR</Text>
            <Text style={styles.moduleCompletion}>76% completed</Text>
          </View>
          
          <View style={styles.moduleCard}>
            <Text style={styles.moduleName}>Incident Response</Text>
            <Text style={styles.moduleCompletion}>82% completed</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compliance Dashboard</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <RefreshCw size={16} color="#8b5cf6" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {(['overview', 'audits', 'policies', 'training'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'audits' && renderAudits()}
        {activeTab === 'policies' && renderPolicies()}
        {activeTab === 'training' && renderTraining()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overviewContainer: {
    gap: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  scoreValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  scoreUnit: {
    fontSize: 24,
    color: '#6b7280',
    marginLeft: 4,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreItemText: {
    fontSize: 14,
    color: '#374151',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricName: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 18,
  },
  metricTrend: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  metricProgress: {
    gap: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statusSection: {
    gap: 16,
  },
  statusList: {
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusHeader: {
    marginBottom: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  statusDetails: {
    marginBottom: 16,
  },
  statusMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusMetric: {
    alignItems: 'center',
  },
  statusMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  remediateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  remediateButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  auditButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  auditButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  auditsContainer: {
    gap: 16,
  },
  auditsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  auditsList: {
    gap: 12,
  },
  auditCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  auditInfo: {
    flex: 1,
  },
  auditTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  auditDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  auditTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  auditTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  auditScope: {
    marginBottom: 12,
  },
  auditScopeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  auditScopeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  auditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditMetrics: {
    flex: 1,
  },
  auditFindings: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  auditStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  auditActions: {
    flexDirection: 'row',
    gap: 8,
  },
  auditActionButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  policiesContainer: {
    gap: 16,
  },
  policiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  policyCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  policyStatus: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  policyAck: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },
  trainingContainer: {
    gap: 20,
  },
  trainingStats: {
    flexDirection: 'row',
    gap: 12,
  },
  trainingStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  trainingStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  trainingStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  trainingModules: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  trainingModulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  modulesList: {
    gap: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  moduleCompletion: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
});