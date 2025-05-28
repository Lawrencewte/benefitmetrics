import { api } from '../api';
import { auditLogService } from '../security/auditLogService';
import { encryptionService } from '../security/encryptionService';

interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  employerId: string;
  employeeId?: string;
  department?: string;
  jobTitle?: string;
  profileImage?: string;
  timezone?: string;
  communicationPreferences?: CommunicationPreferences;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  emailTypes: string[];
  smsTypes: string[];
  pushTypes: string[];
}

export const profileManager = {
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      
      // Log the profile access for audit purposes
      await auditLogService.logAction({
        action: 'data_view',
        userId,
        resourceType: 'UserProfile',
        resourceId: userId,
        details: { operation: 'get_profile' },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Encrypt sensitive fields before sending
      const encryptedData = { ...profileData };
      
      if (profileData.emergencyContact?.phone) {
        const { encryptedData: encryptedPhone, keyId } = await encryptionService.createEncryptedField(
          profileData.emergencyContact.phone,
          'emergency_contact'
        );
        encryptedData.emergencyContact = {
          ...profileData.emergencyContact,
          phone: encryptedPhone,
          _phoneKeyId: keyId,
        };
      }

      const response = await api.patch(`/users/${userId}/profile`, encryptedData);
      
      // Log the profile update for audit purposes
      await auditLogService.logAction({
        action: 'data_update',
        userId,
        resourceType: 'UserProfile',
        resourceId: userId,
        details: { 
          operation: 'update_profile',
          fieldsUpdated: Object.keys(profileData),
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async uploadProfileImage(userId: string, imageFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/users/${userId}/profile/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Log the image upload for audit purposes
      await auditLogService.logAction({
        action: 'data_update',
        userId,
        resourceType: 'UserProfile',
        resourceId: userId,
        details: { 
          operation: 'upload_profile_image',
          fileName: imageFile.name,
          fileSize: imageFile.size,
        },
      });
      
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}/profile`);
      
      // Log the profile deletion for audit purposes
      await auditLogService.logAction({
        action: 'data_delete',
        userId,
        resourceType: 'UserProfile',
        resourceId: userId,
        details: { operation: 'delete_profile' },
      });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  },

  async updateCommunicationPreferences(
    userId: string, 
    preferences: CommunicationPreferences
  ): Promise<void> {
    try {
      await api.patch(`/users/${userId}/profile/communication-preferences`, preferences);
      
      // Log the preferences update for audit purposes
      await auditLogService.logAction({
        action: 'data_update',
        userId,
        resourceType: 'UserProfile',
        resourceId: userId,
        details: { 
          operation: 'update_communication_preferences',
          preferences,
        },
      });
    } catch (error) {
      console.error('Error updating communication preferences:', error);
      throw error;
    }
  },

  async validateProfileCompleteness(profile: UserProfile): Promise<{
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  }> {
    const requiredFields = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'email',
    ];
    
    const optionalButRecommendedFields = [
      'phone',
      'address',
      'emergencyContact',
    ];
    
    const missingRequired = requiredFields.filter(field => !profile[field]);
    const missingRecommended = optionalButRecommendedFields.filter(field => !profile[field]);
    
    const totalFields = requiredFields.length + optionalButRecommendedFields.length;
    const completedFields = totalFields - missingRequired.length - missingRecommended.length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    
    return {
      isComplete: missingRequired.length === 0,
      missingFields: [...missingRequired, ...missingRecommended],
      completionPercentage,
    };
  },
};