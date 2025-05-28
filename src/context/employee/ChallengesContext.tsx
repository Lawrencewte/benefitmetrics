import React, { createContext, useContext, useState, useEffect } from 'react';
import { challengesService } from '../../services/employee/challenges';

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'canceled';
  category: 'physical' | 'nutrition' | 'mental' | 'preventative' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  participants: number;
  employerId?: string;
  isCompanyWide: boolean;
  rules: string;
  milestones?: ChallengeMilestone[];
  rewards?: ChallengeReward[];
  userProgress?: ChallengeProgress;
}

interface ChallengeMilestone {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  points: number;
}

interface ChallengeReward {
  id: string;
  name: string;
  description: string;
  value: number;
  type: 'points' | 'gift_card' | 'merchandise' | 'pto' | 'cash';
  threshold: number;
}

interface ChallengeProgress {
  userId: string;
  challengeId: string;
  enrolled: boolean;
  enrollmentDate?: string;
  currentProgress: number;
  milestoneProgress: {
    milestoneId: string;
    progress: number;
    completed: boolean;
    completedDate?: string;
  }[];
  pointsEarned: number;
  rewardsEarned: string[];
  lastUpdated: string;
}

interface ChallengesContextType {
  challenges: Challenge[];
  activeChallenges: Challenge[];
  enrolledChallenges: Challenge[];
  availableChallenges: Challenge[];
  totalPointsEarned: number;
  isLoading: boolean;
  error: string | null;
  enrollInChallenge: (challengeId: string) => Promise<boolean>;
  updateProgress: (challengeId: string, progress: number) => Promise<boolean>;
  leaveChallenge: (challengeId: string) => Promise<boolean>;
  refreshChallenges: () => Promise<void>;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export function ChallengesProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode;
  userId: string;
}) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      refreshChallenges();
    }
  }, [userId]);

  const refreshChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const challengesData = await challengesService.getChallenges(userId);
      setChallenges(challengesData);
    } catch (err) {
      setError('Failed to load challenges');
      console.error('Error loading challenges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const enrollInChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      setError(null);
      await challengesService.enrollInChallenge(userId, challengeId);
      
      // Update the challenge in the state
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? {
                ...challenge, 
                userProgress: {
                  userId,
                  challengeId,
                  enrolled: true,
                  enrollmentDate: new Date().toISOString(),
                  currentProgress: 0,
                  milestoneProgress: [],
                  pointsEarned: 0,
                  rewardsEarned: [],
                  lastUpdated: new Date().toISOString(),
                }
              }
            : challenge
        )
      );
      
      return true;
    } catch (err) {
      setError('Failed to enroll in challenge');
      console.error('Error enrolling in challenge:', err);
      return false;
    }
  };

  const updateProgress = async (challengeId: string, progress: number): Promise<boolean> => {
    try {
      setError(null);
      const updatedProgress = await challengesService.updateProgress(userId, challengeId, progress);
      
      // Update the challenge progress in the state
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, userProgress: updatedProgress }
            : challenge
        )
      );
      
      return true;
    } catch (err) {
      setError('Failed to update progress');
      console.error('Error updating progress:', err);
      return false;
    }
  };

  const leaveChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      setError(null);
      await challengesService.leaveChallenge(userId, challengeId);
      
      // Update the challenge in the state
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, userProgress: undefined }
            : challenge
        )
      );
      
      return true;
    } catch (err) {
      setError('Failed to leave challenge');
      console.error('Error leaving challenge:', err);
      return false;
    }
  };

  // Computed values
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const enrolledChallenges = challenges.filter(c => c.userProgress?.enrolled);
  const availableChallenges = challenges.filter(c => 
    c.status === 'active' && (!c.userProgress || !c.userProgress.enrolled)
  );
  const totalPointsEarned = challenges.reduce((total, challenge) => {
    return total + (challenge.userProgress?.pointsEarned || 0);
  }, 0);

  const value: ChallengesContextType = {
    challenges,
    activeChallenges,
    enrolledChallenges,
    availableChallenges,
    totalPointsEarned,
    isLoading,
    error,
    enrollInChallenge,
    updateProgress,
    leaveChallenge,
    refreshChallenges,
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengesContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
}