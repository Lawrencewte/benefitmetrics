// src/context/Common/NotificationsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Platform detection - check if we're in a web environment
const isWeb = typeof window !== 'undefined' && !window.hasOwnProperty('ReactNativeWebView');

interface NotificationSettings {
  email: {
    enabled: boolean;
    appointments: boolean;
    reminders: boolean;
    healthUpdates: boolean;
    challenges: boolean;
    newsletters: boolean;
  };
  push: {
    enabled: boolean;
    appointments: boolean;
    reminders: boolean;
    healthUpdates: boolean;
    challenges: boolean;
    urgentAlerts: boolean;
  };
  sms: {
    enabled: boolean;
    appointments: boolean;
    reminders: boolean;
    urgentAlerts: boolean;
  };
}

interface NotificationContextType {
  schedulePushNotification: (title: string, body: string, trigger: Date) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize permissions based on platform
    if (isWeb) {
      // For web, check if browser notifications are supported
      if ('Notification' in window) {
        setHasPermissions(Notification.permission === 'granted');
      }
    } else {
      // For native platforms, we'll request permissions when needed
      setHasPermissions(false);
    }
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (isWeb) {
        // Web platform permissions
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';
          setHasPermissions(granted);
          return granted;
        }
        return false;
      } else {
        // For native platforms, dynamically import expo-notifications
        try {
          const { getPermissionsAsync, requestPermissionsAsync } = await import('expo-notifications');
          
          const { status: existingStatus } = await getPermissionsAsync();
          let finalStatus = existingStatus;
          
          if (existingStatus !== 'granted') {
            const { status } = await requestPermissionsAsync();
            finalStatus = status;
          }
          
          const granted = finalStatus === 'granted';
          setHasPermissions(granted);
          return granted;
        } catch (error) {
          console.warn('expo-notifications not available:', error);
          return false;
        }
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const schedulePushNotification = async (title: string, body: string, trigger: Date): Promise<void> => {
    try {
      if (isWeb) {
        // Web notifications
        await scheduleWebNotification(title, body, trigger);
      } else {
        // Native notifications
        await scheduleNativeNotification(title, body, trigger);
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      // Gracefully handle the error without crashing
    }
  };

  const scheduleWebNotification = async (title: string, body: string, trigger: Date): Promise<void> => {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
      }

      if (!hasPermissions) {
        const granted = await requestPermissions();
        if (!granted) {
          console.warn('Notification permissions not granted');
          return;
        }
      }

      // For web, use setTimeout to show the notification at the right time
      const now = new Date().getTime();
      const triggerTime = trigger.getTime();
      const delay = triggerTime - now;

      if (delay > 0) {
        setTimeout(() => {
          new Notification(title, { body });
        }, delay);
      } else {
        // If the trigger time has already passed, show immediately
        new Notification(title, { body });
      }
    } catch (error) {
      console.error('Error scheduling web notification:', error);
    }
  };

  const scheduleNativeNotification = async (title: string, body: string, trigger: Date): Promise<void> => {
    try {
      // Dynamically import expo-notifications only when needed
      const { scheduleNotificationAsync } = await import('expo-notifications');
      
      await scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: {
          date: trigger,
        },
      });
    } catch (error) {
      console.warn('Failed to schedule native notification:', error);
      // Fall back to web notification if available
      if (isWeb) {
        await scheduleWebNotification(title, body, trigger);
      }
    }
  };

  const updateNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call to save the settings
      // For now, we'll just simulate a delay and log the settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Notification settings updated:', settings);
      
      // You could also store these settings in local storage or state management
      // localStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: NotificationContextType = {
    schedulePushNotification,
    requestPermissions,
    hasPermissions,
    updateNotificationSettings,
    isLoading,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// Export the context for direct access if needed
export { NotificationsContext };
