import { api } from '../api';

interface ComplianceReport {
  id: string;
  title: string;
  createdAt: string;
  status: 'compliant' | 'non-compliant' | 'warning';
  categories: {
    dataPrivacy: {
      status: 'compliant' | 'non-compliant' | 'warning';
      issues: string[];
    };
    hipaaCompliance: {
      status: 'compliant' | 'non-compliant' | 'warning';
      issues: string[];
    };
    dataRetention: {
      status: 'compliant' | 'non-compliant' | 'warning';
      issues: string[];
    };
    userConsent: {
      status: 'compliant' | 'non-compliant' | 'warning';
      issues: string[];
    };
  };
  overallScore: number;
  recommendations: string[];
}

export const complianceReporting = {
  async generateReport(): Promise<ComplianceReport> {
    try {
      const response = await api.post('/compliance/reports');
      return response.data;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  },
  
  async getReports(): Promise<ComplianceReport[]> {
    try {
      const response = await api.get('/compliance/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance reports:', error);
      throw error;
    }
  },
  
  async getReportById(reportId: string): Promise<ComplianceReport> {
    try {
      const response = await api.get(`/compliance/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching compliance report with ID ${reportId}:`, error);
      throw error;
    }
  },
  
  async resolveIssue(reportId: string, category: string, issueIndex: number): Promise<ComplianceReport> {
    try {
      const response = await api.post(`/compliance/reports/${reportId}/resolve`, {
        category,
        issueIndex,
      });
      return response.data;
    } catch (error) {
      console.error(`Error resolving compliance issue for report with ID ${reportId}:`, error);
      throw error;
    }
  },
  
  async downloadReport(reportId: string, format: 'pdf' | 'csv'): Promise<Blob> {
    try {
      const response = await api.get(`/compliance/reports/${reportId}/download?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading compliance report with ID ${reportId}:`, error);
      throw error;
    }
  },
  
  async scheduleRegularReports(frequency: 'weekly' | 'monthly' | 'quarterly'): Promise<void> {
    try {
      await api.post('/compliance/reports/schedule', { frequency });
    } catch (error) {
      console.error('Error scheduling regular compliance reports:', error);
      throw error;
    }
  },
};