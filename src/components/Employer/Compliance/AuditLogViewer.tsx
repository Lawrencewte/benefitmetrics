import {
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    Clock,
    Download,
    FileText,
    Filter,
    Search,
    Shield,
    User
} from 'lucide-react';
import { useState } from 'react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  status: 'success' | 'failure' | 'warning';
  details: string;
  category: 'access' | 'data' | 'admin' | 'security' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function AuditLogViewer() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      timestamp: '2025-05-22T10:30:00Z',
      userId: 'usr_123',
      userEmail: 'admin@company.com',
      action: 'LOGIN',
      resource: 'admin_dashboard',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      location: 'Austin, TX',
      status: 'success',
      details: 'Successful administrator login',
      category: 'access',
      severity: 'low'
    },
    {
      id: '2',
      timestamp: '2025-05-22T10:15:00Z',
      userId: 'usr_456',
      userEmail: 'hr@company.com',
      action: 'DATA_EXPORT',
      resource: 'employee_health_data',
      resourceId: 'emp_789',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7)',
      location: 'Austin, TX',
      status: 'success',
      details: 'Exported anonymized health metrics for compliance report',
      category: 'data',
      severity: 'medium'
    },
    {
      id: '3',
      timestamp: '2025-05-22T09:45:00Z',
      userId: 'usr_789',
      userEmail: 'security@company.com',
      action: 'FAILED_LOGIN',
      resource: 'admin_dashboard',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      location: 'Unknown',
      status: 'failure',
      details: 'Multiple failed login attempts detected',
      category: 'security',
      severity: 'high'
    },
    {
      id: '4',
      timestamp: '2025-05-22T09:30:00Z',
      userId: 'usr_123',
      userEmail: 'admin@company.com',
      action: 'CONFIG_CHANGE',
      resource: 'privacy_settings',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      location: 'Austin, TX',
      status: 'success',
      details: 'Updated data retention policy settings',
      category: 'compliance',
      severity: 'medium'
    },
    {
      id: '5',
      timestamp: '2025-05-22T08:00:00Z',
      userId: 'sys_backup',
      userEmail: 'system@company.com',
      action: 'DATA_BACKUP',
      resource: 'encrypted_database',
      ipAddress: '127.0.0.1',
      userAgent: 'System Process',
      status: 'success',
      details: 'Automated daily backup completed successfully',
      category: 'admin',
      severity: 'low'
    }
  ]);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    category: '',
    severity: '',
    status: '',
    searchTerm: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const getStatusIcon = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failure':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: AuditLogEntry['category']) => {
    switch (category) {
      case 'access':
        return <User size={16} className="text-blue-600" />;
      case 'data':
        return <FileText size={16} className="text-purple-600" />;
      case 'admin':
        return <Shield size={16} className="text-indigo-600" />;
      case 'security':
        return <Shield size={16} className="text-red-600" />;
      case 'compliance':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !filters.searchTerm || 
      log.userEmail.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || log.category === filters.category;
    const matchesSeverity = !filters.severity || log.severity === filters.severity;
    const matchesStatus = !filters.status || log.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const handleExport = () => {
    // Implement export functionality
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Status', 'Severity', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userEmail,
        log.action,
        log.resource,
        log.status,
        log.severity,
        `"${log.details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-lg">Audit Log Viewer</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 flex items-center"
          >
            <Filter size={14} className="mr-1" />
            Filters
            <ChevronDown size={14} className={`ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            className="bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 flex items-center"
          >
            <Download size={14} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs by user, action, or details..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">All Categories</option>
                <option value="access">Access</option>
                <option value="data">Data</option>
                <option value="admin">Admin</option>
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={() => setFilters({
                startDate: '', endDate: '', userId: '', category: '', 
                severity: '', status: '', searchTerm: ''
              })}
              className="bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredLogs.length} of {auditLogs.length} log entries
      </div>

      {/* Audit Log Entries */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.map(log => {
          const timestamp = formatTimestamp(log.timestamp);
          return (
            <div 
              key={log.id} 
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(log.category)}
                  {getStatusIcon(log.status)}
                  <div className="font-medium text-sm">{log.action}</div>
                  <div className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {timestamp.date} {timestamp.time}
                </div>
              </div>
              
              <div className="text-sm mb-1">
                <span className="font-medium">User:</span> {log.userEmail}
              </div>
              <div className="text-sm mb-1">
                <span className="font-medium">Resource:</span> {log.resource}
                {log.resourceId && <span className="text-gray-500"> ({log.resourceId})</span>}
              </div>
              <div className="text-sm text-gray-600">{log.details}</div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div>IP: {log.ipAddress}</div>
                {log.location && <div>Location: {log.location}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <div>No audit log entries found matching your criteria</div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-lg">Audit Log Details</div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Timestamp</div>
                  <div className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Status</div>
                  <div className="flex items-center">
                    {getStatusIcon(selectedLog.status)}
                    <span className="ml-1 text-sm capitalize">{selectedLog.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Category</div>
                  <div className="flex items-center">
                    {getCategoryIcon(selectedLog.category)}
                    <span className="ml-1 text-sm capitalize">{selectedLog.category}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Severity</div>
                  <div className={`inline-block px-2 py-0.5 rounded text-xs ${getSeverityColor(selectedLog.severity)}`}>
                    {selectedLog.severity.toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">User</div>
                <div className="text-sm">{selectedLog.userEmail} ({selectedLog.userId})</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Action</div>
                <div className="text-sm">{selectedLog.action}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Resource</div>
                <div className="text-sm">
                  {selectedLog.resource}
                  {selectedLog.resourceId && <span className="text-gray-500"> ({selectedLog.resourceId})</span>}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Details</div>
                <div className="text-sm bg-gray-50 p-3 rounded border">{selectedLog.details}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">IP Address</div>
                  <div className="text-sm font-mono">{selectedLog.ipAddress}</div>
                </div>
                {selectedLog.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Location</div>
                    <div className="text-sm">{selectedLog.location}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">User Agent</div>
                <div className="text-sm text-gray-600 break-all">{selectedLog.userAgent}</div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}