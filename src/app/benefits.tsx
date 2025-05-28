import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBenefits } from '../context/employee/BenefitsContext';

import BenefitsSummary from '../components/Benefits/BenefitsSummary';
import PartnerDiscountCard from '../components/Benefits/PartnerDiscountCard';
import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';

export default function BenefitsPage() {
  const { benefits, partnerDiscounts } = useBenefits();

  // This would be connected to a real contact function in a full implementation
  const handleContactCoordinator = () => {
    console.log('Contact Benefits Coordinator');
    // In a real app, you would show a contact form or open email/call options
  };

  return (
    <View style={styles.container}>
      <Header title="Your Benefits" showBackButton />
      
      <ScrollView style={styles.scrollView}>
        <BenefitsSummary benefits={benefits} />
        
        <Text style={styles.sectionTitle}>Partner Discounts</Text>
        
        {partnerDiscounts.map(discount => (
          <PartnerDiscountCard 
            key={discount.id} 
            discount={discount} 
          />
        ))}
        
        <Pressable
          style={styles.button}
          onPress={handleContactCoordinator}
        >
          <Text style={styles.buttonText}>Contact Benefits Coordinator</Text>
        </Pressable>
      </ScrollView>
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});