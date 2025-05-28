import { Link } from 'expo-router';
import { ChevronRight, Edit2, FileText, Heart, Shield, User, Users } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../../components/Common/layout/Footer';
import Header from '../../../../components/Common/layout/Header';
import { useAuth } from '../../../../hooks/Common/useAuth';
import { useProfile } from '../../../../hooks/employee/useProfile';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profileCompletionPercentage } = useProfile();
  
  return (
    <View style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <User size={40} color="#4682B4" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit2 size={16} color="#4682B4" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <Text style={styles.completionPercentage}>{profileCompletionPercentage}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${profileCompletionPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.completionText}>
            Complete your health profile to get personalized recommendations and maximize your benefits.
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Link href="/employee/settings/profile/health-info" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <FileText size={18} color="#4682B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Health Information</Text>
              <Text style={styles.menuDescription}>Medical history, conditions, and allergies</Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </Link>
        
        <Link href="/employee/settings/profile/family-history" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Heart size={18} color="#4682B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Family Health History</Text>
              <Text style={styles.menuDescription}>Health conditions in your family</Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </Link>
        
        <Link href="/employee/settings/profile/medications" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <FileText size={18} color="#4682B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Medications</Text>
              <Text style={styles.menuDescription}>Current prescriptions and supplements</Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </Link>
        
        <Link href="/employee/settings/family" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Users size={18} color="#4682B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Family Members</Text>
              <Text style={styles.menuDescription}>Manage health records for your family</Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </Link>
        
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <Link href="/employee/settings/profile/privacy" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Shield size={18} color="#4682B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Privacy Settings</Text>
              <Text style={styles.menuDescription}>Manage data sharing and privacy preferences</Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </Link>
        
        <Link href="/employee/settings" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <FileText size={18} color="#4682B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Account Settings</Text>
              <Text style={styles.menuDescription}>Update your account details</Text>
            </View>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        </Link>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Your health information is private and securely stored in accordance with HIPAA requirements.
          </Text>
          <Link href="/employee/settings/profile/privacy" style={styles.learnMoreLink}>
            <Text style={styles.learnMoreText}>Learn More</Text>
          </Link>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="profile"
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F0F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  completionPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4682B4',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4682B4',
    borderRadius: 4,
  },
  completionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
  },
  footerContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  learnMoreLink: {
    alignSelf: 'center',
  },
  learnMoreText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
});