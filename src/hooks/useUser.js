import { useCallback, useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import authService from '../services/auth';

/**
 * Custom hook for user data management
 */
export default function useUser() {
  // Use the context directly
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  const { userData, updatePoints, updateNotifications, clearNotificationAlert, updateUserName } = context;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Fetch user profile
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const profile = await authService.getUserProfile();
      // Update user data in context
      // updateUserName(profile.name);
      // updatePoints(profile.points);
      // updateNotifications(profile.notifications);
    } catch (err) {
      setError(err.message || 'Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Updated profile
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const updatedProfile = await authService.updateUserProfile(profileData);
      
      // Update relevant context values
      if (profileData.name) {
        updateUserName(profileData.name);
      }
      
      // Return mock updated profile
      return {
        ...userData,
        ...profileData
      };
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userData, updateUserName]);
  
  /**
   * Update user points
   * @param {number} newPoints - New points value
   */
  const setUserPoints = useCallback((newPoints) => {
    try {
      updatePoints(newPoints);
      
      // In a real app, this would sync with the API
      // await pointsService.updatePoints(newPoints);
    } catch (err) {
      console.error('Error updating points:', err);
    }
  }, [updatePoints]);
  
  /**
   * Add points to user's balance
   * @param {number} amount - Amount to add
   * @param {string} reason - Reason for adding points
   */
  const addPoints = useCallback((amount, reason) => {
    try {
      const newPoints = userData.points + amount;
      updatePoints(newPoints);
      
      // In a real app, this would sync with the API
      // await pointsService.addPoints(amount, reason);
    } catch (err) {
      console.error('Error adding points:', err);
    }
  }, [userData.points, updatePoints]);
  
  /**
   * Set user notification count
   * @param {number} count - Number of notifications
   */
  const setNotificationCount = useCallback((count) => {
    try {
      updateNotifications(count);
    } catch (err) {
      console.error('Error updating notification count:', err);
    }
  }, [updateNotifications]);
  
  /**
   * Clear notification indicator
   */
  const dismissNotificationAlert = useCallback(() => {
    try {
      clearNotificationAlert();
    } catch (err) {
      console.error('Error clearing notification alert:', err);
    }
  }, [clearNotificationAlert]);
  
  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} - Authentication status
   */
  const isAuthenticated = useCallback(async () => {
    try {
      return await authService.isAuthenticated();
    } catch (err) {
      console.error('Error checking authentication:', err);
      return false;
    }
  }, []);
  
  /**
   * Log out user
   * @returns {Promise} - Logout result
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      return await authService.logout();
    } catch (err) {
      setError(err.message || 'Failed to log out');
      console.error('Error logging out:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user data on initial mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    userData,
    loading,
    error,
    fetchUserProfile,
    updateProfile,
    setUserPoints,
    addPoints,
    setNotificationCount,
    dismissNotificationAlert,
    isAuthenticated,
    logout
  };
}