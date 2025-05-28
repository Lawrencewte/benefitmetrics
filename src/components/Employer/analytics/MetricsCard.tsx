import { AlertTriangle, CheckCircle, Minus, MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MetricData {
  id: string;
  title: string;
  value: string | number;
  previousValue?: string | number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  unit?: string;
  target?: number;
  benchmark?: number;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  subtitle?: string;
  lastUpdated?: string;
}

interface MetricsCardProps {
  metric: MetricData;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'detailed';
  showTarget?: boolean;
  showBenchmark?: boolean;
  showTrend?: boolean;
  onPress?: (metricId: string) => void;
  onMenuPress?: (metricId: string) => void;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  metric,
  size = 'medium',
  variant = 'default',
  showTarget = true,
  showBenchmark = true,
  showTrend = true,
  onPress,
  onMenuPress
}) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'critical':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return CheckCircle;
      case 'warning':
      case 'critical':
        return AlertTriangle;
      default:
        return null;
    }
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (metric.unit === '%') {
        return `${value.toFixed(1)}%`;
      }
      if (metric.unit === '$') {
        return `$${value.toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    if (size === 'small') baseStyle.push(styles.cardSmall);
    if (size === 'large') baseStyle.push(styles.cardLarge);
    
    if (variant === 'compact') baseStyle.push(styles.cardCompact);
    if (variant === 'detailed') baseStyle.push(styles.cardDetailed);
    
    return baseStyle;
  };

  const TrendIcon = getTrendIcon(metric.trend);
  const StatusIcon = getStatusIcon(metric.status || 'neutral');

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={() => onPress?.(metric.id)}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactTitle}>{metric.title}</Text>
            {StatusIcon && (
              <StatusIcon size={14} color={getStatusColor(metric.status || 'neutral')} />
            )}
          </View>
          
          <View style={styles.compactMetrics}>
            <Text style={[styles.compactValue, size === 'small' && styles.compactValueSmall]}>
              {formatValue(metric.value)}
            </Text>
            
            {showTrend && metric.trendPercentage !== undefined && (
              <View style={styles.compactTrend}>
                <TrendIcon size={12} color={getTrendColor(metric.trend)} />
                <Text style={[styles.compactTrendText, { color: getTrendColor(metric.trend) }]}>
                  {metric.trendPercentage > 0 ? '+' : ''}{metric.trendPercentage.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={() => onPress?.(metric.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, size === 'small' && styles.titleSmall]}>
            {metric.title}
          </Text>
          {metric.subtitle && (
            <Text style={styles.subtitle}>{metric.subtitle}</Text>
          )}
        </View>
        
        <View style={styles.headerActions}>
          {StatusIcon && (
            <StatusIcon size={20} color={getStatusColor(metric.status || 'neutral')} />
          )}
          {onMenuPress && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => onMenuPress(metric.id)}
            >
              <MoreHorizontal size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.primaryMetric}>
          <Text style={[
            styles.value,
            size === 'small' && styles.valueSmall,
            size === 'large' && styles.valueLarge
          ]}>
            {formatValue(metric.value)}
          </Text>
          
          {showTrend && metric.trendPercentage !== undefined && (
            <View style={styles.trendContainer}>
              <TrendIcon size={16} color={getTrendColor(metric.trend)} />
              <Text style={[styles.trendText, { color: getTrendColor(metric.trend) }]}>
                {metric.trendPercentage > 0 ? '+' : ''}{metric.trendPercentage.toFixed(1)}%
              </Text>
              {metric.previousValue && (
                <Text style={styles.previousValue}>
                  vs {formatValue(metric.previousValue)}
                </Text>
              )}
            </View>
          )}
        </View>

        {(showTarget || showBenchmark) && (metric.target || metric.benchmark) && (
          <View style={styles.references}>
            {showTarget && metric.target && (
              <View style={styles.referenceItem}>
                <Text style={styles.referenceLabel}>Target:</Text>
                <Text style={styles.referenceValue}>{formatValue(metric.target)}</Text>
                <View style={styles.referenceIndicator}>
                  <View style={[
                    styles.referenceBar,
                    {
                      width: `${Math.min((Number(metric.value) / metric.target) * 100, 100)}%`,
                      backgroundColor: Number(metric.value) >= metric.target ? '#10B981' : '#F59E0B'
                    }
                  ]} />
                </View>
              </View>
            )}
            
            {showBenchmark && metric.benchmark && (
              <View style={styles.referenceItem}>
                <Text style={styles.referenceLabel}>Benchmark:</Text>
                <Text style={styles.referenceValue}>{formatValue(metric.benchmark)}</Text>
                <View style={styles.referenceIndicator}>
                  <View style={[
                    styles.referenceBar,
                    {
                      width: `${Math.min((Number(metric.value) / metric.benchmark) * 100, 100)}%`,
                      backgroundColor: Number(metric.value) >= metric.benchmark ? '#10B981' : '#EF4444'
                    }
                  ]} />
                </View>
              </View>
            )}
          </View>
        )}

        {variant === 'detailed' && (
          <View style={styles.detailedInfo}>
            {metric.lastUpdated && (
              <Text style={styles.lastUpdated}>
                Last updated: {metric.lastUpdated}
              </Text>
            )}
            
            <View style={styles.performanceIndicators}>
              {metric.target && (
                <View style={styles.performanceIndicator}>
                  <Text style={styles.performanceLabel}>vs Target</Text>
                  <Text style={[
                    styles.performanceValue,
                    { color: Number(metric.value) >= metric.target ? '#10B981' : '#F59E0B' }
                  ]}>
                    {Number(metric.value) >= metric.target ? 'Met' : 'Below'}
                  </Text>
                </View>
              )}
              
              {metric.benchmark && (
                <View style={styles.performanceIndicator}>
                  <Text style={styles.performanceLabel}>vs Benchmark</Text>
                  <Text style={[
                    styles.performanceValue,
                    { color: Number(metric.value) >= metric.benchmark ? '#10B981' : '#EF4444' }
                  ]}>
                    {((Number(metric.value) / metric.benchmark - 1) * 100).toFixed(1)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
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
  cardSmall: {
    padding: 12,
  },
  cardLarge: {
    padding: 20,
  },
  cardCompact: {
    padding: 12,
  },
  cardDetailed: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  titleSmall: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  primaryMetric: {
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  valueSmall: {
    fontSize: 20,
  },
  valueLarge: {
    fontSize: 36,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  previousValue: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  references: {
    gap: 8,
    marginBottom: 12,
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 60,
  },
  referenceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    width: 60,
  },
  referenceIndicator: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  referenceBar: {
    height: '100%',
    borderRadius: 2,
  },
  detailedInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  lastUpdated: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  performanceIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceIndicator: {
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  compactContent: {
    flexDirection: 'column',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  compactMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  compactValueSmall: {
    fontSize: 16,
  },
  compactTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  compactTrendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});