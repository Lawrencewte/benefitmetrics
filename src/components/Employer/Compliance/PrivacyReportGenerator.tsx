import {
    AlertTriangle,
    BarChart,
    Calendar,
    CheckCircle,
    Clock,
    Database,
    Download,
    Eye,
    FileText,
    PieChart,
    Settings,
    Shield,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface PrivacyMetric {
  id: string;
  category: string;
  metric: string;
  value: string | number;
  change: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'privacy_impact' | 'data_processing' | 'consent_audit' | 'access_log' | 'breach_summary';
  status: 'draft' | 'generating' | 'ready' | 'expired';
  createdDate: string;
  generatedDate?: string;
  size?: string;
  description: string;
}

export default function PrivacyReportGenerator() {
  const [privacyMetrics, setPrivacyMetrics] = useState<PrivacyMetric[]>([
    {
      id: '1',
      category: 'Data Collection',
      metric: 'Active Consents',
      value: 398,
      change: 2.3,
      status: 'good',
      description: 'Number of employees with active data processing consent'
    },
    {
      id: '2',
      category: 'Data Collection',
      metric: 'Consent Withdrawal Rate',
      value: '1.2%',
      change: -0.3,
      status: 'good',
      description: 'Percentage of users who withdrew consent this month'
    },
    {
      id: '3',
      category: 'Data Access',
      metric: 'Data Access Requests',
      value: 23,
      change: 15.0,
      status: 'warning',
      description: 'Number of employee data access requests this month'
    },
    {
      id: '4',
      category: 'Data Access',
      metric: 'Average Response Time',
      value: '8.5 days',
      change: -2.1,
      status: 'good',
      description: 'Average time to fulfill data access requests'
    },
    {
      id: '5',
      category: 'Data Security',
      metric: 'Failed Login Attempts',
      value: 47,
      change: 34.2,
      status: 'critical',
      description: 'Number of failed authentication attempts'
    },
    {
      id: '6',
      category: 'Data Security',
      metric: 'Data Encryption Coverage',
      value: '99.8%',
      change: 0.1,
      status: 'good',
      description: 'Percentage of data protected by encryption'
    },
    {
      id: '7',
      category: 'Data Retention',
      metric: 'Overdue Deletions',
      value: 12,
      change: -8.0,
      status: 'warning',
      description: 'Number of data records past retention deadline'
    },
    {
      id: '8',
      category: 'Data Retention',
      metric: 'Storage Efficiency',
      value: '87%',
      change: 3.2,
      status: 'good',
      description: 'Percentage of storage within retention guidelines'
    }
  ]);

  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([
    {
      id: '1',
      name: 'Monthly Privacy Impact Assessment',
      type: 'privacy_impact',
      status: 'ready',
      createdDate: '2025-05-01',
      generatedDate: '2025-05-22',
      size: '2.4 MB',
      description: 'Comprehensive privacy impact analysis for May 2025'
    },
    {
      id: '2',
      name: 'Data Processing Activities Record',
      type: 'data_processing',
      status: 'ready',
      createdDate: '2025-05-15',
      generatedDate: '2025-05-22',
      size: '1.8 MB',
      description: 'GDPR Article 30 compliance record of processing activities'
    },
    {
      id: '3',
      name: 'Consent Management Audit',
      type: 'consent_audit',
      status: 'generating',
      createdDate: '2025-05-22',
      description: 'Audit of user consent collection and management processes'
    },
    {
      id: '4',
      name: 'Access Log Summary',
      type: 'access_log',
      status: 'draft',
      createdDate: '2025-05-22',
      description: 'Summary of data access patterns and anomalies'
    }
  ]);

  const [selectedReportType, setSelectedReportType] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    departments: [] as string[],
    includePersonalData: false,
    includeAuditTrail: true,
    format: 'pdf'
  });

  const getMetricStatusColor = (status: PrivacyMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getReportStatusIcon = (status: ComplianceReport['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'generating':
        return <Clock size={16} className="text-blue-600 animate-spin" />;
      case 'draft':
        return <FileText size={16} className="text-gray-600" />;
      case 'expired':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getReportTypeIcon = (type: ComplianceReport['type']) => {
    switch (type) {
      case 'privacy_impact':
        return <Shield size={16} className="text-purple-600" />;
      case 'data_processing':
        return <Database size={16} className="text-blue-600" />;
      case 'consent_audit':
        return <Users size={16} className="text-green-600" />;
      case 'access_log':
        return <Eye size={16} className="text-orange-600" />;
      case 'breach_summary':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const reportTypes = [
    {
      value: 'privacy_impact',
      label: 'Privacy Impact Assessment',
      description: 'Comprehensive analysis of privacy risks and mitigation measures'
    },
    {
      value: 'data_processing',
      label: 'Data Processing Record',
      description: 'GDPR Article 30 compliant record of all processing activities'
    },
    {
      value: 'consent_audit',
      label: 'Consent Management Audit',
      description: 'Review of consent collection, storage, and withdrawal processes'
    },
    {
      value: 'access_log',
      label: 'Data Access Summary',
      description: 'Analysis of data access patterns and security events'
    },
    {
      value: 'breach_summary',
      label: 'Breach Response Report',
      description: 'Documentation of security incidents and response actions'
    }
  ];

  const handleGenerateReport = () => {
    const newReport: ComplianceReport = {
      id: Date.now().toString(),
      name: reportTypes.find(type => type.value === selectedReportType)?.label || 'Custom Report',
      type: selectedReportType as ComplianceReport['type'],
      status: 'generating',
      createdDate: new Date().toISOString().split('T')[0],
      description: reportTypes.find(type => type.value === selectedReportType)?.description || ''
    };

    setComplianceReports(prev => [newReport, ...prev]);
    setShowGenerateModal(false);

    // Simulate report generation
    setTimeout(() => {
      setComplianceReports(prev => 
        prev.map(report => 
          report.id === newReport.id 
            ? { 
                ...report, 
                status: 'ready' as const,
                generatedDate: new Date().toISOString().split('T')[0],
                size: '1.2 MB'
              }
            : report
        )
      );
    }, 3000);
  };

  const handleDownloadReport = (reportId: string) => {
    // Implement download logic
    console.log('Downloading report:', reportId);
  };

  const getComplianceOverview = () => {
    const goodMetrics = privacyMetrics.filter(m => m.status === 'good').length;
    const warningMetrics = privacyMetrics.filter(m => m.status === 'warning').length;
    const criticalMetrics = privacyMetrics.filter(m => m.status === 'critical').length;
    
    return { goodMetrics, warningMetrics, criticalMetrics };
  };

  const overview = getComplianceOverview();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="font-medium text-lg">Privacy Compliance Reporting</div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 flex items-center"
        >
          <FileText size={14} className="mr-1" />
          Generate Report
        </button>
      </div>

      {/* Compliance Overview Dashboard */}
      <div className="mb-8">
        <div className="font-medium mb-4">Privacy Compliance Overview</div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <CheckCircle className="text-green-600 mr-2" size={20} />
              <div>
                <div className="font-medium text-green-800">Compliant</div>
                <div className="text-lg font-bold text-green-600">{overview.goodMetrics}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center">
              <AlertTriangle className="text-yellow-600 mr-2" size={20} />
              <div>
                <div className="font-medium text-yellow-800">Needs Attention</div>
                <div className="text-lg font-bold text-yellow-600">{overview.warningMetrics}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 mr-2" size={20} />
              <div>
                <div className="font-medium text-red-800">Critical Issues</div>
                <div className="text-lg font-bold text-red-600">{overview.criticalMetrics}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <BarChart className="text-blue-600 mr-2" size={20} />
              <div>
                <div className="font-medium text-blue-800">Total Metrics</div>
                <div className="text-lg font-bold text-blue-600">{privacyMetrics.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Privacy Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {privacyMetrics.map(metric => (
            <div key={metric.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{metric.metric}</div>
                <div className={`px-2 py-0.5 rounded text-xs ${getMetricStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </div>
              </div>
              
              <div className="text-lg font-bold mb-1">{metric.value}</div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="text-gray-600">{metric.category}</div>
                <div className={`flex items-center ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{metric.change >= 0 ? '↗' : '↘'}</span>
                  <span className="ml-1">{Math.abs(metric.change)}%</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div className="mb-6">
        <div className="font-medium mb-4">Generated Reports</div>
        
        <div className="space-y-3">
          {complianceReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {getReportTypeIcon(report.type)}
                  <div className="ml-3">
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{report.description}</div>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                      <div>Created: {new Date(report.createdDate).toLocaleDateString()}</div>
                      {report.generatedDate && (
                        <div>Generated: {new Date(report.generatedDate).toLocaleDateString()}</div>
                      )}
                      {report.size && <div>Size: {report.size}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {getReportStatusIcon(report.status)}
                    <span className="ml-1 text-sm capitalize">{report.status}</span>
                  </div>
                  
                  {report.status === 'ready' && (
                    <button
                      onClick={() => handleDownloadReport(report.id)}
                      className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 flex items-center"
                    >
                      <Download size={12} className="mr-1" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="font-medium mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50">
            <div className="flex items-center mb-2">
              <PieChart size={16} className="text-purple-600 mr-2" />
              <div className="font-medium text-sm">Privacy Dashboard</div>
            </div>
            <div className="text-xs text-gray-600">View detailed privacy metrics and trends</div>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50">
            <div className="flex items-center mb-2">
              <Settings size={16} className="text-blue-600 mr-2" />
              <div className="font-medium text-sm">Configure Alerts</div>
            </div>
            <div className="text-xs text-gray-600">Set up automated compliance monitoring</div>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50">
            <div className="flex items-center mb-2">
              <Calendar size={16} className="text-green-600 mr-2" />
              <div className="font-medium text-sm">Schedule Reports</div>
            </div>
            <div className="text-xs text-gray-600">Automate regular compliance reporting</div>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50">
            <div className="flex items-center mb-2">
              <Eye size={16} className="text-orange-600 mr-2" />
              <div className="font-medium text-sm">Audit Trail</div>
            </div>
            <div className="text-xs text-gray-600">Review detailed audit logs and access history</div>
          </button>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="font-medium text-lg mb-4">Generate Privacy Compliance Report</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select report type...</option>
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {selectedReportType && (
                  <div className="text-sm text-gray-600 mt-1">
                    {reportTypes.find(type => type.value === selectedReportType)?.description}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={reportFilters.startDate}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={reportFilters.endDate}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <div className="flex space-x-4">
                  {['pdf', 'excel', 'csv'].map(format => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={reportFilters.format === format}
                        onChange={(e) => setReportFilters(prev => ({ ...prev, format: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.includeAuditTrail}
                      onChange={(e) => setReportFilters(prev => ({ 
                        ...prev, 
                        includeAuditTrail: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Include audit trail</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.includePersonalData}
                      onChange={(e) => setReportFilters(prev => ({ 
                        ...prev, 
                        includePersonalData: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Include personal data summary (anonymized)</span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Privacy Notice</div>
                  <div>
                    All reports are generated with appropriate anonymization and aggregation 
                    to protect individual privacy while maintaining compliance audit capabilities.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={!selectedReportType}
                className="flex-1 bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}