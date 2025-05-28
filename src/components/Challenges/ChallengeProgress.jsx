import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ChallengeProgress({ challenge }) {
  const progressPercentage = (challenge.daysCompleted / challenge.totalDays) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Challenge</Text>
      <Text style={styles.description}>{challenge.name}: {challenge.description}</Text>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
      
      <Text style={styles.progressText}>
        {challenge.daysCompleted}/{challenge.totalDays} days completed
      </Text>
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
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'right',
  },
});