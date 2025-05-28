import { useEffect, useState } from 'react';
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
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    }
  }, [userId]);

  const loadProfile = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileManager.getUserProfile(id);
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

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

  const uploadImage = async (imageFile: File): Promise<boolean> => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

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
    if (!userId) {
      setError('User ID is required');
      return false;
    }

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
    if (!userId) {
      setError('User ID is required');
      return false;
    }

    try {
      setError(null);
      await profileManager.updateCommunicationPreferences(userId, preferences);
      return true;
    } catch (err) {
      setError('Failed to update communication preferences');
      console.error('Error updating communication preferences:', err);
      return false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadImage,
    deleteProfile,
    updateCommunicationPreferences,
    refreshProfile: () => userId ? loadProfile(userId) : Promise.resolve(),
  };
}