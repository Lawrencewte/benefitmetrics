import { Link } from 'expo-router';
import { Activity, AlertTriangle, BarChart, Bell, Building, Clock, DollarSign, Eye, PieChart, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  
  // Define all styles as objects instead of StyleSheet
  const containerStyle = {
    flex: 1,
    backgroundColor: '#F5F7F9',
  };
  
  const headerIconsStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  };
  
  const notificationContainerStyle = {
    position: 'relative' as const,
    marginRight: 16,
  };
  
  const notificationBadgeStyle = {
    position: 'absolute' as const,
    top: -4,
    right: -4,
    backgroundColor: '#F44336',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  
  const notificationCountStyle = {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600' as const,
  };
  
  const profileIconStyle = {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  
  const contentStyle = {
    flex: 1,
    padding: 16,
  };
  
  const dashboardHeaderStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 24,
  };
  
  const dashboardTitleStyle = {
    fontSize: 18,
    fontWeight: '600' as const,
  };
  
  const companyNameStyle = {
    fontSize: 14,
    color: '#666',
  };
  
  const employeeCountBadgeStyle = {
    backgroundColor: '#E6E0F8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  };
  
  const employeeCountTextStyle = {
    color: '#6A5ACD',
    fontWeight: '500' as const,
    fontSize: 14,
  };
  
  const cardGridStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 16,
  };
  
  const baseCardStyle = {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  };
  
  const halfWidthCardStyle = {
    ...baseCardStyle,
    width: '48%',
  };
  
  const fullWidthCardStyle = {
    ...baseCardStyle,
    width: '100%',
  };
  
  const highlightedCardStyle = {
    borderColor: '#6A5ACD',
    borderWidth: 2,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  };
  
  const newFeatureBadgeStyle = {
    backgroundColor: '#E6E0F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start' as const,
    marginBottom: 8,
  };
  
  const blueBadgeStyle = {
    backgroundColor: '#E6F0F9',
  };
  
  const greenBadgeStyle = {
    backgroundColor: '#E8F5E9',
  };
  
  const newFeatureTextStyle = {
    fontSize: 10,
    color: '#6A5ACD',
    fontWeight: '600' as const,
  };
  
  const cardHeaderStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  };
  
  const cardIconStyle = {
    marginRight: 8,
  };
  
  const cardTitleStyle = {
    fontSize: 16,
    fontWeight: '500' as const,
  };
  
  const metricValueStyle = {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#6A5ACD',
    marginBottom: 4,
  };
  
  const blueValueStyle = {
    color: '#4682B4',
  };
  
  const greenValueStyle = {
    color: '#4CAF50',
  };
  
  const redValueStyle = {
    color: '#F44336',
  };
  
  const metricLabelStyle = {
    fontSize: 12,
    color: '#666',
  };
  
  const expandedContentStyle = {
    backgroundColor: '#F9F8FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  };
  
  const expandedTitleStyle = {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6A5ACD',
    marginBottom: 4,
  };
  
  const blueTitleStyle = {
    color: '#4682B4',
  };
  
  const greenTitleStyle = {
    color: '#4CAF50',
  };
  
  const expandedDescriptionStyle = {
    fontSize: 12,
    color: '#333',
    marginBottom: 12,
  };
  
  const utilizationContainerStyle = {
    marginBottom: 12,
  };
  
  const utilizationHeaderStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  };
  
  const utilizationLabelStyle = {
    fontSize: 12,
    color: '#333',
  };
  
  const utilizationValueStyle = {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#6A5ACD',
  };
  
  const alertsContainerStyle = {
    marginBottom: 12,
  };
  
  const alertItemStyle = {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  };
  
  const alertIconStyle = {
    marginRight: 8,
    marginTop: 2,
  };
  
  const alertTextStyle = {
    fontSize: 12,
    color: '#333',
    flex: 1,
  };
  
  const viewDashboardButtonStyle = {
    backgroundColor: '#6A5ACD',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  
  const blueButtonStyle = {
    backgroundColor: '#4682B4',
  };
  
  const greenButtonStyle = {
    backgroundColor: '#4CAF50',
  };
  
  const buttonIconStyle = {
    marginRight: 6,
  };
  
  const buttonTextStyle = {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500' as const,
  };
  
  const greenButtonTextStyle = {
    color: '#4CAF50',
  };
  
  const buttonGroupStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  };
  
  const halfButtonStyle = {
    width: '48%',
  };
  
  const outlineButtonStyle = {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    backgroundColor: 'transparent',
  };
  
  const greenOutlineStyle = {
    borderColor: '#4CAF50',
  };
  
  const metricsGridStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  };
  
  const metricCardStyle = {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  };
  
  const metricCardTitleStyle = {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#4682B4',
    marginBottom: 6,
  };
  
  const departmentRowStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 4,
  };
  
  const departmentNameStyle = {
    fontSize: 12,
    color: '#333',
  };
  
  const departmentValueStyle = {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#333',
  };
  
  const alertValueStyle = {
    color: '#FF9800',
  };
  
  const roiHeaderStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  };
  
  const roiMetricsStyle = {
    marginBottom: 12,
  };
  
  const roiRowStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 6,
  };
  
  const roiLabelStyle = {
    fontSize: 12,
    color: '#333',
  };
  
  const roiValueStyle = {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#333',
  };
  
  const progressSectionStyle = {
    marginBottom: 12,
  };
  
  const progressHeaderStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  };
  
  const progressLabelStyle = {
    fontSize: 14,
    color: '#333',
  };
  
  const progressValueStyle = {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#333',
  };
  
  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  };
  
  const quickActionsContainerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 24,
  };
  
  const quickActionStyle = {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  };
  
  const quickActionIconStyle = {
    marginBottom: 8,
  };
  
  const quickActionTextStyle = {
    fontSize: 14,
    fontWeight: '500' as const,
  };
  
  return (
    <View style={containerStyle}>
      <Header 
        title="HR Dashboard"
        rightComponent={
          <View style={headerIconsStyle}>
            <View style={notificationContainerStyle}>
              <Bell size={24} color="#FFF" />
              <View style={notificationBadgeStyle}>
                <Text style={notificationCountStyle}>5</Text>
              </View>
            </View>
            <View style={profileIconStyle}>
              <Building size={24} color="#6A5ACD" />
            </View>
          </View>
        }
      />
      
      <ScrollView style={contentStyle}>
        <View style={dashboardHeaderStyle}>
          <View>
            <Text style={dashboardTitleStyle}>HR Dashboard</Text>
            <Text style={companyNameStyle}>{companyInfo.name}</Text>
          </View>
          <View style={employeeCountBadgeStyle}>
            <Text style={employeeCountTextStyle}>{companyInfo.employeeCount} Employees</Text>
          </View>
        </View>
        
        <View style={cardGridStyle}>
          {/* Benefits Optimization Dashboard */}
          <TouchableOpacity 
            style={[
              highlightedFeature === 'benefits-optimization' 
                ? { ...fullWidthCardStyle, ...highlightedCardStyle }
                : halfWidthCardStyle
            ]}
            onPress={() => toggleHighlight('benefits-optimization')}
            activeOpacity={0.8}
          >
            {highlightedFeature === 'benefits-optimization' && (
              <View style={newFeatureBadgeStyle}>
                <Text style={newFeatureTextStyle}>NEW FEATURE</Text>
              </View>
            )}
            <View style={cardHeaderStyle}>
              <DollarSign size={20} color="#6A5ACD" style={cardIconStyle} />
              <Text style={cardTitleStyle}>Benefits Optimization</Text>
            </View>
            <Text style={metricValueStyle}>
              ${companyInfo.unrealizedBenefitsValue.toLocaleString()}
            </Text>
            <Text style={metricLabelStyle}>Unrealized benefits value</Text>
            
            {highlightedFeature === 'benefits-optimization' && (
              <View style={expandedContentStyle}>
                <Text style={expandedTitleStyle}>Benefits Optimization Dashboard</Text>
                <Text style={expandedDescriptionStyle}>
                  Identify unrealized benefit value and opportunities to increase utilization.
                </Text>
                
                <View style={utilizationContainerStyle}>
                  <View style={utilizationHeaderStyle}>
                    <Text style={utilizationLabelStyle}>Benefits Utilization Rate</Text>
                    <Text style={utilizationValueStyle}>{companyInfo.utilizationRate}%</Text>
                  </View>
                  <ProgressBar progress={companyInfo.utilizationRate} color="#6A5ACD" />
                </View>
                
                <View style={alertsContainerStyle}>
                  <View style={alertItemStyle}>
                    <AlertTriangle size={14} color="#FF9800" style={alertIconStyle} />
                    <Text style={alertTextStyle}>
                      Only 28% of eligible employees have completed skin cancer screenings.
                    </Text>
                  </View>
                  
                  <View style={alertItemStyle}>
                    <AlertTriangle size={14} color="#FF9800" style={alertIconStyle} />
                    <Text style={alertTextStyle}>
                      Sales team has the lowest preventative care completion at 58%.
                    </Text>
                  </View>
                </View>
                
                <Link href="/employer/analytics/benefits-optimization" asChild>
                  <TouchableOpacity style={viewDashboardButtonStyle}>
                    <Eye size={14} color="#FFF" style={buttonIconStyle} />
                    <Text style={buttonTextStyle}>View Full Dashboard</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Health Metrics */}
          <TouchableOpacity 
            style={[
              highlightedFeature === 'health-metrics' 
                ? { ...fullWidthCardStyle, ...highlightedCardStyle }
                : halfWidthCardStyle
            ]}
            onPress={() => toggleHighlight('health-metrics')}
            activeOpacity={0.8}
          >
            {highlightedFeature === 'health-metrics' && (
              <View style={{ ...newFeatureBadgeStyle, ...blueBadgeStyle }}>
                <Text style={newFeatureTextStyle}>NEW FEATURE</Text>
              </View>
            )}
            <View style={cardHeaderStyle}>
              <Activity size={20} color="#4682B4" style={cardIconStyle} />
              <Text style={cardTitleStyle}>Health Metrics</Text>
            </View>
            <Text style={{ ...metricValueStyle, ...blueValueStyle }}>
              {companyInfo.averageHealthScore}%
            </Text>
            <Text style={metricLabelStyle}>Average health score</Text>
            
            {highlightedFeature === 'health-metrics' && (
              <View style={expandedContentStyle}>
                <Text style={{ ...expandedTitleStyle, ...blueTitleStyle }}>Health Score Analytics</Text>
                <Text style={expandedDescriptionStyle}>
                  Company-wide analytics on employee health scores and preventative care engagement.
                </Text>
                
                <View style={metricsGridStyle}>
                  <View style={metricCardStyle}>
                    <Text style={metricCardTitleStyle}>Department Comparison</Text>
                    <View style={departmentRowStyle}>
                      <Text style={departmentNameStyle}>Engineering</Text>
                      <Text style={departmentValueStyle}>82%</Text>
                    </View>
                    <View style={departmentRowStyle}>
                      <Text style={departmentNameStyle}>Marketing</Text>
                      <Text style={departmentValueStyle}>79%</Text>
                    </View>
                    <View style={departmentRowStyle}>
                      <Text style={departmentNameStyle}>Sales</Text>
                      <Text style={{ ...departmentValueStyle, ...alertValueStyle }}>64%</Text>
                    </View>
                  </View>
                  
                  <View style={metricCardStyle}>
                    <Text style={metricCardTitleStyle}>Score Categories</Text>
                    <View style={departmentRowStyle}>
                      <Text style={departmentNameStyle}>Preventative</Text>
                      <Text style={departmentValueStyle}>76%</Text>
                    </View>
                    <View style={departmentRowStyle}>
                      <Text style={departmentNameStyle}>Wellness</Text>
                      <Text style={departmentValueStyle}>68%</Text>
                    </View>
                    <View style={departmentRowStyle}>
                      <Text style={departmentNameStyle}>Risk Factors</Text>
                      <Text style={departmentValueStyle}>82%</Text>
                    </View>
                  </View>
                </View>
                
                <Link href="/employer/analytics/health-metrics" asChild>
                  <TouchableOpacity style={{ ...viewDashboardButtonStyle, ...blueButtonStyle }}>
                    <BarChart size={14} color="#FFF" style={buttonIconStyle} />
                    <Text style={buttonTextStyle}>View Health Analytics</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* ROI Analysis */}
        <TouchableOpacity 
          style={[
            fullWidthCardStyle,
            highlightedFeature === 'roi-analysis' && highlightedCardStyle
          ]}
          onPress={() => toggleHighlight('roi-analysis')}
          activeOpacity={0.8}
        >
          {highlightedFeature === 'roi-analysis' && (
            <View style={{ ...newFeatureBadgeStyle, ...greenBadgeStyle }}>
              <Text style={newFeatureTextStyle}>NEW FEATURE</Text>
            </View>
          )}
          <View style={roiHeaderStyle}>
            <View style={cardHeaderStyle}>
              <DollarSign size={20} color="#4CAF50" style={cardIconStyle} />
              <Text style={cardTitleStyle}>ROI Analysis</Text>
            </View>
            <Text style={{ ...metricValueStyle, ...greenValueStyle }}>
              ${companyInfo.healthcareSavings.toLocaleString()}
            </Text>
          </View>
          <Text style={metricLabelStyle}>Total company healthcare savings</Text>
          
          {highlightedFeature === 'roi-analysis' && (
            <View style={expandedContentStyle}>
              <Text style={{ ...expandedTitleStyle, ...greenTitleStyle }}>Healthcare ROI Report</Text>
              <Text style={expandedDescriptionStyle}>
                Financial impact analysis of your company's preventative healthcare program.
              </Text>
              
              <View style={roiMetricsStyle}>
                <View style={roiRowStyle}>
                  <Text style={roiLabelStyle}>Program Participation</Text>
                  <Text style={roiValueStyle}>328/412 employees</Text>
                </View>
                <View style={roiRowStyle}>
                  <Text style={roiLabelStyle}>Average Savings Per Employee</Text>
                  <Text style={roiValueStyle}>$1,240</Text>
                </View>
                <View style={roiRowStyle}>
                  <Text style={roiLabelStyle}>Reduced Absenteeism</Text>
                  <Text style={roiValueStyle}>27%</Text>
                </View>
                <View style={roiRowStyle}>
                  <Text style={roiLabelStyle}>Healthcare Cost Reduction</Text>
                  <Text style={roiValueStyle}>16%</Text>
                </View>
              </View>
              
              <View style={buttonGroupStyle}>
                <Link href="/employer/analytics/roi-report" asChild>
                  <TouchableOpacity style={{ ...viewDashboardButtonStyle, ...greenButtonStyle, ...halfButtonStyle }}>
                    <PieChart size={14} color="#FFF" style={buttonIconStyle} />
                    <Text style={buttonTextStyle}>View Report</Text>
                  </TouchableOpacity>
                </Link>
                
                <TouchableOpacity style={{ ...outlineButtonStyle, ...greenOutlineStyle, ...halfButtonStyle }}>
                  <Clock size={14} color="#4CAF50" style={buttonIconStyle} />
                  <Text style={{ ...buttonTextStyle, ...greenButtonTextStyle }}>Schedule Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Preventative Care Completion */}
        <View style={fullWidthCardStyle}>
          <Text style={cardTitleStyle}>Preventative Care Completion</Text>
          
          <View style={progressSectionStyle}>
            <View style={progressHeaderStyle}>
              <Text style={progressLabelStyle}>Annual Physicals</Text>
              <Text style={progressValueStyle}>78%</Text>
            </View>
            <ProgressBar progress={78} color="#4682B4" />
          </View>
          
          <View style={progressSectionStyle}>
            <View style={progressHeaderStyle}>
              <Text style={progressLabelStyle}>Dental Checkups</Text>
              <Text style={progressValueStyle}>65%</Text>
            </View>
            <ProgressBar progress={65} color="#4CAF50" />
          </View>
          
          <View style={progressSectionStyle}>
            <View style={progressHeaderStyle}>
              <Text style={progressLabelStyle}>Eye Exams</Text>
              <Text style={progressValueStyle}>42%</Text>
            </View>
            <ProgressBar progress={42} color="#FF9800" />
          </View>
          
          <View style={progressSectionStyle}>
            <View style={progressHeaderStyle}>
              <Text style={progressLabelStyle}>Skin Checks</Text>
              <Text style={{ ...progressValueStyle, ...redValueStyle }}>28%</Text>
            </View>
            <ProgressBar progress={28} color="#F44336" />
          </View>
        </View>
        
        {/* Quick Actions */}
        <Text style={sectionTitleStyle}>Quick Actions</Text>
        <View style={quickActionsContainerStyle}>
          <Link href="/employer/program/challenges" asChild>
            <TouchableOpacity style={quickActionStyle}>
              <Users size={24} color="#6A5ACD" style={quickActionIconStyle} />
              <Text style={quickActionTextStyle}>Create Challenge</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/employer/communications" asChild>
            <TouchableOpacity style={quickActionStyle}>
              <Bell size={24} color="#6A5ACD" style={quickActionIconStyle} />
              <Text style={quickActionTextStyle}>Send Reminder</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}