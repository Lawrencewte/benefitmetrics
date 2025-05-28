import { AlertCircle, Calendar, CheckCircle, Clock, Filter, PieChart } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

type BenefitUsage = {
  id: string;
  name: string;
  used: number;
  total: number;
  lastUsed?: string;
  expiresOn?: string;
  status: 'good' | 'warning' | 'expired';
};

type UsageCategory = {
  id: string;
  name: string;
  items: BenefitUsage[];
};

export default function BenefitsUsageScreen() {
  const [activeTab, setActiveTab] = useState('benefits');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample data - in a real app this would come from an API or context
  const usageCategories: UsageCategory[] = [
    {
      id: 'preventative',
      name: 'Preventative Care',
      items: [
        {
          id: 'physical',
          name: 'Annual Physical',
          used: 1,
          total: 1,
          lastUsed: 'March 15, 2025',
          status: 'good'
        },
        {
          id: 'dental',
          name: 'Dental Cleaning',
          used: 1,
          total: 2,
          lastUsed: 'February 3, 2025',
          expiresOn: 'December 31, 2025',
          status: 'good'
        },
        {
          id: 'vision',
          name: 'Eye Exam',
          used: 0,
          total: 1,
          expiresOn: 'December 31, 2025',
          status: 'warning'
        },
        {
          id: 'mammogram',
          name: 'Mammogram',
          used: 0,
          total: 1,
          expiresOn: 'December 31, 2025',
          status: 'good'
        }
      ]
    },
    {
      id: 'wellness',
      name: 'Wellness Benefits',
      items: [
        {
          id: 'wellnessFunds',
          name: 'Wellness Funds',
          used: 250,
          total: 750,
          lastUsed: 'April 10, 2025',
          expiresOn: 'December 31, 2025',
          status: 'good'
        },
        {
          id: 'gym',
          name: 'Gym Reimbursement',
          used: 150,
          total: 300,
          lastUsed: 'April 1, 2025',
          expiresOn: 'December 31, 2025',
          status: 'good'
        },
        {
          id: 'mental',
          name: 'Mental Health Sessions',
          used: 4,
          total: 20,
          lastUsed: 'March 25, 2025',
          expiresOn: 'December 31, 2025',
          status: 'good'
        }
      ]
    },
    {
      id: 'specialized',
      name: 'Specialized Care',
      items: [
        {
          id: 'physicalTherapy',
          name: 'Physical Therapy',
          used: 6,
          total: 20,
          lastUsed: 'April 5, 2025',
          status: 'good'
        },
        {
          id: 'chiropractor',
          name: 'Chiropractic Care',
          used: 2,
          total: 12,
          lastUsed: 'February 20, 2025',
          status: 'good'
        }
      ]
    }
  ];
  
  // Sample wellness fund expenses
  const expenses = [
    {
      id: '1',
      date: 'April 10, 2025',
      description: 'Gym Membership',
      amount: 75,
      status: 'Approved'
    },
    {
      id: '2',
      date: 'March 22, 2025',
      description: 'Fitness Equipment',
      amount: 125,
      status: 'Approved'
    },
    {
      id: '3',
      date: 'March 5, 2025',
      description: 'Wellness App Subscription',
      amount: 50,
      status: 'Approved'
    },
    {
      id: '4',
      date: 'April 15, 2025',
      description: 'Massage Therapy',
      amount: 90,
      status: 'Pending'
    }
  ];
  
  // Filter usage items based on selected filter
  const filteredCategories = usageCategories.map(category => ({
    ...category,
    items: category.items.filter(item => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unused') return item.used === 0;
      if (activeFilter === 'expiring') {
        const today = new Date();
        const expiryDate = item.expiresOn ? new Date(item.expiresOn) : null;
        if (!expiryDate) return false;
        
        // Consider "expiring" if within 60 days of expiration
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
      }
      return true;
    })
  })).filter(category => category.items.length > 0);
  
  return (
    <View style={styles.container}>
      <Header title="Benefits Usage" showBackButton />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'benefits' && styles.activeTab]}
          onPress={() => setActiveTab('benefits')}
        >
          <Text style={[styles.tabText, activeTab === 'benefits' && styles.activeTabText]}>
            Benefits Usage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            Wellness Expenses
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'benefits' ? (
          <>
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Filter:</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'all' && styles.activeFilterOption]}
                  onPress={() => setActiveFilter('all')}
                >
                  <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
                    All
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'unused' && styles.activeFilterOption]}
                  onPress={() => setActiveFilter('unused')}
                >
                  <Text style={[styles.filterText, activeFilter === 'unused' && styles.activeFilterText]}>
                    Unused
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'expiring' && styles.activeFilterOption]}
                  onPress={() => setActiveFilter('expiring')}
                >
                  <Text style={[styles.filterText, activeFilter === 'expiring' && styles.activeFilterText]}>
                    Expiring Soon
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Benefits Utilization</Text>
              <View style={styles.utilization}>
                <PieChart size={20} color="#4682B4" style={styles.utilizationIcon} />
                <View style={styles.utilizationInfo}>
                  <Text style={styles.utilizationLabel}>Overall Utilization Rate</Text>
                  <ProgressBar progress={45} />
                  <Text style={styles.utilizationHint}>
                    You're using 45% of your available benefits. Take advantage of 
                    more preventative care services.
                  </Text>
                </View>
              </View>
            </View>
            
            {filteredCategories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                
                {category.items.map((item) => (
                  <View key={item.id} style={styles.usageItem}>
                    <View style={styles.usageHeader}>
                      <Text style={styles.usageName}>{item.name}</Text>
                      <View style={[
                        styles.usageStatus,
                        item.status === 'good' && styles.statusGood,
                        item.status === 'warning' && styles.statusWarning,
                        item.status === 'expired' && styles.statusExpired
                      ]}>
                        {item.status === 'good' && <CheckCircle size={14} color="#4CAF50" />}
                        {item.status === 'warning' && <AlertCircle size={14} color="#FF9800" />}
                        {item.status === 'expired' && <AlertCircle size={14} color="#F44336" />}
                      </View>
                    </View>
                    
                    <View style={styles.usageProgress}>
                      <Text style={styles.usageText}>
                        {typeof item.used === 'number' && typeof item.total === 'number' ? 
                          `${item.used} of ${item.total} used` : 
                          `${item.used} of ${item.total} used`
                        }
                      </Text>
                      <ProgressBar 
                        progress={Math.min(100, (item.used / item.total) * 100)} 
                        color={
                          item.status === 'warning' ? '#FF9800' : 
                          item.status === 'expired' ? '#F44336' : '#4682B4'
                        }
                      />
                    </View>
                    
                    <View style={styles.usageDetails}>
                      {item.lastUsed && (
                        <View style={styles.detailItem}>
                          <Calendar size={14} color="#666" style={styles.detailIcon} />
                          <Text style={styles.detailText}>Last used: {item.lastUsed}</Text>
                        </View>
                      )}
                      
                      {item.expiresOn && (
                        <View style={styles.detailItem}>
                          <Clock size={14} color="#666" style={styles.detailIcon} />
                          <Text style={styles.detailText}>Expires: {item.expiresOn}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
            
            {filteredCategories.length === 0 && (
              <View style={styles.emptyState}>
                <Filter size={40} color="#CCC" />
                <Text style={styles.emptyStateText}>No benefits match your filter</Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => setActiveFilter('all')}
                >
                  <Text style={styles.resetButtonText}>Show All Benefits</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Wellness Funds</Text>
              <View style={styles.fundsContainer}>
                <Text style={styles.fundsAmount}>$500 remaining</Text>
                <Text style={styles.fundsExpiry}>Available until December 31, 2025</Text>
              </View>
              <ProgressBar progress={66} />
              <Text style={styles.fundsUsed}>$250 of $750 used</Text>
            </View>
            
            <View style={styles.expensesHeader}>
              <Text style={styles.expensesTitle}>Recent Expenses</Text>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit New</Text>
              </TouchableOpacity>
            </View>
            
            {expenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                </View>
                <View style={styles.expenseValues}>
                  <Text style={styles.expenseAmount}>${expense.amount}</Text>
                  <View style={[
                    styles.expenseStatus,
                    expense.status === 'Approved' ? styles.approvedStatus : styles.pendingStatus
                  ]}>
                    <Text style={[
                      styles.expenseStatusText,
                      expense.status === 'Approved' ? styles.approvedText : styles.pendingText
                    ]}>
                      {expense.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            
            <View style={styles.eligibleContainer}>
              <Text style={styles.eligibleTitle}>Eligible Expenses</Text>
              <Text style={styles.eligibleDescription}>
                Your wellness funds can be used for the following expenses:
              </Text>
              <View style={styles.eligibleItem}>
                <CheckCircle size={16} color="#4CAF50" style={styles.eligibleIcon} />
                <Text style={styles.eligibleText}>Gym memberships and fitness classes</Text>
              </View>
              <View style={styles.eligibleItem}>
                <CheckCircle size={16} color="#4CAF50" style={styles.eligibleIcon} />
                <Text style={styles.eligibleText}>Fitness equipment and trackers</Text>
              </View>
              <View style={styles.eligibleItem}>
                <CheckCircle size={16} color="#4CAF50" style={styles.eligibleIcon} />
                <Text style={styles.eligibleText}>Mental wellness apps and subscriptions</Text>
              </View>
              <View style={styles.eligibleItem}>
                <CheckCircle size={16} color="#4CAF50" style={styles.eligibleIcon} />
                <Text style={styles.eligibleText}>Nutrition counseling and programs</Text>
              </View>
              <View style={styles.eligibleItem}>
                <CheckCircle size={16} color="#4CAF50" style={styles.eligibleIcon} />
                <Text style={styles.eligibleText}>Massage therapy and acupuncture</Text>
              </View>
            </View>
          </>
        )}
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  filterOption: {
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterOption: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  utilization: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  utilizationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  utilizationInfo: {
    flex: 1,
  },
  utilizationLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  utilizationHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    lineHeight: 18,
  },
  categoryContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  usageItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  usageName: {
    fontSize: 14,
    fontWeight: '500',
  },
  usageStatus: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusGood: {
    backgroundColor: '#E8F5E9',
  },
  statusWarning: {
    backgroundColor: '#FFF3E0',
  },
  statusExpired: {
    backgroundColor: '#FFEBEE',
  },
  usageProgress: {
    marginBottom: 12,
  },
  usageText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  usageDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
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
  fundsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fundsAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  fundsExpiry: {
    fontSize: 12,
    color: '#666',
  },
  fundsUsed: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    textAlign: 'right',
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expensesTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  expenseItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  expenseValues: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  approvedStatus: {
    backgroundColor: '#E8F5E9',
  },
  pendingStatus: {
    backgroundColor: '#FFF3E0',
  },
  expenseStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  approvedText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9800',
  },
  eligibleContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eligibleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  eligibleDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  eligibleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eligibleIcon: {
    marginRight: 8,
  },
  eligibleText: {
    fontSize: 14,
    color: '#333',
  },
});