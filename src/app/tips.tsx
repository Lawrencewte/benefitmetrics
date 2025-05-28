import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWellness } from '../context/WellnessContext';

import Footer from '../components/Common/layout/Footer';
import Header from '../components/Common/layout/Header';
import TipCard from '../components/Wellness/TipCard';
import WeeklyFocus from '../components/Wellness/WeeklyFocus';

export default function TipsPage() {
  const { jobTips, weeklyFocus, setReminder } = useWellness();

  const handleSetReminder = () => {
    setReminder(weeklyFocus.topic);
  };

  return (
    <View style={styles.container}>
      <Header title="Workplace Wellness Tips" showBackButton />
      
      <ScrollView style={styles.scrollView}>
        <Text style={styles.description}>
          Tips customized for your job role: Software Developer
        </Text>
        
        {jobTips.map(tip => (
          <TipCard 
            key={tip.id} 
            tip={tip} 
          />
        ))}
        
        <WeeklyFocus 
          focus={weeklyFocus} 
          onSetReminder={handleSetReminder} 
        />
        
        <Text style={styles.footer}>
          Want more personalized tips? Complete your health profile for customized recommendations.
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
  footer: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 24,
    marginBottom: 16,
  },
});