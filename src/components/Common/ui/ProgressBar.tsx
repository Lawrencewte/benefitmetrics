import React from 'react';
import { Text, View } from 'react-native';

interface ProgressBarProps {
  progress: number; // from 0 to 100 (percentage) or 0 to 1 (decimal)
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  color?: string; // Alternative prop name for progressColor
  showPercentage?: boolean;
  label?: string;
  style?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#F3F4F6',
  progressColor,
  color,
  showPercentage = false,
  label,
  style,
}) => {
  // Use color prop if provided, otherwise use progressColor, with fallback
  const finalProgressColor = color || progressColor || '#2563EB';
  
  // Handle both percentage (0-100) and decimal (0-1) inputs
  const normalizedProgress = progress > 1 ? progress / 100 : progress;
  const clampedProgress = Math.min(Math.max(normalizedProgress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  // Use inline styles instead of StyleSheet for web compatibility
  const containerStyle = {
    width: '100%',
    overflow: 'hidden',
    backgroundColor,
    height,
    borderRadius: height / 2,
    position: 'relative' as const,
    ...style,
  };

  const progressStyle = {
    width: `${percentage}%`,
    backgroundColor: finalProgressColor,
    height,
    borderRadius: height / 2,
    position: 'absolute' as const,
    left: 0,
    top: 0,
  };

  const labelContainerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 4,
  };

  const labelStyle = {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500' as const,
  };

  return (
    <View style={style}>
      {(label || showPercentage) && (
        <View style={labelContainerStyle}>
          {label && <Text style={labelStyle}>{label}</Text>}
          {showPercentage && <Text style={labelStyle}>{percentage}%</Text>}
        </View>
      )}
      <View style={containerStyle}>
        <View style={progressStyle} />
      </View>
    </View>
  );
};

export default ProgressBar;