import { useCallback, useEffect, useState } from 'react';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  status: 'success' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'access' | 'data' | 'admin' | 'security' | 'compliance';
  details: Record<string, any>;
  metadata?: Record<string, any>;
}

interface SecurityAuditHook {
  // Audit logging functions
  logEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => Promise<void>;
  logAccess: (resource: string, resourceId?: string, details?: Record<string, any>) => Promise<void>;
  logDataOperation: (operation: string, dataType: string, recordId?: string, details?: Record<string, any>) => Promise<void>;
  logSecurityEvent: (eventType: string, severity: AuditEvent['severity'], details: Record<string, any>) => Promise<void>;
  logComplianceEvent: (complianceType: string, status: string, details: Record<string, any>) => Promise<void>;
  
  // Audit querying functions
  getAuditLogs: (filters?: AuditFilters) => Promise<AuditEvent[]>;
  getAuditLogsByUser: (userId: string, limit?: number) => Promise<AuditEvent[]>;
  getAuditLogsByResource: (resource: string, resourceId?: string) => Promise<AuditEvent[]>;
  getSecurityEvents: (startDate?: string, endDate?: string) => Promise<AuditEvent[]>;
  
  // Real-time monitoring
  auditEvents: AuditEvent[];
  isLoading: boolean;
  error: string | null;
  
  // Configuration
  setAuditConfig: (config: AuditConfig) => void;
  exportAuditLogs: (filters?: AuditFilters, format?: 'json' | 'csv' | 'pdf') => Promise<Blob>;
}

interface AuditFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  resource?: string;
  category?: AuditEvent['category'];
  severity?: AuditEvent['severity'];
  status?: AuditEvent['status'];
  limit?: number;
  offset?: number;
}

interface AuditConfig {
  retentionPeriod: number; // days
  enableRealTimeAlerts: boolean;
  alertThresholds: {
    failedLogins: number;
    dataAccess: number;
    adminActions: number;
  };
  encryptionEnabled: boolean;
  anonymizeUserData: boolean;
}

// Default configuration
const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  retentionPeriod: 2555, // 7 years for HIPAA compliance
  enableRealTimeAlerts: true,
  alertThresholds: {
    failedLogins: 5,
    dataAccess: 50,
    adminActions: 10
  },
  encryptionEnabled: true,
  anonymizeUserData: false
};

export function useSecurityAudit(): SecurityAuditHook {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditConfig, setAuditConfigState] = useState<AuditConfig>(DEFAULT_AUDIT_CONFIG);

  // Get current user context
  const getCurrentUser = useCallback(() => {
    // This would typically come from your auth context
    return {
      userId: 'current_user_id',
      ipAddress: '192.168.1.1', // This would be detected
      userAgent: navigator.userAgent,
      location: 'Austin, TX' // This would be detected or configured
    };
  }, []);

  // Generate unique audit event ID
  const generateAuditId = useCallback(() => {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Core audit logging function
  const logEvent = useCallback(async (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    try {
      const auditEvent: AuditEvent = {
        id: generateAuditId(),
        timestamp: new Date().toISOString(),
        ...event
      };

      // Encrypt sensitive data if enabled
      if (auditConfig.encryptionEnabled) {
        // In a real implementation, this would encrypt sensitive fields
        auditEvent.details = { ...auditEvent.details, encrypted: true };
      }

      // Send to audit service
      const response = await fetch('/api/audit/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(auditEvent)
      });

      if (!response.ok) {
        throw new Error('Failed to log audit event');
      }

      // Update local state for real-time monitoring
      setAuditEvents(prev => [auditEvent, ...prev.slice(0, 99)]); // Keep last 100 events

      // Check for alert conditions
      if (auditConfig.enableRealTimeAlerts) {
        await checkAlertThresholds(auditEvent);
      }

    } catch (err) {
      setError(`Audit logging failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Audit logging error:', err);
    }
  }, [auditConfig, generateAuditId]);

  // Specialized logging functions
  const logAccess = useCallback(async (resource: string, resourceId?: string, details: Record<string, any> = {}) => {
    const user = getCurrentUser();
    await logEvent({
      userId: user.userId,
      action: 'ACCESS',
      resource,
      resourceId,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      location: user.location,
      status: 'success',
      severity: 'low',
      category: 'access',
      details: {
        accessType: 'read',
        ...details
      }
    });
  }, [logEvent, getCurrentUser]);

  const logDataOperation = useCallback(async (
    operation: string, 
    dataType: string, 
    recordId?: string, 
    details: Record<string, any> = {}
  ) => {
    const user = getCurrentUser();
    const severity = operation.toLowerCase().includes('delete') ? 'high' : 
                    operation.toLowerCase().includes('export') ? 'medium' : 'low';
    
    await logEvent({
      userId: user.userId,
      action: `DATA_${operation.toUpperCase()}`,
      resource: dataType,
      resourceId: recordId,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      location: user.location,
      status: 'success',
      severity,
      category: 'data',
      details: {
        operation,
        dataType,
        ...details
      }
    });
  }, [logEvent, getCurrentUser]);

  const logSecurityEvent = useCallback(async (
    eventType: string, 
    severity: AuditEvent['severity'], 
    details: Record<string, any>
  ) => {
    const user = getCurrentUser();
    await logEvent({
      userId: user.userId,
      action: `SECURITY_${eventType.toUpperCase()}`,
      resource: 'security_system',
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      location: user.location,
      status: severity === 'critical' ? 'failure' : 'warning',
      severity,
      category: 'security',
      details
    });
  }, [logEvent, getCurrentUser]);

  const logComplianceEvent = useCallback(async (
    complianceType: string, 
    status: string, 
    details: Record<string, any>
  ) => {
    const user = getCurrentUser();
    await logEvent({
      userId: user.userId,
      action: `COMPLIANCE_${complianceType.toUpperCase()}`,
      resource: 'compliance_system',
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      location: user.location,
      status: status === 'violation' ? 'failure' : 'success',
      severity: status === 'violation' ? 'high' : 'low',
      category: 'compliance',
      details: {
        complianceType,
        complianceStatus: status,
        ...details
      }
    });
  }, [logEvent, getCurrentUser]);

  // Query functions
  const getAuditLogs = useCallback(async (filters: AuditFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/audit/events?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const data = await response.json();
      return data.events || [];
    } catch (err) {
      setError(`Failed to fetch audit logs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuditLogsByUser = useCallback(async (userId: string, limit = 100) => {
    return getAuditLogs({ userId, limit });
  }, [getAuditLogs]);

  const getAuditLogsByResource = useCallback(async (resource: string, resourceId?: string) => {
    return getAuditLogs({ resource, resourceId });
  }, [getAuditLogs]);

  const getSecurityEvents = useCallback(async (startDate?: string, endDate?: string) => {
    return getAuditLogs({ 
      category: 'security', 
      startDate, 
      endDate,
      severity: 'high' // Only high severity security events
    });
  }, [getAuditLogs]);

  // Alert threshold checking
  const checkAlertThresholds = useCallback(async (event: AuditEvent) => {
    try {
      // Check for failed login attempts
      if (event.action === 'LOGIN' && event.status === 'failure') {
        const recentFailedLogins = await getAuditLogs({
          userId: event.userId,
          action: 'LOGIN',
          status: 'failure',
          startDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
          limit: auditConfig.alertThresholds.failedLogins
        });

        if (recentFailedLogins.length >= auditConfig.alertThresholds.failedLogins) {
          await logSecurityEvent('FAILED_LOGIN_THRESHOLD', 'high', {
            userId: event.userId,
            failedAttempts: recentFailedLogins.length,
            threshold: auditConfig.alertThresholds.failedLogins
          });
        }
      }

      // Check for excessive data access
      if (event.category === 'data') {
        const recentDataAccess = await getAuditLogs({
          userId: event.userId,
          category: 'data',
          startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
          limit: auditConfig.alertThresholds.dataAccess
        });

        if (recentDataAccess.length >= auditConfig.alertThresholds.dataAccess) {
          await logSecurityEvent('DATA_ACCESS_THRESHOLD', 'medium', {
            userId: event.userId,
            accessCount: recentDataAccess.length,
            threshold: auditConfig.alertThresholds.dataAccess
          });
        }
      }

      // Check for excessive admin actions
      if (event.category === 'admin') {
        const recentAdminActions = await getAuditLogs({
          userId: event.userId,
          category: 'admin',
          startDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
          limit: auditConfig.alertThresholds.adminActions
        });

        if (recentAdminActions.length >= auditConfig.alertThresholds.adminActions) {
          await logSecurityEvent('ADMIN_ACTION_THRESHOLD', 'high', {
            userId: event.userId,
            actionCount: recentAdminActions.length,
            threshold: auditConfig.alertThresholds.adminActions
          });
        }
      }
    } catch (err) {
      console.error('Alert threshold check failed:', err);
    }
  }, [auditConfig, getAuditLogs, logSecurityEvent]);

  // Export function
  const exportAuditLogs = useCallback(async (
    filters: AuditFilters = {}, 
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<Blob> => {
    const logs = await getAuditLogs(filters);
    
    switch (format) {
      case 'csv': {
        const headers = ['Timestamp', 'User ID', 'Action', 'Resource', 'Status', 'Severity', 'Details'];
        const csvContent = [
          headers.join(','),
          ...logs.map(log => [
            log.timestamp,
            log.userId,
            log.action,
            log.resource,
            log.status,
            log.severity,
            `"${JSON.stringify(log.details).replace(/"/g, '""')}"`
          ].join(','))
        ].join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      }
      
      case 'pdf': {
        // This would typically use a PDF generation library
        const pdfContent = `
          SECURITY AUDIT LOG REPORT
          Generated: ${new Date().toISOString()}
          
          ${logs.map(log => `
            ${log.timestamp} | ${log.userId} | ${log.action} | ${log.resource} | ${log.status}
            Details: ${JSON.stringify(log.details, null, 2)}
          `).join('\n')}
        `;
        
        return new Blob([pdfContent], { type: 'application/pdf' });
      }
      
      default: {
        return new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      }
    }
  }, [getAuditLogs]);

  // Configuration setter
  const setAuditConfig = useCallback((config: AuditConfig) => {
    setAuditConfigState(config);
    // Persist to storage or send to server
    localStorage.setItem('auditConfig', JSON.stringify(config));
  }, []);

  // Load initial configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem('auditConfig');
    if (savedConfig) {
      try {
        setAuditConfigState(JSON.parse(savedConfig));
      } catch (err) {
        console.error('Failed to load audit config:', err);
      }
    }
  }, []);

  // Real-time audit event subscription
  useEffect(() => {
    // This would typically set up a WebSocket connection or Server-Sent Events
    // for real-time audit event streaming
    const eventSource = new EventSource('/api/audit/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const auditEvent = JSON.parse(event.data);
        setAuditEvents(prev => [auditEvent, ...prev.slice(0, 99)]);
      } catch (err) {
        console.error('Failed to parse audit event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('Audit event stream error:', err);
      setError('Real-time audit monitoring disconnected');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Automatic session logging
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Log session end
      logEvent({
        userId: getCurrentUser().userId,
        action: 'SESSION_END',
        resource: 'application',
        ipAddress: getCurrentUser().ipAddress,
        userAgent: getCurrentUser().userAgent,
        location: getCurrentUser().location,
        status: 'success',
        severity: 'low',
        category: 'access',
        details: {
          sessionDuration: performance.now(),
          userAgent: navigator.userAgent
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Log session start
    logEvent({
      userId: getCurrentUser().userId,
      action: 'SESSION_START',
      resource: 'application',
      ipAddress: getCurrentUser().ipAddress,
      userAgent: getCurrentUser().userAgent,
      location: getCurrentUser().location,
      status: 'success',
      severity: 'low',
      category: 'access',
      details: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [logEvent, getCurrentUser]);

  return {
    // Logging functions
    logEvent,
    logAccess,
    logDataOperation,
    logSecurityEvent,
    logComplianceEvent,
    
    // Query functions
    getAuditLogs,
    getAuditLogsByUser,
    getAuditLogsByResource,
    getSecurityEvents,
    
    // State
    auditEvents,
    isLoading,
    error,
    
    // Configuration
    setAuditConfig,
    exportAuditLogs
  };
}

// Convenience hooks for specific audit scenarios
export function useDataAudit() {
  const { logDataOperation, getAuditLogsByResource } = useSecurityAudit();
  
  const logDataRead = useCallback((dataType: string, recordId?: string, details?: Record<string, any>) => {
    return logDataOperation('read', dataType, recordId, details);
  }, [logDataOperation]);
  
  const logDataWrite = useCallback((dataType: string, recordId?: string, details?: Record<string, any>) => {
    return logDataOperation('write', dataType, recordId, details);
  }, [logDataOperation]);
  
  const logDataDelete = useCallback((dataType: string, recordId?: string, details?: Record<string, any>) => {
    return logDataOperation('delete', dataType, recordId, details);
  }, [logDataOperation]);
  
  const logDataExport = useCallback((dataType: string, recordCount: number, details?: Record<string, any>) => {
    return logDataOperation('export', dataType, undefined, { recordCount, ...details });
  }, [logDataOperation]);
  
  return {
    logDataRead,
    logDataWrite,
    logDataDelete,
    logDataExport,
    getDataAuditHistory: getAuditLogsByResource
  };
}

export function useComplianceAudit() {
  const { logComplianceEvent, getAuditLogs } = useSecurityAudit();
  
  const logHIPAAAccess = useCallback((operation: string, details: Record<string, any>) => {
    return logComplianceEvent('HIPAA', 'compliant', { operation, ...details });
  }, [logComplianceEvent]);
  
  const logGDPRAction = useCallback((action: string, details: Record<string, any>) => {
    return logComplianceEvent('GDPR', 'compliant', { action, ...details });
  }, [logComplianceEvent]);
  
  const logComplianceViolation = useCallback((type: string, details: Record<string, any>) => {
    return logComplianceEvent(type, 'violation', details);
  }, [logComplianceEvent]);
  
  const getComplianceAuditLogs = useCallback((complianceType?: string) => {
    return getAuditLogs({ 
      category: 'compliance',
      ...(complianceType && { action: `COMPLIANCE_${complianceType.toUpperCase()}` })
    });
  }, [getAuditLogs]);
  
  return {
    logHIPAAAccess,
    logGDPRAction,
    logComplianceViolation,
    getComplianceAuditLogs
  };
}

export default useSecurityAudit;