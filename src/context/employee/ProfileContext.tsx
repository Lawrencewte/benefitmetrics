import React, { createContext, useContext, useEffect, useState } from 'react';
import { profileManager } from '../../services/employee/profileManager';

interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  employerId: string;
  employeeId?: string;
  department?: string;
  jobTitle?: string;
  profileImage?: string;
  timezone?: string;
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    emailTypes: string[];
    smsTypes: string[];
    pushTypes: string[];
  };
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  uploadProfileImage: (imageFile: File) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
  updateCommunicationPreferences: (preferences: any) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  getProfileCompleteness: () => {
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  };
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode;
  userId: string;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      refreshProfile();
    }
  }, [userId]);

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileManager.getUserProfile(userId);
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProfile = await profileManager.updateUserProfile(userId, updates);
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfileImage = async (imageFile: File): Promise<boolean> => {
    try {
      setError(null);
      const imageUrl = await profileManager.uploadProfileImage(userId, imageFile);
      setProfile(prev => prev ? { ...prev, profileImage: imageUrl } : null);
      return true;
    } catch (err) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
      return false;
    }
  };

  const deleteProfile = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await profileManager.deleteUserProfile(userId);
      setProfile(null);
      return true;
    } catch (err) {
      setError('Failed to delete profile');
      console.error('Error deleting profile:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCommunicationPreferences = async (preferences: any): Promise<boolean> => {
    try {
      setError(null);
      await profileManager.updateCommunicationPreferences(userId, preferences);
      setProfile(prev => prev ? { ...prev, communicationPreferences: preferences } : null);
      return true;
    } catch (err) {
      setError('Failed to update communication preferences');
      console.error('Error updating communication preferences:', err);
      return false;
    }
  };

  const getProfileCompleteness = () => {
    if (!profile) {
      return {
        isComplete: false,
        missingFields: [],
        completionPercentage: 0,
      };
    }

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
  };

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadProfileImage,
    deleteProfile,
    updateCommunicationPreferences,
    refreshProfile,
    getProfileCompleteness,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}