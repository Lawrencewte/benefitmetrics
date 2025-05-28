import { format } from 'date-fns';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Clock, Database, Filter, User } from 'lucide-react';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../ui/Button';
import Card from '../ui/Card';

export interface AccessLogEntry {
  id: string;
  timestamp: Date;
  action: 'view' | 'edit' | 'delete' | 'export' | 'share';
  dataType: string;
  actor: {
    name: string;
    role: string;
    organization?: string;
  };
  status: 'success' | 'failed' | 'denied';
  details?: string;
}

interface FilterOptions {
  dateRange: 'today' | 'week' | 'month' | 'all';
  action?: 'view' | 'edit' | 'delete' | 'export' | 'share';
  status?: 'success' | 'failed' | 'denied';
}

interface DataAccessHistoryProps {
  accessLogs: AccessLogEntry[];
  onFilterChange?: (filters: FilterOptions) => void;
  onEntryPress?: (entry: AccessLogEntry) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const DataAccessHistory: React.FC<DataAccessHistoryProps> = ({
  accessLogs,
  onFilterChange,
  onEntryPress,
  loading = false,
  emptyMessage = 'No access history found for the selected filters.',
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'month',
  });
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view':
        return <Eye width={18} height={18} color="#6B7280" />;
      case 'edit':
        return <Edit width={18} height={18} color="#6B7280" />;
      case 'delete':
        return <Trash width={18} height={18} color="#6B7280" />;
      case 'export':
        return <Download width={18} height={18} color="#6B7280" />;
      case 'share':
        return <Share width={18} height={18} color="#6B7280" />;
      default:
        return <Database width={18} height={18} color="#6B7280" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle width={18} height={18} color="#10B981" />;
      case 'failed':
        return <AlertCircle width={18} height={18} color="#F59E0B" />;
      case 'denied':
        return <AlertCircle width={18} height={18} color="#EF4444" />;
      default:
        return <Clock width={18} height={18} color="#6B7280" />;
    }
  };

  const getActionText = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDateRangeText = (range: string) => {
    switch (range) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Time';
      default:
        return 'This Month';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10B981'; // green-500
      case 'failed':
        return '#F59E0B'; // amber-500
      case 'denied':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const renderListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  const renderListItem = ({ item }: { item: AccessLogEntry }) => (
    <TouchableOpacity
      onPress={() => onEntryPress && onEntryPress(item)}
      disabled={!onEntryPress}
    >
      <Card style={styles.logCard}>
        <View style={styles.logHeader}>
          <View style={styles.actorContainer}>
            <View style={styles.iconContainer}>
              <User width={18} height={18} color="#6B7280" />
            </View>
            <View>
              <Text style={styles.actorName}>{item.actor.name}</Text>
              <Text style={styles.actorRole}>{item.actor.role}</Text>
            </View>
          </View>
          <Text style={styles.timestamp}>
            {format(item.timestamp, 'MMM d, yyyy h:mm a')}
          </Text>
        </View>
        
        <View style={styles.logDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                {getActionIcon(item.action)}
              </View>
              <Text style={styles.detailText}>{getActionText(item.action)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Database width={18} height={18} color="#6B7280" />
              </View>
              <Text style={styles.detailText}>{item.dataType}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                {getStatusIcon(item.status)}
              </View>
              <Text
                style={[
                  styles.detailText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          
          {item.details && (
            <Text style={styles.detailsText}>{item.details}</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <Filter width={20} height={20} color="#6B7280" />
          <Text style={styles.filterButtonText}>Filter</Text>
          {showFilters ? (
            <ChevronUp width={20} height={20} color="#6B7280" />
          ) : (
            <ChevronDown width={20} height={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <Card style={styles.filtersCard}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Date Range</Text>
            <View style={styles.filterOptions}>
              {(['today', 'week', 'month', 'all'] as const).map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.filterOption,
                    filters.dateRange === range && styles.filterOptionSelected,
                  ]}
                  onPress={() => updateFilter('dateRange', range)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.dateRange === range && styles.filterOptionTextSelected,
                    ]}
                  >
                    {getDateRangeText(range)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Action Type</Text>
            <View style={styles.filterOptions}>
              {(['view', 'edit', 'delete', 'export', 'share'] as const).map((action) => (
                <TouchableOpacity
                  key={action}
                  style={[
                    styles.filterOption,
                    filters.action === action && styles.filterOptionSelected,
                  ]}
                  onPress={() => 
                    updateFilter('action', filters.action === action ? undefined : action)
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.action === action && styles.filterOptionTextSelected,
                    ]}
                  >
                    {getActionText(action)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {(['success', 'failed', 'denied'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    filters.status === status && styles.filterOptionSelected,
                  ]}
                  onPress={() => 
                    updateFilter('status', filters.status === status ? undefined : status)
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.status === status && styles.filterOptionTextSelected,
                    ]}
                  >
                    {getStatusText(status)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Button
            title="Clear Filters"
            variant="outline"
            size="small"
            onPress={() => {
              const newFilters = { dateRange: 'month' };
              setFilters(newFilters);
              if (onFilterChange) {
                onFilterChange(newFilters);
              }
            }}
            style={styles.clearButton}
          />
        </Card>
      )}
      
      <FlatList
        data={accessLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  filterButtonText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  filtersCard: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#BFDBFE',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#4B5563',
  },
  filterOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '500',
  },
  clearButton: {
    alignSelf: 'flex-end',
  },
  listContainer: {
    paddingBottom: 20,
  },
  logCard: {
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  actorRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  logDetails: {},
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#374151',
  },
  detailsText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default DataAccessHistory;