import { ArrowRight, Award, Check, ChevronRight, Clock, Gift, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import PointsDisplay from '../../../components/Common/shared/PointsDisplay';
import { useAuth } from '../../../hooks/Common/useAuth';

type Incentive = {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'discount' | 'reward' | 'company' | 'cash';
  category: string;
  deadline?: string;
  isPopular?: boolean;
  isNew?: boolean;
};

export default function IncentivesScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('rewards');
  
  // Sample data - in a real app, this would come from an API or context
  const incentives: { [key: string]: Incentive[] } = {
    rewards: [
      {
        id: '1',
        name: 'Health Insurance Premium Discount',
        description: '$25 monthly discount on your premiums',
        cost: 500,
        type: 'discount',
        category: 'Insurance',
        isPopular: true
      },
      {
        id: '2',
        name: 'Fitness Membership',
        description: 'Free 3-month gym membership',
        cost: 400,
        type: 'reward',
        category: 'Fitness',
        deadline: 'December 31, 2025'
      },
      {
        id: '3',
        name: 'Wellness Day Off',
        description: 'Extra PTO day for wellness activities',
        cost: 300,
        type: 'company',
        category: 'Work/Life Balance',
        isNew: true
      },
      {
        id: '4',
        name: 'Health Tech Gadget',
        description: 'Fitness tracker or smart scale',
        cost: 600,
        type: 'reward',
        category: 'Technology',
      },
      {
        id: '5',
        name: 'Healthy Meal Delivery',
        description: 'One week of healthy meals delivered',
        cost: 450,
        type: 'reward',
        category: 'Nutrition',
      }
    ],
    history: [
      {
        id: '6',
        name: 'Wellness Workshop',
        description: 'Access to premium wellness workshop',
        cost: 200,
        type: 'reward',
        category: 'Education'
      },
      {
        id: '7',
        name: 'Health Coaching Session',
        description: 'One-on-one health coaching session',
        cost: 250,
        type: 'reward',
        category: 'Coaching'
      }
    ]
  };
  
  const handleRedeem = (incentive: Incentive) => {
    const currentPoints = user?.points || 0;
    
    if (currentPoints < incentive.cost) {
      Alert.alert(
        'Insufficient Points',
        `You need ${incentive.cost - currentPoints} more points to redeem this reward.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem ${incentive.name} for ${incentive.cost} points?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Redeem',
          onPress: () => {
            // In a real app, this would make an API call to redeem the reward
            Alert.alert(
              'Redemption Successful',
              `You have successfully redeemed ${incentive.name}.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header title="Rewards" />
      
      <View style={styles.pointsContainer}>
        <PointsDisplay points={user?.points || 0} showLabel={true} />
        <Text style={styles.pointsHint}>Complete challenges to earn more points</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}
          onPress={() => setActiveTab('rewards')}
        >
          <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>
            Available Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Redemption History
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'rewards' && (
          <>
            <View style={styles.infoCard}>
              <Info size={20} color="#4682B4" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Redeem your points for rewards and incentives. Points are earned by completing health challenges and preventative care activities.
              </Text>
            </View>
            
            {incentives.rewards.map(incentive => (
              <View key={incentive.id} style={styles.incentiveCard}>
                <View style={styles.incentiveHeader}>
                  <View>
                    <View style={styles.incentiveTitleContainer}>
                      <Text style={styles.incentiveName}>{incentive.name}</Text>
                      {incentive.isPopular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>Popular</Text>
                        </View>
                      )}
                      {incentive.isNew && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newText}>New</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.incentiveType}>{incentive.category}</Text>
                  </View>
                  <View style={styles.pointsCost}>
                    <Award size={14} color="#4682B4" style={styles.pointsIcon} />
                    <Text style={styles.pointsValue}>{incentive.cost}</Text>
                  </View>
                </View>
                
                <Text style={styles.incentiveDescription}>{incentive.description}</Text>
                
                {incentive.deadline && (
                  <View style={styles.deadlineContainer}>
                    <Clock size={14} color="#FF9800" style={styles.deadlineIcon} />
                    <Text style={styles.deadlineText}>Available until: {incentive.deadline}</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.redeemButton,
                    (user?.points || 0) < incentive.cost && styles.disabledButton
                  ]}
                  onPress={() => handleRedeem(incentive)}
                  disabled={(user?.points || 0) < incentive.cost}
                >
                  <Text style={styles.redeemButtonText}>
                    {(user?.points || 0) >= incentive.cost ? 'Redeem Reward' : `Need ${incentive.cost - (user?.points || 0)} more points`}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreText}>View All Rewards</Text>
              <ChevronRight size={16} color="#4682B4" />
            </TouchableOpacity>
          </>
        )}
        
        {activeTab === 'history' && (
          <>
            {incentives.history.length > 0 ? (
              <>
                {incentives.history.map(incentive => (
                  <View key={incentive.id} style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyIconContainer}>
                        <Gift size={18} color="#4682B4" />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyName}>{incentive.name}</Text>
                        <Text style={styles.historyDate}>Redeemed on May 10, 2025</Text>
                      </View>
                      <View style={styles.historyPoints}>
                        <Text style={styles.historyPointsValue}>{incentive.cost} pts</Text>
                      </View>
                    </View>
                    
                    <View style={styles.historyStatus}>
                      <View style={styles.statusBadge}>
                        <Check size={12} color="#4CAF50" />
                        <Text style={styles.statusText}>Redeemed</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Gift size={48} color="#DDD" />
                <Text style={styles.emptyStateTitle}>No Redemption History</Text>
                <Text style={styles.emptyStateText}>
                  You haven't redeemed any rewards yet. Start earning points by completing challenges!
                </Text>
              </View>
            )}
          </>
        )}
        
        <View style={styles.earningCard}>
          <Text style={styles.earningTitle}>Ways to Earn Points</Text>
          
          <View style={styles.earningItem}>
            <View style={styles.earningIconContainer}>
              <Award size={18} color="#4682B4" />
            </View>
            <View style={styles.earningInfo}>
              <Text style={styles.earningName}>Complete Health Challenges</Text>
              <Text style={styles.earningValue}>50-100 points per challenge</Text>
            </View>
            <ArrowRight size={16} color="#4682B4" />
          </View>
          
          <View style={styles.earningItem}>
            <View style={styles.earningIconContainer}>
              <Award size={18} color="#4682B4" />
            </View>
            <View style={styles.earningInfo}>
              <Text style={styles.earningName}>Complete Preventative Care</Text>
              <Text style={styles.earningValue}>75-150 points per service</Text>
            </View>
            <ArrowRight size={16} color="#4682B4" />
          </View>
          
          <View style={styles.earningItem}>
            <View style={styles.earningIconContainer}>
              <Award size={18} color="#4682B4" />
            </View>
            <View style={styles.earningInfo}>
              <Text style={styles.earningName}>Participate in Wellness Programs</Text>
              <Text style={styles.earningValue}>25-100 points per program</Text>
            </View>
            <ArrowRight size={16} color="#4682B4" />
          </View>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="incentives"
        employee={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  pointsContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pointsHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4682B4',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4682B4',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  incentiveCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  incentiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  incentiveTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  incentiveName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 4,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#FFF8E1',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginRight: 6,
  },
  popularText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '500',
  },
  newBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  newText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  incentiveType: {
    fontSize: 12,
    color: '#666',
  },
  pointsCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pointsIcon: {
    marginRight: 4,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
  },
  incentiveDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deadlineIcon: {
    marginRight: 6,
  },
  deadlineText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  redeemButton: {
    backgroundColor: '#4682B4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#C5D5E4',
  },
  redeemButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 16,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyPoints: {
    marginLeft: 8,
  },
  historyPointsValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4682B4',
  },
  historyStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  earningCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  earningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  earningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  earningIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  earningInfo: {
    flex: 1,
  },
  earningName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  earningValue: {
    fontSize: 12,
    color: '#666',
  },
});