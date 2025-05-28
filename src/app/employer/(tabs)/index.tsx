import { Link } from 'expo-router';
import { Activity, AlertTriangle, BarChart, Bell, Building, Clock, DollarSign, Eye, PieChart, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Common/layout/Header';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

export default function EmployerDashboard() {
  // State to track which feature card is currently being highlighted
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  
  // Company information (in a real app, this would come from context or API)
  const companyInfo = {
    name: 'Acme Corporation',
    employeeCount: 412,
    utilizationRate: 63,
    unrealizedBenefitsValue: 182500,
    averageHealthScore: 78,
    healthcareSavings: 406720
  };
  
  // Toggle highlight for a feature
  const toggleHighlight = (feature: string) => {
    setHighlightedFeature(highlightedFeature === feature ? null : feature);
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="HR Dashboard"
        rightComponent={
          <View style={styles.headerIcons}>
            <View style={styles.notificationContainer}>
              <Bell size={24} color="#FFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>5</Text>
              </View>
            </View>
            <View style={styles.profileIcon}>
              <Building size={24} color="#6A5ACD" />
            </View>
          </View>
        }
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>HR Dashboard</Text>
            <Text style={styles.companyName}>{companyInfo.name}</Text>
          </View>
          <View style={styles.employeeCountBadge}>
            <Text style={styles.employeeCountText}>{companyInfo.employeeCount} Employees</Text>
          </View>
        </View>
        
        <View style={styles.cardGrid}>
          {/* Benefits Optimization Dashboard */}
          <TouchableOpacity 
            style={[
              styles.card, 
              highlightedFeature === 'benefits-optimization' 
                ? [styles.highlightedCard, styles.fullWidthCard] 
                : styles.halfWidthCard
            ]}
            onPress={() => toggleHighlight('benefits-optimization')}
            activeOpacity={0.8}
          >
            {highlightedFeature === 'benefits-optimization' && (
              <View style={styles.newFeatureBadge}>
                <Text style={styles.newFeatureText}>NEW FEATURE</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <DollarSign size={20} color="#6A5ACD" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Benefits Optimization</Text>
            </View>
            <Text style={styles.metricValue}>
              ${companyInfo.unrealizedBenefitsValue.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>Unrealized benefits value</Text>
            
            {highlightedFeature === 'benefits-optimization' && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedTitle}>Benefits Optimization Dashboard</Text>
                <Text style={styles.expandedDescription}>
                  Identify unrealized benefit value and opportunities to increase utilization.
                </Text>
                
                <View style={styles.utilizationContainer}>
                  <View style={styles.utilizationHeader}>
                    <Text style={styles.utilizationLabel}>Benefits Utilization Rate</Text>
                    <Text style={styles.utilizationValue}>{companyInfo.utilizationRate}%</Text>
                  </View>
                  <ProgressBar progress={companyInfo.utilizationRate} />
                </View>
                
                <View style={styles.alertsContainer}>
                  <View style={styles.alertItem}>
                    <AlertTriangle size={14} color="#FF9800" style={styles.alertIcon} />
                    <Text style={styles.alertText}>
                      Only 28% of eligible employees have completed skin cancer screenings.
                    </Text>
                  </View>
                  
                  <View style={styles.alertItem}>
                    <AlertTriangle size={14} color="#FF9800" style={styles.alertIcon} />
                    <Text style={styles.alertText}>
                      Sales team has the lowest preventative care completion at 58%.
                    </Text>
                  </View>
                </View>
                
                <Link href="/employer/analytics/benefits-optimization" asChild>
                  <TouchableOpacity style={styles.viewDashboardButton}>
                    <Eye size={14} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>View Full Dashboard</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Health Metrics */}
          <TouchableOpacity 
            style={[
              styles.card, 
              highlightedFeature === 'health-metrics' 
                ? [styles.highlightedCard, styles.fullWidthCard] 
                : styles.halfWidthCard
            ]}
            onPress={() => toggleHighlight('health-metrics')}
            activeOpacity={0.8}
          >
            {highlightedFeature === 'health-metrics' && (
              <View style={[styles.newFeatureBadge, styles.blueBadge]}>
                <Text style={styles.newFeatureText}>NEW FEATURE</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <Activity size={20} color="#4682B4" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Health Metrics</Text>
            </View>
            <Text style={[styles.metricValue, styles.blueValue]}>
              {companyInfo.averageHealthScore}%
            </Text>
            <Text style={styles.metricLabel}>Average health score</Text>
            
            {highlightedFeature === 'health-metrics' && (
              <View style={styles.expandedContent}>
                <Text style={[styles.expandedTitle, styles.blueTitle]}>Health Score Analytics</Text>
                <Text style={styles.expandedDescription}>
                  Company-wide analytics on employee health scores and preventative care engagement.
                </Text>
                
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricCardTitle}>Department Comparison</Text>
                    <View style={styles.departmentRow}>
                      <Text style={styles.departmentName}>Engineering</Text>
                      <Text style={styles.departmentValue}>82%</Text>
                    </View>
                    <View style={styles.departmentRow}>
                      <Text style={styles.departmentName}>Marketing</Text>
                      <Text style={styles.departmentValue}>79%</Text>
                    </View>
                    <View style={styles.departmentRow}>
                      <Text style={styles.departmentName}>Sales</Text>
                      <Text style={[styles.departmentValue, styles.alertValue]}>64%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricCard}>
                    <Text style={styles.metricCardTitle}>Score Categories</Text>
                    <View style={styles.departmentRow}>
                      <Text style={styles.departmentName}>Preventative</Text>
                      <Text style={styles.departmentValue}>76%</Text>
                    </View>
                    <View style={styles.departmentRow}>
                      <Text style={styles.departmentName}>Wellness</Text>
                      <Text style={styles.departmentValue}>68%</Text>
                    </View>
                    <View style={styles.departmentRow}>
                      <Text style={styles.departmentName}>Risk Factors</Text>
                      <Text style={styles.departmentValue}>82%</Text>
                    </View>
                  </View>
                </View>
                
                <Link href="/employer/analytics/health-metrics" asChild>
                  <TouchableOpacity style={[styles.viewDashboardButton, styles.blueButton]}>
                    <BarChart size={14} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>View Health Analytics</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* ROI Analysis */}
        <TouchableOpacity 
          style={[
            styles.card, 
            styles.fullWidthCard,
            highlightedFeature === 'roi-analysis' && styles.highlightedCard
          ]}
          onPress={() => toggleHighlight('roi-analysis')}
          activeOpacity={0.8}
        >
          {highlightedFeature === 'roi-analysis' && (
            <View style={[styles.newFeatureBadge, styles.greenBadge]}>
              <Text style={styles.newFeatureText}>NEW FEATURE</Text>
            </View>
          )}
          <View style={styles.roiHeader}>
            <View style={styles.cardHeader}>
              <DollarSign size={20} color="#4CAF50" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>ROI Analysis</Text>
            </View>
            <Text style={[styles.metricValue, styles.greenValue]}>
              ${companyInfo.healthcareSavings.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.metricLabel}>Total company healthcare savings</Text>
          
          {highlightedFeature === 'roi-analysis' && (
            <View style={styles.expandedContent}>
              <Text style={[styles.expandedTitle, styles.greenTitle]}>Healthcare ROI Report</Text>
              <Text style={styles.expandedDescription}>
                Financial impact analysis of your company's preventative healthcare program.
              </Text>
              
              <View style={styles.roiMetrics}>
                <View style={styles.roiRow}>
                  <Text style={styles.roiLabel}>Program Participation</Text>
                  <Text style={styles.roiValue}>328/412 employees</Text>
                </View>
                <View style={styles.roiRow}>
                  <Text style={styles.roiLabel}>Average Savings Per Employee</Text>
                  <Text style={styles.roiValue}>$1,240</Text>
                </View>
                <View style={styles.roiRow}>
                  <Text style={styles.roiLabel}>Reduced Absenteeism</Text>
                  <Text style={styles.roiValue}>27%</Text>
                </View>
                <View style={styles.roiRow}>
                  <Text style={styles.roiLabel}>Healthcare Cost Reduction</Text>
                  <Text style={styles.roiValue}>16%</Text>
                </View>
              </View>
              
              <View style={styles.buttonGroup}>
                <Link href="/employer/analytics/roi-report" asChild>
                  <TouchableOpacity style={[styles.viewDashboardButton, styles.greenButton, styles.halfButton]}>
                    <PieChart size={14} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>View Report</Text>
                  </TouchableOpacity>
                </Link>
                
                <TouchableOpacity style={[styles.outlineButton, styles.greenOutline, styles.halfButton]}>
                  <Clock size={14} color="#4CAF50" style={styles.buttonIcon} />
                  <Text style={[styles.buttonText, styles.greenButtonText]}>Schedule Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Preventative Care Completion */}
        <View style={[styles.card, styles.fullWidthCard]}>
          <Text style={styles.cardTitle}>Preventative Care Completion</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Annual Physicals</Text>
              <Text style={styles.progressValue}>78%</Text>
            </View>
            <ProgressBar progress={78} color="#4682B4" />
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Dental Checkups</Text>
              <Text style={styles.progressValue}>65%</Text>
            </View>
            <ProgressBar progress={65} color="#4CAF50" />
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Eye Exams</Text>
              <Text style={styles.progressValue}>42%</Text>
            </View>
            <ProgressBar progress={42} color="#FF9800" />
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Skin Checks</Text>
              <Text style={[styles.progressValue, styles.redValue]}>28%</Text>
            </View>
            <ProgressBar progress={28} color="#F44336" />
          </View>
        </View>
        
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <Link href="/employer/program/challenges" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <Users size={24} color="#6A5ACD" style={styles.quickActionIcon} />
              <Text style={styles.quickActionText}>Create Challenge</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employer/communications" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <Bell size={24} color="#6A5ACD" style={styles.quickActionIcon} />
              <Text style={styles.quickActionText}>Send Reminder</Text>
            </TouchableOpacity>
          </Link>
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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    position: 'relative',
    marginRight: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F44336',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 14,
    color: '#666',
  },
  employeeCountBadge: {
    backgroundColor: '#E6E0F8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  employeeCountText: {
    color: '#6A5ACD',
    fontWeight: '500',
    fontSize: 14,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  halfWidthCard: {
    width: '48%',
  },
  fullWidthCard: {
    width: '100%',
  },
  highlightedCard: {
    borderColor: '#6A5ACD',
    borderWidth: 2,
    shadowColor: 'rgba(106, 90, 205, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newFeatureBadge: {
    backgroundColor: '#E6E0F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  blueBadge: {
    backgroundColor: '#E6F0F9',
  },
  greenBadge: {
    backgroundColor: '#E8F5E9',
  },
  newFeatureText: {
    fontSize: 10,
    color: '#6A5ACD',
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A5ACD',
    marginBottom: 4,
  },
  blueValue: {
    color: '#4682B4',
  },
  greenValue: {
    color: '#4CAF50',
  },
  redValue: {
    color: '#F44336',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  expandedContent: {
    backgroundColor: '#F9F8FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A5ACD',
    marginBottom: 4,
  },
  blueTitle: {
    color: '#4682B4',
  },
  greenTitle: {
    color: '#4CAF50',
  },
  expandedDescription: {
    fontSize: 12,
    color: '#333',
    marginBottom: 12,
  },
  utilizationContainer: {
    marginBottom: 12,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  utilizationLabel: {
    fontSize: 12,
    color: '#333',
  },
  utilizationValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A5ACD',
  },
  alertsContainer: {
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  viewDashboardButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueButton: {
    backgroundColor: '#4682B4',
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  greenButtonText: {
    color: '#4CAF50',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    width: '48%',
  },
  outlineButton: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  greenOutline: {
    borderColor: '#4CAF50',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 6,
  },
  departmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  departmentName: {
    fontSize: 12,
    color: '#333',
  },
  departmentValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  alertValue: {
    color: '#FF9800',
  },
  roiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roiMetrics: {
    marginBottom: 12,
  },
  roiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roiLabel: {
    fontSize: 12,
    color: '#333',
  },
  roiValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});