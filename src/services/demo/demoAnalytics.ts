// Demo analytics and tracking service

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'demo_start' | 'demo_complete' | 'feature_interaction' | 'step_advance' | 'form_submit' | 'download' | 'contact_request';
  persona?: string;
  feature?: string;
  step?: number;
  duration?: number;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  userAgent?: string;
  referrer?: string;
}

export interface DemoSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  persona?: string;
  stepsCompleted: number;
  totalSteps: number;
  featuresInteracted: string[];
  completionRate: number;
  timeSpent: number;
  bounced: boolean;
  converted: boolean;
  leadScore: number;
}

export interface AnalyticsMetrics {
  totalSessions: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  completionRate: number;
  bounceRate: number;
  conversionRate: number;
  topPersonas: Array<{ persona: string; views: number }>;
  topFeatures: Array<{ feature: string; interactions: number }>;
  dropOffPoints: Array<{ step: number; dropOffRate: number }>;
  leadQuality: {
    high: number;
    medium: number;
    low: number;
  };
}

class DemoAnalytics {
  private events: AnalyticsEvent[] = [];
  private sessions: Map<string, DemoSession> = new Map();
  private currentSessionId: string = '';

  constructor() {
    this.initializeSession();
    this.loadStoredData();
  }

  private initializeSession(): void {
    this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: DemoSession = {
      id: this.currentSessionId,
      startTime: new Date(),
      stepsCompleted: 0,
      totalSteps: 0,
      featuresInteracted: [],
      completionRate: 0,
      timeSpent: 0,
      bounced: false,
      converted: false,
      leadScore: 0
    };
    
    this.sessions.set(this.currentSessionId, session);
  }

  private loadStoredData(): void {
    try {
      const storedEvents = localStorage.getItem('benefitmetrics_analytics_events');
      const storedSessions = localStorage.getItem('benefitmetrics_analytics_sessions');
      
      if (storedEvents) {
        this.events = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }
      
      if (storedSessions) {
        const sessionData = JSON.parse(storedSessions);
        this.sessions = new Map(Object.entries(sessionData).map(([id, session]: [string, any]) => [
          id,
          {
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined
          }
        ]));
      }
    } catch (error) {
      console.warn('Could not load stored analytics data:', error);
    }
  }

  private persistData(): void {
    try {
      localStorage.setItem('benefitmetrics_analytics_events', JSON.stringify(this.events));
      localStorage.setItem('benefitmetrics_analytics_sessions', JSON.stringify(Object.fromEntries(this.sessions)));
    } catch (error) {
      console.warn('Could not persist analytics data:', error);
    }
  }

  public trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId' | 'userAgent' | 'referrer'>): void {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: this.currentSessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    this.events.push(analyticsEvent);
    this.updateSession(analyticsEvent);
    this.persistData();

    // In a real app, also send to analytics service
    this.sendToAnalyticsService(analyticsEvent);
  }

  private updateSession(event: AnalyticsEvent): void {
    const session = this.sessions.get(this.currentSessionId);
    if (!session) return;

    // Update session data based on event
    switch (event.type) {
      case 'demo_start':
        session.persona = event.persona;
        session.totalSteps = event.metadata?.totalSteps || 5;
        break;
      
      case 'step_advance':
        session.stepsCompleted = Math.max(session.stepsCompleted, event.step || 0);
        session.completionRate = session.totalSteps > 0 ? (session.stepsCompleted / session.totalSteps) * 100 : 0;
        break;
      
      case 'feature_interaction':
        if (event.feature && !session.featuresInteracted.includes(event.feature)) {
          session.featuresInteracted.push(event.feature);
        }
        break;
      
      case 'form_submit':
      case 'contact_request':
        session.converted = true;
        break;
      
      case 'demo_complete':
        session.completionRate = 100;
        session.endTime = new Date();
        break;
    }

    // Update time spent
    session.timeSpent = Date.now() - session.startTime.getTime();
    
    // Update lead score
    session.leadScore = this.calculateLeadScore(session);
    
    // Check if bounced (left without meaningful interaction)
    session.bounced = session.timeSpent < 30000 && session.featuresInteracted.length === 0;

    this.sessions.set(this.currentSessionId, session);
  }

  private calculateLeadScore(session: DemoSession): number {
    let score = 0;
    
    // Base engagement score
    score += Math.min(session.timeSpent / 1000 / 60, 10) * 2; // Up to 20 points for time (10 minutes max)
    score += session.completionRate * 0.3; // Up to 30 points for completion
    score += session.featuresInteracted.length * 5; // 5 points per feature interaction
    
    // Conversion bonus
    if (session.converted) score += 30;
    
    // Persona engagement bonus
    if (session.persona) score += 10;
    
    return Math.min(Math.round(score), 100);
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // In a real implementation, send to your analytics service
    // For demo purposes, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
    
    // Example: Send to external service
    /*
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(console.error);
    */
  }

  public getMetrics(): AnalyticsMetrics {
    const sessions = Array.from(this.sessions.values());
    const totalSessions = sessions.length;
    
    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        uniqueUsers: 0,
        avgSessionDuration: 0,
        completionRate: 0,
        bounceRate: 0,
        conversionRate: 0,
        topPersonas: [],
        topFeatures: [],
        dropOffPoints: [],
        leadQuality: { high: 0, medium: 0, low: 0 }
      };
    }

    // Calculate metrics
    const completedSessions = sessions.filter(s => s.completionRate >= 80).length;
    const bouncedSessions = sessions.filter(s => s.bounced).length;
    const convertedSessions = sessions.filter(s => s.converted).length;
    
    const avgSessionDuration = sessions.reduce((sum, s) => sum + s.timeSpent, 0) / totalSessions / 1000; // in seconds
    const completionRate = (completedSessions / totalSessions) * 100;
    const bounceRate = (bouncedSessions / totalSessions) * 100;
    const conversionRate = (convertedSessions / totalSessions) * 100;

    // Top personas
    const personaCounts: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.persona) {
        personaCounts[s.persona] = (personaCounts[s.persona] || 0) + 1;
      }
    });
    const topPersonas = Object.entries(personaCounts)
      .map(([persona, views]) => ({ persona, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Top features
    const featureCounts: Record<string, number> = {};
    this.events.filter(e => e.type === 'feature_interaction' && e.feature).forEach(e => {
      featureCounts[e.feature!] = (featureCounts[e.feature!] || 0) + 1;
    });
    const topFeatures = Object.entries(featureCounts)
      .map(([feature, interactions]) => ({ feature, interactions }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 5);

    // Drop-off analysis
    const stepEvents = this.events.filter(e => e.type === 'step_advance' && e.step !== undefined);
    const stepCounts: Record<number, number> = {};
    stepEvents.forEach(e => {
      stepCounts[e.step!] = (stepCounts[e.step!] || 0) + 1;
    });
    
    const dropOffPoints = Object.entries(stepCounts)
      .map(([step, count]) => ({
        step: parseInt(step),
        dropOffRate: ((totalSessions - count) / totalSessions) * 100
      }))
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 3);

    // Lead quality distribution
    const leadQuality = sessions.reduce(
      (acc, s) => {
        if (s.leadScore >= 70) acc.high++;
        else if (s.leadScore >= 40) acc.medium++;
        else acc.low++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    return {
      totalSessions,
      uniqueUsers: totalSessions, // Simplified - would track by user ID in real app
      avgSessionDuration,
      completionRate,
      bounceRate,
      conversionRate,
      topPersonas,
      topFeatures,
      dropOffPoints,
      leadQuality
    };
  }

  public exportData(): string {
    return JSON.stringify({
      events: this.events,
      sessions: Array.from(this.sessions.values()),
      metrics: this.getMetrics(),
      exportedAt: new Date()
    }, null, 2);
  }

  public clearData(): void {
    this.events = [];
    this.sessions.clear();
    this.initializeSession();
    try {
      localStorage.removeItem('benefitmetrics_analytics_events');
      localStorage.removeItem('benefitmetrics_analytics_sessions');
    } catch (error) {
      console.warn('Could not clear stored analytics data:', error);
    }
  }
}

// Export singleton instance
export const demoAnalytics = new DemoAnalytics();

// Convenience functions
export const trackDemoStart = (persona: string, totalSteps: number) => {
  demoAnalytics.trackEvent({
    type: 'demo_start',
    persona,
    metadata: { totalSteps }
  });
};

export const trackStepAdvance = (persona: string, step: number) => {
  demoAnalytics.trackEvent({
    type: 'step_advance',
    persona,
    step
  });
};

export const trackFeatureInteraction = (persona: string, feature: string) => {
  demoAnalytics.trackEvent({
    type: 'feature_interaction',
    persona,
    feature
  });
};

export const trackDemoComplete = (persona: string) => {
  demoAnalytics.trackEvent({
    type: 'demo_complete',
    persona
  });
};

export const trackFormSubmit = (formType: string, data: Record<string, any>) => {
  demoAnalytics.trackEvent({
    type: 'form_submit',
    metadata: { formType, ...data }
  });
};