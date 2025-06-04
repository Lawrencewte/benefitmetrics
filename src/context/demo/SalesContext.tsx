import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ProspectInfo {
  id?: string;
  name?: string;
  email?: string;
  company?: string;
  title?: string;
  employeeCount?: number;
  industry?: string;
  source?: string;
  capturedAt?: Date;
}

interface InteractionEvent {
  id: string;
  type: 'demo_start' | 'demo_complete' | 'feature_click' | 'step_advance' | 'form_submit';
  persona?: string;
  feature?: string;
  step?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface DemoMetrics {
  totalViews: number;
  completionRate: number;
  avgTimeSpent: number;
  mostPopularFeatures: string[];
  dropOffPoints: number[];
}

interface SalesContextType {
  prospectInfo: ProspectInfo | null;
  setProspectInfo: (info: ProspectInfo) => void;
  interactions: InteractionEvent[];
  trackInteraction: (type: InteractionEvent['type'], metadata?: Record<string, any>) => void;
  demoMetrics: DemoMetrics;
  updateMetrics: () => void;
  generateLeadScore: () => number;
  getEngagementLevel: () => 'low' | 'medium' | 'high';
  exportLeadData: () => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

interface SalesProviderProps {
  children: ReactNode;
}

export function SalesProvider({ children }: SalesProviderProps) {
  const [prospectInfo, setProspectInfo] = useState<ProspectInfo | null>(null);
  const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
  const [demoMetrics, setDemoMetrics] = useState<DemoMetrics>({
    totalViews: 0,
    completionRate: 0,
    avgTimeSpent: 0,
    mostPopularFeatures: [],
    dropOffPoints: []
  });

  const trackInteraction = (type: InteractionEvent['type'], metadata?: Record<string, any>) => {
    const interaction: InteractionEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      ...metadata
    };

    setInteractions(prev => [...prev, interaction]);

    // Track in localStorage for persistence across sessions
    try {
      const stored = localStorage.getItem('benefitmetrics_interactions') || '[]';
      const existingInteractions = JSON.parse(stored);
      existingInteractions.push(interaction);
      localStorage.setItem('benefitmetrics_interactions', JSON.stringify(existingInteractions));
    } catch (error) {
      console.warn('Could not store interaction data:', error);
    }
  };

  const updateMetrics = () => {
    const demoStarts = interactions.filter(i => i.type === 'demo_start').length;
    const demoCompletes = interactions.filter(i => i.type === 'demo_complete').length;
    const featureClicks = interactions.filter(i => i.type === 'feature_click');
    
    const completionRate = demoStarts > 0 ? (demoCompletes / demoStarts) * 100 : 0;
    
    // Calculate most popular features
    const featureCounts: Record<string, number> = {};
    featureClicks.forEach(click => {
      const feature = click.feature || 'unknown';
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });
    
    const mostPopularFeatures = Object.entries(featureCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature);

    setDemoMetrics({
      totalViews: demoStarts,
      completionRate,
      avgTimeSpent: 0, // Would calculate from session data
      mostPopularFeatures,
      dropOffPoints: [] // Would analyze step transitions
    });
  };

  const generateLeadScore = (): number => {
    let score = 0;
    
    // Base score for engagement
    const interactionCount = interactions.length;
    score += Math.min(interactionCount * 5, 50); // Max 50 points for interactions
    
    // Bonus for completing demos
    const completedDemos = interactions.filter(i => i.type === 'demo_complete').length;
    score += completedDemos * 20;
    
    // Bonus for exploring multiple personas
    const uniquePersonas = new Set(interactions.map(i => i.persona).filter(Boolean)).size;
    score += uniquePersonas * 15;
    
    // Bonus for feature engagement
    const featureClicks = interactions.filter(i => i.type === 'feature_click').length;
    score += Math.min(featureClicks * 3, 30);
    
    // Bonus if prospect info is provided
    if (prospectInfo?.email) score += 25;
    if (prospectInfo?.company) score += 15;
    if (prospectInfo?.employeeCount) score += 10;
    
    return Math.min(score, 100); // Cap at 100
  };

  const getEngagementLevel = (): 'low' | 'medium' | 'high' => {
    const score = generateLeadScore();
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const exportLeadData = () => {
    const leadData = {
      prospectInfo,
      interactions,
      metrics: demoMetrics,
      leadScore: generateLeadScore(),
      engagementLevel: getEngagementLevel(),
      exportedAt: new Date()
    };

    // In a real app, this would send to your CRM/sales system
    console.log('Lead Data Export:', leadData);
    
    // For demo purposes, download as JSON
    const blob = new Blob([JSON.stringify(leadData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lead-${prospectInfo?.email || 'anonymous'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const value: SalesContextType = {
    prospectInfo,
    setProspectInfo,
    interactions,
    trackInteraction,
    demoMetrics,
    updateMetrics,
    generateLeadScore,
    getEngagementLevel,
    exportLeadData
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSalesContext() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSalesContext must be used within a SalesProvider');
  }
  return context;
}