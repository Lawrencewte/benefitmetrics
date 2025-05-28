import { useRouter } from 'expo-router';
import { ArrowUpCircle, Calendar, CheckCircle, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HealthScorePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data to prevent undefined errors
  const healthScore = 84;
  const scoreChange = 8;
  const level = 'Silver';
  const categoryScores = {
    'Preventative Care': 88,
    'Wellness Activities': 76,
    'Risk Factors': 91,
    'Dental Health': 85,
    'Vision Health': 80,
    'Mental Health': 75
  };
  const scoreHistory = [
    { date: 'May 2025', score: 84, change: 8 },
    { date: 'Apr 2025', score: 76, change: 4 },
    { date: 'Mar 2025', score: 72, change: -2 }
  ];
  const improvementSuggestions = [
    {
      id: '1',
      title: 'Schedule Annual Physical',
      description: 'Complete your yearly physical exam to boost your preventative care score',
      points: 15,
      appointmentType: 'physical'
    },
    {
      id: '2',
      title: 'Eye Exam',
      description: 'Schedule an eye exam to maintain your vision health',
      points: 10,
      appointmentType: 'vision'
    }
  ];
  
  const handleSuggestionAction = (suggestionId: string, actionType: string) => {
    if (actionType === 'schedule') {
      const suggestion = improvementSuggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        router.push({
          pathname: '/employee/appointments/schedule',
          params: { appointmentType: suggestion.appointmentType }
        });
      }
    } else if (actionType === 'complete') {
      console.log(`Marking suggestion ${suggestionId} as completed`);
    }
  };
  
  const getColorForScore = (score: number): string => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      'Preventative Care': 'Based on completion of recommended preventative screenings and checkups.',
      'Wellness Activities': 'Based on participation in wellness challenges and programs.',
      'Risk Factors': 'Based on identified health risk factors and management actions.',
      'Dental Health': 'Based on regular dental checkups and dental health maintenance.',
      'Vision Health': 'Based on regular vision exams and eye health maintenance.',
      'Mental Health': 'Based on mental health check-ins and stress management.'
    };
    
    return descriptions[category] || 'Score category description';
  };
  
  return (
    <View style={styles.container}>
      {/* Simple Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Score</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'improve' && styles.activeTab]}
          onPress={() => setActiveTab('improve')}
        >
          <Text style={[styles.tabText, activeTab === 'improve' && styles.activeTabText]}>Improve</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {activeTab === 'overview' && (
          <View>
            {/* Score Card */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>Your Health Score</Text>
                {scoreChange > 0 ? (
                  <View style={styles.changeBadge}>
                    <ArrowUpCircle size={12} color="#10B981" />
                    <Text style={styles.changeText}>{scoreChange} points</Text>
                  </View>
                ) : null}
              </View>
              
              {/* Simple Score Display */}
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreNumber}>{healthScore}</Text>
                <Text style={styles.scoreOutOf}>/ 100</Text>
              </View>
              
              <View style={styles.levelInfo}>
                <Text style={styles.levelText}>
                  {level} Level {level !== 'Gold' && '- Keep going!'}
                </Text>
                {level === 'Silver' && (
                  <Text style={styles.nextLevelText}>
                    1 more preventative check to reach Gold
                  </Text>
                )}
              </View>
            </View>
            
            {/* Score Breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Score Breakdown</Text>
              {Object.entries(categoryScores).map(([category, score]) => (
                <View key={category} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryScore}>{score}/100</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${score}%`,
                          backgroundColor: getColorForScore(score)
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => setActiveTab('details')}
              >
                <Text style={styles.linkButtonText}>See detailed breakdown</Text>
              </TouchableOpacity>
            </View>
            
            {/* Quick Improvements */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Improvements</Text>
              <View style={styles.quickImprovements}>
                {improvementSuggestions.slice(0, 2).map(suggestion => (
                  <View key={suggestion.id} style={styles.improvementItem}>
                    <View style={styles.improvementHeader}>
                      <CheckCircle size={18} color="#10B981" />
                      <Text style={styles.improvementTitle}>{suggestion.title}</Text>
                    </View>
                    <Text style={styles.improvementDescription}>{suggestion.description}</Text>
                    <View style={styles.improvementPoints}>
                      <Text style={styles.pointsText}>+{suggestion.points} points</Text>
                      <TouchableOpacity 
                        style={styles.scheduleBtn}
                        onPress={() => handleSuggestionAction(suggestion.id, 'schedule')}
                      >
                        <Text style={styles.scheduleBtnText}>Schedule</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => setActiveTab('improve')}
              >
                <Text style={styles.linkButtonText}>See all improvements</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {activeTab === 'details' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Category Details</Text>
              {Object.entries(categoryScores).map(([category, score]) => (
                <View key={category} style={styles.categoryDetail}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <Text style={styles.categoryScore}>{score}/100</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${score}%`,
                          backgroundColor: getColorForScore(score)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.categoryDescription}>
                    {getCategoryDescription(category)}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Score History</Text>
              <View style={styles.historyPlaceholder}>
                <Text style={styles.placeholderText}>Score Trend Chart</Text>
              </View>
              <View style={styles.historyDetails}>
                {scoreHistory.slice(0, 3).map((history, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyDate}>{history.date}</Text>
                    <Text style={styles.historyScore}>{history.score}</Text>
                    <Text style={[
                      styles.historyChange,
                      history.change > 0 ? styles.positiveChange : history.change < 0 ? styles.negativeChange : {}
                    ]}>
                      {history.change > 0 ? '+' : ''}{history.change}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'improve' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recommended Improvements</Text>
              <View style={styles.infoBox}>
                <Info size={16} color="#3B82F6" />
                <Text style={styles.infoText}>
                  Complete these suggested actions to improve your Health Score
                </Text>
              </View>
              
              {improvementSuggestions.map(suggestion => (
                <View key={suggestion.id} style={styles.improvementItem}>
                  <View style={styles.improvementHeader}>
                    <CheckCircle size={18} color="#10B981" />
                    <Text style={styles.improvementTitle}>{suggestion.title}</Text>
                  </View>
                  <Text style={styles.improvementDescription}>{suggestion.description}</Text>
                  <View style={styles.improvementPoints}>
                    <Text style={styles.pointsText}>+{suggestion.points} points</Text>
                    <TouchableOpacity 
                      style={styles.scheduleBtn}
                      onPress={() => handleSuggestionAction(suggestion.id, 'schedule')}
                    >
                      <Text style={styles.scheduleBtnText}>Schedule</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Next Level Benefits</Text>
              <View style={styles.nextLevelCard}>
                <Text style={styles.nextLevelTitle}>Gold Level Benefits</Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefit}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.benefitText}>50% discount on gym membership</Text>
                  </View>
                  <View style={styles.benefit}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.benefitText}>Priority appointment scheduling</Text>
                  </View>
                  <View style={styles.benefit}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.benefitText}>Additional wellness day off</Text>
                  </View>
                  <View style={styles.benefit}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.benefitText}>Access to premium health content</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => router.push('/employee/appointments/schedule')}
                >
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Schedule Missing Checkups</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3B82F6',
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  changeText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  scoreOutOf: {
    fontSize: 24,
    color: '#6B7280',
    marginLeft: 4,
  },
  levelInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  nextLevelText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    color: '#4B5563',
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickImprovements: {
    marginBottom: 8,
  },
  improvementItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  improvementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  improvementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 8,
  },
  improvementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  improvementPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  scheduleBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  categoryDetail: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  historyPlaceholder: {
    height: 150,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  historyDate: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  historyScore: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  historyChange: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  nextLevelCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  nextLevelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});