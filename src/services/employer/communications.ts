import { apiClient, ApiResponse, RequestInterceptor } from '../api';

// Communication types
interface Message {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'reminder' | 'alert' | 'newsletter' | 'campaign';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
  scheduledFor?: string;
  createdBy: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'health_awareness' | 'benefits_enrollment' | 'wellness_challenge' | 'preventative_care';
  status: 'planning' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetAudience: AudienceFilter;
  messages: CampaignMessage[];
  metrics: CampaignMetrics;
}

interface CampaignMessage {
  id: string;
  subject: string;
  content: string;
  scheduledDate: string;
  channels: DeliveryChannel[];
  personalizations: PersonalizationRule[];
}

interface AudienceFilter {
  departments?: string[];
  roles?: string[];
  locations?: string[];
  ageGroups?: string[];
  healthRiskLevels?: string[];
  engagementLevels?: string[];
  includeAll: boolean;
  exclusions?: string[];
}

interface DeliveryChannel {
  type: 'email' | 'sms' | 'push' | 'in_app' | 'portal';
  config: Record<string, any>;
  enabled: boolean;
  priority: number;
}

interface PersonalizationRule {
  field: string;
  source: 'profile' | 'health_data' | 'benefits' | 'engagement';
  defaultValue?: string;
}

interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  responded: number;
  unsubscribed: number;
  bounced: number;
  conversionRate: number;
  engagementScore: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subject: string;
  content: string;
  variables: TemplateVariable[];
  channels: DeliveryChannel[];
  isActive: boolean;
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  description: string;
  required: boolean;
  defaultValue?: any;
}

interface ScheduledNotification {
  id: string;
  templateId: string;
  audience: AudienceFilter;
  scheduledDate: string;
  recurrence?: RecurrenceRule;
  variables: Record<string, any>;
  status: 'pending' | 'processing' | 'sent' | 'failed';
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: string;
  maxOccurrences?: number;
}

interface BulkMessageRequest {
  templateId?: string;
  subject: string;
  content: string;
  audience: AudienceFilter;
  channels: DeliveryChannel[];
  scheduledDate?: string;
  personalizations?: Record<string, any>;
}

interface MessageAnalytics {
  messageId: string;
  sentCount: number;
  deliveredCount: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  deliveryBreakdown: {
    channel: string;
    sent: number;
    delivered: number;
    failed: number;
  }[];
  audienceBreakdown: {
    department: string;
    sent: number;
    engagement: number;
  }[];
  timeSeriesData: {
    date: string;
    opens: number;
    clicks: number;
  }[];
}

class CommunicationService {
  private baseEndpoint = '/communications';

  // Message management
  async createMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<ApiResponse<Message>> {
    return apiClient.post(`${this.baseEndpoint}/messages`, message, 
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<ApiResponse<Message>> {
    return apiClient.put(`${this.baseEndpoint}/messages/${id}`, updates);
  }

  async deleteMessage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/messages/${id}`);
  }

  async getMessages(filters?: {
    type?: Message['type'];
    status?: Message['status'];
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ messages: Message[]; total: number }>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiClient.get(`${this.baseEndpoint}/messages?${params}`);
  }

  async getMessage(id: string): Promise<ApiResponse<Message>> {
    return apiClient.get(`${this.baseEndpoint}/messages/${id}`);
  }

  // Campaign management
  async createCampaign(campaign: Omit<Campaign, 'id' | 'metrics'>): Promise<ApiResponse<Campaign>> {
    return apiClient.post(`${this.baseEndpoint}/campaigns`, campaign,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    return apiClient.put(`${this.baseEndpoint}/campaigns/${id}`, updates);
  }

  async deleteCampaign(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/campaigns/${id}`);
  }

  async getCampaigns(status?: Campaign['status']): Promise<ApiResponse<Campaign[]>> {
    const params = status ? `?status=${status}` : '';
    return apiClient.get(`${this.baseEndpoint}/campaigns${params}`);
  }

  async getCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return apiClient.get(`${this.baseEndpoint}/campaigns/${id}`);
  }

  async launchCampaign(id: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/campaigns/${id}/launch`);
  }

  async pauseCampaign(id: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/campaigns/${id}/pause`);
  }

  async resumeCampaign(id: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/campaigns/${id}/resume`);
  }

  // Template management
  async createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.post(`${this.baseEndpoint}/templates`, template);
  }

  async updateTemplate(id: string, updates: Partial<NotificationTemplate>): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.put(`${this.baseEndpoint}/templates/${id}`, updates);
  }

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/templates/${id}`);
  }

  async getTemplates(category?: string): Promise<ApiResponse<NotificationTemplate[]>> {
    const params = category ? `?category=${category}` : '';
    return apiClient.get(`${this.baseEndpoint}/templates${params}`);
  }

  async getTemplate(id: string): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.get(`${this.baseEndpoint}/templates/${id}`);
  }

  async previewTemplate(id: string, variables: Record<string, any>): Promise<ApiResponse<{ subject: string; content: string }>> {
    return apiClient.post(`${this.baseEndpoint}/templates/${id}/preview`, { variables });
  }

  // Bulk messaging
  async sendBulkMessage(request: BulkMessageRequest): Promise<ApiResponse<{ messageId: string; estimatedDelivery: string }>> {
    return apiClient.post(`${this.baseEndpoint}/bulk-send`, request,
      RequestInterceptor.addHIPAAHeaders({})
    );
  }

  async sendTargetedReminder(
    audience: AudienceFilter,
    reminderType: 'appointment' | 'benefits_deadline' | 'health_screening' | 'wellness_activity',
    customMessage?: string
  ): Promise<ApiResponse<{ messageId: string }>> {
    return apiClient.post(`${this.baseEndpoint}/targeted-reminder`, {
      audience,
      reminderType,
      customMessage
    }, RequestInterceptor.addHIPAAHeaders({}));
  }

  // Scheduled notifications
  async scheduleNotification(notification: Omit<ScheduledNotification, 'id' | 'status'>): Promise<ApiResponse<ScheduledNotification>> {
    return apiClient.post(`${this.baseEndpoint}/scheduled`, notification);
  }

  async updateScheduledNotification(id: string, updates: Partial<ScheduledNotification>): Promise<ApiResponse<ScheduledNotification>> {
    return apiClient.put(`${this.baseEndpoint}/scheduled/${id}`, updates);
  }

  async deleteScheduledNotification(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/scheduled/${id}`);
  }

  async getScheduledNotifications(status?: ScheduledNotification['status']): Promise<ApiResponse<ScheduledNotification[]>> {
    const params = status ? `?status=${status}` : '';
    return apiClient.get(`${this.baseEndpoint}/scheduled${params}`);
  }

  // Analytics and reporting
  async getMessageAnalytics(messageId: string): Promise<ApiResponse<MessageAnalytics>> {
    return apiClient.get(`${this.baseEndpoint}/analytics/messages/${messageId}`);
  }

  async getCampaignAnalytics(campaignId: string): Promise<ApiResponse<CampaignMetrics & {
    messageAnalytics: MessageAnalytics[];
    audienceInsights: any;
    performanceTrends: any;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/analytics/campaigns/${campaignId}`);
  }

  async getCommunicationOverview(timeframe: '7d' | '30d' | '90d' | '1y'): Promise<ApiResponse<{
    totalMessages: number;
    deliveryRate: number;
    engagementRate: number;
    unsubscribeRate: number;
    topPerformingChannels: { channel: string; engagement: number }[];
    recentActivity: { date: string; sent: number; engagement: number }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/analytics/overview?timeframe=${timeframe}`);
  }

  async exportCommunicationReport(
    reportType: 'campaign' | 'message' | 'audience' | 'engagement',
    filters: {
      startDate?: string;
      endDate?: string;
      campaignIds?: string[];
      messageIds?: string[];
    },
    format: 'csv' | 'excel' | 'pdf'
  ): Promise<Blob> {
    const response = await fetch(`${apiClient.request}${this.baseEndpoint}/analytics/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ reportType, filters, format })
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // Audience management
  async getAudienceSize(filter: AudienceFilter): Promise<ApiResponse<{ estimatedSize: number; breakdown: Record<string, number> }>> {
    return apiClient.post(`${this.baseEndpoint}/audience/size`, { filter },
      RequestInterceptor.addAnonymization('full')({})
    );
  }

  async validateAudience(filter: AudienceFilter): Promise<ApiResponse<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/audience/validate`, { filter });
  }

  async getAudienceInsights(filter: AudienceFilter): Promise<ApiResponse<{
    demographics: Record<string, any>;
    healthMetrics: Record<string, any>;
    engagementPatterns: Record<string, any>;
    preferredChannels: { channel: string; preference: number }[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/audience/insights`, { filter },
      RequestInterceptor.addAnonymization('full')({})
    );
  }

  // Channel management
  async getAvailableChannels(): Promise<ApiResponse<{
    channels: { type: string; name: string; capabilities: string[]; isEnabled: boolean }[];
  }>> {
    return apiClient.get(`${this.baseEndpoint}/channels`);
  }

  async updateChannelConfig(
    channelType: string,
    config: Record<string, any>
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseEndpoint}/channels/${channelType}`, { config });
  }

  async testChannel(
    channelType: string,
    testMessage: { subject: string; content: string; recipient: string }
  ): Promise<ApiResponse<{ success: boolean; details: string }>> {
    return apiClient.post(`${this.baseEndpoint}/channels/${channelType}/test`, testMessage);
  }

  // Opt-in/opt-out management
  async getSubscriptionPreferences(userId: string): Promise<ApiResponse<{
    userId: string;
    preferences: { channel: string; enabled: boolean; frequency: string }[];
    globalOptOut: boolean;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/preferences/${userId}`);
  }

  async updateSubscriptionPreferences(
    userId: string,
    preferences: { channel: string; enabled: boolean; frequency?: string }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseEndpoint}/preferences/${userId}`, { preferences });
  }

  async processOptOut(
    userId: string,
    optOutType: 'global' | 'channel',
    channel?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/opt-out`, {
      userId,
      optOutType,
      channel
    });
  }

  async getOptOutList(
    timeframe?: { start: string; end: string }
  ): Promise<ApiResponse<{
    optOuts: { userId: string; date: string; type: string; reason?: string }[];
    summary: { total: number; byChannel: Record<string, number> };
  }>> {
    const params = new URLSearchParams();
    if (timeframe) {
      params.append('start', timeframe.start);
      params.append('end', timeframe.end);
    }
    
    return apiClient.get(`${this.baseEndpoint}/opt-outs?${params}`);
  }

  // Automated workflows
  async createWorkflow(workflow: {
    name: string;
    description: string;
    trigger: {
      type: 'event' | 'schedule' | 'condition';
      config: Record<string, any>;
    };
    actions: {
      type: 'send_message' | 'update_data' | 'schedule_followup';
      config: Record<string, any>;
      delay?: number;
    }[];
    isActive: boolean;
  }): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post(`${this.baseEndpoint}/workflows`, workflow);
  }

  async getWorkflows(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseEndpoint}/workflows`);
  }

  async updateWorkflow(id: string, updates: any): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseEndpoint}/workflows/${id}`, updates);
  }

  async deleteWorkflow(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseEndpoint}/workflows/${id}`);
  }

  // Real-time communication
  async sendImmediateAlert(
    audience: AudienceFilter,
    alert: {
      title: string;
      message: string;
      severity: 'info' | 'warning' | 'critical';
      actionUrl?: string;
    }
  ): Promise<ApiResponse<{ messageId: string; sentCount: number }>> {
    return apiClient.post(`${this.baseEndpoint}/immediate-alert`, {
      audience,
      alert
    }, RequestInterceptor.addHIPAAHeaders({}));
  }

  async broadcastSystemMessage(
    message: string,
    channels: string[] = ['in_app', 'push']
  ): Promise<ApiResponse<{ broadcastId: string }>> {
    return apiClient.post(`${this.baseEndpoint}/broadcast`, {
      message,
      channels
    });
  }

  // Compliance and privacy
  async getCommunicationAuditLog(
    filters?: {
      startDate?: string;
      endDate?: string;
      userId?: string;
      messageType?: string;
    }
  ): Promise<ApiResponse<{
    logs: {
      id: string;
      timestamp: string;
      action: string;
      userId: string;
      messageId?: string;
      details: Record<string, any>;
    }[];
    total: number;
  }>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    return apiClient.get(`${this.baseEndpoint}/audit-log?${params}`);
  }

  async anonymizeOldCommunications(
    cutoffDate: string,
    communicationType?: 'campaign' | 'message' | 'all'
  ): Promise<ApiResponse<{ anonymizedCount: number; details: string }>> {
    return apiClient.post(`${this.baseEndpoint}/anonymize`, {
      cutoffDate,
      communicationType
    }, RequestInterceptor.addHIPAAHeaders({}));
  }

  async getDataRetentionStatus(): Promise<ApiResponse<{
    policies: {
      type: string;
      retentionPeriod: number;
      lastCleanup: string;
      nextCleanup: string;
    }[];
    totalDataSize: string;
    complianceStatus: 'compliant' | 'warning' | 'violation';
  }>> {
    return apiClient.get(`${this.baseEndpoint}/data-retention`);
  }

  // Advanced features
  async getPersonalizationSuggestions(
    audience: AudienceFilter,
    messageType: string
  ): Promise<ApiResponse<{
    suggestions: {
      field: string;
      values: string[];
      effectiveness: number;
    }[];
    bestPractices: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/personalization-suggestions`, {
      audience,
      messageType
    }, RequestInterceptor.addAnonymization('partial')({}));
  }

  async optimizeDeliveryTiming(
    audience: AudienceFilter,
    messageType: string
  ): Promise<ApiResponse<{
    recommendedTimes: {
      dayOfWeek: string;
      hour: number;
      timezone: string;
      expectedEngagement: number;
    }[];
    reasoning: string;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/optimize-timing`, {
      audience,
      messageType
    }, RequestInterceptor.addAnonymization('full')({}));
  }

  async getEngagementPredictions(
    messageConfig: {
      subject: string;
      content: string;
      audience: AudienceFilter;
      channels: string[];
    }
  ): Promise<ApiResponse<{
    predictions: {
      channel: string;
      estimatedOpenRate: number;
      estimatedClickRate: number;
      confidence: number;
    }[];
    improvements: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/engagement-predictions`, messageConfig,
      RequestInterceptor.addAnonymization('full')({})
    );
  }

  // Integration helpers
  async connectExternalChannel(
    channelType: 'slack' | 'teams' | 'webhook' | 'custom',
    config: {
      name: string;
      endpoint?: string;
      credentials?: Record<string, string>;
      settings?: Record<string, any>;
    }
  ): Promise<ApiResponse<{ channelId: string; testResult: boolean }>> {
    return apiClient.post(`${this.baseEndpoint}/integrations/channels`, {
      channelType,
      config
    });
  }

  async syncWithHRIS(
    hrisType: 'workday' | 'bamboohr' | 'adp' | 'custom',
    syncConfig?: Record<string, any>
  ): Promise<ApiResponse<{
    syncId: string;
    status: 'initiated' | 'in_progress' | 'completed' | 'failed';
    recordsProcessed?: number;
    errors?: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/integrations/hris-sync`, {
      hrisType,
      syncConfig
    });
  }

  // Utility methods
  async validateMessageContent(
    content: string,
    contentType: 'html' | 'plain' | 'markdown'
  ): Promise<ApiResponse<{
    isValid: boolean;
    issues: { type: string; message: string; severity: string }[];
    suggestions: string[];
    readabilityScore?: number;
  }>> {
    return apiClient.post(`${this.baseEndpoint}/validate-content`, {
      content,
      contentType
    });
  }

  async getMessageDeliverability(
    subject: string,
    content: string,
    senderInfo: { name: string; email: string }
  ): Promise<ApiResponse<{
    score: number;
    factors: {
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      weight: number;
      recommendation?: string;
    }[];
    overallRating: 'excellent' | 'good' | 'fair' | 'poor';
  }>> {
    return apiClient.post(`${this.baseEndpoint}/deliverability-check`, {
      subject,
      content,
      senderInfo
    });
  }

  async getComplianceCheck(
    content: string,
    audience: AudienceFilter,
    messageType: string
  ): Promise<ApiResponse<{
    complianceStatus: 'compliant' | 'warning' | 'violation';
    checks: {
      regulation: string;
      status: 'pass' | 'warning' | 'fail';
      details: string;
      requiredActions?: string[];
    }[];
    recommendations: string[];
  }>> {
    return apiClient.post(`${this.baseEndpoint}/compliance-check`, {
      content,
      audience,
      messageType
    }, RequestInterceptor.addHIPAAHeaders({}));
  }
}

// Singleton instance
export const communicationService = new CommunicationService();

// Helper functions for common communication patterns
export const CommunicationHelpers = {
  // Create standard health reminder
  createHealthReminder: (
    reminderType: 'annual_physical' | 'dental_checkup' | 'vision_exam' | 'mammogram' | 'colonoscopy',
    dueDate: string,
    customMessage?: string
  ) => ({
    type: 'reminder' as const,
    priority: 'medium' as const,
    title: `Health Reminder: ${reminderType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Due`,
    content: customMessage || `Your ${reminderType.replace('_', ' ')} is due on ${dueDate}. Schedule your appointment today to stay on top of your preventative care.`,
    channels: [
      { type: 'email' as const, enabled: true, priority: 1 },
      { type: 'in_app' as const, enabled: true, priority: 2 }
    ]
  }),

  // Create benefits enrollment reminder
  createBenefitsReminder: (
    enrollmentDeadline: string,
    benefitsYear: string
  ) => ({
    type: 'reminder' as const,
    priority: 'high' as const,
    title: `Action Required: Benefits Enrollment Deadline ${enrollmentDeadline}`,
    content: `Don't miss out! Your benefits enrollment for ${benefitsYear} must be completed by ${enrollmentDeadline}. Review your options and make your selections in the benefits portal.`,
    channels: [
      { type: 'email' as const, enabled: true, priority: 1 },
      { type: 'push' as const, enabled: true, priority: 2 },
      { type: 'in_app' as const, enabled: true, priority: 3 }
    ]
  }),

  // Create wellness challenge announcement
  createWellnessAnnouncement: (
    challengeName: string,
    startDate: string,
    endDate: string,
    reward?: string
  ) => ({
    type: 'announcement' as const,
    priority: 'medium' as const,
    title: `New Wellness Challenge: ${challengeName}`,
    content: `Join us for the ${challengeName} challenge from ${startDate} to ${endDate}! ${reward ? `Complete the challenge and earn ${reward}.` : ''} Sign up in your wellness portal today.`,
    channels: [
      { type: 'email' as const, enabled: true, priority: 1 },
      { type: 'in_app' as const, enabled: true, priority: 2 }
    ]
  }),

  // Create urgent health alert
  createHealthAlert: (
    alertType: 'outbreak' | 'recall' | 'emergency' | 'policy_change',
    message: string,
    actionRequired?: string
  ) => ({
    type: 'alert' as const,
    priority: 'urgent' as const,
    title: `Health Alert: ${alertType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    content: `${message}${actionRequired ? ` Action required: ${actionRequired}` : ''}`,
    channels: [
      { type: 'push' as const, enabled: true, priority: 1 },
      { type: 'email' as const, enabled: true, priority: 2 },
      { type: 'sms' as const, enabled: true, priority: 3 },
      { type: 'in_app' as const, enabled: true, priority: 4 }
    ]
  }),

  // Standard audience filters
  audienceFilters: {
    allEmployees: (): AudienceFilter => ({
      includeAll: true
    }),

    department: (departments: string[]): AudienceFilter => ({
      departments,
      includeAll: false
    }),

    highRisk: (): AudienceFilter => ({
      healthRiskLevels: ['high'],
      includeAll: false
    }),

    lowEngagement: (): AudienceFilter => ({
      engagementLevels: ['low'],
      includeAll: false
    }),

    newEmployees: (months: number = 3): AudienceFilter => ({
      // This would be calculated server-side based on hire date
      includeAll: false
    }),

    benefitsEligible: (benefitType?: string): AudienceFilter => ({
      // This would be filtered server-side based on benefits eligibility
      includeAll: false
    })
  },

  // Message personalization helpers
  personalization: {
    addUserName: (): PersonalizationRule => ({
      field: 'firstName',
      source: 'profile',
      defaultValue: 'Team Member'
    }),

    addDepartment: (): PersonalizationRule => ({
      field: 'department',
      source: 'profile',
      defaultValue: 'your department'
    }),

    addHealthScore: (): PersonalizationRule => ({
      field: 'healthScore',
      source: 'health_data',
      defaultValue: 'your current'
    }),

    addBenefitsStatus: (): PersonalizationRule => ({
      field: 'benefitsStatus',
      source: 'benefits',
      defaultValue: 'your benefits'
    })
  }
};

// Export types
export type {
    AudienceFilter, BulkMessageRequest, Campaign,
    CampaignMessage, CampaignMetrics, DeliveryChannel, Message, MessageAnalytics, NotificationTemplate, PersonalizationRule, RecurrenceRule, ScheduledNotification, TemplateVariable
};

// Default export
export default communicationService;