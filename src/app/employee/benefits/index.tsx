import { Link } from 'expo-router';
import { Activity, Briefcase, Calendar, ChevronRight, DollarSign, FileText, Heart } from 'lucide-react'; // Fixed: Changed from lucide-react-native to lucide-react, and DollarSign instead of Dollar
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

export default function BenefitsScreen() {
  // In a real app, this would come from a context or API
  const benefits = {
    company: 'Acme Corporation',
    plan: 'Premium Health Plus',
    preventativeCoverage: '100%',
    annualExamAllowance: '$250',
    wellnessFunds: '$500 remaining',
    utilizationRate: 68,
    partnerDiscounts: [
      { id: 1, partner: 'FitGear', discount: '25% off fitness equipment', expires: 'June 30, 2025' },
      { id: 2, partner: 'NutriMeal', discount: '$15 off first meal delivery', expires: 'July 15, 2025' },
      { id: 3, partner: 'MindfulApp', discount: '3 months free premium subscription', expires: 'August 1, 2025' }
    ]
  };

  // Define footer tabs for the employee benefits screen
  const footerTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <Heart size={20} />,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar size={20} />,
    },
    {
      id: 'benefits',
      label: 'Benefits',
      icon: <Briefcase size={20} />,
      activeIcon: <Briefcase size={20} />,
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: <Activity size={20} />,
    },
    {
      id: 'more',
      label: 'More',
      icon: <FileText size={20} />,
    },
  ];

  const handleTabPress = (tabId: string) => {
    // Handle navigation based on tab
    console.log('Tab pressed:', tabId);
    // You can add navigation logic here
  };
  
  return (
    <View style={styles.container}>
      <Header title="Benefits" />
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.planName}>{benefits.plan}</Text>
          <Text style={styles.companyName}>{benefits.company}</Text>
          
          <View style={styles.utilization}>
            <View style={styles.utilizationHeader}>
              <Text style={styles.utilizationTitle}>Benefits Utilization</Text>
              <Text style={styles.utilizationPercent}>{benefits.utilizationRate}%</Text>
            </View>
            <ProgressBar progress={benefits.utilizationRate} />
            <Text style={styles.utilizationHelp}>
              Maximize your benefits by scheduling preventative care appointments.
            </Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <Link href="/employee/benefits/coverage" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Heart size={24} color="#4682B4" />
              </View>
              <Text style={styles.actionTitle}>Coverage Details</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/benefits/usage" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Activity size={24} color="#4682B4" />
              </View>
              <Text style={styles.actionTitle}>Usage Tracking</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/benefits/savings" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <DollarSign size={24} color="#4682B4" /> {/* Fixed: Changed Dollar to DollarSign */}
              </View>
              <Text style={styles.actionTitle}>Cost Savings</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employee/education/benefits-guides" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <FileText size={24} color="#4682B4" />
              </View>
              <Text style={styles.actionTitle}>Benefits Guide</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preventative Care Coverage</Text>
          
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Calendar size={20} color="#4682B4" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitName}>Annual Physical</Text>
              <Text style={styles.benefitCoverage}>100% covered, no co-pay</Text>
            </View>
          </View>
          
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Calendar size={20} color="#4682B4" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitName}>Dental Cleaning</Text>
              <Text style={styles.benefitCoverage}>100% covered, twice per year</Text>
            </View>
          </View>
          
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Calendar size={20} color="#4682B4" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitName}>Eye Exam</Text>
              <Text style={styles.benefitCoverage}>100% covered, once per year</Text>
            </View>
          </View>
          
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Calendar size={20} color="#4682B4" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitName}>Vaccinations</Text>
              <Text style={styles.benefitCoverage}>100% covered, as recommended</Text>
            </View>
          </View>
          
          <Link href="/employee/benefits/coverage" asChild>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Coverage</Text>
              <ChevronRight size={16} color="#4682B4" />
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wellness Funds</Text>
          
          <View style={styles.fundsContainer}>
            <Text style={styles.fundsAmount}>{benefits.wellnessFunds}</Text>
            <Text style={styles.fundsExpiry}>Available until December 31, 2025</Text>
          </View>
          
          <Text style={styles.fundsDescription}>
            Your wellness funds can be used for gym memberships, fitness equipment, 
            mental health apps, and other approved wellness expenses.
          </Text>
          
          <Link href="/employee/benefits/usage" asChild>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Check Eligible Expenses</Text>
              <ChevronRight size={16} color="#4682B4" />
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Partner Discounts</Text>
          
          {benefits.partnerDiscounts.map((discount) => (
            <View key={discount.id} style={styles.discountRow}>
              <View style={styles.discountInfo}>
                <Text style={styles.discountPartner}>{discount.partner}</Text>
                <Text style={styles.discountDetails}>{discount.discount}</Text>
                <Text style={styles.discountExpiry}>Expires: {discount.expires}</Text>
              </View>
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Discounts</Text>
            <ChevronRight size={16} color="#4682B4" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.supportCard}>
          <View style={styles.supportIconContainer}>
            <Briefcase size={20} color="#4682B4" />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Benefits Support</Text>
            <Text style={styles.supportDescription}>
              Have questions about your benefits? Contact your HR department or benefits coordinator.
            </Text>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Fixed Footer usage with proper props */}
      <Footer 
        tabs={footerTabs}
        activeTab="benefits"
        onTabPress={handleTabPress}
      />
    </View>
  );
}

// Styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  utilization: {
    marginTop: 8,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  utilizationTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  utilizationPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
  },
  utilizationHelp: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIcon: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  benefitCoverage: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
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
  fundsDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  discountInfo: {
    flex: 1,
  },
  discountPartner: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  discountDetails: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  discountExpiry: {
    fontSize: 10,
    color: '#666',
  },
  claimButton: {
    backgroundColor: '#E6F0F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  claimButtonText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
    supportCard: {
      backgroundColor: '#E6F0F9',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
  });