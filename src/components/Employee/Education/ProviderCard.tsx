import { Award, Calendar, Clock, Globe, MapPin, Navigation, Phone, Star } from 'lucide-react-native';
import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  distance: number;
  isInNetwork: boolean;
  acceptingNewPatients: boolean;
  languages: string[];
  hours: {
    [key: string]: string;
  };
  certifications: string[];
  imageUrl?: string;
}

interface ProviderCardProps {
  provider: Provider;
  onPress?: (provider: Provider) => void;
  onScheduleAppointment?: (providerId: string) => void;
  showDistance?: boolean;
  compact?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onPress,
  onScheduleAppointment,
  showDistance = true,
  compact = false
}) => {
  const handlePhonePress = () => {
    Alert.alert(
      'Call Provider',
      `Call ${provider.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${provider.phone}`)
        }
      ]
    );
  };

  const handleDirectionsPress = () => {
    const address = `${provider.address.street}, ${provider.address.city}, ${provider.address.state} ${provider.address.zipCode}`;
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleWebsitePress = () => {
    if (provider.website) {
      Linking.openURL(provider.website);
    }
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(provider.rating);
    const hasHalfStar = provider.rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" style={{ opacity: 0.5 }} />
        );
      } else {
        stars.push(
          <Star key={i} size={12} color="#E5E7EB" />
        );
      }
    }

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{stars}</View>
        <Text style={styles.ratingText}>
          {provider.rating.toFixed(1)} ({provider.reviewCount})
        </Text>
      </View>
    );
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)} mi`;
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => onPress?.(provider)}
        activeOpacity={0.7}
      >
        <View style={styles.compactHeader}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactName} numberOfLines={1}>
              {provider.name}
            </Text>
            <Text style={styles.compactSpecialty}>{provider.specialty}</Text>
          </View>
          
          <View style={styles.compactBadges}>
            {provider.isInNetwork && (
              <View style={styles.networkBadge}>
                <Text style={styles.networkBadgeText}>In-Network</Text>
              </View>
            )}
            {showDistance && (
              <Text style={styles.compactDistance}>
                {formatDistance(provider.distance)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.compactFooter}>
          {renderRating()}
          <TouchableOpacity
            style={styles.compactScheduleButton}
            onPress={() => onScheduleAppointment?.(provider.id)}
          >
            <Calendar size={14} color="#3B82F6" />
            <Text style={styles.compactScheduleText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(provider)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.providerInfo}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.specialty}>{provider.specialty}</Text>
          
          <View style={styles.badges}>
            {provider.isInNetwork && (
              <View style={styles.networkBadge}>
                <Text style={styles.networkBadgeText}>In-Network</Text>
              </View>
            )}
            
            {provider.acceptingNewPatients && (
              <View style={styles.acceptingBadge}>
                <Text style={styles.acceptingBadgeText}>Accepting New Patients</Text>
              </View>
            )}
          </View>
        </View>

        {showDistance && (
          <View style={styles.distanceContainer}>
            <Navigation size={16} color="#6B7280" />
            <Text style={styles.distance}>{formatDistance(provider.distance)}</Text>
          </View>
        )}
      </View>

      {/* Rating and Reviews */}
      <View style={styles.ratingSection}>
        {renderRating()}
        
        {provider.certifications.length > 0 && (
          <View style={styles.certifications}>
            <Award size={14} color="#8B5CF6" />
            <Text style={styles.certificationsText}>
              {provider.certifications.length} certification{provider.certifications.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Address */}
      <View style={styles.addressSection}>
        <MapPin size={16} color="#6B7280" />
        <View style={styles.addressText}>
          <Text style={styles.addressLine}>
            {provider.address.street}
          </Text>
          <Text style={styles.addressLine}>
            {provider.address.city}, {provider.address.state} {provider.address.zipCode}
          </Text>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.contactSection}>
        <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
          <Phone size={16} color="#3B82F6" />
          <Text style={styles.contactText}>{provider.phone}</Text>
        </TouchableOpacity>

        {provider.website && (
          <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
            <Globe size={16} color="#3B82F6" />
            <Text style={styles.contactText}>Visit Website</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Languages */}
      {provider.languages.length > 0 && (
        <View style={styles.languagesSection}>
          <Text style={styles.languagesLabel}>Languages:</Text>
          <Text style={styles.languagesText}>
            {provider.languages.join(', ')}
          </Text>
        </View>
      )}

      {/* Hours */}
      <View style={styles.hoursSection}>
        <View style={styles.hoursHeader}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.hoursLabel}>Hours</Text>
        </View>
        
        <View style={styles.todaysHours}>
          <Text style={styles.todayLabel}>Today:</Text>
          <Text style={styles.todayHours}>
            {provider.hours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()] || 'Closed'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleDirectionsPress}
        >
          <Navigation size={16} color="#6B7280" />
          <Text style={styles.directionsText}>Directions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => onScheduleAppointment?.(provider.id)}
        >
          <Calendar size={16} color="#FFFFFF" />
          <Text style={styles.scheduleText}>Schedule Appointment</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  networkBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkBadgeText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '600',
  },
  acceptingBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  acceptingBadgeText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '600',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  certifications: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificationsText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  addressText: {
    flex: 1,
  },
  addressLine: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  contactSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  languagesSection: {
    marginBottom: 12,
  },
  languagesLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  languagesText: {
    fontSize: 14,
    color: '#374151',
  },
  hoursSection: {
    marginBottom: 16,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hoursLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  todaysHours: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  todayHours: {
    fontSize: 14,
    color: '#374151',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  directionsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  scheduleButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    gap: 6,
  },
  scheduleText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  compactSpecialty: {
    fontSize: 12,
    color: '#6B7280',
  },
  compactBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  compactDistance: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 6,
    gap: 4,
  },
  compactScheduleText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});