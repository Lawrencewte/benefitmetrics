import { Notification } from '../context/Common/NotificationsContext';
import api from './api';

interface NotificationsResponse {
  success: boolean;
  notifications?: Notification[];
  message?: string;
}

interface NotificationResponse {
  success: boolean;
  notification?: Notification;
  message?: string;
}

interface NotificationActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Get all notifications for the current user
 * 
 * @param token Auth token
 * @returns Response with notifications
 */
export const getNotifications = async (token: string): Promise<NotificationsResponse> => {
  try {
    const response = await api.get<NotificationsResponse>(
      '/notifications',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve notifications',
    };
  }
};

/**
 * Mark a notification as read
 * 
 * @param token Auth token
 * @param notificationId Notification ID
 * @returns Response with success status
 */
export const markAsRead = async (token: string, notificationId: string): Promise<NotificationResponse> => {
  try {
    const response = await api.post<NotificationResponse>(
      `/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to mark notification as read',
    };
  }
};

/**
 * Mark all notifications as read
 * 
 * @param token Auth token
 * @returns Response with success status
 */
export const markAllAsRead = async (token: string): Promise<NotificationsResponse> => {
  try {
    const response = await api.post<NotificationsResponse>(
      '/notifications/read-all',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to mark all notifications as read',
    };
  }
};

/**
 * Delete a notification
 * 
 * @param token Auth token
 * @param notificationId Notification ID
 * @returns Response with success status
 */
export const deleteNotification = async (token: string, notificationId: string): Promise<NotificationActionResponse> => {
  try {
    const response = await api.delete<NotificationActionResponse>(
      `/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to delete notification',
    };
  }
};

/**
 * Delete all notifications
 * 
 * @param token Auth token
 * @returns Response with success status
 */
export const deleteAllNotifications = async (token: string): Promise<NotificationActionResponse> => {
  try {
    const response = await api.delete<NotificationActionResponse>(
      '/notifications',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to delete all notifications:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to delete all notifications',
    };
  }
};

/**
 * Register Expo push token
 * 
 * @param token Auth token
 * @param pushToken Expo push token
 * @returns Response with success status
 */
export const registerPushToken = async (token: string, pushToken: string): Promise<NotificationActionResponse> => {
  try {
    const response = await api.post<NotificationActionResponse>(
      '/notifications/register-device',
      { pushToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to register push token:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to register push token',
    };
  }
};

/**
 * Unregister Expo push token
 * 
 * @param token Auth token
 * @param pushToken Expo push token
 * @returns Response with success status
 */
export const unregisterPushToken = async (token: string, pushToken: string): Promise<NotificationActionResponse> => {
  try {
    const response = await api.post<NotificationActionResponse>(
      '/notifications/unregister-device',
      { pushToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to unregister push token:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to unregister push token',
    };
  }
};

/**
 * Log notification action
 * 
 * @param token Auth token
 * @param action Action type
 * @param data Action data
 * @returns Response with success status
 */
export const logNotificationAction = async (
  token: string,
  action: string,
  data?: any
): Promise<NotificationActionResponse> => {
  try {
    const response = await api.post<NotificationActionResponse>(
      '/notifications/log-action',
      { action, data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to log notification action:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to log notification action',
    };
  }
};