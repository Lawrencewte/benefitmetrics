import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: any;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  icon,
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return '#EFF6FF'; // blue-50
      case 'success':
        return '#ECFDF5'; // green-50
      case 'warning':
        return '#FFFBEB'; // yellow-50
      case 'error':
        return '#FEF2F2'; // red-50
      case 'info':
        return '#F3F4F6'; // gray-100
      default:
        return '#F3F4F6'; // gray-100
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#2563EB'; // blue-600
      case 'success':
        return '#059669'; // green-600
      case 'warning':
        return '#D97706'; // yellow-600
      case 'error':
        return '#DC2626'; // red-600
      case 'info':
        return '#4B5563'; // gray-600
      default:
        return '#4B5563'; // gray-600
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 2, paddingHorizontal: 6 };
      case 'medium':
        return { paddingVertical: 4, paddingHorizontal: 8 };
      case 'large':
        return { paddingVertical: 6, paddingHorizontal: 10 };
      default:
        return { paddingVertical: 4, paddingHorizontal: 8 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'medium':
        return 12;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
  icon: {
    marginRight: 4,
  },
});

export default Badge;