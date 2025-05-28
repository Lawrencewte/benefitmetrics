import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TipCard({ tip }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tip #{tip.id}</Text>
      <Text style={styles.tipText}>{tip.tip}</Text>
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
  tipText: {
    fontSize: 14,
    color: '#6B7280',
  },
});