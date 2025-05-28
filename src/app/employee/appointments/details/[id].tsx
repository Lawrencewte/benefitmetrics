import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, CheckCircle, Clock, FilePlus, MapPin, Share2, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppointments } from '../../../../hooks/employee/useAppointments';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Get appointment details from the context
  const { getAppointmentById } = useAppointments();
  const appointment = getAppointmentById(id as string);
  
  if (!appointment) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Appointment not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const handleCancel = () => {
    setShowCancelModal(false);
    Alert.alert('Appointment Cancelled', 'Your appointment has been cancelled successfully.');
    router.back();
  };
  
  const handleShare = () => {
    Alert.alert('Share Appointment', 'Sharing functionality would be implemented here.');
  };
  
  const handleAddToCalendar = () => {
    Alert.alert('Calendar Integration', 'This appointment has been added to your calendar.');
  };
  
  // Helper function to safely render values
  const renderValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      // If it's an object, try to get name or title property
      return value.name || value.title || JSON.stringify(value);
    }
    return String(value || '');
  };
  
  // Helper function to get appointment type name
  const getAppointmentTypeName = () => {
    if (appointment?.type) {
      return typeof appointment.type === 'string' ? appointment.type : appointment.type.name;
    }
    return '';
  };
  
  // Helper function to get doctor name
  const getDoctorName = () => {
    if (appointment?.doctor) {
      return typeof appointment.doctor === 'string' ? appointment.doctor : appointment.doctor.name;
    }
    return '';
  };
  
  // Helper function to get status
  const getStatus = () => {
    if (appointment?.status === 'confirmed') return 'Confirmed';
    if (appointment?.status === 'scheduled') return 'Pending';
    return 'Pending';
  };
  
  const isConfirmed = appointment?.status === 'confirmed';
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={styles.appointmentType}>{getAppointmentTypeName()}</Text>
          <View style={[
            styles.statusBadge,
            isConfirmed ? styles.confirmedBadge : styles.pendingBadge
          ]}>
            <Text style={[
              styles.statusText,
              isConfirmed ? styles.confirmedText : styles.pendingText
            ]}>
              {getStatus()}
            </Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Calendar size={20} color="#4682B4" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{renderValue(appointment.date)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Clock size={20} color="#4682B4" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{renderValue(appointment.time)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <User size={20} color="#4682B4" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Provider</Text>
              <Text style={styles.detailValue}>{getDoctorName()}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MapPin size={20} color="#4682B4" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{renderValue(appointment.location)}</Text>
            </View>
          </View>
        </View>
        
        {appointment.notes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{renderValue(appointment.notes)}</Text>
          </View>
        )}
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Insurance Coverage</Text>
          <View style={styles.coverageContainer}>
            <View style={styles.coverageItem}>
              <Text style={styles.coverageLabel}>Co-Pay</Text>
              <Text style={styles.coverageValue}>$0</Text>
            </View>
            <View style={styles.coverageItem}>
              <Text style={styles.coverageLabel}>Coverage</Text>
              <Text style={styles.coverageValue}>100%</Text>
            </View>
            <View style={styles.coverageItem}>
              <Text style={styles.coverageLabel}>Status</Text>
              <Text style={styles.coverageValue}>In-Network</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preparation</Text>
          {getAppointmentTypeName() === 'Annual Physical' && (
            <View style={styles.prepItem}>
              <CheckCircle size={16} color="#4CAF50" style={styles.prepIcon} />
              <Text style={styles.prepText}>Fast for 8-12 hours before blood work</Text>
            </View>
          )}
          {getAppointmentTypeName() === 'Blood Work' && (
            <View style={styles.prepItem}>
              <CheckCircle size={16} color="#4CAF50" style={styles.prepIcon} />
              <Text style={styles.prepText}>Fast for 8-12 hours before appointment</Text>
            </View>
          )}
          {(getAppointmentTypeName() === 'Dental Cleaning') && (
            <View style={styles.prepItem}>
              <CheckCircle size={16} color="#4CAF50" style={styles.prepIcon} />
              <Text style={styles.prepText}>Brush and floss before your appointment</Text>
            </View>
          )}
          {(getAppointmentTypeName() === 'Eye Exam') && (
            <View style={styles.prepItem}>
              <CheckCircle size={16} color="#4CAF50" style={styles.prepIcon} />
              <Text style={styles.prepText}>Bring your current glasses or contacts</Text>
            </View>
          )}
          <View style={styles.prepItem}>
            <CheckCircle size={16} color="#4CAF50" style={styles.prepIcon} />
            <Text style={styles.prepText}>Bring your insurance card and ID</Text>
          </View>
          <View style={styles.prepItem}>
            <CheckCircle size={16} color="#4CAF50" style={styles.prepIcon} />
            <Text style={styles.prepText}>Arrive 15 minutes before your appointment</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar}>
            <FilePlus size={16} color="#4682B4" />
            <Text style={styles.actionText}>Add to Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={16} color="#4682B4" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]} 
            onPress={() => setShowCancelModal(true)}
          >
            <Trash2 size={16} color="#F44336" />
            <Text style={[styles.actionText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Simple cancel confirmation - replace Modal with Alert for now */}
      {showCancelModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Appointment</Text>
            <Text style={styles.modalText}>
              Are you sure you want to cancel your {getAppointmentTypeName()} on {renderValue(appointment.date)} at {renderValue(appointment.time)}?
            </Text>
            <Text style={styles.modalWarning}>
              This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]} 
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Keep Appointment</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalConfirmButton]} 
                onPress={handleCancel}
              >
                <Text style={styles.modalConfirmText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confirmedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  confirmedText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9800',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  coverageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverageItem: {
    alignItems: 'center',
    flex: 1,
  },
  coverageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  coverageValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  prepItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  prepIcon: {
    marginRight: 8,
  },
  prepText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
    marginLeft: 6,
  },
  cancelButton: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  cancelText: {
    color: '#F44336',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalWarning: {
    fontSize: 12,
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalCancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalConfirmButton: {
    backgroundColor: '#F44336',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalConfirmText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
});