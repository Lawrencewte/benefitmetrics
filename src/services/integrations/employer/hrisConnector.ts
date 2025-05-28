import { api } from '../../api';
import { auditLogService } from '../../security/auditLogService';
import { encryptionService } from '../../security/encryptionService';

export interface HRISConnection {
  id: string;
  companyId: string;
  hrisProvider: HRISProvider;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING';
  lastSyncDate: Date;
  nextSyncDate: Date;
  syncFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  dataMapping: FieldMapping[];
  permissions: HRISPermissions;
  errorLog: HRISError[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HRISProvider {
  name: string;
  type: 'WORKDAY' | 'BAMBOOHR' | 'ADP' | 'PAYCHEX' | 'NAMELY' | 'GUSTO' | 'ZENEFITS' | 'CUSTOM';
  version: string;
  apiEndpoint: string;
  authType: 'OAUTH2' | 'API_KEY' | 'BASIC_AUTH' | 'SAML';
  capabilities: HRISCapability[];
  dataRetentionDays: number;
}

export interface HRISCapability {
  feature: string;
  supported: boolean;
  limitations?: string[];
}

export interface FieldMapping {
  hrisField: string;
  BenefitMetricsField: string;
  fieldType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'ARRAY';
  required: boolean;
  transformation?: string; // transformation function
  defaultValue?: any;
}

export interface HRISPermissions {
  employeeData: {
    read: boolean;
    write: boolean;
    fields: string[];
  };
  benefits: {
    read: boolean;
    write: boolean;
    eligibilityUpdates: boolean;
  };
  timeOff: {
    read: boolean;
    createRequests: boolean;
    approveRequests: boolean;
  };
  organizational: {
    departments: boolean;
    reporting: boolean;
    costCenters: boolean;
  };
  wellness: {
    participationTracking: boolean;
    healthMetrics: boolean;
    incentiveManagement: boolean;
  };
}

export interface HRISError {
  id: string;
  timestamp: Date;
  errorType: 'SYNC_ERROR' | 'AUTH_ERROR' | 'DATA_ERROR' | 'API_ERROR';
  message: string;
  details: any;
  resolved: boolean;
  resolvedAt?: Date;
  resolution?: string;
}

export interface Employee {
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    ssn?: string; // encrypted
    gender?: 'M' | 'F' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    maritalStatus?: string;
  };
  employment: {
    hireDate: Date;
    terminationDate?: Date;
    status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE';
    jobTitle: string;
    department: string;
    location: string;
    supervisor?: string;
    payType: 'SALARY' | 'HOURLY' | 'CONTRACT';
    fullTimeEquivalent: number; // 1.0 = full time
  };
  benefits: {
    eligibilityDate: Date;
    planYear: number;
    enrollmentStatus: 'ENROLLED' | 'DECLINED' | 'PENDING' | 'ELIGIBLE';
    healthPlan?: string;
    dentalPlan?: string;
    visionPlan?: string;
    hsaContribution?: number;
    fsaContribution?: number;
  };
  demographics: {
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };
  wellnessProgram: {
    participationStatus: 'ENROLLED' | 'DECLINED' | 'ELIGIBLE';
    enrollmentDate?: Date;
    incentiveEligible: boolean;
    biometricScreeningComplete: boolean;
    healthAssessmentComplete: boolean;
  };
}

export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
  manager?: string;
  costCenter: string;
  location: string;
  employeeCount: number;
  budget?: number;
  wellnessBudget?: number;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  requestType: 'PTO' | 'SICK' | 'VACATION' | 'PERSONAL' | 'WELLNESS' | 'MEDICAL';
  startDate: Date;
  endDate: Date;
  hours: number;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED';
  reason?: string;
  medicalAppointment?: {
    appointmentType: string;
    preventativeCare: boolean;
    providerName?: string;
  };
  approver?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  comments?: string;
}

export interface BenefitsEligibility {
  employeeId: string;
  eligibilityDate: Date;
  planYear: number;
  qualifyingEvent?: {
    type: string;
    date: Date;
    description: string;
  };
  availablePlans: {
    category: 'HEALTH' | 'DENTAL' | 'VISION' | 'WELLNESS';
    planId: string;
    planName: string;
    premium: number;
    coverage: string;
    eligible: boolean;
  }[];
  enrollmentDeadline: Date;
  currentElections: {
    planId: string;
    coverage: string;
    premium: number;
    effectiveDate: Date;
  }[];
}

export interface WellnessParticipation {
  employeeId: string;
  programId: string;
  enrollmentDate: Date;
  participationStatus: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'DROPPED';
  activitiesCompleted: {
    activityId: string;
    activityName: string;
    completionDate: Date;
    points: number;
    incentiveValue?: number;
  }[];
  totalPoints: number;
  incentivesEarned: number;
  biometricData?: {
    screeningDate: Date;
    bmi: number;
    bloodPressure: string;
    cholesterol: number;
    glucose: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  };
  healthAssessment?: {
    completionDate: Date;
    riskScore: number;
    recommendations: string[];
  };
}

export interface HRISSyncResult {
  syncId: string;
  startTime: Date;
  endTime: Date;
  status: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED';
  recordsProcessed: {
    employees: number;
    departments: number;
    benefits: number;
    timeOff: number;
  };
  recordsUpdated: {
    employees: number;
    departments: number;
    benefits: number;
    timeOff: number;
  };
  errors: HRISError[];
  warnings: string[];
  nextSyncScheduled: Date;
}

class HRISConnectorService {
  private readonly baseUrl = '/api/integrations/employer/hris';

  async establishConnection(
    companyId: string,
    hrisProvider: HRISProvider,
    credentials: {
      clientId?: string;
      clientSecret?: string;
      apiKey?: string;
      username?: string;
      password?: string;
      tenantId?: string;
      baseUrl?: string;
    },
    permissions: HRISPermissions
  ): Promise<{
    connectionId: string;
    status: 'CONNECTED' | 'PENDING_AUTHORIZATION' | 'FAILED';
    authorizationUrl?: string;
    testResults: {
      connectionTest: boolean;
      dataAccessTest: boolean;
      permissionsTest: boolean;
    };
  }> {
    try {
      // Encrypt sensitive credentials
      const encryptedCredentials = await encryptionService.encrypt(JSON.stringify(credentials));

      await auditLogService.logAccess({
        userId: 'system',
        action: 'ESTABLISH_HRIS_CONNECTION',
        resourceType: 'HRIS_CONNECTION',
        resourceId: companyId,
        metadata: { 
          hrisProvider: hrisProvider.name,
          permissions: Object.keys(permissions)
        }
      });

      const response = await api.post(`${this.baseUrl}/connect`, {
        companyId,
        hrisProvider,
        encryptedCredentials,
        permissions
      });

      return response.data;
    } catch (error) {
      console.error('Error establishing HRIS connection:', error);
      throw new Error('Failed to establish HRIS connection');
    }
  }

  async getConnectionStatus(
    connectionId: string,
    companyId: string
  ): Promise<HRISConnection> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'VIEW_HRIS_CONNECTION_STATUS',
        resourceType: 'HRIS_CONNECTION',
        resourceId: connectionId,
        metadata: { companyId }
      });

      const response = await api.get(`${this.baseUrl}/connections/${connectionId}`, {
        params: { companyId }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching HRIS connection status:', error);
      throw new Error('Failed to retrieve HRIS connection status');
    }
  }

  async syncEmployeeData(
    connectionId: string,
    syncOptions?: {
      fullSync?: boolean;
      employeeIds?: string[];
      syncFields?: string[];
      validateData?: boolean;
    }
  ): Promise<HRISSyncResult> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'SYNC_EMPLOYEE_DATA',
        resourceType: 'HRIS_SYNC',
        resourceId: connectionId,
        metadata: { syncOptions }
      });

      const response = await api.post(`${this.baseUrl}/connections/${connectionId}/sync-employees`, {
        syncOptions
      });

      return response.data;
    } catch (error) {
      console.error('Error syncing employee data:', error);
      throw new Error('Failed to sync employee data from HRIS');
    }
  }

  async getEmployees(
    connectionId: string,
    filters?: {
      status?: ('ACTIVE' | 'INACTIVE' | 'TERMINATED')[];
      departments?: string[];
      locations?: string[];
      hireDate?: { start: Date; end: Date };
      includeTerminated?: boolean;
    },
    pagination?: { page: number; limit: number }
  ): Promise<{
    employees: Employee[];
    totalCount: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'FETCH_EMPLOYEE_DATA',
        resourceType: 'EMPLOYEE_DATA',
        resourceId: connectionId,
        metadata: { filters, pagination }
      });

      const response = await api.post(`${this.baseUrl}/connections/${connectionId}/employees`, {
        filters,
        pagination
      });

      // Decrypt sensitive employee data
      const decryptedEmployees = await Promise.all(
        response.data.employees.map(async (employee: any) => {
          if (employee.personalInfo.ssn) {
            employee.personalInfo.ssn = await encryptionService.decrypt(employee.personalInfo.ssn);
          }
          return employee;
        })
      );

      return {
        ...response.data,
        employees: decryptedEmployees
      };
    } catch (error) {
      console.error('Error fetching employees from HRIS:', error);
      throw new Error('Failed to retrieve employee data from HRIS');
    }
  }

  async updateEmployeeWellnessStatus(
    connectionId: string,
    employeeId: string,
    wellnessUpdate: {
      participationStatus?: WellnessParticipation['participationStatus'];
      activitiesCompleted?: WellnessParticipation['activitiesCompleted'];
      pointsEarned?: number;
      incentiveValue?: number;
      biometricResults?: WellnessParticipation['biometricData'];
    }
  ): Promise<{ success: boolean; syncedToHRIS: boolean }> {
    try {
      await auditLogService.logAccess({
        userId: employeeId,
        action: 'UPDATE_WELLNESS_STATUS',
        resourceType: 'WELLNESS_DATA',
        resourceId: employeeId,
        metadata: { connectionId, wellnessUpdate }
      });

      const response = await api.put(
        `${this.baseUrl}/connections/${connectionId}/employees/${employeeId}/wellness`,
        { wellnessUpdate }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating employee wellness status:', error);
      throw new Error('Failed to update employee wellness status in HRIS');
    }
  }

  async createTimeOffRequest(
    connectionId: string,
    timeOffRequest: Omit<TimeOffRequest, 'id' | 'submittedAt' | 'status'>
  ): Promise<{
    requestId: string;
    hrisRequestId?: string;
    status: TimeOffRequest['status'];
    autoApproved: boolean;
  }> {
    try {
      await auditLogService.logAccess({
        userId: timeOffRequest.employeeId,
        action: 'CREATE_TIME_OFF_REQUEST',
        resourceType: 'TIME_OFF_REQUEST',
        resourceId: 'new_request',
        metadata: { 
          connectionId,
          requestType: timeOffRequest.requestType,
          hours: timeOffRequest.hours
        }
      });

      const response = await api.post(
        `${this.baseUrl}/connections/${connectionId}/time-off`,
        { timeOffRequest }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating time off request:', error);
      throw new Error('Failed to create time off request in HRIS');
    }
  }

  async getTimeOffRequests(
    connectionId: string,
    filters?: {
      employeeId?: string;
      status?: TimeOffRequest['status'][];
      requestType?: TimeOffRequest['requestType'][];
      dateRange?: { start: Date; end: Date };
      medicalAppointmentOnly?: boolean;
    }
  ): Promise<TimeOffRequest[]> {
    try {
      await auditLogService.logAccess({
        userId: filters?.employeeId || 'system',
        action: 'FETCH_TIME_OFF_REQUESTS',
        resourceType: 'TIME_OFF_REQUESTS',
        resourceId: connectionId,
        metadata: { filters }
      });

      const response = await api.post(
        `${this.baseUrl}/connections/${connectionId}/time-off/search`,
        { filters }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching time off requests:', error);
      throw new Error('Failed to retrieve time off requests from HRIS');
    }
  }

  async updateBenefitsEligibility(
    connectionId: string,
    employeeId: string,
    eligibilityUpdate: {
      qualifyingEvent?: BenefitsEligibility['qualifyingEvent'];
      newEligibilityDate?: Date;
      planChanges?: {
        category: string;
        oldPlanId?: string;
        newPlanId: string;
        effectiveDate: Date;
      }[];
    }
  ): Promise<{ success: boolean; effectiveDate: Date }> {
    try {
      await auditLogService.logAccess({
        userId: employeeId,
        action: 'UPDATE_BENEFITS_ELIGIBILITY',
        resourceType: 'BENEFITS_ELIGIBILITY',
        resourceId: employeeId,
        metadata: { connectionId, eligibilityUpdate }
      });

      const response = await api.put(
        `${this.baseUrl}/connections/${connectionId}/employees/${employeeId}/benefits`,
        { eligibilityUpdate }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating benefits eligibility:', error);
      throw new Error('Failed to update benefits eligibility in HRIS');
    }
  }

  async getDepartments(
    connectionId: string,
    includeEmployeeCounts: boolean = true
  ): Promise<Department[]> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'FETCH_DEPARTMENTS',
        resourceType: 'DEPARTMENT_DATA',
        resourceId: connectionId,
        metadata: { includeEmployeeCounts }
      });

      const response = await api.get(`${this.baseUrl}/connections/${connectionId}/departments`, {
        params: { includeEmployeeCounts }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching departments from HRIS:', error);
      throw new Error('Failed to retrieve department data from HRIS');
    }
  }

  async validateEmployeeData(
    connectionId: string,
    employeeData: Partial<Employee>[]
  ): Promise<{
    validationResults: {
      employeeId: string;
      isValid: boolean;
      errors: {
        field: string;
        message: string;
        severity: 'error' | 'warning';
      }[];
      warnings: string[];
    }[];
    overallValid: boolean;
    errorSummary: {
      totalErrors: number;
      totalWarnings: number;
      commonIssues: string[];
    };
  }> {
    try {
      const response = await api.post(
        `${this.baseUrl}/connections/${connectionId}/validate`,
        { employeeData }
      );

      return response.data;
    } catch (error) {
      console.error('Error validating employee data:', error);
      throw new Error('Failed to validate employee data');
    }
  }

  async getWellnessParticipation(
    connectionId: string,
    filters?: {
      employeeIds?: string[];
      programIds?: string[];
      status?: WellnessParticipation['participationStatus'][];
      dateRange?: { start: Date; end: Date };
    }
  ): Promise<WellnessParticipation[]> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'FETCH_WELLNESS_PARTICIPATION',
        resourceType: 'WELLNESS_PARTICIPATION',
        resourceId: connectionId,
        metadata: { filters }
      });

      const response = await api.post(
        `${this.baseUrl}/connections/${connectionId}/wellness/participation`,
        { filters }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching wellness participation:', error);
      throw new Error('Failed to retrieve wellness participation data from HRIS');
    }
  }

  async scheduleSync(
    connectionId: string,
    syncConfig: {
      frequency: HRISConnection['syncFrequency'];
      syncTypes: ('EMPLOYEES' | 'BENEFITS' | 'TIME_OFF' | 'DEPARTMENTS' | 'WELLNESS')[];
      timeOfDay: string; // HH:MM format
      timezone: string;
      notifications: {
        onSuccess: boolean;
        onError: boolean;
        recipients: string[];
      };
    }
  ): Promise<{
    scheduleId: string;
    nextSyncDate: Date;
    recurring: boolean;
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'SCHEDULE_HRIS_SYNC',
        resourceType: 'SYNC_SCHEDULE',
        resourceId: connectionId,
        metadata: { syncConfig }
      });

      const response = await api.post(
        `${this.baseUrl}/connections/${connectionId}/schedule-sync`,
        { syncConfig }
      );

      return response.data;
    } catch (error) {
      console.error('Error scheduling HRIS sync:', error);
      throw new Error('Failed to schedule HRIS synchronization');
    }
  }

  async disconnectHRIS(
    connectionId: string,
    companyId: string,
    options?: {
      retainData?: boolean;
      exportData?: boolean;
      notifyEmployees?: boolean;
    }
  ): Promise<{
    disconnected: boolean;
    dataRetained: boolean;
    exportFileUrl?: string;
    finalSyncCompleted: boolean;
  }> {
    try {
      await auditLogService.logAccess({
        userId: 'system',
        action: 'DISCONNECT_HRIS',
        resourceType: 'HRIS_CONNECTION',
        resourceId: connectionId,
        metadata: { companyId, options }
      });

      const response = await api.delete(`${this.baseUrl}/connections/${connectionId}`, {
        data: { companyId, options }
      });

      return response.data;
    } catch (error) {
      console.error('Error disconnecting HRIS:', error);
      throw new Error('Failed to disconnect HRIS system');
    }
  }

  async testConnection(
    connectionId: string
  ): Promise<{
    connectionStatus: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    apiStatus: 'REACHABLE' | 'UNREACHABLE' | 'UNAUTHORIZED';
    dataAccess: 'FULL' | 'LIMITED' | 'NONE';
    latency: number; // milliseconds
    lastSuccessfulSync?: Date;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/connections/${connectionId}/test`);
      return response.data;
    } catch (error) {
      console.error('Error testing HRIS connection:', error);
      throw new Error('Failed to test HRIS connection');
    }
  }

  async getSyncHistory(
    connectionId: string,
    filters?: {
      dateRange?: { start: Date; end: Date };
      status?: HRISSyncResult['status'][];
      syncType?: string[];
    },
    pagination?: { page: number; limit: number }
  ): Promise<{
    syncResults: HRISSyncResult[];
    totalCount: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/connections/${connectionId}/sync-history`, {
        filters,
        pagination
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching sync history:', error);
      throw new Error('Failed to retrieve HRIS sync history');
    }
  }
}

export const hrisConnectorService = new HRISConnectorService();