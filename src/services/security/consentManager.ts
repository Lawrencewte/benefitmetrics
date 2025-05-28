import { api } from '../api';
import { auditLogService } from './auditLogService';

interface ConsentRecord {
  id: string;
  userId: string;
  consentType: string;
  consentVersion: string;
  status: 'granted' | 'denied' | 'expired' | 'withdrawn';
  grantedAt?: string;
  expiresAt?: string;
  withdrawnAt?: string;
  dataCategories: string[];
  purposes: string[];
}

export const consentManager = {
  async getConsentStatus(userId: string, consentType: string): Promise<ConsentRecord | null> {
    try {
      const response = await api.get(`/consent/${userId}/${consentType}`);
      
      // Log the access to consent records for audit purposes
      await auditLogService.logAction({
        action: 'consent_status_check',
        userId,
        resourceType: 'consent',
        resourceId: consentType,
        details: { consentType },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error getting consent status for user ${userId} and type ${consentType}:`, error);
      return null;
    }
  },
  
  async grantConsent(
    userId: string, 
    consentType: string, 
    dataCategories: string[], 
    purposes: string[],
    expiresAt?: string
  ): Promise<ConsentRecord> {
    try {
      const response = await api.post('/consent', {
        userId,
        consentType,
        dataCategories,
        purposes,
        expiresAt,
      });
      
      // Log the consent granting for audit purposes
      await auditLogService.logAction({
        action: 'consent_granted',
        userId,
        resourceType: 'consent',
        resourceId: consentType,
        details: { consentType, dataCategories, purposes, expiresAt },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error granting consent for user ${userId} and type ${consentType}:`, error);
      throw error;
    }
  },
  
  async withdrawConsent(userId: string, consentType: string): Promise<void> {
    try {
      await api.post(`/consent/${userId}/${consentType}/withdraw`);
      
      // Log the consent withdrawal for audit purposes
      await auditLogService.logAction({
        action: 'consent_withdrawn',
        userId,
        resourceType: 'consent',
        resourceId: consentType,
        details: { consentType },
      });
    } catch (error) {
      console.error(`Error withdrawing consent for user ${userId} and type ${consentType}:`, error);
      throw error;
    }
  },
  
  async getUserConsents(userId: string): Promise<ConsentRecord[]> {
    try {
      const response = await api.get(`/consent/${userId}`);
      
      // Log the access to all consent records for audit purposes
      await auditLogService.logAction({
        action: 'consent_records_access',
        userId,
        resourceType: 'consent',
        resourceId: userId,
        details: { accessType: 'all_consents' },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error getting consents for user ${userId}:`, error);
      throw error;
    }
  },
  
  async updateConsentPreferences(
    userId: string, 
    consentType: string, 
    dataCategories: string[], 
    purposes: string[]
  ): Promise<ConsentRecord> {
    try {
      // First withdraw existing consent
      await this.withdrawConsent(userId, consentType);
      
      // Then grant new consent with updated preferences
      return await this.grantConsent(userId, consentType, dataCategories, purposes);
    } catch (error) {
      console.error(`Error updating consent preferences for user ${userId} and type ${consentType}:`, error);
      throw error;
    }
  },
  
  async checkConsentRequirement(
    operation: string, 
    dataCategories: string[]
  ): Promise<{ requiresConsent: boolean; requiredConsentTypes: string[] }> {
    try {
      const response = await api.post('/consent/check-requirement', {
        operation,
        dataCategories,
      });
      return response.data;
    } catch (error) {
      console.error(`Error checking consent requirement for operation ${operation}:`, error);
      throw error;
    }
  },
  
  async getConsentForm(consentType: string, language = 'en'): Promise<string> {
    try {
      const response = await api.get(`/consent/forms/${consentType}?language=${language}`);
      return response.data.formContent;
    } catch (error) {
      console.error(`Error getting consent form for type ${consentType}:`, error);
      throw error;
    }
  },
};