
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, Edit, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../../../../components/Common/ui/Button';
import { useFamilyMembers } from '../../../../../hooks/employee/useFamilyMembers';
interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  healthPlan?: string;
}
interface PreventativeCareItem {
  id: string;
  name: string;
  status: 'completed' | 'overdue' | 'upcoming' | 'scheduled';
  lastCompleted?: string;
  nextDue?: string;
}
export default function FamilyMemberDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { params } = route;
  const memberId = params?.id;
  
  const { getFamilyMember, isLoading } = useFamilyMembers();
  
  // Mock data - replace with actual data from hook
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);
  const [preventativeCare, setPreventativeCare] = useState<PreventativeCareItem[]>([
    {
      id: '1',
      name: 'Annual Physical',
      status: 'completed',
      lastCompleted: 'March 2024',
      nextDue: 'March 2025'
    },
    {
      id: '2',
      name: 'Dental Checkup',
      status: 'overdue',
      lastCompleted: 'January 2024',
      nextDue: 'July 2024'
    },
    {
      id: '3',
      name: 'Eye Exam',
      status: 'upcoming',
      nextDue: 'June 2025'
    },
    {
      id: '4',
      name: 'Mammogram',
      status: 'scheduled',
      nextDue: 'May 28, 2025'
    }
  ]);
  
  useEffect(() => {
    if (memberId) {
      // Simulate loading member data
      setTimeout(() => {
        setCurrentMember({
          id: memberId,
          firstName: 'Sarah',
          lastName: 'Johnson',
          relationship: 'spouse',
          dateOfBirth: '1985-03-15',
          gender: 'female',
          healthPlan: 'Premium Health Plus'
        });
      }, 1000);
    }
  }, [memberId]);
  
  const handleViewAppointments = () => {
    navigation.navigate(`employee/settings/family/${memberId}/appointments` as never);
  };
  
  const handleEditDetails = () => {
    navigation.navigate(`employee/settings/family/${memberId}/edit` as never);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'overdue':
        return '#EF4444';
      case 'upcoming':
        return '#F59E0B';
      case 'scheduled':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      case 'upcoming':
        return 'Coming Up';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
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
  
  if (isLoading || !currentMember) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.loadingText}>
          {isLoading ? 'Loading family member details...' : 'Family member not found'}
        </Text>
        {!isLoading && (
          <View style={styles.errorButtonContainer}>
            <Button 
              label="Go Back" 
              variant="outline"
              onPress={() => navigation.goBack()}
            />
          </View>
        )}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{currentMember.firstName}'s Health</Text>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#4682B4" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.memberName}>
                {currentMember.firstName} {currentMember.lastName}
              </Text>
              <Text style={styles.memberDetails}>
                {currentMember.relationship.charAt(0).toUpperCase() + currentMember.relationship.slice(1)} • Age {calculateAge(currentMember.dateOfBirth)}
              </Text>
              <Text style={styles.memberDetails}>
                {currentMember.gender.charAt(0).toUpperCase() + currentMember.gender.slice(1)}
              </Text>
              {currentMember.healthPlan && (
                <Text style={styles.healthPlan}>
                  Plan: {currentMember.healthPlan}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Preventative Care Status */}
        <View style={styles.careStatusCard}>
          <Text style={styles.careStatusTitle}>Preventative Care Status</Text>
          
          <View style={styles.careItemsContainer}>
            {preventativeCare.map((item) => (
              <View key={item.id} style={styles.careItem}>
                <View style={styles.careItemContent}>
                  <Text style={styles.careItemName}>{item.name}</Text>
                  {item.lastCompleted && (
                    <Text style={styles.careItemDate}>
                      Last: {item.lastCompleted}
                    </Text>
                  )}
                  {item.nextDue && (
                    <Text style={styles.careItemDate}>
                      Next: {item.nextDue}
                    </Text>
                  )}
                </View>
                <Text style={[styles.careItemStatus, { color: getStatusColor(item.status) }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button 
            label="View Appointments" 
            variant="primary"
            onPress={handleViewAppointments}
            icon={<Calendar size={20} color="#FFFFFF" />}
          />
          
          <Button 
            label="Edit Details" 
            variant="outline"
            onPress={handleEditDetails}
            icon={<Edit size={20} color="#4682B4" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  errorButtonContainer: {
    marginTop: 24,
    width: '100%',
    maxWidth: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F0F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  healthPlan: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginTop: 4,
  },
  careStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  careStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  careItemsContainer: {
    gap: 12,
  },
  careItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  careItemContent: {
    flex: 1,
    marginRight: 16,
  },
  careItemName: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  careItemDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 1,
  },
  careItemStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    gap: 12,
    marginBottom: 32,
  },
});
