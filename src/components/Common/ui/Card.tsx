import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'highlight' | 'outline';
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  style?: any;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  onPress,
  variant = 'default',
  headerRight,
  footer,
  style,
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'highlight':
        return '#2563EB'; // blue-600
      case 'outline':
        return '#E5E7EB'; // gray-200
      default:
        return '#F3F4F6'; // gray-100
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'highlight':
        return '#EFF6FF'; // blue-50
      default:
        return '#FFFFFF'; // white
    }
  };

  const CardContent = () => (
    <View
      style={[
        styles.card,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
    >
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}
      
      <View style={styles.content}>{children}</View>
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});

export default Card;