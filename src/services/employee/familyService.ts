import { api } from '../api';

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

export const familyService = {
  async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const response = await api.get('/family-members');
      return response.data;
    } catch (error) {
      console.error('Error fetching family members:', error);
      throw error;
    }
  },
  
  async getFamilyMemberById(memberId: string): Promise<FamilyMember> {
    try {
      const response = await api.get(`/family-members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching family member with ID ${memberId}:`, error);
      throw error;
    }
  },
  
  async addFamilyMember(memberData: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    try {
      const response = await api.post('/family-members', memberData);
      return response.data;
    } catch (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
  },
  
  async updateFamilyMember(memberId: string, memberData: Partial<FamilyMember>): Promise<FamilyMember> {
    try {
      const response = await api.patch(`/family-members/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      console.error(`Error updating family member with ID ${memberId}:`, error);
      throw error;
    }
  },
  
  async removeFamilyMember(memberId: string): Promise<void> {
    try {
      await api.delete(`/family-members/${memberId}`);
    } catch (error) {
      console.error(`Error removing family member with ID ${memberId}:`, error);
      throw error;
    }
  },
  
  async getFamilyMemberAppointments(memberId: string): Promise<any[]> {
    try {
      const response = await api.get(`/family-members/${memberId}/appointments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for family member with ID ${memberId}:`, error);
      throw error;
    }
  },
};