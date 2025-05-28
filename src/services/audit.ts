/**
 * Audit Logging Service
 * 
 * Provides HIPAA-compliant audit logging for all PHI access and modifications.
 * Creates tamper-evident logs to meet regulatory requirements.
 */

import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// API and database configurations
import { API_URL } from '../constants/integrationEndpoints';
import { encryptData } from './encryption';

// Constants for audit logging
const AUDIT_LOG_PREFIX = 'audit_log_';
const AUDIT_HASH_CHAIN_KEY = 'audit_hash_chain';
const LOG_RETENTION_DAYS = 7; // Local retention before uploading to server
const MAX_BATCH_SIZE = 50; // Maximum number of logs to send in a batch
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
  PHI_ACCESS: 'PHI_ACCESS',
  AUTH: 'AUTH'
};

/**
 * Represents an audit log entry
 */
interface AuditLogEntry {
  id: string; // Unique log ID
  timestamp: string; // ISO timestamp
  userId: string; // User ID who performed the action
  action: string; // Action performed
  resource: string; // Resource affected
  resourceId?: string; // ID of the resource if applicable
  details?: object; // Additional details about the action
  sourceIp?: string; // IP address of the user
  userAgent?: string; // User agent of the user
  deviceInfo?: object; // Device information
  logLevel: string; // Log level
  previousLogHash?: string; // Hash of the previous log entry for tamper evidence
  containsPHI: boolean; // Whether the log contains PHI
}

/**
 * Get the local audit log directory
 */
const getAuditLogDirectory = async (): Promise<string> => {
  const dir = `${FileSystem.documentDirectory}audit_logs/`;
  
  // Create directory if it doesn't exist
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  
  return dir;
};

/**
 * Get the current hash chain for tamper evidence
 */
const getHashChain = async (): Promise<string> => {
  try {
    const hashChain = await SecureStore.getItemAsync(AUDIT_HASH_CHAIN_KEY);
    return hashChain || '';
  } catch (error) {
    console.error('Failed to retrieve hash chain:', error);
    return '';
  }
};

/**
 * Update the hash chain with a new log entry
 */
const updateHashChain = async (logHash: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(AUDIT_HASH_CHAIN_KEY, logHash);
    return true;
  } catch (error) {
    console.error('Failed to update hash chain:', error);
    return false;
  }
};

/**
 * Get device and network information for the log
 */
const getDeviceInfo = async (): Promise<{ deviceInfo: object, sourceIp?: string, userAgent: string }> => {
  const deviceInfo = {
    brand: Device.brand,
    deviceName: Device.deviceName,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    platform: Platform.OS,
    platformVersion: Platform.Version.toString()
  };
  
  // Get IP address if available
  let sourceIp: string | undefined;
  try {
    const ipAddress = await Network.getIpAddressAsync();
    sourceIp = ipAddress;
  } catch (error) {
    sourceIp = undefined;
  }
  
  // User agent is not directly available in React Native
  // This is a simplified version
  const userAgent = `${Platform.OS}/${Platform.Version} BenefitMetrics/1.0.0`;
  
  return { deviceInfo, sourceIp, userAgent };
};

/**
 * Creates a secure hash of the log entry for tamper evidence
 */
const createLogHash = async (logEntry: Omit<AuditLogEntry, 'previousLogHash' | 'id'>): Promise<string> => {
  const logString = JSON.stringify(logEntry);
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, logString);
};

/**
 * Generates a unique ID for the log entry
 */
const generateLogId = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Records an audit log entry
 */
export const recordAuditLog = async (
  userId: string,
  action: string,
  resource: string,
  options: {
    resourceId?: string,
    details?: object,
    logLevel?: string,
    containsPHI?: boolean
  } = {}
): Promise<boolean> => {
  try {
    // Get device and network info
    const { deviceInfo, sourceIp, userAgent } = await getDeviceInfo();
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Get the previous hash from the chain
    const previousLogHash = await getHashChain();
    
    // Create log entry without the hash and ID
    const logEntryWithoutHash: Omit<AuditLogEntry, 'previousLogHash' | 'id'> = {
      timestamp,
      userId,
      action,
      resource,
      resourceId: options.resourceId,
      details: options.details,
      sourceIp,
      userAgent,
      deviceInfo,
      logLevel: options.logLevel || LOG_LEVELS.INFO,
      containsPHI: options.containsPHI || false
    };
    
    // Create log hash
    const logHash = await createLogHash(logEntryWithoutHash);
    
    // Generate unique log ID
    const logId = await generateLogId();
    
    // Complete log entry
    const logEntry: AuditLogEntry = {
      ...logEntryWithoutHash,
      id: logId,
      previousLogHash
    };
    
    // Update hash chain
    await updateHashChain(logHash);
    
    // Encrypt log if it contains PHI
    let logContent: string;
    if (logEntry.containsPHI) {
      const encryptedLog = await encryptData(logEntry);
      if (!encryptedLog) {
        throw new Error('Failed to encrypt log entry');
      }
      logContent = encryptedLog;
    } else {
      logContent = JSON.stringify(logEntry);
    }
    
    // Write log to file
    const directory = await getAuditLogDirectory();
    const fileName = `${AUDIT_LOG_PREFIX}${timestamp.replace(/[:.]/g, '-')}_${logId}.json`;
    const filePath = `${directory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, logContent);
    
    // If this is a critical log or contains PHI, try to send it to the server immediately
    if (logEntry.logLevel === LOG_LEVELS.CRITICAL || logEntry.logLevel === LOG_LEVELS.PHI_ACCESS) {
      await sendLogsToServer([logEntry]);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to record audit log:', error);
    
    // Even if we fail, try to log the error itself
    try {
      const directory = await getAuditLogDirectory();
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: 'Failed to record audit log',
        originalAction: action,
        errorMessage: error instanceof Error ? error.message : String(error)
      };
      const errorFileName = `${AUDIT_LOG_PREFIX}error_${Date.now()}.json`;
      const errorFilePath = `${directory}${errorFileName}`;
      
      await FileSystem.writeAsStringAsync(errorFilePath, JSON.stringify(errorLog));
    } catch (writeError) {
      console.error('Failed to write error log:', writeError);
    }
    
    return false;
  }
};

/**
 * Send logs to the server for permanent storage
 */
export const sendLogsToServer = async (logs?: AuditLogEntry[]): Promise<boolean> => {
  try {
    let logsToSend: AuditLogEntry[];
    
    // If logs are provided, use those; otherwise, read from files
    if (logs) {
      logsToSend = logs;
    } else {
      // Read logs from file system
      const directory = await getAuditLogDirectory();
      const logFiles = await FileSystem.readDirectoryAsync(directory);
      
      // Filter only audit log files
      const auditLogFiles = logFiles.filter(file => file.startsWith(AUDIT_LOG_PREFIX));
      
      // Read log content
      logsToSend = [];
      for (const logFile of auditLogFiles.slice(0, MAX_BATCH_SIZE)) {
        const filePath = `${directory}${logFile}`;
        const content = await FileSystem.readAsStringAsync(filePath);
        
        // Parse log content
        try {
          const log = JSON.parse(content);
          logsToSend.push(log);
        } catch (parseError) {
          // If the log is encrypted, we'll need to send the encrypted content
          logsToSend.push({
            id: logFile.replace(AUDIT_LOG_PREFIX, '').replace('.json', ''),
            encrypted: true,
            content
          } as any);
        }
      }
    }
    
    if (logsToSend.length === 0) {
      return true; // No logs to send
    }
    
    // Send logs to server
    const response = await fetch(`${API_URL}/audit-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await SecureStore.getItemAsync('auth_token')
      },
      body: JSON.stringify({
        logs: logsToSend,
        deviceId: await Device.getDeviceIdAsync(),
        appVersion: '1.0.0' // Replace with actual app version
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    // If successful, delete the log files that were sent
    if (!logs) {
      const directory = await getAuditLogDirectory();
      for (let i = 0; i < Math.min(auditLogFiles.length, MAX_BATCH_SIZE); i++) {
        const filePath = `${directory}${auditLogFiles[i]}`;
        await FileSystem.deleteAsync(filePath);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send logs to server:', error);
    return false;
  }
};

/**
 * Clean up old logs (called periodically)
 */
export const cleanupOldLogs = async (): Promise<void> => {
  try {
    // Try to send logs to server first
    await sendLogsToServer();
    
    // Delete logs older than retention period
    const directory = await getAuditLogDirectory();
    const logFiles = await FileSystem.readDirectoryAsync(directory);
    const now = new Date();
    
    for (const logFile of logFiles) {
      if (!logFile.startsWith(AUDIT_LOG_PREFIX)) continue;
      
      const filePath = `${directory}${logFile}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists && fileInfo.modificationTime) {
        const fileDate = new Date(fileInfo.modificationTime * 1000);
        const daysDiff = (now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > LOG_RETENTION_DAYS) {
          await FileSystem.deleteAsync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean up old logs:', error);
  }
};

/**
 * Record PHI access audit log
 */
export const recordPHIAccess = async (
  userId: string,
  resource: string,
  resourceId: string,
  action: 'view' | 'update' | 'create' | 'delete',
  details?: object
): Promise<boolean> => {
  return await recordAuditLog(userId, `PHI_${action.toUpperCase()}`, resource, {
    resourceId,
    details,
    logLevel: LOG_LEVELS.PHI_ACCESS,
    containsPHI: true
  });
};

/**
 * Record authentication audit log
 */
export const recordAuthEvent = async (
  userId: string,
  action: 'login' | 'logout' | 'failed_login' | 'password_change' | 'mfa',
  details?: object
): Promise<boolean> => {
  return await recordAuditLog(userId, `AUTH_${action.toUpperCase()}`, 'authentication', {
    details,
    logLevel: LOG_LEVELS.AUTH,
    containsPHI: false
  });
};

/**
 * Verify the audit log chain
 * Returns true if the chain is valid, false if tampering is detected
 */
export const verifyAuditLogChain = async (): Promise<boolean> => {
  try {
    const directory = await getAuditLogDirectory();
    const logFiles = await FileSystem.readDirectoryAsync(directory);
    
    // Sort log files by timestamp
    const auditLogFiles = logFiles
      .filter(file => file.startsWith(AUDIT_LOG_PREFIX))
      .sort();
    
    if (auditLogFiles.length === 0) {
      return true; // No logs to verify
    }
    
    let previousHash = '';
    
    for (const logFile of auditLogFiles) {
      const filePath = `${directory}${logFile}`;
      const content = await FileSystem.readAsStringAsync(filePath);
      
      try {
        // Parse log content
        const log = JSON.parse(content);
        
        // Verify hash chain
        if (log.previousLogHash !== previousHash) {
          console.error(`Audit log chain broken at ${logFile}`);
          return false;
        }
        
        // Calculate log hash
        const { id, previousLogHash, ...logWithoutHash } = log;
        const calculatedHash = await createLogHash(logWithoutHash);
        
        // Update previous hash for next iteration
        previousHash = calculatedHash;
      } catch (parseError) {
        // If the log is encrypted, we can't verify it locally
        // We'll need to implement remote verification for encrypted logs
        console.warn(`Skipping encrypted log: ${logFile}`);
      }
    }
    
    // Verify the final hash matches the stored chain
    const storedHashChain = await getHashChain();
    if (previousHash !== storedHashChain) {
      console.error('Audit log chain doesnt match stored hash chain');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to verify audit log chain:', error);
    return false;
  }
};

/**
 * Initialize audit logging system
 */
export const initAuditLogging = async (): Promise<boolean> => {
  try {
    // Ensure directory exists
    await getAuditLogDirectory();
    
    // Verify audit log chain
    const isChainValid = await verifyAuditLogChain();
    if (!isChainValid) {
      console.error('Audit log chain validation failed');
      
      // Record security incident
      await recordAuditLog('system', 'SECURITY_INCIDENT', 'audit_logs', {
        details: { message: 'Audit log chain validation failed' },
        logLevel: LOG_LEVELS.CRITICAL,
        containsPHI: false
      });
    }
    
    // Clean up old logs
    await cleanupOldLogs();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize audit logging:', error);
    return false;
  }
};

// Export log levels for external use
export { LOG_LEVELS };
