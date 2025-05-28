import { apiClient, ApiResponse } from '../../api';

// Google Calendar API types
interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }[];
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: 'email' | 'popup';
      minutes: number;
    }[];
  };
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: 'hangoutsMeet';
      };
    };
  };
  extendedProperties?: {
    private?: Record<string, string>;
    shared?: Record<string, string>;
  };
}

interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  backgroundColor?: string;
  foregroundColor?: string;
  timeZone?: string;
}

interface CalendarIntegrationConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  companyDomain?: string;
  defaultCalendarId?: string;
  syncEnabled: boolean;
  autoCreateMeetings: boolean;
  reminderDefaults: {
    email: number[]; // minutes before
    popup: number[]; // minutes before
  };
}

interface AppointmentSyncSettings {
  syncDirection: 'one_way' | 'two_way';
  conflictResolution: 'company_priority' | 'calendar_priority' | 'manual';
  autoReschedule: boolean;
  businessHours: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
    workDays: number[]; // 0-6, Sunday=0
  };
  bufferTime: {
    before: number; // minutes
    after: number;  // minutes
  };
}

class GoogleCalendarService {
  private baseEndpoint = '/integrations/google-calendar';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private config: CalendarIntegrationConfig | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('google_calendar_access_token');
      this.refreshToken = localStorage.getItem('google_calendar_refresh_token');
    }
  }

  private saveTokensToStorage() {
    if (typeof window !== 'undefined') {
      if (this.accessToken) {
        localStorage.setItem('google_calendar_access_token', this.accessToken);
      }
      if (this.refreshToken) {
        localStorage.setItem('google_calendar_refresh_token', this.refreshToken);
      }
    }
  }

  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('google_calendar_access_token');
      localStorage.removeItem('google_calendar_refresh_token');
    }
  }

  // Authentication and setup
  async initializeIntegration(config: CalendarIntegrationConfig): Promise<ApiResponse<{ authUrl: string }>> {
    this.config = config;
    return apiClient.post(`${this.baseEndpoint}/initialize`, config);
  }

  async completeOAuthFlow(authCode: string): Promise<ApiResponse<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userEmail: string;
    calendars: GoogleCalendar[];
  }>> {
    const response = await apiClient.post(`${this.baseEndpoint}/oauth/callback`, {
      authCode
    });

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      this.saveTokensToStorage();
    }

    return response;
  }

  async refreshAccessToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post(`${this.baseEndpoint}/oauth/refresh`, {
      refreshToken: this.refreshToken
    });

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      this.saveTokensToStorage();
    }

    return response;
  }

  async disconnectIntegration(): Promise<ApiResponse<void>> {
    const response = await apiClient.post(`${this.baseEndpoint}/disconnect`);
    
    if (response.success) {
      this.accessToken = null;
      this.refreshToken = null;
      this.clearTokensFromStorage();
    }

    return response;
  }

  async getConnectionStatus(): Promise<ApiResponse<{
    isConnected: boolean;
    userEmail?: string;
    lastSync?: string;
    syncEnabled: boolean;
    permissions: string[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/status`);
  }

  // Calendar management
  async getCalendars(): Promise<ApiResponse<GoogleCalendar[]>> {
    return apiClient.get(`${this.baseEndpoint}/calendars`);
  }

  async getPrimaryCalendar(): Promise<ApiResponse<GoogleCalendar>> {
    return apiClient.get(`${this.baseEndpoint}/calendars/primary`);
  }

  async setDefaultCalendar(calendarId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/calendars/set-default`, {
      calendarId
    });
  }

  // Event management
  async createAppointmentEvent(
    appointmentData: {
      appointmentId: string;
      title: string;
      description?: string;
      startTime: string;
      endTime: string;
      location?: string;
      providerEmail?: string;
      patientEmail?: string;
      appointmentType: string;
      metadata?: Record<string, any>;
    },
    calendarId?: string
  ): Promise<ApiResponse<{ eventId: string; event: GoogleCalendarEvent }>> {
    return apiClient.post(`${this.baseEndpoint}/events/create-appointment`, {
      ...appointmentData,
      calendarId: calendarId || 'primary'
    });
  }

  async updateAppointmentEvent(
    eventId: string,
    updates: {
      title?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      location?: string;
    },
    calendarId?: string
  ): Promise<ApiResponse<GoogleCalendarEvent>> {
    return apiClient.put(`${this.baseEndpoint}/events/${eventId}`, {
      ...updates,
      calendarId: calendarId || 'primary'
    });
  }

  async cancelAppointmentEvent(
    eventId: string,
    calendarId?: string,
    sendNotifications = true
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/events/${eventId}`, {
      body: {
        calendarId: calendarId || 'primary',
        sendNotifications
      }
    });
  }

  async getEvent(eventId: string, calendarId?: string): Promise<ApiResponse<GoogleCalendarEvent>> {
    const params = new URLSearchParams();
    if (calendarId) params.append('calendarId', calendarId);
    
    return apiClient.get(`${this.baseEndpoint}/events/${eventId}?${params}`);
  }

  async getEvents(
    timeMin: string,
    timeMax: string,
    calendarId?: string,
    options?: {
      maxResults?: number;
      singleEvents?: boolean;
      orderBy?: 'startTime' | 'updated';
    }
  ): Promise<ApiResponse<{
    events: GoogleCalendarEvent[];
    nextPageToken?: string;
    nextSyncToken?: string;
  }>> {
    const params = new URLSearchParams({
      timeMin,
      timeMax
    });
    
    if (calendarId) params.append('calendarId', calendarId);
    if (options?.maxResults) params.append('maxResults', options.maxResults.toString());
    if (options?.singleEvents) params.append('singleEvents', options.singleEvents.toString());
    if (options?.orderBy) params.append('orderBy', options.orderBy);

    return apiClient.get(`${this.baseEndpoint}/events?${params}`);
  }

  // Availability and scheduling
  async checkAvailability(
    timeSlots: {
      start: string;
      end: string;
    }[],
    calendarIds?: string[]
  ): Promise<ApiResponse<{
    timeSlot: { start: string; end: string };
    isAvailable: boolean;
    conflicts?: {
      eventId: string;
      summary: string;
      start: string;
      end: string;
    }[];
  }[]>> {
    return apiClient.post(`${this.baseEndpoint}/availability/check`, {
      timeSlots,
      calendarIds: calendarIds || ['primary']
    });
  }

  async findAvailableSlots(
    startDate: string,
    endDate: string,
    duration: number, // in minutes
    options?: {
      workingHours?: {
        start: string;
        end: string;
        timezone: string;
      };
      workingDays?: number[];
      bufferTime?: number;
      preferredTimes?: string[];
      calendarIds?: string[];
    }
  ): Promise<ApiResponse<{
    start: string;
    end: string;
    confidence: number;
  }[]>> {
    return apiClient.post(`${this.baseEndpoint}/availability/find-slots`, {
      startDate,
      endDate,
      duration,
      ...options
    });
  }

  async getFreeBusyInfo(
    calendars: string[],
    timeMin: string,
    timeMax: string
  ): Promise<ApiResponse<{
    [calendarId: string]: {
      busy: { start: string; end: string }[];
      errors?: { domain: string; reason: string }[];
    };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/freebusy`, {
      items: calendars.map(id => ({ id })),
      timeMin,
      timeMax
    });
  }

  // Sync management
  async enableSync(settings: AppointmentSyncSettings): Promise<ApiResponse<{
    syncId: string;
    status: string;
    nextSync?: string;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/sync/enable`, settings);
  }

  async disableSync(): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/sync/disable`);
  }

  async triggerManualSync(): Promise<ApiResponse<{
    syncId: string;
    status: 'initiated' | 'in_progress' | 'completed' | 'failed';
    syncedEvents?: number;
    conflicts?: number;
    errors?: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/sync/manual`);
  }

  async getSyncStatus(): Promise<ApiResponse<{
    isEnabled: boolean;
    lastSync?: string;
    nextSync?: string;
    status: 'idle' | 'syncing' | 'error';
    syncedEvents: number;
    pendingConflicts: number;
    settings: AppointmentSyncSettings;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/sync/status`);
  }

  async getSyncHistory(
    limit = 10,
    offset = 0
  ): Promise<ApiResponse<{
    syncs: {
      id: string;
      startTime: string;
      endTime?: string;
      status: string;
      syncedEvents: number;
      conflicts: number;
      errors: string[];
    }[];
    total: number;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/sync/history?limit=${limit}&offset=${offset}`);
  }

  // Conflict resolution
  async getConflicts(): Promise<ApiResponse<{
    id: string;
    type: 'time_overlap' | 'duplicate_event' | 'update_conflict';
    appointmentId: string;
    calendarEventId: string;
    details: {
      companyEvent: any;
      calendarEvent: any;
      conflictReason: string;
    };
    suggestedResolution: string;
    createdAt: string;
  }[]>> {
    return apiClient.get(`${this.baseEndpoint}/conflicts`);
  }

  async resolveConflict(
    conflictId: string,
    resolution: 'use_company' | 'use_calendar' | 'merge' | 'create_new',
    customData?: any
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/conflicts/${conflictId}/resolve`, {
      resolution,
      customData
    });
  }

  async bulkResolveConflicts(
    conflicts: {
      conflictId: string;
      resolution: 'use_company' | 'use_calendar' | 'merge' | 'create_new';
    }[]
  ): Promise<ApiResponse<{
    resolved: number;
    failed: number;
    errors: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/conflicts/bulk-resolve`, {
      conflicts
    });
  }

  // Meeting links and video conferencing
  async createMeetingLink(eventId: string): Promise<ApiResponse<{
    meetingUrl: string;
    meetingId: string;
    joinUrl: string;
    dialIn?: {
      phoneNumber: string;
      accessCode: string;
    };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/events/${eventId}/meeting`);
  }

  async updateMeetingSettings(
    eventId: string,
    settings: {
      enableRecording?: boolean;
      allowExternalParticipants?: boolean;
      requireMeetingPassword?: boolean;
      enableWaitingRoom?: boolean;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseEndpoint}/events/${eventId}/meeting`, settings);
  }

  // Notifications and reminders
  async setCustomReminders(
    eventId: string,
    reminders: {
      method: 'email' | 'popup';
      minutes: number;
    }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseEndpoint}/events/${eventId}/reminders`, {
      reminders
    });
  }

  async sendCustomNotification(
    eventId: string,
    notification: {
      recipients: string[];
      subject: string;
      message: string;
      sendTime?: string; // ISO string, defaults to now
    }
  ): Promise<ApiResponse<{ notificationId: string }>> {
    return apiClient.post(`${this.baseEndpoint}/events/${eventId}/notify`, notification);
  }

  // Analytics and reporting
  async getCalendarUsageStats(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    totalEvents: number;
    appointmentEvents: number;
    averageEventDuration: number;
    busyTimePercentage: number;
    mostBusyDay: string;
    eventsByType: Record<string, number>;
    conflictRate: number;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/analytics/usage?startDate=${startDate}&endDate=${endDate}`);
  }

  async getSyncPerformanceMetrics(): Promise<ApiResponse<{
    averageSyncTime: number;
    successRate: number;
    lastWeekPerformance: {
      date: string;
      syncTime: number;
      eventsProcessed: number;
      errorCount: number;
    }[];
    commonIssues: {
      issue: string;
      frequency: number;
      resolution: string;
    }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/analytics/sync-performance`);
  }

  // Utility methods
  async validatePermissions(): Promise<ApiResponse<{
    hasCalendarAccess: boolean;
    hasEventAccess: boolean;
    canCreateEvents: boolean;
    canModifyEvents: boolean;
    canDeleteEvents: boolean;
    missingScopes: string[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/permissions/validate`);
  }

  async testConnection(): Promise<ApiResponse<{
    isConnected: boolean;
    canReadCalendars: boolean;
    canCreateEvents: boolean;
    responseTime: number;
    errors?: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/test-connection`);
  }

  async exportCalendarData(
    startDate: string,
    endDate: string,
    format: 'ics' | 'csv' | 'json' = 'ics',
    includePrivateEvents = false
  ): Promise<Blob> {
    const response = await fetch(`${apiClient.request}/integrations/google-calendar/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        startDate,
        endDate,
        format,
        includePrivateEvents
      })
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // Batch operations
  async batchCreateEvents(
    events: Omit<GoogleCalendarEvent, 'id'>[],
    calendarId = 'primary'
  ): Promise<ApiResponse<{
    created: { eventId: string; originalIndex: number }[];
    failed: { index: number; error: string }[];
    summary: { total: number; successful: number; failed: number };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/events/batch-create`, {
      events,
      calendarId
    });
  }

  async batchUpdateEvents(
    updates: {
      eventId: string;
      changes: Partial<GoogleCalendarEvent>;
    }[],
    calendarId = 'primary'
  ): Promise<ApiResponse<{
    updated: string[];
    failed: { eventId: string; error: string }[];
    summary: { total: number; successful: number; failed: number };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/events/batch-update`, {
      updates,
      calendarId
    });
  }

  async batchDeleteEvents(
    eventIds: string[],
    calendarId = 'primary',
    sendNotifications = true
  ): Promise<ApiResponse<{
    deleted: string[];
    failed: { eventId: string; error: string }[];
    summary: { total: number; successful: number; failed: number };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/events/batch-delete`, {
      eventIds,
      calendarId,
      sendNotifications
    });
  }

  // Advanced scheduling features
  async findOptimalMeetingTime(
    participants: string[],
    duration: number,
    preferences: {
      preferredTimeRanges?: { start: string; end: string }[];
      avoidTimeRanges?: { start: string; end: string }[];
      workingHours?: { start: string; end: string; timezone: string };
      maxSuggestions?: number;
      includeWeekends?: boolean;
    }
  ): Promise<ApiResponse<{
    suggestions: {
      start: string;
      end: string;
      confidence: number;
      participantAvailability: {
        email: string;
        status: 'available' | 'busy' | 'tentative' | 'unknown';
      }[];
    }[];
    alternativeTimes?: {
      start: string;
      end: string;
      note: string;
    }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/scheduling/find-optimal-time`, {
      participants,
      duration,
      preferences
    });
  }

  async scheduleWithConstraints(
    eventData: Omit<GoogleCalendarEvent, 'id'>,
    constraints: {
      mustAvoidConflicts: boolean;
      preferredBuffer: number; // minutes
      maxReschedulingAttempts: number;
      allowWeekends: boolean;
      timeZone: string;
    }
  ): Promise<ApiResponse<{
    scheduledEvent?: GoogleCalendarEvent;
    alternativeTimes?: { start: string; end: string; reason: string }[];
    conflicts?: { eventId: string; summary: string; overlap: string }[];
    warnings?: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/scheduling/schedule-with-constraints`, {
      eventData,
      constraints
    });
  }

  // Recurring events management
  async createRecurringAppointments(
    baseEvent: Omit<GoogleCalendarEvent, 'id'>,
    recurrence: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
      daysOfWeek?: number[]; // 0-6, Sunday=0
      endDate?: string;
      occurrences?: number;
    },
    exceptions?: string[] // dates to skip
  ): Promise<ApiResponse<{
    masterEventId: string;
    instanceIds: string[];
    skippedDates: string[];
    totalCreated: number;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/events/create-recurring`, {
      baseEvent,
      recurrence,
      exceptions
    });
  }

  async updateRecurringSeries(
    masterEventId: string,
    updates: Partial<GoogleCalendarEvent>,
    updateScope: 'this_only' | 'this_and_following' | 'all'
  ): Promise<ApiResponse<{
    updatedEvents: string[];
    affectedInstances: number;
  }>> {
    return apiClient.put(`${this.baseEndpoint}/events/recurring/${masterEventId}`, {
      updates,
      updateScope
    });
  }

  async deleteRecurringSeries(
    masterEventId: string,
    deleteScope: 'this_only' | 'this_and_following' | 'all'
  ): Promise<ApiResponse<{
    deletedEvents: string[];
    affectedInstances: number;
  }>> {
    return apiClient.delete(`${this.baseEndpoint}/events/recurring/${masterEventId}`, {
      body: { deleteScope }
    });
  }

  // Integration health monitoring
  async getIntegrationHealth(): Promise<ApiResponse<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    lastError?: string;
    metrics: {
      apiCallsToday: number;
      successRate: number;
      averageResponseTime: number;
      quotaUsage: {
        used: number;
        limit: number;
        resetTime: string;
      };
    };
    recommendations?: string[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/health`);
  }

  async getQuotaStatus(): Promise<ApiResponse<{
    daily: { used: number; limit: number; resetTime: string };
    perUserPer100Seconds: { used: number; limit: number; resetTime: string };
    warnings: string[];
    estimatedTimeToReset: number;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/quota-status`);
  }

  // Error handling and recovery
  async retryFailedOperations(): Promise<ApiResponse<{
    retriedOperations: number;
    successfulRetries: number;
    stillFailing: {
      operationId: string;
      error: string;
      retryCount: number;
    }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/retry-failed`);
  }

  async getFailedOperations(): Promise<ApiResponse<{
    operations: {
      id: string;
      type: string;
      failedAt: string;
      error: string;
      retryCount: number;
      canRetry: boolean;
      originalData: any;
    }[];
    total: number;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/failed-operations`);
  }
}

// Helper functions for common calendar operations
export const GoogleCalendarHelpers = {
  // Format date for Google Calendar API
  formatDateTime: (date: Date, timeZone?: string): string => {
    const isoString = date.toISOString();
    return timeZone ? `${isoString.replace('Z', '')}${timeZone}` : isoString;
  },

  // Parse Google Calendar date
  parseDateTime: (dateTimeString: string): Date => {
    return new Date(dateTimeString);
  },

  // Create standard appointment event
  createAppointmentEvent: (
    title: string,
    startTime: Date,
    endTime: Date,
    options?: {
      description?: string;
      location?: string;
      attendees?: string[];
      timeZone?: string;
      reminders?: number[]; // minutes before
      meetingEnabled?: boolean;
    }
  ): Omit<GoogleCalendarEvent, 'id'> => {
    const event: Omit<GoogleCalendarEvent, 'id'> = {
      summary: title,
      start: {
        dateTime: GoogleCalendarHelpers.formatDateTime(startTime, options?.timeZone),
        timeZone: options?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: GoogleCalendarHelpers.formatDateTime(endTime, options?.timeZone),
        timeZone: options?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    if (options?.description) {
      event.description = options.description;
    }

    if (options?.location) {
      event.location = options.location;
    }

    if (options?.attendees?.length) {
      event.attendees = options.attendees.map(email => ({ email }));
    }

    if (options?.reminders?.length) {
      event.reminders = {
        useDefault: false,
        overrides: options.reminders.map(minutes => ({
          method: 'email' as const,
          minutes
        }))
      };
    }

    if (options?.meetingEnabled) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet_${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      };
    }

    return event;
  },

  // Validate event data
  validateEvent: (event: Partial<GoogleCalendarEvent>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!event.summary?.trim()) {
      errors.push('Event title is required');
    }

    if (!event.start?.dateTime) {
      errors.push('Start time is required');
    }

    if (!event.end?.dateTime) {
      errors.push('End time is required');
    }

    if (event.start?.dateTime && event.end?.dateTime) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      
      if (start >= end) {
        errors.push('End time must be after start time');
      }
    }

    if (event.attendees?.some(attendee => !attendee.email?.includes('@'))) {
      errors.push('All attendees must have valid email addresses');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Check for time conflicts
  checkTimeConflict: (
    newEvent: { start: string; end: string },
    existingEvents: { start: string; end: string }[]
  ): boolean => {
    const newStart = new Date(newEvent.start);
    const newEnd = new Date(newEvent.end);

    return existingEvents.some(existing => {
      const existingStart = new Date(existing.start);
      const existingEnd = new Date(existing.end);

      return (
        (newStart < existingEnd && newEnd > existingStart) // Overlap check
      );
    });
  },

  // Calculate event duration
  calculateDuration: (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60); // Returns minutes
  },

  // Generate recurring event instances
  generateRecurringInstances: (
    baseEvent: Omit<GoogleCalendarEvent, 'id'>,
    recurrence: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      count: number;
    }
  ): Omit<GoogleCalendarEvent, 'id'>[] => {
    const instances: Omit<GoogleCalendarEvent, 'id'>[] = [];
    const startDate = new Date(baseEvent.start.dateTime);
    const endDate = new Date(baseEvent.end.dateTime);
    const duration = endDate.getTime() - startDate.getTime();

    for (let i = 0; i < recurrence.count; i++) {
      const instanceStart = new Date(startDate);
      
      switch (recurrence.frequency) {
        case 'daily':
          instanceStart.setDate(startDate.getDate() + (i * recurrence.interval));
          break;
        case 'weekly':
          instanceStart.setDate(startDate.getDate() + (i * recurrence.interval * 7));
          break;
        case 'monthly':
          instanceStart.setMonth(startDate.getMonth() + (i * recurrence.interval));
          break;
      }

      const instanceEnd = new Date(instanceStart.getTime() + duration);

      instances.push({
        ...baseEvent,
        start: {
          ...baseEvent.start,
          dateTime: instanceStart.toISOString()
        },
        end: {
          ...baseEvent.end,
          dateTime: instanceEnd.toISOString()
        }
      });
    }

    return instances;
  }
};

// Error types specific to Google Calendar integration
export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public quotaExceeded?: boolean
  ) {
    super(message);
    this.name = 'GoogleCalendarError';
  }
}

// Singleton instance
export const googleCalendarService = new GoogleCalendarService();

// Export types
export type {
    AppointmentSyncSettings, CalendarIntegrationConfig, GoogleCalendar, GoogleCalendarEvent
};

// Default export
export default googleCalendarService;