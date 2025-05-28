import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../context/UserContext';

import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';
import NotificationCard from '../components/Common/ui/NotificationsCard';

export default function NotificationsPage() {
  const { userData, updateNotifications, clearNotificationAlert } = useUser();
  const router = useRouter();
  
  // Sample notifications - in a real app, these would come from a context or API
  const notifications = [
    {
      id: 1,
      title: 'Time for your annual physical',
      message: 'It\'s been nearly a year since your last checkup. Schedule now to maintain your wellness streak.',
      actions: [
        { id: 1, label: 'Schedule', type: 'primary', route: '/appointments' },
        { id: 2, label: 'Remind Later', type: 'secondary' }
      ]
    },
    {
      id: 2,
      title: 'New Company Challenge Available',
      message: 'Join the hydration challenge and earn up to 200 points!',
      actions: [
        { id: 1, label: 'View Challenge', type: 'primary', route: '/challenges' }
      ]
    },
    {
      id: 3,
      title: 'Vision benefits expiring soon',
      message: 'Your vision benefits for this year will expire in 30 days. Schedule an eye exam to use them.',
      actions: [
        { id: 1, label: 'Schedule Eye Exam', type: 'primary', route: '/appointments' }
      ]
    }
  ];

  // Clear notifications when the page is viewed
  useEffect(() => {
    updateNotifications(0);
    clearNotificationAlert();
  }, []);

  const handleNotificationAction = (actionRoute) => {
    if (actionRoute) {
      router.push(actionRoute);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Notifications"showBackButton />
      
      <ScrollView style={styles.scrollView}>
        {notifications.map((notification) => (
          <NotificationCard 
            key={notification.id} 
            notification={notification}
            onActionPress={handleNotificationAction}
          />
        ))}
        
        {notifications.length === 0 && (
          <Text style={styles.emptyMessage}>
            You have no new notifications.
          </Text>
        )}
      </ScrollView>
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
});