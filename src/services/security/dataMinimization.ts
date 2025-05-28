import { api } from '../api';

interface AuditLogEntry {
  id?: string;
  timestamp?: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  status?: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export const auditLogService = {
  async logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      // Add the user's IP address and user agent if available in the browser environment
      const enhancedEntry = { ...entry };
      
      if (typeof window !== 'undefined') {
        enhancedEntry.userAgent = window.navigator.userAgent;
      }
      
      await api.post('/security/audit-log', enhancedEntry);
    } catch (error) {
      // Don't throw errors for audit logging failures, but log them to console
      console.error('Error logging audit event:', error);
    }
  },
  
  async getAuditLogs(
    filters: {
      userId?: string;
      action?: string;
      resourceType?: string;
      resourceId?: string;
      startDate?: string;
      endDate?: string;
    },
    page = 1,
    perPage = 20
  ): Promise<{ logs: AuditLogEntry[]; total: number; page: number; perPage: number }> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.resourceType) params.append('resourceType', filters.resourceType);
      if (filters.resourceId) params.append('resourceId', filters.resourceId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Add pagination params
      params.append('page', page.toString());
      params.append('perPage', perPage.toString());
      
      const response = await api.get(`/security/audit-log?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
  
  async getAuditLogById(logId: string): Promise<AuditLogEntry> {
    try {
      const response = await api.get(`/security/audit-log/${logId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching audit log with ID ${logId}:`, error);
      throw error;
    }
  },
  
  async getUserAccessHistory(userId: string): Promise<AuditLogEntry[]> {
    try {
      const response = await api.get(`/security/audit-log/user/${userId}/access-history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching access history for user ${userId}:`, error);
      throw error;
    }
  },
  
  async getResourceAccessHistory(resourceType: string, resourceId: string): Promise<AuditLogEntry[]> {
    try {
      const response = await api.get(`/security/audit-log/resource/${resourceType}/${resourceId}/access-history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching access history for ${resourceType}/${resourceId}:`, error);
      throw error;
    }
  },
  
  async exportAuditLogs(
    filters: {
      userId?: string;
      action?: string;
      resourceType?: string;
      resourceId?: string;
      startDate?: string;
      endDate?: string;
    },
    format: 'csv' | 'pdf'
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.resourceType) params.append('resourceType', filters.resourceType);
      if (filters.resourceId) params.append('resourceId', filters.resourceId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Add format param
      params.append('format', format);
      
      const response = await api.get(`/security/audit-log/export?${params.toString()}`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  },
};