import { useEffect, useState } from 'react';
import { useCareTimeline } from './useCareTimeline';
import { useHealthScore } from './useHealthScore';
import { useROITracker } from './useROITracker';

interface NextAction {
  id: string;
  title: string;
  description: string;
  impact: {
    healthScore: number;
    financialValue: number;
  };
  urgency: 'high' | 'medium' | 'low';
  type: 'appointment' | 'challenge' | 'checkup' | 'education';
  dueDate?: string;
  actionUrl?: string;
}

export function useNextBestAction() {
  const [nextActions, setNextActions] = useState<NextAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { healthScoreData } = useHealthScore();
  const { roiData } = useROITracker();
  const { upcomingAppointments } = useCareTimeline();
  
  useEffect(() => {
    const generateNextActions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // This is where you would implement logic to determine the next best actions
        // based on the user's health score, ROI data, and upcoming appointments
        
        // For demonstration purposes, we'll create some sample next actions
        const actions: NextAction[] = [
          {
            id: '1',
            title: 'Schedule Annual Physical',
            description: 'It has been over a year since your last physical examination',
            impact: {
              healthScore: 10,
              financialValue: 350,
            },
            urgency: 'high',
            type: 'appointment',
            dueDate: '2025-06-30',
            actionUrl: '/app/employee/appointments/schedule',
          },
          {
            id: '2',
            title: 'Complete Dental Check-up',
            description: 'Regular dental check-ups are recommended every 6 months',
            impact: {
              healthScore: 6,
              financialValue: 225,
            },
            urgency: 'medium',
            type: 'appointment',
            dueDate: '2025-07-15',
            actionUrl: '/app/employee/appointments/schedule',
          },
          {
            id: '3',
            title: 'Join Step Challenge',
            description: 'Current company wellness challenge: 8,000 steps daily for a week',
            impact: {
              healthScore: 5,
              financialValue: 50,
            },
            urgency: 'low',
            type: 'challenge',
            dueDate: '2025-05-31',
            actionUrl: '/app/employee/challenges',
          },
        ];
        
        // Sort actions by urgency and impact
        actions.sort((a, b) => {
          const urgencyValue = { high: 3, medium: 2, low: 1 };
          const aValue = urgencyValue[a.urgency] * (a.impact.healthScore + (a.impact.financialValue / 100));
          const bValue = urgencyValue[b.urgency] * (b.impact.healthScore + (b.impact.financialValue / 100));
          return bValue - aValue;
        });
        
        setNextActions(actions);
      } catch (err) {
        setError('Failed to generate next actions: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (healthScoreData && roiData) {
      generateNextActions();
    }
  }, [healthScoreData, roiData, upcomingAppointments]);
  
  return {
    nextActions,
    topAction: nextActions.length > 0 ? nextActions[0] : null,
    isLoading,
    error,
  };
}