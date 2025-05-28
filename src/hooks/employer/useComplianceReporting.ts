import { useState } from 'react';
import { complianceReporting } from '../../services/employer/complianceReporting';

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

export function useComplianceReporting() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [currentReport, setCurrentReport] = useState<ComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateComplianceReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const report = await complianceReporting.generateReport();
      setReports(prev => [report, ...prev]);
      setCurrentReport(report);
      return report;
    } catch (err) {
      setError('Failed to generate compliance report: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchComplianceReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await complianceReporting.getReports();
      setReports(data);
      return data;
    } catch (err) {
      setError('Failed to fetch compliance reports: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const getReportById = async (reportId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const report = await complianceReporting.getReportById(reportId);
      setCurrentReport(report);
      return report;
    } catch (err) {
      setError('Failed to fetch compliance report: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resolveComplianceIssue = async (reportId: string, category: string, issueIndex: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedReport = await complianceReporting.resolveIssue(reportId, category, issueIndex);
      setReports(prev => 
        prev.map(report => report.id === reportId ? updatedReport : report)
      );
      if (currentReport?.id === reportId) {
        setCurrentReport(updatedReport);
      }
      return true;
    } catch (err) {
      setError('Failed to resolve compliance issue: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    reports,
    currentReport,
    isLoading,
    error,
    generateComplianceReport,
    fetchComplianceReports,
    getReportById,
    resolveComplianceIssue,
  };
}