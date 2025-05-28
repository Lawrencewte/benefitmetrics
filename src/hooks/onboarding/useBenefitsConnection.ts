import { useState } from 'react';
import { benefitsConnector } from '../../services/onboarding/benefitsConnector';

interface BenefitsConnectionParams {
  employerId: string;
  memberId: string;
  groupNumber?: string;
}

export function useBenefitsConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [benefitsData, setBenefitsData] = useState<any>(null);
  
  const connectEmployerBenefits = async (params: BenefitsConnectionParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await benefitsConnector.connectEmployerBenefits(params.employerId);
      
      // Verify eligibility
      await benefitsConnector.verifyBenefitsEligibility(params.memberId, params.employerId);
      
      // Import the benefits data
      await benefitsConnector.importBenefitsData(params.memberId, data);
      
      setBenefitsData(data);
      setIsConnected(true);
      return true;
    } catch (err) {
      setError('Failed to connect benefits: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    connectEmployerBenefits,
    isLoading,
    error,
    isConnected,
    benefitsData,
  };
}