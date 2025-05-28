import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

/**
 * Custom hook for incentives/rewards management
 */
export default function useIncentives() {
  const { userData, updatePoints } = useUser();
  const [incentives, setIncentives] = useState([]);
  const [redeemedIncentives, setRedeemedIncentives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Fetch all available incentives
   */
  const fetchIncentives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const response = await incentivesService.getAllIncentives();
      // setIncentives(response);
      
      // Mock data for development
      setIncentives([
        { id: 1, name: 'Health Insurance Premium Discount', cost: 500, description: '$25 monthly discount on your premiums' },
        { id: 2, name: 'Fitness Membership', cost: 400, description: 'Free 3-month gym membership' },
        { id: 3, name: 'Wellness Day Off', cost: 300, description: 'Extra PTO day for wellness activities' }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to fetch incentives');
      console.error('Error fetching incentives:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch redeemed incentives
   */
  const fetchRedeemedIncentives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const response = await incentivesService.getRedeemedIncentives();
      // setRedeemedIncentives(response);
      
      // Mock data for development
      setRedeemedIncentives([]);
    } catch (err) {
      setError(err.message || 'Failed to fetch redeemed incentives');
      console.error('Error fetching redeemed incentives:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Redeem an incentive
   * @param {string} incentiveId - Incentive ID
   * @returns {Promise} - Result object
   */
  const redeemIncentive = useCallback(async (incentiveId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the incentive
      const incentive = incentives.find(i => i.id === incentiveId);
      if (!incentive) {
        throw new Error(`Incentive with ID ${incentiveId} not found`);
      }
      
      // Check if user has enough points
      if (userData.points < incentive.cost) {
        throw new Error(`Not enough points to redeem ${incentive.name}`);
      }
      
      // In a real app, this would call the API
      // const response = await incentivesService.redeemIncentive(incentiveId);
      
      // Deduct points
      updatePoints(userData.points - incentive.cost);
      
      // Add to redeemed incentives
      const redeemedIncentive = {
        id: Date.now(),
        incentiveId,
        incentiveName: incentive.name,
        cost: incentive.cost,
        redeemedDate: new Date().toISOString()
      };
      
      setRedeemedIncentives(prev => [...prev, redeemedIncentive]);
      
      return {
        success: true,
        incentive,
        redeemedIncentive
      };
    } catch (err) {
      setError(err.message || 'Failed to redeem incentive');
      console.error('Error redeeming incentive:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [incentives, userData.points, updatePoints]);
  
  /**
   * Get incentive by ID
   * @param {string} incentiveId - Incentive ID
   * @returns {Object} - Incentive object
   */
  const getIncentiveById = useCallback((incentiveId) => {
    return incentives.find(incentive => incentive.id === incentiveId);
  }, [incentives]);
  
  /**
   * Get affordable incentives
   * @returns {Array} - Incentives the user can afford
   */
  const getAffordableIncentives = useCallback(() => {
    return incentives.filter(incentive => incentive.cost <= userData.points);
  }, [incentives, userData.points]);
  
  /**
   * Check if user can afford an incentive
   * @param {string} incentiveId - Incentive ID
   * @returns {boolean} - Whether user can afford the incentive
   */
  const canAffordIncentive = useCallback((incentiveId) => {
    const incentive = getIncentiveById(incentiveId);
    return incentive ? userData.points >= incentive.cost : false;
  }, [getIncentiveById, userData.points]);

  // Load data on initial mount
  useEffect(() => {
    fetchIncentives();
    fetchRedeemedIncentives();
  }, [fetchIncentives, fetchRedeemedIncentives]);

  return {
    incentives,
    redeemedIncentives,
    loading,
    error,
    fetchIncentives,
    fetchRedeemedIncentives,
    redeemIncentive,
    getIncentiveById,
    getAffordableIncentives,
    canAffordIncentive
  };
}