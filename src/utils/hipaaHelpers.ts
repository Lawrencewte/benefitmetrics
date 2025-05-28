import { hipaaRequirements } from '../constants/hipaaRequirements';

export const hipaaHelpers = {
  /**
   * Get the fields required for a specific operation and purpose under HIPAA
   */
  getRequiredFields(operation: string, purpose: string): string[] {
    // Retrieve the mapping from constants
    const requirementsByPurpose = hipaaRequirements.minimumNecessary[operation] || {};
    return requirementsByPurpose[purpose] || [];
  },
  
  /**
   * Checks if an action is permitted under HIPAA for the given role
   */
  isPermittedAction(
    action: string, 
    role: string, 
    purpose: string
  ): boolean {
    const rolePermissions = hipaaRequirements.roleBasedAccess[role] || {};
    const permittedPurposes = rolePermissions[action] || [];
    
    return permittedPurposes.includes(purpose) || permittedPurposes.includes('*');
  },
  
  /**
   * Gets required audit log fields for HIPAA compliance
   */
  getRequiredAuditFields(): string[] {
    return [
      'userId',
      'timestamp',
      'action',
      'resourceType',
      'resourceId',
      'status',
    ];
  },
  
  /**
   * Checks if data requires de-identification under HIPAA
   */
  requiresDeIdentification(
    dataType: string, 
    purpose: string
  ): boolean {
    const deIdentificationRequirements = hipaaRequirements.deIdentification;
    const dataTypeRequirements = deIdentificationRequirements[dataType] || [];
    
    return dataTypeRequirements.includes(purpose);
  },
  
  /**
   * Performs HIPAA safe harbor de-identification by removing specified identifiers
   */
  deIdentifyData<T>(data: T): T {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    // List of 18 HIPAA identifiers to remove for de-identification
    const identifiersToRemove = [
      'name',
      'address',
      'dates',
      'phoneNumbers',
      'faxNumbers',
      'emailAddresses',
      'socialSecurityNumber',
      'medicalRecordNumbers',
      'healthPlanBeneficiaryNumbers',
      'accountNumbers',
      'certificateLicenseNumbers',
      'vehicleIdentifiers',
      'deviceIdentifiers',
      'webUrls',
      'ipAddresses',
      'biometricIdentifiers',
      'fullFacePhotos',
      'anyOtherUniqueIdentifier',
    ];
    
    const deIdentifiedData = { ...data };
    
    // Remove each identifier
    for (const identifier of identifiersToRemove) {
      if (identifier in deIdentifiedData) {
        delete deIdentifiedData[identifier as keyof T];
      }
    }
    
    return deIdentifiedData;
  },
  
  /**
   * Generates a HIPAA-compliant BAA (Business Associate Agreement) template
   */
  generateBAATemplate(
    organizationName: string, 
    businessAssociateName: string
  ): string {
    return `
BUSINESS ASSOCIATE AGREEMENT

This Business Associate Agreement (this "Agreement") is entered into between ${organizationName} ("Covered Entity") and ${businessAssociateName} ("Business Associate").

1. DEFINITIONS
   Terms used but not otherwise defined in this Agreement shall have the same meaning as those terms in the HIPAA Rules.

2. OBLIGATIONS AND ACTIVITIES OF BUSINESS ASSOCIATE
   Business Associate agrees to:
   (a) Not use or disclose Protected Health Information other than as permitted or required by this Agreement or as required by law;
   (b) Use appropriate safeguards to prevent use or disclosure of Protected Health Information;
   (c) Report to Covered Entity any use or disclosure of Protected Health Information not provided for by this Agreement;
   (d) Ensure that any subcontractors that create, receive, maintain, or transmit Protected Health Information agree to the same restrictions and conditions;
   (e) Make available Protected Health Information as required to fulfill individual rights under HIPAA;
   (f) Make available the information required to provide an accounting of disclosures;
   (g) Make its internal practices, books, and records available to the Secretary for purposes of determining compliance;
   (h) Return or destroy all Protected Health Information received from, or created or received on behalf of, Covered Entity at the termination of this Agreement.

3. PERMITTED USES AND DISCLOSURES BY BUSINESS ASSOCIATE
   [Specific permitted uses and disclosures would be detailed here]

4. TERM AND TERMINATION
   [Term and termination clauses would be detailed here]

Agreed to and accepted on [DATE]:

${organizationName}
By: ____________________________
Name: __________________________
Title: ___________________________

${businessAssociateName}
By: ____________________________
Name: __________________________
Title: ___________________________
`;
  },
  
  /**
   * Check if a system action requires breach notification under HIPAA
   */
  requiresBreachNotification(
    incident: {
      type: string;
      affectedRecords: number;
      containsPHI: boolean;
      wasEncrypted: boolean;
      riskAssessment?: {
        level: 'low' | 'moderate' | 'high';
        factors: string[];
      };
    }
  ): boolean {
    // If the data doesn't contain PHI, no notification required
    if (!incident.containsPHI) {
      return false;
    }
    
    // If the data was properly encrypted, it may qualify for safe harbor
    if (incident.wasEncrypted) {
      return false;
    }
    
    // If risk assessment indicates low risk, may not require notification
    if (incident.riskAssessment && incident.riskAssessment.level === 'low') {
      return false;
    }
    
    // Otherwise, notification is likely required
    return true;
  },
};