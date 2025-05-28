/**
 * Feature flag definitions for the application
 * Used for staged rollouts and A/B testing
 */
export const featureFlags = {
  /**
   * Feature flag status enum
   */
  Status: {
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    PERCENTAGE: 'percentage',
    A_B_TEST: 'a_b_test',
  },
  
  /**
   * Feature flag definitions
   */
  flags: {
    // New features
    HEALTH_SCORE: {
      name: 'Health Score System',
      description: 'The new Health Score tracking system for preventative care',
      status: 'enabled',
      defaultValue: true,
    },
    
    ROI_TRACKER: {
      name: 'ROI Tracker',
      description: 'Feature that shows financial benefits of preventative care',
      status: 'enabled',
      defaultValue: true,
    },
    
    CARE_TIMELINE: {
      name: 'Care Timeline',
      description: 'AI-powered care coordination timeline',
      status: 'enabled',
      defaultValue: true,
    },
    
    FAMILY_MANAGEMENT: {
      name: 'Family Management',
      description: 'Family member profile and appointment management',
      status: 'percentage',
      percentage: 50,
      defaultValue: false,
    },
    
    BENEFITS_OPTIMIZATION_DASHBOARD: {
      name: 'Benefits Optimization Dashboard',
      description: 'Advanced analytics for benefits optimization (employer)',
      status: 'percentage',
      percentage: 75,
      defaultValue: false,
    },
    
    EDUCATION_CENTER: {
      name: 'Education Resource Center',
      description: 'Centralized educational resources and guides',
      status: 'percentage',
      percentage: 30,
      defaultValue: false,
    },
    
    // A/B test features
    APPOINTMENT_SCHEDULING_V2: {
      name: 'Appointment Scheduling v2',
      description: 'New appointment scheduling interface',
      status: 'a_b_test',
      variants: {
        'control': { weight: 50 },
        'treatment': { weight: 50 },
      },
      defaultValue: 'control',
    },
    
    DASHBOARD_LAYOUT: {
      name: 'Dashboard Layout',
      description: 'Dashboard layout design variants',
      status: 'a_b_test',
      variants: {
        'card_based': { weight: 34 },
        'list_based': { weight: 33 },
        'hybrid': { weight: 33 },
      },
      defaultValue: 'card_based',
    },
    
    // Upcoming features (disabled)
    WEARABLE_INTEGRATION: {
      name: 'Wearable Device Integration',
      description: 'Integration with fitness trackers and health wearables',
      status: 'disabled',
      defaultValue: false,
    },
    
    TELEHEALTH: {
      name: 'Telehealth Integration',
      description: 'Built-in telehealth appointment capabilities',
      status: 'disabled',
      defaultValue: false,
    },
    
    HEALTH_RISK_ASSESSMENT: {
      name: 'Health Risk Assessment',
      description: 'AI-powered health risk assessment tool',
      status: 'disabled',
      defaultValue: false,
    },
  },
  
  /**
   * Evaluate a feature flag for a specific user
   * Returns the feature flag value for the user
   */
  evaluate: (flagKey: string, userId?: string, userAttributes?: Record<string, any>): any => {
    // Get the flag definition
    const flag = featureFlags.flags[flagKey];
    if (!flag) {
      console.warn(`Feature flag "${flagKey}" not found`);
      return false;
    }
    
    // If no user ID provided, return the default value
    if (!userId) {
      return flag.defaultValue;
    }
    
    // Evaluation based on status
    switch (flag.status) {
      case 'enabled':
        return true;
        
      case 'disabled':
        return false;
        
      case 'percentage': {
        // Use the user ID to deterministically assign the user to a percentage bucket
        const hash = featureFlags.hashString(userId + flagKey);
        const bucket = hash % 100;
        return bucket < (flag.percentage || 0);
      }
        
      case 'a_b_test': {
        // Assign the user to a variant based on weights
        const variants = Object.keys(flag.variants);
        const weights = variants.map(v => flag.variants[v].weight);
        const hash = featureFlags.hashString(userId + flagKey);
        const bucket = hash % 100;
        
        let cumulative = 0;
        for (let i = 0; i < variants.length; i++) {
          cumulative += weights[i];
          if (bucket < cumulative) {
            return variants[i];
          }
        }
        
        // Fallback to default
        return flag.defaultValue;
      }
        
      default:
        return flag.defaultValue;
    }
  },
  
  /**
   * Simple hash function for deterministic assignment
   */
  hashString: (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  },
};