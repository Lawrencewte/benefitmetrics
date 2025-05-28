import { Link } from 'expo-router';
import { AlertTriangle, Award, Bell, Calendar, CheckCircle, Clock, Info, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import { useNotifications } from '../../../hooks/Common/useNotifications';

type NotificationType = 'appointment' | 'reward' | 'reminder' | 'alert' | 'announcement';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  actionText?: string;
  urgent?: boolean;
};

export default function NotificationsScreen() {
  const { notifications = [], markAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  
  // Early return if notifications or required functions are not available
  if (!Array.isArray(notifications) || !markAsRead || !deleteNotification || !clearAllNotifications) {
    return (
      <View style={styles.container}>
        <Header title="Notifications" />
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
        <Footer activePath="home" employee={true} />
      </View>
    );
  }
  
  const toggleNotificationSelection = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    try {
      markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleDeleteSelected = () => {
    try {
      selectedNotifications.forEach(id => deleteNotification(id));
      setSelectedNotifications([]);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };
  
  const handleDeleteNotification = (id: string) => {
    try {
      deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const handleClearAll = () => {
    try {
      clearAllNotifications();
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };
  
  const getNotificationIcon = (type: NotificationType, urgent?: boolean) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={20} color={urgent ? '#F44336' : '#4682B4'} />;
      case 'reward':
        return <Award size={20} color="#4682B4" />;
      case 'reminder':
        return <Clock size={20} color={urgent ? '#FF9800' : '#4682B4'} />;
      case 'alert':
        return <AlertTriangle size={20} color={urgent ? '#F44336' : '#FF9800'} />;
      case 'announcement':
        return <Bell size={20} color="#4682B4" />;
      default:
        return <Info size={20} color="#4682B4" />;
    }
  };
  
  const getActionComponent = (notification: Notification) => {
    if (!notification.actionLink || !notification.actionText) {
      return null;
    }
    
    return (
      <Link href={notification.actionLink} asChild>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleMarkAsRead(notification.id)}
        >
          <Text style={styles.actionButtonText}>{notification.actionText}</Text>
        </TouchableOpacity>
      </Link>
    );
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <View style={styles.container}>
      <Header 
        title="Notifications" 
        rightComponent={
          isDeleting ? (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleDeleteSelected}
              disabled={selectedNotifications.length === 0}
            >
              <Text 
                style={[
                  styles.headerButtonText,
                  selectedNotifications.length === 0 && styles.disabledText
                ]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setIsDeleting(!isDeleting)}
            >
              <Text style={styles.headerButtonText}>Edit</Text>
            </TouchableOpacity>
          )
        }
      />
      
      <ScrollView style={styles.content}>
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Text style={styles.unreadText}>You have {unreadCount} unread notifications</Text>
            <TouchableOpacity 
              style={styles.markAllReadButton}
              onPress={() => notifications.forEach(n => !n.isRead && handleMarkAsRead(n.id))}
            >
              <Text style={styles.markAllReadText}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {notifications.length > 0 ? (
          <>
            {notifications.map(notification => (
              <TouchableOpacity 
                key={notification.id} 
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadCard
                ]}
                onPress={() => isDeleting 
                  ? toggleNotificationSelection(notification.id)
                  : handleMarkAsRead(notification.id)
                }
              >
                {isDeleting && (
                  <View style={[
                    styles.selectionCircle,
                    selectedNotifications.includes(notification.id) && styles.selectedCircle
                  ]}>
                    {selectedNotifications.includes(notification.id) && (
                      <CheckCircle size={16} color="#FFF" />
                    )}
                  </View>
                )}
                
                <View style={[
                  styles.iconContainer,
                  notification.urgent && styles.urgentIconContainer
                ]}>
                  {getNotificationIcon(notification.type, notification.urgent)}
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  {getActionComponent(notification)}
                </View>
                
                {!isDeleting && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteNotification(notification.id)}
                  >
                    <Trash2 size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
            
            {!isDeleting && (
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={handleClearAll}
              >
                <Text style={styles.clearAllText}>Clear All Notifications</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color="#DDD" />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateText}>
              You don't have any notifications at the moment. We'll notify you about important updates and reminders.
            </Text>
          </View>
        )}
      </ScrollView>
      
      <Footer 
        activePath="home"
        employee={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  unreadBanner: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  unreadText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
  markAllReadButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  markAllReadText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '500',
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#4682B4',
  },
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  iconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  urgentIconContainer: {
    backgroundColor: '#FFEBEE',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 10,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#4682B4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  clearAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  clearAllText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});