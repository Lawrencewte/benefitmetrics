import React from 'react';
import { StyleSheet, View } from 'react-native';
import CheckupCard from './CheckupCard';

export default function CheckupList({ checkups, onSchedule }) {
  return (
    <View style={styles.container}>
      {checkups.map(checkup => (
        <CheckupCard 
          key={checkup.id} 
          checkup={checkup} 
          onSchedule={() => onSchedule(checkup.id)} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});