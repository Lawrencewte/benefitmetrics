import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function NotificationCard({ notification, onActionPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
      
      <View style={styles.actionsContainer}>
        {notification.actions.map((action) => (
          <Pressable
            key={action.id}
            style={[
              styles.button,
              action.type === 'primary' ? styles.primaryButton : styles.secondaryButton
            ]}
            onPress={() => onActionPress(action.route)}
          >
            <Text 
              style={[
                styles.buttonText,
                action.type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#6B7280',
  },
});