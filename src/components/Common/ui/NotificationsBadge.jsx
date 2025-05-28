import { StyleSheet, Text, View } from 'react-native';

/**
 * NotificationBadge component for indicating unread notifications
 * @param {number} count - Number of notifications
 * @param {boolean} show - Whether to show the badge
 * @param {Object} style - Additional style to apply
 */
export default function NotificationBadge({ count = 0, show = true, style }) {
  if (!show || count <= 0) {
    return null;
  }

  // Display max of 99+
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444', // Red
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});