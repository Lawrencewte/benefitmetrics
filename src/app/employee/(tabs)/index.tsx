import { Link } from 'expo-router';
import { ArrowRight, Calendar, CheckCircle, FileText, Gift, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Remove Footer import - not needed with Expo Router Tabs
// import Footer, { EMPLOYEE_TABS } from '../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import PointsDisplay from '../../../components/Common/shared/PointsDisplay';
import ProgressBar from '../../../components/Common/ui/ProgressBar';
import { useAuth } from '../../../hooks/Common/useAuth';
// Comment out problematic hooks for now
// import { useCareTimeline } from '../../hooks/employee/useCareTimeline';
// import { useHealthScore } from '../../hooks/employee/useHealthScore';
// import { useNextBestAction } from '../../hooks/employee/useNextBestAction';
// import { useROITracker } from '../../hooks/employee/useROITracker';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  
  // Mock data until hooks are fixed
  const healthScore = 84;
  const scoreTrend = 8;
  const scoreLevel = 'Silver';
  const totalSavings = 2210;
  const nextAppointment = {
    type: 'Annual Physical',
    date: 'May 28, 2025',
    time: '10:30 AM'
  };
  const nextAction = {
    title: 'Schedule your annual eye exam',
    actionText: 'Schedule Now'
  };
  
  // State to track which feature card is currently being highlighted
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  
  // Toggle highlight for a feature
  const toggleHighlight = (feature: string) => {
    setHighlightedFeature(highlightedFeature === feature ? null : feature);
  };

  return (
    <View style={styles.container}>
      {/* Header is integrated via component */}
      <Header />
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeContainer}>
          <View>
            <Text style={styles.welcomeText}>Hi, {user?.firstName || 'there'}!</Text>
            <Text style={styles.subtitleText}>Let's stay on top of your health</Text>
          </View>
          <PointsDisplay points={user?.points || 0} />
        </View>
        
        {/* Health Score Feature */}
        <TouchableOpacity 
          style={[
            styles.card, 
            highlightedFeature === 'health-score' && styles.highlightedCard
          ]}
          onPress={() => toggleHighlight('health-score')}
          activeOpacity={0.9}
        >
          {highlightedFeature === 'health-score' && (
            <View style={styles.newFeatureBadge}>
              <Text style={styles.newFeatureText}>NEW FEATURE</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Your Health Score</Text>
            <Text style={styles.scoreText}>{healthScore}</Text>
            <Text style={styles.trendText}>
              {scoreTrend > 0 ? `↑ ${scoreTrend} points` : scoreTrend < 0 ? `↓ ${Math.abs(scoreTrend)} points` : 'No change'}
            </Text>
            <ProgressBar progress={healthScore} />
            <View style={styles.scoreRange}>
              <Text style={styles.rangeText}>0</Text>
              <Text style={styles.rangeText}>{scoreLevel} Level - 1 point to Gold</Text>
              <Text style={styles.rangeText}>100</Text>
            </View>
          </View>
          
          {highlightedFeature === 'health-score' && (
            <View style={styles.featureDetail}>
              <Text style={styles.detailTitle}>Health Score System</Text>
              <Text style={styles.detailText}>
                Track your preventative health metrics across different categories with our proprietary Health Score.
              </Text>
              <View style={styles.categoriesContainer}>
                <View style={styles.category}>
                  <Text style={styles.categoryTitle}>Preventative Care</Text>
                  <Text style={styles.categoryValue}>88/100</Text>
                </View>
                <View style={styles.category}>
                  <Text style={styles.categoryTitle}>Wellness Activities</Text>
                  <Text style={styles.categoryValue}>76/100</Text>
                </View>
                <View style={styles.category}>
                  <Text style={styles.categoryTitle}>Risk Factors</Text>
                  <Text style={styles.categoryValue}>91/100</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.rowContainer}>
          {/* ROI Tracker Feature */}
          <TouchableOpacity 
            style={[
              styles.smallCard, 
              { flex: highlightedFeature === 'roi-tracker' ? 3 : 1 },
              highlightedFeature === 'roi-tracker' && styles.highlightedCard
            ]}
            onPress={() => toggleHighlight('roi-tracker')}
            activeOpacity={0.9}
          >
            {highlightedFeature === 'roi-tracker' && (
              <View style={styles.newFeatureBadge}>
                <Text style={styles.newFeatureText}>NEW FEATURE</Text>
              </View>
            )}
            <View style={styles.smallCardContent}>
              <Text style={styles.smallCardTitle}>ROI</Text>
              <Text style={styles.savingsText}>${totalSavings.toLocaleString()}</Text>
              <Text style={styles.smallSubtitle}>Savings</Text>
            </View>
            
            {highlightedFeature === 'roi-tracker' && (
              <View style={styles.featureDetail}>
                <Text style={styles.detailTitle}>ROI Tracker</Text>
                <Text style={styles.detailText}>
                  Visualize the financial benefits of your preventative healthcare activities.
                </Text>
                <View style={styles.savingsBreakdown}>
                  <View style={styles.savingsRow}>
                    <Text style={styles.savingsLabel}>Preventative Care:</Text>
                    <Text style={styles.savingsValue}>$1,850</Text>
                  </View>
                  <View style={styles.savingsRow}>
                    <Text style={styles.savingsLabel}>Premium Discounts:</Text>
                    <Text style={styles.savingsValue}>$360</Text>
                  </View>
                  <View style={styles.savingsRow}>
                    <Text style={styles.savingsLabel}>Early Detection Value:</Text>
                    <Text style={styles.savingsValue}>Priceless</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          {highlightedFeature !== 'roi-tracker' && (
            <View style={[styles.smallCard, { flex: 2 }]}>
              <View style={styles.smallCardContent}>
                <Text style={styles.smallCardTitle}>
                  Next: {nextAppointment?.type || 'No appointment'}
                </Text>
                {nextAppointment && (
                  <Text style={styles.appointmentDetail}>
                    {nextAppointment.date}, {nextAppointment.time}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
        
        {/* Care Timeline Feature */}
        <TouchableOpacity 
          style={[
            styles.infoCard, 
            highlightedFeature === 'care-timeline' && styles.highlightedInfoCard
          ]}
          onPress={() => toggleHighlight('care-timeline')}
          activeOpacity={0.9}
        >
          {highlightedFeature === 'care-timeline' && (
            <View style={styles.newFeatureBadge}>
              <Text style={styles.newFeatureText}>NEW FEATURE</Text>
            </View>
          )}
          <View style={styles.infoContent}>
            <Info style={styles.infoIcon} size={16} color="#4682B4" />
            <Text style={styles.infoText}>
              Your care timeline has been optimized to fit your work schedule and benefit deadlines.
            </Text>
          </View>
          
          {highlightedFeature === 'care-timeline' && (
            <View style={styles.featureDetail}>
              <Text style={styles.detailTitle}>Care Coordination Timeline</Text>
              <Text style={styles.detailText}>
                AI-powered appointment scheduling that considers:
              </Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={styles.benefitText}>Your work calendar and meetings</Text>
                </View>
                <View style={styles.benefitItem}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={styles.benefitText}>Benefits expiration deadlines</Text>
                </View>
                <View style={styles.benefitItem}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={styles.benefitText}>Provider availability</Text>
                </View>
                <View style={styles.benefitItem}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={styles.benefitText}>Health score optimization</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {/* Navigate to care timeline */}}
              >
                <Text style={styles.actionButtonText}>View Timeline</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Next Best Action */}
        {nextAction && (
          <View style={styles.nextActionCard}>
            <Text style={styles.nextActionTitle}>Recommended Next Action</Text>
            <Text style={styles.nextActionText}>{nextAction.title}</Text>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {/* Take next action */}}
              >
                <Text style={styles.actionButtonText}>{nextAction.actionText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <Link href="/employee/appointments/schedule" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <Calendar style={styles.actionIcon} size={24} color="#4682B4" />
              <Text style={styles.actionText}>Schedule Appointment</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/appointments/checkups" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <CheckCircle style={styles.actionIcon} size={24} color="#4682B4" />
              <Text style={styles.actionText}>Checkup Timeline</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/benefits/incentives" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <Gift style={styles.actionIcon} size={24} color="#4682B4" />
              <Text style={styles.actionText}>Redeem Rewards</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/features/tips" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <FileText style={styles.actionIcon} size={24} color="#4682B4" />
              <Text style={styles.actionText}>Wellness Tips</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <Text style={styles.sectionTitle}>Health Goals</Text>
        <View style={styles.goalsCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Annual Checkup Progress</Text>
            <Text style={styles.goalProgress}>2/4</Text>
          </View>
          <ProgressBar progress={50} />
        </View>
      </ScrollView>
      
      {/* REMOVE THIS - Footer is handled by _layout.tsx */}
      {/* <Footer 
        activePath="home"
        employee={true}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  highlightedCard: {
    borderColor: '#4682B4',
    borderWidth: 2,
    shadowColor: '#4682B4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4682B4',
    marginVertical: 4,
  },
  trendText: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
  },
  scoreRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  rangeText: {
    fontSize: 10,
    color: '#666',
  },
  newFeatureBadge: {
    backgroundColor: '#E6F0F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newFeatureText: {
    fontSize: 10,
    color: '#4682B4',
    fontWeight: '600',
  },
  featureDetail: {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  category: {
    alignItems: 'center',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4682B4',
    marginBottom: 2,
  },
  categoryValue: {
    fontSize: 10,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  smallCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  smallCardContent: {
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  smallSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  savingsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 4,
  },
  appointmentDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  savingsBreakdown: {
    marginTop: 8,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  savingsLabel: {
    fontSize: 10,
    color: '#666',
  },
  savingsValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  highlightedInfoCard: {
    borderColor: '#4682B4',
    borderWidth: 2,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4682B4',
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 10,
    color: '#333',
    marginLeft: 6,
  },
  actionButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  nextActionCard: {
    backgroundColor: '#FFFAEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  nextActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 4,
  },
  nextActionText: {
    fontSize: 12,
    color: '#333',
  },
  actionButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  goalsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalProgress: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
  },
});