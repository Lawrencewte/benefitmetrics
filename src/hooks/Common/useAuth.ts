import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

/**
 * Hook to access authentication context
 * 
 * @returns The auth context containing user info, token, and auth methods
 * @throws Error if used outside AuthProvider context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;