import { useCallback, useEffect, useState } from 'react';

interface WellnessProgram {
  id: string;
  name: string;
  description: string;
  type: 'challenge' | 'incentive' | 'education' | 'screening' | 'custom';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  targetAudience: {
    departments?: string[];
    roles?: string[];
    ageGroups?: string[];
    healthRiskLevels?: string[];
    includeAll: boolean;
  };
  objectives: ProgramObjective[];
  metrics: ProgramMetric[];
  rewards?: ProgramReward[];
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  participation: {
    enrolled: number;
    active: number;
    completed: number;
    target: number;
  };
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

interface ProgramObjective {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface ProgramMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  unit: string;
  target?: number;
  category: 'participation' | 'health' | 'engagement' | 'financial';
  lastUpdated: string;
}

interface ProgramReward {
  id: string;
  name: string;
  description: string;
  type: 'points' | 'monetary' | 'time_off' | 'merchandise' | 'recognition';
  value: number;
  currency?: string;
  criteria: RewardCriteria[];
  quantity: number;
  claimed: number;
  isActive: boolean;
}

interface RewardCriteria {
  type: 'completion' | 'participation' | 'achievement' | 'milestone';
  value: number;
  description: string;
}

interface Challenge extends WellnessProgram {
  type: 'challenge';
  challengeType: 'individual' | 'team' | 'department';
  rules: string[];
  leaderboard: LeaderboardEntry[];
  teams?: ChallengeTeam[];
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  department: string;
  score: number;
  rank: number;
  progress: number;
  lastActivity: string;
}

interface ChallengeTeam {
  id: string;
  name: string;
  memberIds: string[];
  totalScore: number;
  rank: number;
  captain: string;
}

interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in days
  objectives: Omit<ProgramObjective, 'id' | 'currentValue'>[];
  defaultRewards: Omit<ProgramReward, 'id' | 'claimed'>[];
  estimatedBudget: number;
  expectedParticipation: number;
  tags: string[];
}

interface ProgramAnalytics {
  programId: string;
  enrollmentRate: number;
  completionRate: number;
  engagementScore: number;
  costPerParticipant: number;
  roi: number;
  healthImpactScore: number;
  participantFeedback: {
    averageRating: number;
    totalResponses: number;
    comments: ProgramFeedback[];
  };
  timeSeriesData: {
    date: string;
    enrolled: number;
    active: number;
    completed: number;
  }[];
}

interface ProgramFeedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  category: 'content' | 'difficulty' | 'rewards' | 'duration' | 'overall';
  submittedDate: string;
  isAnonymous: boolean;
}

interface ProgramManagementHook {
  // Program CRUD operations
  programs: WellnessProgram[];
  createProgram: (program: Omit<WellnessProgram, 'id' | 'createdDate' | 'lastModified'>) => Promise<WellnessProgram>;
  updateProgram: (id: string, updates: Partial<WellnessProgram>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  duplicateProgram: (id: string, newName?: string) => Promise<WellnessProgram>;
  
  // Program lifecycle management
  launchProgram: (id: string) => Promise<void>;
  pauseProgram: (id: string) => Promise<void>;
  resumeProgram: (id: string) => Promise<void>;
  completeProgram: (id: string) => Promise<void>;
  archiveProgram: (id: string) => Promise<void>;
  
  // Templates and pre-built programs
  templates: ProgramTemplate[];
  createFromTemplate: (templateId: string, customizations?: Partial<WellnessProgram>) => Promise<WellnessProgram>;
  saveAsTemplate: (programId: string, templateName: string) => Promise<ProgramTemplate>;
  
  // Challenge management
  challenges: Challenge[];
  createChallenge: (challenge: Omit<Challenge, 'id' | 'createdDate' | 'lastModified'>) => Promise<Challenge>;
  updateLeaderboard: (challengeId: string) => Promise<void>;
  addTeamToChallenge: (challengeId: string, team: Omit<ChallengeTeam, 'id'>) => Promise<void>;
  
  // Analytics and reporting
  getProgramAnalytics: (programId: string) => Promise<ProgramAnalytics>;
  getAllProgramsAnalytics: () => Promise<Record<string, ProgramAnalytics>>;
  exportProgramReport: (programId: string, format: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
  
  // Participant management
  enrollParticipant: (programId: string, userId: string) => Promise<void>;
  removeParticipant: (programId: string, userId: string) => Promise<void>;
  getParticipantProgress: (programId: string, userId: string) => Promise<any>;
  bulkEnrollment: (programId: string, userIds: string[]) => Promise<void>;
  
  // Rewards and incentives
  createReward: (programId: string, reward: Omit<ProgramReward, 'id' | 'claimed'>) => Promise<void>;
  updateReward: (programId: string, rewardId: string, updates: Partial<ProgramReward>) => Promise<void>;
  distributeRewards: (programId: string, criteria?: any) => Promise<void>;
  getRewardClaims: (programId: string) => Promise<any[]>;
  
  // Communication and notifications
  sendProgramAnnouncement: (programId: string, message: string, channels: string[]) => Promise<void>;
  sendProgramReminder: (programId: string, reminderType: string) => Promise<void>;
  scheduleNotifications: (programId: string, schedule: any) => Promise<void>;
  
  // State management
  isLoading: boolean;
  error: string | null;
  selectedProgram: WellnessProgram | null;
  setSelectedProgram: (program: WellnessProgram | null) => void;
  refreshPrograms: () => Promise<void>;
}

export function useProgramManagement(): ProgramManagementHook {
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [templates, setTemplates] = useState<ProgramTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<WellnessProgram | null>(null);

  // API helper function
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api/programs/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }, []);

  // Create a new program
  const createProgram = useCallback(async (program: Omit<WellnessProgram, 'id' | 'createdDate' | 'lastModified'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newProgram = await apiCall('', {
        method: 'POST',
        body: JSON.stringify({
          ...program,
          createdDate: new Date().toISOString(),
          lastModified: new Date().toISOString()
        })
      });

      setPrograms(prev => [newProgram, ...prev]);
      return newProgram;
    } catch (err) {
      setError(`Failed to create program: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Update an existing program
  const updateProgram = useCallback(async (id: string, updates: Partial<WellnessProgram>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProgram = await apiCall(id, {
        method: 'PUT',
        body: JSON.stringify({
          ...updates,
          lastModified: new Date().toISOString()
        })
      });

      setPrograms(prev => 
        prev.map(program => 
          program.id === id ? { ...program, ...updatedProgram } : program
        )
      );

      if (selectedProgram?.id === id) {
        setSelectedProgram(prev => prev ? { ...prev, ...updatedProgram } : null);
      }
    } catch (err) {
      setError(`Failed to update program: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, selectedProgram]);

  // Delete a program
  const deleteProgram = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall(id, { method: 'DELETE' });
      setPrograms(prev => prev.filter(program => program.id !== id));
      
      if (selectedProgram?.id === id) {
        setSelectedProgram(null);
      }
    } catch (err) {
      setError(`Failed to delete program: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, selectedProgram]);

  // Duplicate a program
  const duplicateProgram = useCallback(async (id: string, newName?: string) => {
    const originalProgram = programs.find(p => p.id === id);
    if (!originalProgram) {
      throw new Error('Program not found');
    }

    const duplicatedProgram = {
      ...originalProgram,
      name: newName || `${originalProgram.name} (Copy)`,
      status: 'draft' as const,
      participation: {
        enrolled: 0,
        active: 0,
        completed: 0,
        target: originalProgram.participation.target
      },
      budget: {
        ...originalProgram.budget,
        spent: 0
      }
    };

    delete (duplicatedProgram as any).id;
    delete (duplicatedProgram as any).createdDate;
    delete (duplicatedProgram as any).lastModified;

    return createProgram(duplicatedProgram);
  }, [programs, createProgram]);

  // Program lifecycle management
  const launchProgram = useCallback(async (id: string) => {
    await updateProgram(id, { status: 'active' });
  }, [updateProgram]);

  const pauseProgram = useCallback(async (id: string) => {
    await updateProgram(id, { status: 'paused' });
  }, [updateProgram]);

  const resumeProgram = useCallback(async (id: string) => {
    await updateProgram(id, { status: 'active' });
  }, [updateProgram]);

  const completeProgram = useCallback(async (id: string) => {
    await updateProgram(id, { status: 'completed' });
  }, [updateProgram]);

  const archiveProgram = useCallback(async (id: string) => {
    await updateProgram(id, { status: 'archived' });
  }, [updateProgram]);

  // Template management
  const createFromTemplate = useCallback(async (templateId: string, customizations: Partial<WellnessProgram> = {}) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const programFromTemplate: Omit<WellnessProgram, 'id' | 'createdDate' | 'lastModified'> = {
      name: customizations.name || template.name,
      description: customizations.description || template.description,
      type: 'custom',
      status: 'draft',
      startDate: customizations.startDate || new Date().toISOString(),
      endDate: customizations.endDate || new Date(Date.now() + template.duration * 24 * 60 * 60 * 1000).toISOString(),
      targetAudience: customizations.targetAudience || { includeAll: true },
      objectives: template.objectives.map(obj => ({
        ...obj,
        id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        currentValue: 0
      })),
      metrics: [],
      rewards: template.defaultRewards?.map(reward => ({
        ...reward,
        id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        claimed: 0
      })),
      budget: {
        allocated: customizations.budget?.allocated || template.estimatedBudget,
        spent: 0,
        currency: 'USD'
      },
      participation: {
        enrolled: 0,
        active: 0,
        completed: 0,
        target: customizations.participation?.target || template.expectedParticipation
      },
      createdBy: 'current_user', // This would come from auth context
      ...customizations
    };

    return createProgram(programFromTemplate);
  }, [templates, createProgram]);

  const saveAsTemplate = useCallback(async (programId: string, templateName: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) {
      throw new Error('Program not found');
    }

    try {
      const template = await apiCall('templates', {
        method: 'POST',
        body: JSON.stringify({
          name: templateName,
          description: program.description,
          category: program.type,
          difficulty: 'intermediate', // Default, could be determined by complexity
          duration: Math.ceil((new Date(program.endDate).getTime() - new Date(program.startDate).getTime()) / (24 * 60 * 60 * 1000)),
          objectives: program.objectives.map(({ id, currentValue, ...obj }) => obj),
          defaultRewards: program.rewards?.map(({ id, claimed, ...reward }) => reward) || [],
          estimatedBudget: program.budget.allocated,
          expectedParticipation: program.participation.target,
          tags: [program.type]
        })
      });

      setTemplates(prev => [template, ...prev]);
      return template;
    } catch (err) {
      setError(`Failed to save template: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [programs, apiCall]);

  // Challenge management
  const createChallenge = useCallback(async (challenge: Omit<Challenge, 'id' | 'createdDate' | 'lastModified'>) => {
    const newChallenge = await createProgram(challenge) as Challenge;
    setChallenges(prev => [newChallenge, ...prev]);
    return newChallenge;
  }, [createProgram]);

  const updateLeaderboard = useCallback(async (challengeId: string) => {
    try {
      const leaderboard = await apiCall(`${challengeId}/leaderboard`, { method: 'PUT' });
      
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, leaderboard: leaderboard.entries }
            : challenge
        )
      );
    } catch (err) {
      setError(`Failed to update leaderboard: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const addTeamToChallenge = useCallback(async (challengeId: string, team: Omit<ChallengeTeam, 'id'>) => {
    try {
      const newTeam = await apiCall(`${challengeId}/teams`, {
        method: 'POST',
        body: JSON.stringify(team)
      });

      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { 
                ...challenge, 
                teams: [...(challenge.teams || []), newTeam]
              }
            : challenge
        )
      );
    } catch (err) {
      setError(`Failed to add team: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  // Analytics
  const getProgramAnalytics = useCallback(async (programId: string): Promise<ProgramAnalytics> => {
    try {
      return await apiCall(`${programId}/analytics`);
    } catch (err) {
      setError(`Failed to fetch program analytics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [apiCall]);

  const getAllProgramsAnalytics = useCallback(async () => {
    try {
      return await apiCall('analytics');
    } catch (err) {
      setError(`Failed to fetch all program analytics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [apiCall]);

  const exportProgramReport = useCallback(async (programId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const response = await fetch(`/api/programs/${programId}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (err) {
      setError(`Failed to export report: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, []);

  // Participant management
  const enrollParticipant = useCallback(async (programId: string, userId: string) => {
    try {
      await apiCall(`${programId}/participants`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });

      // Update local program state
      setPrograms(prev => 
        prev.map(program => 
          program.id === programId 
            ? { 
                ...program, 
                participation: {
                  ...program.participation,
                  enrolled: program.participation.enrolled + 1
                }
              }
            : program
        )
      );
    } catch (err) {
      setError(`Failed to enroll participant: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const removeParticipant = useCallback(async (programId: string, userId: string) => {
    try {
      await apiCall(`${programId}/participants/${userId}`, { method: 'DELETE' });

      setPrograms(prev => 
        prev.map(program => 
          program.id === programId 
            ? { 
                ...program, 
                participation: {
                  ...program.participation,
                  enrolled: Math.max(0, program.participation.enrolled - 1)
                }
              }
            : program
        )
      );
    } catch (err) {
      setError(`Failed to remove participant: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const getParticipantProgress = useCallback(async (programId: string, userId: string) => {
    try {
      return await apiCall(`${programId}/participants/${userId}/progress`);
    } catch (err) {
      setError(`Failed to fetch participant progress: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [apiCall]);

  const bulkEnrollment = useCallback(async (programId: string, userIds: string[]) => {
    try {
      await apiCall(`${programId}/participants/bulk`, {
        method: 'POST',
        body: JSON.stringify({ userIds })
      });

      setPrograms(prev => 
        prev.map(program => 
          program.id === programId 
            ? { 
                ...program, 
                participation: {
                  ...program.participation,
                  enrolled: program.participation.enrolled + userIds.length
                }
              }
            : program
        )
      );
    } catch (err) {
      setError(`Failed to bulk enroll participants: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  // Rewards management
  const createReward = useCallback(async (programId: string, reward: Omit<ProgramReward, 'id' | 'claimed'>) => {
    try {
      const newReward = await apiCall(`${programId}/rewards`, {
        method: 'POST',
        body: JSON.stringify(reward)
      });

      setPrograms(prev => 
        prev.map(program => 
          program.id === programId 
            ? { 
                ...program, 
                rewards: [...(program.rewards || []), newReward]
              }
            : program
        )
      );
    } catch (err) {
      setError(`Failed to create reward: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const updateReward = useCallback(async (programId: string, rewardId: string, updates: Partial<ProgramReward>) => {
    try {
      const updatedReward = await apiCall(`${programId}/rewards/${rewardId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setPrograms(prev => 
        prev.map(program => 
          program.id === programId 
            ? { 
                ...program, 
                rewards: program.rewards?.map(reward => 
                  reward.id === rewardId ? { ...reward, ...updatedReward } : reward
                )
              }
            : program
        )
      );
    } catch (err) {
      setError(`Failed to update reward: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const distributeRewards = useCallback(async (programId: string, criteria: any = {}) => {
    try {
      await apiCall(`${programId}/rewards/distribute`, {
        method: 'POST',
        body: JSON.stringify(criteria)
      });
    } catch (err) {
      setError(`Failed to distribute rewards: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const getRewardClaims = useCallback(async (programId: string) => {
    try {
      return await apiCall(`${programId}/rewards/claims`);
    } catch (err) {
      setError(`Failed to fetch reward claims: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [apiCall]);

  // Communication
  const sendProgramAnnouncement = useCallback(async (programId: string, message: string, channels: string[]) => {
    try {
      await apiCall(`${programId}/communicate`, {
        method: 'POST',
        body: JSON.stringify({ 
          type: 'announcement', 
          message, 
          channels 
        })
      });
    } catch (err) {
      setError(`Failed to send announcement: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const sendProgramReminder = useCallback(async (programId: string, reminderType: string) => {
    try {
      await apiCall(`${programId}/communicate`, {
        method: 'POST',
        body: JSON.stringify({ 
          type: 'reminder', 
          reminderType 
        })
      });
    } catch (err) {
      setError(`Failed to send reminder: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  const scheduleNotifications = useCallback(async (programId: string, schedule: any) => {
    try {
      await apiCall(`${programId}/notifications/schedule`, {
        method: 'POST',
        body: JSON.stringify(schedule)
      });
    } catch (err) {
      setError(`Failed to schedule notifications: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiCall]);

  // Refresh all programs
  const refreshPrograms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [programsData, templatesData] = await Promise.all([
        apiCall(''),
        apiCall('templates')
      ]);

      setPrograms(programsData.programs || []);
      setTemplates(templatesData.templates || []);
      setChallenges(programsData.programs?.filter((p: WellnessProgram) => p.type === 'challenge') || []);
    } catch (err) {
      setError(`Failed to refresh programs: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Initial data load
  useEffect(() => {
    refreshPrograms();
  }, [refreshPrograms]);

  return {
    // Program CRUD operations
    programs,
    createProgram,
    updateProgram,
    deleteProgram,
    duplicateProgram,
    
    // Program lifecycle management
    launchProgram,
    pauseProgram,
    resumeProgram,
    completeProgram,
    archiveProgram,
    
    // Templates and pre-built programs
    templates,
    createFromTemplate,
    saveAsTemplate,
    
    // Challenge management
    challenges,
    createChallenge,
    updateLeaderboard,
    addTeamToChallenge,
    
    // Analytics and reporting
    getProgramAnalytics,
    getAllProgramsAnalytics,
    exportProgramReport,
    
    // Participant management
    enrollParticipant,
    removeParticipant,
    getParticipantProgress,
    bulkEnrollment,
    
    // Rewards and incentives
    createReward,
    updateReward,
    distributeRewards,
    getRewardClaims,
    
    // Communication and notifications
    sendProgramAnnouncement,
    sendProgramReminder,
    scheduleNotifications,
    
    // State management
    isLoading,
    error,
    selectedProgram,
    setSelectedProgram,
    refreshPrograms
  };
}

export default useProgramManagement;