import { ArrowRight, Building2, UserCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Hooks
import { useOnboarding, UserRole } from '../../context/OnboardingContext';

// Components
import { Button } from '../../components/Common/ui/Button';

const RoleSelectionScreen = () => {
  const { updateOnboardingData, moveToNextStep } = useOnboarding();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  // Handle continue button press
  const handleContinue = async () => {
    if (selectedRole) {
      // Update onboarding data with selected role
      updateOnboardingData({ role: selectedRole });
      
      // Move to the next step
      await moveToNextStep();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to BenefitMetrics</Text>
        <Text style={styles.subtitle}>
          Let's get started by selecting your role
        </Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.roleOption,
            selectedRole === UserRole.EMPLOYEE && styles.selectedRole
          ]}
          onPress={() => handleRoleSelect(UserRole.EMPLOYEE)}
          testID="employee-role-option"
        >
          <View style={[
            styles.iconContainer,
            selectedRole === UserRole.EMPLOYEE && styles.selectedIconContainer
          ]}>
            <UserCircle 
              size={40} 
              color={selectedRole === UserRole.EMPLOYEE ? '#FFFFFF' : '#3B82F6'} 
            />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>Employee</Text>
            <Text style={styles.roleDescription}>
              Track your preventative care and maximize your benefits
            </Text>
          </View>
          {selectedRole === UserRole.EMPLOYEE && (
            <View style={styles.checkContainer}>
              <View style={styles.checkCircle} />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.roleOption,
            selectedRole === UserRole.EMPLOYER && styles.selectedRole
          ]}
          onPress={() => handleRoleSelect(UserRole.EMPLOYER)}
          testID="employer-role-option"
        >
          <View style={[
            styles.iconContainer,
            selectedRole === UserRole.EMPLOYER && styles.selectedIconContainer
          ]}>
            <Building2 
              size={40} 
              color={selectedRole === UserRole.EMPLOYER ? '#FFFFFF' : '#3B82F6'} 
            />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>Employer / HR</Text>
            <Text style={styles.roleDescription}>
              Manage company benefits and improve employee wellness
            </Text>
          </View>
          {selectedRole === UserRole.EMPLOYER && (
            <View style={styles.checkContainer}>
              <View style={styles.checkCircle} />
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Button
          onPress={handleContinue}
          disabled={!selectedRole}
          style={styles.continueButton}
          rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
          testID="continue-button"
        >
          Continue
        </Button>
        
        <Text style={styles.footerText}>
          By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedRole: {
    borderColor: '#3B82F6',
    backgroundColor: '#F0F7FF',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: '#3B82F6',
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  footer: {
    marginTop: 40,
  },
  continueButton: {
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  link: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default RoleSelectionScreen;