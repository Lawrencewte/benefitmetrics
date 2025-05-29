import EmployerFooter from '@/src/components/Common/layout/EmployerFooter';
import { Edit, Filter, MapPin, Phone, Plus, Search, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';


interface Provider {
  id: string;
  name: string;
  specialty: string;
  type: 'primary_care' | 'specialist' | 'urgent_care' | 'hospital' | 'mental_health';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  rating: number;
  reviewCount: number;
  distance: string;
  acceptingNewPatients: boolean;
  insurancePlans: string[];
  languages: string[];
  employeeUsage: {
    totalAppointments: number;
    uniqueEmployees: number;
    averageRating: number;
    lastUsed: string;
  };
  specialties: string[];
  availability: {
    nextAvailable: string;
    averageWaitTime: string;
  };
  networkStatus: 'in_network' | 'out_of_network' | 'preferred';
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'Dr. Sarah Martinez',
      specialty: 'Family Medicine',
      type: 'primary_care',
      address: {
        street: '123 Medical Plaza Dr',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      },
      phone: '(512) 555-0123',
      rating: 4.8,
      reviewCount: 156,
      distance: '2.3 miles',
      acceptingNewPatients: true,
      insurancePlans: ['Premium Health Plus', 'Essential Medical'],
      languages: ['English', 'Spanish'],
      employeeUsage: {
        totalAppointments: 89,
        uniqueEmployees: 67,
        averageRating: 4.7,
        lastUsed: '2025-05-20'
      },
      specialties: ['Preventative Care', 'Chronic Disease Management', 'Women\'s Health'],
      availability: {
        nextAvailable: 'May 28, 2025',
        averageWaitTime: '5 days'
      },
      networkStatus: 'preferred'
    },
    {
      id: '2',
      name: 'Austin Dermatology Associates',
      specialty: 'Dermatology',
      type: 'specialist',
      address: {
        street: '456 Specialist Blvd',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704'
      },
      phone: '(512) 555-0456',
      rating: 4.5,
      reviewCount: 203,
      distance: '4.1 miles',
      acceptingNewPatients: true,
      insurancePlans: ['Premium Health Plus'],
      languages: ['English'],
      employeeUsage: {
        totalAppointments: 34,
        uniqueEmployees: 32,
        averageRating: 4.4,
        lastUsed: '2025-05-19'
      },
      specialties: ['Skin Cancer Screening', 'Cosmetic Dermatology', 'Acne Treatment'],
      availability: {
        nextAvailable: 'June 15, 2025',
        averageWaitTime: '18 days'
      },
      networkStatus: 'in_network'
    },
    {
      id: '3',
      name: 'Central Texas Mental Health',
      specialty: 'Mental Health',
      type: 'mental_health',
      address: {
        street: '789 Wellness Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702'
      },
      phone: '(512) 555-0789',
      rating: 4.6,
      reviewCount: 87,
      distance: '3.7 miles',
      acceptingNewPatients: true,
      insurancePlans: ['Premium Health Plus', 'Mental Health Plus'],
      languages: ['English', 'Spanish', 'Vietnamese'],
      employeeUsage: {
        totalAppointments: 12,
        uniqueEmployees: 11,
        averageRating: 4.8,
        lastUsed: '2025-05-18'
      },
      specialties: ['Anxiety', 'Depression', 'Stress Management', 'Family Therapy'],
      availability: {
        nextAvailable: 'May 25, 2025',
        averageWaitTime: '3 days'
      },
      networkStatus: 'preferred'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getNetworkBadgeStyle = (status: string) => {
    switch (status) {
      case 'preferred':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', textColor: '#166534' };
      case 'in_network':
        return { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', textColor: '#1D4ED8' };
      case 'out_of_network':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA', textColor: '#DC2626' };
      default:
        return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', textColor: '#374151' };
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'primary_care':
        return { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', textColor: '#1D4ED8' };
      case 'specialist':
        return { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF', textColor: '#7C3AED' };
      case 'urgent_care':
        return { backgroundColor: '#FFF7ED', borderColor: '#FED7AA', textColor: '#EA580C' };
      case 'hospital':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA', textColor: '#DC2626' };
      case 'mental_health':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', textColor: '#166534' };
      default:
        return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', textColor: '#374151' };
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    const matchesNetwork = selectedNetwork === 'all' || provider.networkStatus === selectedNetwork;
    
    return matchesSearch && matchesType && matchesNetwork;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        color={i < Math.floor(rating) ? "#F59E0B" : "#D1D5DB"}
        fill={i < Math.floor(rating) ? "#F59E0B" : "none"}
      />
    ));
  };

  const formatTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatNetworkLabel = (network: string) => {
    return network.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const providerTypes = ['all', 'primary_care', 'specialist', 'urgent_care', 'hospital', 'mental_health'];
  const networkStatuses = ['all', 'preferred', 'in_network', 'out_of_network'];

  const totalProviders = providers.length;
  const preferredProviders = providers.filter(p => p.networkStatus === 'preferred').length;
  const avgRating = (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1);
  const totalUsage = providers.reduce((sum, p) => sum + p.employeeUsage.totalAppointments, 0);

  return (
    <><ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Provider Network</Text>
            <Text style={styles.subtitle}>
              Manage your healthcare provider directory
            </Text>
          </View>
          <Pressable style={styles.addButton}>
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Add Provider</Text>
          </Pressable>
        </View>

        {/* Network Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Providers</Text>
            <Text style={styles.summaryValue}>{totalProviders}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Preferred</Text>
            <Text style={[styles.summaryValue, { color: '#059669' }]}>{preferredProviders}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg Rating</Text>
            <Text style={[styles.summaryValue, { color: '#D97706' }]}>{avgRating}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Employee Usage</Text>
            <Text style={[styles.summaryValue, { color: '#2563EB' }]}>{totalUsage}</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <Search size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search providers, specialties, locations..."
              style={styles.searchInput} />
            <Pressable
              onPress={() => setShowFilters(!showFilters)}
              style={styles.filterButton}
            >
              <Filter size={20} color="#6B7280" />
            </Pressable>
          </View>

          {showFilters && (
            <View style={styles.filtersContainer}>
              {/* Provider Type Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Provider Type</Text>
                <View style={styles.filterTags}>
                  {providerTypes.map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => setSelectedType(type)}
                      style={[
                        styles.filterTag,
                        selectedType === type ? styles.filterTagActive : styles.filterTagInactive
                      ]}
                    >
                      <Text style={[
                        styles.filterTagText,
                        selectedType === type ? styles.filterTagTextActive : styles.filterTagTextInactive
                      ]}>
                        {type === 'all' ? 'All Types' : formatTypeLabel(type)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Network Status Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Network Status</Text>
                <View style={styles.filterTags}>
                  {networkStatuses.map((network) => (
                    <Pressable
                      key={network}
                      onPress={() => setSelectedNetwork(network)}
                      style={[
                        styles.filterTag,
                        selectedNetwork === network ? styles.filterTagActive : styles.filterTagInactive
                      ]}
                    >
                      <Text style={[
                        styles.filterTagText,
                        selectedNetwork === network ? styles.filterTagTextActive : styles.filterTagTextInactive
                      ]}>
                        {network === 'all' ? 'All Networks' : formatNetworkLabel(network)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Providers List */}
        <View style={styles.providersList}>
          {filteredProviders.map((provider) => {
            const networkStyle = getNetworkBadgeStyle(provider.networkStatus);
            const typeStyle = getTypeStyle(provider.type);

            return (
              <View key={provider.id} style={styles.providerCard}>
                {/* Provider Header */}
                <View style={styles.providerHeader}>
                  <View style={styles.providerInfo}>
                    <View style={styles.providerTitleRow}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <View style={[styles.badge, { backgroundColor: networkStyle.backgroundColor, borderColor: networkStyle.borderColor }]}>
                        <Text style={[styles.badgeText, { color: networkStyle.textColor }]}>
                          {provider.networkStatus.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                    <View style={[styles.badge, { backgroundColor: typeStyle.backgroundColor, borderColor: typeStyle.borderColor }]}>
                      <Text style={[styles.badgeText, { color: typeStyle.textColor }]}>
                        {formatTypeLabel(provider.type)}
                      </Text>
                    </View>
                  </View>

                  <Pressable style={styles.editButton}>
                    <Edit size={20} color="#6B7280" />
                  </Pressable>
                </View>

                {/* Contact & Location */}
                <View style={styles.contactSection}>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.contactText}>
                        {provider.address.street}, {provider.address.city}, {provider.address.state}
                      </Text>
                    </View>
                    <View style={styles.contactRow}>
                      <Phone size={16} color="#6B7280" />
                      <Text style={styles.contactText}>{provider.phone}</Text>
                    </View>
                  </View>
                  <Text style={styles.distanceText}>{provider.distance}</Text>
                </View>

                {/* Rating & Reviews */}
                <View style={styles.ratingSection}>
                  <View style={styles.ratingInfo}>
                    <View style={styles.starsContainer}>
                      {renderStars(provider.rating)}
                    </View>
                    <Text style={styles.ratingValue}>{provider.rating}</Text>
                    <Text style={styles.reviewCount}>({provider.reviewCount} reviews)</Text>
                  </View>

                  <View style={[
                    styles.statusBadge,
                    provider.acceptingNewPatients ? styles.acceptingBadge : styles.notAcceptingBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      provider.acceptingNewPatients ? styles.acceptingText : styles.notAcceptingText
                    ]}>
                      {provider.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting'}
                    </Text>
                  </View>
                </View>

                {/* Employee Usage */}
                <View style={styles.usageSection}>
                  <Text style={styles.usageTitle}>Employee Usage</Text>
                  <View style={styles.usageGrid}>
                    <View style={styles.usageItem}>
                      <Text style={styles.usageLabel}>Total Appointments</Text>
                      <Text style={styles.usageValue}>{provider.employeeUsage.totalAppointments}</Text>
                    </View>
                    <View style={styles.usageItem}>
                      <Text style={styles.usageLabel}>Unique Employees</Text>
                      <Text style={styles.usageValue}>{provider.employeeUsage.uniqueEmployees}</Text>
                    </View>
                    <View style={styles.usageItem}>
                      <Text style={styles.usageLabel}>Employee Rating</Text>
                      <Text style={styles.usageValue}>{provider.employeeUsage.averageRating}/5</Text>
                    </View>
                  </View>
                </View>

                {/* Specialties & Languages */}
                <View style={styles.detailsSection}>
                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Specialties</Text>
                    <View style={styles.tagContainer}>
                      {provider.specialties.map((specialty, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{specialty}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Languages</Text>
                    <View style={styles.tagContainer}>
                      {provider.languages.map((language, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{language}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Availability */}
                <View style={styles.availabilitySection}>
                  <View style={styles.availabilityInfo}>
                    <View>
                      <Text style={styles.availabilityLabel}>Next Available</Text>
                      <Text style={styles.availabilityValue}>{provider.availability.nextAvailable}</Text>
                    </View>
                    <View>
                      <Text style={styles.availabilityLabel}>Avg Wait Time</Text>
                      <Text style={styles.availabilityValue}>{provider.availability.averageWaitTime}</Text>
                    </View>
                  </View>
                  <Pressable style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Network Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Network Insights</Text>
          <View style={styles.insightsList}>
            <Text style={styles.insightItem}>
              • 89% of employees have access to a preferred primary care provider within 5 miles
            </Text>
            <Text style={styles.insightItem}>
              • Mental health provider availability has improved by 34% this quarter
            </Text>
            <Text style={styles.insightItem}>
              • Consider adding more dermatology specialists - current wait time is 18 days
            </Text>
          </View>
        </View>
      </View>
    </ScrollView><EmployerFooter /></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  filtersContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterTagActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTagInactive: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterTagTextActive: {
    color: 'white',
  },
  filterTagTextInactive: {
    color: '#374151',
  },
  providersList: {
    gap: 16,
  },
  providerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  providerSpecialty: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  editButton: {
    padding: 8,
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  acceptingBadge: {
    backgroundColor: '#F0FDF4',
  },
  notAcceptingBadge: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  acceptingText: {
    color: '#166534',
  },
  notAcceptingText: {
    color: '#DC2626',
  },
  usageSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  usageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageItem: {
    flex: 1,
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  detailsSection: {
    gap: 12,
    marginBottom: 16,
  },
  detailGroup: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
  },
  availabilitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  availabilityInfo: {
    flexDirection: 'row',
    gap: 24,
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  detailsButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  insightsContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 12,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    fontSize: 14,
    color: '#1D4ED8',
    lineHeight: 20,
  },
});