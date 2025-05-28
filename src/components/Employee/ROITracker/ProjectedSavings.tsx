import { TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProjectionData = {
  '1year': number;
  '3year': number;
  '5year': number;
  '10year'?: number;
};

type ProjectedSavingsProps = {
  projected: {
    current: ProjectionData;
    optimal: ProjectionData;
  };
  current: number;
  showTenYear?: boolean;
};

export const ProjectedSavings: React.FC<ProjectedSavingsProps> = ({ 
  projected,
  current,
  showTenYear = false
}) => {
  // Format number with commas
  const formatAmount = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Get color based on the difference percentage
  const getDifferenceColor = (current: number, optimal: number): string => {
    const diffPercentage = ((optimal - current) / current) * 100;
    
    if (diffPercentage >= 50) return '#10B981'; // Green for significant improvement
    if (diffPercentage >= 20) return '#F59E0B'; // Amber for moderate improvement
    return '#6B7280'; // Gray for minimal improvement
  };
  
  // Calculate the projected years to show
  const yearsToShow = showTenYear 
    ? ['1year', '3year', '5year', '10year'] 
    : ['1year', '3year', '5year'];
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}></Text>
        <Text style={styles.headerCell}>Current Path</Text>
        <Text style={styles.headerCell}>Optimal Path</Text>
        <Text style={styles.headerCell}>Difference</Text>
      </View>
      
      {/* Current (today) row */}
      <View style={styles.dataRow}>
        <Text style={styles.timeframeCell}>Today</Text>
        <Text style={styles.valueCell}>${formatAmount(current)}</Text>
        <Text style={styles.valueCell}>-</Text>
        <Text style={styles.valueCell}>-</Text>
      </View>
      
      {/* Projection years */}
      {yearsToShow.map((year) => {
        if (!projected.current[year] || !projected.optimal[year]) return null;
        
        const currentValue = projected.current[year];
        const optimalValue = projected.optimal[year];
        const difference = optimalValue - currentValue;
        const differenceColor = getDifferenceColor(currentValue, optimalValue);
        
        return (
          <View key={year} style={styles.dataRow}>
            <Text style={styles.timeframeCell}>
              {year.replace('year', ' Year')}
            </Text>
            <Text style={styles.valueCell}>
              ${formatAmount(currentValue)}
            </Text>
            <Text style={styles.valueCell}>
              ${formatAmount(optimalValue)}
            </Text>
            <View style={styles.differenceCell}>
              <TrendingUp size={12} color={differenceColor} style={styles.differenceIcon} />
              <Text style={[styles.differenceText, { color: differenceColor }]}>
                +${formatAmount(difference)}
              </Text>
            </View>
          </View>
        );
      })}
      
      <View style={styles.notesContainer}>
        <Text style={styles.notesText}>
          Optimal path includes additional preventative care and benefit optimization
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeframeCell: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
  },
  valueCell: {
    flex: 1,
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  differenceCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  differenceIcon: {
    marginRight: 2,
  },
  differenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
  },
  notesText: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});