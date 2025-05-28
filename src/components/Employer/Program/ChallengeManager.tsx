import { Calendar, Edit, Filter, Pause, Play, Plus, Search, Target, Trash2, Trophy, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'company-wide';
  category: 'fitness' | 'nutrition' | 'mental-health' | 'preventive-care' | 'education';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  participants: {
    enrolled: number;
    active: number;
    completed: number;
  };
  rewards: {
    points: number;
    prizes: string[];
  };
  rules: {
    frequency: 'daily' | 'weekly' | 'one-time';
    target: number;
    unit: string;
  };
  progress: number;
  engagement: number;
  createdBy: string;
  lastModified: string;
}

interface ChallengeManagerProps {
  challenges: Challenge[];
  onCreateChallenge?: () => void;
  onEditChallenge?: (challenge: Challenge) => void;
  onDeleteChallenge?: (challengeId: string) => void;
  onToggleStatus?: (challengeId: string, status: string) => void;
  onViewDetails?: (challengeId: string) => void;
}

export const ChallengeManager: React.FC<ChallengeManagerProps> = ({
  challenges,
  onCreateChallenge,
  onEditChallenge,
  onDeleteChallenge,
  onToggleStatus,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fitness' | 'nutrition' | 'mental-health' | 'preventive-care' | 'education'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'participants' | 'engagement' | 'date'>('date');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'draft':
        return '#6B7280';
      case 'paused':
        return '#F59E0B';
      case 'completed':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness':
        return '#10B981';
      case 'nutrition':
        return '#F59E0B';
      case 'mental-health':
        return '#8B5CF6';
      case 'preventive-care':
        return '#3B82F6';
      case 'education':
        return '#EC4899';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return '👤';
      case 'team':
        return '👥';
      case 'company-wide':
        return '🏢';
      default:
        return '📋';
    }
  };

  const filteredChallenges = challenges
    .filter(challenge => {
      const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || challenge.status === selectedFilter;
      const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
      return matchesSearch && matchesFilter && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'participants':
          return b.participants.enrolled - a.participants.enrolled;
        case 'engagement':
          return b.engagement - a.engagement;
        case 'date':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        default:
          return 0;
      }
    });

  const renderChallengeCard = (challenge: Challenge) => (
    <TouchableOpacity
      key={challenge.id}
      style={styles.challengeCard}
      onPress={() => onViewDetails?.(challenge.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.challengeInfo}>
          <View style={styles.challengeTitleRow}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.typeIcon}>{getTypeIcon(challenge.type)}</Text>
          </View>
          <Text style={styles.challengeDescription} numberOfLines={2}>
            {challenge.description}
          </Text>
        </View>
        
        <View style={styles.cardActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(challenge.status) }]}>
            <Text style={styles.statusText}>{challenge.status.toUpperCase()}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEditChallenge?.(challenge)}
          >
            <Edit size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <View style={styles.categoryTag}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(challenge.category) }]} />
            <Text style={styles.categoryText}>{challenge.category.replace('-', ' ')}</Text>
          </View>
          
          <View style={styles.dateRange}>
            <Calendar size={12} color="#6B7280" />
            <Text style={styles.dateText}>
              {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Users size={14} color="#6B7280" />
            <Text style={styles.metricValue}>{challenge.participants.enrolled}</Text>
            <Text style={styles.metricLabel}>Enrolled</Text>
          </View>
          
          <View style={styles.metric}>
            <Target size={14} color="#6B7280" />
            <Text style={styles.metricValue}>{challenge.progress.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Progress</Text>
          </View>
          
          <View style={styles.metric}>
            <Trophy size={14} color="#6B7280" />
            <Text style={styles.metricValue}>{challenge.rewards.points}</Text>
            <Text style={styles.metricLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { 
                width: `${challenge.progress}%`,
                backgroundColor: getStatusColor(challenge.status)
              }
            ]} />
          </View>
          <Text style={styles.progressText}>{challenge.progress.toFixed(1)}% Complete</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.engagementScore}>
            <Text style={styles.engagementLabel}>Engagement:</Text>
            <Text style={[
              styles.engagementValue,
              { color: challenge.engagement >= 70 ? '#10B981' : challenge.engagement >= 40 ? '#F59E0B' : '#EF4444' }
            ]}>
              {challenge.engagement.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.quickActions}>
            {challenge.status === 'active' && (
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: '#FEF2F2' }]}
                onPress={() => onToggleStatus?.(challenge.id, 'paused')}
              >
                <Pause size={14} color="#EF4444" />
                <Text style={[styles.quickActionText, { color: '#EF4444' }]}>Pause</Text>
              </TouchableOpacity>
            )}
            
            {(challenge.status === 'draft' || challenge.status === 'paused') && (
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: '#F0FDF4' }]}
                onPress={() => onToggleStatus?.(challenge.id, 'active')}
              >
                <Play size={14} color="#10B981" />
                <Text style={[styles.quickActionText, { color: '#10B981' }]}>Start</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: '#FEF2F2' }]}
              onPress={() => onDeleteChallenge?.(challenge.id)}
            >
              <Trash2 size={14} color="#EF4444" />
              <Text style={[styles.quickActionText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Challenge Manager</Text>
          <Text style={styles.subtitle}>Create and manage wellness challenges</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={onCreateChallenge}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>New Challenge</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search challenges..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {['all', 'active', 'draft', 'completed'].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterOption,
                      selectedFilter === filter && styles.filterOptionActive
                    ]}
                    onPress={() => setSelectedFilter(filter as any)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedFilter === filter && styles.filterOptionTextActive
                    ]}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {['all', 'fitness', 'nutrition', 'mental-health', 'preventive-care', 'education'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      selectedCategory === category && styles.filterOptionActive
                    ]}
                    onPress={() => setSelectedCategory(category as any)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedCategory === category && styles.filterOptionTextActive
                    ]}>
                      {category.replace('-', ' ').charAt(0).toUpperCase() + category.replace('-', ' ').slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.sortSection}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'date', label: 'Date' },
                { key: 'name', label: 'Name' },
                { key: 'participants', label: 'Participants' },
                { key: 'engagement', label: 'Engagement' }
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.key}
                  style={[
                    styles.sortOption,
                    sortBy === sort.key && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(sort.key as any)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === sort.key && styles.sortOptionTextActive
                  ]}>
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Summary Stats */}
      <View style={styles.summaryStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{challenges.filter(c => c.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{challenges.filter(c => c.status === 'draft').length}</Text>
          <Text style={styles.statLabel}>Draft</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {challenges.reduce((sum, c) => sum + c.participants.enrolled, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Participants</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {(challenges.reduce((sum, c) => sum + c.engagement, 0) / challenges.length || 0).toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Avg Engagement</Text>
        </View>
      </View>

      {/* Challenges List */}
      <ScrollView style={styles.challengesList} showsVerticalScrollIndicator={false}>
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map(renderChallengeCard)
        ) : (
          <View style={styles.emptyState}>
            <Trophy size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No challenges found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedFilter !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search criteria'
                : 'Create your first challenge to get started'
              }
            </Text>
            {!searchQuery && selectedFilter === 'all' && selectedCategory === 'all' && (
              <TouchableOpacity style={styles.emptyStateButton} onPress={onCreateChallenge}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>Create Challenge</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterOptionActive: {
    backgroundColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  sortSection: {
    marginBottom: 0,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sortOptionActive: {
    backgroundColor: '#10B981',
  },
  sortOptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  challengesList: {
    flex: 1,
    padding: 16,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  typeIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  cardActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  cardDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  progressContainer: {
    gap: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  engagementValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});