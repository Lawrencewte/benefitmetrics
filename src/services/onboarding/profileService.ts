import { api } from '../api';

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalInfo: {
    primaryPhysician?: string;
    medicalHistory: string[];
    currentMedications: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
    allergies: string[];
    familyHistory: string[];
  };
  preferences: {
    communicationMethod: 'email' | 'sms' | 'phone';
    appointmentReminders: boolean;
    healthTips: boolean;
    marketingEmails: boolean;
    dataSharing: {
      employerAnalytics: boolean;
      researchParticipation: boolean;
      thirdPartyPartners: boolean;
    };
  };
}

interface ProfileValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}

class ProfileService {
  private readonly baseUrl = '/onboarding/profile';

  // Get user profile
  async getProfile(userId: string): Promise<Partial<ProfileData>> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  // Save user profile
  async saveProfile(
    userId: string, 
    profileData: Partial<ProfileData>
  ): Promise<ProfileData> {
    try {
      const response = await api.put(`${this.baseUrl}/${userId}`, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  }

  // Partial profile update
  async updateProfileSection(
    userId: string,
    section: keyof ProfileData,
    data: any
  ): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${userId}/section`, {
        section,
        data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update profile section:', error);
      throw error;
    }
  }

  // Validate profile data
  async validateProfile(
    userId: string,
    profileData: Partial<ProfileData>
  ): Promise<ProfileValidation> {
    try {
      const response = await api.post(`${this.baseUrl}/validate`, {
        userId,
        profileData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to validate profile:', error);
      throw error;
    }
  }

  // Get profile completion status
  async getProfileCompletion(userId: string): Promise<{
    overallCompletion: number;
    sectionCompletion: Record<keyof ProfileData, number>;
    missingRequiredFields: string[];
    recommendations: Array<{
      section: string;
      suggestion: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/completion`);
      return response.data;
    } catch (error) {
      console.error('Failed to get profile completion:', error);
      throw error;
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(userId: string, photoFile: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('userId', userId);

      const response = await api.post(`${this.baseUrl}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.photoUrl;
    } catch (error) {
      console.error('Failed to upload profile photo:', error);
      throw error;
    }
  }

  // Delete profile photo
  async deleteProfilePhoto(userId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}/photo`);
    } catch (error) {
      console.error('Failed to delete profile photo:', error);
      throw error;
    }
  }

  // Medical information specific methods
  async addMedicalCondition(
    userId: string,
    condition: string
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${userId}/medical/condition`, {
        condition,
        addedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to add medical condition:', error);
      throw error;
    }
  }

  async removeMedicalCondition(
    userId: string,
    condition: string
  ): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}/medical/condition`, {
        data: { condition }
      });
    } catch (error) {
      console.error('Failed to remove medical condition:', error);
      throw error;
    }
  }

  async addMedication(
    userId: string,
    medication: {
      name: string;
      dosage: string;
      frequency: string;
    }
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${userId}/medical/medication`, {
        ...medication,
        addedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to add medication:', error);
      throw error;
    }
  }

  async removeMedication(userId: string, medicationName: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}/medical/medication`, {
        data: { medicationName }
      });
    } catch (error) {
      console.error('Failed to remove medication:', error);
      throw error;
    }
  }

  async addAllergy(userId: string, allergy: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${userId}/medical/allergy`, {
        allergy,
        addedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to add allergy:', error);
      throw error;
    }
  }

  async removeAllergy(userId: string, allergy: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}/medical/allergy`, {
        data: { allergy }
      });
    } catch (error) {
      console.error('Failed to remove allergy:', error);
      throw error;
    }
  }

  // Privacy and consent management
  async updatePrivacyPreferences(
    userId: string,
    preferences: ProfileData['preferences']
  ): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/${userId}/privacy`, {
        preferences,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update privacy preferences:', error);
      throw error;
    }
  }

  async getConsentHistory(userId: string): Promise<Array<{
    consentType: string;
    granted: boolean;
    timestamp: string;
    version: string;
  }>> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/consent-history`);
      return response.data;
    } catch (error) {
      console.error('Failed to get consent history:', error);
      throw error;
    }
  }

  async recordConsent(
    userId: string,
    consentType: string,
    granted: boolean,
    version: string
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${userId}/consent`, {
        consentType,
        granted,
        version,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  }

  // Profile analytics (for internal use)
  async getProfileAnalytics(userId: string): Promise<{
    profileCreatedAt: string;
    lastUpdatedAt: string;
    totalUpdates: number;
    completionHistory: Array<{
      date: string;
      completionPercentage: number;
    }>;
    sectionUpdateFrequency: Record<keyof ProfileData, number>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get profile analytics:', error);
      throw error;
    }
  }

  // Export profile data (for data portability)
  async exportProfileData(userId: string): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export profile data:', error);
      throw error;
    }
  }

  // Delete profile (GDPR compliance)
  async deleteProfile(userId: string, reason?: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}`, {
        data: { 
          reason,
          deletedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw error;
    }
  }

  // Profile suggestions based on demographics/location
  async getProfileSuggestions(userId: string): Promise<{
    suggestedPhysicians: Array<{
      name: string;
      specialty: string;
      distance: string;
      rating: number;
    }>;
    relevantHealthPrograms: Array<{
      name: string;
      description: string;
      eligibility: string;
    }>;
    localHealthResources: Array<{
      name: string;
      type: string;
      address: string;
      phone: string;
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/suggestions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get profile suggestions:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();