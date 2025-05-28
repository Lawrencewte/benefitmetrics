import { useContext } from 'react';
import HealthScoreContext from '../../context/employee/HealthScoreContext';

/**
 * Hook to access health score context for tracking and managing health metrics
 * 
 * @returns The health score context containing health score state and methods
 * @throws Error if used outside HealthScoreProvider context
 */
export const useHealthScore = () => {
  const context = useContext(HealthScoreContext);
  
  if (context === undefined) {
    throw new Error('useHealthScore must be used within a HealthScoreProvider');
  }
  
  return context;
};

export default useHealthScore;