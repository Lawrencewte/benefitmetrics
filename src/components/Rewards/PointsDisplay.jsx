import { Award } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PointsDisplay({ points }) {
  return (
    <View style={styles.container}>
      <Award size={22} color="#3B82F6" style={styles.icon} />
      <Text style={styles.pointsText}>{points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  icon: {
    marginRight: 6,
  },
  pointsText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 16,
  },
});