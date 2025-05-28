import { useRouter } from 'expo-router';
import { Plus, UserCircle } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FamilyDashboard } from '../../../../components/Employee/Family/FamilyDashboard';
import { FamilyMemberCard } from '../../../../components/Employee/Family/FamilyMemberCard';
import { useFamilyMembers } from '../../../../hooks/employee/useFamilyMembers';

export default function FamilyOverview() {
  const router = useRouter();
  const familyHook = useFamilyMembers();
  
  // Provide fallback data if hook returns undefined or is loading
  const familyMembers = familyHook?.familyMembers || [];
  const isLoading = familyHook?.isLoading || false;
  
  const handleAddMember = () => {
    router.push('/employee/settings/family/add-member');
  };
  
  const handleMemberPress = (memberId: string) => {
    router.push(`/employee/settings/family/${memberId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Family Health</Text>
          <TouchableOpacity
            onPress={handleAddMember}
            style={styles.addButton}
          >
            <Plus size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>
        
        <FamilyDashboard />
        
        <Text style={styles.sectionTitle}>Family Members</Text>
        
        {isLoading ? (
          <Text style={styles.loadingText}>Loading family members...</Text>
        ) : familyMembers.length > 0 ? (
          <View style={styles.familyList}>
            {familyMembers.map(member => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onPress={() => handleMemberPress(member.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <UserCircle size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No Family Members Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Add family members to manage their preventative care and appointments.
            </Text>
            <TouchableOpacity
              onPress={handleAddMember}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Add Family Member</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  familyList: {
    gap: 16,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});