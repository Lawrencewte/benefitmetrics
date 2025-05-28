import { Calendar, CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Types
import { Appointment } from '../../../types/employee';

// Utils
import { formatDate } from '../../../utils/dateUtils';

type AppointmentCardProps = {
  appointment: Appointment;
  onViewDetails: (id: string) => void;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
  compact?: boolean;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewDetails,
  onReschedule,
  onCancel,
  compact = false
}) => {
  // Get background color based on appointment status
  const getBackgroundColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return '#EFF6FF'; // Light blue
      case 'pending':
        return '#FEF3C7'; // Light amber
      case 'completed':
        return '#ECFDF5'; // Light green
      case 'cancelled':
        return '#FEF2F2'; // Light red
      default:
        return '#F9FAFB'; // Light gray
    }
  };
  
  // Get border color based on appointment status
  const getBorderColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return '#BFDBFE'; // Light blue
      case 'pending':
        return '#FDE68A'; // Light amber
      case 'completed':
        return '#A7F3D0'; // Light green
      case 'cancelled':
        return '#FCA5A5'; // Light red
      default:
        return '#E5E7EB'; // Light gray
    }
  };
  
  // Get status text and color
  const getStatusInfo = (status: string): { text: string; color: string } => {
    switch (status) {
      case 'confirmed':
        return { text: 'Confirmed', color: '#3B82F6' }; // Blue
      case 'pending':
        return { text: 'Pending', color: '#F59E0B' }; // Amber
      case 'completed':
        return { text: 'Completed', color: '#10B981' }; // Green
      case 'cancelled':
        return { text: 'Cancelled', color: '#EF4444' }; // Red
      default:
        return { text: 'Unknown', color: '#6B7280' }; // Gray
    }
  };
  
  const statusInfo = getStatusInfo(appointment.status);
  
  // Format appointment date
  const formattedDate = appointment.date 
    ? formatDate(new Date(appointment.date), 'dddd, MMMM D, YYYY')
    : 'Date TBD';
  
  // Compact version for timeline view
  if (compact) {
    return (
      <TouchableOpacity 
        style={[
          styles.compactCard,
          {
            backgroundColor: getBackgroundColor(appointment.status),
            borderColor: getBorderColor(appointment.status)
          }
        ]}
        onPress={() => onViewDetails(appointment.id)}
      >
        <View style={styles.compactHeader}>
          <Text style={styles.compactType}>{appointment.type}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          </View>
        </View>
        
        <View style={styles.compactDetails}>
          <View style={styles.compactDetailItem}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.compactDetailText}>{formattedDate}</Text>
          </View>
          
          {appointment.time && (
            <View style={styles.compactDetailItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.compactDetailText}>{appointment.time}</Text>
            </View>
          )}
          
          {appointment.provider && (
            <View style={styles.compactDetailItem}>
              <User size={14} color="#6B7280" />
              <Text style={styles.compactDetailText}>{appointment.provider}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
  
  // Full appointment card
  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(appointment.status),
          borderColor: getBorderColor(appointment.status)
        }
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.appointmentType}>{appointment.type}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Calendar size={16} color="#6B7280" />
          </View>
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
        
        {appointment.time && (
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Clock size={16} color="#6B7280" />
            </View>
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
        )}
        
        {appointment.provider && (
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <User size={16} color="#6B7280" />
            </View>
            <Text style={styles.detailText}>{appointment.provider}</Text>
          </View>
        )}
        
        {appointment.location && (
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MapPin size={16} color="#6B7280" />
            </View>
            <Text style={styles.detailText}>{appointment.location}</Text>
          </View>
        )}
        
        {appointment.phone && (
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Phone size={16} color="#6B7280" />
            </View>
            <Text style={styles.detailText}>{appointment.phone}</Text>
          </View>
        )}
      </View>
      
      {appointment.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsLabel}>Instructions:</Text>
          <Text style={styles.instructionsText}>{appointment.instructions}</Text>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        {appointment.status === 'confirmed' && (
          <>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onViewDetails(appointment.id)}
            >
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
            
            {onReschedule && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.rescheduleButton]}
                onPress={() => onReschedule(appointment.id)}
              >
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </TouchableOpacity>
            )}
            
            {onCancel && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => onCancel(appointment.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        
        {appointment.status === 'pending' && (
          <>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onViewDetails(appointment.id)}
            >
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
            
            {onCancel && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => onCancel(appointment.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        
        {appointment.status === 'completed' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewDetailsButton]}
            onPress={() => onViewDetails(appointment.id)}
          >
            <CheckCircle size={16} color="#10B981" style={styles.viewDetailsIcon} />
            <Text style={styles.viewDetailsText}>View Summary</Text>
          </TouchableOpacity>
        )}
        
        {appointment.status === 'cancelled' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onViewDetails(appointment.id)}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  compactCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  compactType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  instructionsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#4B5563',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  rescheduleButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  rescheduleButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  viewDetailsIcon: {
    marginRight: 4,
  },
  viewDetailsText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  compactDetails: {
    marginTop: 4,
  },
  compactDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  compactDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
});