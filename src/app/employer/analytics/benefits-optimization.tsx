import { AlertTriangle, ArrowDown, ArrowUp, Calendar, DollarSign, Download, Filter, Info, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

type BenefitCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  utilization: number;
  potentialSavings: number;
  trend: {
    value: number;
    isPositive: boolean;
  };
};

type Department = {
  id: string;
  name: string;
  utilization: number;
  ranking: number;
  employeeCount: number;
  completion: Record<string, number>;
};

export default function BenefitsOptimizationScreen() {
  const [timeframe, setTimeframe] = useState('quarterly');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample data - in a real app, this would come from an API or context
  const companyMetrics = {
    totalUnrealizedValue: 182500,
    utilizationRate: 63,
    lastPeriodUtilizationRate: 58,
    potentialSavingsPerEmployee: 485,
    targetUtilizationRate: 85
  };
  
  const benefitCategories: BenefitCategory[] = [
    {
      id: 'preventative',
      name: 'Preventative Care',
      icon: <DollarSign size={20} color="#4682B4" />,
      utilization: 71,
      potentialSavings: 68500,
      trend: {
        value: 5,
        isPositive: true
      }
    },
    {
      id: 'dental',
      name: 'Dental Services',
      icon: <DollarSign size={20} color="#4682B4" />,
      utilization: 62,
      potentialSavings: 32000,
      trend: {
        value: 3,
        isPositive: true
      }
    },
    {
      id: 'vision',
      name: 'Vision Benefits',
      icon: <DollarSign size={20} color="#4682B4" />,
      utilization: 54,
      potentialSavings: 26000,
      trend: {
        value: 1,
        isPositive: false
      }
    },
    {
      id: 'mental',
      name: 'Mental Health Services',
      icon: <DollarSign size={20} color="#4682B4" />,
      utilization: 42,
      potentialSavings: 56000,
      trend: {
        value: 8,
        isPositive: true
      }
    }
  ];
  
  const departments: Department[] = [
    {
      id: 'engineering',
      name: 'Engineering',
      utilization: 74,
      ranking: 1,
      employeeCount: 128,
      completion: {
        'preventative': 82,
        'dental': 78,
        'vision': 68,
        'mental': 63
      }
    },
    {
      id: 'marketing',
      name: 'Marketing',
      utilization: 68,
      ranking: 2,
      employeeCount: 82,
      completion: {
        'preventative': 76,
        'dental': 72,
        'vision': 67,
        'mental': 59
      }
    },
    {
      id: 'operations',
      name: 'Operations',
      utilization: 65,
      ranking: 3,
      employeeCount: 96,
      completion: {
        'preventative': 72,
        'dental': 68,
        'vision': 61,
        'mental': 54
      }
    },
    {
      id: 'sales',
      name: 'Sales',
      utilization: 58,
      ranking: 4,
      employeeCount: 106,
      completion: {
        'preventative': 64,
        'dental': 60,
        'vision': 52,
        'mental': 42
      }
    }
  ];
  
  // Sort departments by utilization rate (highest first)
  const sortedDepartments = [...departments].sort((a, b) => b.utilization - a.utilization);
  
  // Get the top completion rate categories for a department
  const getTopCategories = (dept: Department) => {
    const categories = Object.entries(dept.completion)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
    
    return categories.slice(0, 2);
  };
  
  // Get the bottom completion rate categories for a department
  const getBottomCategories = (dept: Department) => {
    const categories = Object.entries(dept.completion)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.value - b.value);
    
    return categories.slice(0, 2);
  };
  
  // Format category names for display
  const formatCategoryName = (key: string) => {
    const categoryMap: Record<string, string> = {
      'preventative': 'Preventative',
      'dental': 'Dental',
      'vision': 'Vision',
      'mental': 'Mental Health'
    };
    
    return categoryMap[key] || key;
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Benefits Optimization" 
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
          <Filter size={16} color="#6A5ACD" />
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
            <DollarSign size={24} color="#6A5ACD" />
            <Text style={styles.summaryTitle}>Unrealized Benefits Value</Text>
          </View>
          
          <View style={styles.summaryMetrics}>
            <Text style={styles.unrealizedValue}>
              ${companyMetrics.totalUnrealizedValue.toLocaleString()}
            </Text>
            <Text style={styles.unrealizedDescription}>
              Total potential savings from optimizing benefits utilization
            </Text>
          </View>
          
          <View style={styles.utilizationContainer}>
            <View style={styles.utilizationHeader}>
              <Text style={styles.utilizationLabel}>Current Utilization Rate</Text>
              <View style={styles.utilizationValues}>
                <Text style={styles.utilizationValue}>{companyMetrics.utilizationRate}%</Text>
                <View style={styles.utilizationTrend}>
                  <ArrowUp size={12} color="#4CAF50" />
                  <Text style={styles.trendValue}>
                    {companyMetrics.utilizationRate - companyMetrics.lastPeriodUtilizationRate}%
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <ProgressBar 
                progress={companyMetrics.utilizationRate} 
                color="#6A5ACD" 
              />
              <View style={[styles.targetMarker, { left: `${companyMetrics.targetUtilizationRate}%` }]} />
            </View>
            
            <View style={styles.targetContainer}>
              <Text style={styles.targetLabel}>Target: {companyMetrics.targetUtilizationRate}%</Text>
              <Text style={styles.perEmployeeValue}>
                ${companyMetrics.potentialSavingsPerEmployee} potential savings per employee
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Utilization by Benefit Category</Text>
        
        {benefitCategories.map(category => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <View style={styles.categoryTrend}>
                  {category.trend.isPositive ? (
                    <ArrowUp size={12} color="#4CAF50" />
                  ) : (
                    <ArrowDown size={12} color="#F44336" />
                  )}
                  <Text 
                    style={[
                      styles.trendValue, 
                      category.trend.isPositive ? styles.positiveTrend : styles.negativeTrend
                    ]}
                  >
                    {category.trend.value}%
                  </Text>
                </View>
              </View>
              <Text style={styles.savingsValue}>${category.potentialSavings.toLocaleString()}</Text>
            </View>
            
            <View style={styles.utilizationBar}>
              <View style={styles.utilizationHeader}>
                <Text style={styles.utilizationLabel}>Utilization Rate</Text>
                <Text style={styles.utilizationValue}>{category.utilization}%</Text>
              </View>
              <ProgressBar 
                progress={category.utilization} 
                color={category.utilization < 60 ? "#FF9800" : "#4682B4"} 
              />
            </View>
            
            {category.utilization < 60 && (
              <View style={styles.recommendationContainer}>
                <AlertTriangle size={14} color="#FF9800" style={styles.alertIcon} />
                <Text style={styles.recommendationText}>
                  Low utilization. Consider targeted communications to increase awareness.
                </Text>
              </View>
            )}
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Department Performance</Text>
        
        {sortedDepartments.map((dept, index) => (
          <TouchableOpacity key={dept.id} style={styles.departmentCard}>
            <View style={styles.departmentHeader}>
              <View style={styles.rankingContainer}>
                <Text style={styles.rankingText}>{index + 1}</Text>
              </View>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{dept.name}</Text>
                <Text style={styles.departmentEmployees}>{dept.employeeCount} employees</Text>
              </View>
              <View style={styles.departmentMetrics}>
                <Text style={styles.departmentUtilization}>{dept.utilization}%</Text>
                <Text style={styles.utilizationLabel}>Utilization</Text>
              </View>
            </View>
            
            <View style={styles.departmentDetails}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailTitle}>Top Categories</Text>
                {getTopCategories(dept).map(category => (
                  <View key={category.key} style={styles.detailItem}>
                    <Text style={styles.detailCategory}>{formatCategoryName(category.key)}</Text>
                    <Text style={styles.detailValue}>{category.value}%</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.detailDivider} />
              
              <View style={styles.detailColumn}>
                <Text style={styles.detailTitle}>Needs Improvement</Text>
                {getBottomCategories(dept).map(category => (
                  <View key={category.key} style={styles.detailItem}>
                    <Text style={styles.detailCategory}>{formatCategoryName(category.key)}</Text>
                    <Text style={[styles.detailValue, category.value < 60 && styles.lowValue]}>
                      {category.value}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={16} color="#6A5ACD" style={styles.actionIcon} />
            <Text style={styles.actionText}>Export Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={16} color="#6A5ACD" style={styles.actionIcon} />
            <Text style={styles.actionText}>Share Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={16} color="#6A5ACD" style={styles.actionIcon} />
            <Text style={styles.actionText}>Schedule Report</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Info size={20} color="#6A5ACD" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How to Use This Dashboard</Text>
            <Text style={styles.infoText}>
              The Benefits Optimization dashboard helps you identify areas where your organization can increase benefits utilization and maximize health outcomes while reducing overall healthcare costs.
            </Text>
            <Text style={styles.infoText}>
              Focus on departments with low utilization rates and consider targeted communication campaigns to raise awareness about available benefits.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <EmployerFooter />
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
    backgroundColor: '#E6E0F8',
  },
  timeframeText: {
    fontSize: 12,
    color: '#666',
  },
  activeTimeframeText: {
    color: '#6A5ACD',
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
  summaryMetrics: {
    alignItems: 'center',
    marginBottom: 16,
  },
  unrealizedValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6A5ACD',
    marginBottom: 4,
  },
  unrealizedDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  utilizationContainer: {
    marginBottom: 8,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  utilizationLabel: {
    fontSize: 12,
    color: '#666',
  },
  utilizationValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  utilizationValue: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  utilizationTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendValue: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4CAF50',
    marginLeft: 2,
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
  targetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '500',
  },
  perEmployeeValue: {
    fontSize: 10,
    color: '#6A5ACD',
    fontWeight: '500',
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A5ACD',
  },
  utilizationBar: {
    marginBottom: 8,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 8,
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 12,
    color: '#FF9800',
    flex: 1,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  rankingContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E6E0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A5ACD',
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  departmentEmployees: {
    fontSize: 12,
    color: '#666',
  },
  departmentMetrics: {
    alignItems: 'flex-end',
  },
  departmentUtilization: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4682B4',
  },
  departmentDetails: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
  },
  detailColumn: {
    flex: 1,
  },
  detailDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailCategory: {
    fontSize: 12,
    color: '#333',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  lowValue: {
    color: '#F44336',
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
    borderColor: '#E6E0F8',
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
    color: '#6A5ACD',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#F0EDFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D8CFFF',
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
    color: '#6A5ACD',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6A5ACD',
    lineHeight: 18,
    marginBottom: 4,
  },
});