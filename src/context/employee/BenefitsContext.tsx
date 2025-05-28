import React, { createContext, useContext, useState, useEffect } from 'react';
import { benefitsService } from '../../services/employee/benefits';

interface BenefitsCoverage {
  id: string;
  userId: string;
  employerId: string;
  planName: string;
  planType: 'medical' | 'dental' | 'vision' | 'wellness' | 'flex_spending';
  memberId: string;
  groupNumber?: string;
  coverageLevel: 'individual' | 'individual_plus_one' | 'family';
  network: string;
  startDate: string;
  endDate?: string;
  coverageDetails: Record<string, any>;
  preventativeCareInfo?: PreventativeCareInfo[];
}

interface PreventativeCareInfo {
  id: string;
  serviceName: string;
  frequency: string;
  coverage: string;
  limitations?: string;
}

interface BenefitUsage {
  id: string;
  userId: string;
  benefitId: string;
  planYear: string;
  serviceName: string;
  serviceDate: string;
  providerName: string;
  coveredAmount: number;
  patientResponsibility: number;
  status: 'pending' | 'processed' | 'paid' | 'denied';
  serviceCategory: string;
  preventativeCare: boolean;
}

interface BenefitsContextType {
  coverage: BenefitsCoverage[];
  usage: BenefitUsage[];
  isLoading: boolean;
  error: string | null;
  refreshBenefits: () => Promise<void>;
  getBenefitsByType: (type: string) => BenefitsCoverage[];
  getYearToDateUsage: () => {
    totalSpending: number;
    totalCovered: number;
    preventativeCareUsage: number;
  };
}

const BenefitsContext = createContext<BenefitsContextType | undefined>(undefined);

export function BenefitsProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode;
  userId: string;
}) {
  const [coverage, setCoverage] = useState<BenefitsCoverage[]>([]);
  const [usage, setUsage] = useState<BenefitUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      refreshBenefits();
    }
  }, [userId]);

  const refreshBenefits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [coverageData, usageData] = await Promise.all([
        benefitsService.getBenefitsCoverage(userId),
        benefitsService.getBenefitsUsage(userId),
      ]);
      
      setCoverage(coverageData);
      setUsage(usageData);
    } catch (err) {
      setError('Failed to load benefits information');
      console.error('Error loading benefits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBenefitsByType = (type: string): BenefitsCoverage[] => {
    return coverage.filter(benefit => benefit.planType === type);
  };

  const getYearToDateUsage = () => {
    const currentYear = new Date().getFullYear().toString();
    const currentYearUsage = usage.filter(item => item.planYear === currentYear);
    
    return {
      totalSpending: currentYearUsage.reduce((sum, item) => sum + item.patientResponsibility, 0),
      totalCovered: currentYearUsage.reduce((sum, item) => sum + item.coveredAmount, 0),
      preventativeCareUsage: currentYearUsage.filter(item => item.preventativeCare).length,
    };
  };

  const value: BenefitsContextType = {
    coverage,
    usage,
    isLoading,
    error,
    refreshBenefits,
    getBenefitsByType,
    getYearToDateUsage,
  };

  return (
    <BenefitsContext.Provider value={value}>
      {children}
    </BenefitsContext.Provider>
  );
}

export function useBenefits() {
  const context = useContext(BenefitsContext);
  if (context === undefined) {
    throw new Error('useBenefits must be used within a BenefitsProvider');
  }
  return context;
}