import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useChallenges } from '../context/employee/ChallengesContext';
import { useUser } from '../context/UserContext';

import ChallengeCard from '../components/Challenges/ChallengeCard';
import ChallengeProgress from '../components/Challenges/ChallengeProgress';
import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';

export default function ChallengesPage() {
  const { userData } = useUser();
  const { challenges, companyChallenge, completeChallenge } = useChallenges();

  return (
    <View style={styles.container}>
      <Header title="Health Challenges" showBackButton />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{userData.points} pts</Text>
        </View>
        
        <Text style={styles.description}>
          Complete these challenges to earn points that can be redeemed for rewards!
        </Text>
        
        {challenges.map(challenge => (
          <ChallengeCard 
            key={challenge.id} 
            challenge={challenge}
            onStart={() => completeChallenge(challenge.id)} 
          />
        ))}
        
        <ChallengeProgress challenge={companyChallenge} />
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
  pointsContainer: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  pointsText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
});