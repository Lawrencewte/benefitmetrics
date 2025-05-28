import { AlertCircle, ArrowUpRight, Calendar, ChevronRight, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Types
import { NextBestAction } from '../../../types/employee';

type NextActionProps = {
  action: NextBestAction;
  onSchedule: () => void;
};

export const NextAction: React.FC<NextActionProps> = ({ action, onSchedule }) => {
  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#EF4444'; // Red
      case 'medium':
        return '#F59E0B'; // Amber
      case 'low':
        return '#10B981'; // Green
      default:
        return '#3B82F6'; // Blue
    }
  };
  
  // Get priority background color (lighter version)
  const getPriorityBackgroundColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#FEF2F2'; // Light red
      case 'medium':
        return '#FEF3C7'; // Light amber
      case 'low':
        return '#ECFDF5'; // Light green
      default:
        return '#EFF6FF'; // Light blue
    }
  };
  
  // Get priority border color
  const getPriorityBorderColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#FCA5A5'; // Light red
      case 'medium':
        return '#FDE68A'; // Light amber
      case 'low':
        return '#A7F3D0'; // Light green
      default:
        return '#BFDBFE'; // Light blue
    }
  };
  
  const priorityColor = getPriorityColor(action.priority);
  const priorityBackgroundColor = getPriorityBackgroundColor(action.priority);
  const priorityBorderColor = getPriorityBorderColor(action.priority);
  
  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: priorityBackgroundColor,
          borderColor: priorityBorderColor
        }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertCircle size={20} color={priorityColor} style={styles.alertIcon} />
          <Text style={styles.title}>Recommended Next Action</Text>
        </View>
        {action.priority === 'high' && (
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
            <Text style={styles.priorityText}>High Priority</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
      
      <View style={styles.detailsContainer}>
        {action.benefitValue && (
          <View style={styles.detailItem}>
            <ArrowUpRight size={16} color="#10B981" />
            <Text style={styles.benefitText}>
              ${action.benefitValue} estimated savings
            </Text>
          </View>
        )}
        
        {action.recommendedBy && (
          <View style={styles.detailItem}>
            <Text style={styles.recommendedText}>
              Recommended by: {action.recommendedBy}
            </Text>
          </View>
        )}
        
        {action.timeframe && (
          <View style={styles.detailItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.timeframeText}>
              {action.timeframe}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.scheduleButton, { backgroundColor: priorityColor }]}
          onPress={onSchedule}
        >
          <Calendar size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.scheduleButtonText}>Schedule Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.learnMoreButton}>
          <Text style={styles.learnMoreText}>Learn More</Text>
          <ChevronRight size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 6,
  },
  recommendedText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeframeText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonIcon: {
    marginRight: 6,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 2,
  },
});