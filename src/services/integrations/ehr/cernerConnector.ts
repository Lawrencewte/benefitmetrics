import { apiClient, ApiResponse, RequestInterceptor } from '../../api';

interface CernerPatient {
  id: string;
  identifier: { value: string; system: string }[];
  name: { given: string[]; family: string; use?: string }[];
  gender: string;
  birthDate: string;
  telecom?: { system: string; value: string; use?: string }[];
  address?: { line: string[]; city: string; state: string; postalCode: string; use?: string }[];
  maritalStatus?: { coding: { code: string; display: string }[] };
}

interface CernerEncounter {
  id: string;
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';
  class: { code: string; display: string };
  type?: { coding: { code: string; display: string }[] }[];
  subject: { reference: string };
  period: { start: string; end?: string };
  participant?: { individual: { reference: string; display: string } }[];
  location?: { location: { reference: string; display: string } }[];
}

interface CernerObservation {
  id: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'cancelled';
  category: { coding: { code: string; display: string; system: string }[] }[];
  code: { coding: { code: string; display: string; system: string }[] };
  subject: { reference: string };
  effectiveDateTime: string;
  valueQuantity?: { value: number; unit: string; system: string };
  valueString?: string;
  valueCodeableConcept?: { coding: { code: string; display: string }[] };
  component?: { code: any; valueQuantity?: any }[];
}

interface CernerCondition {
  id: string;
  clinicalStatus: { coding: { code: string; system: string }[] };
  verificationStatus: { coding: { code: string; system: string }[] };
  category: { coding: { code: string; display: string }[] }[];
  code: { coding: { code: string; display: string; system: string }[] };
  subject: { reference: string };
  onsetDateTime?: string;
  recordedDate: string;
}

class CernerConnector {
  private baseEndpoint = '/integrations/cerner';
  private accessToken: string | null = null;

  // Authentication
  async initialize(config: {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string[];
  }): Promise<ApiResponse<{ accessToken: string; tokenType: string; expiresIn: number }>> {
    const response = await apiClient.post(`${this.baseEndpoint}/initialize`, config,
      RequestInterceptor.addHIPAAHeaders({})
    );
    
    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
    }
    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return apiClient.post(`${this.baseEndpoint}/refresh`);
  }

  async testConnection(): Promise<ApiResponse<{ connected: boolean; metadata: any }>> {
    return apiClient.get(`${this.baseEndpoint}/test`);
  }

  // Patient Operations
  async searchPatients(criteria: {
    identifier?: string;
    family?: string;
    given?: string;
    birthdate?: string;
    _count?: number;
  }): Promise<ApiResponse<{ patients: CernerPatient[]; total: number }>> {
    return apiClient.get(`${this.baseEndpoint}/patients/search`, {
      headers: { 'X-Search-Criteria': JSON.stringify(criteria) }
    });
  }

  async getPatient(patientId: string): Promise<ApiResponse<CernerPatient>> {
    return apiClient.get(`${this.baseEndpoint}/patients/${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getPatientDemographics(patientId: string): Promise<ApiResponse<{
    patient: CernerPatient;
    emergencyContacts: any[];
    coverages: any[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/patients/${patientId}/demographics`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Encounters
  async getEncounters(patientId: string, dateRange?: { start: string; end: string }): Promise<ApiResponse<CernerEncounter[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (dateRange) {
      params.append('date', `ge${dateRange.start}`);
      params.append('date', `le${dateRange.end}`);
    }
    return apiClient.get(`${this.baseEndpoint}/encounters?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getEncounter(encounterId: string): Promise<ApiResponse<CernerEncounter>> {
    return apiClient.get(`${this.baseEndpoint}/encounters/${encounterId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Clinical Data
  async getObservations(
    patientId: string,
    category?: 'vital-signs' | 'laboratory' | 'social-history'
  ): Promise<ApiResponse<CernerObservation[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (category) params.append('category', category);
    return apiClient.get(`${this.baseEndpoint}/observations?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getVitalSigns(patientId: string, date?: string): Promise<ApiResponse<CernerObservation[]>> {
    const params = new URLSearchParams({ 
      patient: patientId,
      category: 'vital-signs'
    });
    if (date) params.append('date', date);
    return apiClient.get(`${this.baseEndpoint}/observations?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getConditions(patientId: string): Promise<ApiResponse<CernerCondition[]>> {
    return apiClient.get(`${this.baseEndpoint}/conditions?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getMedicationRequests(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/medication-requests?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getAllergies(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/allergy-intolerances?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getProcedures(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/procedures?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Immunizations
  async getImmunizations(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/immunizations?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Diagnostic Reports
  async getDiagnosticReports(patientId: string, category?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (category) params.append('category', category);
    return apiClient.get(`${this.baseEndpoint}/diagnostic-reports?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Appointments/Scheduling
  async getAppointments(patientId: string, dateRange?: { start: string; end: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (dateRange) {
      params.append('date', `ge${dateRange.start}`);
      params.append('date', `le${dateRange.end}`);
    }
    return apiClient.get(`${this.baseEndpoint}/appointments?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getSlots(
    schedule: string,
    start: string,
    end: string
  ): Promise<ApiResponse<{ slots: { start: string; end: string; status: string }[] }>> {
    return apiClient.get(`${this.baseEndpoint}/slots?schedule=${schedule}&start=${start}&end=${end}`);
  }

  // Care Plans
  async getCarePlans(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/care-plans?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Goals
  async getGoals(patientId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/goals?patient=${patientId}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Document References
  async getDocumentReferences(patientId: string, type?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (type) params.append('type', type);
    return apiClient.get(`${this.baseEndpoint}/document-references?${params}`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async getDocumentContent(documentId: string): Promise<ApiResponse<{ content: string; contentType: string }>> {
    return apiClient.get(`${this.baseEndpoint}/documents/${documentId}/content`,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Sync Operations
  async syncPatientData(patientId: string, resourceTypes?: string[]): Promise<ApiResponse<{
    syncId: string;
    status: string;
    resourcesProcessed: number;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/sync`, {
      patientId,
      resourceTypes: resourceTypes || [
        'Patient', 'Observation', 'Condition', 'MedicationRequest',
        'AllergyIntolerance', 'Procedure', 'Immunization'
      ]
    }, RequestInterceptor.addHIPAAHeaders({}));
  }

  async getSyncStatus(syncId: string): Promise<ApiResponse<{
    status: 'running' | 'completed' | 'failed';
    progress: number;
    resourcesProcessed: number;
    errors: string[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/sync/${syncId}/status`);
  }

  // Batch Operations
  async batchRequest(requests: {
    method: string;
    url: string;
    resource?: any;
  }[]): Promise<ApiResponse<{
    responses: { status: string; resource?: any; operationOutcome?: any }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/batch`, { requests },
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  // Audit and Compliance
  async getAuditEvents(patientId: string, period?: { start: string; end: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({ patient: patientId });
    if (period) {
      params.append('date', `ge${period.start}`);
      params.append('date', `le${period.end}`);
    }
    return apiClient.get(`${this.baseEndpoint}/audit-events?${params}`);
  }

  // Terminology Services
  async validateCode(system: string, code: string): Promise<ApiResponse<{
    result: boolean;
    message?: string;
    display?: string;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/terminology/validate-code`, {
      system,
      code
    });
  }

  async lookupCode(system: string, code: string): Promise<ApiResponse<{
    name: string;
    display: string;
    definition?: string;
    property?: any[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/terminology/lookup?system=${system}&code=${code}`);
  }
}

// Helper utilities
export const CernerHelpers = {
  extractPatientName: (patient: CernerPatient): string => {
    const officialName = patient.name?.find(n => n.use === 'official') || patient.name?.[0];
    if (!officialName) return 'Unknown';
    return `${officialName.given?.[0] || ''} ${officialName.family || ''}`.trim();
  },

  extractContact: (patient: CernerPatient, type: 'phone' | 'email') => {
    return patient.telecom?.find(t => t.system === type && t.use !== 'old')?.value;
  },

  extractAddress: (patient: CernerPatient) => {
    const homeAddress = patient.address?.find(a => a.use === 'home') || patient.address?.[0];
    if (!homeAddress) return null;
    return {
      street: homeAddress.line?.join(' '),
      city: homeAddress.city,
      state: homeAddress.state,
      zip: homeAddress.postalCode
    };
  },

  mapObservationValue: (obs: CernerObservation) => {
    if (obs.valueQuantity) {
      return { value: obs.valueQuantity.value, unit: obs.valueQuantity.unit };
    }
    if (obs.valueString) return { value: obs.valueString };
    if (obs.valueCodeableConcept) {
      return { value: obs.valueCodeableConcept.coding?.[0]?.display };
    }
    return { value: null };
  },

  isActiveCondition: (condition: CernerCondition): boolean => {
    return condition.clinicalStatus?.coding?.[0]?.code === 'active';
  },

  formatCernerDate: (date: Date): string => date.toISOString(),

  parseCernerDate: (dateString: string): Date => new Date(dateString),

  getVitalSignsByType: (observations: CernerObservation[]) => {
    const vitals: Record<string, CernerObservation> = {};
    observations.forEach(obs => {
      const code = obs.code.coding?.[0]?.code;
      if (code) {
        // Common vital sign codes
        switch (code) {
          case '8480-6': vitals.systolic = obs; break;
          case '8462-4': vitals.diastolic = obs; break;
          case '8867-4': vitals.heartRate = obs; break;
          case '8310-5': vitals.temperature = obs; break;
          case '9843-4': vitals.headCircumference = obs; break;
          case '8302-2': vitals.height = obs; break;
          case '29463-7': vitals.weight = obs; break;
          case '39156-5': vitals.bmi = obs; break;
        }
      }
    });
    return vitals;
  }
};

export const cernerConnector = new CernerConnector();
export default cernerConnector;