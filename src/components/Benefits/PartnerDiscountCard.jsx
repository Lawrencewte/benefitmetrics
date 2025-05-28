import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PartnerDiscountCard({ discount }) {
  return (
    <View style={styles.card}>
      <Text style={styles.partnerName}>{discount.partner}</Text>
      <Text style={styles.discountText}>{discount.discount}</Text>
      <Text style={styles.expiryText}>Expires: {discount.expires}</Text>
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
  partnerName: {
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 4,
  },
  discountText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  expiryText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});