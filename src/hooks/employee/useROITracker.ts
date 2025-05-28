import { useContext } from 'react';
import ROIContext from '../../context/employee/ROIContext';

/**
 * Hook to access ROI tracker context for monitoring healthcare savings
 * 
 * @returns The ROI context containing savings data and related methods
 * @throws Error if used outside ROIProvider context
 */
export const useROITracker = () => {
  const context = useContext(ROIContext);
  
  if (context === undefined) {
    throw new Error('useROITracker must be used within a ROIProvider');
  }
  
  return context;
};

export default useROITracker;