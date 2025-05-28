import { apiClient, ApiResponse } from '../../api';

interface OutlookEvent {
  id?: string;
  subject: string;
  body?: { content: string; contentType: 'HTML' | 'Text' };
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: { displayName: string };
  attendees?: { emailAddress: { address: string; name?: string } }[];
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: 'teamsForBusiness';
}

interface OutlookCalendar {
  id: string;
  name: string;
  color: string;
  isDefaultCalendar: boolean;
  canEdit: boolean;
  owner: { name: string; address: string };
}

class OutlookCalendarService {
  private baseEndpoint = '/integrations/outlook-calendar';
  private accessToken: string | null = null;

  // Authentication
  async initialize(config: { tenantId: string; clientId: string; redirectUri: string }): Promise<ApiResponse<{ authUrl: string }>> {
    return apiClient.post(`${this.baseEndpoint}/initialize`, config);
  }

  async completeAuth(authCode: string): Promise<ApiResponse<{ accessToken: string; userEmail: string }>> {
    const response = await apiClient.post(`${this.baseEndpoint}/auth`, { authCode });
    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
    }
    return response;
  }

  async disconnect(): Promise<ApiResponse<void>> {
    this.accessToken = null;
    return apiClient.post(`${this.baseEndpoint}/disconnect`);
  }

  // Calendar operations
  async getCalendars(): Promise<ApiResponse<OutlookCalendar[]>> {
    return apiClient.get(`${this.baseEndpoint}/calendars`);
  }

  async createEvent(event: Omit<OutlookEvent, 'id'>, calendarId = 'primary'): Promise<ApiResponse<OutlookEvent>> {
    return apiClient.post(`${this.baseEndpoint}/events`, { ...event, calendarId });
  }

  async updateEvent(eventId: string, updates: Partial<OutlookEvent>): Promise<ApiResponse<OutlookEvent>> {
    return apiClient.put(`${this.baseEndpoint}/events/${eventId}`, updates);
  }

  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/events/${eventId}`);
  }

  async getEvents(startTime: string, endTime: string): Promise<ApiResponse<OutlookEvent[]>> {
    return apiClient.get(`${this.baseEndpoint}/events?start=${startTime}&end=${endTime}`);
  }

  // Availability
  async checkAvailability(userEmails: string[], startTime: string, endTime: string): Promise<ApiResponse<{
    user: string;
    freeBusyViewType: 'free' | 'busy' | 'tentative' | 'outOfOffice';
    availability: { start: string; end: string; status: string }[];
  }[]>> {
    return apiClient.post(`${this.baseEndpoint}/availability`, { userEmails, startTime, endTime });
  }

  async findMeetingTimes(participants: string[], duration: number, maxSuggestions = 5): Promise<ApiResponse<{
    start: string;
    end: string;
    confidence: number;
    attendeeAvailability: { attendee: string; availability: string }[];
  }[]>> {
    return apiClient.post(`${this.baseEndpoint}/find-meeting-times`, {
      participants: participants.map(email => ({ emailAddress: { address: email } })),
      timeConstraint: { maxCandidates: maxSuggestions },
      meetingDuration: `PT${duration}M`
    });
  }

  // Teams integration
  async createTeamsMeeting(event: Omit<OutlookEvent, 'id'>): Promise<ApiResponse<OutlookEvent & {
    onlineMeeting: { joinUrl: string; conferenceId: string; dialInUrl: string };
  }>> {
    return apiClient.post(`${this.baseEndpoint}/teams-meeting`, {
      ...event,
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    });
  }

  // Sync management
  async enableSync(settings: { syncDirection: 'one_way' | 'two_way'; conflictResolution: string }): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/sync/enable`, settings);
  }

  async getSyncStatus(): Promise<ApiResponse<{ enabled: boolean; lastSync: string; status: string }>> {
    return apiClient.get(`${this.baseEndpoint}/sync/status`);
  }

  async triggerSync(): Promise<ApiResponse<{ syncId: string; status: string }>> {
    return apiClient.post(`${this.baseEndpoint}/sync/trigger`);
  }
}

export const outlookCalendarService = new OutlookCalendarService();
export default outlookCalendarService;