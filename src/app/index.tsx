import { useRouter } from 'expo-router';
import { ArrowRight, Award, Building, Heart, Shield, TrendingUp, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'employee' | 'employer' | null>(null);

  const features = [
    {
      icon: Heart,
      title: 'Preventative Health Tracking',
      description: 'Track and schedule all your preventative care appointments'
    },
    {
      icon: TrendingUp,
      title: 'Health Score Analytics',
      description: 'Monitor your health improvements with AI-powered insights'
    },
    {
      icon: Award,
      title: 'Rewards & Incentives',
      description: 'Earn points and rewards for maintaining healthy habits'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your health data is encrypted and HIPAA compliant'
    }
  ];

  const handleGetStarted = () => {
    if (selectedRole === 'employee') {
      router.push('/auth/login?role=employee');
    } else if (selectedRole === 'employer') {
      router.push('/auth/login?role=employer');
    }
  };

  const handleRoleSelection = (role: 'employee' | 'employer') => {
    setSelectedRole(role);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Heart size={32} color="#fff" />
          </View>
          <Text style={styles.logoText}>BenefitMetrics</Text>
        </View>
        
        <Text style={styles.heroTitle}>
          Take Control of Your{'\n'}Preventative Healthcare
        </Text>
        
        <Text style={styles.heroSubtitle}>
          The smart way to stay healthy, save money, and maximize your benefits
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$460K</Text>
            <Text style={styles.statLabel}>Annual Savings</Text>
            <Text style={styles.statDetail}>per 100 employees</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>78%</Text>
            <Text style={styles.statLabel}>Health Score</Text>
            <Text style={styles.statDetail}>average improvement</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>User Satisfaction</Text>
            <Text style={styles.statDetail}>rating</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Everything You Need for Better Health</Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <IconComponent size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Role Selection Section */}
      <View style={styles.roleSection}>
        <Text style={styles.sectionTitle}>Choose Your Experience</Text>
        <Text style={styles.roleSubtitle}>
          Select the option that best describes you
        </Text>

        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'employee' && styles.selectedRoleCard
            ]}
            onPress={() => handleRoleSelection('employee')}
          >
            <View style={styles.roleIconContainer}>
              <Users size={32} color={selectedRole === 'employee' ? '#fff' : '#8b5cf6'} />
            </View>
            <Text style={[
              styles.roleTitle,
              selectedRole === 'employee' && styles.selectedRoleTitle
            ]}>
              I'm an Employee
            </Text>
            <Text style={[
              styles.roleDescription,
              selectedRole === 'employee' && styles.selectedRoleDescription
            ]}>
              Track your health, earn rewards, and maximize your benefits
            </Text>
            
            <View style={styles.roleFeatures}>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employee' && styles.selectedRoleFeature
              ]}>
                • Personal health dashboard
              </Text>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employee' && styles.selectedRoleFeature
              ]}>
                • Appointment scheduling
              </Text>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employee' && styles.selectedRoleFeature
              ]}>
                • Rewards & challenges
              </Text>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employee' && styles.selectedRoleFeature
              ]}>
                • Benefits optimization
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'employer' && styles.selectedRoleCard
            ]}
            onPress={() => handleRoleSelection('employer')}
          >
            <View style={styles.roleIconContainer}>
              <Building size={32} color={selectedRole === 'employer' ? '#fff' : '#8b5cf6'} />
            </View>
            <Text style={[
              styles.roleTitle,
              selectedRole === 'employer' && styles.selectedRoleTitle
            ]}>
              I'm an Employer/HR
            </Text>
            <Text style={[
              styles.roleDescription,
              selectedRole === 'employer' && styles.selectedRoleDescription
            ]}>
              Manage programs, analyze data, and reduce healthcare costs
            </Text>
            
            <View style={styles.roleFeatures}>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employer' && styles.selectedRoleFeature
              ]}>
                • Analytics dashboard
              </Text>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employer' && styles.selectedRoleFeature
              ]}>
                • Program management
              </Text>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employer' && styles.selectedRoleFeature
              ]}>
                • ROI reporting
              </Text>
              <Text style={[
                styles.roleFeature,
                selectedRole === 'employer' && styles.selectedRoleFeature
              ]}>
                • Benefits optimization
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            !selectedRole && styles.disabledCtaButton
          ]}
          onPress={handleGetStarted}
          disabled={!selectedRole}
        >
          <Text style={[
            styles.ctaButtonText,
            !selectedRole && styles.disabledCtaButtonText
          ]}>
            Get Started
          </Text>
          <ArrowRight size={20} color={!selectedRole ? '#9ca3af' : '#fff'} />
        </TouchableOpacity>

        <Text style={styles.ctaSubtext}>
          {selectedRole 
            ? `Continue as ${selectedRole === 'employee' ? 'an Employee' : 'an Employer'}`
            : 'Please select your role to continue'
          }
        </Text>
      </View>

      {/* Trust Section */}
      <View style={styles.trustSection}>
        <Text style={styles.trustTitle}>Trusted by Leading Organizations</Text>
        <View style={styles.trustLogos}>
          <View style={styles.trustLogo}>
            <Text style={styles.trustLogoText}>ACME Corp</Text>
          </View>
          <View style={styles.trustLogo}>
            <Text style={styles.trustLogoText}>TechStart Inc</Text>
          </View>
          <View style={styles.trustLogo}>
            <Text style={styles.trustLogoText}>Global Health</Text>
          </View>
        </View>

        <View style={styles.securityBadges}>
          <View style={styles.securityBadge}>
            <Shield size={16} color="#10b981" />
            <Text style={styles.securityBadgeText}>HIPAA Compliant</Text>
          </View>
          <View style={styles.securityBadge}>
            <Shield size={16} color="#10b981" />
            <Text style={styles.securityBadgeText}>SOC 2 Certified</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 BenefitMetrics. All rights reserved.
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  heroSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  statDetail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  roleSection: {
    padding: 24,
    backgroundColor: '#fff',
  },
  roleSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  roleOptions: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedRoleCard: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  roleIconContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  selectedRoleTitle: {
    color: '#fff',
  },
  roleDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  selectedRoleDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  roleFeatures: {
    gap: 6,
  },
  roleFeature: {
    fontSize: 14,
    color: '#374151',
  },
  selectedRoleFeature: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  ctaSection: {
    padding: 24,
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  disabledCtaButton: {
    backgroundColor: '#e5e7eb',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  disabledCtaButtonText: {
    color: '#9ca3af',
  },
  ctaSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  trustSection: {
    padding: 24,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
  },
  trustLogos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  trustLogo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  trustLogoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  securityBadges: {
    flexDirection: 'row',
    gap: 16,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  securityBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  footerLink: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500',
  },
});