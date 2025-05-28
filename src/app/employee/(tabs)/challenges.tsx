import { Calendar, CheckCircle, Clock, Filter, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CheckupStatus = 'completed' | 'scheduled' | 'due' | 'overdue' | 'recommended';

type Checkup = {
  id: string;
  name: string;
  frequency: string;
  lastDate?: string;
  nextDue?: string;
  status: CheckupStatus;
  category: string;
  description: string;
  appointmentId?: string;
};

export default function ChallengesScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Sample data - in a real app, this would come from an API or context
  const challenges = [
    {
      id: '1',
      name: 'Schedule Annual Physical',
      points: 100,
      completed: true,
      category: 'Preventive Care',
      description: 'Book and complete your annual physical examination',
      dueDate: 'Completed May 15, 2025'
    },
    {
      id: '2',
      name: 'Complete Dental Check-up',
      points: 75,
      completed: true,
      category: 'Dental Care',
      description: 'Visit your dentist for a routine cleaning and checkup',
      dueDate: 'Completed April 20, 2025'
    },
    {
      id: '3',
      name: 'Schedule Skin Cancer Screening',
      points: 100,
      completed: false,
      category: 'Dermatology',
      description: 'Book an appointment with a dermatologist for skin screening',
      dueDate: 'Due: June 30, 2025'
    },
    {
      id: '4',
      name: 'Schedule Eye Exam',
      points: 75,
      completed: false,
      category: 'Vision Care',
      description: 'Get your annual eye examination and vision screening',
      dueDate: 'Due: July 15, 2025'
    },
    {
      id: '5',
      name: 'Health Risk Assessment',
      points: 50,
      completed: false,
      category: 'Assessment',
      description: 'Complete the online health risk assessment questionnaire',
      dueDate: 'Due: May 31, 2025'
    },
    {
      id: '6',
      name: 'Flu Vaccination',
      points: 25,
      completed: true,
      category: 'Immunization',
      description: 'Get your annual flu shot',
      dueDate: 'Completed October 2024'
    }
  ];
  
  const categories = ['All', 'Preventive Care', 'Dental Care', 'Vision Care', 'Dermatology', 'Assessment', 'Immunization'];
  
  const statusFilters = {
    all: 'All',
    completed: 'Completed',
    pending: 'Pending',
    high_points: 'High Points (75+)'
  };
  
  // Filter challenges based on active filter
  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return challenge.completed;
    if (activeFilter === 'pending') return !challenge.completed;
    if (activeFilter === 'high_points') return challenge.points >= 75;
    return challenge.category.toLowerCase() === activeFilter.toLowerCase();
  });
  
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, challenge) => sum + challenge.points, 0);
  const completedCount = challenges.filter(c => c.completed).length;
  
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {Object.entries(statusFilters).map(([key, label]) => (
          <TouchableOpacity
            key={`status-${key}`}
            style={[styles.filterChip, activeFilter === key && styles.activeFilterChip]}
            onPress={() => setActiveFilter(key)}
          >
            <Text 
              style={[styles.filterChipText, activeFilter === key && styles.activeFilterChipText]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        
        {categories.filter(cat => cat.toLowerCase() !== 'all').map(category => (
          <TouchableOpacity
            key={`category-${category}`}
            style={[styles.filterChip, activeFilter === category.toLowerCase().replace(' ', '_') && styles.activeFilterChip]}
            onPress={() => setActiveFilter(category.toLowerCase().replace(' ', '_'))}
          >
            <Text 
              style={[styles.filterChipText, activeFilter === category.toLowerCase().replace(' ', '_') && styles.activeFilterChipText]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView style={styles.content}>
        {/* Points Summary */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <Text style={styles.pointsTitle}>Your Points</Text>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsValue}>{totalPoints}</Text>
            </View>
          </View>
          <Text style={styles.pointsSubtext}>
            {completedCount} of {challenges.length} challenges completed
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedCount / challenges.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
        
        {/* Company Challenge */}
        <View style={styles.companyChallenge}>
          <View style={styles.companyChallengeHeader}>
            <Text style={styles.companyChallengeTitle}>Company Challenge</Text>
            <Text style={styles.companyChallengeSubtitle}>Step Challenge: Walk 8,000 steps per day for a week</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <Text style={styles.progressText}>5/7 days completed</Text>
          </View>
        </View>
        
        {/* Individual Challenges */}
        <Text style={styles.sectionTitle}>Individual Challenges</Text>
        
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map(challenge => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeTitleContainer}>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengeCategory}>{challenge.category}</Text>
                </View>
                <View style={styles.challengePoints}>
                  <View style={[
                    styles.statusIcon,
                    { backgroundColor: challenge.completed ? '#4CAF50' : '#FF9800' }
                  ]}>
                    {challenge.completed ? (
                      <CheckCircle size={16} color="#FFF" />
                    ) : (
                      <Clock size={16} color="#FFF" />
                    )}
                  </View>
                  <Text style={styles.pointsText}>{challenge.points} pts</Text>
                </View>
              </View>
              
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              
              <View style={styles.challengeDetails}>
                <Text style={styles.dueDateText}>{challenge.dueDate}</Text>
              </View>
              
              {!challenge.completed && (
                <TouchableOpacity style={styles.startButton}>
                  <Calendar size={16} color="#FFF" style={styles.buttonIcon} />
                  <Text style={styles.startButtonText}>Start Challenge</Text>
                </TouchableOpacity>
              )}
              
              {challenge.completed && (
                <View style={styles.completedBadge}>
                  <CheckCircle size={16} color="#4CAF50" style={styles.completedIcon} />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Filter size={40} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No challenges match your filter</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={styles.resetButtonText}>Show All Challenges</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Info size={20} color="#4682B4" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Complete these challenges to earn points that can be redeemed for rewards! Points reset annually.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  filterScrollView: {
    maxHeight: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  filterChip: {
    backgroundColor: '#F5F7F9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterChip: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#FFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  pointsCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4682B4',
  },
  pointsBadge: {
    backgroundColor: '#4682B4',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  pointsSubtext: {
    fontSize: 12,
    color: '#4682B4',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#C9DEF0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4682B4',
    borderRadius: 3,
  },
  companyChallenge: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  companyChallengeHeader: {
    marginBottom: 12,
  },
  companyChallengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  companyChallengeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  challengeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeCategory: {
    fontSize: 12,
    color: '#666',
  },
  challengePoints: {
    alignItems: 'center',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  challengeDetails: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#4682B4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  startButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  completedIcon: {
    marginRight: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4682B4',
    lineHeight: 20,
  },
});