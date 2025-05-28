import React, { createContext, useContext, useEffect, useState } from 'react';
import { familyService } from '../../services/employee/familyService';

interface FamilyMember {
  id: string;
  userId: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  healthPlan?: string;
  upcomingAppointments?: number;
  healthStatus?: 'good' | 'needsAttention' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

interface FamilyContextType {
  familyMembers: FamilyMember[];
  currentMember: FamilyMember | null;
  isLoading: boolean;
  error: string | null;
  addFamilyMember: (memberData: Omit<FamilyMember, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateFamilyMember: (memberId: string, memberData: Partial<FamilyMember>) => Promise<boolean>;
  removeFamilyMember: (memberId: string) => Promise<boolean>;
  getFamilyMember: (memberId: string) => Promise<void>;
  refreshFamilyMembers: () => Promise<void>;
  getFamilyMemberAppointments: (memberId: string) => Promise<any[]>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode;
  userId: string;
}) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      refreshFamilyMembers();
    }
  }, [userId]);

  const refreshFamilyMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await familyService.getFamilyMembers();
      setFamilyMembers(data);
    } catch (err) {
      setError('Failed to fetch family members');
      console.error('Error fetching family members:', err);
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
      setError('Failed to fetch family member');
      console.error('Error fetching family member:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const newMember = await familyService.addFamilyMember({
        ...memberData,
        userId,
      });
      setFamilyMembers(prev => [...prev, newMember]);
      return true;
    } catch (err) {
      setError('Failed to add family member');
      console.error('Error adding family member:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFamilyMember = async (memberId: string, memberData: Partial<FamilyMember>): Promise<boolean> => {
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
      setError('Failed to update family member');
      console.error('Error updating family member:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFamilyMember = async (memberId: string): Promise<boolean> => {
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
      setError('Failed to remove family member');
      console.error('Error removing family member:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getFamilyMemberAppointments = async (memberId: string): Promise<any[]> => {
    try {
      return await familyService.getFamilyMemberAppointments(memberId);
    } catch (err) {
      setError('Failed to fetch family member appointments');
      console.error('Error fetching appointments:', err);
      return [];
    }
  };

  const value: FamilyContextType = {
    familyMembers,
    currentMember,
    isLoading,
    error,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    getFamilyMember,
    refreshFamilyMembers,
    getFamilyMemberAppointments,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}