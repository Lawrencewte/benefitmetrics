import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from '../types/auth';
import { useAuth } from './AuthContext';

interface RoleContextType {
  role: UserRole | null;
  isEmployee: boolean;
  isEmployer: boolean;
  isAdmin: boolean;
  switchRole: (newRole: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(user?.role || null);

  // Update role when user changes
  useEffect(() => {
    if (user) {
      setRole(user.role);
    } else {
      setRole(null);
    }
  }, [user]);

  const isEmployee = role === 'employee';
  const isEmployer = role === 'employer' || role === 'admin';
  const isAdmin = role === 'admin';

  // Role switching is only allowed for admin users who can act as other roles
  const switchRole = (newRole: UserRole) => {
    // Only admin can switch roles
    if (user?.role === 'admin') {
      setRole(newRole);
    }
  };

  // Basic permission checker
  const hasPermission = (permission: string): boolean => {
    if (!role) return false;

    // Define permissions based on roles
    const rolePermissions: Record<UserRole, string[]> = {
      admin: [
        'view_admin_dashboard',
        'manage_users',
        'manage_organizations',
        'view_analytics',
        'manage_programs',
        'manage_communications',
        'manage_benefits',
        'manage_settings',
        'view_employee_dashboard',
        'manage_profile',
        'schedule_appointments',
        'view_benefits',
        'participate_challenges',
        'view_educational_resources',
      ],
      employer: [
        'view_analytics',
        'manage_programs',
        'manage_communications',
        'manage_benefits',
        'view_aggregated_data',
      ],
      employee: [
        'view_employee_dashboard',
        'manage_profile',
        'schedule_appointments',
        'view_benefits',
        'participate_challenges',
        'view_educational_resources',
      ],
    };

    return rolePermissions[role].includes(permission);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        isEmployee,
        isEmployer,
        isAdmin,
        switchRole,
        hasPermission,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  
  return context;
};

export default RoleContext;