import { useCallback, useEffect, useState } from 'react';
import { useAppointments } from './useAppointments';

/**
 * Custom hook for checkups management
 */
export default function useCheckups() {
  const { checkups, scheduleCheckup, fetchCheckups } = useAppointments();
  const [filteredCheckups, setFilteredCheckups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Filter checkups by status
   * @param {string} status - Status to filter by (optional)
   * @returns {Array} - Filtered checkups
   */
  const filterByStatus = useCallback((status) => {
    if (!status) {
      setFilteredCheckups(checkups);
      return checkups;
    }
    
    const filtered = checkups.filter(checkup => 
      checkup.status.toLowerCase() === status.toLowerCase()
    );
    
    setFilteredCheckups(filtered);
    return filtered;
  }, [checkups]);
  
  /**
   * Get overdue checkups
   * @returns {Array} - Overdue checkups
   */
  const getOverdueCheckups = useCallback(() => {
    return checkups.filter(checkup => checkup.status === 'Overdue');
  }, [checkups]);
  
  /**
   * Get upcoming checkups
   * @returns {Array} - Upcoming checkups (Due Soon or with a future date)
   */
  const getUpcomingCheckups = useCallback(() => {
    return checkups.filter(checkup => 
      checkup.status === 'Due Soon' || 
      (checkup.status !== 'Scheduled' && checkup.status !== 'Overdue')
    );
  }, [checkups]);
  
  /**
   * Get scheduled checkups
   * @returns {Array} - Scheduled checkups
   */
  const getScheduledCheckups = useCallback(() => {
    return checkups.filter(checkup => checkup.status === 'Scheduled');
  }, [checkups]);
  
  /**
   * Get checkup by ID
   * @param {string} checkupId - Checkup ID
   * @returns {Object} - Checkup object
   */
  const getCheckupById = useCallback((checkupId) => {
    return checkups.find(checkup => checkup.id === checkupId);
  }, [checkups]);
  
  /**
   * Get checkup by name
   * @param {string} name - Checkup name
   * @returns {Object} - Checkup object
   */
  const getCheckupByName = useCallback((name) => {
    return checkups.find(
      checkup => checkup.name.toLowerCase() === name.toLowerCase()
    );
  }, [checkups]);
  
  /**
   * Schedule a checkup appointment
   * @param {string} checkupId - Checkup ID
   * @returns {Promise} - Result
   */
  const scheduleCheckupAppointment = useCallback(async (checkupId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await scheduleCheckup(checkupId);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to schedule checkup');
      console.error('Error scheduling checkup:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [scheduleCheckup]);
  
  /**
   * Get checkup statistics
   * @returns {Object} - Statistics about checkups
   */
  const getCheckupStats = useCallback(() => {
    const total = checkups.length;
    const scheduled = checkups.filter(c => c.status === 'Scheduled').length;
    const overdue = checkups.filter(c => c.status === 'Overdue').length;
    const dueSoon = checkups.filter(c => c.status === 'Due Soon').length;
    
    return {
      total,
      scheduled,
      overdue,
      dueSoon,
      completionRate: total > 0 ? Math.round((scheduled / total) * 100) : 0
    };
  }, [checkups]);

  // Load all checkups on mount
  useEffect(() => {
    setFilteredCheckups(checkups);
  }, [checkups]);

  return {
    checkups,
    filteredCheckups,
    loading,
    error,
    filterByStatus,
    getOverdueCheckups,
    getUpcomingCheckups,
    getScheduledCheckups,
    getCheckupById,
    getCheckupByName,
    scheduleCheckupAppointment,
    getCheckupStats,
    refresh: fetchCheckups
  };
}