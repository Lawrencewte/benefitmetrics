import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NextAppointment({ appointments }) {
  // Get the next upcoming appointment (first in the array)
  const nextAppointment = appointments && appointments.length > 0 ? appointments[0] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next Appointment</Text>
      
      {nextAppointment ? (
        <View>
          <Text style={styles.appointmentType}>{nextAppointment.type}</Text>
          <Text style={styles.appointmentDetail}>
            {nextAppointment.date} at {nextAppointment.time}
          </Text>
          <Text style={styles.appointmentDetail}>{nextAppointment.doctor}</Text>
        </View>
      ) : (
        <Text style={styles.noAppointment}>No upcoming appointments</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBF5FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#DBEAFE',
    borderWidth: 1,
  },
  title: {
    fontWeight: '500',
    marginBottom: 8,
  },
  appointmentType: {
    fontWeight: '600',
    fontSize: 16,
  },
  appointmentDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  noAppointment: {
    fontSize: 14,
    color: '#6B7280',
  },
});