import { api } from '../api';

export const challengesService = {
  async getChallenges(userId: string): Promise<any[]> {
    try {
      const response = await api.get(`/challenges?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  },

  async enrollInChallenge(userId: string, challengeId: string): Promise<void> {
    try {
      await api.post(`/challenges/${challengeId}/enroll`, { userId });
    } catch (error) {
      console.error('Error enrolling in challenge:', error);
      throw error;
    }
  },

  async updateProgress(userId: string, challengeId: string, progress: number): Promise<any> {
    try {
      const response = await api.patch(`/challenges/${challengeId}/progress`, {
        userId,
        progress,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  },

  async leaveChallenge(userId: string, challengeId: string): Promise<void> {
    try {
      await api.delete(`/challenges/${challengeId}/enroll`, { data: { userId } });
    } catch (error) {
      console.error('Error leaving challenge:', error);
      throw error;
    }
  },
};