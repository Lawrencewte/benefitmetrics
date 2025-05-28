import { hipaaHelpers } from './hipaaHelpers';

export const securityValidators = {
  /**
   * Validates that a purpose string is one of the allowed data access purposes
   */
  isValidPurpose(purpose: string): boolean {
    const validPurposes = [
      'treatment',
      'payment',
      'healthcare_operations',
      'research',
      'public_health',
      'legal_compliance',
      'user_requested',
    ];
    
    return validPurposes.includes(purpose);
  },
  
  /**
   * Validates that a data access operation complies with HIPAA minimum necessary standard
   */
  isMinimumNecessary(
    dataFields: string[], 
    operation: string, 
    purpose: string
  ): boolean {
    // Get the required fields for this operation and purpose
    const requiredFields = hipaaHelpers.getRequiredFields(operation, purpose);
    
    // Check if any fields outside the required set are being accessed
    return dataFields.every(field => requiredFields.includes(field));
  },
  
  /**
   * Validates that a data transmission is properly secured according to policy
   */
  isSecureTransmission(encryptionInfo: {
    method: string;
    keyLength: number;
    protocol?: string;
  }): boolean {
    // Ensure TLS 1.2+ for transmission
    if (encryptionInfo.protocol && !['TLS 1.2', 'TLS 1.3'].includes(encryptionInfo.protocol)) {
      return false;
    }
    
    // Validate encryption method and key length
    switch (encryptionInfo.method) {
      case 'AES':
        return encryptionInfo.keyLength >= 256;
      case 'RSA':
        return encryptionInfo.keyLength >= 2048;
      default:
        return false;
    }
  },
  
  /**
   * Validates that a password meets security requirements
   */
  isSecurePassword(password: string): { 
    valid: boolean; 
    message?: string;
  } {
    // Minimum 8 characters
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    // Require uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Require lowercase letter
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    // Require number
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    
    // Require special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    // Check against common password list (simplified for example)
    const commonPasswords = ['Password123!', 'Admin123!', 'Welcome123!'];
    if (commonPasswords.includes(password)) {
      return { valid: false, message: 'This is a commonly used password' };
    }
    
    return { valid: true };
  },
  
  /**
   * Validates a JWT token structure (not the signature)
   */
  isValidTokenStructure(token: string): boolean {
    try {
      // JWT tokens consist of three parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      
      // Each part should be base64 decodable
      for (const part of parts) {
        atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      }
      
      // Decode the payload to check expiration
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token structure:', error);
      return false;
    }
  },
  
  /**
   * Checks if the provided data contains PHI (Protected Health Information)
   */
  containsPHI(data: any): boolean {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    
    // Define PHI patterns to check for
    const phiPatterns = [
      // Names
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/,
      // SSN
      /\b\d{3}-\d{2}-\d{4}\b/,
      // Medical record numbers
      /\bMRN\s*[:]\s*\d+\b/i,
      // Health plan beneficiary numbers
      /\bHPBN\s*[:]\s*[\w\d]+\b/i,
      // Email addresses
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      // Phone numbers
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
      // Dates directly related to an individual
      /\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])[\/.-](19|20)\d{2}\b/,
    ];
    
    // Convert data to string for pattern matching if it's an object
    const dataString = JSON.stringify(data);
    
    // Check each pattern against the data
    for (const pattern of phiPatterns) {
      if (pattern.test(dataString)) {
        return true;
      }
    }
    
    return false;
  },
};