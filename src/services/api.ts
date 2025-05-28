import { Platform } from 'react-native';

// API Configuration
const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? Platform.OS === 'ios' 
      ? 'http://localhost:3000/api' 
      : 'http://10.0.2.2:3000/api'
    : 'https://api.BenefitMetrics.com/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Enhanced security headers for healthcare data
const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'Pragma': 'no-cache'
};

// Request/Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retryAttempts?: number;
  requireAuth?: boolean;
  includeAuditHeaders?: boolean;
  encryptPayload?: boolean;
  anonymizationLevel?: 'full' | 'partial' | 'minimal';
}

interface RetryConfig {
  attempts: number;
  delay: number;
  backoff: boolean;
  retryOn: number[];
}

// Auth token management
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private async loadTokensFromStorage() {
    try {
      // In React Native, use AsyncStorage; in web, use localStorage
      if (typeof window !== 'undefined') {
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
        const expiry = localStorage.getItem('tokenExpiry');
        this.tokenExpiry = expiry ? new Date(expiry) : null;
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
    }
  }

  private async saveTokensToStorage() {
    try {
      if (typeof window !== 'undefined') {
        if (this.accessToken) localStorage.setItem('accessToken', this.accessToken);
        if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken);
        if (this.tokenExpiry) localStorage.setItem('tokenExpiry', this.tokenExpiry.toISOString());
      }
    } catch (error) {
      console.error('Failed to save tokens to storage:', error);
    }
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
    this.saveTokensToStorage();
  }

  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      return null;
    }
    return this.accessToken;
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
  }

  async refreshAccessToken(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken, data.expiresIn);
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
    }
  }
}

// Encryption utilities for sensitive data
class EncryptionService {
  private static instance: EncryptionService;
  private encryptionKey: string | null = null;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async initializeEncryption() {
    // In a real implementation, this would use Web Crypto API or similar
    // For now, we'll use a placeholder implementation
    this.encryptionKey = 'placeholder-encryption-key';
  }

  async encryptData(data: any): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryption();
    }
    
    // Placeholder encryption - in reality, use proper crypto libraries
    const jsonString = JSON.stringify(data);
    const encoded = btoa(jsonString); // Base64 encoding as placeholder
    return encoded;
  }

  async decryptData(encryptedData: string): Promise<any> {
    try {
      // Placeholder decryption
      const decoded = atob(encryptedData);
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }
}

// Audit logging for API calls
class AuditLogger {
  static async logApiCall(
    endpoint: string,
    method: string,
    userId?: string,
    success: boolean = true,
    details?: any
  ) {
    try {
      // In a real implementation, this would send to audit service
      const auditEntry = {
        timestamp: new Date().toISOString(),
        endpoint,
        method,
        userId: userId || 'anonymous',
        success,
        details: details ? JSON.stringify(details) : undefined,
        userAgent: navigator.userAgent,
        ipAddress: 'client-ip' // Would be detected server-side
      };

      // For now, just log to console in development
      if (__DEV__) {
        console.log('API Audit:', auditEntry);
      }

      // Send to audit endpoint (implement as needed)
      // await fetch(`${API_CONFIG.BASE_URL}/audit/log`, {
      //   method: 'POST',
      //   headers: SECURITY_HEADERS,
      //   body: JSON.stringify(auditEntry)
      // });
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  }
}

// Main API client class
class ApiClient {
  private tokenManager: TokenManager;
  private encryptionService: EncryptionService;
  private defaultRetryConfig: RetryConfig = {
    attempts: API_CONFIG.RETRY_ATTEMPTS,
    delay: API_CONFIG.RETRY_DELAY,
    backoff: true,
    retryOn: [408, 429, 500, 502, 503, 504]
  };

  constructor() {
    this.tokenManager = new TokenManager();
    this.encryptionService = EncryptionService.getInstance();
  }

  private async prepareHeaders(config: ApiRequestConfig): Promise<Record<string, string>> {
    const headers = { ...SECURITY_HEADERS, ...config.headers };

    // Add authentication if required
    if (config.requireAuth !== false) {
      let token = this.tokenManager.getAccessToken();
      
      if (!token && this.tokenManager.isTokenExpired()) {
        try {
          await this.tokenManager.refreshAccessToken();
          token = this.tokenManager.getAccessToken();
        } catch (error) {
          throw new Error('Authentication failed');
        }
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add audit headers
    if (config.includeAuditHeaders) {
      headers['X-Request-ID'] = this.generateRequestId();
      headers['X-Timestamp'] = new Date().toISOString();
      headers['X-User-Agent'] = navigator.userAgent;
    }

    // Add anonymization level for employee data
    if (config.anonymizationLevel) {
      headers['X-Anonymization-Level'] = config.anonymizationLevel;
    }

    return headers;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async prepareBody(body: any, config: ApiRequestConfig): Promise<string | undefined> {
    if (!body) return undefined;

    if (config.encryptPayload) {
      const encryptedData = await this.encryptionService.encryptData(body);
      return JSON.stringify({ encrypted: true, data: encryptedData });
    }

    return JSON.stringify(body);
  }

  private async executeRequest(
    url: string,
    config: ApiRequestConfig,
    retryConfig: RetryConfig = this.defaultRetryConfig
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || API_CONFIG.TIMEOUT);

    try {
      const headers = await this.prepareHeaders(config);
      const body = await this.prepareBody(config.body, config);

      const response = await fetch(url, {
        method: config.method || 'GET',
        headers,
        body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle rate limiting with exponential backoff
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryConfig.delay;
        
        if (retryConfig.attempts > 0) {
          await this.delay(delay);
          return this.executeRequest(url, config, {
            ...retryConfig,
            attempts: retryConfig.attempts - 1,
            delay: retryConfig.backoff ? delay * 2 : delay
          });
        }
      }

      // Retry on specific error codes
      if (retryConfig.retryOn.includes(response.status) && retryConfig.attempts > 0) {
        await this.delay(retryConfig.delay);
        return this.executeRequest(url, config, {
          ...retryConfig,
          attempts: retryConfig.attempts - 1,
          delay: retryConfig.backoff ? retryConfig.delay * 2 : retryConfig.delay
        });
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry on network errors
      if (retryConfig.attempts > 0 && this.isRetryableError(error)) {
        await this.delay(retryConfig.delay);
        return this.executeRequest(url, config, {
          ...retryConfig,
          attempts: retryConfig.attempts - 1,
          delay: retryConfig.backoff ? retryConfig.delay * 2 : retryConfig.delay
        });
      }
      
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      error.message?.includes('fetch')
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async processResponse<T>(response: Response, config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
        
        // Handle encrypted responses
        if (data.encrypted && config.encryptPayload) {
          data = await this.encryptionService.decryptData(data.data);
        }
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: response.status.toString(),
            message: data.message || response.statusText,
            details: data.details
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: response.headers.get('X-Request-ID') || 'unknown',
            version: response.headers.get('X-API-Version') || '1.0'
          }
        };
      }

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('X-Request-ID') || 'unknown',
          version: response.headers.get('X-API-Version') || '1.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse response',
          details: error
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: 'unknown',
          version: '1.0'
        }
      };
    }
  }

  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const startTime = Date.now();

    try {
      const response = await this.executeRequest(url, {
        includeAuditHeaders: true,
        ...config
      });

      const result = await this.processResponse<T>(response, config);
      
      // Log successful API call
      await AuditLogger.logApiCall(
        endpoint,
        config.method || 'GET',
        undefined, // User ID would be extracted from token
        result.success,
        {
          duration: Date.now() - startTime,
          statusCode: response.status
        }
      );

      return result;
    } catch (error) {
      // Log failed API call
      await AuditLogger.logApiCall(
        endpoint,
        config.method || 'GET',
        undefined,
        false,
        {
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      );

      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: error instanceof Error ? error.message : 'Request failed',
          details: error
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: 'unknown',
          version: '1.0'
        }
      };
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config: Omit<ApiRequestConfig, 'method'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config: Omit<ApiRequestConfig, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config: Omit<ApiRequestConfig, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T = any>(endpoint: string, body?: any, config: Omit<ApiRequestConfig, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T = any>(endpoint: string, config: Omit<ApiRequestConfig, 'method'> = {}) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // File upload with progress tracking
  async uploadFile(
    endpoint: string,
    file: File | Blob,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              onProgress(progress);
            }
          });
        }

        xhr.addEventListener('load', () => {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: xhr.status >= 200 && xhr.status < 300,
              data: response,
              metadata: {
                timestamp: new Date().toISOString(),
                requestId: xhr.getResponseHeader('X-Request-ID') || 'unknown',
                version: '1.0'
              }
            });
          } catch (error) {
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        const token = this.tokenManager.getAccessToken();
        xhr.open('POST', `${API_CONFIG.BASE_URL}${endpoint}`);
        
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.send(formData);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', { requireAuth: false, timeout: 5000 });
      return response.success;
    } catch {
      return false;
    }
  }

  // Token management methods
  setAuthTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.tokenManager.setTokens(accessToken, refreshToken, expiresIn);
  }

  clearAuthTokens() {
    this.tokenManager.clearTokens();
  }

  isAuthenticated(): boolean {
    return !this.tokenManager.isTokenExpired() && this.tokenManager.getAccessToken() !== null;
  }
}

// Error handling utilities
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: ApiResponse): ApiError {
    return new ApiError(
      response.error?.code || 'UNKNOWN_ERROR',
      response.error?.message || 'An unknown error occurred',
      parseInt(response.error?.code || '500'),
      response.error?.details
    );
  }
}

// Response type guards
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } => {
  return response.success && response.data !== undefined;
};

export const isApiError = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: NonNullable<ApiResponse<T>['error']> } => {
  return !response.success && response.error !== undefined;
};

// Request interceptors for common patterns
export class RequestInterceptor {
  static addHIPAAHeaders(config: ApiRequestConfig): ApiRequestConfig {
    return {
      ...config,
      headers: {
        ...config.headers,
        'X-HIPAA-Compliant': 'true',
        'X-PHI-Access': 'true'
      },
      includeAuditHeaders: true,
      encryptPayload: true
    };
  }

  static addAnonymization(level: 'full' | 'partial' | 'minimal') {
    return (config: ApiRequestConfig): ApiRequestConfig => ({
      ...config,
      anonymizationLevel: level,
      headers: {
        ...config.headers,
        'X-Data-Anonymization': level
      }
    });
  }

  static requireStrongAuth(config: ApiRequestConfig): ApiRequestConfig {
    return {
      ...config,
      requireAuth: true,
      headers: {
        ...config.headers,
        'X-Require-MFA': 'true'
      }
    };
  }
}

// Singleton API client instance
export const apiClient = new ApiClient();

// Export types and utilities
export type {
    ApiRequestConfig, ApiResponse, RetryConfig
};

    export {
        API_CONFIG, ApiClient, AuditLogger, EncryptionService, SECURITY_HEADERS,
        TokenManager
    };

// Default export
export default apiClient;