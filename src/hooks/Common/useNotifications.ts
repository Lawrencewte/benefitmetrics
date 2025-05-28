// src/hooks/Common/useNotifications.ts
import { useContext } from 'react';
import { NotificationsContext } from '../../context/Common/NotificationsContext';

/**
 * Hook to access notifications context
 * 
 * @returns The notifications context containing notification state and methods
 * @throws Error if used outside NotificationsProvider context
 */
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};

export default useNotifications;