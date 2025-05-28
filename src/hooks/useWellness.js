import { useCallback, useContext, useEffect, useState } from 'react';
import WellnessContext from '../context/WellnessContext';

/**
 * Custom hook for wellness tips and reminders
 */
export default function useWellness() {
  // Use the context directly
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  
  const { 
    jobTips, 
    weeklyFocus, 
    addJobTip, 
    updateWeeklyFocus, 
    setReminder 
  } = context;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Fetch wellness tips
   */
  const fetchWellnessTips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const tips = await wellnessService.getJobTips();
      // tips.forEach(tip => addJobTip(tip.tip));
      
      // Similarly for weekly focus:
      // const focus = await wellnessService.getWeeklyFocus();
      // updateWeeklyFocus(focus);
    } catch (err) {
      setError(err.message || 'Failed to fetch wellness tips');
      console.error('Error fetching wellness tips:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Add a new wellness tip
   * @param {string} tip - Tip text
   * @returns {Object} - The new tip
   */
  const createTip = useCallback((tip) => {
    try {
      addJobTip(tip);
      
      // In a real app, this would sync with the API
      // await wellnessService.addJobTip(tip);
      
      return {
        id: Date.now(),
        tip
      };
    } catch (err) {
      console.error('Error creating tip:', err);
      throw err;
    }
  }, [addJobTip]);
  
  /**
   * Set a wellness reminder
   * @param {string} type - Reminder type
   * @returns {boolean} - Success indicator
   */
  const createReminder = useCallback((type) => {
    try {
      const success = setReminder(type);
      
      // In a real app, this would sync with the API
      // await wellnessService.setReminder(type);
      
      return success;
    } catch (err) {
      console.error(`Error setting reminder for ${type}:`, err);
      return false;
    }
  }, [setReminder]);
  
  /**
   * Update the weekly focus
   * @param {Object} focus - New focus
   * @returns {Object} - Updated focus
   */
  const setWeeklyFocus = useCallback((focus) => {
    try {
      updateWeeklyFocus(focus);
      
      // In a real app, this would sync with the API
      // await wellnessService.updateWeeklyFocus(focus);
      
      return focus;
    } catch (err) {
      console.error('Error updating weekly focus:', err);
      throw err;
    }
  }, [updateWeeklyFocus]);
  
  /**
   * Get tips by category
   * @param {string} category - Category to filter by
   * @returns {Array} - Filtered tips
   */
  const getTipsByCategory = useCallback((category) => {
    // In this implementation, we're not using categories,
    // but in a real app you might filter tips by category
    return jobTips;
  }, [jobTips]);
  
  /**
   * Get custom tips for user's job role
   * @param {string} jobRole - Job role
   * @returns {Array} - Filtered tips
   */
  const getTipsForJobRole = useCallback((jobRole) => {
    // In this implementation, all tips are for the same job role,
    // but in a real app you might filter tips by job role
    return jobTips;
  }, [jobTips]);

  // Load data on initial mount
  useEffect(() => {
    fetchWellnessTips();
  }, [fetchWellnessTips]);

  return {
    jobTips,
    weeklyFocus,
    loading,
    error,
    fetchWellnessTips,
    createTip,
    createReminder,
    setWeeklyFocus,
    getTipsByCategory,
    getTipsForJobRole
  };
}