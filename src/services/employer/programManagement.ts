import { api } from '../api';

export interface WellnessProgram {
  id: string;
  name: string;
  description: string;
  type: 'challenge' | 'educational' | 'incentive' | 'screening';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetAudience: {
    departments: string[];
    roles: string[];
    eligibilityCriteria: string[];
  };
  goals: {
    participationTarget: number;
    completionTarget: number;
    healthOutcomeGoals: string[];
  };
  rewards: {
    pointsAwarded: number;
    incentiveType: 'monetary' | 'pto' | 'merchandise' | 'recognition';
    incentiveValue: number;
    description: string;
  };
  metrics: {
    enrolled: number;
    active: number;
    completed: number;
    dropoutRate: number;
    satisfactionScore: number;
  };
  createdBy: string;
  lastModified: string;
}

export interface Challenge {
  id: string;
  programId: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'company-wide';
  category: 'fitness' | 'nutrition' | 'mental-health' | 'preventive-care' | 'education';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // days
  requirements: {
    task: string;
    frequency: 'daily' | 'weekly' | 'one-time';
    target: number;
    unit: string;
  }[];
  tracking: {
    method: 'self-report' | 'integration' | 'verification';
    verification: boolean;
  };
  rewards: {
    points: number;
    badges: string[];
    prizes: string[];
  };
  participants: {
    enrolled: number;
    active: number;
    completed: number;
  };
  leaderboard: {
    userId: string;
    name: string;
    progress: number;
    rank: number;
  }[];
  isActive: boolean;
}

export interface Incentive {
  id: string;
  name: string;
  description: string;
  type: 'completion-bonus' | 'milestone-reward' | 'participation-incentive';
  eligibility: {
    requiredActions: string[];
    timeframe: string;
    minimumParticipation: number;
  };
  reward: {
    type: 'cash' | 'pto' | 'gift-card' | 'insurance-discount' | 'merchandise';
    value: number;
    description: string;
    redemptionInstructions: string;
  };
  budget: {
    totalAllocated: number;
    spent: number;
    remaining: number;
  };
  metrics: {
    eligible: number;
    claimed: number;
    pendingApproval: number;
    conversionRate: number;
  };
  isActive: boolean;
  expirationDate: string;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedBudget: number;
  expectedParticipation: number;
  template: {
    structure: any;
    timeline: any;
    defaultSettings: any;
  };
  tags: string[];
  popularity: number;
  successRate: number;
}

class ProgramManagementService {
  // Wellness Programs
  async getWellnessPrograms(companyId: string, filters?: {
    status?: string[];
    type?: string[];
    startDate?: string;
    endDate?: string;
  }): Promise<WellnessProgram[]> {
    try {
      const response = await api.get(`/employer/${companyId}/programs`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching wellness programs:', error);
      throw error;
    }
  }

  async createWellnessProgram(companyId: string, program: Omit<WellnessProgram, 'id' | 'metrics' | 'createdBy' | 'lastModified'>): Promise<WellnessProgram> {
    try {
      const response = await api.post(`/employer/${companyId}/programs`, program);
      return response.data;
    } catch (error) {
      console.error('Error creating wellness program:', error);
      throw error;
    }
  }

  async updateWellnessProgram(companyId: string, programId: string, updates: Partial<WellnessProgram>): Promise<WellnessProgram> {
    try {
      const response = await api.put(`/employer/${companyId}/programs/${programId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating wellness program:', error);
      throw error;
    }
  }

  async deleteWellnessProgram(companyId: string, programId: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`/employer/${companyId}/programs/${programId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting wellness program:', error);
      throw error;
    }
  }

  async duplicateWellnessProgram(companyId: string, programId: string, newName: string): Promise<WellnessProgram> {
    try {
      const response = await api.post(`/employer/${companyId}/programs/${programId}/duplicate`, {
        name: newName
      });
      return response.data;
    } catch (error) {
      console.error('Error duplicating wellness program:', error);
      throw error;
    }
  }

  // Challenges
  async getChallenges(companyId: string, programId?: string): Promise<Challenge[]> {
    try {
      const params = programId ? { programId } : {};
      const response = await api.get(`/employer/${companyId}/challenges`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  }

  async createChallenge(companyId: string, challenge: Omit<Challenge, 'id' | 'participants' | 'leaderboard'>): Promise<Challenge> {
    try {
      const response = await api.post(`/employer/${companyId}/challenges`, challenge);
      return response.data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  async updateChallenge(companyId: string, challengeId: string, updates: Partial<Challenge>): Promise<Challenge> {
    try {
      const response = await api.put(`/employer/${companyId}/challenges/${challengeId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  }

  async getChallengeLeaderboard(companyId: string, challengeId: string, limit: number = 100): Promise<{
    userId: string;
    name: string;
    progress: number;
    rank: number;
    lastUpdate: string;
  }[]> {
    try {
      const response = await api.get(`/employer/${companyId}/challenges/${challengeId}/leaderboard`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching challenge leaderboard:', error);
      throw error;
    }
  }

  async getChallengeParticipants(companyId: string, challengeId: string): Promise<{
    userId: string;
    name: string;
    department: string;
    enrolledDate: string;
    progress: number;
    status: 'active' | 'completed' | 'dropped-out';
    lastActivity: string;
  }[]> {
    try {
      const response = await api.get(`/employer/${companyId}/challenges/${challengeId}/participants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching challenge participants:', error);
      throw error;
    }
  }

  // Incentives
  async getIncentives(companyId: string): Promise<Incentive[]> {
    try {
      const response = await api.get(`/employer/${companyId}/incentives`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incentives:', error);
      throw error;
    }
  }

  async createIncentive(companyId: string, incentive: Omit<Incentive, 'id' | 'budget' | 'metrics'>): Promise<Incentive> {
    try {
      const response = await api.post(`/employer/${companyId}/incentives`, incentive);
      return response.data;
    } catch (error) {
      console.error('Error creating incentive:', error);
      throw error;
    }
  }

  async updateIncentive(companyId: string, incentiveId: string, updates: Partial<Incentive>): Promise<Incentive> {
    try {
      const response = await api.put(`/employer/${companyId}/incentives/${incentiveId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating incentive:', error);
      throw error;
    }
  }

  async getIncentiveClaims(companyId: string, incentiveId: string): Promise<{
    userId: string;
    userName: string;
    claimDate: string;
    status: 'pending' | 'approved' | 'denied' | 'paid';
    amount: number;
    approvedBy?: string;
    approvedDate?: string;
    denialReason?: string;
  }[]> {
    try {
      const response = await api.get(`/employer/${companyId}/incentives/${incentiveId}/claims`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incentive claims:', error);
      throw error;
    }
  }

  async approveIncentiveClaim(companyId: string, incentiveId: string, claimId: string): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`/employer/${companyId}/incentives/${incentiveId}/claims/${claimId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving incentive claim:', error);
      throw error;
    }
  }

  async denyIncentiveClaim(companyId: string, incentiveId: string, claimId: string, reason: string): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`/employer/${companyId}/incentives/${incentiveId}/claims/${claimId}/deny`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error denying incentive claim:', error);
      throw error;
    }
  }

  // Program Templates
  async getProgramTemplates(category?: string): Promise<ProgramTemplate[]> {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/program-templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching program templates:', error);
      throw error;
    }
  }

  async createProgramFromTemplate(companyId: string, templateId: string, customizations: {
    name: string;
    startDate: string;
    endDate: string;
    targetDepartments: string[];
    budgetAdjustments?: number;
  }): Promise<WellnessProgram> {
    try {
      const response = await api.post(`/employer/${companyId}/programs/from-template/${templateId}`, customizations);
      return response.data;
    } catch (error) {
      console.error('Error creating program from template:', error);
      throw error;
    }
  }

  // Program Analytics
  async getProgramAnalytics(companyId: string, programId: string, timeframe: 'week' | 'month' | 'quarter' = 'month'): Promise<{
    participation: {
      enrolled: number;
      active: number;
      completed: number;
      dropoutRate: number;
    };
    engagement: {
      dailyActiveUsers: number;
      averageSessionDuration: number;
      actionsPerUser: number;
    };
    outcomes: {
      goalCompletionRate: number;
      healthImprovements: number;
      satisfactionScore: number;
    };
    roi: {
      programCost: number;
      measuredBenefits: number;
      roi: number;
    };
    trends: {
      date: string;
      participation: number;
      engagement: number;
      outcomes: number;
    }[];
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/programs/${programId}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching program analytics:', error);
      throw error;
    }
  }

  async exportProgramData(companyId: string, programId: string, format: 'csv' | 'xlsx' | 'pdf'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    try {
      const response = await api.post(`/employer/${companyId}/programs/${programId}/export`, {
        format
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting program data:', error);
      throw error;
    }
  }

  // Program Communication
  async sendProgramAnnouncement(companyId: string, programId: string, announcement: {
    title: string;
    message: string;
    targetAudience: 'all' | 'participants' | 'non-participants';
    channels: ('email' | 'push' | 'in-app')[];
    scheduledFor?: string;
  }): Promise<{ announcementId: string; scheduledFor: string }> {
    try {
      const response = await api.post(`/employer/${companyId}/programs/${programId}/announcements`, announcement);
      return response.data;
    } catch (error) {
      console.error('Error sending program announcement:', error);
      throw error;
    }
  }

  async getProgramFeedback(companyId: string, programId: string): Promise<{
    overallRating: number;
    totalResponses: number;
    feedback: {
      userId: string;
      rating: number;
      comment: string;
      submittedDate: string;
      helpful: boolean;
    }[];
    commonThemes: {
      theme: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      frequency: number;
    }[];
  }> {
    try {
      const response = await api.get(`/employer/${companyId}/programs/${programId}/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error fetching program feedback:', error);
      throw error;
    }
  }
}

export const programManagementService = new ProgramManagementService();