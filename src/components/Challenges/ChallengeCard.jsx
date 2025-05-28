import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ChallengeCard({ challenge, onStart }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <CheckCircle 
          size={20} 
          color={challenge.completed ? '#10B981' : '#D1D5DB'} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.challengeName}>{challenge.name}</Text>
        <Text style={styles.pointsText}>{challenge.points} points</Text>
      </View>
      
      {!challenge.completed && (
        <Pressable
          style={styles.button}
          onPress={onStart}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  challengeName: {
    fontWeight: '500',
    fontSize: 15,
  },
  pointsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});