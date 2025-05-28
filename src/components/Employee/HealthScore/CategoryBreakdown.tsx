import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Types
import { HealthCategory } from '../../../types/employee';

type CategoryBreakdownProps = {
  categories: Record<HealthCategory | string, number>;
  showLabels?: boolean;
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ 
  categories, 
  showLabels = true 
}) => {
  // Get color for score
  const getColorForScore = (score: number): string => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };
  
  // Get icon based on category (would use actual icons in a real implementation)
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Preventative Care': '🩺',
      'Wellness Activities': '🏃',
      'Risk Factors': '📊',
      'Dental Health': '🦷',
      'Vision Health': '👁️',
      'Mental Health': '🧠',
    };
    
    return icons[category] || '📋';
  };
  
  return (
    <View style={styles.container}>
      {Object.entries(categories).map(([category, score], index) => (
        <View key={index} style={styles.categoryItem}>
          {showLabels && (
            <View style={styles.labelContainer}>
              <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
              <Text style={styles.categoryLabel}>{category}</Text>
            </View>
          )}
          
          <View style={styles.scoreContainer}>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${score}%`, backgroundColor: getColorForScore(score) }
                ]} 
              />
            </View>
            <Text style={[styles.scoreText, { color: getColorForScore(score) }]}>
              {score}
            </Text>
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
  categoryItem: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
});