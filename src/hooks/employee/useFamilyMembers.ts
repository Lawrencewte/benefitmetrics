import { useEffect, useState } from 'react';
import { familyService } from '../../services/employee/familyService';

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  healthPlan?: string;
  upcomingAppointments?: number;
  healthStatus?: 'good' | 'needsAttention' | 'overdue';
}

export function useFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchFamilyMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await familyService.getFamilyMembers();
      setFamilyMembers(data);
    } catch (err) {
      setError('Failed to fetch family members: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFamilyMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const member = await familyService.getFamilyMemberById(memberId);
      setCurrentMember(member);
    } catch (err) {
      setError('Failed to fetch family member: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const addFamilyMember = async (memberData: Omit<FamilyMember, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const newMember = await familyService.addFamilyMember(memberData);
      setFamilyMembers(prev => [...prev, newMember]);
      return true;
    } catch (err) {
      setError('Failed to add family member: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateFamilyMember = async (memberId: string, memberData: Partial<FamilyMember>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedMember = await familyService.updateFamilyMember(memberId, memberData);
      setFamilyMembers(prev => 
        prev.map(member => member.id === memberId ? updatedMember : member)
      );
      if (currentMember?.id === memberId) {
        setCurrentMember(updatedMember);
      }
      return true;
    } catch (err) {
      setError('Failed to update family member: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeFamilyMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await familyService.removeFamilyMember(memberId);
      setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
      if (currentMember?.id === memberId) {
        setCurrentMember(null);
      }
      return true;
    } catch (err) {
      setError('Failed to remove family member: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFamilyMembers();
  }, []);
  
  return {
    familyMembers,
    currentMember,
    isLoading,
    error,
    fetchFamilyMembers,
    getFamilyMember,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
  };
}