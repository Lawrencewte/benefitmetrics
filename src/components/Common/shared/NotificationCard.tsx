import { format, formatDistanceToNow } from 'date-fns';
import { AlertCircle, Award, Bell, Calendar, CheckCircle, Clock, X } from 'lucide-react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../ui/Button';
import Card from '../ui/Card';

export type NotificationType = 'reminder' | 'appointment' | 'achievement' | 'alert' | 'info';

export interface NotificationAction {
  label: string;
  onPress: () => void;
  primary?: boolean;
}

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: NotificationType;
  read?: boolean;
  actions?: NotificationAction[];
  onDismiss?: (id: string) => void;
  onPress?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  timestamp,
  type,
  read = false,
  actions = [],
  onDismiss,
  onPress,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'reminder':
        return <Clock width={20} height={20} color="#6B7280" />;
      case 'appointment':
        return <Calendar width={20} height={20} color="#2563EB" />;
      case 'achievement':
        return <Award width={20} height={20} color="#F59E0B" />;
      case 'alert':
        return <AlertCircle width={20} height={20} color="#EF4444" />;
      case 'info':
        return <CheckCircle width={20} height={20} color="#10B981" />;
      default:
        return <Bell width={20} height={20} color="#6B7280" />;
    }
  };

  const getBorderColor = () => {
    if (read) return '#E5E7EB'; // gray-200
    
    switch (type) {
      case 'appointment':
        return '#BFDBFE'; // blue-200
      case 'achievement':
        return '#FEF3C7'; // amber-100
      case 'alert':
        return '#FEE2E2'; // red-100
      case 'info':
        return '#D1FAE5'; // green-100
      case 'reminder':
      default:
        return '#F3F4F6'; // gray-100
    }
  };

  const getBackgroundColor = () => {
    if (read) return '#FFFFFF';
    
    switch (type) {
      case 'appointment':
        return '#EFF6FF'; // blue-50
      case 'achievement':
        return '#FFFBEB'; // amber-50
      case 'alert':
        return '#FEF2F2'; // red-50
      case 'info':
        return '#ECFDF5'; // green-50
      case 'reminder':
      default:
        return '#F9FAFB'; // gray-50
    }
  };

  const getTimeText = () => {
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - timestamp.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } else {
      return format(timestamp, 'MMM d, h:mm a');
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(id);
    }
  };

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.contentContainer}
        disabled={!onPress}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>{getIcon()}</View>
          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.time}>{getTimeText()}</Text>
          </View>
          
          {onDismiss && (
            <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
              <X width={16} height={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Message */}
        <Text style={styles.message}>{message}</Text>
        
        {/* Actions */}
        {actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.label}
                onPress={action.onPress}
                variant={action.primary ? 'primary' : 'outline'}
                size="small"
                style={[
                  styles.actionButton,
                  index < actions.length - 1 && styles.actionButtonWithMargin,
                ]}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 1,
  },
  contentContainer: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  dismissButton: {
    padding: 8,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonWithMargin: {
    marginRight: 8,
  },
});

export default NotificationCard;