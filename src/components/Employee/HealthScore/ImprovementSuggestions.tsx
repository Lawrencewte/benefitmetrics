import { AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Types
import { HealthImprovement } from '../../../types/employee';

type ImprovementSuggestionsProps = {
  suggestions: HealthImprovement[];
  onAction: (id: string, actionType: string) => void;
};

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ 
  suggestions,
  onAction
}) => {
  // Get icon based on improvement type
  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={20} color="#3B82F6" />;
      case 'checkup':
        return <CheckCircle size={20} color="#10B981" />;
      case 'overdue':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'upcoming':
        return <Clock size={20} color="#6366F1" />;
      default:
        return <CheckCircle size={20} color="#3B82F6" />;
    }
  };
  
  // Get border color based on improvement type
  const getBorderColor = (type: string): string => {
    switch (type) {
      case 'appointment':
        return '#BFDBFE'; // Light blue
      case 'checkup':
        return '#A7F3D0'; // Light green
      case 'overdue':
        return '#FDE68A'; // Light amber
      case 'upcoming':
        return '#C7D2FE'; // Light indigo
      default:
        return '#E5E7EB'; // Light gray
    }
  };
  
  return (
    <View style={styles.container}>
      {suggestions.map((suggestion) => (
        <View 
          key={suggestion.id} 
          style={[
            styles.suggestionCard,
            { borderLeftColor: getBorderColor(suggestion.type) }
          ]}
        >
          <View style={styles.suggestionHeader}>
            <View style={styles.suggestionIcon}>
              {getImprovementIcon(suggestion.type)}
            </View>
            <View style={styles.suggestionTitleContainer}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionPoints}>+{suggestion.points} points</Text>
            </View>
          </View>
          
          <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
          
          {suggestion.timeframe && (
            <View style={styles.timeframeContainer}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.timeframeText}>{suggestion.timeframe}</Text>
            </View>
          )}
          
          <View style={styles.actionContainer}>
            {suggestion.actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionButton,
                  action.primary ? styles.primaryActionButton : styles.secondaryActionButton
                ]}
                onPress={() => onAction(suggestion.id, action.type)}
              >
                <Text 
                  style={[
                    styles.actionButtonText,
                    action.primary ? styles.primaryActionText : styles.secondaryActionText
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  suggestionPoints: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeframeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  primaryActionButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryActionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  primaryActionText: {
    color: '#FFFFFF',
  },
  secondaryActionText: {
    color: '#4B5563',
  },
});