import { apiClient, ApiResponse } from '../../api';

interface AppleEvent {
  id?: string;
  title: string;
  notes?: string;
  startDate: string;
  endDate: string;
  location?: string;
  url?: string;
  allDay?: boolean;
  timeZone?: string;
  attendees?: string[];
  alarms?: { trigger: number }[]; // minutes before
}

interface AppleCalendar {
  id: string;
  title: string;
  type: 'Local' | 'CalDAV' | 'Exchange' | 'Subscription';
  color: string;
  allowsContentModifications: boolean;
}

class AppleCalendarService {
  private baseEndpoint = '/integrations/apple-calendar';
  private isConnected = false;

  // Note: Apple Calendar uses CalDAV protocol, no OAuth like others
  async initialize(config: {
    serverUrl: string;
    username: string;
    password: string;
    caldavPath?: string;
  }): Promise<ApiResponse<{ calendars: AppleCalendar[] }>> {
    const response = await apiClient.post(`${this.baseEndpoint}/initialize`, config);
    if (response.success) {
      this.isConnected = true;
    }
    return response;
  }

  async testConnection(): Promise<ApiResponse<{ connected: boolean; serverInfo: any }>> {
    return apiClient.get(`${this.baseEndpoint}/test-connection`);
  }

  async disconnect(): Promise<ApiResponse<void>> {
    this.isConnected = false;
    return apiClient.post(`${this.baseEndpoint}/disconnect`);
  }

  // Calendar operations
  async getCalendars(): Promise<ApiResponse<AppleCalendar[]>> {
    return apiClient.get(`${this.baseEndpoint}/calendars`);
  }

  async createEvent(event: Omit<AppleEvent, 'id'>, calendarId?: string): Promise<ApiResponse<AppleEvent>> {
    return apiClient.post(`${this.baseEndpoint}/events`, { ...event, calendarId });
  }

  async updateEvent(eventId: string, updates: Partial<AppleEvent>, calendarId?: string): Promise<ApiResponse<AppleEvent>> {
    return apiClient.put(`${this.baseEndpoint}/events/${eventId}`, { ...updates, calendarId });
  }

  async deleteEvent(eventId: string, calendarId?: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/events/${eventId}?calendarId=${calendarId || ''}`);
  }

  async getEvents(startDate: string, endDate: string, calendarId?: string): Promise<ApiResponse<AppleEvent[]>> {
    const params = new URLSearchParams({ startDate, endDate });
    if (calendarId) params.append('calendarId', calendarId);
    return apiClient.get(`${this.baseEndpoint}/events?${params}`);
  }

  // Availability (limited compared to other providers)
  async checkBusyTimes(startDate: string, endDate: string, calendarIds?: string[]): Promise<ApiResponse<{
    busyTimes: { start: string; end: string; calendar: string }[];
    freeTimes: { start: string; end: string }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/busy-times`, {
      startDate,
      endDate,
      calendarIds: calendarIds || []
    });
  }

  async findAvailableSlots(
    startDate: string,
    endDate: string,
    duration: number,
    options?: { businessHours?: { start: string; end: string }; excludeWeekends?: boolean }
  ): Promise<ApiResponse<{ start: string; end: string }[]>> {
    return apiClient.post(`${this.baseEndpoint}/available-slots`, {
      startDate,
      endDate,
      duration,
      ...options
    });
  }

  // Sync operations
  async enableSync(settings: {
    syncInterval: number; // minutes
    conflictResolution: 'server_wins' | 'client_wins' | 'newest_wins';
    syncDirection: 'up' | 'down' | 'both';
  }): Promise<ApiResponse<{ syncId: string }>> {
    return apiClient.post(`${this.baseEndpoint}/sync/enable`, settings);
  }

  async disableSync(): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/sync/disable`);
  }

  async getSyncStatus(): Promise<ApiResponse<{
    enabled: boolean;
    lastSync: string;
    nextSync: string;
    status: 'idle' | 'syncing' | 'error';
    errors?: string[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/sync/status`);
  }

  async manualSync(calendarIds?: string[]): Promise<ApiResponse<{
    syncId: string;
    eventsProcessed: number;
    conflicts: number;
    errors: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/sync/manual`, { calendarIds });
  }

  // Export/Import
  async exportEvents(
    startDate: string,
    endDate: string,
    format: 'ics' | 'json' = 'ics'
  ): Promise<Blob> {
    const response = await fetch(`${apiClient.request}/integrations/apple-calendar/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ startDate, endDate, format })
    });
    return await response.blob();
  }

  async importEvents(icsData: string, calendarId?: string): Promise<ApiResponse<{
    imported: number;
    skipped: number;
    errors: string[];
    eventIds: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/import`, { icsData, calendarId });
  }

  // Reminders and alarms
  async setEventReminders(eventId: string, reminders: { minutes: number; type?: 'display' | 'email' }[]): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseEndpoint}/events/${eventId}/reminders`, { reminders });
  }

  // Calendar sharing (if supported by server)
  async shareCalendar(calendarId: string, userEmail: string, permission: 'read' | 'write'): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/calendars/${calendarId}/share`, {
      userEmail,
      permission
    });
  }

  async getCalendarPermissions(calendarId: string): Promise<ApiResponse<{
    owner: string;
    shares: { user: string; permission: string }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/calendars/${calendarId}/permissions`);
  }
}

// Helper functions
export const AppleCalendarHelpers = {
  createICSEvent: (event: AppleEvent): string => {
    const formatDate = (date: string) => new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return [
      'BEGIN:VEVENT',
      `UID:${event.id || Date.now()}@BenefitMetrics.com`,
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${event.title}`,
      event.notes ? `DESCRIPTION:${event.notes.replace(/\n/g, '\\n')}` : '',
      event.location ? `LOCATION:${event.location}` : '',
      'END:VEVENT'
    ].filter(Boolean).join('\n');
  },

  parseICSEvent: (icsLine: string): Partial<AppleEvent> => {
    const lines = icsLine.split('\n');
    const event: Partial<AppleEvent> = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':');
      switch (key) {
        case 'SUMMARY':
          event.title = value;
          break;
        case 'DTSTART':
          event.startDate = new Date(value.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')).toISOString();
          break;
        case 'DTEND':
          event.endDate = new Date(value.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')).toISOString();
          break;
        case 'DESCRIPTION':
          event.notes = value.replace(/\\n/g, '\n');
          break;
        case 'LOCATION':
          event.location = value;
          break;
      }
    });
    
    return event;
  },

  validateCalDAVUrl: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol) && parsed.pathname.includes('caldav');
    } catch {
      return false;
    }
  }
};

export const appleCalendarService = new AppleCalendarService();
export default appleCalendarService;