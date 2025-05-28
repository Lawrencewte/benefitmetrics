import { Activity, AlertTriangle, ArrowDown, ArrowUp, Calendar, Download, Filter, HelpCircle, Info, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

type Department = {
  id: string;
  name: string;
  headcount: number;
  healthScore: number;
  previousScore: number;
  atRiskPercentage: number;
  preventativeCare: number;
  screenings: number;
  wellnessParticipation: number;
};

type HealthCategory = {
  id: string;
  name: string;
  score: number;
  previousScore: number;
  description: string;
};

type RiskFactor = {
  id: string;
  name: string;
  percentage: number;
  previousPercentage: number;
  impactLevel: 'high' | 'medium' | 'low';
  description: string;
};

export default function HealthMetricsScreen() {
  const [timeframe, setTimeframe] = useState('quarterly');
  const [showFilters, setShowFilters] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  // Sample data - in a real app, this would come from an API or context
  const companyMetrics = {
    overallHealthScore: 78,
    previousHealthScore: 75,
    targetHealthScore: 85,
    atRiskCount: 52,
    totalEmployees: 412,
    improvementPercentage: 4,
    screeningCompletionRate: 68
  };
  
  const departments: Department[] = [
    {
      id: 'engineering',
      name: 'Engineering',
      headcount: 128,
      healthScore: 82,
      previousScore: 80,
      atRiskPercentage: 7,
      preventativeCare: 85,
      screenings: 78,
      wellnessParticipation: 72
    },
    {
      id: 'marketing',
      name: 'Marketing',
      headcount: 82,
      healthScore: 79,
      previousScore: 77,
      atRiskPercentage: 9,
      preventativeCare: 81,
      screenings: 76,
      wellnessParticipation: 68
    },
    {
      id: 'operations',
      name: 'Operations',
      headcount: 96,
      healthScore: 76,
      previousScore: 75,
      atRiskPercentage: 12,
      preventativeCare: 78,
      screenings: 72,
      wellnessParticipation: 64
    },
    {
      id: 'sales',
      name: 'Sales',
      headcount: 106,
      healthScore: 64,
      previousScore: 58,
      atRiskPercentage: 18,
      preventativeCare: 66,
      screenings: 58,
      wellnessParticipation: 52
    }
  ];
  
  const healthCategories: HealthCategory[] = [
    {
      id: 'preventative',
      name: 'Preventative Care',
      score: 76,
      previousScore: 72,
      description: 'Completion of recommended preventative services.'
    },
    {
      id: 'biometric',
      name: 'Biometric Health',
      score: 74,
      previousScore: 71,
      description: 'Measures of key health indicators like blood pressure and cholesterol.'
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle Factors',
      score: 68,
      previousScore: 64,
      description: 'Healthy behaviors like exercise, nutrition, and sleep.'
    },
    {
      id: 'mental',
      name: 'Mental Wellbeing',
      score: 70,
      previousScore: 65,
      description: 'Mental health indicators including stress levels and emotional wellbeing.'
    }
  ];
  
  const riskFactors: RiskFactor[] = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular Risk',
      percentage: 14,
      previousPercentage: 16,
      impactLevel: 'high',
      description: 'Employees with elevated risk of heart disease.'
    },
    {
      id: 'obesity',
      name: 'Obesity',
      percentage: 22,
      previousPercentage: 24,
      impactLevel: 'high',
      description: 'Employees with BMI in the obese range.'
    },
    {
      id: 'diabetes',
      name: 'Diabetes Risk',
      percentage: 9,
      previousPercentage: 10,
      impactLevel: 'high',
      description: 'Employees with elevated blood sugar or pre-diabetic indicators.'
    },
    {
      id: 'stress',
      name: 'High Stress',
      percentage: 32,
      previousPercentage: 38,
      impactLevel: 'medium',
      description: 'Employees reporting high or very high stress levels.'
    },
    {
      id: 'sleep',
      name: 'Sleep Issues',
      percentage: 28,
      previousPercentage: 30,
      impactLevel: 'medium',
      description: 'Employees reporting poor sleep quality or insufficient sleep.'
    }
  ];
  
  // Sort departments by health score (highest first)
  const sortedDepartments = [...departments].sort((a, b) => b.healthScore - a.healthScore);
  
  // Get trend icon and color based on current vs previous values
  const getTrend = (current: number, previous: number, isPositive: boolean = true) => {
    const improved = isPositive ? current > previous : current < previous;
    const value = Math.abs(current - previous);
    
    if (improved) {
      return {
        icon: <ArrowUp size={12} color="#4CAF50" />,
        color: '#4CAF50',
        value: value
      };
    } else {
      return {
        icon: <ArrowDown size={12} color="#F44336" />,
        color: '#F44336',
        value: value
      };
    }
  };
  
  const toggleTooltip = (id: string) => {
    setShowTooltip(showTooltip === id ? null : id);
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Health Metrics" 
        showBackButton
      />
      
      <View style={styles.timeframeContainer}>
        <Text style={styles.timeframeLabel}>Timeframe:</Text>
        <View style={styles.timeframeOptions}>
          <TouchableOpacity 
            style={[styles.timeframeOption, timeframe === 'monthly' && styles.activeTimeframe]}
            onPress={() => setTimeframe('monthly')}
          >
            <Text style={[styles.timeframeText, timeframe === 'monthly' && styles.activeTimeframeText]}>
              Monthly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.timeframeOption, timeframe === 'quarterly' && styles.activeTimeframe]}
            onPress={() => setTimeframe('quarterly')}
          >
            <Text style={[styles.timeframeText, timeframe === 'quarterly' && styles.activeTimeframeText]}>
              Quarterly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.timeframeOption, timeframe === 'yearly' && styles.activeTimeframe]}
            onPress={() => setTimeframe('yearly')}
          >
            <Text style={[styles.timeframeText, timeframe === 'yearly' && styles.activeTimeframeText]}>
              Yearly
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} color="#4682B4" />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          <Text style={styles.filtersNote}>
            Additional filters will be available in future updates.
          </Text>
        </View>
      )}
      
      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Activity size={24} color="#4682B4" />
            <Text style={styles.summaryTitle}>Overall Health Score</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.healthScore}>{companyMetrics.overallHealthScore}</Text>
            <View style={styles.scoreTrend}>
              {companyMetrics.overallHealthScore > companyMetrics.previousHealthScore ? (
                <ArrowUp size={16} color="#4CAF50" />
              ) : (
                <ArrowDown size={16} color="#F44336" />
              )}
              <Text style={[
                styles.trendText,
                companyMetrics.overallHealthScore > companyMetrics.previousHealthScore 
                  ? styles.positiveTrend 
                  : styles.negativeTrend
              ]}>
                {Math.abs(companyMetrics.overallHealthScore - companyMetrics.previousHealthScore)} pts
              </Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={companyMetrics.overallHealthScore} 
              color="#4682B4" 
            />
            <View style={[styles.targetMarker, { left: `${companyMetrics.targetHealthScore}%` }]} />
          </View>
          
          <View style={styles.targetInfoContainer}>
            <Text style={styles.targetInfoText}>Target: {companyMetrics.targetHealthScore}</Text>
            <Text style={styles.improvementText}>
              {companyMetrics.improvementPercentage}% improvement from previous {timeframe}
            </Text>
          </View>
          
          <View style={styles.atRiskContainer}>
            <View style={styles.atRiskContent}>
              <Text style={styles.atRiskLabel}>
                At-Risk Employees
                <TouchableOpacity
                  onPress={() => toggleTooltip('at-risk')}
                  style={styles.tooltipButton}
                >
                  <HelpCircle size={12} color="#999" />
                </TouchableOpacity>
              </Text>
              <Text style={styles.atRiskValue}>
                {companyMetrics.atRiskCount} ({Math.round(companyMetrics.atRiskCount / companyMetrics.totalEmployees * 100)}%)
              </Text>
            </View>
            
            <View style={styles.verticalDivider} />
            
            <View style={styles.atRiskContent}>
              <Text style={styles.atRiskLabel}>
                Screening Completion
                <TouchableOpacity
                  onPress={() => toggleTooltip('screening')}
                  style={styles.tooltipButton}
                >
                  <HelpCircle size={12} color="#999" />
                </TouchableOpacity>
              </Text>
              <Text style={styles.atRiskValue}>{companyMetrics.screeningCompletionRate}%</Text>
            </View>
          </View>
          
          {showTooltip === 'at-risk' && (
            <View style={styles.tooltipContainer}>
              <Text style={styles.tooltipText}>
                Employees identified as having multiple risk factors that may lead to chronic conditions.
              </Text>
            </View>
          )}
          
          {showTooltip === 'screening' && (
            <View style={styles.tooltipContainer}>
              <Text style={styles.tooltipText}>
                Percentage of eligible employees who have completed recommended health screenings.
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>Department Comparison</Text>
        
        {sortedDepartments.map(dept => {
          const trend = getTrend(dept.healthScore, dept.previousScore);
          
          return (
            <TouchableOpacity key={dept.id} style={styles.departmentCard}>
              <View style={styles.departmentHeader}>
                <View style={styles.departmentTitleContainer}>
                  <Text style={styles.departmentName}>{dept.name}</Text>
                  <Text style={styles.departmentSubtitle}>{dept.headcount} employees</Text>
                </View>
                <View style={styles.departmentScoreContainer}>
                  <Text style={styles.departmentScore}>{dept.healthScore}</Text>
                  <View style={styles.trendContainer}>
                    {trend.icon}
                    <Text style={[styles.trendText, { color: trend.color }]}>
                      {trend.value}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.metricsContainer}>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Preventative Care</Text>
                  <Text style={styles.metricValue}>{dept.preventativeCare}%</Text>
                </View>
                
                <View style={styles.metricDivider} />
                
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Screenings</Text>
                  <Text style={styles.metricValue}>{dept.screenings}%</Text>
                </View>
                
                <View style={styles.metricDivider} />
                
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>At-Risk</Text>
                  <Text style={[
                    styles.metricValue, 
                    dept.atRiskPercentage > 15 ? styles.highRiskValue : (dept.atRiskPercentage > 10 ? styles.mediumRiskValue : styles.lowRiskValue)
                  ]}>
                    {dept.atRiskPercentage}%
                  </Text>
                </View>
              </View>
              
              {dept.healthScore < 70 && (
                <View style={styles.alertContainer}>
                  <AlertTriangle size={14} color="#F44336" style={styles.alertIcon} />
                  <Text style={styles.alertText}>
                    Low health score. Consider targeted wellness initiatives.
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        
        <Text style={styles.sectionTitle}>Health Categories</Text>
        
        <View style={styles.categoriesContainer}>
          {healthCategories.map(category => {
            const trend = getTrend(category.score, category.previousScore);
            
            return (
              <View key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={styles.categoryScoreContainer}>
                    <Text style={styles.categoryScore}>{category.score}</Text>
                    <View style={styles.trendContainer}>
                      {trend.icon}
                      <Text style={[styles.trendText, { color: trend.color }]}>
                        {trend.value}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <ProgressBar 
                  progress={category.score} 
                  color={category.score < 70 ? "#FF9800" : "#4682B4"} 
                />
                
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            );
          })}
        </View>
        
        <Text style={styles.sectionTitle}>Health Risk Factors</Text>
        
        {riskFactors.map(risk => {
          const trend = getTrend(risk.percentage, risk.previousPercentage, false);
          const impactColor = 
            risk.impactLevel === 'high' ? '#F44336' : 
            risk.impactLevel === 'medium' ? '#FF9800' : 
            '#4CAF50';
          
          return (
            <View key={risk.id} style={styles.riskCard}>
              <View style={styles.riskHeader}>
                <View style={styles.riskTitleContainer}>
                  <Text style={styles.riskName}>{risk.name}</Text>
                  <View style={[styles.impactBadge, { backgroundColor: `${impactColor}20` }]}>
                    <Text style={[styles.impactText, { color: impactColor }]}>
                      {risk.impactLevel.charAt(0).toUpperCase() + risk.impactLevel.slice(1)} Impact
                    </Text>
                  </View>
                </View>
                <View style={styles.riskValueContainer}>
                  <Text style={styles.riskValue}>{risk.percentage}%</Text>
                  <View style={styles.trendContainer}>
                    {trend.icon}
                    <Text style={[styles.trendText, { color: trend.color }]}>
                      {trend.value}%
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.riskDescription}>{risk.description}</Text>
            </View>
          );
        })}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={16} color="#4682B4" style={styles.actionIcon} />
            <Text style={styles.actionText}>Export Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={16} color="#4682B4" style={styles.actionIcon} />
            <Text style={styles.actionText}>Share Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={16} color="#4682B4" style={styles.actionIcon} />
            <Text style={styles.actionText}>Schedule Report</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Info size={20} color="#4682B4" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About Health Metrics</Text>
            <Text style={styles.infoText}>
              Health Scores are calculated based on aggregated, anonymized employee health data from preventative care services, health risk assessments, and wellness program participation.
            </Text>
            <Text style={styles.infoText}>
              These insights help you identify opportunities to improve employee health outcomes and target wellness initiatives more effectively.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <EmployerFooter 
        activePath="analytics"
        employee={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timeframeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  timeframeOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  timeframeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  activeTimeframe: {
    backgroundColor: '#E6F0F9',
  },
  timeframeText: {
    fontSize: 12,
    color: '#666',
  },
  activeTimeframeText: {
    color: '#4682B4',
    fontWeight: '500',
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filtersNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  healthScore: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4682B4',
  },
  scoreTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#F5F7F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  positiveTrend: {
    color: '#4CAF50',
  },
  negativeTrend: {
    color: '#F44336',
  },
  progressBarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  targetMarker: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 16,
    backgroundColor: '#FF9800',
  },
  targetInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  targetInfoText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '500',
  },
  improvementText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  atRiskContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
  },
  atRiskContent: {
    flex: 1,
  },
  atRiskLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  atRiskValue: {
    fontSize: 16,
    fontWeight: '600',
  },
      verticalDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  tooltipButton: {
    marginLeft: 4,
  },
  tooltipContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  tooltipText: {
    fontSize: 12,
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  departmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  departmentTitleContainer: {
    flex: 1,
  },
  departmentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  departmentSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  departmentScoreContainer: {
    alignItems: 'flex-end',
  },
  departmentScore: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4682B4',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  highRiskValue: {
    color: '#F44336',
  },
  mediumRiskValue: {
    color: '#FF9800',
  },
  lowRiskValue: {
    color: '#4CAF50',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 8,
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#F44336',
    flex: 1,
  },
  categoriesContainer: {
    marginBottom: 16,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryScore: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  riskCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  riskTitleContainer: {
    flex: 1,
  },
  riskName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 2,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '500',
  },
  riskValueContainer: {
    alignItems: 'flex-end',
  },
  riskValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  riskDescription: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E6F0F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C9DEF0',
    flexDirection: 'row',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#4682B4',
    lineHeight: 18,
    marginBottom: 4,
  },
});