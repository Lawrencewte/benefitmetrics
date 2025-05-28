import { useContext } from 'react';
import CareTimelineContext from '../../context/employee/CareTimelineContext';

/**
 * Hook to access care timeline context for preventative care coordination
 * 
 * @returns The care timeline context containing timeline data and methods
 * @throws Error if used outside CareTimelineProvider context
 */
export const useCareTimeline = () => {
  const context = useContext(CareTimelineContext);
  
  if (context === undefined) {
    throw new Error('useCareTimeline must be used within a CareTimelineProvider');
  }
  
  return context;
};

export default useCareTimeline;