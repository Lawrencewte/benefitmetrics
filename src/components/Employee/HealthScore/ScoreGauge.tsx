import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

type ScoreGaugeProps = {
  score: number;
  level: string;
  size?: 'small' | 'medium' | 'large';
};

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ 
  score, 
  level, 
  size = 'medium' 
}) => {
  // Calculate sizes based on the size prop
  const getSizeValues = () => {
    switch (size) {
      case 'small':
        return {
          width: 120,
          height: 80,
          scoreSize: 24,
          levelSize: 12,
          strokeWidth: 8,
          padding: 12,
        };
      case 'large':
        return {
          width: 200,
          height: 140,
          scoreSize: 40,
          levelSize: 16,
          strokeWidth: 12,
          padding: 20,
        };
      case 'medium':
      default:
        return {
          width: 160,
          height: 110,
          scoreSize: 32,
          levelSize: 14,
          strokeWidth: 10,
          padding: 16,
        };
    }
  };
  
  const { width, height, scoreSize, levelSize, strokeWidth, padding } = getSizeValues();
  
  // Calculate gauge parameters
  const radius = width / 2 - padding;
  const circumference = radius * Math.PI;
  const halfCircumference = circumference / 2;
  
  // Calculate the arc path for the gauge
  const getGaugePath = (percentage: number) => {
    const alpha = percentage * Math.PI;
    const sinAlpha = Math.sin(alpha);
    const cosAlpha = Math.cos(alpha);
    
    // Calculate the arc endpoints
    const startX = width / 2 - radius;
    const startY = height - padding;
    const endX = width / 2 + radius * cosAlpha;
    const endY = height - padding - radius * sinAlpha;
    
    // Create the arc path
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };
  
  // Calculate the progress value (0-1)
  const progressValue = score / 100;
  
  // Get the appropriate color based on the score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981'; // Green for high scores
    if (score >= 60) return '#F59E0B'; // Yellow for medium scores
    return '#EF4444'; // Red for low scores
  };
  
  const scoreColor = getScoreColor(score);
  
  // Get level badge color
  const getLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'gold':
        return '#F59E0B'; // Gold
      case 'silver':
        return '#9CA3AF'; // Silver
      case 'bronze':
        return '#B45309'; // Bronze
      default:
        return '#6B7280'; // Default gray
    }
  };
  
  const levelColor = getLevelColor(level);
  
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background track */}
        <Path
          d={getGaugePath(1)}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <Path
          d={getGaugePath(progressValue)}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Center text */}
        <G>
          <SvgText
            x={width / 2}
            y={height - padding - radius / 2 + scoreSize / 3}
            fontSize={scoreSize}
            fontWeight="bold"
            fill="#1F2937"
            textAnchor="middle"
          >
            {score}
          </SvgText>
        </G>
      </Svg>
      
      <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
        <Text style={styles.levelText}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});