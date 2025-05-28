import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    Star as StarIcon,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Types
import { TimelineItem } from '../../../types/employee';

// Utils
import { formatDate } from '../../../utils/dateUtils';

type TimelineViewProps = {
  items: TimelineItem[];
};

export const TimelineView: React.FC<TimelineViewProps> = ({ items }) => {
  const router = useRouter();
  
  // Navigate to appointment details
  const navigateToDetails = (id: string) => {
    router.push({
      pathname: '/employee/appointments/details/[id]',
      params: { id }
    });
  };
  
  // Navigate to appointment scheduling
  const scheduleAppointment = (type?: string) => {
    router.push({
      pathname: '/employee/appointments/schedule',
      params: type ? { appointmentType: type } : {}
    });
  };
  
  // Group timeline items by month and year
  const groupedItems = items.reduce((groups, item) => {
    const date = new Date(item.date || Date.now());
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!groups[key]) {
      groups[key] = {
        monthYear: formatDate(date, 'MMMM YYYY'),
        items: []
      };
    }
    
    groups[key].items.push(item);
    return groups;
  }, {} as Record<string, { monthYear: string; items: TimelineItem[] }>);
  
  // Convert the grouped object to array for rendering
  const groupedItemsArray = Object.values(groupedItems);
  
  // Sort groups by date (most recent first)
  groupedItemsArray.sort((a, b) => {
    const dateA = new Date(a.monthYear);
    const dateB = new Date(b.monthYear);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Get status icon based on the item status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#10B981" />;
      case 'scheduled':
        return <Clock size={20} color="#3B82F6" />;
      case 'overdue':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'upcoming':
        return <Calendar size={20} color="#6366F1" />;
      case 'recommended':
        return <StarIcon size={20} color="#EC4899" />;
      default:
        return <Calendar size={20} color="#9CA3AF" />;
    }
  };
  
  // Get background color based on the item status
  const getItemBackgroundColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#ECFDF5'; // Light green
      case 'scheduled':
        return '#EFF6FF'; // Light blue
      case 'overdue':
        return '#FEF3C7'; // Light amber
      case 'upcoming':
        return '#EEF2FF'; // Light indigo
      case 'recommended':
        return '#FCE7F3'; // Light pink
      default:
        return '#F9FAFB'; // Light gray
    }
  };
  
  // Get border color based on the item status
  const getItemBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#A7F3D0'; // Green
      case 'scheduled':
        return '#BFDBFE'; // Blue
      case 'overdue':
        return '#FDE68A'; // Amber
      case 'upcoming':
        return '#C7D2FE'; // Indigo
      case 'recommended':
        return '#FBCFE8'; // Pink
      default:
        return '#E5E7EB'; // Gray
    }
  };
  
  // Get color for buttons based on the item status
  const getActionButtonColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981'; // Green
      case 'scheduled':
        return '#3B82F6'; // Blue
      case 'overdue':
        return '#F59E0B'; // Amber
      case 'upcoming':
        return '#6366F1'; // Indigo
      case 'recommended':
        return '#EC4899'; // Pink
      default:
        return '#6B7280'; // Gray
    }
  };
  
  // Render the timeline
  return (
    <View style={styles.container}>
      {groupedItemsArray.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.monthGroup}>
          <Text style={styles.monthHeader}>{group.monthYear}</Text>
          
          <View style={styles.timelineItems}>
            {group.items.map((item, itemIndex) => (
              <View 
                key={item.id} 
                style={[
                  styles.timelineItem,
                  {
                    backgroundColor: getItemBackgroundColor(item.status),
                    borderColor: getItemBorderColor(item.status)
                  }
                ]}
              >
                <View style={styles.timelineItemHeader}>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(item.status)}
                    {item.date && (
                      <Text style={styles.dateText}>
                        {formatDate(new Date(item.date), 'MMMM D, YYYY')}
                        {item.time && ` • ${item.time}`}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.typeContainer}>
                    <Text style={styles.typeText}>{item.type}</Text>
                    {item.provider && (
                      <Text style={styles.providerText}>{item.provider}</Text>
                    )}
                  </View>
                </View>
                
                {item.details && (
                  <Text style={styles.detailsText}>{item.details}</Text>
                )}
                
                <View style={styles.actionsContainer}>
                  {item.status === 'completed' && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => navigateToDetails(item.id)}
                    >
                      <Text style={[
                        styles.actionButtonText,
                        { color: getActionButtonColor(item.status) }
                      ]}>
                        View Details
                      </Text>
                      <ChevronRight 
                        size={16} 
                        color={getActionButtonColor(item.status)} 
                      />
                    </TouchableOpacity>
                  )}
                  
                  {item.status === 'scheduled' && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => navigateToDetails(item.id)}
                    >
                      <Text style={[
                        styles.actionButtonText,
                        { color: getActionButtonColor(item.status) }
                      ]}>
                        View Appointment
                      </Text>
                      <ChevronRight 
                        size={16} 
                        color={getActionButtonColor(item.status)} 
                      />
                    </TouchableOpacity>
                  )}
                  
                  {(item.status === 'overdue' || item.status === 'recommended') && (
                    <TouchableOpacity 
                      style={[
                        styles.scheduleButton,
                        { backgroundColor: getActionButtonColor(item.status) }
                      ]}
                      onPress={() => scheduleAppointment(item.type)}
                    >
                      <Text style={styles.scheduleButtonText}>
                        Schedule Now
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {item.status === 'upcoming' && (
                    <View style={styles.countdownContainer}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.countdownText}>
                        {item.countdown || 'Coming soon'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
      
      {items.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No items in your timeline for the selected filter.
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => scheduleAppointment()}
          >
            <Text style={styles.emptyStateButtonText}>
              Schedule Appointment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  monthGroup: {
    marginBottom: 24,
  },
  monthHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  timelineItems: {
    marginLeft: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
  },
  timelineItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
    position: 'relative',
  },
  timelineItemHeader: {
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  typeContainer: {
    marginLeft: 28, // Align with the text after icon
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  providerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailsText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
    marginLeft: 28,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 2,
  },
  scheduleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});