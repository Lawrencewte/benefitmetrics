import { Link } from 'expo-router';
import { AlertCircle, Calendar, CheckCircle, ChevronRight, Clock, Filter, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Remove Footer import - handled by tabs layout
// import Footer, { EMPLOYEE_TABS } from '../../../components/Common/layout/Footer';
import Footer, { EMPLOYEE_TABS } from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';


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

export default function CheckupsScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Sample data - in a real app, this would come from an API or context
  const checkups: Checkup[] = [
    {
      id: '1',
      name: 'Annual Physical',
      frequency: 'Yearly',
      lastDate: 'March 15, 2025',
      nextDue: 'March 2026',
      status: 'completed',
      category: 'General',
      description: 'Comprehensive yearly examination with your primary care physician.'
    },
    {
      id: '2',
      name: 'Dental Cleaning',
      frequency: '6 months',
      lastDate: 'February 3, 2025',
      nextDue: 'August 2025',
      status: 'completed',
      category: 'Dental',
      description: 'Regular dental cleaning and examination.'
    },
    {
      id: '3',
      name: 'Dental Cleaning',
      frequency: '6 months',
      nextDue: 'August 2025',
      status: 'scheduled',
      category: 'Dental',
      description: 'Regular dental cleaning and examination.',
      appointmentId: '123'
    },
    {
      id: '4',
      name: 'Eye Exam',
      frequency: 'Yearly',
      lastDate: 'July 2024',
      nextDue: 'July 2025',
      status: 'due',
      category: 'Vision',
      description: 'Comprehensive eye examination for vision and eye health.'
    },
    {
      id: '5',
      name: 'Skin Check',
      frequency: 'Yearly',
      nextDue: 'June 2025',
      status: 'recommended',
      category: 'Dermatology',
      description: 'Full-body skin examination to check for suspicious moles or lesions.'
    },
    {
      id: '6',
      name: 'Mammogram',
      frequency: 'Yearly (age 40+)',
      status: 'recommended',
      category: 'Women\'s Health',
      description: 'Breast cancer screening using low-dose X-ray imaging.'
    },
    {
      id: '7',
      name: 'Cholesterol Screening',
      frequency: 'Every 4-6 years',
      lastDate: 'April 2021',
      nextDue: 'April 2025',
      status: 'overdue',
      category: 'General',
      description: 'Blood test to measure cholesterol and triglyceride levels.'
    }
  ];
  
  const categories = ['All', 'General', 'Dental', 'Vision', 'Women\'s Health', 'Men\'s Health', 'Dermatology'];
  
  const statusFilters = {
    all: 'All',
    due: 'Due Soon',
    overdue: 'Overdue',
    completed: 'Completed',
    recommended: 'Recommended'
  };
  
  // Filter checkups based on active filter
  const filteredCheckups = checkups.filter(checkup => {
    if (activeFilter === 'all') return true;
    if (Object.keys(statusFilters).includes(activeFilter)) {
      return checkup.status === activeFilter;
    }
    return checkup.category.toLowerCase() === activeFilter.toLowerCase();
  });
  
  const getStatusColor = (status: CheckupStatus) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'scheduled':
        return '#4682B4';
      case 'due':
        return '#FF9800';
      case 'overdue':
        return '#F44336';
      case 'recommended':
        return '#9E9E9E';
      default:
        return '#666';
    }
  };
  
  const getStatusIcon = (status: CheckupStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'scheduled':
        return <Calendar size={16} color="#4682B4" />;
      case 'due':
        return <Clock size={16} color="#FF9800" />;
      case 'overdue':
        return <AlertCircle size={16} color="#F44336" />;
      case 'recommended':
        return <Info size={16} color="#9E9E9E" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: CheckupStatus) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'due':
        return 'Due Soon';
      case 'overdue':
        return 'Overdue';
      case 'recommended':
        return 'Recommended';
      default:
        return '';
    }
  };
  
  return (
    <View style={styles.container}>
      <Header title="Checkup Timeline" showBackButton />
      
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
            style={[styles.filterChip, activeFilter === category.toLowerCase() && styles.activeFilterChip]}
            onPress={() => setActiveFilter(category.toLowerCase())}
          >
            <Text 
              style={[styles.filterChipText, activeFilter === category.toLowerCase() && styles.activeFilterChipText]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Info size={20} color="#4682B4" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Staying up-to-date with recommended preventative care screenings is one of the most effective ways to maintain your health and catch potential issues early.
          </Text>
        </View>
        
        {filteredCheckups.length > 0 ? (
          filteredCheckups.map(checkup => (
            <View key={checkup.id} style={styles.checkupCard}>
              <View style={styles.checkupHeader}>
                <View style={styles.checkupTitleContainer}>
                  <Text style={styles.checkupName}>{checkup.name}</Text>
                  <Text style={styles.checkupCategory}>{checkup.category}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(checkup.status)}20` }  // 20% opacity
                ]}>
                  {getStatusIcon(checkup.status)}
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(checkup.status) }
                  ]}>
                    {getStatusText(checkup.status)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.checkupDescription}>{checkup.description}</Text>
              
              <View style={styles.checkupDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Frequency:</Text>
                  <Text style={styles.detailValue}>{checkup.frequency}</Text>
                </View>
                
                {checkup.lastDate && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Last completed:</Text>
                    <Text style={styles.detailValue}>{checkup.lastDate}</Text>
                  </View>
                )}
                
                {checkup.nextDue && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Next due:</Text>
                    <Text style={styles.detailValue}>{checkup.nextDue}</Text>
                  </View>
                )}
              </View>
              
              {(checkup.status === 'due' || checkup.status === 'overdue' || checkup.status === 'recommended') && (
                <Link href="/employee/appointments/schedule" asChild>
                  <TouchableOpacity style={styles.scheduleButton}>
                    <Calendar size={16} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.scheduleButtonText}>Schedule Now</Text>
                  </TouchableOpacity>
                </Link>
              )}
              
              {checkup.status === 'scheduled' && checkup.appointmentId && (
                <Link href={`/employee/appointments/details/${checkup.appointmentId}`} asChild>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Appointment</Text>
                    <ChevronRight size={16} color="#4682B4" />
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Filter size={40} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No checkups match your filter</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={styles.resetButtonText}>Show All Checkups</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Age and Risk-Based Recommendations</Text>
          <Text style={styles.noticeText}>
            Preventative care recommendations are based on your age, gender, family history, and risk factors. These recommendations are personalized based on your health profile.
          </Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn More</Text>
            <ChevronRight size={16} color="#4682B4" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
     <Footer 
        tabs={EMPLOYEE_TABS}
        activeTab="appointments"
        onTabPress={handleTabPress}
      />
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
  checkupCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkupTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  checkupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  checkupCategory: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  checkupDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  checkupDetails: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  scheduleButton: {
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
  scheduleButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4682B4',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 8,
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
  noticeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  learnMoreText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
});