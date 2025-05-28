/**
 * Services for incentives/rewards management
 */
import api from './api';

const ENDPOINTS = {
  INCENTIVES: '/incentives',
  REDEEMED: '/incentives/redeemed',
};

/**
 * Get all available incentives
 * @returns {Promise} - List of incentives
 */
export const getAllIncentives = async () => {
  try {
    return await api.get(ENDPOINTS.INCENTIVES);
  } catch (error) {
    console.error('Failed to fetch incentives:', error);
    throw error;
  }
};

/**
 * Get specific incentive details
 * @param {string} incentiveId - Incentive ID
 * @returns {Promise} - Incentive details
 */
export const getIncentiveById = async (incentiveId) => {
  try {
    return await api.get(`${ENDPOINTS.INCENTIVES}/${incentiveId}`);
  } catch (error) {
    console.error(`Failed to fetch incentive ${incentiveId}:`, error);
    throw error;
  }
};

/**
 * Redeem an incentive
 * @param {string} incentiveId - Incentive ID
 * @returns {Promise} - Redemption result
 */
export const redeemIncentive = async (incentiveId) => {
  try {
    return await api.post(`${ENDPOINTS.INCENTIVES}/${incentiveId}/redeem`);
  } catch (error) {
    console.error(`Failed to redeem incentive ${incentiveId}:`, error);
    throw error;
  }
};

/**
 * Get all redeemed incentives
 * @returns {Promise} - List of redeemed incentives
 */
export const getRedeemedIncentives = async () => {
  try {
    return await api.get(ENDPOINTS.REDEEMED);
  } catch (error) {
    console.error('Failed to fetch redeemed incentives:', error);
    throw error;
  }
};

/**
 * Get details of a specific redeemed incentive
 * @param {string} redemptionId - Redemption ID
 * @returns {Promise} - Redeemed incentive details
 */
export const getRedeemedIncentiveById = async (redemptionId) => {
  try {
    return await api.get(`${ENDPOINTS.REDEEMED}/${redemptionId}`);
  } catch (error) {
    console.error(`Failed to fetch redeemed incentive ${redemptionId}:`, error);
    throw error;
  }
};

/**
 * Get available incentives based on user points
 * @param {number} points - User's points
 * @returns {Promise} - List of available incentives
 */
export const getAvailableIncentives = async (points) => {
  try {
    return await api.get(`${ENDPOINTS.INCENTIVES}/available`, { points });
  } catch (error) {
    console.error('Failed to fetch available incentives:', error);
    throw error;
  }
};

/**
 * Get featured incentives (special promotions)
 * @returns {Promise} - List of featured incentives
 */
export const getFeaturedIncentives = async () => {
  try {
    return await api.get(`${ENDPOINTS.INCENTIVES}/featured`);
  } catch (error) {
    console.error('Failed to fetch featured incentives:', error);
    throw error;
  }
};

/**
 * Download redemption certificate
 * @param {string} redemptionId - Redemption ID
 * @returns {Promise} - Certificate data
 */
export const downloadRedemptionCertificate = async (redemptionId) => {
  try {
    return await api.get(`${ENDPOINTS.REDEEMED}/${redemptionId}/certificate`);
  } catch (error) {
    console.error(`Failed to download certificate for ${redemptionId}:`, error);
    throw error;
  }
};

// Export all functions
const incentivesService = {
  getAllIncentives,
  getIncentiveById,
  redeemIncentive,
  getRedeemedIncentives,
  getRedeemedIncentiveById,
  getAvailableIncentives,
  getFeaturedIncentives,
  downloadRedemptionCertificate
};

export default incentivesService;