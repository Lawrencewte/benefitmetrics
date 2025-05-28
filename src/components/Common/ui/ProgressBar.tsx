import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  progress: number; // from 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  label?: string;
  style?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#F3F4F6', // gray-100
  progressColor = '#2563EB', // blue-600
  showPercentage = false,
  label,
  style,
}) => {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(normalizedProgress * 100);

  const getProgressColor = () => {
    // Optional: You could make color conditional based on progress value
    return progressColor;
  };

  return (
    <View style={style}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
        </View>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              width: `${percentage}%`,
              backgroundColor: getProgressColor(),
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    fontWeight: '500',
  },
});

export default ProgressBar;