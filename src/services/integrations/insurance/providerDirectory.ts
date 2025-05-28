import { api } from '../../api';
import { auditLogService } from '../../security/auditLogService';

export interface Provider {
  id: string;
  npi: string; // National Provider Identifier
  name: {
    first: string;
    last: string;
    middle?: string;
    suffix?: string;
    displayName: string;
  };
  practice: {
    name: string;
    type: 'INDIVIDUAL' | 'GROUP' | 'HOSPITAL' | 'CLINIC' | 'FACILITY';
    taxId?: string;
  };
  specialties: ProviderSpecialty[];
  credentials: {
    degree: string[];
    boardCertifications: {
      board: string;
      specialty: string;
      certificationDate: Date;
      expirationDate?: Date;
    }[];
    licenses: {
      state: string;
      licenseNumber: string;
      expirationDate: Date;
    }[];
  };
  contact: {
    phone: string;
    fax?: string;
    email?: string;
    website?: string;
  };
  location: {
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      county?: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
    accessibility: {
      wheelchairAccessible: boolean;
      publicTransportation: boolean;
      parkingAvailable: boolean;
    };
  };
  networkStatus: {
    inNetwork: boolean;
    networkNames: string[];
    contractEffectiveDate: Date;
    contractEndDate?: Date;
    acceptingNewPatients: boolean;
  };
  services: {
    preventativeCare: PreventativeService[];
    specialtyServices: string[];
    languages: string[];
    ageGroups: ('PEDIATRIC' | 'ADULT' | 'GERIATRIC')[];
  };
  quality: {
    rating: number; // 1-5 scale
    reviewCount: number;
    qualityMeasures: {
      measure: string;
      score: number;
      national_average: number;
    }[];
    patientSatisfaction: {
      overallSatisfaction: number;
      recommendationRate: number;
      communicationScore: number;
      accessScore: number;
    };
  };
  availability: {
    hours: {
      monday: { open: string; close: string } | null;
      tuesday: { open: string; close: string } | null;
      wednesday: { open: string; close: string } | null;
      thursday: { open: string; close: string } | null;
      friday: { open: string; close: string } | null;
      saturday: { open: string; close: string } | null;
      sunday: { open: string; close: string } | null;
    };
    appointmentTypes: {
      type: string;
      duration: number; // minutes
      availableSlots: number;
      nextAvailable: Date;
    }[];
    telehealth: {
      available: boolean;
      platforms: string[];
      appointmentTypes: string[];
    };
  };
  cost: {
    acceptsInsurance: boolean;
    insurancePlans: string[];
    copayRange: { min: number; max: number };
    deductibleApplies: boolean;
    priceTransparency: {
      available: boolean;
      commonProcedures: {
        procedure: string;
        cptCode: string;
        estimatedCost: number;
      }[];
    };
  };
}

export interface ProviderSpecialty {
  code: string;
  name: string;
  primary: boolean;
  boardCertified: boolean;
}

export interface PreventativeService {
  serviceType: string;
  description: string;
  ageRange: string;
  frequency: string;
  genderSpecific?: 'M' | 'F';
  cptCodes: string[];
  covered: boolean;
  costEstimate: number;
}

export interface ProviderSearchCriteria {
  location?: {
    zipCode?: string;
    city?: string;
    state?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
      radius: number; // miles
    };
  };
  specialty?: string[];
  serviceType?: string[];
  preventativeService?: string[];
  networkStatus?: 'IN_NETWORK' | 'OUT_OF_NETWORK' | 'BOTH';
  acceptingNewPatients?: boolean;
  languages?: string[];
  minRating?: number;
  accessibility?: {
    wheelchairAccessible?: boolean;
    publicTransportation?: boolean;
    parkingAvailable?: boolean;
  };
  availability?: {
    timeframe?: 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'ANYTIME';
    dayPreferences?: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[];
    timePreferences?: ('MORNING' | 'AFTERNOON' | 'EVENING')[];
  };
  telehealth?: boolean;
  ageGroup?: 'PEDIATRIC' | 'ADULT' | 'GERIATRIC';
  gender?: 'M' | 'F';
  costRange?: { min: number; max: number };
}

export interface ProviderSearchResult {
  providers: Provider[];
  totalCount: number;
  searchCriteria: ProviderSearchCriteria;
  filters: {
    specialties: { name: string; count: number }[];
    languages: { name: string; count: number }[];
    locations: { city: string; state: string; count: number }[];
    ratings: { range: string; count: number }[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ProviderComparison {
  providers: Provider[];
  comparisonMetrics: {
    quality: {
      providerId: string;
      overallRating: number;
      patientSatisfaction: number;
      qualityMeasures: number;
    }[];
    cost: {
      providerId: string;
      estimatedCost: number;
      copayAmount: number;
      deductibleApplies: boolean;
    }[];
    convenience: {
      providerId: string;
      distance: number;
      nextAvailable: Date;
      telehealth: boolean;
    }[];
    services: {
      providerId: string;
      preventativeServices: number;
      specialtyServices: number;
      languages: number;
    }[];
  };
  recommendations: {
    bestOverall: string;
    bestValue: string;
    mostConvenient: string;
    highestQuality: string;
  };
}

export interface ProviderNetwork {
  networkId: string;
  networkName: string;
  networkType: 'HMO' | 'PPO' | 'EPO' | 'POS';
  providers: {
    total: number;
    bySpecialty: { specialty: string; count: number }[];
    byLocation: { state: string; city: string; count: number }[];
  };
  coverage: {
    preventativeCare: boolean;
    emergencyCare: boolean;
    specialtyCare: boolean;
    mentalHealth: boolean;
  };
  costStructure: {
    copayRange: { min: number; max: number };
    deductibleRange: { min: number; max: number };
    coinsuranceRange: { min: number; max: number };
  };
}

class ProviderDirectoryService {
  private readonly baseUrl = '/api/integrations/insurance/providers';

  async searchProviders(
    criteria: ProviderSearchCriteria,
    memberId?: string,
    pagination?: { page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<ProviderSearchResult> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'SEARCH_PROVIDERS',
        resourceType: 'PROVIDER_DIRECTORY',
        resourceId: 'search',
        metadata: { criteria, pagination }
      });

      const response = await api.post(`${this.baseUrl}/search`, {
        criteria,
        memberId,
        pagination
      });

      return response.data;
    } catch (error) {
      console.error('Error searching providers:', error);
      throw new Error('Failed to search providers');
    }
  }

  async getProvider(
    providerId: string,
    memberId?: string
  ): Promise<Provider> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'VIEW_PROVIDER_DETAILS',
        resourceType: 'PROVIDER',
        resourceId: providerId,
        metadata: { memberId }
      });

      const response = await api.get(`${this.baseUrl}/${providerId}`, {
        params: { memberId }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching provider details:', error);
      throw new Error('Failed to retrieve provider details');
    }
  }

  async getProvidersBySpecialty(
    specialty: string,
    location?: {
      zipCode: string;
      radius: number;
    },
    memberId?: string
  ): Promise<Provider[]> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'SEARCH_PROVIDERS_BY_SPECIALTY',
        resourceType: 'PROVIDER_DIRECTORY',
        resourceId: specialty,
        metadata: { location, memberId }
      });

      const response = await api.get(`${this.baseUrl}/specialty/${specialty}`, {
        params: {
          zipCode: location?.zipCode,
          radius: location?.radius,
          memberId
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching providers by specialty:', error);
      throw new Error('Failed to retrieve providers by specialty');
    }
  }

  async getPreventativeCareProviders(
    serviceType: string,
    location: {
      zipCode: string;
      radius: number;
    },
    memberId?: string
  ): Promise<{
    providers: Provider[];
    serviceInfo: {
      description: string;
      frequency: string;
      ageRecommendations: string;
      benefits: string[];
    };
    coverageInfo: {
      covered: boolean;
      costSharing: number;
      deductibleApplies: boolean;
      priorAuthRequired: boolean;
    };
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'SEARCH_PREVENTATIVE_PROVIDERS',
        resourceType: 'PREVENTATIVE_PROVIDERS',
        resourceId: serviceType,
        metadata: { location, memberId }
      });

      const response = await api.get(`${this.baseUrl}/preventative/${serviceType}`, {
        params: {
          zipCode: location.zipCode,
          radius: location.radius,
          memberId
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching preventative care providers:', error);
      throw new Error('Failed to retrieve preventative care providers');
    }
  }

  async compareProviders(
    providerIds: string[],
    comparisonType: 'QUALITY' | 'COST' | 'CONVENIENCE' | 'COMPREHENSIVE',
    memberId?: string
  ): Promise<ProviderComparison> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'COMPARE_PROVIDERS',
        resourceType: 'PROVIDER_COMPARISON',
        resourceId: providerIds.join(','),
        metadata: { comparisonType, memberId }
      });

      const response = await api.post(`${this.baseUrl}/compare`, {
        providerIds,
        comparisonType,
        memberId
      });

      return response.data;
    } catch (error) {
      console.error('Error comparing providers:', error);
      throw new Error('Failed to compare providers');
    }
  }

  async getProviderAvailability(
    providerId: string,
    serviceType: string,
    timeframe: {
      start: Date;
      end: Date;
    },
    memberId?: string
  ): Promise<{
    provider: {
      id: string;
      name: string;
      practice: string;
    };
    availableSlots: {
      date: Date;
      time: string;
      duration: number;
      appointmentType: string;
      telehealth: boolean;
    }[];
    nextAvailable: Date;
    bookingInstructions: string;
    cancellationPolicy: string;
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'CHECK_PROVIDER_AVAILABILITY',
        resourceType: 'PROVIDER_AVAILABILITY',
        resourceId: providerId,
        metadata: { serviceType, timeframe, memberId }
      });

      const response = await api.get(`${this.baseUrl}/${providerId}/availability`, {
        params: {
          serviceType,
          startDate: timeframe.start.toISOString(),
          endDate: timeframe.end.toISOString(),
          memberId
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error checking provider availability:', error);
      throw new Error('Failed to check provider availability');
    }
  }

  async getProviderReviews(
    providerId: string,
    filters?: {
      rating?: number;
      serviceType?: string;
      dateRange?: { start: Date; end: Date };
    },
    pagination?: { page: number; limit: number }
  ): Promise<{
    reviews: {
      id: string;
      rating: number;
      title: string;
      comment: string;
      serviceType: string;
      visitDate: Date;
      reviewDate: Date;
      helpful: number;
      verified: boolean;
      recommend: boolean;
    }[];
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: { rating: number; count: number }[];
      commonThemes: string[];
      recommendationRate: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${providerId}/reviews`, {
        params: {
          ...filters,
          ...pagination,
          startDate: filters?.dateRange?.start?.toISOString(),
          endDate: filters?.dateRange?.end?.toISOString()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching provider reviews:', error);
      throw new Error('Failed to retrieve provider reviews');
    }
  }

  async getNetworkProviders(
    networkId: string,
    criteria?: Partial<ProviderSearchCriteria>,
    pagination?: { page: number; limit: number }
  ): Promise<{
    network: ProviderNetwork;
    providers: Provider[];
    totalCount: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/network/${networkId}`, {
        params: {
          ...criteria,
          ...pagination
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching network providers:', error);
      throw new Error('Failed to retrieve network providers');
    }
  }

  async estimateAppointmentCost(
    providerId: string,
    serviceType: string,
    procedureCodes: string[],
    memberId?: string
  ): Promise<{
    provider: {
      id: string;
      name: string;
      networkStatus: string;
    };
    costEstimate: {
      totalCharges: number;
      allowedAmount: number;
      memberCost: {
        copay: number;
        deductible: number;
        coinsurance: number;
        total: number;
      };
      planPayment: number;
    };
    costBreakdown: {
      procedureCode: string;
      description: string;
      charge: number;
      allowedAmount: number;
      memberResponsibility: number;
    }[];
    alternativeOptions: {
      providerId: string;
      providerName: string;
      estimatedCost: number;
      distance?: number;
    }[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId || 'anonymous',
        action: 'ESTIMATE_APPOINTMENT_COST',
        resourceType: 'COST_ESTIMATE',
        resourceId: providerId,
        metadata: { serviceType, procedureCodes, memberId }
      });

      const response = await api.post(`${this.baseUrl}/${providerId}/cost-estimate`, {
        serviceType,
        procedureCodes,
        memberId
      });

      return response.data;
    } catch (error) {
      console.error('Error estimating appointment cost:', error);
      throw new Error('Failed to estimate appointment cost');
    }
  }

  async getSpecialties(): Promise<{
    specialties: {
      code: string;
      name: string;
      category: string;
      description: string;
      commonServices: string[];
      preventativeServices: string[];
    }[];
    categories: {
      name: string;
      specialties: string[];
    }[];
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/specialties`);
      return response.data;
    } catch (error) {
      console.error('Error fetching specialties:', error);
      throw new Error('Failed to retrieve specialties');
    }
  }

  async saveProviderToFavorites(
    providerId: string,
    memberId: string,
    notes?: string
  ): Promise<{ success: boolean; favoriteId: string }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'SAVE_PROVIDER_FAVORITE',
        resourceType: 'PROVIDER_FAVORITE',
        resourceId: providerId,
        metadata: { notes }
      });

      const response = await api.post(`${this.baseUrl}/${providerId}/favorite`, {
        memberId,
        notes
      });

      return response.data;
    } catch (error) {
      console.error('Error saving provider to favorites:', error);
      throw new Error('Failed to save provider to favorites');
    }
  }

  async getFavoriteProviders(
    memberId: string
  ): Promise<{
    providers: (Provider & {
      favoriteId: string;
      notes?: string;
      dateAdded: Date;
      lastVisit?: Date;
    })[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VIEW_FAVORITE_PROVIDERS',
        resourceType: 'PROVIDER_FAVORITES',
        resourceId: memberId
      });

      const response = await api.get(`${this.baseUrl}/favorites`, {
        params: { memberId }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching favorite providers:', error);
      throw new Error('Failed to retrieve favorite providers');
    }
  }

  async validateProviderNetwork(
    providerId: string,
    memberId: string,
    serviceDate: Date
  ): Promise<{
    inNetwork: boolean;
    networkName: string;
    effectiveDate: Date;
    endDate?: Date;
    benefits: {
      copay: number;
      deductibleApplies: boolean;
      coinsurancePercentage: number;
      priorAuthRequired: boolean;
    };
    warnings: string[];
  }> {
    try {
      await auditLogService.logAccess({
        userId: memberId,
        action: 'VALIDATE_PROVIDER_NETWORK',
        resourceType: 'NETWORK_VALIDATION',
        resourceId: providerId,
        metadata: { memberId, serviceDate }
      });

      const response = await api.post(`${this.baseUrl}/${providerId}/validate-network`, {
        memberId,
        serviceDate
      });

      return response.data;
    } catch (error) {
      console.error('Error validating provider network:', error);
      throw new Error('Failed to validate provider network status');
    }
  }
}

export const providerDirectoryService = new ProviderDirectoryService();