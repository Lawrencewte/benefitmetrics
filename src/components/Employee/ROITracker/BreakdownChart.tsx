import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Text } from 'react-native-svg';

type ChartData = Record<string, number>;

type BreakdownChartProps = {
  data: ChartData;
  size?: number;
};

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ 
  data,
  size = 180
}) => {
  // Calculate the total value
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  // Define color mapping for categories
  const colorMap: Record<string, string> = {
    'Preventative Care': '#3B82F6', // Blue
    'Premium Discounts': '#10B981', // Green
    'Benefit Optimization': '#F59E0B', // Amber
    'Early Detection': '#8B5CF6', // Purple
    'Wellness Incentives': '#EC4899', // Pink
    // Add more categories as needed
  };
  
  // Default color for undefined categories
  const defaultColor = '#9CA3AF'; // Gray
  
  // Calculate the pie segments
  const createPieSegments = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10; // Leave some padding
    
    let startAngle = 0;
    const segments = [];
    
    Object.entries(data).forEach(([category, value], index) => {
      const percentage = value / total;
      const angle = percentage * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      // Calculate path
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      // Determine if we need to use the large arc flag
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      // Create the path
      const path = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
      
      // Get the color for this category
      const color = colorMap[category] || defaultColor;
      
      // Calculate position for the percentage label
      // Position it halfway through the segment
      const labelAngle = startAngle + angle / 2;
      const labelRadius = radius * 0.7; // Position the label at 70% of the radius
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);
      
      // Only show label if segment is large enough
      const showLabel = percentage >= 0.1; // Only show for segments that are at least 10% of the total
      
      // Calculate percent to display
      const percentText = `${Math.round(percentage * 100)}%`;
      
      segments.push({
        path,
        color,
        labelX,
        labelY,
        showLabel,
        percentText,
        startAngle,
        endAngle,
      });
      
      startAngle = endAngle;
    });
    
    return segments;
  };
  
  const segments = createPieSegments();
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {segments.map((segment, index) => (
            <React.Fragment key={index}>
              <Path
                d={segment.path}
                fill={segment.color}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
              {segment.showLabel && (
                <Text
                  x={segment.labelX}
                  y={segment.labelY}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.percentText}
                </Text>
              )}
            </React.Fragment>
          ))}
          {/* Add a center circle to create a donut chart */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 6} // Inner circle radius
            fill="#FFFFFF"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});