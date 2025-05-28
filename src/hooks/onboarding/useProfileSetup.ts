import { useState } from 'react';
import { profileManager } from '../../services/employee/profileManager';

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
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
}

export function useProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateProfileData = (data: ProfileData): boolean => {
    const errors: Record<string, string> = {};

    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.dateOfBirth.trim()) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!data.gender.trim()) {
      errors.gender = 'Gender is required';
    }

    if (data.phoneNumber && !/^\(?[\d\s\-\+\(\)]+$/.test(data.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveProfile = async (userId: string, profileData: ProfileData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!validateProfileData(profileData)) {
        return false;
      }

      // Transform the data to match the API format
      const apiData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        email: profileData.email,
        phone: profileData.phoneNumber,
        address: profileData.address,
        emergencyContact: profileData.emergencyContact,
      };

      await profileManager.updateUserProfile(userId, apiData);
      return true;
    } catch (err) {
      setError('Failed to save profile: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfileImage = async (userId: string, imageFile: File): Promise<string | null> => {
    try {
      setError(null);
      const imageUrl = await profileManager.uploadProfileImage(userId, imageFile);
      return imageUrl;
    } catch (err) {
      setError('Failed to upload image: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    }
  };

  const checkProfileCompleteness = async (userId: string): Promise<{
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  }> => {
    try {
      const profile = await profileManager.getUserProfile(userId);
      return await profileManager.validateProfileCompleteness(profile);
    } catch (err) {
      setError('Failed to check profile completeness');
      return {
        isComplete: false,
        missingFields: [],
        completionPercentage: 0,
      };
    }
  };

  return {
    isLoading,
    error,
    validationErrors,
    saveProfile,
    uploadProfileImage,
    checkProfileCompleteness,
    validateProfileData,
  };
}