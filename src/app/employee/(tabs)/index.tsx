import { Link } from 'expo-router';
import { ArrowRight, Calendar, CheckCircle, FileText, Gift, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import PointsDisplay from '../../../components/Common/shared/PointsDisplay';
import ProgressBar from '../../../components/Common/ui/ProgressBar';
import { useAuth } from '../../../hooks/Common/useAuth';

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

  // Define inline styles for React Native Web compatibility
  const containerStyle = {
    flex: 1,
    backgroundColor: '#F5F7F9',
  };

  const contentStyle = {
    flex: 1,
    padding: 16,
  };

  const welcomeContainerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
  };

  const welcomeTextStyle = {
    fontSize: 20,
    fontWeight: '600' as const,
  };

  const subtitleTextStyle = {
    fontSize: 14,
    color: '#666',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  };

  const highlightedCardStyle = {
    borderColor: '#4682B4',
    borderWidth: 2,
    shadowColor: '#4682B4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  };

  const cardContentStyle = {
    alignItems: 'center' as const,
  };

  const cardTitleStyle = {
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 4,
  };

  const scoreTextStyle = {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: '#4682B4',
    marginVertical: 4,
  };

  const trendTextStyle = {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
  };

  const scoreRangeStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
    marginTop: 4,
  };

  const rangeTextStyle = {
    fontSize: 10,
    color: '#666',
  };

  const newFeatureBadgeStyle = {
    backgroundColor: '#E6F0F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start' as const,
    marginBottom: 8,
  };

  const newFeatureTextStyle = {
    fontSize: 10,
    color: '#4682B4',
    fontWeight: '600' as const,
  };

  const featureDetailStyle = {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  };

  const detailTitleStyle = {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4682B4',
    marginBottom: 4,
  };

  const detailTextStyle = {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  };

  const categoriesContainerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 8,
  };

  const categoryStyle = {
    alignItems: 'center' as const,
    flex: 1,
  };

  const categoryTitleStyle = {
    fontSize: 10,
    fontWeight: '500' as const,
    color: '#4682B4',
    marginBottom: 2,
  };

  const categoryValueStyle = {
    fontSize: 10,
    color: '#333',
  };

  const rowContainerStyle = {
    flexDirection: 'row' as const,
    marginBottom: 16,
    gap: 8,
  };

  const smallCardStyle = {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  };

  const smallCardContentStyle = {
    alignItems: 'center' as const,
  };

  const smallCardTitleStyle = {
    fontSize: 14,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  };

  const smallSubtitleStyle = {
    fontSize: 10,
    color: '#666',
  };

  const savingsTextStyle = {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: '#4CAF50',
    marginVertical: 4,
  };

  const appointmentDetailStyle = {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  };

  const savingsBreakdownStyle = {
    marginTop: 8,
  };

  const savingsRowStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 4,
  };

  const savingsLabelStyle = {
    fontSize: 10,
    color: '#666',
  };

  const savingsValueStyle = {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#333',
  };

  const infoCardStyle = {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C9DEF0',
  };

  const highlightedInfoCardStyle = {
    borderColor: '#4682B4',
    borderWidth: 2,
  };

  const infoContentStyle = {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  };

  const infoIconStyle = {
    marginRight: 8,
    marginTop: 2,
  };

  const infoTextStyle = {
    flex: 1,
    fontSize: 12,
    color: '#4682B4',
  };

  const benefitsListStyle = {
    marginTop: 8,
  };

  const benefitItemStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
  };

  const benefitTextStyle = {
    fontSize: 10,
    color: '#333',
    marginLeft: 6,
  };

  const actionButtonStyle = {
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center' as const,
    marginTop: 10,
  };

  const actionButtonTextStyle = {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500' as const,
  };

  const nextActionCardStyle = {
    backgroundColor: '#FFFAEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  };

  const nextActionTitleStyle = {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#F57C00',
    marginBottom: 4,
  };

  const nextActionTextStyle = {
    fontSize: 12,
    color: '#333',
  };

  const actionButtonContainerStyle = {
    alignItems: 'flex-start' as const,
    marginTop: 8,
  };

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  };

  const quickActionsContainerStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 24,
  };

  const quickActionStyle = {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  };

  const actionIconStyle = {
    marginBottom: 8,
  };

  const actionTextStyle = {
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  };

  const goalsCardStyle = {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  };

  const goalHeaderStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  };

  const goalTitleStyle = {
    fontSize: 14,
    fontWeight: '500' as const,
  };

  const goalProgressStyle = {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500' as const,
  };

  return (
    <View style={containerStyle}>
      {/* Fix: Add title prop to Header */}
      <Header title="BenefitMetrics" />
      
      <ScrollView style={contentStyle}>
        <View style={welcomeContainerStyle}>
          <View>
            <Text style={welcomeTextStyle}>Hi, {user?.firstName || 'there'}!</Text>
            <Text style={subtitleTextStyle}>Let's stay on top of your health</Text>
          </View>
          <PointsDisplay points={user?.points || 0} />
        </View>
        
        {/* Health Score Feature */}
        <TouchableOpacity 
          style={[
            cardStyle, 
            highlightedFeature === 'health-score' && highlightedCardStyle
          ]}
          onPress={() => toggleHighlight('health-score')}
          activeOpacity={0.9}
        >
          {highlightedFeature === 'health-score' && (
            <View style={newFeatureBadgeStyle}>
              <Text style={newFeatureTextStyle}>NEW FEATURE</Text>
            </View>
          )}
          <View style={cardContentStyle}>
            <Text style={cardTitleStyle}>Your Health Score</Text>
            <Text style={scoreTextStyle}>{healthScore}</Text>
            <Text style={trendTextStyle}>
              {scoreTrend > 0 ? `↑ ${scoreTrend} points` : scoreTrend < 0 ? `↓ ${Math.abs(scoreTrend)} points` : 'No change'}
            </Text>
            <ProgressBar progress={healthScore} color="#4682B4" />
            <View style={scoreRangeStyle}>
              <Text style={rangeTextStyle}>0</Text>
              <Text style={rangeTextStyle}>{scoreLevel} Level - 1 point to Gold</Text>
              <Text style={rangeTextStyle}>100</Text>
            </View>
          </View>
          
          {highlightedFeature === 'health-score' && (
            <View style={featureDetailStyle}>
              <Text style={detailTitleStyle}>Health Score System</Text>
              <Text style={detailTextStyle}>
                Track your preventative health metrics across different categories with our proprietary Health Score.
              </Text>
              <View style={categoriesContainerStyle}>
                <View style={categoryStyle}>
                  <Text style={categoryTitleStyle}>Preventative Care</Text>
                  <Text style={categoryValueStyle}>88/100</Text>
                </View>
                <View style={categoryStyle}>
                  <Text style={categoryTitleStyle}>Wellness Activities</Text>
                  <Text style={categoryValueStyle}>76/100</Text>
                </View>
                <View style={categoryStyle}>
                  <Text style={categoryTitleStyle}>Risk Factors</Text>
                  <Text style={categoryValueStyle}>91/100</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={rowContainerStyle}>
          {/* ROI Tracker Feature */}
          <TouchableOpacity 
            style={[
              smallCardStyle, 
              { flex: highlightedFeature === 'roi-tracker' ? 3 : 1 },
              highlightedFeature === 'roi-tracker' && highlightedCardStyle
            ]}
            onPress={() => toggleHighlight('roi-tracker')}
            activeOpacity={0.9}
          >
            {highlightedFeature === 'roi-tracker' && (
              <View style={newFeatureBadgeStyle}>
                <Text style={newFeatureTextStyle}>NEW FEATURE</Text>
              </View>
            )}
            <View style={smallCardContentStyle}>
              <Text style={smallCardTitleStyle}>ROI</Text>
              <Text style={savingsTextStyle}>${totalSavings.toLocaleString()}</Text>
              <Text style={smallSubtitleStyle}>Savings</Text>
            </View>
            
            {highlightedFeature === 'roi-tracker' && (
              <View style={featureDetailStyle}>
                <Text style={detailTitleStyle}>ROI Tracker</Text>
                <Text style={detailTextStyle}>
                  Visualize the financial benefits of your preventative healthcare activities.
                </Text>
                <View style={savingsBreakdownStyle}>
                  <View style={savingsRowStyle}>
                    <Text style={savingsLabelStyle}>Preventative Care:</Text>
                    <Text style={savingsValueStyle}>$1,850</Text>
                  </View>
                  <View style={savingsRowStyle}>
                    <Text style={savingsLabelStyle}>Premium Discounts:</Text>
                    <Text style={savingsValueStyle}>$360</Text>
                  </View>
                  <View style={savingsRowStyle}>
                    <Text style={savingsLabelStyle}>Early Detection Value:</Text>
                    <Text style={savingsValueStyle}>Priceless</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          {highlightedFeature !== 'roi-tracker' && (
            <View style={[smallCardStyle, { flex: 2 }]}>
              <View style={smallCardContentStyle}>
                <Text style={smallCardTitleStyle}>
                  Next: {nextAppointment?.type || 'No appointment'}
                </Text>
                {nextAppointment && (
                  <Text style={appointmentDetailStyle}>
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
            infoCardStyle, 
            highlightedFeature === 'care-timeline' && highlightedInfoCardStyle
          ]}
          onPress={() => toggleHighlight('care-timeline')}
          activeOpacity={0.9}
        >
          {highlightedFeature === 'care-timeline' && (
            <View style={newFeatureBadgeStyle}>
              <Text style={newFeatureTextStyle}>NEW FEATURE</Text>
            </View>
          )}
          <View style={infoContentStyle}>
            <Info style={infoIconStyle} size={16} color="#4682B4" />
            <Text style={infoTextStyle}>
              Your care timeline has been optimized to fit your work schedule and benefit deadlines.
            </Text>
          </View>
          
          {highlightedFeature === 'care-timeline' && (
            <View style={featureDetailStyle}>
              <Text style={detailTitleStyle}>Care Coordination Timeline</Text>
              <Text style={detailTextStyle}>
                AI-powered appointment scheduling that considers:
              </Text>
              <View style={benefitsListStyle}>
                <View style={benefitItemStyle}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={benefitTextStyle}>Your work calendar and meetings</Text>
                </View>
                <View style={benefitItemStyle}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={benefitTextStyle}>Benefits expiration deadlines</Text>
                </View>
                <View style={benefitItemStyle}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={benefitTextStyle}>Provider availability</Text>
                </View>
                <View style={benefitItemStyle}>
                  <ArrowRight size={12} color="#4682B4" />
                  <Text style={benefitTextStyle}>Health score optimization</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={actionButtonStyle}
                onPress={() => {/* Navigate to care timeline */}}
              >
                <Text style={actionButtonTextStyle}>View Timeline</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Next Best Action */}
        {nextAction && (
          <View style={nextActionCardStyle}>
            <Text style={nextActionTitleStyle}>Recommended Next Action</Text>
            <Text style={nextActionTextStyle}>{nextAction.title}</Text>
            <View style={actionButtonContainerStyle}>
              <TouchableOpacity 
                style={actionButtonStyle}
                onPress={() => {/* Take next action */}}
              >
                <Text style={actionButtonTextStyle}>{nextAction.actionText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <Text style={sectionTitleStyle}>Quick Actions</Text>
        <View style={quickActionsContainerStyle}>
          <Link href="/employee/appointments/schedule" asChild>
            <TouchableOpacity style={quickActionStyle}>
              <Calendar style={actionIconStyle} size={24} color="#4682B4" />
              <Text style={actionTextStyle}>Schedule Appointment</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/appointments/checkups" asChild>
            <TouchableOpacity style={quickActionStyle}>
              <CheckCircle style={actionIconStyle} size={24} color="#4682B4" />
              <Text style={actionTextStyle}>Checkup Timeline</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/benefits/incentives" asChild>
            <TouchableOpacity style={quickActionStyle}>
              <Gift style={actionIconStyle} size={24} color="#4682B4" />
              <Text style={actionTextStyle}>Redeem Rewards</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/features/tips" asChild>
            <TouchableOpacity style={quickActionStyle}>
              <FileText style={actionIconStyle} size={24} color="#4682B4" />
              <Text style={actionTextStyle}>Wellness Tips</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <Text style={sectionTitleStyle}>Health Goals</Text>
        <View style={goalsCardStyle}>
          <View style={goalHeaderStyle}>
            <Text style={goalTitleStyle}>Annual Checkup Progress</Text>
            <Text style={goalProgressStyle}>2/4</Text>
          </View>
          <ProgressBar progress={50} color="#4682B4" />
        </View>
      </ScrollView>
    </View>
  );
}