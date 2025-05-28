import { Link } from 'expo-router';
import { AlertCircle, Calendar, CheckCircle, ChevronRight, Clock, MapPin, Phone, Plus, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

type Appointment = {
  id: string;
  type: string;
  doctor: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  location: string;
  phone?: string;
  notes?: string;
};

export default function AppointmentsTab() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Sample data - in a real app, this would come from an API or context
  const appointments: Appointment[] = [
    {
      id: '1',
      type: 'Annual Physical',
      doctor: 'Dr. Sarah Martinez',
      date: 'May 28, 2025',
      time: '10:30 AM',
      status: 'confirmed',
      location: 'Austin Family Medicine',
      phone: '(512) 555-0123',
      notes: 'Bring insurance card and list of current medications'
    },
    {
      id: '2',
      type: 'Dental Cleaning',
      doctor: 'Dr. James Wong',
      date: 'June 15, 2025',
      time: '2:00 PM',
      status: 'pending',
      location: 'Smile Dental Care',
      phone: '(512) 555-0456'
    },
    {
      id: '3',
      type: 'Eye Exam',
      doctor: 'Dr. Lisa Chen',
      date: 'July 8, 2025',
      time: '9:00 AM',
      status: 'confirmed',
      location: 'Vision Center Austin',
      phone: '(512) 555-0789'
    }
  ];
  
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  );
  
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );
  
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };
  
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'pending':
        return <Clock size={16} color="#FF9800" />;
      case 'completed':
        return <CheckCircle size={16} color="#2196F3" />;
      case 'cancelled':
        return <AlertCircle size={16} color="#F44336" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending Confirmation';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return '';
    }
  };
  
  const renderAppointment = (appointment: Appointment) => (
    <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
      <Link href={`/employee/appointments/details/${appointment.id}`} asChild>
        <View>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentTitleContainer}>
              <Text style={styles.appointmentType}>{appointment.type}</Text>
              <View style={styles.doctorContainer}>
                <User size={14} color="#666" style={styles.doctorIcon} />
                <Text style={styles.doctorName}>{appointment.doctor}</Text>
              </View>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(appointment.status)}20` }
            ]}>
              {getStatusIcon(appointment.status)}
              <Text style={[
                styles.statusText,
                { color: getStatusColor(appointment.status) }
              ]}>
                {getStatusText(appointment.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{appointment.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{appointment.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{appointment.location}</Text>
            </View>
            
            {appointment.phone && (
              <View style={styles.detailRow}>
                <Phone size={16} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{appointment.phone}</Text>
              </View>
            )}
          </View>
          
          {appointment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          )}
          
          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <ChevronRight size={16} color="#4682B4" />
          </View>
        </View>
      </Link>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Link href="/employee/appointments/schedule" asChild>
          <TouchableOpacity style={styles.scheduleButton}>
            <Plus size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/employee/appointments/checkups" asChild>
          <TouchableOpacity style={styles.checkupsButton}>
            <Calendar size={20} color="#4682B4" style={styles.buttonIcon} />
            <Text style={styles.checkupsButtonText}>View Checkup Timeline</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingAppointments.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past ({pastAppointments.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Appointments List */}
      <ScrollView style={styles.appointmentsList}>
        {activeTab === 'upcoming' ? (
          upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(renderAppointment)
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#CCC" />
              <Text style={styles.emptyStateTitle}>No upcoming appointments</Text>
              <Text style={styles.emptyStateText}>
                Schedule your next appointment to stay on top of your health
              </Text>
              <Link href="/employee/appointments/schedule" asChild>
                <TouchableOpacity style={styles.emptyStateButton}>
                  <Text style={styles.emptyStateButtonText}>Schedule Now</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )
        ) : (
          pastAppointments.length > 0 ? (
            pastAppointments.map(renderAppointment)
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#CCC" />
              <Text style={styles.emptyStateTitle}>No past appointments</Text>
              <Text style={styles.emptyStateText}>
                Your appointment history will appear here
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: '#4682B4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkupsButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4682B4',
  },
  buttonIcon: {
    marginRight: 8,
  },
  scheduleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  checkupsButtonText: {
    color: '#4682B4',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4682B4',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  doctorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorIcon: {
    marginRight: 4,
  },
  doctorName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  appointmentDetails: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
    width: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  notesContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  notesText: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});