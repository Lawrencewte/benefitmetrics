import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function WeeklyFocus({ focus, onSetReminder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Focus: {focus.topic}</Text>
      <Text style={styles.description}>{focus.description}</Text>
      
      <Pressable
        style={styles.button}
        onPress={onSetReminder}
      >
        <Text style={styles.buttonText}>Set Reminder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBF5FF',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    borderColor: '#DBEAFE',
    borderWidth: 1,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});