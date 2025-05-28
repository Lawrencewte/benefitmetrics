import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  notificationCount?: number;
  onBackPress?: () => void;           // ← Added this prop
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  rightComponent?: React.ReactNode;
  style?: any;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showNotifications = false,
  showProfile = false,
  notificationCount = 0,
  onBackPress,                        // ← Added this parameter
  onNotificationsPress,
  onProfilePress,
  backgroundColor = '#3b82f6', // Default blue color
  textColor = '#fff', // Default white text
  rightComponent,
  style
}) => {
  // ← Added this function to handle back navigation
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* Left side - Back button if needed */}
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}    // ← Added the onPress handler
        >
          <Text style={[styles.backText, { color: textColor }]}>← Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center - Title */}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>

      {/* Right side - Notifications, Profile, or Custom Component */}
      <View style={styles.rightSection}>
        {showNotifications && (
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
            <Text style={[styles.iconText, { color: textColor }]}>🔔</Text>
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity style={styles.iconButton} onPress={onProfilePress}>
            <Text style={[styles.iconText, { color: textColor }]}>👤</Text>
          </TouchableOpacity>
        )}
        
        {rightComponent && rightComponent}
        
        {!showNotifications && !showProfile && !rightComponent && (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44, // Account for status bar
    minHeight: 88,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    minWidth: 60,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  iconText: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
});

export default Header;