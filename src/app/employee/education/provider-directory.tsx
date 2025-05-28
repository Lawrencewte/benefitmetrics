import { CheckCircle, ChevronDown, ChevronRight, Filter, Globe, Heart, Mail, MapPin, Phone, Search, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';

type Provider = {
  id: string;
  name: string;
  specialty: string;
  type: 'PCP' | 'Specialist' | 'Dental' | 'Vision' | 'Mental Health';
  address: string;
  distance: string;
  phone: string;
  rating: number;
  acceptingNewPatients: boolean;
  languages: string[];
  inNetwork: boolean;
  preventativeCare: boolean;
  website?: string;
  email?: string;
};

type SpecialtyFilter = {
  id: string;
  name: string;
};

export default function ProviderDirectoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    inNetworkOnly: true,
    acceptingNewPatients: false,
    preventativeCare: true,
    radius: 10 // miles
  });

  // Sample data - in a real app, this would come from an API or context
  const specialties: SpecialtyFilter[] = [
    { id: 'all', name: 'All Providers' },
    { id: 'PCP', name: 'Primary Care' },
    { id: 'Dental', name: 'Dental' },
    { id: 'Vision', name: 'Vision' },
    { id: 'Specialist', name: 'Specialists' },
    { id: 'Mental Health', name: 'Mental Health' }
  ];

  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Martinez',
      specialty: 'Family Medicine',
      type: 'PCP',
      address: '123 Medical Way, Austin, TX 78701',
      distance: '1.2 mi',
      phone: '(512) 555-1234',
      rating: 4.8,
      acceptingNewPatients: true,
      languages: ['English', 'Spanish'],
      inNetwork: true,
      preventativeCare: true,
      website: 'https://drmartinez.example.com',
      email: 'martinez@medical.example.com'
    },
    {
      id: '2',
      name: 'Dr. John Wong',
      specialty: 'General Dentistry',
      type: 'Dental',
      address: '456 Dental Plaza, Austin, TX 78704',
      distance: '2.5 mi',
      phone: '(512) 555-2345',
      rating: 4.6,
      acceptingNewPatients: true,
      languages: ['English', 'Mandarin'],
      inNetwork: true,
      preventativeCare: true,
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      specialty: 'Ophthalmology',
      type: 'Vision',
      address: '789 Vision Center, Austin, TX 78705',
      distance: '3.1 mi',
      phone: '(512) 555-3456',
      rating: 4.7,
      acceptingNewPatients: false,
      languages: ['English'],
      inNetwork: true,
      preventativeCare: true,
      website: 'https://drjohnson.example.com'
    },
    {
      id: '4',
      name: 'Dr. Michael Rodriguez',
      specialty: 'Dermatology',
      type: 'Specialist',
      address: '234 Specialist Ave, Austin, TX 78703',
      distance: '1.8 mi',
      phone: '(512) 555-4567',
      rating: 4.5,
      acceptingNewPatients: true,
      languages: ['English', 'Spanish'],
      inNetwork: true,
      preventativeCare: true,
      email: 'rodriguez@medical.example.com'
    },
    {
      id: '5',
      name: 'Dr. Lisa Chen',
      specialty: 'Psychiatry',
      type: 'Mental Health',
      address: '567 Wellness Blvd, Austin, TX 78731',
      distance: '4.3 mi',
      phone: '(512) 555-5678',
      rating: 4.9,
      acceptingNewPatients: true,
      languages: ['English', 'Mandarin'],
      inNetwork: true,
      preventativeCare: false,
      website: 'https://drchen.example.com'
    },
    {
      id: '6',
      name: 'Dr. David Thompson',
      specialty: 'Internal Medicine',
      type: 'PCP',
      address: '890 Health Street, Austin, TX 78746',
      distance: '5.6 mi',
      phone: '(512) 555-6789',
      rating: 4.4,
      acceptingNewPatients: false,
      languages: ['English'],
      inNetwork: false,
      preventativeCare: true,
    }
  ];

  // Filter providers based on search query, specialty, and other filters
  const filteredProviders = providers.filter(provider => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by specialty
    const matchesSpecialty = selectedSpecialty === 'all' || provider.type === selectedSpecialty;
    
    // Filter by additional criteria
    const matchesInNetwork = !filters.inNetworkOnly || provider.inNetwork;
    const matchesNewPatients = !filters.acceptingNewPatients || provider.acceptingNewPatients;
    const matchesPreventativeCare = !filters.preventativeCare || provider.preventativeCare;
    
    return matchesSearch && matchesSpecialty && matchesInNetwork && matchesNewPatients && matchesPreventativeCare;
  });

  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName]
    });
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={12} fill="#FFAB00" color="#FFAB00" />);
      } else if (i === fullStars && hasHalfStar) {
        // In a real app, you would use a half-star icon
        stars.push(<Star key={i} size={12} fill="#FFAB00" color="#FFAB00" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<Star key={i} size={12} color="#DDD" />);
      }
    }
    
    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {stars}
        </View>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Provider Directory" showBackButton />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, specialty, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specialtiesContainer}
        contentContainerStyle={styles.specialtiesContent}
      >
        {specialties.map(specialty => (
          <TouchableOpacity
            key={specialty.id}
            style={[styles.specialtyChip, selectedSpecialty === specialty.id && styles.activeSpecialtyChip]}
            onPress={() => setSelectedSpecialty(specialty.id)}
          >
            <Text 
              style={[styles.specialtyChipText, selectedSpecialty === specialty.id && styles.activeSpecialtyChipText]}
            >
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.filtersButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Filter size={16} color="#4682B4" style={styles.filtersIcon} />
        <Text style={styles.filtersText}>Filters</Text>
        {showFilters ? (
          <ChevronDown size={16} color="#4682B4" />
        ) : (
          <ChevronRight size={16} color="#4682B4" />
        )}
      </TouchableOpacity>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={styles.filterOption}
            onPress={() => toggleFilter('inNetworkOnly')}
          >
            <View style={[
              styles.checkbox, 
              filters.inNetworkOnly && styles.checkedCheckbox
            ]}>
              {filters.inNetworkOnly && <CheckCircle size={16} color="#FFF" />}
            </View>
            <Text style={styles.filterOptionText}>In-network providers only</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterOption}
            onPress={() => toggleFilter('acceptingNewPatients')}
          >
            <View style={[
              styles.checkbox, 
              filters.acceptingNewPatients && styles.checkedCheckbox
            ]}>
              {filters.acceptingNewPatients && <CheckCircle size={16} color="#FFF" />}
            </View>
            <Text style={styles.filterOptionText}>Accepting new patients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterOption}
            onPress={() => toggleFilter('preventativeCare')}
          >
            <View style={[
              styles.checkbox, 
              filters.preventativeCare && styles.checkedCheckbox
            ]}>
              {filters.preventativeCare && <CheckCircle size={16} color="#FFF" />}
            </View>
            <Text style={styles.filterOptionText}>Offers preventative care services</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.content}>
        {filteredProviders.length > 0 ? (
          <>
            <Text style={styles.resultsText}>
              Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
            </Text>
            
            {filteredProviders.map(provider => (
              <TouchableOpacity key={provider.id} style={styles.providerCard}>
                <View style={styles.providerHeader}>
                  <View>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                    {renderRatingStars(provider.rating)}
                  </View>
                  
                  <View style={styles.badgeContainer}>
                    {provider.inNetwork && (
                      <View style={styles.inNetworkBadge}>
                        <Text style={styles.inNetworkText}>In-Network</Text>
                      </View>
                    )}
                    {provider.acceptingNewPatients && (
                      <View style={styles.newPatientsBadge}>
                        <Text style={styles.newPatientsText}>Accepting New</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.providerDetails}>
                  <View style={styles.detailRow}>
                    <MapPin size={16} color="#666" style={styles.detailIcon} />
                    <Text style={styles.detailText}>{provider.address}</Text>
                    <Text style={styles.distanceText}>{provider.distance}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Phone size={16} color="#666" style={styles.detailIcon} />
                    <Text style={styles.detailText}>{provider.phone}</Text>
                  </View>
                  
                  {provider.email && (
                    <View style={styles.detailRow}>
                      <Mail size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{provider.email}</Text>
                    </View>
                  )}
                  
                  {provider.website && (
                    <View style={styles.detailRow}>
                      <Globe size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{provider.website}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.providerFooter}>
                  <Text style={styles.languagesText}>
                    Languages: {provider.languages.join(', ')}
                  </Text>
                  
                  <TouchableOpacity style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>Schedule</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Search size={48} color="#DDD" />
            <Text style={styles.emptyStateTitle}>No Providers Found</Text>
            <Text style={styles.emptyStateText}>
              We couldn't find any providers matching your criteria. Try adjusting your filters or search terms.
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setFilters({
                  inNetworkOnly: true,
                  acceptingNewPatients: false,
                  preventativeCare: true,
                  radius: 10
                });
              }}
            >
              <Text style={styles.resetButtonText}>Reset Search</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.directoryNote}>
          <Heart size={16} color="#4682B4" style={styles.noteIcon} />
          <Text style={styles.noteText}>
            This directory is updated regularly. For the most current information, contact the provider directly or refer to your insurance provider's website.
          </Text>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="education"
        employee={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  specialtiesContainer: {
    maxHeight: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  specialtiesContent: {
    padding: 12,
    flexDirection: 'row',
  },
  specialtyChip: {
    backgroundColor: '#F5F7F9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeSpecialtyChip: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  specialtyChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeSpecialtyChipText: {
    color: '#FFF',
    fontWeight: '500',
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersIcon: {
    marginRight: 8,
  },
  filtersText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    flex: 1,
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4682B4',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#4682B4',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  providerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  providerSpecialty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  inNetworkBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  inNetworkText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  newPatientsBadge: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  newPatientsText: {
    fontSize: 10,
    color: '#4682B4',
    fontWeight: '500',
  },
  providerDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
    marginLeft: 8,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  languagesText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  scheduleButton: {
    backgroundColor: '#4682B4',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  scheduleButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  directoryNote: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C9DEF0',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#4682B4',
    lineHeight: 18,
  },
});