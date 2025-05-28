import { apiClient, ApiResponse, RequestInterceptor } from '../../api';

interface EpicPatient {
  id: string;
  identifier: { value: string; system: string }[];
  name: { given: string[]; family: string }[];
  birthDate: string;
  gender: string;
  telecom?: { system: string; value: string }[];
  address?: { line: string[]; city: string; state: string; postalCode: string }[];
}

interface EpicAppointment {
  id: string;
  status: 'scheduled' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow';
  serviceType: { text: string };
  start: string;
  end: string;
  participant: {
    actor: { reference: string; display: string };
    status: 'accepted' | 'declined' | 'tentative';
  }[];
  location?: { display: string };
}

interface EpicObservation {
  id: string;
  status: 'final' | 'preliminary' | 'cancelled';
  category: { coding: { code: string; display: string }[] }[];
  code: { coding: { code: string; display: string; system: string }[] };
  subject: { reference: string };
  effectiveDateTime: string;
  valueQuantity?: { value: number; unit: string };
  valueString?: string;
  component?: { code: any; valueQuantity?: any; valueString?: string }[];
}

interface EpicCondition {
  id: string;
  clinicalStatus: { coding: { code: string }[] };
  category: { coding: { code: string; display: string }[] }[];
  code: { coding: { code: string; display: string; system: string }[] };
  subject: { reference: string };
  onsetDateTime?: string;
  recordedDate: string;
}

class EpicConnector {
  private baseEndpoint = '/integrations/epic';
  private fhirBaseUrl = '';
  private accessToken: string | null = null;

  // Authentication & Setup
  async initialize(config: {
    fhirBaseUrl: string;
    clientId: string;
    privateKey: string; // JWT signing
    scope: string[];
  }): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    const response = await apiClient.post(`${this.baseEndpoint}/initialize`, config, 
      RequestInterceptor.addHIPAAHeaders({})
    );
    
    if (response.success && response.data) {
      this.fhirBaseUrl = config.fhirBaseUrl;
      this.accessToken = response.data.accessToken;
    }
    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    return apiClient.post(`${this.baseEndpoint}/refresh-token`);
  }

  async testConnection(): Promise<ApiResponse<{ connected: boolean; metadata: any }>> {
    return apiClient.get(`${this.baseEndpoint}/test`);
  }

  // Patient Management
  async searchPatients(params: {
    identifier?: string;
    family?: string;
    given?: string;
    birthdate?: string;
    limit?: number;
  }): Promise<ApiResponse<{ patients: EpicPatient[]; total: number }>> {
    return apiClient.get(`${this.baseEndpoint}/patients/search`, {
      headers: { 'X-Search-Params': JSON.stringify(params) }
    });
  }

  async getPatient(patientId: string): Promise<ApiResponse<EpicPatient>> {
    return apiClient.get(`${this.baseEndpoint}/patients/${patientId}`, 
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async createPatient(patient: Omit<EpicPatient, 'id'>): Promise<ApiResponse<EpicPatient>> {
    return apiClient.post(`${this.baseEndpoint}/patients`, patient,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async updatePatient(patientId: string, updates: Partial<EpicPatient>): Promise<ApiResponse<EpicPatient>> {
    return apiClient.put(`${this.baseEndpoint}/patients/${patientId}`, updates,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Appointments
  async getAppointments(patientId: string, dateRange?: { start: string; end: string }): Promise<ApiResponse<EpicAppointment[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (dateRange) {
      params.append('date', `ge${dateRange.start}`);
      params.append('date', `le${dateRange.end}`);
    }
    return apiClient.get(`${this.baseEndpoint}/appointments?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async createAppointment(appointment: Omit<EpicAppointment, 'id'>): Promise<ApiResponse<EpicAppointment>> {
    return apiClient.post(`${this.baseEndpoint}/appointments`, appointment,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async updateAppointment(appointmentId: string, updates: Partial<EpicAppointment>): Promise<ApiResponse<EpicAppointment>> {
    return apiClient.put(`${this.baseEndpoint}/appointments/${appointmentId}`, updates,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/appointments/${appointmentId}`, {
      body: { reason }
    });
  }

  // Clinical Data
  async getObservations(
    patientId: string, 
    category?: 'vital-signs' | 'laboratory' | 'imaging' | 'procedure'
  ): Promise<ApiResponse<EpicObservation[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (category) params.append('category', category);
    return apiClient.get(`${this.baseEndpoint}/observations?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getConditions(patientId: string): Promise<ApiResponse<EpicCondition[]>> {
    return apiClient.get(`${this.baseEndpoint}/conditions?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getMedications(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/medication-requests?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getAllergies(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/allergy-intolerances?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getVitalSigns(patientId: string, dateRange?: { start: string; end: string }): Promise<ApiResponse<EpicObservation[]>> {
    const params = new URLSearchParams({ 
      patient: patientId,
      category: 'vital-signs'
    });
    if (dateRange) {
      params.append('date', `ge${dateRange.start}`);
      params.append('date', `le${dateRange.end}`);
    }
    return apiClient.get(`${this.baseEndpoint}/observations?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Provider & Organization
  async searchProviders(name?: string, specialty?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (specialty) params.append('specialty', specialty);
    return apiClient.get(`${this.baseEndpoint}/practitioners?${params}`);
  }

  async getProvider(providerId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`${this.baseEndpoint}/practitioners/${providerId}`);
  }

  async getOrganizations(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/organizations`);
  }

  // Bulk Data Operations
  async exportPatientData(
    patientId: string,
    resources?: string[],
    since?: string
  ): Promise<ApiResponse<{ exportUrl: string; status: string }>> {
    return apiClient.post(`${this.baseEndpoint}/bulk-export`, {
      patient: patientId,
      _type: resources?.join(','),
      _since: since
    }, RequestInterceptor.addHIPAAHeaders({}));
  }

  async getBulkExportStatus(exportId: string): Promise<ApiResponse<{
    status: 'in-progress' | 'completed' | 'error';
    output?: { type: string; url: string }[];
    error?: string;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/bulk-export/${exportId}/status`);
  }

  // Consent Management
  async getConsents(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/consents?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async createConsent(consent: {
    patient: string;
    scope: string[];
    purpose: string;
    period?: { start: string; end?: string };
  }): Promise<ApiResponse<any>> {
    return apiClient.post(`${this.baseEndpoint}/consents`, consent,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async revokeConsent(consentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/consents/${consentId}`);
  }

  // Sync & Integration
  async syncPatientData(patientId: string, dataTypes?: string[]): Promise<ApiResponse<{
    syncId: string;
    status: string;
    resourcesProcessed: number;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/sync/patient`, {
      patientId,
      dataTypes: dataTypes || ['Patient', 'Observation', 'Condition', 'Appointment']
    }, RequestInterceptor.addHIPAAHeaders({}));
  }

  async getSyncHistory(limit = 10): Promise<ApiResponse<{
    syncs: {
      id: string;
      patientId: string;
      startTime: string;
      endTime?: string;
      status: string;
      resourcesProcessed: number;
      errors: string[];
    }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/sync/history?limit=${limit}`);
  }

  // Audit & Compliance
  async getAccessLog(patientId: string, days = 30): Promise<ApiResponse<{
    accesses: {
      timestamp: string;
      user: string;
      resource: string;
      action: string;
      purpose: string;
    }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/audit/access-log/${patientId}?days=${days}`);
  }

  async validateFHIRCompliance(): Promise<ApiResponse<{
    isCompliant: boolean;
    version: string;
    supportedResources: string[];
    issues: string[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/compliance/validate`);
  }
}

// Helper utilities
export const EpicHelpers = {
  parseFHIRDate: (fhirDate: string): Date => new Date(fhirDate),
  
  formatFHIRDate: (date: Date): string => date.toISOString().split('T')[0],
  
  extractPatientName: (patient: EpicPatient): string => {
    const name = patient.name?.[0];
    if (!name) return 'Unknown';
    return `${name.given?.[0] || ''} ${name.family || ''}`.trim();
  },
  
  extractContactInfo: (patient: EpicPatient) => ({
    phone: patient.telecom?.find(t => t.system === 'phone')?.value,
    email: patient.telecom?.find(t => t.system === 'email')?.value
  }),
  
  mapObservationValue: (obs: EpicObservation): { value: any; unit?: string } => {
    if (obs.valueQuantity) {
      return { value: obs.valueQuantity.value, unit: obs.valueQuantity.unit };
    }
    if (obs.valueString) {
      return { value: obs.valueString };
    }
    return { value: null };
  },
  
  isActiveCondition: (condition: EpicCondition): boolean => {
    return condition.clinicalStatus?.coding?.[0]?.code === 'active';
  }
};

export const epicConnector = new EpicConnector();
export default epicConnector;