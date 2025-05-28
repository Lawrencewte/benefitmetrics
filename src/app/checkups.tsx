import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppointments } from '../context/employee/AppointmentContext';

import CheckupList from '../components/Checkups/CheckupList';
import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';

export default function CheckupsPage() {
  const { checkups, scheduleCheckup } = useAppointments();

  const handleScheduleCheckup = (checkupId) => {
    scheduleCheckup(checkupId);
  };

  return (
    <View style={styles.container}>
      <Header title="Recommended Checkups" showBackButton />
      
      <ScrollView style={styles.scrollView}>
        <Text style={styles.description}>
          Based on your age, gender, and medical history, these are the recommended checkups for you:
        </Text>
        
        <CheckupList 
          checkups={checkups} 
          onSchedule={handleScheduleCheckup} 
        />
        
        <Text style={styles.disclaimer}>
          These recommendations are based on general preventative care guidelines. Consult your doctor for personalized advice.
        </Text>
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
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 24,
    marginBottom: 16,
  },
});