// Lead capture and management service

export interface LeadData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  phone?: string;
  employeeCount?: number;
  industry?: string;
  interests?: string[];
  source: string;
  campaign?: string;
  referrer?: string;
  capturedAt: Date;
  lastActivity?: Date;
  leadScore: number;
  status: 'new' | 'contacted' | 'qualified' | 'demo-scheduled' | 'proposal' | 'closed-won' | 'closed-lost';
  notes?: string[];
  demoViewed?: string[];
  engagementData?: {
    totalSessions: number;
    totalTimeSpent: number;
    featuresExplored: string[];
    completionRate: number;
  };
}

export interface CaptureFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  phone?: string;
  employeeCount?: number;
  industry?: string;
  interests?: string[];
  source?: string;
  campaign?: string;
}

export interface LeadScoringCriteria {
  email: number;
  company: number;
  title: number;
  employeeCount: number;
  phone: number;
  demoEngagement: number;
  timeSpent: number;
  featuresExplored: number;
  formSubmission: number;
}

const scoringWeights: LeadScoringCriteria = {
  email: 20,
  company: 15,
  title: 10,
  employeeCount: 15,
  phone: 10,
  demoEngagement: 20,
  timeSpent: 5,
  featuresExplored: 3,
  formSubmission: 2
};

class LeadCaptureService {
  private leads: Map<string, LeadData> = new Map();
  private readonly storageKey = 'benefitmetrics_leads';

  constructor() {
    this.loadStoredLeads();
  }

  private loadStoredLeads(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const leadsData = JSON.parse(stored);
        this.leads = new Map(
          Object.entries(leadsData).map(([id, lead]: [string, any]) => [
            id,
            {
              ...lead,
              capturedAt: new Date(lead.capturedAt),
              lastActivity: lead.lastActivity ? new Date(lead.lastActivity) : undefined
            }
          ])
        );
      }
    } catch (error) {
      console.warn('Could not load stored leads:', error);
    }
  }

  private persistLeads(): void {
    try {
      const leadsObject = Object.fromEntries(this.leads);
      localStorage.setItem(this.storageKey, JSON.stringify(leadsObject));
    } catch (error) {
      console.warn('Could not persist leads:', error);
    }
  }

  private calculateLeadScore(lead: LeadData): number {
    let score = 0;

    // Basic information scoring
    if (lead.email) score += scoringWeights.email;
    if (lead.company) score += scoringWeights.company;
    if (lead.title) score += scoringWeights.title;
    if (lead.phone) score += scoringWeights.phone;
    
    // Employee count scoring (larger companies = higher score)
    if (lead.employeeCount) {
      if (lead.employeeCount >= 1000) score += scoringWeights.employeeCount;
      else if (lead.employeeCount >= 500) score += scoringWeights.employeeCount * 0.8;
      else if (lead.employeeCount >= 100) score += scoringWeights.employeeCount * 0.6;
      else if (lead.employeeCount >= 50) score += scoringWeights.employeeCount * 0.4;
    }

    // Engagement scoring
    if (lead.engagementData) {
      const engagement = lead.engagementData;
      
      // Demo engagement
      score += Math.min(engagement.totalSessions * 5, scoringWeights.demoEngagement);
      
      // Time spent (cap at 30 minutes)
      const timeMinutes = Math.min(engagement.totalTimeSpent / 60000, 30);
      score += (timeMinutes / 30) * scoringWeights.timeSpent;
      
      // Features explored
      score += Math.min(engagement.featuresExplored.length * scoringWeights.featuresExplored, 15);
      
      // Completion rate bonus
      if (engagement.completionRate >= 80) score += 10;
      else if (engagement.completionRate >= 50) score += 5;
    }

    // Demo viewed bonus
    if (lead.demoViewed) {
      score += Math.min(lead.demoViewed.length * 5, 15);
    }

    return Math.min(Math.round(score), 100);
  }

  public captureLead(formData: CaptureFormData, source: string = 'demo'): LeadData {
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const lead: LeadData = {
      id: leadId,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      title: formData.title,
      phone: formData.phone,
      employeeCount: formData.employeeCount,
      industry: formData.industry,
      interests: formData.interests || [],
      source: source,
      campaign: formData.campaign,
      referrer: document.referrer || 'direct',
      capturedAt: new Date(),
      lastActivity: new Date(),
      leadScore: 0,
      status: 'new',
      notes: [],
      demoViewed: []
    };

    // Calculate initial lead score
    lead.leadScore = this.calculateLeadScore(lead);

    // Store the lead
    this.leads.set(leadId, lead);
    this.persistLeads();

    // Send to CRM/backend
    this.sendToCRM(lead);

    return lead;
  }

  public updateLead(leadId: string, updates: Partial<LeadData>): LeadData | null {
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    const updatedLead: LeadData = {
      ...lead,
      ...updates,
      lastActivity: new Date(),
      leadScore: this.calculateLeadScore({ ...lead, ...updates })
    };

    this.leads.set(leadId, updatedLead);
    this.persistLeads();

    return updatedLead;
  }

  public updateEngagementData(email: string, engagementData: LeadData['engagementData']): void {
    // Find lead by email
    const lead = Array.from(this.leads.values()).find(l => l.email === email);
    if (lead) {
      this.updateLead(lead.id, { engagementData });
    }
  }

  public addDemoView(email: string, persona: string): void {
    const lead = Array.from(this.leads.values()).find(l => l.email === email);
    if (lead) {
      const demoViewed = [...(lead.demoViewed || [])];
      if (!demoViewed.includes(persona)) {
        demoViewed.push(persona);
        this.updateLead(lead.id, { demoViewed });
      }
    }
  }

  public addNote(leadId: string, note: string): void {
    const lead = this.leads.get(leadId);
    if (lead) {
      const notes = [...(lead.notes || []), note];
      this.updateLead(leadId, { notes });
    }
  }

  public getLead(leadId: string): LeadData | null {
    return this.leads.get(leadId) || null;
  }

  public getLeadByEmail(email: string): LeadData | null {
    return Array.from(this.leads.values()).find(l => l.email === email) || null;
  }

  public getAllLeads(): LeadData[] {
    return Array.from(this.leads.values()).sort((a, b) => 
      b.capturedAt.getTime() - a.capturedAt.getTime()
    );
  }

  public getLeadsByStatus(status: LeadData['status']): LeadData[] {
    return this.getAllLeads().filter(lead => lead.status === status);
  }

  public getHighValueLeads(minScore: number = 70): LeadData[] {
    return this.getAllLeads().filter(lead => lead.leadScore >= minScore);
  }

  public getLeadStats(): {
    total: number;
    byStatus: Record<LeadData['status'], number>;
    bySource: Record<string, number>;
    avgScore: number;
    highValue: number;
  } {
    const leads = this.getAllLeads();
    const total = leads.length;

    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<LeadData['status'], number>);

    const bySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgScore = total > 0 ? leads.reduce((sum, lead) => sum + lead.leadScore, 0) / total : 0;
    const highValue = leads.filter(lead => lead.leadScore >= 70).length;

    return {
      total,
      byStatus,
      bySource,
      avgScore: Math.round(avgScore),
      highValue
    };
  }

  private sendToCRM(lead: LeadData): void {
    // In a real implementation, send to your CRM
    console.log('Sending lead to CRM:', lead);

    // Example: Send to external CRM
    /*
    fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    }).catch(console.error);
    */
  }

  public exportLeads(): string {
    const leads = this.getAllLeads();
    const stats = this.getLeadStats();
    
    return JSON.stringify({
      leads,
      stats,
      exportedAt: new Date(),
      totalCount: leads.length
    }, null, 2);
  }

  public clearLeads(): void {
    this.leads.clear();
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Could not clear stored leads:', error);
    }
  }
}

// Export singleton instance
export const leadCapture = new LeadCaptureService();

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateFormData = (data: CaptureFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Email format is invalid');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Phone number format is invalid');
  }
  
  if (data.employeeCount && (data.employeeCount < 1 || data.employeeCount > 1000000)) {
    errors.push('Employee count must be between 1 and 1,000,000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Lead scoring utilities
export const getLeadQuality = (score: number): 'low' | 'medium' | 'high' => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export const getRecommendedAction = (lead: LeadData): string => {
  if (lead.leadScore >= 80) {
    return 'Schedule immediate call - high-value prospect';
  } else if (lead.leadScore >= 60) {
    return 'Send personalized follow-up email within 24 hours';
  } else if (lead.leadScore >= 40) {
    return 'Add to nurture campaign';
  } else {
    return 'Continue content marketing engagement';
  }
};