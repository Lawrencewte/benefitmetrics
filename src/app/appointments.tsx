import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppointments } from '../context/employee/AppointmentContext';

import AppointmentForm from '../components/Appointments/AppointmentForm';
import UpcomingAppointments from '../components/Appointments/UpcomingAppointments';
import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';

export default function AppointmentsPage() {
  const { appointments, addAppointment } = useAppointments();
  
  const handleCreateAppointment = (appointmentData) => {
    addAppointment(appointmentData);
  };

  return (
    <View style={styles.container}>
      <Header title="Appointments" showBackButton onBackPress={handleBack} />
      
      <ScrollView style={styles.scrollView}>
        <UpcomingAppointments appointments={appointments} />
        
        <AppointmentForm onSubmit={handleCreateAppointment} />
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
});