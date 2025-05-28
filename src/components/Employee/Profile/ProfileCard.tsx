import { Calendar, Edit, Mail, MapPin, Phone, Shield, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  lastUpdated: string;
}

interface ProfileCardProps {
  profile: UserProfile;
  onEdit?: () => void;
  onPrivacySettings?: () => void;
  completionPercentage?: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEdit,
  onPrivacySettings,
  completionPercentage = 85
}) => {
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return '#10B981';
    if (percentage >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={32} color="#FFFFFF" />
          </View>
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.email}>{profile.email}</Text>
          
          <View style={styles.completionContainer}>
            <Text style={styles.completionLabel}>Profile Completion</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${completionPercentage}%`,
                      backgroundColor: getCompletionColor(completionPercentage)
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.completionPercentage, { color: getCompletionColor(completionPercentage) }]}>
                {completionPercentage}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Edit size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}
          
          {onPrivacySettings && (
            <TouchableOpacity style={styles.actionButton} onPress={onPrivacySettings}>
              <Shield size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6B7280" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <Text style={styles.detailValue}>
                {formatDate(profile.dateOfBirth)} (Age {calculateAge(profile.dateOfBirth)})
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <User size={16} color="#6B7280" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>
                {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).replace('-', ' ')}
              </Text>
            </View>
          </View>

          {profile.phone && (
            <View style={styles.detailRow}>
              <Phone size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{profile.phone}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Mail size={16} color="#6B7280" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{profile.email}</Text>
            </View>
          </View>
        </View>

        {profile.address && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Address</Text>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailValue}>
                  {profile.address.street}{'\n'}
                  {profile.address.city}, {profile.address.state} {profile.address.zipCode}
                </Text>
              </View>
            </View>
          </View>
        )}

        {profile.emergencyContact && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.detailRow}>
              <User size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  {profile.emergencyContact.name} ({profile.emergencyContact.relationship})
                </Text>
                <Text style={styles.detailValue}>{profile.emergencyContact.phone}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.lastUpdated}>
            Last updated: {formatDate(profile.lastUpdated)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  completionContainer: {
    marginTop: 8,
  },
  completionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  completionPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  details: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});