import { Info, Shield, ShieldOff } from 'lucide-react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SecurityLevel = 'high' | 'medium' | 'low' | 'risk';

interface SecurityBadgeProps {
  level: SecurityLevel;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: any;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  level,
  showText = true,
  size = 'medium',
  onPress,
  style,
}) => {
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return {
          width: 24,
          height: 24,
          borderRadius: 12,
        };
      case 'medium':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'large':
        return {
          width: 40,
          height: 40,
          borderRadius: 20,
        };
      default:
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 14;
      case 'large':
        return 16;
      default:
        return 14;
    }
  };

  const getSecurityColors = () => {
    switch (level) {
      case 'high':
        return {
          background: '#D1FAE5', // green-100
          icon: '#10B981', // green-500
          text: '#047857', // green-700
        };
      case 'medium':
        return {
          background: '#FEF3C7', // amber-100
          icon: '#F59E0B', // amber-500
          text: '#B45309', // amber-700
        };
      case 'low':
        return {
          background: '#FEE2E2', // red-100
          icon: '#EF4444', // red-500
          text: '#B91C1C', // red-700
        };
      case 'risk':
        return {
          background: '#FEE2E2', // red-100
          icon: '#EF4444', // red-500
          text: '#B91C1C', // red-700
        };
      default:
        return {
          background: '#D1FAE5', // green-100
          icon: '#10B981', // green-500
          text: '#047857', // green-700
        };
    }
  };

  const getSecurityText = () => {
    switch (level) {
      case 'high':
        return 'High Security';
      case 'medium':
        return 'Medium Security';
      case 'low':
        return 'Low Security';
      case 'risk':
        return 'Security Risk';
      default:
        return 'Unknown';
    }
  };

  const securityColors = getSecurityColors();
  const iconSize = getIconSize();
  const badgeSize = getBadgeSize();
  const textSize = getTextSize();

  const renderIcon = () => {
    if (level === 'risk') {
      return <ShieldOff width={iconSize} height={iconSize} color={securityColors.icon} />;
    }
    return <Shield width={iconSize} height={iconSize} color={securityColors.icon} />;
  };

  const Badge = () => (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: securityColors.background,
          ...badgeSize,
        },
        style,
      ]}
    >
      {renderIcon()}
    </View>
  );

  return (
    <View style={styles.container}>
      {onPress ? (
        <TouchableOpacity onPress={onPress} style={styles.touchable}>
          <Badge />
          {showText && (
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color: securityColors.text,
                    fontSize: textSize,
                  },
                ]}
              >
                {getSecurityText()}
              </Text>
              <Info width={14} height={14} color="#9CA3AF" style={styles.infoIcon} />
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <Badge />
          {showText && (
            <Text
              style={[
                styles.text,
                {
                  color: securityColors.text,
                  fontSize: textSize,
                },
              ]}
            >
              {getSecurityText()}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  text: {
    fontWeight: '500',
    marginLeft: 8,
  },
  infoIcon: {
    marginLeft: 4,
  },
});

export default SecurityBadge;