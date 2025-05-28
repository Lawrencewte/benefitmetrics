import { router } from 'expo-router';
import { Activity, Briefcase, Calendar, Clock, Heart, Plus, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
// Commented out these imports until the components are created
// import { Button } from '../../../components/Common/ui/Button';
// import { AppointmentCard } from '../../../components/Employee/CareTimeline/AppointmentCard';
// import { useAppointments } from '../../../hooks/employee/useAppointments';

// Temporary appointment data for demo
const mockAppointments = [
  {
    id: '1',
    type: 'Annual Physical',
    doctor: 'Dr. Martinez',
    date: '2025-05-28',
    time: '10:30 AM',
    status: 'confirmed',
    location: 'Main Medical Center'
  },
  {
    id: '2',
    type: 'Dental Cleaning',
    doctor: 'Dr. Wong',
    date: '2025-06-15',
    time: '2:00 PM',
    status: 'scheduled',
    location: 'Dental Associates'
  },
];

export default function AppointmentsManagement() {
  // Temporarily using mock data instead of the hook
  const appointments = mockAppointments;
  const upcomingAppointments = appointments.filter(a => ['scheduled', 'confirmed'].includes(a.status));
  const isLoading = false;
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

  // Footer tabs definition
  const footerTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <Heart size={20} />,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar size={20} />,
      activeIcon: <Calendar size={20} />,
    },
    {
      id: 'benefits',
      label: 'Benefits',
      icon: <Briefcase size={20} />,
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: <Activity size={20} />,
    },
    {
      id: 'more',
      label: 'More',
      icon: <Settings size={20} />,
    },
  ];

  const handleTabPress = (tabId: string) => {
    console.log('Tab pressed:', tabId);
    // Add navigation logic here
  };

  const handleScheduleNew = () => {
    router.push('/employee/appointments/schedule');
  };

  const handleAppointmentPress = (appointmentId: string) => {
    router.push(`/employee/appointments/details/${appointmentId}`);
  };

  const filteredAppointments = appointments.filter(appointment => {
    switch (filterStatus) {
      case 'upcoming':
        return ['scheduled', 'confirmed'].includes(appointment.status);
      case 'completed':
        return appointment.status === 'completed';
      default:
        return true;
    }
  });

  // Simple AppointmentCard replacement
  const AppointmentCard = ({ appointment, onPress }) => (
    <TouchableOpacity style={styles.appointmentCard} onPress={onPress}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentType}>{appointment.type}</Text>
        <View style={[
          styles.statusBadge,
          appointment.status === 'confirmed' ? styles.statusConfirmed : styles.statusScheduled
        ]}>
          <Text style={styles.statusText}>
            {appointment.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
          </Text>
        </View>
      </View>
      <Text style={styles.doctorName}>{appointment.doctor}</Text>
      <Text style={styles.appointmentDateTime}>{appointment.date} at {appointment.time}</Text>
      <Text style={styles.location}>{appointment.location}</Text>
    </TouchableOpacity>
  );

  // Simple Button replacement
  const Button = ({ onPress, label, variant = 'primary' }) => (
    <TouchableOpacity 
      style={[styles.button, variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, variant === 'primary' ? styles.buttonTextPrimary : styles.buttonTextSecondary]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Appointments" />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Appointments</Text>
          <TouchableOpacity
            onPress={handleScheduleNew}
            style={styles.addButton}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Appointment Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{upcomingAppointments.length}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#16A34A' }]}>
                {appointments.filter(a => a.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#EAB308' }]}>
                {appointments.filter(a => a.status === 'scheduled').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
            { key: 'all', label: 'All' },
          ].map(filter => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setFilterStatus(filter.key as any)}
              style={[
                styles.filterTab,
                filterStatus === filter.key ? styles.filterTabActive : styles.filterTabInactive
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterStatus === filter.key ? styles.filterTabTextActive : styles.filterTabTextInactive
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appointments List */}
        {isLoading ? (
          <Text style={styles.loadingText}>Loading appointments...</Text>
        ) : filteredAppointments.length > 0 ? (
          <View style={styles.appointmentsList}>
            {filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => handleAppointmentPress(appointment.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Appointments</Text>
            <Text style={styles.emptyDescription}>
              {filterStatus === 'upcoming' 
                ? "You don't have any upcoming appointments." 
                : "No appointments found for this filter."}
            </Text>
            <Button
              onPress={handleScheduleNew}
              label="Schedule Appointment"
              variant="primary"
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={handleScheduleNew}
              style={styles.quickActionCard}
            >
              <Calendar color="#2563EB" size={20} />
              <Text style={styles.quickActionText}>Schedule New</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/employee/appointments/checkups')}
              style={styles.quickActionCard}
            >
              <Clock color="#2563EB" size={20} />
              <Text style={styles.quickActionText}>View Timeline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer 
        tabs={footerTabs}
        activeTab="appointments"
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
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
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 24,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
  },
  filterTabInactive: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: 'white',
  },
  filterTabTextInactive: {
    color: '#374151',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 32,
  },
  appointmentsList: {
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  statusScheduled: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  doctorName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: '#2563EB',
  },
  buttonSecondary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: 'white',
  },
  buttonTextSecondary: {
    color: '#374151',
  },
  quickActions: {
    marginTop: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionText: {
    fontWeight: '500',
    marginLeft: 12,
  },
});