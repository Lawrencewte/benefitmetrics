// Fixed: Use Expo Router instead of React Navigation
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Fixed: Correct import paths for this deep nested file
// From settings/family/[id]/appointments.tsx, need to go up 6 levels to reach src/
import { AppointmentCard } from '../../../../../components/Employee/CareTimeline/AppointmentCard';
import { useAppointments } from '../../../../../hooks/employee/useAppointments';
import { useFamilyMembers } from '../../../../../hooks/employee/useFamilyMembers';

export default function FamilyMemberAppointments() {
  const router = useRouter();
  const { id: memberId } = useLocalSearchParams();
  
  const familyHook = useFamilyMembers();
  const appointmentsHook = useAppointments();
  
  // Safe access to hook data with fallbacks
  const getFamilyMember = familyHook?.getFamilyMember || (() => {});
  const currentMember = familyHook?.currentMember;
  const getMemberAppointments = appointmentsHook?.getMemberAppointments || (() => {});
  const memberAppointments = appointmentsHook?.memberAppointments || [];
  const isLoading = appointmentsHook?.isLoading || false;
  
  useEffect(() => {
    if (memberId) {
      getFamilyMember(memberId as string);
      getMemberAppointments(memberId as string);
    }
  }, [memberId]);
  
  const handleScheduleAppointment = () => {
    router.push(`/employee/appointments/schedule?familyMemberId=${memberId}`);
  };
  
  if (!currentMember) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.notFoundText}>Family member not found</Text>
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => router.back()}
          >
            <Text style={styles.outlineButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentMember.firstName}'s Appointments</Text>
          <TouchableOpacity
            onPress={handleScheduleAppointment}
            style={styles.addButton}
          >
            <Plus size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <Text style={styles.loadingText}>Loading appointments...</Text>
        ) : memberAppointments.length > 0 ? (
          <View style={styles.appointmentsList}>
            {memberAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => {
                  router.push(`/employee/appointments/details/${appointment.id}`);
                }}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Appointments</Text>
            <Text style={styles.emptyStateDescription}>
              {currentMember.firstName} doesn't have any scheduled appointments.
            </Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleScheduleAppointment}
            >
              <Text style={styles.primaryButtonText}>Schedule Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  appointmentsList: {
    gap: 16,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  outlineButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});