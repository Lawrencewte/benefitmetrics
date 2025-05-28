import { Activity, Calendar, Clock, DollarSign, Heart, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import { useROITracker } from '../../../hooks/employee/useROITracker';

type SavingsCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: number;
  description: string;
};

type PlannedSaving = {
  id: string;
  name: string;
  amount: number;
  action: string;
  dueDate?: string;
};

export default function BenefitsSavingsScreen() {
  const { totalSavings } = useROITracker();
  
  // Sample data - in a real app this would come from an API or context
  const savingsCategories: SavingsCategory[] = [
    {
      id: 'preventative',
      name: 'Preventative Care',
      icon: <Heart size={20} color="#4682B4" />,
      amount: 1250,
      description: 'Savings from utilizing 100% covered preventative services'
    },
    {
      id: 'inNetwork',
      name: 'In-Network Providers',
      icon: <Activity size={20} color="#4682B4" />,
      amount: 450,
      description: 'Savings from using in-network vs. out-of-network providers'
    },
    {
      id: 'wellness',
      name: 'Wellness Programs',
      icon: <Heart size={20} color="#4682B4" />,
      amount: 320,
      description: 'Savings from wellness program participation and incentives'
    },
    {
      id: 'discounts',
      name: 'Partner Discounts',
      icon: <DollarSign size={20} color="#4682B4" />,
      amount: 190,
      description: 'Savings from exclusive partner discounts'
    }
  ];
  
  const plannedSavings: PlannedSaving[] = [
    {
      id: '1',
      name: 'Annual Eye Exam',
      amount: 150,
      action: 'Schedule Appointment',
      dueDate: 'December 31, 2025'
    },
    {
      id: '2',
      name: 'Skin Cancer Screening',
      amount: 200,
      action: 'Schedule Appointment',
      dueDate: 'December 31, 2025'
    },
    {
      id: '3',
      name: 'Gym Rebate',
      amount: 120,
      action: 'Submit Receipt',
      dueDate: 'December 31, 2025'
    },
    {
      id: '4',
      name: 'Wellness Challenge',
      amount: 100,
      action: 'Complete Challenge'
    }
  ];
  
  return (
    <View style={styles.container}>
      <Header title="Cost Savings" showBackButton />
      
      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <TrendingUp size={24} color="#4CAF50" />
            <Text style={styles.savingsTitle}>Total Savings</Text>
          </View>
          <Text style={styles.totalSavings}>${totalSavings.toLocaleString()}</Text>
          <Text style={styles.savingsSubtitle}>
            Estimated savings from your preventative care and benefits utilization this year
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Savings Breakdown</Text>
        
        {savingsCategories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIconContainer}>
                {category.icon}
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>${category.amount.toLocaleString()}</Text>
              </View>
            </View>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Potential Additional Savings</Text>
        
        {plannedSavings.map((saving) => (
          <View key={saving.id} style={styles.plannedCard}>
            <View style={styles.plannedInfo}>
              <Text style={styles.plannedName}>{saving.name}</Text>
              <Text style={styles.plannedAmount}>+${saving.amount}</Text>
            </View>
            
            {saving.dueDate && (
              <View style={styles.dueDateContainer}>
                <Clock size={14} color="#666" style={styles.dueDateIcon} />
                <Text style={styles.dueDateText}>Due by: {saving.dueDate}</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{saving.action}</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Your Savings vs. Average</Text>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Your Savings</Text>
              <Text style={styles.comparisonValue}>${totalSavings.toLocaleString()}</Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Company Average</Text>
              <Text style={styles.comparisonValue}>$1,820</Text>
            </View>
          </View>
          <Text style={styles.comparisonNote}>
            {totalSavings > 1820 ? 
              `You're saving ${Math.round((totalSavings/1820 - 1) * 100)}% more than the average employee!` : 
              `You could save ${Math.round((1820/totalSavings - 1) * 100)}% more by maximizing your benefits!`
            }
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <DollarSign size={20} color="#4682B4" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Maximizing Your Savings</Text>
            <Text style={styles.tipText}>
              Schedule all your preventative care appointments before year-end to get the most out of your $0 copay benefits. Consider using your wellness funds for eligible expenses before they expire.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.reportButton}>
          <Calendar size={16} color="#4682B4" style={styles.reportIcon} />
          <Text style={styles.reportButtonText}>View Annual Savings Report</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Footer 
        activePath="benefits"
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
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  totalSavings: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  savingsSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4682B4',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  plannedCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  plannedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plannedName: {
    fontSize: 14,
    fontWeight: '500',
  },
  plannedAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDateIcon: {
    marginRight: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#E6F0F9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
  comparisonCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  comparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4682B4',
  },
  comparisonNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#C9DEF0',
    flexDirection: 'row',
  },
  tipIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#4682B4',
    lineHeight: 18,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#4682B4',
    marginVertical: 12,
    marginBottom: 24,
  },
  reportIcon: {
    marginRight: 8,
  },
  reportButtonText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
  },
});