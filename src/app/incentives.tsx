import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIncentives } from '../context/IncentivesContext';
import { useUser } from '../context/UserContext';

import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';
import IncentiveCard from '../components/Rewards/IncentiveCard';
import PointsDisplay from '../components/Rewards/PointsDisplay';

export default function IncentivesPage() {
  const { userData } = useUser();
  const { incentives, redeemIncentive } = useIncentives();

  const handleRedeemIncentive = (incentiveId) => {
    redeemIncentive(incentiveId);
  };

  return (
    <View style={styles.container}>
      <Header title="Rewards & Incentives" showBackButton />
      
      <ScrollView style={styles.scrollView}>
        <PointsDisplay points={userData.points} />
        
        <Text style={styles.description}>
          Redeem your earned points for these wellness rewards!
        </Text>
        
        {incentives.map(incentive => (
          <IncentiveCard 
            key={incentive.id} 
            incentive={incentive}
            userPoints={userData.points}
            onRedeem={() => handleRedeemIncentive(incentive.id)} 
          />
        ))}
        
        <Text style={styles.disclaimer}>
          Complete health challenges to earn more points. Points reset annually.
        </Text>
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
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 24,
  },
});