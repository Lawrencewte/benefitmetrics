import { useContext } from 'react';
import RoleContext from '../../context/RoleContext';

/**
 * Hook to access user role context
 * 
 * @returns The role context containing user role info and related methods
 * @throws Error if used outside RoleProvider context
 */
export const useRole = () => {
  const context = useContext(RoleContext);
  
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  
  return context;
};

export default useRole;