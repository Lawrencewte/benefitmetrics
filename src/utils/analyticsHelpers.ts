import { anonymization } from './anonymization';

interface DataPoint {
  value: number;
  date: string;
  [key: string]: any;
}

interface AggregateResult {
  min: number;
  max: number;
  avg: number;
  median: number;
  sum: number;
  count: number;
}

export const analyticsHelpers = {
  /**
   * Aggregates numerical data for analytics
   */
  aggregateData(data: DataPoint[], valueKey = 'value'): AggregateResult {
    if (!data || data.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        sum: 0,
        count: 0,
      };
    }
    
    // Extract the values
    const values = data.map(item => item[valueKey] as number).filter(value => !isNaN(value));
    
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        sum: 0,
        count: 0,
      };
    }
    
    // Sort values for median calculation
    values.sort((a, b) => a - b);
    
    // Calculate metrics
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((total, value) => total + value, 0);
    const avg = sum / values.length;
    
    // Calculate median
    const middle = Math.floor(values.length / 2);
    const median = values.length % 2 === 0
      ? (values[middle - 1] + values[middle]) / 2
      : values[middle];
    
    return {
      min,
      max,
      avg,
      median,
      sum,
      count: values.length,
    };
  },
  
  /**
   * Groups data by a specific field
   */
  groupByField<T>(data: T[], field: keyof T): Record<string, T[]> {
    return data.reduce((groups, item) => {
      const key = String(item[field]);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
  
  /**
   * Calculates growth rate between periods
   */
  calculateGrowthRate(currentValue: number, previousValue: number): number {
    if (previousValue === 0) return currentValue > 0 ? 100 : 0;
    return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  },
  
  /**
   * Filters data by date range
   */
  filterByDateRange<T>(
    data: T[],
    startDate: string | Date,
    endDate: string | Date,
    dateField = 'date'
  ): T[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return data.filter(item => {
      const itemDate = new Date((item as any)[dateField]).getTime();
      return itemDate >= start && itemDate <= end;
    });
  },
  
  /**
   * Anonymizes data for analytics while preserving statistical utility
   */
  prepareAnonymizedAnalytics<T>(
    data: T[],
    identifierFields: string[],
    sensitiveFields: string[]
  ): T[] {
    // Create a copy of the data to avoid modifying the original
    const anonymizedData = [...data];
    
    // Apply anonymization to each item
    return anonymizedData.map(item => {
      // Remove direct identifiers
      const anonymizedItem = { ...item };
      
      for (const field of identifierFields) {
        if (field in anonymizedItem) {
          delete (anonymizedItem as any)[field];
        }
      }
      
      // Apply differential privacy to sensitive fields
      for (const field of sensitiveFields) {
        if (field in anonymizedItem && typeof (anonymizedItem as any)[field] === 'number') {
          // Add controlled noise to numeric fields (epsilon = privacy parameter)
          (anonymizedItem as any)[field] = anonymization.addNoise(
            (anonymizedItem as any)[field],
            0.1 // epsilon value - lower means more privacy
          );
        }
      }
      
      return anonymizedItem;
    });
  },
  
  /**
   * Formats a number for display in reports
   */
  formatNumber(
    value: number,
    options: {
      decimals?: number;
      prefix?: string;
      suffix?: string;
      useGrouping?: boolean;
    } = {}
  ): string {
    const {
      decimals = 2,
      prefix = '',
      suffix = '',
      useGrouping = true,
    } = options;
    
    return `${prefix}${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    })}${suffix}`;
  },
  
  /**
   * Creates a frequency distribution for categorical data
   */
  createFrequencyDistribution<T>(
    data: T[],
    field: keyof T
  ): Record<string, number> {
    return data.reduce((freq, item) => {
      const value = String(item[field]);
      freq[value] = (freq[value] || 0) + 1;
      return freq;
    }, {} as Record<string, number>);
  },
  
  /**
   * Creates a histogram for numerical data
   */
  createHistogram(
    data: number[],
    bins = 10
  ): { bin: [number, number]; count: number }[] {
    if (data.length === 0) return [];
    
    // Find min and max values
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    // Calculate bin width
    const binWidth = (max - min) / bins;
    
    // Initialize bins
    const histogram = Array(bins).fill(0).map((_, i) => ({
      bin: [min + i * binWidth, min + (i + 1) * binWidth],
      count: 0,
    }));
    
    // Count values in each bin
    data.forEach(value => {
      // Handle edge case for max value
      if (value === max) {
        histogram[bins - 1].count++;
        return;
      }
      
      const binIndex = Math.floor((value - min) / binWidth);
      histogram[binIndex].count++;
    });
    
    return histogram;
  },
};