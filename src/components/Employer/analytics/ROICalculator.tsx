import { AlertCircle, Calculator, Download, PieChart, RefreshCw, Target, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ROIData {
  totalInvestment: number;
  totalReturns: number;
  roi: number;
  roiPercentage: number;
  paybackPeriod: number; // months
  netPresentValue: number;
  costCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  benefitCategories: {
    category: string;
    amount: number;
    percentage: number;
    confidence: 'high' | 'medium' | 'low';
  }[];
  timeframeBenefits: {
    month: string;
    cumulativeInvestment: number;
    cumulativeReturns: number;
    monthlyROI: number;
  }[];
  projections: {
    year1: number;
    year2: number;
    year3: number;
    year5: number;
  };
  benchmarks: {
    industryAverage: number;
    topQuartile: number;
    ourPerformance: number;
  };
  riskFactors: {
    factor: string;
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
}

interface ROICalculatorProps {
  data: ROIData;
  onRecalculate?: () => void;
  onExport?: (format: 'pdf' | 'xlsx') => void;
  onAdjustAssumptions?: () => void;
  onViewProjections?: () => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({
  data,
  onRecalculate,
  onExport,
  onAdjustAssumptions,
  onViewProjections
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'breakdown' | 'timeline' | 'projections'>('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 150) return '#10B981'; // Green
    if (roi >= 100) return '#3B82F6'; // Blue
    if (roi >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getRiskColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderOverview = () => (
    <View style={styles.section}>
      <View style={styles.roiSummary}>
        <View style={styles.roiMainMetric}>
          <Text style={[styles.roiValue, { color: getROIColor(data.roiPercentage) }]}>
            {formatPercentage(data.roiPercentage)}
          </Text>
          <Text style={styles.roiLabel}>Return on Investment</Text>
          <Text style={styles.roiSubtext}>
            {formatCurrency(data.totalReturns)} return on {formatCurrency(data.totalInvestment)} investment
          </Text>
        </View>

        <View style={styles.roiSecondaryMetrics}>
          <View style={styles.secondaryMetric}>
            <Text style={styles.secondaryMetricValue}>{data.paybackPeriod}</Text>
            <Text style={styles.secondaryMetricLabel}>Months to Payback</Text>
          </View>
          <View style={styles.secondaryMetric}>
            <Text style={styles.secondaryMetricValue}>{formatCurrency(data.netPresentValue)}</Text>
            <Text style={styles.secondaryMetricLabel}>Net Present Value</Text>
          </View>
        </View>
      </View>

      <View style={styles.benchmarkComparison}>
        <Text style={styles.sectionTitle}>Industry Comparison</Text>
        <View style={styles.benchmarkBars}>
          <View style={styles.benchmarkItem}>
            <Text style={styles.benchmarkLabel}>Our Performance</Text>
            <View style={styles.benchmarkBar}>
              <View style={[
                styles.benchmarkFill,
                { 
                  width: `${Math.min((data.benchmarks.ourPerformance / data.benchmarks.topQuartile) * 100, 100)}%`,
                  backgroundColor: getROIColor(data.benchmarks.ourPerformance)
                }
              ]} />
            </View>
            <Text style={styles.benchmarkValue}>{formatPercentage(data.benchmarks.ourPerformance)}</Text>
          </View>

          <View style={styles.benchmarkItem}>
            <Text style={styles.benchmarkLabel}>Industry Average</Text>
            <View style={styles.benchmarkBar}>
              <View style={[
                styles.benchmarkFill,
                { 
                  width: `${(data.benchmarks.industryAverage / data.benchmarks.topQuartile) * 100}%`,
                  backgroundColor: '#6B7280'
                }
              ]} />
            </View>
            <Text style={styles.benchmarkValue}>{formatPercentage(data.benchmarks.industryAverage)}</Text>
          </View>

          <View style={styles.benchmarkItem}>
            <Text style={styles.benchmarkLabel}>Top Quartile</Text>
            <View style={styles.benchmarkBar}>
              <View style={[
                styles.benchmarkFill,
                { 
                  width: '100%',
                  backgroundColor: '#10B981'
                }
              ]} />
            </View>
            <Text style={styles.benchmarkValue}>{formatPercentage(data.benchmarks.topQuartile)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>ROI Calculator</Text>
          <Text style={styles.subtitle}>Wellness program return analysis</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onRecalculate}>
            <RefreshCw size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onExport?.('xlsx')}>
            <Download size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Selector */}
      <View style={styles.viewSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.viewButtons}>
            {[
              { key: 'overview', label: 'Overview', icon: Calculator },
              { key: 'breakdown', label: 'Breakdown', icon: PieChart },
              { key: 'timeline', label: 'Timeline', icon: TrendingUp },
              { key: 'projections', label: 'Projections', icon: Target }
            ].map((view) => {
              const IconComponent = view.icon;
              return (
                <TouchableOpacity
                  key={view.key}
                  style={[
                    styles.viewButton,
                    selectedView === view.key && styles.viewButtonActive
                  ]}
                  onPress={() => setSelectedView(view.key as any)}
                >
                  <IconComponent 
                    size={16} 
                    color={selectedView === view.key ? '#FFFFFF' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.viewButtonText,
                    selectedView === view.key && styles.viewButtonTextActive
                  ]}>
                    {view.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'overview' && renderOverview()}
        
        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryAction} onPress={onAdjustAssumptions}>
            <Calculator size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Adjust Assumptions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryAction} onPress={onViewProjections}>
            <Target size={20} color="#3B82F6" />
            <Text style={styles.secondaryActionText}>View Detailed Projections</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <AlertCircle size={16} color="#F59E0B" />
          <Text style={styles.disclaimerText}>
            ROI calculations are based on industry averages and company-specific data. 
            Actual results may vary. Consult with financial advisors for investment decisions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  viewSelector: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  viewButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  viewButtonActive: {
    backgroundColor: '#3B82F6',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  roiSummary: {
    alignItems: 'center',
    marginBottom: 24,
  },
  roiMainMetric: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roiValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  roiLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  roiSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  roiSecondaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  secondaryMetric: {
    alignItems: 'center',
  },
  secondaryMetricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  secondaryMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  benchmarkComparison: {
    marginTop: 24,
  },
  benchmarkBars: {
    gap: 12,
  },
  benchmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benchmarkLabel: {
    fontSize: 14,
    color: '#374151',
    width: 120,
  },
  benchmarkBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  benchmarkFill: {
    height: '100%',
    borderRadius: 4,
  },
  benchmarkValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 60,
    textAlign: 'right',
  },
  actionSection: {
    padding: 16,
    gap: 12,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
});