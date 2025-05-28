import { useContext } from 'react';
import AppointmentContext from '../../context/employee/AppointmentContext';

/**
 * Hook to access appointment context for managing medical appointments
 * 
 * @returns The appointment context containing appointment state and methods
 * @throws Error if used outside AppointmentProvider context
 */
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  
  return context;
};

export default useAppointments;