import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BenefitsSummary({ benefits }) {
  return (
    <View style={styles.card}>
      <Text style={styles.companyTitle}>{benefits.company} Benefits</Text>
      
      <View style={styles.benefitRow}>
        <Text style={styles.benefitLabel}>Plan:</Text>
        <Text style={styles.benefitValue}>{benefits.plan}</Text>
      </View>
      
      <View style={styles.benefitRow}>
        <Text style={styles.benefitLabel}>Preventative Care Coverage:</Text>
        <Text style={styles.benefitValue}>{benefits.preventativeCoverage}</Text>
      </View>
      
      <View style={styles.benefitRow}>
        <Text style={styles.benefitLabel}>Annual Exam Allowance:</Text>
        <Text style={styles.benefitValue}>{benefits.annualExamAllowance}</Text>
      </View>
      
      <View style={styles.benefitRow}>
        <Text style={styles.benefitLabel}>Wellness Funds:</Text>
        <Text style={styles.benefitValue}>{benefits.wellnessFunds}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  companyTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  benefitLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  benefitValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});