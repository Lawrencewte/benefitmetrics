import { Award, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PointsDisplayProps {
  points: number;
  change?: number;
  showChange?: boolean;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: any;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  change = 0,
  showChange = false,
  showIcon = true,
  size = 'medium',
  onPress,
  style,
}) => {
  const isPositiveChange = change > 0;
  const hasChange = change !== 0;

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return {
          points: 14,
          change: 10,
        };
      case 'medium':
        return {
          points: 16,
          change: 12,
        };
      case 'large':
        return {
          points: 20,
          change: 14,
        };
      default:
        return {
          points: 16,
          change: 12,
        };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 18;
      case 'large':
        return 22;
      default:
        return 18;
    }
  };

  const getContainerPadding = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
        };
      case 'medium':
        return {
          paddingVertical: 6,
          paddingHorizontal: 10,
        };
      case 'large':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
        };
      default:
        return {
          paddingVertical: 6,
          paddingHorizontal: 10,
        };
    }
  };

  const fontSizes = getFontSize();
  const iconSize = getIconSize();
  const containerPadding = getContainerPadding();

  const PointsContent = () => (
    <View
      style={[
        styles.container,
        containerPadding,
        style,
      ]}
    >
      {showIcon && (
        <Award
          width={iconSize}
          height={iconSize}
          color="#2563EB"
          style={styles.icon}
        />
      )}
      
      <Text
        style={[
          styles.points,
          {
            fontSize: fontSizes.points,
          },
        ]}
      >
        {points} pts
      </Text>
      
      {showChange && hasChange && (
        <View style={styles.changeContainer}>
          {isPositiveChange ? (
            <TrendingUp
              width={iconSize - 4}
              height={iconSize - 4}
              color="#10B981"
              style={styles.changeIcon}
            />
          ) : (
            <TrendingDown
              width={iconSize - 4}
              height={iconSize - 4}
              color="#EF4444"
              style={styles.changeIcon}
            />
          )}
          
          <Text
            style={[
              styles.changeText,
              {
                color: isPositiveChange ? '#10B981' : '#EF4444',
                fontSize: fontSizes.change,
              },
            ]}
          >
            {isPositiveChange ? '+' : ''}{change}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <PointsContent />
      </TouchableOpacity>
    );
  }

  return <PointsContent />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF', // blue-50
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  points: {
    fontWeight: '600',
    color: '#2563EB', // blue-600
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  changeIcon: {
    marginRight: 2,
  },
  changeText: {
    fontWeight: '500',
  },
});

export default PointsDisplay;