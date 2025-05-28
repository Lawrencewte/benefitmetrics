import { DollarSign } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SavingsSummaryProps = {
  totalSavings: number;
  animationDuration?: number;
};

export const SavingsSummary: React.FC<SavingsSummaryProps> = ({ 
  totalSavings,
  animationDuration = 2000
}) => {
  // Format number with commas
  const formatAmount = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // In a real implementation, we would use animated values
  // Here's a simplified static version
  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <View style={styles.dollarSignContainer}>
          <DollarSign size={32} color="#10B981" />
        </View>
        <Text style={styles.amount}>{formatAmount(totalSavings)}</Text>
      </View>
      <Text style={styles.subtitle}>Total healthcare savings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dollarSignContainer: {
    marginRight: 4,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});