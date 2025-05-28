import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuditService from '../services/security/auditLogService';
import * as ConsentService from '../services/security/consentManager';
import * as SecurityService from '../services/security/encryptionService';
import { useAuth } from './AuthContext';

export interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  editable: boolean;
  impactLevel?: 'low' | 'medium' | 'high';
}

export interface ConsentRecord {
  id: string;
  title: string;
  description: string;
  consented: boolean;
  required: boolean;
  timestamp: Date;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: Date;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  details?: string;
}

interface SecurityContextType {
  securitySettings: SecuritySetting[];
  securityLevel: 'high' | 'medium' | 'low' | 'risk';
  consentRecords: ConsentRecord[];
  auditLogs: AuditLogEntry[];
  isLoading: boolean;
  error: string | null;
  
  updateSecuritySetting: (id: string, enabled: boolean) => Promise<void>;
  recordConsent: (id: string, consented: boolean) => Promise<void>;
  fetchAuditLogs: (page?: number, limit?: number) => Promise<void>;
  checkSecurityLevel: () => Promise<void>;
  exportData: (dataTypes: string[]) => Promise<string>;
  deleteData: (dataTypes: string[]) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Storage keys
const STORAGE_SECURITY_SETTINGS_KEY = '@BenefitMetrics:security_settings';

// Default security settings
const defaultSecuritySettings: SecuritySetting[] = [
  {
    id: 'biometric',
    title: 'Biometric Authentication',
    description: 'Use Face ID or fingerprint to securely access the app',
    enabled: false,
    editable: true,
    impactLevel: 'high',
  },
  {
    id: 'session_timeout',
    title: 'Automatic Session Timeout',
    description: 'Automatically log out after 15 minutes of inactivity',
    enabled: true,
    editable: true,
    impactLevel: 'medium',
  },
  {
    id: 'third_party_sharing',
    title: 'Third-Party Data Sharing',
    description: 'Allow sharing anonymized data with third parties for service improvement',
    enabled: false,
    editable: true,
    impactLevel: 'high',
  },
  {
    id: 'analytics',
    title: 'Usage Analytics',
    description: 'Help improve the app by sending anonymous usage data',
    enabled: true,
    editable: true,
    impactLevel: 'low',
  },
  {
    id: 'data_encryption',
    title: 'Data Encryption',
    description: 'Encrypt all sensitive health data on your device',
    enabled: true,
    editable: false,
    impactLevel: 'high',
  },
  {
    id: 'location_tracking',
    title: 'Location Services',
    description: 'Enable location-based services for nearby providers',
    enabled: false,
    editable: true,
    impactLevel: 'medium',
  },
];

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(defaultSecuritySettings);
  const [securityLevel, setSecurityLevel] = useState<'high' | 'medium' | 'low' | 'risk'>('medium');
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load security settings on init
  useEffect(() => {
    const loadSecuritySettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        if (token) {
          // Get from server first
          const serverSettings = await SecurityService.getSecuritySettings(token);
          if (serverSettings.success) {
            setSecuritySettings(serverSettings.settings);
          } else {
            // Fall back to local storage
            const storedSettings = await AsyncStorage.getItem(STORAGE_SECURITY_SETTINGS_KEY);
            if (storedSettings) {
              setSecuritySettings(JSON.parse(storedSettings));
            }
          }
        } else {
          // No token, try local storage
          const storedSettings = await AsyncStorage.getItem(STORAGE_SECURITY_SETTINGS_KEY);
          if (storedSettings) {
            setSecuritySettings(JSON.parse(storedSettings));
          }
        }
        
        // Calculate security level after loading settings
        await checkSecurityLevel();
      } catch (error) {
        setError('Failed to load security settings');
        console.error('Failed to load security settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSecuritySettings();
  }, [user, token]);

  // Load consent records if user is logged in
  useEffect(() => {
    const loadConsentRecords = async () => {
      if (!user || !token) return;
      
      try {
        const response = await ConsentService.getConsentRecords(token);
        if (response.success) {
          setConsentRecords(response.consents);
        }
      } catch (error) {
        console.error('Failed to load consent records:', error);
      }
    };

    loadConsentRecords();
  }, [user, token]);

  // Check and calculate security level based on enabled security settings
  const checkSecurityLevel = async () => {
    try {
      let level: 'high' | 'medium' | 'low' | 'risk' = 'high';
      
      // Count high-impact settings that are disabled
      const highImpactSettings = securitySettings.filter(s => s.impactLevel === 'high');
      const disabledHighImpact = highImpactSettings.filter(s => !s.enabled);
      
      // Count medium-impact settings that are disabled
      const mediumImpactSettings = securitySettings.filter(s => s.impactLevel === 'medium');
      const disabledMediumImpact = mediumImpactSettings.filter(s => !s.enabled);
      
      if (disabledHighImpact.length > 0) {
        // Any high-impact setting disabled downgrades from high
        if (disabledHighImpact.length > 1) {
          level = 'risk'; // Multiple high-impact settings disabled is a risk
        } else {
          level = 'medium'; // One high-impact setting disabled is medium
        }
      } else if (disabledMediumImpact.length > 1) {
        // Multiple medium-impact settings disabled downgrades to low
        level = 'low';
      }
      
      // Save to server if available
      if (token) {
        await SecurityService.updateSecurityLevel(token, level);
      }
      
      setSecurityLevel(level);
    } catch (error) {
      console.error('Failed to check security level:', error);
    }
  };

  // Update a security setting
  const updateSecuritySetting = async (id: string, enabled: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the setting to update
      const settingIndex = securitySettings.findIndex(s => s.id === id);
      if (settingIndex === -1) {
        throw new Error('Security setting not found');
      }
      
      // Check if setting is editable
      if (!securitySettings[settingIndex].editable) {
        throw new Error('Security setting is not editable');
      }
      
      // Create new settings array with updated setting
      const newSettings = [...securitySettings];
      newSettings[settingIndex] = {
        ...newSettings[settingIndex],
        enabled,
      };
      
      setSecuritySettings(newSettings);
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_SECURITY_SETTINGS_KEY, JSON.stringify(newSettings));
      
      // Save to server if available
      if (token) {
        await SecurityService.updateSecuritySetting(token, id, enabled);
        
        // Log the action
        await AuditService.logSecurityAction(
          token,
          'update_security_setting',
          'security_setting',
          id,
          `Updated ${newSettings[settingIndex].title} to ${enabled ? 'enabled' : 'disabled'}`
        );
      }
      
      // Recalculate security level
      await checkSecurityLevel();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update security setting');
      console.error('Failed to update security setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Record user consent
  const recordConsent = async (id: string, consented: boolean) => {
    if (!user || !token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Record consent on server
      const response = await ConsentService.recordConsent(token, id, consented);
      
      if (response.success) {
        // Find if consent already exists in local state
        const consentIndex = consentRecords.findIndex(c => c.id === id);
        
        if (consentIndex !== -1) {
          // Update existing consent
          const newConsents = [...consentRecords];
          newConsents[consentIndex] = {
            ...newConsents[consentIndex],
            consented,
            timestamp: new Date(),
          };
          
          setConsentRecords(newConsents);
        } else {
          // Add new consent if returned from server
          if (response.consent) {
            setConsentRecords([...consentRecords, response.consent]);
          }
        }
        
        // Log the action
        await AuditService.logSecurityAction(
          token,
          'record_consent',
          'consent',
          id,
          `Consent ${consented ? 'given' : 'withdrawn'} for ${id}`
        );
      } else {
        throw new Error(response.message || 'Failed to record consent');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to record consent');
      console.error('Failed to record consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async (page = 1, limit = 20) => {
    if (!user || !token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuditService.getAuditLogs(token, page, limit);
      
      if (response.success) {
        setAuditLogs(response.logs);
      } else {
        throw new Error(response.message || 'Failed to fetch audit logs');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch audit logs');
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export user data
  const exportData = async (dataTypes: string[]): Promise<string> => {
    if (!user || !token) {
      throw new Error('User not authenticated');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await SecurityService.exportUserData(token, dataTypes);
      
      if (response.success) {
        // Log the action
        await AuditService.logSecurityAction(
          token,
          'export_data',
          'user_data',
          user.id,
          `Exported data: ${dataTypes.join(', ')}`
        );
        
        return response.exportUrl || '';
      } else {
        throw new Error(response.message || 'Failed to export data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to export data');
      console.error('Failed to export data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user data
  const deleteData = async (dataTypes: string[]): Promise<void> => {
    if (!user || !token) {
      throw new Error('User not authenticated');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await SecurityService.deleteUserData(token, dataTypes);
      
      if (response.success) {
        // Log the action
        await AuditService.logSecurityAction(
          token,
          'delete_data',
          'user_data',
          user.id,
          `Deleted data: ${dataTypes.join(', ')}`
        );
      } else {
        throw new Error(response.message || 'Failed to delete data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete data');
      console.error('Failed to delete data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        securitySettings,
        securityLevel,
        consentRecords,
        auditLogs,
        isLoading,
        error,
        updateSecuritySetting,
        recordConsent,
        fetchAuditLogs,
        checkSecurityLevel,
        exportData,
        deleteData,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  
  return context;
};

export default SecurityContext;