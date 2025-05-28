import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function IncentiveCard({ incentive, userPoints, onRedeem }) {
  const canRedeem = userPoints >= incentive.cost;
  const pointsNeeded = incentive.cost - userPoints;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.incentiveName}>{incentive.name}</Text>
        <Text style={styles.costText}>{incentive.cost} pts</Text>
      </View>
      
      <Text style={styles.description}>{incentive.description}</Text>
      
      <Pressable
        style={[
          styles.button,
          !canRedeem && styles.disabledButton
        ]}
        onPress={onRedeem}
        disabled={!canRedeem}
      >
        <Text style={[
          styles.buttonText,
          !canRedeem && styles.disabledButtonText
        ]}>
          {canRedeem 
            ? 'Redeem Reward' 
            : `Need ${pointsNeeded} more points`
          }
        </Text>
      </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incentiveName: {
    fontWeight: '500',
    fontSize: 15,
  },
  costText: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});